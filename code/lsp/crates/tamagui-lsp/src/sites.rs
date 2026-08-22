// Finding style value sites in a TSX document.
//
// This parses with tree-sitter, and the reason is measured rather than
// stylistic. The obvious choice was `oxc_parser`, the engine oxlint runs on, so
// that the server and the lint rule would agree by construction. It cannot do
// this job: oxc has no error recovery, and on a parse error it returns an EMPTY
// program rather than a partial one. Replaying a realistic edit (typing one new
// component into a file that already had two style props) one keystroke at a
// time, 73 of 84 intermediate states produced no AST at all, and 59 of 84 even
// after modelling the editor's auto-closing of brackets and quotes. Every
// colour swatch and every completion in the ALREADY-VALID part of the file
// would blink out on most keystrokes. The same replay through tree-sitter loses
// the earlier sites in 0 of 84 states.
//
// That is the whole argument: a file being typed into is invalid most of the
// time, so error tolerance is the requirement here, not a nicety.
//
// It errs toward MISSING a site rather than inventing one: a false site would
// put a squiggle under ordinary TypeScript, which is far worse than a missing
// completion.

use std::cell::RefCell;
use std::sync::OnceLock;

use streaming_iterator::StreamingIterator;
use tree_sitter::{Node, Query, QueryCursor};

/// one authored style value found in a document
#[derive(Clone, Debug, PartialEq, Eq)]
pub struct Site {
    /// the prop that owns it, e.g. `bg`
    pub prop: String,
    /// the string contents, without its quotes
    pub value: String,
    /// byte offset of the first character INSIDE the quotes
    pub value_start: usize,
}

thread_local! {
    /// reused across calls: constructing a parser and loading the language is
    /// far more expensive than the parse itself
    static PARSER: RefCell<tree_sitter::Parser> = RefCell::new({
        let mut parser = tree_sitter::Parser::new();
        parser
            .set_language(&tree_sitter_typescript::LANGUAGE_TSX.into())
            .expect("the tsx grammar ships with the binary");
        parser
    });
}

/// The four shapes a style value is authored in. `(string)` is captured whole
/// rather than its `string_fragment`, because an EMPTY string has no fragment
/// child, and `bg=""` with the cursor between the quotes is the single most
/// important completion position there is.
const QUERY_SOURCE: &str = r#"
(jsx_attribute (property_identifier) @prop (string) @value)
(jsx_attribute (property_identifier) @prop (jsx_expression (string) @value))
(pair key: (property_identifier) @prop value: (string) @value)
(pair key: (string) @prop value: (string) @value)
"#;

fn query() -> &'static Query {
    static QUERY: OnceLock<Query> = OnceLock::new();
    QUERY.get_or_init(|| {
        Query::new(&tree_sitter_typescript::LANGUAGE_TSX.into(), QUERY_SOURCE)
            .expect("the site query is a constant and is tested")
    })
}

/// Every `name="value"` and `name: 'value'` in the document.
///
/// Callers filter by the config's style-prop set; this returns candidates so
/// the prop vocabulary stays owned by the config rather than by the scanner.
pub fn all_candidates(text: &str) -> Vec<Site> {
    let Some(tree) = PARSER.with(|p| p.borrow_mut().parse(text, None)) else {
        // only happens if the parser was cancelled or the timeout fired, and we
        // set neither
        return Vec::new();
    };

    let query = query();
    let mut cursor = QueryCursor::new();
    let mut out = Vec::new();
    let mut matches = cursor.matches(query, tree.root_node(), text.as_bytes());

    while let Some(m) = matches.next() {
        let mut prop_node = None;
        let mut value_node = None;
        for capture in m.captures {
            match query.capture_names()[capture.index as usize] {
                "prop" => prop_node = Some(capture.node),
                "value" => value_node = Some(capture.node),
                _ => {}
            }
        }
        let (Some(prop_node), Some(value_node)) = (prop_node, value_node) else {
            continue;
        };
        // a quoted key is still a style prop: { 'backgroundColor': '...' }
        let prop = match prop_node.kind() {
            "string" => match inner_range(prop_node, text) {
                Some(range) => &text[range],
                None => continue,
            },
            _ => &text[prop_node.byte_range()],
        };
        let Some(range) = inner_range(value_node, text) else {
            continue;
        };
        out.push(Site {
            prop: prop.to_string(),
            value: text[range.clone()].to_string(),
            value_start: range.start,
        });
    }

    // query matches arrive in pattern order, not source order
    out.sort_by_key(|s| s.value_start);
    out
}

