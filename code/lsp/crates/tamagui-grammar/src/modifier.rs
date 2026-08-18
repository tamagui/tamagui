// The one global modifier namespace, built from a config snapshot.
//
// A port of `modifierRegistry.ts` in `@tamagui/style-grammar`, over the tables
// in `generated.rs`, which that package writes. There is a single namespace on
// purpose: a name may mean exactly one thing, so a config whose media key
// collides with a state or theme name loses the collision rather than making a
// silent choice. Registration order is state, media, platform, theme, and first
// registration wins.
//
// `tests/conformance.rs` checks every kind and every canonical spelling against
// vectors the grammar generates, which is how this stays a port rather than
// becoming a second opinion.

use rustc_hash::{FxHashMap, FxHashSet};
use tamagui_config::ConfigSnapshot;

use crate::generated::{
    CONTAINER_PREFIX, GROUP_PREFIX, MODIFIER_ALIASES, PLATFORM_MODIFIERS, STATE_MODIFIERS,
};

#[derive(Clone, Copy, PartialEq, Eq, Debug, Hash)]
pub enum ModifierKind {
    /// `hover`, `press`, `focus`, `open`, ...
    State,
    /// a configured media key, e.g. `sm`, `gtMd`
    Media,
    /// `web`, `native`, `ios`, `android`, ...
    Platform,
    /// a configured root theme name, e.g. `dark`
    Theme,
    /// `group-hover`, `group-hover/card`
    Group,
    /// `@sm`, `@sm/card`
    Container,
}

impl ModifierKind {
    pub fn as_str(self) -> &'static str {
        match self {
            Self::State => "state",
            Self::Media => "media",
            Self::Platform => "platform",
            Self::Theme => "theme",
            Self::Group => "group",
            Self::Container => "container",
        }
    }
}

/// What the parser needs to know about registered modifiers.
pub trait ModifierLookup {
    fn kind(&self, name: &str) -> Option<ModifierKind>;
}

/// the state a parent group must be in, and which group
#[derive(Clone, Debug, PartialEq, Eq)]
pub struct GroupModifier {
    pub state: String,
    /// None for the nearest unnamed group
    pub group: Option<String>,
}

/// the size condition and which container
#[derive(Clone, Debug, PartialEq, Eq)]
pub struct ContainerModifier {
    pub size: String,
    /// None for the nearest container
    pub container: Option<String>,
}

/// Theme conditions name a ROOT theme. Nested themes still inherit from that
/// root, so `dark:` applies within `dark_blue`, but `dark_blue:` is not a
/// condition of its own.
pub fn is_root_theme_name(name: &str) -> bool {
    !name.is_empty() && !name.contains('_')
}

/// the shared identifier rule for the parameterized parts of a modifier
fn is_modifier_name(text: &str) -> bool {
    !text.is_empty()
        && text
            .bytes()
            .all(|b| b.is_ascii_alphanumeric() || b == b'-' || b == b'_')
}

fn state_modifiers() -> &'static FxHashSet<&'static str> {
    static SET: std::sync::OnceLock<FxHashSet<&'static str>> = std::sync::OnceLock::new();
    SET.get_or_init(|| STATE_MODIFIERS.iter().copied().collect())
}

fn alias_of(name: &str) -> Option<&'static str> {
    MODIFIER_ALIASES
        .iter()
        .find(|(alias, _)| *alias == name)
        .map(|(_, canonical)| *canonical)
}

/// Parameterized group modifiers use Tailwind's spelling: `group-hover` for the
/// nearest unnamed group and `group-hover/card` for a named one. The state part
/// must be a built-in state modifier; the name part is an identifier.
pub fn parse_group_modifier(name: &str) -> Option<GroupModifier> {
    let rest = name.strip_prefix(GROUP_PREFIX)?;
    match rest.split_once('/') {
        None => state_modifiers()
            .contains(rest)
            .then(|| GroupModifier { state: rest.to_string(), group: None }),
        Some((state, group)) => {
            if !is_modifier_name(group) || !state_modifiers().contains(state) {
                return None;
            }
            Some(GroupModifier { state: state.to_string(), group: Some(group.to_string()) })
        }
    }
}

