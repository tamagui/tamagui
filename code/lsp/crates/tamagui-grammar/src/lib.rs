//! The flat value grammar: parse, complete, diagnose.
//!
//! This is the layer that turns a config snapshot plus an authored string into
//! the things an editor shows. It is deliberately free of any LSP or editor
//! types so the same engine backs the language server, the CLI checker and the
//! lint rule, the way `@tamagui/style-grammar` does on the TypeScript side.

use tamagui_config::ConfigSnapshot;

pub mod value;
pub mod vocab;

pub use value::{Clause, FlatValue, Modifier, Span};
pub use vocab::{Entry, EntryKind, Index, ModifierKind, Vocabulary};

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
pub fn complete<'a>(
    vocabulary: &'a Vocabulary,
    value: &str,
    offset: usize,
) -> Completions<'a> {
    let parsed = value::parse(value);
    let offset = offset.min(value.len());

    let Some(clause) = parsed.clause_at(offset) else {
        // between clauses, or at the very start: offer a fresh value
        return Completions {
            replace: Span::new(offset, offset),
            context: CursorContext::Value,
            entries: vocabulary.values.starting_with(""),
        };
    };

    // a cursor inside one of the `modifier:` prefixes completes a modifier
    if let Some(modifier) = clause.modifiers.iter().find(|m| m.span.contains(offset)) {
        let typed = &value[modifier.span.start..offset];
        return Completions {
            replace: modifier.span,
            context: CursorContext::Modifier,
            entries: vocabulary.modifiers.starting_with(typed),
        };
    }

    // otherwise the cursor is in the payload
    let typed = &value[clause.payload.start..offset.max(clause.payload.start)];
    Completions {
        replace: clause.payload,
        context: CursorContext::Value,
        entries: vocabulary.values.starting_with(typed),
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
    let parsed = value::parse(value);

    for clause in &parsed.clauses {
        for modifier in &clause.modifiers {
            let name = modifier.span.of(value);
            if name.is_empty() || vocabulary.modifiers.contains(name) {
                continue;
            }
            let mut message = format!("unknown modifier `{name}`");
            if let Some(best) = vocabulary.modifiers.did_you_mean(name, 2).first() {
                message.push_str(&format!(", did you mean `{}`?", best.name));
            }
            out.push(Diagnostic { span: modifier.span, message });
        }

        let payload = clause.payload.of(value);
        if payload.is_empty() || !is_bare_identifier(payload) {
            continue;
        }
        if vocabulary.values.contains(payload) || config.themes.has_key(payload) {
            continue;
        }
        // a bare identifier that is not in the vocabulary is only worth
        // reporting when something close exists; otherwise it is a CSS keyword
        // this grammar does not enumerate (`auto`, `inherit`, `red`, ...).
        //
        // distance 2 rather than 1 because a transposition (`backgorund`) is
        // two Levenshtein edits and is one of the most common real typos; at
        // distance 1 it produced no suggestion and therefore no diagnostic at
        // all, so the misspelling passed silently.
        if let Some(best) = nearest(&vocabulary.values, payload) {
            out.push(Diagnostic {
                span: clause.payload,
                message: format!("unknown value `{payload}`, did you mean `{}`?", best.name),
            });
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
        let c = complete(&v, value, value.len());
        assert_eq!(c.context, CursorContext::Value);
        assert_eq!(names(&c), vec!["background-hover"]);
    }

    #[test]
    fn completes_a_modifier_before_the_colon() {
        let (_, v) = setup();
        let value = "background hov:x";
        // cursor right after `hov`
        let c = complete(&v, value, 14);
        assert_eq!(c.context, CursorContext::Modifier);
        assert_eq!(names(&c), vec!["hover"]);
    }

    #[test]
    fn replaces_only_the_clause_not_the_whole_string() {
        // the property that makes flat values completable where className is
        // not: accepting an entry must preserve the other clauses
        let (_, v) = setup();
        let value = "background hover:background-h";
        let c = complete(&v, value, value.len());
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
        let c = complete(&v, value, value.len());
        assert_eq!(c.context, CursorContext::Value);
        // the payload is empty, so everything is on offer, inserted after the colon
        assert_eq!(c.replace, Span::new(5, 5));
        assert!(names(&c).contains(&"background"));
    }

    #[test]
    fn an_empty_value_offers_the_whole_vocabulary() {
        let (_, v) = setup();
        let c = complete(&v, "", 0);
        assert_eq!(c.entries.len(), v.values.len());
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
