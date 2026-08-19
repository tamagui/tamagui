//! The flat value grammar: parse, complete, diagnose.
//!
//! This is the layer that turns a config snapshot plus an authored string into
//! the things an editor shows. It is deliberately free of any LSP or editor
//! types so the same engine backs the language server, the CLI checker and the
//! lint rule, the way `@tamagui/style-grammar` does on the TypeScript side.

use tamagui_config::ConfigSnapshot;

pub mod generated;
pub mod modifier;
pub mod value;
pub mod vocab;

pub use modifier::{
    canonical_modifier, ContainerModifier, GroupModifier, ModifierKind, ModifierLookup,
    ModifierRegistry,
};
pub use value::{words, word_at, Clause, FlatValue, Modifier, ParseErrorCode, Span};
pub use vocab::{Entry, EntryKind, Index, Vocabulary};

/// What the cursor is sitting in, which decides what may be offered.
#[derive(Clone, Copy, PartialEq, Eq, Debug)]
pub enum CursorContext {
    /// before any colon: a modifier name is being typed
    Modifier,
    /// after the last colon, or in a clause with no modifiers: a value
    Value,
}

/// A completion request resolved against the document.
#[derive(Clone, Debug)]
pub struct Completions<'a> {
    /// the span the accepted entry should replace. This is the CLAUSE segment,
    /// never the whole string: replacing the whole literal is exactly the
    /// failure that makes className completion useless (accepting an entry at
    /// `"flex-1 bg-c"` drops `flex-1`), and flat values avoid it because each
    /// clause is independently replaceable.
    pub replace: Span,
    pub context: CursorContext,
    pub entries: Vec<&'a Entry>,
}

/// Complete at `offset` within `value`.
///
/// `category` is the token category the owning prop draws from, so `bg` offers
/// colors and `p` offers spaces. `None` offers everything, which is the right
/// answer for a prop with no single category (`border` takes both a width and a
/// color) and for an artifact written before the compiler emitted the map.
pub fn complete<'a>(
    vocabulary: &'a Vocabulary,
    value: &str,
    offset: usize,
    category: Option<&str>,
) -> Completions<'a> {
    let parsed = value::parse(value);
    let offset = offset.min(value.len());

    // a category the config declares no tokens for cannot narrow anything, so
    // the whole vocabulary is the answer rather than an empty list
    let values = category
        .and_then(|c| vocabulary.category(c))
        .unwrap_or(&vocabulary.values);

    // a cursor inside one of the `modifier:` prefixes completes a modifier
    if let Some(modifier) = parsed.modifier_at(offset) {
        let typed = &value[modifier.span.start..offset];
        return Completions {
            replace: modifier.span,
            context: CursorContext::Modifier,
            entries: vocabulary.modifiers.starting_with(typed),
        };
    }

    // otherwise the cursor is in a value, and the unit it replaces is the WORD
    // it sits in rather than the whole payload: `hover:1px solid re|` has three
    // components and accepting an entry may only touch the third
    let word = value::word_at(value, offset);
    let typed = &value[word.start..offset.max(word.start)];
    Completions {
        replace: word,
        context: CursorContext::Value,
        entries: values.starting_with(typed),
    }
}

/// A problem found in an authored value.
#[derive(Clone, Debug, PartialEq, Eq)]
pub struct Diagnostic {
    pub span: Span,
    pub message: String,
}

