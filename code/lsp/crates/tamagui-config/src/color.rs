// rgba parsing for theme values.
//
// every value in a real config artifact is an `rgba(r, g, b, a)` / `rgb(r, g, b)`
// string (271,872 of them in tamagui.dev, 577 distinct), so this runs once per
// DISTINCT value at load and never again. it is still hand-rolled rather than
// regex-backed: a regex engine costs more to construct than this costs to run.

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

/// parse `rgb(r, g, b)`, `rgba(r, g, b, a)`, `#rgb`, `#rrggbb`, `#rrggbbaa`.
/// returns None for anything else (gradients, `url(...)`, keywords), which the
/// caller keeps as a non-colour value rather than guessing at one.
pub fn parse(input: &str) -> Option<Rgba> {
    let s = input.trim();
    if let Some(hex) = s.strip_prefix('#') {
        return parse_hex(hex);
    }
    let open = s.find('(')?;
    let name = s[..open].trim_end();
    if !name.eq_ignore_ascii_case("rgb") && !name.eq_ignore_ascii_case("rgba") {
        return None;
    }
    let close = s.rfind(')')?;
    if close < open {
        return None;
    }

    let mut parts = s[open + 1..close].split([',', '/']).map(str::trim);
    let r = channel(parts.next()?)?;
    let g = channel(parts.next()?)?;
    let b = channel(parts.next()?)?;
    let a = match parts.next() {
        // a missing alpha is opaque; a present-but-unparseable one is a
        // malformed colour, so the whole value is rejected rather than
        // silently rendered at full opacity
        None => 255,
        Some(raw) => alpha(raw)?,
    };
    if parts.next().is_some() {
        return None;
    }
    Some(Rgba::new(r, g, b, a))
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
    let nib = |i: usize| -> Option<u8> { (b[i] as char).to_digit(16).map(|d| d as u8) };
    match b.len() {
        3 | 4 => {
            let mut c = [255u8; 4];
            for i in 0..b.len() {
                let n = nib(i)?;
                c[i] = n << 4 | n;
            }
            Some(Rgba::new(c[0], c[1], c[2], c[3]))
        }
        6 | 8 => {
            let mut c = [255u8; 4];
            for i in 0..b.len() / 2 {
                c[i] = nib(i * 2)? << 4 | nib(i * 2 + 1)?;
            }
            Some(Rgba::new(c[0], c[1], c[2], c[3]))
        }
        _ => None,
    }
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
        assert_eq!(parse("transparent"), None);
        assert_eq!(parse("rgba(1, 2)"), None);
        assert_eq!(parse("rgba(1, 2, 3, 4, 5)"), None);
        // a malformed alpha rejects the colour rather than defaulting to opaque
        assert_eq!(parse("rgba(1, 2, 3, nope)"), None);
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