/// Container query modifiers own the `@` prefix: `@sm` targets the nearest
/// container and `@sm/card` a named one. Plain `sm:` stays a viewport media
/// query, which is why the prefix is reserved.
///
/// This parses the spelling only. Whether `size` names a registered media key
/// is config-dependent, so the registry checks that on lookup.
pub fn parse_container_modifier(name: &str) -> Option<ContainerModifier> {
    let rest = name.strip_prefix(CONTAINER_PREFIX)?;
    match rest.split_once('/') {
        None => is_modifier_name(rest)
            .then(|| ContainerModifier { size: rest.to_string(), container: None }),
        Some((size, container)) => {
            if !is_modifier_name(size) || !is_modifier_name(container) {
                return None;
            }
            Some(ContainerModifier {
                size: size.to_string(),
                container: Some(container.to_string()),
            })
        }
    }
}

/// Canonical spelling, used by slot identity, precedence, hashing and matching.
pub fn canonical_modifier(name: &str) -> String {
    if let Some(direct) = alias_of(name) {
        return direct.to_string();
    }
    if let Some(group) = parse_group_modifier(name) {
        if let Some(state) = alias_of(&group.state) {
            return match group.group {
                None => format!("{GROUP_PREFIX}{state}"),
                Some(named) => format!("{GROUP_PREFIX}{state}/{named}"),
            };
        }
    }
    name.to_string()
}

/// The registered names of one config, plus the parameterized rules resolved on
/// lookup.
pub struct ModifierRegistry {
    names: FxHashMap<Box<str>, ModifierKind>,
    container_sizes: FxHashSet<Box<str>>,
    /// registration order, which is the order completion offers them in
    completion: Vec<(Box<str>, ModifierKind)>,
    /// one line per name collision, in registration order
    pub diagnostics: Vec<String>,
}

impl ModifierRegistry {
    pub fn from_config(config: &ConfigSnapshot) -> Self {
        let media: Vec<&str> = config.media.iter().map(|(name, _)| &**name).collect();
        let themes: Vec<&str> = config.themes.theme_names().collect();
        // every configured media key is a container size until the artifact
        // says which ones measure a length; a `hover` media key measures
        // nothing a container has, and that distinction is not in the artifact
        Self::build(&media, &themes, &media)
    }

    pub fn build(media: &[&str], themes: &[&str], container_sizes: &[&str]) -> Self {
        let mut registry = Self {
            names: FxHashMap::default(),
            container_sizes: container_sizes.iter().map(|s| (*s).into()).collect(),
            completion: Vec::new(),
            diagnostics: Vec::new(),
        };
        for name in STATE_MODIFIERS {
            registry.register(name, ModifierKind::State);
        }
        for name in media {
            registry.register(name, ModifierKind::Media);
        }
        for name in PLATFORM_MODIFIERS {
            registry.register(name, ModifierKind::Platform);
        }
        for name in themes {
            if is_root_theme_name(name) {
                registry.register(name, ModifierKind::Theme);
            }
        }
        registry
    }

    fn register(&mut self, name: &str, kind: ModifierKind) {
        if name.starts_with(CONTAINER_PREFIX) {
            // the `@` prefix belongs to container queries, so no configured
            // name may take it; otherwise `@sm:` would mean two things
            self.diagnostics.push(format!(
                "modifier \"{name}\" is not registered: the \"{CONTAINER_PREFIX}\" prefix is reserved for container query modifiers, so it cannot be a {} name",
                kind.as_str()
            ));
            return;
        }
        if let Some(existing) = self.names.get(name) {
            if *existing != kind {
                self.diagnostics.push(format!(
                    "modifier \"{name}\" is already registered as a {} modifier, so the {} name is ignored",
                    existing.as_str(),
                    kind.as_str()
                ));
            }
            return;
        }
        if parse_group_modifier(name).is_some() {
            self.diagnostics.push(format!(
                "modifier \"{name}\" shadows the group modifier of the same spelling, which can no longer be used as a {} name",
                kind.as_str()
            ));
        }
        self.names.insert(name.into(), kind);
        self.completion.push((name.into(), kind));
    }