/// Diagnose every clause of `value`.
///
/// Only names the grammar owns are checked. A payload that is not a known token
/// or theme key may still be a perfectly good literal CSS value (`4px`,
/// `calc(...)`, `#fff`), so an unknown name is reported only when it looks like
/// an identifier AND the vocabulary has a near neighbour to suggest. That keeps
/// the check from crying wolf over ordinary CSS.
pub fn diagnose(
    vocabulary: &Vocabulary,
    config: &ConfigSnapshot,
    value: &str,
) -> Vec<Diagnostic> {
    let mut out = Vec::new();
    // parsed against the registry, so an unknown modifier is the GRAMMAR's
    // verdict rather than a second opinion from the completion index: those
    // two disagreed about `group-hover` and `@sm`, which the index does not
    // enumerate and the grammar accepts
    let parsed = value::parse_with(value, &vocabulary.registry);

    for error in &parsed.errors {
        // a delimiter left open and a clause with no payload yet are what a
        // half-typed value LOOKS like, and an editor that squiggles `hover:`
        // and `rgba(1, ` while they are being typed is noise rather than help.
        // The compiler still refuses both; this is a diagnostic, not the gate.
        if matches!(
            error.code,
            value::ParseErrorCode::EmptyPayload
                | value::ParseErrorCode::UnterminatedString
                | value::ParseErrorCode::UnterminatedFunction
                | value::ParseErrorCode::UnterminatedComment
        ) {
            continue;
        }
        let span = match error.modifier {
            Some(span) => span,
            None => Span::new(error.index, (error.index + 1).min(value.len())),
        };
        let message = match error.code {
            value::ParseErrorCode::UnregisteredModifier => {
                let name = span.of(value);
                let mut message = format!("unknown modifier `{name}`");
                if let Some(best) = vocabulary.modifiers.did_you_mean(name, 2).first() {
                    message.push_str(&format!(", did you mean `{}`?", best.name));
                }
                message
            }
            value::ParseErrorCode::EmptyModifier => "a modifier chain has an empty segment".into(),
            // unlike an unterminated comment, this is never what a half-typed
            // one looks like: `/*` always precedes the `*/` being typed
            value::ParseErrorCode::StrayCommentClose => {
                "stray `*/`: it would close a comment opened somewhere else".into()
            }
            value::ParseErrorCode::InvalidCharacter => format!(
                "`{}` cannot appear in a value: it would end the declaration or rule",
                span.of(value)
            ),
            // filtered above
            _ => continue,
        };
        out.push(Diagnostic { span, message });
    }

    // a payload is a CSS component-value sequence, so each WORD in it is a
    // candidate name; checking the whole payload meant `1px solid red` was
    // never checked at all
    for payload in parsed.payloads() {
        for word in value::words(value, payload) {
            let text = word.of(value);
            if text.is_empty() || !is_bare_identifier(text) {
                continue;
            }
            if vocabulary.values.contains(text) || config.themes.has_key(text) {
                continue;
            }
            // a bare identifier that is not in the vocabulary is only worth
            // reporting when something close exists; otherwise it is a CSS
            // keyword this grammar does not enumerate (`auto`, `red`, ...).
            //
            // distance 2 rather than 1 because a transposition (`backgorund`)
            // is two Levenshtein edits and is one of the most common real
            // typos; at distance 1 it produced no suggestion and therefore no
            // diagnostic at all, so the misspelling passed silently.
            if let Some(best) = nearest(&vocabulary.values, text) {
                out.push(Diagnostic {
                    span: word,
                    message: format!("unknown value `{text}`, did you mean `{}`?", best.name),
                });
            }
        }
    }

    out
}

/// The closest vocabulary entry within two edits, or None.
///
/// The FST's Levenshtein search returns every match unordered, so the winner is
/// chosen by true edit distance and then by name for stability. A short payload
/// is held to a tighter bound: at 4 characters or fewer, two edits can reach a
/// completely unrelated word, which is how CSS keywords get falsely "corrected".
fn nearest<'a>(index: &'a Index, payload: &str) -> Option<&'a Entry> {
    let bound = if payload.chars().count() <= 4 { 1 } else { 2 };
    index
        .did_you_mean(payload, bound)
        .into_iter()
        .min_by(|a, b| {
            edit_distance(&a.name, payload)
                .cmp(&edit_distance(&b.name, payload))
                .then_with(|| a.name.cmp(&b.name))
        })
}

/// plain Levenshtein, used only to rank the handful of candidates the FST
/// already narrowed to
fn edit_distance(a: &str, b: &str) -> usize {
    let b_chars: Vec<char> = b.chars().collect();
    let mut previous: Vec<usize> = (0..=b_chars.len()).collect();
    let mut current = vec![0usize; b_chars.len() + 1];

    for (i, a_char) in a.chars().enumerate() {
        current[0] = i + 1;
        for (j, b_char) in b_chars.iter().enumerate() {
            let cost = usize::from(a_char != *b_char);
            current[j + 1] = (previous[j] + cost)
                .min(previous[j + 1] + 1)
                .min(current[j] + 1);
        }
        std::mem::swap(&mut previous, &mut current);
    }
    previous[b_chars.len()]
}

