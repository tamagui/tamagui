// The flat value parser.
//
// V3 moved conditional styling into the property's value:
//
//     bg="background hover:background-hover"
//     p="4 sm:6"
//     opacity="press:0.7"
//     transform="dark:hover:scale(1.1)"
//
// The grammar is `value := base? clause*`, and a clause is one or more
// `modifier:` prefixes followed by a payload. The design record's decision 19 is
// what makes it unambiguous without escaping: a top-level colon is never valid
// inside a CSS value.
//
// This is a port of `valueParser.ts` in `@tamagui/style-grammar`, which owns
// what a value MEANS; the crate is an editor transport and never a second owner.
// `tests/conformance.rs` runs the vectors that package generates, so the two are
// checked against each other rather than trusted to look alike. Three rules this
// file used to get wrong, each now a vector:
//
//   - a payload runs to the next CLAUSE word, not to the next space, so
//     `hover:1px solid red` is one clause and not three.
//   - `[` and `{` are not nesting. A top-level `{`, `}` or `;` is refused
//     outright, because those are what let a payload escape its declaration.
//   - a top-level backslash escapes the next character.
//
// Every span is a byte range into the original value, because the LSP needs to
// map results back to exact document positions. The grammar's indices are
// UTF-16 units and these are bytes; they agree over the ASCII the vectors use,
// and a non-ASCII value can only differ in the numbers, never in the split,
// because no character the scanner treats as structural is multi-byte.

use crate::modifier::{ModifierKind, ModifierLookup};

/// a byte range within the authored value
#[derive(Clone, Copy, PartialEq, Eq, Debug)]
pub struct Span {
    pub start: usize,
    pub end: usize,
}

impl Span {
    pub fn new(start: usize, end: usize) -> Self {
        Self { start, end }
    }

    pub fn of<'a>(&self, source: &'a str) -> &'a str {
        &source[self.start..self.end]
    }

    pub fn contains(&self, offset: usize) -> bool {
        offset >= self.start && offset <= self.end
    }

    pub fn len(&self) -> usize {
        self.end - self.start
    }

    pub fn is_empty(&self) -> bool {
        self.start == self.end
    }
}

/// one `modifier:` prefix, without its colon
#[derive(Clone, Copy, PartialEq, Eq, Debug)]
pub struct Modifier {
    pub span: Span,
}

/// one clause: its modifier chain and the payload that chain applies to
#[derive(Clone, Debug)]
pub struct Clause {
    /// the whole clause, from the first modifier to the end of its payload
    pub span: Span,
    /// modifiers in authored order, e.g. `dark`, `hover` for `dark:hover:x`
    pub modifiers: Vec<Modifier>,
    /// everything after the chain, trimmed. Empty for a trailing `hover:`,
    /// which is both a parse error and exactly the state the cursor is in
    /// mid-typing, so completion still sees the clause.
    pub payload: Span,
}

#[derive(Clone, Copy, PartialEq, Eq, Debug)]
pub enum ParseErrorCode {
    InvalidCharacter,
    UnterminatedString,
    UnterminatedFunction,
    UnterminatedComment,
    StrayCommentClose,
    UnregisteredModifier,
    EmptyModifier,
    EmptyPayload,
}

impl ParseErrorCode {
    /// the grammar's own spelling, which is what the vectors carry
    pub fn as_str(self) -> &'static str {
        match self {
            Self::InvalidCharacter => "invalid-character",
            Self::UnterminatedString => "unterminated-string",
            Self::UnterminatedFunction => "unterminated-function",
            Self::UnterminatedComment => "unterminated-comment",
            Self::StrayCommentClose => "stray-comment-close",
            Self::UnregisteredModifier => "unregistered-modifier",
            Self::EmptyModifier => "empty-modifier",
            Self::EmptyPayload => "empty-payload",
        }
    }
}

