// The flat value parser.
//
// V3 moved conditional styling into the property's value:
//
//     bg="background hover:background-hover"
//     p="4 sm:6"
//     opacity="press:0.7"
//     transform="dark:hover:scale(1.1)"
//
// The grammar is: a value is whitespace-separated CLAUSES, and a clause is zero
// or more `modifier:` prefixes followed by a payload. The design record's
// decision 19 is what makes this unambiguous without escaping: a top-level
// colon is never valid inside a CSS value.
//
// "Top-level" is doing real work there. `url(https://x)` and `rgba(1,2,3)` both
// contain characters that would wreck a naive splitter, so depth is tracked
// across parentheses, brackets, braces and quotes, and only depth-zero
// whitespace and colons are structural.
//
// Every span is a byte range into the original value, because the LSP needs to
// map results back to exact document positions.

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

/// one whitespace-separated clause
#[derive(Clone, Debug)]
pub struct Clause {
    /// the whole clause including its modifiers
    pub span: Span,
    /// modifiers in authored order, e.g. `dark`, `hover` for `dark:hover:x`
    pub modifiers: Vec<Modifier>,
    /// what remains after the last colon. empty for a trailing `hover:`, which
    /// is exactly the state the cursor is in mid-typing.
    pub payload: Span,
}

impl Clause {
    /// a clause whose payload is empty is being typed, e.g. `hover:`
    pub fn is_awaiting_payload(&self) -> bool {
        self.payload.is_empty() && !self.modifiers.is_empty()
    }
}

#[derive(Clone, Debug, Default)]
pub struct FlatValue {
    pub clauses: Vec<Clause>,
}

impl FlatValue {
    /// the clause containing `offset`, for cursor-driven features
    pub fn clause_at(&self, offset: usize) -> Option<&Clause> {
        self.clauses.iter().find(|c| c.span.contains(offset))
    }

    /// the base clause is the one with no modifiers; it supplies the
    /// unconditional value
    pub fn base(&self) -> Option<&Clause> {
        self.clauses.iter().find(|c| c.modifiers.is_empty())
    }
}

/// Parse a flat value into clauses. Never fails: an unterminated paren or quote
/// yields a clause that runs to the end, which is what a half-typed value looks
/// like and what completion needs to see.
pub fn parse(value: &str) -> FlatValue {
    let bytes = value.as_bytes();
    let mut clauses = Vec::new();
    let mut index = 0;

    while index < bytes.len() {
        // skip structural whitespace between clauses
        if bytes[index].is_ascii_whitespace() {
            index += 1;
            continue;
        }
        let (clause, next) = parse_clause(value, index);
        clauses.push(clause);
        index = next;
    }

    FlatValue { clauses }
}

fn parse_clause(value: &str, start: usize) -> (Clause, usize) {
    let bytes = value.as_bytes();
    let mut depth = 0usize;
    let mut quote: Option<u8> = None;
    let mut modifiers = Vec::new();
    // where the current segment (modifier or payload) began
    let mut segment_start = start;
    let mut index = start;

    while index < bytes.len() {
        let byte = bytes[index];

        if let Some(open) = quote {
            // inside a string, only its closing quote is structural
            if byte == b'\\' {
                index += 2;
                continue;
            }
            if byte == open {
                quote = None;
            }
            index += 1;
            continue;
        }

        match byte {
            b'"' | b'\'' => {
                quote = Some(byte);
                index += 1;
            }
            b'(' | b'[' | b'{' => {
                depth += 1;
                index += 1;
            }
            b')' | b']' | b'}' => {
                depth = depth.saturating_sub(1);
                index += 1;
            }
            // a depth-zero colon ends a modifier
            b':' if depth == 0 => {
                modifiers.push(Modifier { span: Span::new(segment_start, index) });
                index += 1;
                segment_start = index;
            }
            // a depth-zero space ends the clause
            b' ' | b'\t' | b'\n' | b'\r' if depth == 0 => break,
            _ => index += 1,
        }
    }

    let clause = Clause {
        span: Span::new(start, index),
        modifiers,
        payload: Span::new(segment_start, index),
    };
    (clause, index)
}

#[cfg(test)]
mod tests {
    use super::*;