/// identifier-shaped: letters, digits, `-`, `_`. excludes anything with CSS
/// punctuation, which is a literal value rather than a name.
fn is_bare_identifier(text: &str) -> bool {
    !text.is_empty()
        && text
            .chars()
            .all(|c| c.is_ascii_alphanumeric() || c == '-' || c == '_')
        && text.chars().next().is_some_and(|c| c.is_ascii_alphabetic())
}

#[cfg(test)]
mod tests {
    use super::*;

    const CONFIG: &str = r#"{
      "tamaguiConfig": {
        "media": { "sm": { "maxWidth": 860 } },
        "tokens": { "space": { "4": { "key": "4", "val": 16 } } },
        "themes": {
          "light": { "background": "rgba(255, 255, 255, 1)", "background-hover": "rgba(240, 240, 240, 1)", "color": "rgba(0, 0, 0, 1)" },
          "dark": { "background": "rgba(0, 0, 0, 1)", "background-hover": "rgba(20, 20, 20, 1)", "color": "rgba(255, 255, 255, 1)" }
        }
      }
    }"#;

    fn setup() -> (ConfigSnapshot, Vocabulary) {
        let config = tamagui_config::load_from_slice(CONFIG.as_bytes()).unwrap();
        let vocabulary = Vocabulary::from_config(&config);
        (config, vocabulary)
    }

    fn names<'a>(c: &Completions<'a>) -> Vec<&'a str> {
        c.entries.iter().map(|e| &*e.name).collect()
    }

    #[test]
    fn completes_a_value_from_its_typed_prefix() {
        let (_, v) = setup();
        let value = "background-h";
        let c = complete(&v, value, value.len(), None);
        assert_eq!(c.context, CursorContext::Value);
        assert_eq!(names(&c), vec!["background-hover"]);
    }

    #[test]
    fn completes_a_modifier_before_the_colon() {
        let (_, v) = setup();
        let value = "background hov:x";
        // cursor right after `hov`
        let c = complete(&v, value, 14, None);
        assert_eq!(c.context, CursorContext::Modifier);
        assert_eq!(names(&c), vec!["hover"]);
    }

    #[test]
    fn replaces_only_the_clause_not_the_whole_string() {
        // the property that makes flat values completable where className is
        // not: accepting an entry must preserve the other clauses
        let (_, v) = setup();
        let value = "background hover:background-h";
        let c = complete(&v, value, value.len(), None);
        assert_eq!(c.replace, Span::new(17, 29));
        assert_eq!(c.replace.of(value), "background-h");

        // simulate accepting the first entry
        let accepted = &c.entries[0].name;
        let mut next = String::from(&value[..c.replace.start]);
        next.push_str(accepted);
        next.push_str(&value[c.replace.end..]);
        assert_eq!(next, "background hover:background-hover");
    }

    #[test]
    fn completes_after_a_trailing_colon() {
        let (_, v) = setup();
        let value = "4 sm:";
        let c = complete(&v, value, value.len(), None);
        assert_eq!(c.context, CursorContext::Value);
        // the payload is empty, so everything is on offer, inserted after the colon
        assert_eq!(c.replace, Span::new(5, 5));
        assert!(names(&c).contains(&"background"));
    }

    #[test]
    fn an_empty_value_offers_the_whole_vocabulary() {
        let (_, v) = setup();
        let c = complete(&v, "", 0, None);
        assert_eq!(c.entries.len(), v.values.len());
    }

    #[test]
    fn a_colour_prop_offers_theme_keys_and_not_the_space_scale() {
        let (_, v) = setup();
        let c = complete(&v, "", 0, Some("color"));
        let offered = names(&c);
        assert!(offered.contains(&"background"), "expected theme keys in {offered:?}");
        // `4` is the space token; under a background prop it is noise
        assert!(!offered.contains(&"4"), "space token leaked into a colour prop: {offered:?}");
    }

    #[test]
    fn a_space_prop_offers_the_space_scale_and_not_theme_keys() {
        let (_, v) = setup();
        let c = complete(&v, "", 0, Some("space"));
        assert_eq!(names(&c), vec!["4"]);
    }

    #[test]
    fn filtering_still_narrows_by_the_typed_prefix() {
        let (_, v) = setup();
        let value = "background-h";
        let c = complete(&v, value, value.len(), Some("color"));
        assert_eq!(names(&c), vec!["background-hover"]);
    }

    #[test]
    fn scales_that_share_token_names_stay_separately_completable() {
        // the real shape: space, size and radius all define `4`. a single
        // name-keyed index keeps one of them, so filtering it by category
        // answered for one scale and came up empty for the other two.
        // r##: the `#fff` below would close an `r#"` string
        const SHARED: &str = r##"{
          "tamaguiConfig": {
            "tokens": {
              "space": { "4": { "key": "4", "val": 16 }, "true": { "key": "true", "val": 8 } },
              "size":  { "4": { "key": "4", "val": 44 } },
              "radius": { "4": { "key": "4", "val": 6 } }
            },
            "themes": { "light": { "background": "#fff" } }
          }
        }"##;
        let config = tamagui_config::load_from_slice(SHARED.as_bytes()).unwrap();
        let v = Vocabulary::from_config(&config);

        for (category, expected) in
            [("space", vec!["4", "true"]), ("size", vec!["4"]), ("radius", vec!["4"])]
        {
            let c = complete(&v, "", 0, Some(category));
            assert_eq!(names(&c), expected, "category {category}");
        }

        // and each scale reports its OWN resolved value, not the winner's
        assert_eq!(&*v.category("size").unwrap().get("4").unwrap().detail, "44");
        assert_eq!(&*v.category("radius").unwrap().get("4").unwrap().detail, "6");
        assert_eq!(&*v.category("space").unwrap().get("4").unwrap().detail, "16");
    }

    #[test]
    fn a_category_the_config_has_no_tokens_for_offers_everything() {
        // `fontSize` is a real category in the registry, but a config that
        // declares no fontSize tokens must not answer with an empty list
        let (_, v) = setup();
        let c = complete(&v, "", 0, Some("fontSize"));
        assert_eq!(c.entries.len(), v.values.len());
    }

    #[test]
    fn a_modifier_is_offered_regardless_of_the_props_category() {
        // modifiers are a grammar position, not a value category: `bg` is a
        // colour prop but `hover:` is still legal in it
        let (_, v) = setup();
        let value = "hov";
        let c = complete(&v, value, value.len(), Some("color"));
        // `hov` is a value prefix here (no colon yet), so nothing matches; the
        // point is that filtering does not crash or swallow the modifier path
        assert_eq!(c.context, CursorContext::Value);

        let with_colon = "hov:";
        let c = complete(&v, with_colon, 3, Some("color"));
        assert_eq!(c.context, CursorContext::Modifier);
        assert_eq!(names(&c), vec!["hover"]);
    }

    #[test]
    fn diagnoses_an_unknown_modifier_with_a_suggestion() {
        let (config, v) = setup();
        let value = "background hovr:background-hover";
        let d = diagnose(&v, &config, value);
        assert_eq!(d.len(), 1);
        assert_eq!(d[0].span.of(value), "hovr");
        assert!(d[0].message.contains("did you mean `hover`"), "{}", d[0].message);
    }

    #[test]
    fn diagnoses_a_misspelled_value() {
        let (config, v) = setup();
        for value in ["backgroundd", "backgorund", "backgrund"] {
            let d = diagnose(&v, &config, value);
            assert_eq!(d.len(), 1, "{value} produced {d:?}");
            assert!(
                d[0].message.contains("did you mean `background`"),
                "{value}: {}",
                d[0].message
            );
        }
    }

    #[test]
    fn picks_the_nearest_suggestion_not_an_arbitrary_one() {
        let (_, v) = setup();
        // `background-hoverr` is one edit from background-hover and further
        // from background, so the closer one must win
        let best = nearest(&v.values, "background-hoverr").unwrap();
        assert_eq!(&*best.name, "background-hover");
    }

    #[test]
    fn accepts_valid_values_silently() {
        let (config, v) = setup();
        for value in ["background", "background hover:background-hover", "4", "sm:4"] {
            assert!(diagnose(&v, &config, value).is_empty(), "flagged {value}");
        }
    }

    #[test]
    fn accepting_a_completion_inside_a_multi_word_payload_keeps_its_siblings() {
        // the property that makes flat values completable where className is
        // not, one level deeper than the clause: a payload is several CSS
        // components, and only the one under the cursor may be replaced
        let (_, v) = setup();
        let value = "hover:1px solid background-h";
        let c = complete(&v, value, value.len(), None);
        assert_eq!(c.context, CursorContext::Value);
        assert_eq!(c.replace.of(value), "background-h");
        assert_eq!(names(&c), vec!["background-hover"]);

        let accepted = &c.entries[0].name;
        let mut next = String::from(&value[..c.replace.start]);
        next.push_str(accepted);
        next.push_str(&value[c.replace.end..]);
        assert_eq!(next, "hover:1px solid background-hover");
    }

    #[test]
    fn the_grammars_own_modifier_spellings_are_the_ones_offered() {
        // the drift this crate carried: camelCase `focusVisible`, no `active`,
        // and no parameterized forms at all
        let (_, v) = setup();
        let offered: Vec<&str> = v.modifiers.entries().iter().map(|e| &*e.name).collect();
        assert!(offered.contains(&"focus-visible"), "{offered:?}");
        assert!(offered.contains(&"focus-within"), "{offered:?}");
        assert!(offered.contains(&"group-hover"), "{offered:?}");
        assert!(offered.contains(&"@sm"), "{offered:?}");
        assert!(!offered.contains(&"focusVisible"), "{offered:?}");
    }

    #[test]
    fn a_parameterized_or_aliased_modifier_is_not_diagnosed_as_unknown() {
        let (config, v) = setup();
        for value in [
            "active:red",
            "pressed:red",
            "starting:red",
            "focus-visible:red",
            "group-hover:red",
            "group-hover/card:red",
            "@sm:red",
            "@sm/card:red",
        ] {
            assert!(diagnose(&v, &config, value).is_empty(), "flagged {value}");
        }
    }

    #[test]
    fn a_multi_word_payload_is_diagnosed_component_by_component() {
        // checking the payload whole meant `1px solid backgorund` was never
        // checked at all, because the payload is not an identifier
        let (config, v) = setup();
        let value = "1px solid backgorund";
        let d = diagnose(&v, &config, value);
        assert_eq!(d.len(), 1, "{d:?}");
        assert_eq!(d[0].span.of(value), "backgorund");
    }

    #[test]
    fn a_half_typed_value_is_not_diagnosed() {
        // every one of these is a state the cursor passes through on the way to
        // a valid value, and the editor sees all of them
        let (config, v) = setup();
        for value in ["hover:", "rgba(1, ", "url(\"http://x", "background hover:"] {
            assert!(diagnose(&v, &config, value).is_empty(), "flagged {value}");
        }
    }

    #[test]
    fn a_value_that_would_escape_its_declaration_is_diagnosed() {
        let (config, v) = setup();
        let value = "red; position: fixed";
        let d = diagnose(&v, &config, value);
        assert!(
            d.iter().any(|x| x.message.contains("end the declaration or rule")),
            "{d:?}"
        );
    }

    #[test]
    fn ordinary_css_is_not_flagged_as_an_unknown_token() {
        // the crying-wolf case: these are legal values the grammar does not
        // enumerate, and flagging them would make the diagnostic useless
        let (config, v) = setup();
        for value in [
            "4px",
            "calc(100% - 2px)",
            "#fff",
            "rgba(1, 2, 3, 1)",
            "url(https://x.com/a.png)",
            "1.5",
            "hover:0.7",
            // short CSS keywords: two edits can reach an unrelated vocabulary
            // entry from these, which is why the bound tightens when short
            "auto",
            "none",
            "red",
            "solid",
            "flex",
            "bold",
        ] {
            assert!(diagnose(&v, &config, value).is_empty(), "flagged {value}");
        }
    }
}