#[derive(Clone, Copy, PartialEq, Eq, Debug)]
pub struct ParseError {
    pub code: ParseErrorCode,
    pub index: usize,
    /// the offending name, for an unregistered modifier
    pub modifier: Option<Span>,
}

#[derive(Clone, Debug, Default)]
pub struct FlatValue {
    /// the unconditional value, trimmed. None when there is none.
    pub base: Option<Span>,
    pub clauses: Vec<Clause>,
    /// in the same order the grammar reports them
    pub errors: Vec<ParseError>,
}

impl FlatValue {
    pub fn is_ok(&self) -> bool {
        self.errors.is_empty()
    }

    /// the clause containing `offset`, for cursor-driven features
    pub fn clause_at(&self, offset: usize) -> Option<&Clause> {
        self.clauses.iter().find(|c| c.span.contains(offset))
    }

    /// the modifier containing `offset`, which is the one completion position
    /// that is a name rather than a value
    pub fn modifier_at(&self, offset: usize) -> Option<&Modifier> {
        self.clauses
            .iter()
            .flat_map(|c| c.modifiers.iter())
            .find(|m| m.span.contains(offset))
    }

    /// the base and every payload, in source order. These are the spans whose
    /// WORDS are token or theme names.
    pub fn payloads(&self) -> impl Iterator<Item = Span> + '_ {
        self.base
            .into_iter()
            .chain(self.clauses.iter().map(|c| c.payload))
    }
}

fn is_whitespace(byte: u8) -> bool {
    matches!(byte, b' ' | b'\t' | b'\n' | b'\r' | 0x0c)
}

/// `index` points at the `(`. A url token is the ident `url` followed directly
/// by it, with no ident character before the `u` (`myurl(` is an ordinary
/// function) and no quote after it (`url("a")` is one too). It is the one
/// function CSS does not tokenize the contents of, so the lexer has to tell the
/// two apart before deciding whether a `/*` or a quote inside means anything.
fn opens_url_token(bytes: &[u8], index: usize) -> bool {
    if index < 3 {
        return false;
    }
    if bytes[index - 3] | 32 != b'u' || bytes[index - 2] | 32 != b'r' || bytes[index - 1] | 32 != b'l'
    {
        return false;
    }
    let before = if index > 3 { bytes[index - 4] } else { 0 };
    if before == b'-'
        || before == b'_'
        || before >= 128
        || before.is_ascii_digit()
        || before.is_ascii_alphabetic()
    {
        return false;
    }
    let mut next = index + 1;
    while next < bytes.len() && bytes[next] <= 32 {
        next += 1;
    }
    match bytes.get(next) {
        Some(&b'"') | Some(&b'\'') => false,
        _ => true,
    }
}

/// Parse without a registry: the split and the structural errors, with every
/// modifier accepted. This is what completion wants, because a half-typed
/// modifier is not yet wrong.
pub fn parse(value: &str) -> FlatValue {
    struct AcceptAll;
    impl ModifierLookup for AcceptAll {
        fn kind(&self, _name: &str) -> Option<ModifierKind> {
            Some(ModifierKind::State)
        }
    }
    parse_with(value, &AcceptAll)
}

/// Parse and check every modifier against `registry`, producing the grammar's
/// full error list in the grammar's order.
pub fn parse_with(value: &str, registry: &dyn ModifierLookup) -> FlatValue {
    let mut parser = Parser {
        value,
        bytes: value.as_bytes(),
        registry,
        out: FlatValue::default(),
        pending: None,
        clause_start: 0,
        segment_start: 0,
    };
    parser.run();
    parser.out
}

struct Parser<'a> {
    value: &'a str,
    bytes: &'a [u8],
    registry: &'a dyn ModifierLookup,
    out: FlatValue,
    /// the modifier chain whose payload is currently being collected
    pending: Option<Vec<Modifier>>,
    /// where that chain started, so the clause span covers it
    clause_start: usize,
    /// where the base, or the current payload, starts before trimming
    segment_start: usize,
}

