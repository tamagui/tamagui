// colour parsing for theme values.
//
// a real config artifact holds 271,872 theme values (577 distinct in
// tamagui.dev), so this runs once per DISTINCT value at load and never again.
// it is hand-rolled rather than regex-backed: a regex engine costs more to
// construct than this costs to run.
//
// values arrive in whatever spelling the config author used. tamagui used to
// rewrite every one to `rgba(r, g, b, a)` in `ensureThemeVariable`, but
// `normalizeThemeValue` was deleted to drop `normalize-css-color` from the web
// bundle, so they now pass through verbatim. the theme sources emit hsla 1,821
// times, hex 579 and rgba 91, which is why hsl support here is load-bearing
// rather than a nicety: without it the majority of a v5-subtle theme would
// silently render no colour decorator at all.

/// a color packed into 4 bytes. the whole palette for a real config is 577 of
/// these, so it stays resident in L1 alongside the lookup matrix.
#[derive(Clone, Copy, PartialEq, Eq, Debug, Default)]
pub struct Rgba {
    pub r: u8,
    pub g: u8,
    pub b: u8,
    /// alpha as 0..=255, so the whole struct is 4 bytes and Copy
    pub a: u8,
}

impl Rgba {
    pub const fn new(r: u8, g: u8, b: u8, a: u8) -> Self {
        Self { r, g, b, a }
    }

    /// alpha as the 0.0..=1.0 float the LSP color API wants
    pub fn alpha_f32(self) -> f32 {
        self.a as f32 / 255.0
    }

    /// scale alpha by a percentage, for the `color/50` opacity suffix
    pub fn with_opacity_percent(self, percent: f32) -> Self {
        let scaled = (self.a as f32) * (percent / 100.0);
        Self { a: scaled.round().clamp(0.0, 255.0) as u8, ..self }
    }
}

/// parse `rgb()`, `rgba()`, `hsl()`, `hsla()`, `#rgb`, `#rgba`, `#rrggbb`,
/// `#rrggbbaa` and the CSS named colours, in both the legacy comma syntax and
/// the modern `a b c / alpha` syntax.
///
/// returns None for anything else (gradients, `url(...)`, `currentColor`),
/// which the caller keeps as a non-colour value rather than guessing at one.
pub fn parse(input: &str) -> Option<Rgba> {
    let s = input.trim();
    if let Some(hex) = s.strip_prefix('#') {
        return parse_hex(hex);
    }
    let Some(open) = s.find('(') else {
        return named(s);
    };
    let name = s[..open].trim_end();
    let close = s.rfind(')')?;
    if close < open {
        return None;
    }

    let (args, slash_alpha) = split_args(&s[open + 1..close]);
    // legacy `f(a, b, c, d)` puts alpha last; modern `f(a b c / d)` splits it
    // off. anything else is malformed and rejected outright.
    let (channels, alpha_raw) = match (args.len(), slash_alpha) {
        (3, alpha) => (&args[..3], alpha),
        (4, None) => (&args[..3], Some(args[3])),
        _ => return None,
    };
    // a missing alpha is opaque; a present-but-unparseable one is a malformed
    // colour, so the whole value is rejected rather than silently rendered at
    // full opacity
    let a = match alpha_raw {
        None => 255,
        Some(raw) => alpha(raw)?,
    };

    if name.eq_ignore_ascii_case("rgb") || name.eq_ignore_ascii_case("rgba") {
        return Some(Rgba::new(
            channel(channels[0])?,
            channel(channels[1])?,
            channel(channels[2])?,
            a,
        ));
    }
    if name.eq_ignore_ascii_case("hsl") || name.eq_ignore_ascii_case("hsla") {
        let (r, g, b) = hsl_to_rgb(hue(channels[0])?, percent(channels[1])?, percent(channels[2])?);
        return Some(Rgba::new(r, g, b, a));
    }
    None
}

/// split a function's arguments, accepting both `a, b, c` and `a b c`, and
/// returning any `/ alpha` separately
fn split_args(inner: &str) -> (Vec<&str>, Option<&str>) {
    let (head, alpha) = match inner.split_once('/') {
        Some((h, a)) => (h, Some(a.trim())),
        None => (inner, None),
    };
    let parts = head
        .split(|ch: char| ch == ',' || ch.is_ascii_whitespace())
        .map(str::trim)
        .filter(|p| !p.is_empty())
        .collect();
    (parts, alpha)
}

/// a CSS named colour, matched case-insensitively without allocating
fn named(name: &str) -> Option<Rgba> {
    // longest entry is `lightgoldenrodyellow` at 20 bytes
    let mut buf = [0u8; 24];
    if name.is_empty() || name.len() > buf.len() {
        return None;
    }
    for (slot, byte) in buf.iter_mut().zip(name.bytes()) {
        if !byte.is_ascii_alphabetic() {
            return None;
        }
        *slot = byte.to_ascii_lowercase();
    }
    let key = std::str::from_utf8(&buf[..name.len()]).ok()?;
    let idx = crate::color_names::NAMED
        .binary_search_by(|(n, _)| (*n).cmp(key))
        .ok()?;
    Some(crate::color_names::NAMED[idx].1)
}

