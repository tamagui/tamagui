// The completion vocabulary, built from a live config snapshot.
//
// Why an FST rather than a sorted Vec. Two queries have to be fast:
//
//   * prefix — "what can follow `background-`", on every keystroke
//   * fuzzy  — "you wrote `backgorund`, did you mean ...", on every diagnostic
//
// A sorted Vec answers the first with a binary search but cannot answer the
// second without a second structure and a full scan. An FST answers both from
// one shared automaton, stores the keys with common prefixes and suffixes
// collapsed (which this vocabulary is full of: `background`, `background-hover`,
// `background-press`, ... across 236 theme keys), and its Levenshtein support
// is a bounded automaton intersection rather than an edit-distance scan.

use fst::automaton::{Automaton, Levenshtein, Str};
use fst::{IntoStreamer, Map, MapBuilder, Streamer};
use rustc_hash::FxHashMap;
use tamagui_config::ConfigSnapshot;

#[derive(Clone, Copy, PartialEq, Eq, Debug)]
pub enum EntryKind {
    /// a theme key, e.g. `background`, `accent-color`
    ThemeKey,
    /// a token in a category, e.g. `space.4`
    Token,
    /// a modifier usable as a `name:` prefix
    Modifier(ModifierKind),
}

#[derive(Clone, Copy, PartialEq, Eq, Debug)]
pub enum ModifierKind {
    /// `hover`, `press`, `focus`, ...
    State,
    /// a configured media key, e.g. `sm`, `gtMd`
    Media,
    /// `web`, `native`, `ios`, `android`
    Platform,
    /// a configured theme name, e.g. `dark`
    Theme,
}

#[derive(Clone, Debug)]
pub struct Entry {
    pub name: Box<str>,
    pub kind: EntryKind,
    /// what to show beside the name: a resolved value, or a media query
    pub detail: Box<str>,
    /// which token category this came from, for filtering by property
    pub category: Option<Box<str>>,
    /// position in config order, kept because the FST stores names sorted
    /// lexically and a scale read lexically is nonsense: `1, 10, 11, 2`. The
    /// config already sorts each category numerically, so this is what a person
    /// expects to see.
    pub order: u32,
}

/// state modifiers are grammar-owned rather than config-owned, so they are
/// fixed. these mirror `stateModifierNames` in @tamagui/style-grammar.
pub const STATE_MODIFIERS: &[&str] =
    &["hover", "press", "focus", "focusVisible", "focusWithin", "disabled", "enter", "exit"];

pub const PLATFORM_MODIFIERS: &[&str] = &["web", "native", "ios", "android"];

/// One searchable set: the entries plus an FST over their names.
pub struct Index {
    entries: Vec<Entry>,
    /// name -> index into `entries`
    fst: Map<Vec<u8>>,
}

impl Index {
    /// `entries` need not be sorted; this sorts and dedupes by name, because an
    /// FST requires strictly increasing unique keys.
    fn build(mut entries: Vec<Entry>) -> Self {
        entries.sort_by(|a, b| a.name.cmp(&b.name));
        entries.dedup_by(|a, b| a.name == b.name);

        let mut builder = MapBuilder::memory();
        for (index, entry) in entries.iter().enumerate() {
            // infallible: keys are sorted and unique by construction above
            builder
                .insert(entry.name.as_bytes(), index as u64)
                .expect("entries are sorted and deduped");
        }
        let fst = builder.into_map();
        Self { entries, fst }
    }

    pub fn len(&self) -> usize {
        self.entries.len()
    }

    pub fn is_empty(&self) -> bool {
        self.entries.is_empty()
    }

    pub fn entries(&self) -> &[Entry] {
        &self.entries
    }

    pub fn get(&self, name: &str) -> Option<&Entry> {
        self.fst.get(name).map(|i| &self.entries[i as usize])
    }

    pub fn contains(&self, name: &str) -> bool {
        self.fst.contains_key(name)
    }

    /// every entry starting with `prefix`, in sorted order. An empty prefix
    /// yields the whole set, which is what an empty value should offer.
    pub fn starting_with(&self, prefix: &str) -> Vec<&Entry> {
        let automaton = Str::new(prefix).starts_with();
        let mut stream = self.fst.search(automaton).into_stream();
        let mut out = Vec::new();
        while let Some((_, index)) = stream.next() {
            out.push(&self.entries[index as usize]);
        }
        out
    }

