//! Loads `.tamagui/tamagui.config.json` into a compact snapshot.
//!
//! The artifact is large (13.5 MB and 271,872 theme entries for tamagui.dev),
//! it is rewritten whenever the compiler runs, and every editor feature reads
//! it. So this crate optimises for three things in order:
//!
//! 1. **Small resident form.** Themes collapse into a dense matrix over an
//!    interned palette (see [`themes`]).
//! 2. **Streaming load.** Themes deserialize straight into the matrix builder,
//!    so the 271,872 strings never exist as 271,872 allocations.
//! 3. **Instant, lock-free publication.** [`ConfigHandle`] swaps a whole
//!    snapshot atomically, so a rebuild becomes visible to every in-flight and
//!    future request without any reader taking a lock.

use std::borrow::Cow;
use std::path::{Path, PathBuf};
use std::sync::Arc;
use std::sync::atomic::{AtomicU64, Ordering};

use arc_swap::ArcSwap;
use rustc_hash::{FxHashMap, FxHashSet};
use serde::de::{DeserializeSeed, MapAccess, Visitor};
use serde::{Deserialize, Deserializer};

pub mod color;
mod color_names;
pub mod themes;

pub use color::Rgba;
pub use themes::{KeyId, ThemeId, ThemeMatrix, ThemeValue};

/// the path the compiler writes, relative to a project root
pub const ARTIFACT_RELATIVE_PATH: &str = ".tamagui/tamagui.config.json";

#[derive(Debug)]
pub enum LoadError {
    Io(std::io::Error),
    Parse(serde_json::Error),
    /// the file parsed but carried no `tamaguiConfig`
    MissingConfig,
}

impl std::fmt::Display for LoadError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            Self::Io(e) => write!(f, "reading the config artifact: {e}"),
            Self::Parse(e) => write!(f, "parsing the config artifact: {e}"),
            Self::MissingConfig => {
                write!(f, "the config artifact has no `tamaguiConfig` key; run the compiler")
            }
        }
    }
}

impl std::error::Error for LoadError {}

/// one token, e.g. `space.4 = 16`
#[derive(Clone, Debug)]
pub struct TokenEntry {
    pub key: Box<str>,
    /// the resolved value, rendered for display
    pub value: Box<str>,
}

/// an immutable view of one compiled config. Cheap to clone as an `Arc`.
#[derive(Debug, Default)]
pub struct ConfigSnapshot {
    pub themes: ThemeMatrix,
    /// category name -> its tokens, in config order
    pub tokens: Vec<(Box<str>, Vec<TokenEntry>)>,
    /// media key -> its query, rendered as compact JSON for hover
    pub media: Vec<(Box<str>, Box<str>)>,
    pub shorthands: FxHashMap<Box<str>, Box<str>>,
    /// every name that may carry a style value: the shorthands plus the long
    /// property names. Derived from the config rather than hardcoded, so it
    /// cannot drift from what the runtime accepts.
    pub style_props: FxHashSet<Box<str>>,
    pub only_allow_shorthands: bool,
    /// bumped on every successful load, so callers can tell snapshots apart
    pub revision: u64,
    /// where this snapshot was read from
    pub source: Option<PathBuf>,
}

impl ConfigSnapshot {
    pub fn token_category(&self, name: &str) -> Option<&[TokenEntry]> {
        self.tokens.iter().find(|(c, _)| &**c == name).map(|(_, t)| &t[..])
    }

    pub fn media_query(&self, name: &str) -> Option<&str> {
        self.media.iter().find(|(n, _)| &**n == name).map(|(_, q)| &**q)
    }

    /// resolve a shorthand like `bg` to its long property name
    pub fn expand_shorthand<'a>(&'a self, name: &'a str) -> &'a str {
        self.shorthands.get(name).map(|s| &**s).unwrap_or(name)
    }

    /// a one-line summary for the load log, so the win is visible in the wild
    pub fn describe(&self) -> String {
        format!(
            "{} themes x {} keys, {} distinct values, {} KB resident cells, {} token categories, {} media keys",
            self.themes.theme_count(),
            self.themes.key_count(),
            self.themes.palette_len(),
            self.themes.cells_bytes() / 1024,
            self.tokens.len(),
            self.media.len(),
        )
    }
}

// ---------------------------------------------------------------------------
// loading
// ---------------------------------------------------------------------------

static REVISION: AtomicU64 = AtomicU64::new(0);

pub fn load_from_path(path: impl AsRef<Path>) -> Result<ConfigSnapshot, LoadError> {
    let path = path.as_ref();
    let bytes = std::fs::read(path).map_err(LoadError::Io)?;
    let mut snapshot = load_from_slice(&bytes)?;
    snapshot.source = Some(path.to_path_buf());
    Ok(snapshot)
}