/// a hue in degrees, accepting the `deg`, `grad`, `rad` and `turn` units
fn hue(raw: &str) -> Option<f32> {
    let t = raw.trim();
    // `grad` must be tested before `rad`, or `100grad` strips to `100g`
    let (num, scale) = if let Some(v) = t.strip_suffix("deg") {
        (v, 1.0)
    } else if let Some(v) = t.strip_suffix("turn") {
        (v, 360.0)
    } else if let Some(v) = t.strip_suffix("grad") {
        (v, 0.9)
    } else if let Some(v) = t.strip_suffix("rad") {
        (v, 180.0 / std::f32::consts::PI)
    } else {
        (t, 1.0)
    };
    let v: f32 = num.trim().parse().ok()?;
    Some(v * scale)
}

/// saturation and lightness, as 0.0..=1.0. the `%` is optional because both
/// spellings occur in the wild.
fn percent(raw: &str) -> Option<f32> {
    let t = raw.trim();
    let v: f32 = t.strip_suffix('%').unwrap_or(t).trim().parse().ok()?;
    Some((v / 100.0).clamp(0.0, 1.0))
}

fn hsl_to_rgb(h: f32, s: f32, l: f32) -> (u8, u8, u8) {
    // hue wraps, so `hsl(-60 ...)` and `hsl(300 ...)` agree
    let h = h.rem_euclid(360.0);
    let c = (1.0 - (2.0 * l - 1.0).abs()) * s;
    let x = c * (1.0 - ((h / 60.0) % 2.0 - 1.0).abs());
    let m = l - c / 2.0;
    let (r, g, b) = match (h / 60.0) as u32 {
        0 => (c, x, 0.0),
        1 => (x, c, 0.0),
        2 => (0.0, c, x),
        3 => (0.0, x, c),
        4 => (x, 0.0, c),
        _ => (c, 0.0, x),
    };
    let to_byte = |v: f32| ((v + m) * 255.0).round().clamp(0.0, 255.0) as u8;
    (to_byte(r), to_byte(g), to_byte(b))
}

/// a channel is either `0..=255` or a `0%..=100%` percentage
fn channel(raw: &str) -> Option<u8> {
    if let Some(pct) = raw.strip_suffix('%') {
        let v: f32 = pct.trim().parse().ok()?;
        return Some(((v / 100.0) * 255.0).round().clamp(0.0, 255.0) as u8);
    }
    let v: f32 = raw.parse().ok()?;
    Some(v.round().clamp(0.0, 255.0) as u8)
}

/// alpha is `0..=1`, or a percentage
fn alpha(raw: &str) -> Option<u8> {
    if let Some(pct) = raw.strip_suffix('%') {
        let v: f32 = pct.trim().parse().ok()?;
        return Some(((v / 100.0) * 255.0).round().clamp(0.0, 255.0) as u8);
    }
    let v: f32 = raw.parse().ok()?;
    Some((v * 255.0).round().clamp(0.0, 255.0) as u8)
}