    /// entries within `distance` edits of `name`, for "did you mean".
    ///
    /// Distance is capped at 2: beyond that the suggestions stop resembling the
    /// input and the automaton grows fast.
    pub fn did_you_mean(&self, name: &str, distance: u32) -> Vec<&Entry> {
        let Ok(automaton) = Levenshtein::new(name, distance.min(2)) else {
            return Vec::new();
        };
        let mut stream = self.fst.search(automaton).into_stream();
        let mut out = Vec::new();
        while let Some((_, index)) = stream.next() {
            out.push(&self.entries[index as usize]);
        }
        out
    }
}

/// Everything completable, split by the position it is valid in.
///
/// Values and modifiers are separate indexes because they occupy different
/// grammar positions: after a `:` only a value is legal, and before one only a
/// modifier is. Sharing one index would offer `hover` as a colour.
pub struct Vocabulary {
    pub values: Index,
    pub modifiers: Index,
    /// one index per token category.
    ///
    /// These cannot be a filtered view over `values`, because the scales share
    /// names: `space`, `size` and `radius` all define `4`, and `values` keeps a
    /// single entry per name for the FST. Filtering that merged index by
    /// category returns whichever scale happened to win the dedupe and nothing
    /// for the others, which is how `w=""` ended up offering the whole
    /// vocabulary while `rounded=""` offered only the handful of radius names
    /// no other scale had claimed.
    by_category: FxHashMap<Box<str>, Index>,
    /// the config revision this was built from, so a stale vocabulary is
    /// detectable rather than silently served
    pub revision: u64,
}

impl Vocabulary {
    /// The index a prop of this category should complete from, or `None` when
    /// the config declares no such category.
    pub fn category(&self, category: &str) -> Option<&Index> {
        self.by_category.get(category)
    }