impl<'a> Parser<'a> {
    fn error(&mut self, code: ParseErrorCode, index: usize) {
        self.out.errors.push(ParseError { code, index, modifier: None });
    }

    /// closes the base (before any clause) or the payload of the pending clause
    fn close_segment(&mut self, end: usize) {
        let mut start = self.segment_start;
        let mut stop = end;
        while start < stop && is_whitespace(self.bytes[start]) {
            start += 1;
        }
        while stop > start && is_whitespace(self.bytes[stop - 1]) {
            stop -= 1;
        }
        let Some(modifiers) = self.pending.take() else {
            self.out.base = if start < stop { Some(Span::new(start, stop)) } else { None };
            return;
        };
        if start >= stop {
            self.error(ParseErrorCode::EmptyPayload, self.segment_start);
            // the clause still exists for the cursor, which is sitting in it
            self.out.clauses.push(Clause {
                span: Span::new(self.clause_start, stop.max(self.segment_start)),
                modifiers,
                payload: Span::new(self.segment_start, self.segment_start),
            });
            return;
        }
        self.out.clauses.push(Clause {
            span: Span::new(self.clause_start, stop),
            modifiers,
            payload: Span::new(start, stop),
        });
    }

    /// a clause word ended: everything before its last top-level colon is the
    /// modifier chain, everything after it begins the payload
    fn start_clause(&mut self, chain_start: usize, chain_end: usize) {
        self.close_segment(chain_start);
        let mut modifiers = Vec::new();
        let mut name_start = chain_start;
        let mut index = chain_start;
        while index <= chain_end {
            if index != chain_end && self.bytes[index] != b':' {
                index += 1;
                continue;
            }
            if index == name_start {
                self.error(ParseErrorCode::EmptyModifier, index);
            } else {
                let span = Span::new(name_start, index);
                if self.registry.kind(span.of(self.value)).is_none() {
                    self.out.errors.push(ParseError {
                        code: ParseErrorCode::UnregisteredModifier,
                        index: name_start,
                        modifier: Some(span),
                    });
                }
                modifiers.push(Modifier { span });
            }
            name_start = index + 1;
            index += 1;
        }
        self.pending = Some(modifiers);
        self.clause_start = chain_start;
        self.segment_start = chain_end + 1;
    }