/// Parse from bytes. Deserializing from a slice lets serde_json hand back
/// borrowed `&str` for the (overwhelming majority of) keys and values that
/// carry no escapes, so interning compares against the input buffer directly
/// instead of against a freshly allocated String.
pub fn load_from_slice(bytes: &[u8]) -> Result<ConfigSnapshot, LoadError> {
    let file: ArtifactFile = serde_json::from_slice(bytes).map_err(LoadError::Parse)?;
    let raw = file.tamagui_config.ok_or(LoadError::MissingConfig)?;

    let tokens = raw
        .tokens
        .into_iter()
        .map(|(category, entries)| {
            let mut list: Vec<TokenEntry> = entries
                .into_iter()
                .map(|(key, token)| TokenEntry {
                    key: key.into(),
                    value: token.display_value().into(),
                })
                .collect();
            // config order is a JSON object's order, which serde_json does not
            // preserve; sorting numerically-aware keeps `2` before `10`
            list.sort_by(|a, b| natural_cmp(&a.key, &b.key));
            (category.into(), list)
        })
        .collect();

    let media = raw
        .media
        .into_iter()
        .map(|(name, query)| (name.into(), query.to_string().into_boxed_str()))
        .collect();

    let mut style_props: FxHashSet<Box<str>> = FxHashSet::default();
    for (short, long) in &raw.shorthands {
        style_props.insert(short.as_str().into());
        style_props.insert(long.as_str().into());
    }
    for long in raw.inverse_shorthands.keys() {
        style_props.insert(long.as_str().into());
    }

    let shorthands = raw
        .shorthands
        .into_iter()
        .map(|(short, long)| (short.into_boxed_str(), long.into_boxed_str()))
        .collect();

    Ok(ConfigSnapshot {
        themes: raw.themes.unwrap_or_default(),
        tokens,
        media,
        shorthands,
        style_props,
        only_allow_shorthands: raw.only_allow_shorthands,
        revision: REVISION.fetch_add(1, Ordering::Relaxed) + 1,
        source: None,
    })
}

/// `2` before `10`, so token lists read the way a person expects.
///
/// Numeric keys sort as numbers and ahead of every non-numeric key; non-numeric
/// keys sort lexically among themselves. Mixing the two rules per-comparison
/// instead breaks transitivity (`2 < 10` numerically, `10 < "1a"` lexically, yet
/// `2 > "1a"` lexically), which real token sets hit and Rust's sort detects.
fn natural_cmp(a: &str, b: &str) -> std::cmp::Ordering {
    use std::cmp::Ordering;
    match (a.parse::<i64>(), b.parse::<i64>()) {
        // the trailing lexical compare keeps distinct spellings of one number
        // (`01` and `1`) from comparing equal
        (Ok(x), Ok(y)) => x.cmp(&y).then_with(|| a.cmp(b)),
        (Ok(_), Err(_)) => Ordering::Less,
        (Err(_), Ok(_)) => Ordering::Greater,
        (Err(_), Err(_)) => a.cmp(b),
    }
}

#[derive(Deserialize)]
struct ArtifactFile {
    #[serde(rename = "tamaguiConfig")]
    tamagui_config: Option<RawConfig>,
}

#[derive(Deserialize)]
struct RawConfig {
    /// streamed straight into the dense matrix
    #[serde(default, deserialize_with = "deserialize_themes")]
    themes: Option<ThemeMatrix>,
    #[serde(default)]
    tokens: FxHashMap<String, FxHashMap<String, RawToken>>,
    #[serde(default)]
    media: FxHashMap<String, serde_json::Value>,
    #[serde(default)]
    shorthands: FxHashMap<String, String>,
    /// long property name -> its shorthand. the KEYS are the long style prop
    /// names, which is the only config-derived source for "is this a style prop"
    #[serde(default, rename = "inverseShorthands")]
    inverse_shorthands: FxHashMap<String, String>,
    #[serde(default, rename = "onlyAllowShorthands")]
    only_allow_shorthands: bool,
}

#[derive(Deserialize)]
struct RawToken {
    #[serde(default)]
    val: Option<serde_json::Value>,
    #[serde(default)]
    variable: Option<String>,
}

impl RawToken {
    fn display_value(&self) -> String {
        match &self.val {
            Some(serde_json::Value::String(s)) => s.clone(),
            Some(serde_json::Value::Number(n)) => n.to_string(),
            Some(other) => other.to_string(),
            None => self.variable.clone().unwrap_or_default(),
        }
    }
}

fn deserialize_themes<'de, D>(deserializer: D) -> Result<Option<ThemeMatrix>, D::Error>
where
    D: Deserializer<'de>,
{
    deserializer.deserialize_map(ThemesVisitor).map(Some)
}