    pub fn from_config(config: &ConfigSnapshot) -> Self {
        let mut values = Vec::new();

        // theme keys are the colour vocabulary. every theme declares the same
        // key set, so one pass over the key names covers all 1,152 themes.
        for key in config.themes.key_names() {
            let detail = config
                .themes
                .theme_names()
                .next()
                .and_then(|t| config.themes.value_by_name(t, key))
                .map(|v| v.raw.to_string())
                .unwrap_or_default();
            values.push(Entry {
                name: key.into(),
                kind: EntryKind::ThemeKey,
                detail: detail.into_boxed_str(),
                category: Some("color".into()),
                order: values.len() as u32,
            });
        }

        // tokens carry their resolved value, which is what hover shows
        for (category, tokens) in &config.tokens {
            for token in tokens {
                values.push(Entry {
                    name: token.key.clone(),
                    kind: EntryKind::Token,
                    detail: token.value.clone(),
                    category: Some(category.clone()),
                    order: values.len() as u32,
                });
            }
        }

        let mut modifiers = Vec::new();
        for name in STATE_MODIFIERS {
            modifiers.push(Entry {
                name: (*name).into(),
                kind: EntryKind::Modifier(ModifierKind::State),
                detail: "state".into(),
                category: None,
                order: modifiers.len() as u32,
            });
        }
        for name in PLATFORM_MODIFIERS {
            modifiers.push(Entry {
                name: (*name).into(),
                kind: EntryKind::Modifier(ModifierKind::Platform),
                detail: "platform".into(),
                category: None,
                order: modifiers.len() as u32,
            });
        }
        for (name, query) in &config.media {
            modifiers.push(Entry {
                name: name.clone(),
                kind: EntryKind::Modifier(ModifierKind::Media),
                detail: query.clone(),
                category: None,
                order: modifiers.len() as u32,
            });
        }
        for theme in config.themes.theme_names() {
            // sub-themes (`dark_accent_Button`) are real theme names but are
            // not what anyone writes as a modifier, so only roots are offered
            if theme.contains('_') {
                continue;
            }
            modifiers.push(Entry {
                name: theme.into(),
                kind: EntryKind::Modifier(ModifierKind::Theme),
                detail: "theme".into(),
                category: None,
                order: modifiers.len() as u32,
            });
        }

        let mut grouped: FxHashMap<Box<str>, Vec<Entry>> = FxHashMap::default();
        for entry in &values {
            let Some(category) = entry.category.clone() else { continue };
            grouped.entry(category).or_default().push(entry.clone());
        }
        let by_category = grouped
            .into_iter()
            .map(|(category, entries)| (category, Index::build(entries)))
            .collect();

        Self {
            values: Index::build(values),
            modifiers: Index::build(modifiers),
            by_category,
            revision: config.revision,
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    const CONFIG: &str = r#"{
      "tamaguiConfig": {
        "media": { "sm": { "maxWidth": 860 }, "gtMd": { "minWidth": 1020 } },
        "tokens": {
          "space": {
            "2": { "key": "2", "val": 7 },
            "4": { "key": "4", "val": 16 }
          }
        },
        "themes": {
          "light": {
            "background": "rgba(255, 255, 255, 1)",
            "background-hover": "rgba(240, 240, 240, 1)",
            "background-press": "rgba(230, 230, 230, 1)",
            "color": "rgba(0, 0, 0, 1)"
          },
          "dark": {
            "background": "rgba(0, 0, 0, 1)",
            "background-hover": "rgba(20, 20, 20, 1)",
            "background-press": "rgba(30, 30, 30, 1)",
            "color": "rgba(255, 255, 255, 1)"
          },
          "dark_accent_Button": {
            "background": "rgba(1, 1, 1, 1)",
            "background-hover": "rgba(1, 1, 1, 1)",
            "background-press": "rgba(1, 1, 1, 1)",
            "color": "rgba(1, 1, 1, 1)"
          }
        }
      }
    }"#;

    fn vocab() -> Vocabulary {
        let config = tamagui_config::load_from_slice(CONFIG.as_bytes()).unwrap();
        Vocabulary::from_config(&config)
    }

    #[test]
    fn offers_theme_keys_and_tokens_as_values() {
        let v = vocab();
        assert!(v.values.contains("background"));
        assert!(v.values.contains("background-hover"));
        assert!(v.values.contains("color"));
        // tokens come through with their resolved value for display
        assert_eq!(&*v.values.get("4").unwrap().detail, "16");
    }

    #[test]
    fn prefix_query_narrows_the_way_typing_does() {
        let v = vocab();
        let all = v.values.starting_with("background");
        let names: Vec<&str> = all.iter().map(|e| &*e.name).collect();
        assert_eq!(names, vec!["background", "background-hover", "background-press"]);

        let narrowed = v.values.starting_with("background-h");
        assert_eq!(narrowed.len(), 1);
        assert_eq!(&*narrowed[0].name, "background-hover");
    }

    #[test]
    fn an_empty_prefix_offers_everything() {
        let v = vocab();
        assert_eq!(v.values.starting_with("").len(), v.values.len());
    }

    #[test]
    fn modifiers_are_separate_from_values() {
        let v = vocab();
        // `hover` is a modifier, never a colour
        assert!(v.modifiers.contains("hover"));
        assert!(!v.values.contains("hover"));
        // configured media keys are modifiers
        assert!(v.modifiers.contains("sm"));
        assert!(v.modifiers.contains("gtMd"));
        assert_eq!(v.modifiers.get("sm").unwrap().kind, EntryKind::Modifier(ModifierKind::Media));
    }

    #[test]
    fn root_themes_are_modifiers_but_sub_themes_are_not() {
        let v = vocab();
        assert!(v.modifiers.contains("dark"));
        assert!(v.modifiers.contains("light"));
        // nobody writes `dark_accent_Button:` as a modifier
        assert!(!v.modifiers.contains("dark_accent_Button"));
    }

    #[test]
    fn suggests_a_correction_for_a_typo() {
        let v = vocab();
        let suggestions = v.values.did_you_mean("backgorund", 2);
        let names: Vec<&str> = suggestions.iter().map(|e| &*e.name).collect();
        assert!(names.contains(&"background"), "expected background in {names:?}");
    }

    #[test]
    fn a_wildly_wrong_name_suggests_nothing_rather_than_anything() {
        let v = vocab();
        assert!(v.values.did_you_mean("qqqqqqqqqq", 2).is_empty());
    }

    #[test]
    fn carries_the_revision_it_was_built_from() {
        let config = tamagui_config::load_from_slice(CONFIG.as_bytes()).unwrap();
        let v = Vocabulary::from_config(&config);
        assert_eq!(v.revision, config.revision);
    }
}
