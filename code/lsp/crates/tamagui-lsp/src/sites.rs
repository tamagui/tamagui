// Finding style value sites in a TSX document.
//
// SCOPE, stated plainly: this is a lexical scanner over JSX attributes and
// `styled()` object literals, not a parser. It is deliberately the first
// version. The intended end state is `oxc_parser`, so the server and oxlint
// agree on what parses by construction rather than by convention (see
// `plans/v3-lsp-rust.md`). What is here is enough to drive completion, hover,
// colours and diagnostics on real files, and it is structured so the extractor
// can be swapped without touching any feature code.
//
// It errs toward MISSING a site rather than inventing one: a false site would
// put a squiggle under ordinary TypeScript, which is far worse than a missing
// completion.

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

/// Every `name="value"` and `name: 'value'` in the document.
///
/// Callers filter by the config's style-prop set; this returns candidates so
/// the prop vocabulary stays owned by the config rather than by the scanner.
pub fn all_candidates(text: &str) -> Vec<Site> {
    let bytes = text.as_bytes();
    let mut out = Vec::new();
    let mut i = 0;

    while i < bytes.len() {
        match bytes[i] {
            // skip over strings we are not inspecting as attribute values, and
            // over comments, so their contents can never look like an attribute
            b'/' if i + 1 < bytes.len() && bytes[i + 1] == b'/' => {
                while i < bytes.len() && bytes[i] != b'\n' {
                    i += 1;
                }
            }
            b'/' if i + 1 < bytes.len() && bytes[i + 1] == b'*' => {
                i += 2;
                while i + 1 < bytes.len() && !(bytes[i] == b'*' && bytes[i + 1] == b'/') {
                    i += 1;
                }
                i = (i + 2).min(bytes.len());
            }
            // template literals can contain anything, including `="..."`
            b'`' => {
                i += 1;
                while i < bytes.len() && bytes[i] != b'`' {
                    if bytes[i] == b'\\' {
                        i += 1;
                    }
                    i += 1;
                }
                i += 1;
            }
            c if is_ident_start(c) => {
                let name_start = i;
                while i < bytes.len() && is_ident_part(bytes[i]) {
                    i += 1;
                }
                let name_end = i;

                let mut j = i;
                // a JSX attribute is written `bg="x"` with no space before the
                // `=`. requiring that is what separates it from a variable
                // assignment (`const x = "background"`), which is otherwise the
                // identical shape. an object property (`bg: 'x'`) may be spaced.
                let spaced = j < bytes.len() && (bytes[j] as char).is_ascii_whitespace();
                while j < bytes.len() && (bytes[j] as char).is_ascii_whitespace() {
                    j += 1;
                }
                if j >= bytes.len() || (bytes[j] != b'=' && bytes[j] != b':') {
                    continue;
                }
                if bytes[j] == b'=' && spaced {
                    continue;
                }
                // `==`, `=>` and `::` are not assignments to a string
                if bytes[j] == b'=' && j + 1 < bytes.len() && matches!(bytes[j + 1], b'=' | b'>') {
                    continue;
                }
                // a binding keyword before the name means this is a declaration,
                // not a prop, even when written without spaces (`let x="y"`)
                if preceded_by_binding_keyword(text, name_start) {
                    continue;
                }
                j += 1;

                // an optional `{` for the `prop={"value"}` form
                let mut braced = false;
                while j < bytes.len() && (bytes[j] as char).is_ascii_whitespace() {
                    j += 1;
                }
                if j < bytes.len() && bytes[j] == b'{' {
                    braced = true;
                    j += 1;
                    while j < bytes.len() && (bytes[j] as char).is_ascii_whitespace() {
                        j += 1;
                    }
                }

                if j >= bytes.len() || (bytes[j] != b'"' && bytes[j] != b'\'') {
                    continue;
                }
                let quote = bytes[j];
                let value_start = j + 1;
                let mut k = value_start;
                let mut escaped = false;
                while k < bytes.len() && bytes[k] != quote {
                    if bytes[k] == b'\\' {
                        escaped = true;
                        k += 1;
                    }
                    k += 1;
                }
                if k >= bytes.len() {
                    continue;
                }
                // an escaped value's byte offsets stop matching the decoded
                // string, so it is skipped rather than reported at wrong spans
                if escaped {
                    i = k + 1;
                    continue;
                }
                // a braced form must actually close
                if braced {
                    let mut m = k + 1;
                    while m < bytes.len() && (bytes[m] as char).is_ascii_whitespace() {
                        m += 1;
                    }
                    if m >= bytes.len() || bytes[m] != b'}' {
                        i = k + 1;
                        continue;
                    }
                }

                out.push(Site {
                    prop: text[name_start..name_end].to_string(),
                    value: text[value_start..k].to_string(),
                    value_start,
                });
                i = k + 1;
            }
            b'"' | b'\'' => {
                // a bare string that was not an attribute value: skip it whole
                let quote = bytes[i];
                i += 1;
                while i < bytes.len() && bytes[i] != quote {
                    if bytes[i] == b'\\' {
                        i += 1;
                    }
                    i += 1;
                }
                i += 1;
            }
            _ => i += 1,
        }
    }
    out
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
    all(text, style_props).into_iter().find(|s| {
        offset >= s.value_start && offset <= s.value_start + s.value.len()
    })
}

/// is the identifier starting at `at` immediately preceded by `const`/`let`/`var`?
fn preceded_by_binding_keyword(text: &str, at: usize) -> bool {
    let head = text[..at].trim_end();
    for keyword in ["const", "let", "var"] {
        if let Some(before) = head.strip_suffix(keyword) {
            // the keyword must be a whole word, not the tail of an identifier
            let boundary = before
                .chars()
                .next_back()
                .is_none_or(|c| !c.is_alphanumeric() && c != '_' && c != '$');
            // and it must actually have been separated from the name
            if boundary && head.len() < at {
                return true;
            }
        }
    }
    false
}

fn is_ident_start(c: u8) -> bool {
    c.is_ascii_alphabetic() || c == b'_' || c == b'$'
}

fn is_ident_part(c: u8) -> bool {
    c.is_ascii_alphanumeric() || c == b'_' || c == b'$' || c == b'-'
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
        // `constant` ends with `const`; the boundary check must not eat it
        assert_eq!(
            props(r#"<View constant:"4" />"#),
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