    fn run(&mut self) {
        let length = self.bytes.len();
        let mut comment = false;
        let mut comment_start = 0usize;
        let mut quote = 0u8;
        let mut quote_start = 0usize;
        let mut url = false;
        let mut depth = 0usize;
        let mut paren_start = 0usize;
        let mut word_start: Option<usize> = None;
        let mut last_colon: Option<usize> = None;

        let mut index = 0usize;
        while index < length {
            let byte = self.bytes[index];

            if comment {
                // no escapes inside a comment: `\*/` still closes it
                if byte == b'*' && self.bytes.get(index + 1) == Some(&b'/') {
                    comment = false;
                    index += 1;
                }
                index += 1;
                continue;
            }

            if quote != 0 {
                // inside a string an unescaped matching quote ends it, and a
                // newline ends it as a parse error the browser sees the same way
                if byte == b'\\' {
                    index += 1;
                } else if byte == quote {
                    quote = 0;
                } else if byte == b'\n' || byte == b'\r' || byte == 0x0c {
                    self.error(ParseErrorCode::UnterminatedString, quote_start);
                    quote = 0;
                    // re-read the newline at top level, where it is whitespace
                    continue;
                }
                index += 1;
                continue;
            }

            if url {
                // the one function CSS does not tokenize: only an escape and `)`
                if byte == b'\\' {
                    index += 1;
                } else if byte == b')' {
                    url = false;
                    depth -= 1;
                }
                index += 1;
                continue;
            }

            // comments are lexical, so they open at any depth
            if byte == b'/' && self.bytes.get(index + 1) == Some(&b'*') {
                comment = true;
                comment_start = index;
                index += 2;
                continue;
            }
            if byte == b'*' && self.bytes.get(index + 1) == Some(&b'/') {
                self.error(ParseErrorCode::StrayCommentClose, index);
                index += 2;
                continue;
            }

            if depth > 0 {
                // inside parens whitespace and colons are ordinary content
                if byte == b'\\' {
                    index += 1;
                } else if byte == b'"' || byte == b'\'' {
                    quote = byte;
                    quote_start = index;
                } else if byte == b'(' {
                    if opens_url_token(self.bytes, index) {
                        url = true;
                    }
                    depth += 1;
                } else if byte == b')' {
                    depth -= 1;
                }
                index += 1;
                continue;
            }

            if is_whitespace(byte) {
                if let Some(start) = word_start {
                    if let Some(colon) = last_colon {
                        self.start_clause(start, colon);
                    }
                    word_start = None;
                    last_colon = None;
                }
                index += 1;
                continue;
            }

            // any other top-level character starts or continues a word
            if word_start.is_none() {
                word_start = Some(index);
            }

            match byte {
                b'{' | b'}' | b';' => self.error(ParseErrorCode::InvalidCharacter, index),
                b'\\' => index += 1,
                b'"' | b'\'' => {
                    quote = byte;
                    quote_start = index;
                }
                b'(' => {
                    if opens_url_token(self.bytes, index) {
                        url = true;
                    }
                    depth = 1;
                    paren_start = index;
                }
                b':' => last_colon = Some(index),
                _ => {}
            }
            index += 1;
        }

        if comment {
            self.error(ParseErrorCode::UnterminatedComment, comment_start);
        }
        if quote != 0 {
            self.error(ParseErrorCode::UnterminatedString, quote_start);
        }
        if depth > 0 {
            self.error(ParseErrorCode::UnterminatedFunction, paren_start);
        }

        if let (Some(start), Some(colon)) = (word_start, last_colon) {
            self.start_clause(start, colon);
        }
        self.close_segment(length);
    }
}

/// The top-level word containing `offset`.
///
/// A payload can hold several words (`1px solid red`), and only the one under
/// the cursor may be replaced by a completion: replacing the payload would drop
/// its siblings, which is the exact failure that makes className completion
/// useless. A cursor after a chain's last colon starts the word there, so
/// `hover:re|d` offers a value and not a modifier.
pub fn word_at(value: &str, offset: usize) -> Span {
    let bytes = value.as_bytes();
    let offset = offset.min(bytes.len());
    let mut start = offset;
    while start > 0 && !is_whitespace(bytes[start - 1]) {
        start -= 1;
    }
    let mut end = offset;
    while end < bytes.len() && !is_whitespace(bytes[end]) {
        end += 1;
    }
    // a colon before the cursor inside this word ends its modifier chain
    let mut depth = 0usize;
    let mut quote = 0u8;
    let mut cursor = start;
    while cursor < offset {
        let byte = bytes[cursor];
        if quote != 0 {
            if byte == b'\\' {
                cursor += 1;
            } else if byte == quote {
                quote = 0;
            }
        } else if byte == b'\\' {
            cursor += 1;
        } else if byte == b'"' || byte == b'\'' {
            quote = byte;
        } else if byte == b'(' {
            depth += 1;
        } else if byte == b')' {
            depth = depth.saturating_sub(1);
        } else if byte == b':' && depth == 0 && quote == 0 {
            start = cursor + 1;
        }
        cursor += 1;
    }
    Span::new(start, end.max(start))
}

