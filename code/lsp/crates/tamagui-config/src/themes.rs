// The dense theme matrix.
//
// Why this shape. A real config artifact (code/tamagui.dev) carries 1,152
// themes x 236 keys = 271,872 entries in 13.5 MB of JSON, and measuring it
// showed two properties that decide the layout:
//
//   * there is exactly ONE key-set signature. every theme declares the identical
//     236 keys, so the table is perfectly rectangular. no per-theme key storage,
//     no hashing on lookup, no sparsity handling.
//   * only 577 of the 271,872 values are distinct. a cell can therefore be an
//     index into a small palette instead of a string.
//
// So the matrix is `themes x keys` of ValueId, and lookup is one multiply plus
// two indexed loads. At current scale that is ~1.1 MB of cells plus a 577-entry
// palette, against ~13.5 MB of JSON text and the far larger object graph a
// JS `JSON.parse` of the same file produces.
//
// The layout is row-major by theme because every access pattern we have reads
// several keys of ONE theme (hover shows a token across a few preview themes,
// a swatch resolves one key in the active theme), so a theme's row stays hot.

use rustc_hash::FxHashMap;

use crate::color::Rgba;

/// index of a theme, e.g. `dark_accent_Button`
#[derive(Clone, Copy, PartialEq, Eq, PartialOrd, Ord, Debug, Hash)]
pub struct ThemeId(pub u32);

/// index of a theme key, e.g. `background`, `accent-color`
#[derive(Clone, Copy, PartialEq, Eq, PartialOrd, Ord, Debug, Hash)]
pub struct KeyId(pub u32);

/// index into the palette. u32 rather than u16 so the structure is correct for
/// any config, not just ones that happen to stay under 65,536 distinct values.
#[derive(Clone, Copy, PartialEq, Eq, Debug, Default)]
pub struct ValueId(pub u32);

/// a distinct theme value: the text as authored, plus its colour when it is one
#[derive(Clone, Debug)]
pub struct ThemeValue {
    pub raw: Box<str>,
    /// None for values that are not colours (gradients, keywords)
    pub rgba: Option<Rgba>,
}

#[derive(Debug, Default)]
pub struct ThemeMatrix {
    theme_names: Vec<Box<str>>,
    theme_lookup: FxHashMap<Box<str>, ThemeId>,
    key_names: Vec<Box<str>>,
    key_lookup: FxHashMap<Box<str>, KeyId>,
    palette: Vec<ThemeValue>,
    /// themes.len() * key_names.len(), row-major by theme
    cells: Vec<ValueId>,
    /// sentinel for a theme that omits a key the matrix knows about
    missing: ValueId,
}

impl ThemeMatrix {
    pub fn theme_count(&self) -> usize {
        self.theme_names.len()
    }

    pub fn key_count(&self) -> usize {
        self.key_names.len()
    }

    pub fn palette_len(&self) -> usize {
        self.palette.len()
    }

    /// bytes held by the cell matrix, for the load log
    pub fn cells_bytes(&self) -> usize {
        self.cells.len() * size_of::<ValueId>()
    }

    pub fn theme_id(&self, name: &str) -> Option<ThemeId> {
        self.theme_lookup.get(name).copied()
    }

    pub fn key_id(&self, name: &str) -> Option<KeyId> {
        self.key_lookup.get(name).copied()
    }

    pub fn theme_name(&self, theme: ThemeId) -> &str {
        &self.theme_names[theme.0 as usize]
    }

    pub fn key_name(&self, key: KeyId) -> &str {
        &self.key_names[key.0 as usize]
    }

    pub fn theme_names(&self) -> impl Iterator<Item = &str> {
        self.theme_names.iter().map(|n| &**n)
    }

    pub fn key_names(&self) -> impl Iterator<Item = &str> {
        self.key_names.iter().map(|n| &**n)
    }

    /// the whole point: one multiply, two indexed loads, no hashing
    pub fn value(&self, theme: ThemeId, key: KeyId) -> Option<&ThemeValue> {
        let idx = theme.0 as usize * self.key_names.len() + key.0 as usize;
        let value = *self.cells.get(idx)?;
        if value == self.missing {
            return None;
        }
        self.palette.get(value.0 as usize)
    }

    /// resolve by name, for callers that have not interned yet
    pub fn value_by_name(&self, theme: &str, key: &str) -> Option<&ThemeValue> {
        self.value(self.theme_id(theme)?, self.key_id(key)?)
    }

    /// does any theme define this key? drives "is this token name real"
    pub fn has_key(&self, key: &str) -> bool {
        self.key_lookup.contains_key(key)
    }
}

/// Builds a [`ThemeMatrix`] in one streaming pass.
///
/// Values are interned as they arrive, so the 271,872 strings in a real config
/// collapse to 577 allocations. Keys are assigned ids in first-seen order; a
/// theme that introduces a new key widens the matrix, which keeps the builder
/// correct for irregular configs while costing nothing for the rectangular
/// ones we actually see.
pub struct ThemeMatrixBuilder {
    theme_names: Vec<Box<str>>,
    theme_lookup: FxHashMap<Box<str>, ThemeId>,
    key_names: Vec<Box<str>>,
    key_lookup: FxHashMap<Box<str>, KeyId>,
    palette: Vec<ThemeValue>,
    value_lookup: FxHashMap<Box<str>, ValueId>,
    /// one row per theme, each as (KeyId, ValueId) pairs, flattened at finish
    rows: Vec<Vec<(KeyId, ValueId)>>,
}

impl Default for ThemeMatrixBuilder {
    fn default() -> Self {
        Self::new()
    }
}