    fn parts(value: &str) -> Vec<(Vec<&str>, &str)> {
        parse(value)
            .clauses
            .iter()
            .map(|c| {
                (
                    c.modifiers.iter().map(|m| m.span.of(value)).collect(),
                    c.payload.of(value),
                )
            })
            .collect()
    }

    #[test]
    fn parses_a_bare_value() {
        assert_eq!(parts("background"), vec![(vec![], "background")]);
    }

    #[test]
    fn parses_the_shape_the_skins_are_authored_in() {
        // straight from code/ui/tamagui/src/components/Button.tsx
        assert_eq!(
            parts("background hover:background-hover press:background-press"),
            vec![
                (vec![], "background"),
                (vec!["hover"], "background-hover"),
                (vec!["press"], "background-press"),
            ]
        );
    }

    #[test]
    fn parses_chained_modifiers() {
        assert_eq!(parts("dark:hover:sm:blue"), vec![(vec!["dark", "hover", "sm"], "blue")]);
    }

    #[test]
    fn a_colon_inside_parentheses_is_not_a_modifier() {
        // the case a naive splitter gets wrong: this is ONE clause with a
        // url payload, not a `url(https` modifier
        assert_eq!(parts("url(https://x.com/a.png)"), vec![(vec![], "url(https://x.com/a.png)")]);
        assert_eq!(
            parts("hover:url(https://x.com/a.png)"),
            vec![(vec!["hover"], "url(https://x.com/a.png)")]
        );
    }

    #[test]
    fn whitespace_inside_parentheses_does_not_split_a_clause() {
        assert_eq!(parts("rgba(1, 2, 3, 1)"), vec![(vec![], "rgba(1, 2, 3, 1)")]);
        assert_eq!(
            parts("rgba(1, 2, 3, 1) hover:rgba(4, 5, 6, 1)"),
            vec![(vec![], "rgba(1, 2, 3, 1)"), (vec!["hover"], "rgba(4, 5, 6, 1)")]
        );
    }

    #[test]
    fn handles_nested_and_bracketed_payloads() {
        assert_eq!(
            parts("calc(100% - calc(2px + 1px))"),
            vec![(vec![], "calc(100% - calc(2px + 1px))")]
        );
        assert_eq!(parts("sm:[color:red]"), vec![(vec!["sm"], "[color:red]")]);
    }

    #[test]
    fn a_quoted_payload_keeps_its_spaces_and_colons() {
        assert_eq!(
            parts(r#"content:"a: b c""#),
            vec![(vec!["content"], r#""a: b c""#)]
        );
    }

    #[test]
    fn a_trailing_colon_is_a_clause_awaiting_its_payload() {
        // this is the mid-typing state completion has to recognise
        let parsed = parse("4 sm:");
        assert_eq!(parsed.clauses.len(), 2);
        let last = parsed.clauses.last().unwrap();
        assert!(last.is_awaiting_payload());
        assert_eq!(last.payload.of("4 sm:"), "");
        assert_eq!(last.modifiers[0].span.of("4 sm:"), "sm");
    }

    #[test]
    fn an_unterminated_paren_still_yields_a_clause() {
        // half-typed values must parse, or completion dies exactly when needed
        assert_eq!(parts("rgba(1, 2"), vec![(vec![], "rgba(1, 2")]);
    }

    #[test]
    fn finds_the_clause_under_the_cursor() {
        let value = "background hover:background-hover";
        let parsed = parse(value);
        assert_eq!(parsed.clause_at(3).unwrap().payload.of(value), "background");
        assert_eq!(
            parsed.clause_at(20).unwrap().payload.of(value),
            "background-hover"
        );
        assert!(parsed.base().is_some());
        assert_eq!(parsed.base().unwrap().payload.of(value), "background");
    }

    #[test]
    fn extra_whitespace_between_clauses_is_not_a_clause() {
        assert_eq!(
            parts("  a   hover:b  "),
            vec![(vec![], "a"), (vec!["hover"], "b")]
        );
    }

    #[test]
    fn spans_index_the_original_string() {
        let value = "4 sm:6";
        let parsed = parse(value);
        assert_eq!(parsed.clauses[1].span, Span::new(2, 6));
        assert_eq!(parsed.clauses[1].payload, Span::new(5, 6));
        assert_eq!(parsed.clauses[1].payload.of(value), "6");
    }
}