/// Every top-level word inside `span`, which is how a payload's components are
/// looked up: `1px solid red` is three, and only `red` may be a theme key.
pub fn words(value: &str, span: Span) -> Vec<Span> {
    let bytes = value.as_bytes();
    let mut out = Vec::new();
    let mut depth = 0usize;
    let mut quote = 0u8;
    let mut start: Option<usize> = None;
    let mut index = span.start;
    while index < span.end {
        let byte = bytes[index];
        if quote != 0 {
            if byte == b'\\' {
                index += 1;
            } else if byte == quote {
                quote = 0;
            }
        } else if depth > 0 {
            if byte == b'\\' {
                index += 1;
            } else if byte == b'"' || byte == b'\'' {
                quote = byte;
            } else if byte == b'(' {
                depth += 1;
            } else if byte == b')' {
                depth -= 1;
            }
        } else if is_whitespace(byte) {
            if let Some(word) = start.take() {
                out.push(Span::new(word, index));
            }
        } else {
            if start.is_none() {
                start = Some(index);
            }
            match byte {
                b'\\' => index += 1,
                b'"' | b'\'' => quote = byte,
                b'(' => depth = 1,
                _ => {}
            }
        }
        index += 1;
    }
    if let Some(word) = start {
        out.push(Span::new(word, span.end));
    }
    out
}

#[cfg(test)]
mod tests {
    use super::*;

    fn parts(value: &str) -> (Option<&str>, Vec<(Vec<&str>, &str)>) {
        let parsed = parse(value);
        (
            parsed.base.map(|b| b.of(value)),
            parsed
                .clauses
                .iter()
                .map(|c| {
                    (
                        c.modifiers.iter().map(|m| m.span.of(value)).collect(),
                        c.payload.of(value),
                    )
                })
                .collect(),
        )
    }

    #[test]
    fn parses_a_bare_value() {
        assert_eq!(parts("background"), (Some("background"), vec![]));
    }

    #[test]
    fn parses_the_shape_the_skins_are_authored_in() {
        // straight from code/ui/tamagui/src/components/Button.tsx
        assert_eq!(
            parts("background hover:background-hover press:background-press"),
            (
                Some("background"),
                vec![
                    (vec!["hover"], "background-hover"),
                    (vec!["press"], "background-press"),
                ]
            )
        );
    }

    #[test]
    fn parses_chained_modifiers() {
        assert_eq!(
            parts("dark:hover:sm:blue"),
            (None, vec![(vec!["dark", "hover", "sm"], "blue")])
        );
    }

    #[test]
    fn a_payload_runs_to_the_next_clause_not_the_next_space() {
        // the rule this parser used to get wrong: `solid` and `red` came back
        // as two more base clauses, so `base()` answered `solid`
        assert_eq!(
            parts("hover:1px solid red"),
            (None, vec![(vec!["hover"], "1px solid red")])
        );
        assert_eq!(
            parts("2px dashed black hover:4px solid white"),
            (
                Some("2px dashed black"),
                vec![(vec!["hover"], "4px solid white")]
            )
        );
    }

    #[test]
    fn a_colon_inside_parentheses_is_not_a_modifier() {
        assert_eq!(
            parts("url(https://x.com/a.png)"),
            (Some("url(https://x.com/a.png)"), vec![])
        );
        assert_eq!(
            parts("hover:url(https://x.com/a.png)"),
            (None, vec![(vec!["hover"], "url(https://x.com/a.png)")])
        );
    }

    #[test]
    fn whitespace_inside_parentheses_does_not_split_a_clause() {
        assert_eq!(parts("rgba(1, 2, 3, 1)"), (Some("rgba(1, 2, 3, 1)"), vec![]));
        assert_eq!(
            parts("rgba(1, 2, 3, 1) hover:rgba(4, 5, 6, 1)"),
            (
                Some("rgba(1, 2, 3, 1)"),
                vec![(vec!["hover"], "rgba(4, 5, 6, 1)")]
            )
        );
    }

    #[test]
    fn brackets_are_ordinary_characters_and_braces_are_refused() {
        // `[color:red]` is not an arbitrary-value escape hatch in this grammar:
        // the top-level colon inside it is the clause separator like any other
        assert_eq!(
            parts("sm:[color:red]"),
            (None, vec![(vec!["sm", "[color"], "red]")])
        );
        let braces = parse("calc(1){2}");
        assert_eq!(braces.errors[0].code, ParseErrorCode::InvalidCharacter);
    }