struct ThemesVisitor;

impl<'de> Visitor<'de> for ThemesVisitor {
    type Value = ThemeMatrix;

    fn expecting(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        f.write_str("a map of theme name to its values")
    }

    fn visit_map<A: MapAccess<'de>>(self, mut map: A) -> Result<Self::Value, A::Error> {
        let mut builder = themes::ThemeMatrixBuilder::new();
        if let Some(hint) = map.size_hint() {
            builder.reserve_themes(hint);
        }
        while let Some(name) = map.next_key::<Cow<'de, str>>()? {
            let theme = builder.begin_theme(&name);
            map.next_value_seed(ThemeRow { builder: &mut builder, theme })?;
        }
        Ok(builder.finish())
    }
}

/// deserializes one theme's entries directly into the builder
struct ThemeRow<'b> {
    builder: &'b mut themes::ThemeMatrixBuilder,
    theme: ThemeId,
}

impl<'de, 'b> DeserializeSeed<'de> for ThemeRow<'b> {
    type Value = ();

    fn deserialize<D: Deserializer<'de>>(self, deserializer: D) -> Result<(), D::Error> {
        deserializer.deserialize_map(self)
    }
}

impl<'de, 'b> Visitor<'de> for ThemeRow<'b> {
    type Value = ();

    fn expecting(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        f.write_str("a map of theme key to value")
    }

    fn visit_map<A: MapAccess<'de>>(self, mut map: A) -> Result<(), A::Error> {
        while let Some(key) = map.next_key::<Cow<'de, str>>()? {
            // a non-string theme value is not a colour and not displayable, so
            // it is skipped rather than stringified into something misleading
            match map.next_value::<Cow<'de, str>>() {
                Ok(value) => self.builder.push(self.theme, &key, &value),
                Err(_) => continue,
            }
        }
        Ok(())
    }
}

// ---------------------------------------------------------------------------
// instant publication
// ---------------------------------------------------------------------------

/// Holds the active snapshot so a config rebuild becomes visible everywhere at
/// once.
///
/// Reads are lock-free and wait-free: a request handler calls [`Self::load`]
/// and gets the snapshot that was current at that instant. A reload builds the
/// whole new snapshot off to the side and then swaps a single pointer, so no
/// reader ever observes a half-updated config and no reader ever blocks behind
/// a writer. Requests already in flight finish against the snapshot they
/// started with, which is what makes their results self-consistent.
#[derive(Debug)]
pub struct ConfigHandle {
    current: ArcSwap<ConfigSnapshot>,
}

impl Default for ConfigHandle {
    fn default() -> Self {
        Self::empty()
    }
}

impl ConfigHandle {
    pub fn empty() -> Self {
        Self { current: ArcSwap::from_pointee(ConfigSnapshot::default()) }
    }

    pub fn new(snapshot: ConfigSnapshot) -> Self {
        Self { current: ArcSwap::from_pointee(snapshot) }
    }

    /// the current snapshot. cheap enough to call per request.
    pub fn load(&self) -> arc_swap::Guard<Arc<ConfigSnapshot>> {
        self.current.load()
    }

    /// take a full owned handle, for work that outlives the request
    pub fn snapshot(&self) -> Arc<ConfigSnapshot> {
        self.current.load_full()
    }

    /// publish a new snapshot. every subsequent read sees it.
    pub fn store(&self, snapshot: ConfigSnapshot) {
        self.current.store(Arc::new(snapshot));
    }

    /// reload from the path the current snapshot came from
    pub fn reload_from(&self, path: impl AsRef<Path>) -> Result<u64, LoadError> {
        let snapshot = load_from_path(path)?;
        let revision = snapshot.revision;
        self.store(snapshot);
        Ok(revision)
    }

    pub fn revision(&self) -> u64 {
        self.current.load().revision
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    const SAMPLE: &str = r#"{
      "tamaguiConfig": {
        "onlyAllowShorthands": false,
        "shorthands": { "bg": "backgroundColor", "p": "padding" },
        "media": { "sm": { "maxWidth": 860 } },
        "tokens": {
          "space": {
            "2": { "isVar": true, "key": "2", "val": 7, "variable": "var(--c-space-2)" },
            "10": { "isVar": true, "key": "10", "val": 40, "variable": "var(--c-space-10)" }
          }
        },
        "themes": {
          "light": { "background": "rgba(255, 255, 255, 1)", "color": "rgba(0, 0, 0, 1)" },
          "dark":  { "background": "rgba(0, 0, 0, 1)", "color": "rgba(255, 255, 255, 1)" }
        }
      }
    }"#;