    /// every name completion may offer, including the parameterized forms an
    /// author writes but the registry never stores
    pub fn completion_names(&self) -> Vec<(String, ModifierKind)> {
        let mut out: Vec<(String, ModifierKind)> = self
            .completion
            .iter()
            // an alias is a spelling, not a second modifier, so it is not offered
            .filter(|(name, _)| alias_of(name).is_none())
            .map(|(name, kind)| (name.to_string(), *kind))
            .collect();
        for name in STATE_MODIFIERS {
            if alias_of(name).is_some() {
                continue;
            }
            let group = format!("{GROUP_PREFIX}{name}");
            if !self.names.contains_key(group.as_str()) {
                out.push((group, ModifierKind::Group));
            }
        }
        for size in &self.container_sizes {
            if self.is_container_size(size) {
                out.push((format!("{CONTAINER_PREFIX}{size}"), ModifierKind::Container));
            }
        }
        out
    }

    fn is_container_size(&self, size: &str) -> bool {
        self.container_sizes.contains(size)
    }
}

impl ModifierLookup for ModifierRegistry {
    fn kind(&self, name: &str) -> Option<ModifierKind> {
        if let Some(kind) = self.names.get(name) {
            return Some(*kind);
        }
        if parse_group_modifier(name).is_some() {
            return Some(ModifierKind::Group);
        }
        match parse_container_modifier(name) {
            Some(container) if self.is_container_size(&container.size) => {
                Some(ModifierKind::Container)
            }
            _ => None,
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    fn registry() -> ModifierRegistry {
        ModifierRegistry::build(&["sm", "md"], &["light", "dark", "dark_blue"], &["sm", "md"])
    }

    #[test]
    fn every_kind_resolves_from_its_spelling() {
        let r = registry();
        assert_eq!(r.kind("hover"), Some(ModifierKind::State));
        assert_eq!(r.kind("open"), Some(ModifierKind::State));
        assert_eq!(r.kind("sm"), Some(ModifierKind::Media));
        assert_eq!(r.kind("ios"), Some(ModifierKind::Platform));
        assert_eq!(r.kind("dark"), Some(ModifierKind::Theme));
        assert_eq!(r.kind("group-hover"), Some(ModifierKind::Group));
        assert_eq!(r.kind("group-hover/card"), Some(ModifierKind::Group));
        assert_eq!(r.kind("@sm"), Some(ModifierKind::Container));
        assert_eq!(r.kind("@sm/card"), Some(ModifierKind::Container));
    }

    #[test]
    fn a_nested_theme_is_not_a_condition_of_its_own() {
        assert_eq!(registry().kind("dark_blue"), None);
    }

    #[test]
    fn an_unknown_name_is_refused_rather_than_guessed() {
        let r = registry();
        assert_eq!(r.kind("hver"), None);
        assert_eq!(r.kind("group-wobble"), None);
        // `xl` is not a media key in this config, so `@xl` measures nothing
        assert_eq!(r.kind("@xl"), None);
    }

    #[test]
    fn aliases_fold_into_one_spelling() {
        assert_eq!(canonical_modifier("active"), "press");
        assert_eq!(canonical_modifier("pressed"), "press");
        assert_eq!(canonical_modifier("starting"), "enter");
        assert_eq!(canonical_modifier("ending"), "exit");
        assert_eq!(canonical_modifier("group-active/card"), "group-press/card");
        assert_eq!(canonical_modifier("hover"), "hover");
    }

    #[test]
    fn completion_offers_canonical_spellings_and_the_parameterized_forms() {
        let names: Vec<String> =
            registry().completion_names().into_iter().map(|(name, _)| name).collect();
        assert!(names.contains(&"hover".to_string()));
        assert!(names.contains(&"group-hover".to_string()));
        assert!(names.contains(&"@sm".to_string()));
        assert!(names.contains(&"dark".to_string()));
        // an alias is a spelling of `press`, not a second thing to offer
        assert!(!names.contains(&"active".to_string()));
        assert!(!names.contains(&"dark_blue".to_string()));
    }
}