impl ThemeMatrixBuilder {
    pub fn new() -> Self {
        Self {
            theme_names: Vec::new(),
            theme_lookup: FxHashMap::default(),
            key_names: Vec::new(),
            key_lookup: FxHashMap::default(),
            palette: Vec::new(),
            value_lookup: FxHashMap::default(),
            rows: Vec::new(),
        }
    }

    /// hint the expected theme count so the row vector allocates once
    pub fn reserve_themes(&mut self, themes: usize) {
        self.theme_names.reserve(themes);
        self.rows.reserve(themes);
    }

    pub fn begin_theme(&mut self, name: &str) -> ThemeId {
        if let Some(existing) = self.theme_lookup.get(name) {
            return *existing;
        }
        let id = ThemeId(self.theme_names.len() as u32);
        let boxed: Box<str> = name.into();
        self.theme_names.push(boxed.clone());
        self.theme_lookup.insert(boxed, id);
        self.rows.push(Vec::new());
        id
    }

    pub fn push(&mut self, theme: ThemeId, key: &str, value: &str) {
        let key_id = match self.key_lookup.get(key) {
            Some(id) => *id,
            None => {
                let id = KeyId(self.key_names.len() as u32);
                let boxed: Box<str> = key.into();
                self.key_names.push(boxed.clone());
                self.key_lookup.insert(boxed, id);
                id
            }
        };
        let value_id = match self.value_lookup.get(value) {
            Some(id) => *id,
            None => {
                let id = ValueId(self.palette.len() as u32);
                let boxed: Box<str> = value.into();
                self.palette.push(ThemeValue {
                    raw: boxed.clone(),
                    rgba: crate::color::parse(value),
                });
                self.value_lookup.insert(boxed, id);
                id
            }
        };
        self.rows[theme.0 as usize].push((key_id, value_id));
    }

    pub fn finish(mut self) -> ThemeMatrix {
        // the sentinel lives in the palette so a cell is always a valid index
        let missing = ValueId(self.palette.len() as u32);
        self.palette.push(ThemeValue { raw: "".into(), rgba: None });

        let keys = self.key_names.len();
        let themes = self.theme_names.len();
        let mut cells = vec![missing; themes * keys];
        for (theme_idx, row) in self.rows.iter().enumerate() {
            let base = theme_idx * keys;
            for (key, value) in row {
                cells[base + key.0 as usize] = *value;
            }
        }

        ThemeMatrix {
            theme_names: self.theme_names,
            theme_lookup: self.theme_lookup,
            key_names: self.key_names,
            key_lookup: self.key_lookup,
            palette: self.palette,
            cells,
            missing,
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    fn build(pairs: &[(&str, &[(&str, &str)])]) -> ThemeMatrix {
        let mut b = ThemeMatrixBuilder::new();
        for (theme, entries) in pairs {
            let id = b.begin_theme(theme);
            for (k, v) in *entries {
                b.push(id, k, v);
            }
        }
        b.finish()
    }

    #[test]
    fn resolves_values_across_themes() {
        let m = build(&[
            ("light", &[("background", "rgba(255, 255, 255, 1)"), ("color", "rgba(0, 0, 0, 1)")]),
            ("dark", &[("background", "rgba(0, 0, 0, 1)"), ("color", "rgba(255, 255, 255, 1)")]),
        ]);
        assert_eq!(m.theme_count(), 2);
        assert_eq!(m.key_count(), 2);
        let light_bg = m.value_by_name("light", "background").unwrap();
        assert_eq!(light_bg.rgba, Some(Rgba::new(255, 255, 255, 255)));
        let dark_bg = m.value_by_name("dark", "background").unwrap();
        assert_eq!(dark_bg.rgba, Some(Rgba::new(0, 0, 0, 255)));
    }

    #[test]
    fn interns_repeated_values_once() {
        // the real config repeats 577 distinct values across 271,872 cells, so
        // the palette must be keyed by value and not by cell
        let m = build(&[
            ("a", &[("x", "rgba(1, 1, 1, 1)"), ("y", "rgba(1, 1, 1, 1)")]),
            ("b", &[("x", "rgba(1, 1, 1, 1)"), ("y", "rgba(1, 1, 1, 1)")]),
        ]);
        // one distinct value, plus the missing sentinel
        assert_eq!(m.palette_len(), 2);
    }

    #[test]
    fn a_theme_missing_a_key_reads_as_absent_not_as_a_neighbours_value() {
        // the failure this guards: without a sentinel, `sparse.color` would
        // read whatever byte pattern sat in the unfilled cell
        let m = build(&[
            ("full", &[("background", "rgba(1, 1, 1, 1)"), ("color", "rgba(2, 2, 2, 1)")]),
            ("sparse", &[("background", "rgba(3, 3, 3, 1)")]),
        ]);
        assert!(m.value_by_name("sparse", "background").is_some());
        assert!(m.value_by_name("sparse", "color").is_none());
    }

    #[test]
    fn a_key_introduced_by_a_later_theme_widens_every_row() {
        let m = build(&[
            ("first", &[("a", "rgba(1, 1, 1, 1)")]),
            ("second", &[("a", "rgba(1, 1, 1, 1)"), ("b", "rgba(2, 2, 2, 1)")]),
        ]);
        assert_eq!(m.key_count(), 2);
        // the earlier theme must not read into the later theme's row
        assert!(m.value_by_name("first", "b").is_none());
        assert!(m.value_by_name("second", "b").is_some());
    }

    #[test]
    fn unknown_names_resolve_to_nothing() {
        let m = build(&[("light", &[("background", "rgba(1, 1, 1, 1)")])]);
        assert!(m.value_by_name("nope", "background").is_none());
        assert!(m.value_by_name("light", "nope").is_none());
        assert!(!m.has_key("nope"));
    }
}