/// The byte range INSIDE a `string` node's quotes.
///
/// Returns None for a value carrying an escape: the decoded string is shorter
/// than its source span, so every offset after the escape would be wrong, and
/// reporting a wrong span is worse than reporting nothing. Style values do not
/// contain escapes in practice.
fn inner_range(node: Node, text: &str) -> Option<std::ops::Range<usize>> {
    let range = node.byte_range();
    let bytes = text.as_bytes();
    let quote = *bytes.get(range.start)?;
    if quote != b'"' && quote != b'\'' {
        return None;
    }
    // while a string is being typed its closing quote does not exist yet, and
    // the node ends at the end of the text it covers
    let closed = range.end > range.start + 1 && bytes.get(range.end - 1) == Some(&quote);
    let end = if closed { range.end - 1 } else { range.end };
    if end < range.start + 1 {
        return None;
    }
    let inner = range.start + 1..end;
    if text.get(inner.clone())?.contains('\\') {
        return None;
    }
    Some(inner)
}

/// Candidates whose prop is a configured style prop.
pub fn all(text: &str, style_props: &rustc_hash::FxHashSet<Box<str>>) -> Vec<Site> {
    all_candidates(text)
        .into_iter()
        .filter(|s| style_props.contains(s.prop.as_str()))
        .collect()
}

/// The style site whose value contains `offset`, if any.
pub fn at(
    text: &str,
    offset: usize,
    style_props: &rustc_hash::FxHashSet<Box<str>>,
) -> Option<Site> {
    all(text, style_props)
        .into_iter()
        .find(|s| offset >= s.value_start && offset <= s.value_start + s.value.len())
}

#[cfg(test)]
mod tests {
    use super::*;

    fn props(text: &str) -> Vec<(String, String)> {
        all_candidates(text)
            .into_iter()
            .map(|s| (s.prop, s.value))
            .collect()
    }