    #[test]
    fn a_top_level_backslash_escapes_the_next_character() {
        assert_eq!(
            parts("none hover:custom\\:part"),
            (Some("none"), vec![(vec!["hover"], "custom\\:part")])
        );
        // an escaped `;` is payload content, not the end of a declaration
        assert!(parse("safe\\;tail").is_ok());
    }

    #[test]
    fn a_quoted_payload_keeps_its_spaces_and_colons() {
        assert_eq!(
            parts(r#"content:"a: b c""#),
            (None, vec![(vec!["content"], r#""a: b c""#)])
        );
    }

    #[test]
    fn a_trailing_colon_is_a_clause_awaiting_its_payload() {
        // this is the mid-typing state completion has to recognise
        let value = "4 sm:";
        let parsed = parse(value);
        assert_eq!(parsed.base.map(|b| b.of(value)), Some("4"));
        assert_eq!(parsed.clauses.len(), 1);
        assert!(parsed.clauses[0].payload.is_empty());
        assert_eq!(parsed.clauses[0].modifiers[0].span.of(value), "sm");
        assert_eq!(parsed.errors[0].code, ParseErrorCode::EmptyPayload);
    }

    #[test]
    fn an_unterminated_paren_still_yields_a_value() {
        // half-typed values must parse, or completion dies exactly when needed
        assert_eq!(parts("rgba(1, 2"), (Some("rgba(1, 2"), vec![]));
        assert_eq!(parse("rgba(1, 2").errors[0].code, ParseErrorCode::UnterminatedFunction);
    }

    #[test]
    fn finds_the_modifier_and_the_word_under_the_cursor() {
        let value = "background hover:background-hover";
        let parsed = parse(value);
        assert!(parsed.modifier_at(13).is_some());
        assert_eq!(parsed.modifier_at(13).unwrap().span.of(value), "hover");
        assert!(parsed.modifier_at(20).is_none());
        assert_eq!(word_at(value, 3).of(value), "background");
        assert_eq!(word_at(value, 20).of(value), "background-hover");
    }

    #[test]
    fn a_word_is_the_completable_unit_inside_a_multi_word_payload() {
        let value = "hover:1px solid red";
        assert_eq!(word_at(value, 8).of(value), "1px");
        assert_eq!(word_at(value, 12).of(value), "solid");
        assert_eq!(word_at(value, 19).of(value), "red");
        let parsed = parse(value);
        let payload = parsed.clauses[0].payload;
        let found: Vec<&str> = words(value, payload).iter().map(|w| w.of(value)).collect();
        assert_eq!(found, vec!["1px", "solid", "red"]);
    }

    #[test]
    fn words_do_not_split_inside_a_function_or_a_string() {
        let value = "rgba(1, 2, 3, 1) red";
        let parsed = parse(value);
        let base = parsed.base.unwrap();
        let found: Vec<&str> = words(value, base).iter().map(|w| w.of(value)).collect();
        assert_eq!(found, vec!["rgba(1, 2, 3, 1)", "red"]);
    }

    #[test]
    fn extra_whitespace_between_clauses_is_not_a_clause() {
        assert_eq!(parts("  a   hover:b  "), (Some("a"), vec![(vec!["hover"], "b")]));
    }

    #[test]
    fn spans_index_the_original_string() {
        let value = "4 sm:6";
        let parsed = parse(value);
        assert_eq!(parsed.base, Some(Span::new(0, 1)));
        assert_eq!(parsed.clauses[0].span, Span::new(2, 6));
        assert_eq!(parsed.clauses[0].payload, Span::new(5, 6));
        assert_eq!(parsed.clauses[0].payload.of(value), "6");
    }
}