fn parse_hex(hex: &str) -> Option<Rgba> {
    let b = hex.as_bytes();
    let nibble = |byte: u8| -> Option<u8> { (byte as char).to_digit(16).map(|d| d as u8) };
    // alpha defaults to opaque, so the 3- and 6-digit forms leave it untouched
    let mut c = [255u8; 4];
    match b.len() {
        3 | 4 => {
            for (slot, &byte) in c.iter_mut().zip(b) {
                let n = nibble(byte)?;
                *slot = n << 4 | n;
            }
        }
        6 | 8 => {
            for (slot, pair) in c.iter_mut().zip(b.chunks_exact(2)) {
                *slot = nibble(pair[0])? << 4 | nibble(pair[1])?;
            }
        }
        _ => return None,
    }
    Some(Rgba::new(c[0], c[1], c[2], c[3]))
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn parses_the_shape_real_configs_emit() {
        // the exact spelling in .tamagui/tamagui.config.json
        assert_eq!(parse("rgba(51, 51, 51, 1)"), Some(Rgba::new(51, 51, 51, 255)));
        assert_eq!(parse("rgba(10, 10, 10, 0)"), Some(Rgba::new(10, 10, 10, 0)));
        assert_eq!(parse("rgb(237, 237, 237)"), Some(Rgba::new(237, 237, 237, 255)));
    }

    #[test]
    fn parses_hex_forms() {
        assert_eq!(parse("#fff"), Some(Rgba::new(255, 255, 255, 255)));
        assert_eq!(parse("#ff0000"), Some(Rgba::new(255, 0, 0, 255)));
        assert_eq!(parse("#ff000080"), Some(Rgba::new(255, 0, 0, 128)));
        assert_eq!(parse("#f00f"), Some(Rgba::new(255, 0, 0, 255)));
    }

    #[test]
    fn rejects_non_colors_instead_of_guessing() {
        assert_eq!(parse("linear-gradient(red, blue)"), None);
        assert_eq!(parse("url(x.png)"), None);
        assert_eq!(parse("currentColor"), None);
        assert_eq!(parse("rgba(1, 2)"), None);
        assert_eq!(parse("rgba(1, 2, 3, 4, 5)"), None);
        // a malformed alpha rejects the colour rather than defaulting to opaque
        assert_eq!(parse("rgba(1, 2, 3, nope)"), None);
    }

    #[test]
    fn parses_the_hsl_the_theme_sources_actually_emit() {
        // `hsla(0, 0%, 10%, 1)` is the literal spelling in generated-v5-subtle,
        // and there are 1,821 hsl values across the theme sources against 91
        // rgba, so this is the common case rather than the exotic one
        assert_eq!(parse("hsla(0, 0%, 10%, 1)"), Some(Rgba::new(26, 26, 26, 255)));
        assert_eq!(parse("hsl(0, 0%, 100%)"), Some(Rgba::new(255, 255, 255, 255)));
        assert_eq!(parse("hsl(0, 100%, 50%)"), Some(Rgba::new(255, 0, 0, 255)));
        assert_eq!(parse("hsl(120, 100%, 50%)"), Some(Rgba::new(0, 255, 0, 255)));
        assert_eq!(parse("hsl(240, 100%, 50%)"), Some(Rgba::new(0, 0, 255, 255)));
        // every sixth-of-the-wheel boundary, since each takes a different arm
        assert_eq!(parse("hsl(60, 100%, 50%)"), Some(Rgba::new(255, 255, 0, 255)));
        assert_eq!(parse("hsl(180, 100%, 50%)"), Some(Rgba::new(0, 255, 255, 255)));
        assert_eq!(parse("hsl(300, 100%, 50%)"), Some(Rgba::new(255, 0, 255, 255)));
        // saturation 0 is grey at any hue
        assert_eq!(parse("hsl(210, 0%, 50%)"), Some(Rgba::new(128, 128, 128, 255)));
    }

    #[test]
    fn hue_accepts_css_angle_units_and_wraps() {
        let red = Some(Rgba::new(255, 0, 0, 255));
        assert_eq!(parse("hsl(0deg, 100%, 50%)"), red);
        assert_eq!(parse("hsl(0turn, 100%, 50%)"), red);
        assert_eq!(parse("hsl(360, 100%, 50%)"), red);
        // negative hues wrap rather than clamping to red
        assert_eq!(parse("hsl(-120, 100%, 50%)"), Some(Rgba::new(0, 0, 255, 255)));
        // `grad` must not be mistaken for `rad`: 100grad is 90 degrees
        assert_eq!(parse("hsl(100grad, 100%, 50%)"), parse("hsl(90, 100%, 50%)"));
        assert_eq!(parse("hsl(0.5turn, 100%, 50%)"), parse("hsl(180, 100%, 50%)"));
    }

    #[test]
    fn parses_modern_slash_alpha_syntax() {
        assert_eq!(parse("rgb(255 0 0 / 0.5)"), Some(Rgba::new(255, 0, 0, 128)));
        assert_eq!(parse("hsl(0 100% 50% / 50%)"), Some(Rgba::new(255, 0, 0, 128)));
        // space-separated with no alpha is opaque
        assert_eq!(parse("rgb(255 0 0)"), Some(Rgba::new(255, 0, 0, 255)));
    }

    #[test]
    fn parses_named_colors() {
        assert_eq!(parse("white"), Some(Rgba::new(255, 255, 255, 255)));
        assert_eq!(parse("red"), Some(Rgba::new(255, 0, 0, 255)));
        assert_eq!(parse("rebeccapurple"), Some(Rgba::new(102, 51, 153, 255)));
        // case-insensitive, like every other CSS keyword
        assert_eq!(parse("WhiteSmoke"), Some(Rgba::new(245, 245, 245, 255)));
        // transparent is the one named colour that is not opaque
        assert_eq!(parse("transparent"), Some(Rgba::new(0, 0, 0, 0)));
        assert_eq!(parse("notacolor"), None);
    }

    #[test]
    fn opacity_suffix_scales_existing_alpha() {
        let half = Rgba::new(10, 20, 30, 255).with_opacity_percent(50.0);
        assert_eq!(half.a, 128);
        // scaling an already-translucent colour compounds, matching the runtime
        let quarter = Rgba::new(10, 20, 30, 128).with_opacity_percent(50.0);
        assert_eq!(quarter.a, 64);
    }
}