    #[test]
    fn finds_jsx_attributes() {
        assert_eq!(
            props(r#"<View bg="background" p="4" />"#),
            vec![
                ("bg".into(), "background".into()),
                ("p".into(), "4".into())
            ]
        );
    }

    #[test]
    fn finds_styled_object_properties() {
        let source = r#"
            export const F = styled(View, {
              backgroundColor: 'background hover:background-hover',
              opacity: 'press:0.7',
            })
        "#;
        assert_eq!(
            props(source),
            vec![
                (
                    "backgroundColor".into(),
                    "background hover:background-hover".into()
                ),
                ("opacity".into(), "press:0.7".into()),
            ]
        );
    }

    #[test]
    fn finds_the_braced_jsx_form() {
        assert_eq!(props(r#"<View bg={"background"} />"#), vec![("bg".into(), "background".into())]);
    }

    #[test]
    fn reports_offsets_that_index_the_original_text() {
        let source = r#"<View bg="background" />"#;
        let site = &all_candidates(source)[0];
        assert_eq!(&source[site.value_start..site.value_start + site.value.len()], "background");
    }

    #[test]
    fn ignores_comments() {
        // a false site here would squiggle inside a comment
        assert!(props(r#"// bg="background""#).is_empty());
        assert!(props("/* bg=\"background\" */").is_empty());
    }

    #[test]
    fn ignores_template_literals() {
        assert!(props("const s = `bg=\"background\"`").is_empty());
    }

    #[test]
    fn does_not_mistake_comparisons_or_arrows_for_assignment() {
        assert!(props(r#"if (a == "x") {}"#).is_empty());
        assert!(props(r#"const f = a => "x""#).is_empty());
    }

    #[test]
    fn skips_escaped_values_rather_than_reporting_wrong_spans() {
        // the decoded string is shorter than its source span, so every offset
        // after the escape would be wrong. skipping is the honest answer.
        assert!(props(r#"<View bg="a\"b" />"#).is_empty());
    }

    #[test]
    fn a_bare_string_is_not_a_site() {
        // these are the shapes that most resemble an attribute without being
        // one; a false site here squiggles ordinary TypeScript
        assert!(props(r#"const x = "background""#).is_empty());
        assert!(props(r#"let x = "background""#).is_empty());
        assert!(props(r#"var x = "background""#).is_empty());
        assert!(props(r#"let x="background""#).is_empty());
        assert!(props(r#"foo("background")"#).is_empty());
        assert!(props(r#"x = "background""#).is_empty());
    }

    #[test]
    fn a_name_ending_in_a_keyword_is_still_a_site() {
        // `constant` ends with `const`. the lexical scanner needed a word
        // boundary check to avoid eating it; the parser cannot make the mistake
        // at all, since a declaration and an attribute are different nodes.
        assert_eq!(
            props(r#"<View constant="4" />"#),
            vec![("constant".into(), "4".into())]
        );
        assert_eq!(
            props(r#"styled(View, { constant: "4" })"#),
            vec![("constant".into(), "4".into())]
        );
    }

    #[test]
    fn handles_several_sites_across_lines() {
        let source = "<View\n  bg=\"background\"\n  p=\"4 sm:6\"\n/>";
        assert_eq!(
            props(source),
            vec![
                ("bg".into(), "background".into()),
                ("p".into(), "4 sm:6".into())
            ]
        );
    }
}

#[cfg(test)]
mod parser_tests {
    use super::*;

    fn props(text: &str) -> Vec<(String, String)> {
        all_candidates(text).into_iter().map(|s| (s.prop, s.value)).collect()
    }

    #[test]
    fn recovers_from_the_syntax_errors_an_editor_actually_sees() {
        // this is the common case, not the exotic one: a file is invalid for
        // most of the time someone is typing into it. if sites vanished on
        // every keystroke the completions would flicker out exactly when they
        // are wanted.
        let half_typed = r#"
            export function App() {
              return <View bg="background" p="
            }
        "#;
        assert!(
            props(half_typed).iter().any(|(prop, _)| prop == "bg"),
            "an unterminated string later in the file must not lose earlier sites"
        );

        // an unclosed brace, the other half of typing
        let unclosed = r#"const F = styled(View, { backgroundColor: "background","#;
        assert_eq!(
            props(unclosed),
            vec![("backgroundColor".into(), "background".into())]
        );
    }

    #[test]
    fn finds_attributes_the_lexer_could_not_reach() {
        // a multi-line attribute list, which is how real components are written
        let multiline = r#"
            <View
              bg="background"
              hoverStyle={{ backgroundColor: "background-hover" }}
            />
        "#;
        assert_eq!(
            props(multiline),
            vec![
                ("bg".into(), "background".into()),
                ("backgroundColor".into(), "background-hover".into()),
            ]
        );
    }

    #[test]
    fn finds_nested_and_quoted_keys() {
        let variants = r#"
            styled(View, {
              variants: {
                size: {
                  large: { 'backgroundColor': "background-strong" },
                },
              },
            })
        "#;
        assert_eq!(
            props(variants),
            vec![("backgroundColor".into(), "background-strong".into())]
        );
    }

    #[test]
    fn does_not_invent_sites_in_ordinary_typescript() {
        // every one of these contains a string next to a name, and none is a
        // style site. a squiggle in any of them would be worse than a missed
        // completion.
        assert!(props(r#"type T = { background: "literal" }"#).is_empty());
        assert!(props(r#"import { background } from "./theme""#).is_empty());
        assert!(props(r#"export * from "background""#).is_empty());
        assert!(props(r#"const m = new Map([["background", 1]])"#).is_empty());
        assert!(props(r#"if (x === "background") {}"#).is_empty());
        assert!(props(r#"function f(background = "x") {}"#).is_empty());
        // a computed key is not statically known
        assert!(props(r#"({ [key]: "background" })"#).is_empty());
        // JSX text is not an attribute
        assert!(props(r#"<View>bg="background"</View>"#).is_empty());
    }

    #[test]
    fn offsets_survive_multibyte_characters_earlier_in_the_file() {
        // oxc reports byte spans, and so does the rope; a char-based offset
        // would drift by one per emoji and land the completion in the wrong
        // place
        // the semicolon matters: `"…"` followed by `<` on the next line parses
        // as a less-than, not as JSX, so its absence would make this a test of
        // ASI rather than of offsets
        let source = "const label = \"🎨 palette\";\n<View bg=\"background\" />;";
        let site = all_candidates(source).into_iter().find(|s| s.prop == "bg").unwrap();
        assert_eq!(
            &source[site.value_start..site.value_start + site.value.len()],
            "background"
        );
    }
}

#[cfg(test)]
mod tolerance_tests {
    use super::*;

    fn props(text: &str) -> Vec<(String, String)> {
        all_candidates(text).into_iter().map(|s| (s.prop, s.value)).collect()
    }

    #[test]
    fn an_empty_value_is_a_site() {
        // `bg="` with the editor auto-closing the quote is THE completion
        // position. an empty string has no `string_fragment` child, so querying
        // for the fragment instead of the string would miss exactly the case
        // the feature exists to serve.
        assert_eq!(props(r#"<View bg="" />"#), vec![("bg".into(), String::new())]);
        let site = &all_candidates(r#"<View bg="" />"#)[0];
        assert_eq!(site.value_start, 10);

        // and the cursor between those quotes must resolve to that site
        let props_set: rustc_hash::FxHashSet<Box<str>> =
            [Box::from("bg")].into_iter().collect();
        assert!(at(r#"<View bg="" />"#, 10, &props_set).is_some());
    }

    #[test]
    fn keeps_valid_sites_while_the_rest_of_the_file_is_half_typed() {
        // the property tree-sitter was chosen for, as a regression test. under
        // oxc every one of these returned nothing at all.
        let existing = "export function Card() {\n  return <View bg=\"background\" p=\"4\" />\n}\n";
        let typed = "\nexport function Badge() {\n  return <View bg=\"accent\" rounded=\"$4\" />\n}\n";

        for n in 0..=typed.len() {
            if !typed.is_char_boundary(n) {
                continue;
            }
            let source = format!("{existing}{}", &typed[..n]);
            let found = props(&source);
            assert!(
                found.contains(&("bg".to_string(), "background".to_string()))
                    && found.contains(&("p".to_string(), "4".to_string())),
                "typing {n} chars lost the untouched sites above it: {found:?}"
            );
        }
    }

    #[test]
    fn an_unterminated_value_costs_only_itself() {
        // a string with no closing quote collapses its whole enclosing element
        // into one flat ERROR node, with no `jsx_attribute` and no `string` for
        // the query to match, so that one site is not reported. recovering it
        // would mean a second query against ERROR-node internals, which is
        // fragile, and an editor that auto-closes quotes produces `bg=""`
        // instead, which does work (see `an_empty_value_is_a_site`).
        assert!(props("<View bg=\"backgro").is_empty());

        // what must NOT happen is the rest of the file paying for it
        let source = "<View bg=\"background\" />;\n<Text color=\"colo";
        assert_eq!(
            props(source),
            vec![("bg".into(), "background".into())],
            "an unterminated value later in the file must not cost earlier sites"
        );
    }
}