    #[test]
    fn loads_every_section() {
        let c = load_from_slice(SAMPLE.as_bytes()).unwrap();
        assert_eq!(c.themes.theme_count(), 2);
        assert_eq!(c.themes.key_count(), 2);
        assert_eq!(c.expand_shorthand("bg"), "backgroundColor");
        // an unmapped name passes through rather than resolving to nothing
        assert_eq!(c.expand_shorthand("backgroundColor"), "backgroundColor");
        assert!(c.media_query("sm").unwrap().contains("860"));
        assert_eq!(
            c.themes.value_by_name("dark", "background").unwrap().rgba,
            Some(Rgba::new(0, 0, 0, 255))
        );
    }

    #[test]
    fn resolves_colors_in_every_spelling_a_config_can_author() {
        // tamagui used to rewrite every theme value to `rgba(...)` in
        // `ensureThemeVariable`. that normalisation was removed to drop
        // `normalize-css-color` from the web bundle, so values now reach the
        // artifact exactly as authored, and the theme sources emit hsla far
        // more often than rgba. this walks the real load path rather than
        // `color::parse` alone, since it is the loader that fills `rgba`.
        // `r##` because a hex colour would otherwise close an `r#` string
        const MIXED: &str = r##"{
          "tamaguiConfig": {
            "themes": {
              "light": {
                "hsl": "hsla(0, 0%, 10%, 1)",
                "hex": "#090909",
                "rgb": "rgba(255,255,255,1)",
                "named": "white",
                "clear": "transparent",
                "notacolor": "linear-gradient(red, blue)"
              }
            }
          }
        }"##;
        let c = load_from_slice(MIXED.as_bytes()).unwrap();
        let rgba = |k: &str| c.themes.value_by_name("light", k).unwrap().rgba;
        assert_eq!(rgba("hsl"), Some(Rgba::new(26, 26, 26, 255)));
        assert_eq!(rgba("hex"), Some(Rgba::new(9, 9, 9, 255)));
        assert_eq!(rgba("rgb"), Some(Rgba::new(255, 255, 255, 255)));
        assert_eq!(rgba("named"), Some(Rgba::new(255, 255, 255, 255)));
        assert_eq!(rgba("clear"), Some(Rgba::new(0, 0, 0, 0)));
        // a non-colour still loads as a value, it just gets no swatch
        assert_eq!(rgba("notacolor"), None);
        assert!(c.themes.value_by_name("light", "notacolor").is_some());
    }

    #[test]
    fn token_keys_sort_numerically_not_lexically() {
        let c = load_from_slice(SAMPLE.as_bytes()).unwrap();
        let space = c.token_category("space").unwrap();
        // lexical order would put "10" before "2"
        assert_eq!(&*space[0].key, "2");
        assert_eq!(&*space[1].key, "10");
        assert_eq!(&*space[1].value, "40");
    }

    #[test]
    fn token_ordering_is_a_total_order() {
        // the real artifact's `true` key alongside numeric keys made an
        // earlier mixed numeric/lexical comparator intransitive, which Rust's
        // sort detects and panics on. exhaustively check the three laws over a
        // set containing both kinds.
        let keys = ["2", "10", "1a", "true", "01", "0", "-1", "9"];
        for a in keys {
            for b in keys {
                // antisymmetry
                assert_eq!(natural_cmp(a, b), natural_cmp(b, a).reverse(), "{a} vs {b}");
                for c in keys {
                    // transitivity
                    if natural_cmp(a, b).is_lt() && natural_cmp(b, c).is_lt() {
                        assert!(natural_cmp(a, c).is_lt(), "{a} < {b} < {c} but not {a} < {c}");
                    }
                }
            }
        }
        // and it still does the thing it exists for
        let mut sorted = vec!["10", "2", "true", "1"];
        sorted.sort_by(|a, b| natural_cmp(a, b));
        assert_eq!(sorted, vec!["1", "2", "10", "true"]);
    }

    #[test]
    fn a_missing_config_key_is_an_error_not_an_empty_config() {
        // an empty snapshot would silently disable every diagnostic, so the
        // caller has to be told the compiler never ran
        let err = load_from_slice(br#"{"components":[]}"#);
        assert!(matches!(err, Err(LoadError::MissingConfig)));
    }

    #[test]
    fn handle_publishes_a_new_snapshot_to_later_readers() {
        let handle = ConfigHandle::new(load_from_slice(SAMPLE.as_bytes()).unwrap());
        let before = handle.load().revision;
        // a reader that took a snapshot keeps its own consistent view
        let pinned = handle.snapshot();
        handle.store(load_from_slice(SAMPLE.as_bytes()).unwrap());
        assert!(handle.load().revision > before);
        assert_eq!(pinned.revision, before);
    }
}
