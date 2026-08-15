// Incremental document storage.
//
// Two things make this more than a String:
//
// 1. **Edits are ranges, not whole files.** An editor sends `didChange` on
//    every keystroke. Rebuilding a String per keystroke is O(file); a rope
//    splices in O(log n) and shares the untouched structure.
//
// 2. **LSP positions are UTF-16 code units, ropes index by char.** These agree
//    for ASCII and diverge the moment a string holds an emoji or any astral
//    character. Getting this wrong corrupts the buffer silently and only for
//    users whose files contain non-BMP text, so the conversion is explicit and
//    tested rather than assumed.

use ropey::Rope;

/// how the client encodes positions. negotiated at initialize.
#[derive(Clone, Copy, PartialEq, Eq, Debug)]
pub enum PositionEncoding {
    /// the LSP default, and what VS Code uses
    Utf16,
    /// preferred when the client supports it: no conversion at all
    Utf8,
}

/// a zero-based line/character position, in the negotiated encoding
#[derive(Clone, Copy, PartialEq, Eq, Debug)]
pub struct Position {
    pub line: u32,
    pub character: u32,
}

#[derive(Clone, Copy, PartialEq, Eq, Debug)]
pub struct Range {
    pub start: Position,
    pub end: Position,
}

#[derive(Debug)]
pub enum EditError {
    /// the range named a line past the end of the document
    LineOutOfBounds { line: u32, lines: usize },
    /// the range named a character past the end of its line
    CharacterOutOfBounds { line: u32, character: u32 },
    /// start was after end
    InvertedRange,
}

impl std::fmt::Display for EditError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            Self::LineOutOfBounds { line, lines } => {
                write!(f, "edit names line {line} but the document has {lines}")
            }
            Self::CharacterOutOfBounds { line, character } => {
                write!(f, "edit names character {character} past the end of line {line}")
            }
            Self::InvertedRange => write!(f, "edit range starts after it ends"),
        }
    }
}

impl std::error::Error for EditError {}

#[derive(Debug, Clone)]
pub struct Document {
    text: Rope,
    version: i32,
    encoding: PositionEncoding,
}

impl Document {
    pub fn new(text: &str, version: i32, encoding: PositionEncoding) -> Self {
        Self { text: Rope::from_str(text), version, encoding }
    }

    pub fn version(&self) -> i32 {
        self.version
    }

    pub fn len_bytes(&self) -> usize {
        self.text.len_bytes()
    }

    pub fn rope(&self) -> &Rope {
        &self.text
    }

    /// materialise the whole document. callers that only need a slice should
    /// take one from [`Self::rope`] instead of paying this.
    pub fn to_string(&self) -> String {
        self.text.to_string()
    }

    /// Apply one incremental change. `range` of `None` is a full replace, which
    /// clients send for the first sync and after certain refactors.
    pub fn apply_change(
        &mut self,
        range: Option<Range>,
        text: &str,
        version: i32,
    ) -> Result<(), EditError> {
        match range {
            None => self.text = Rope::from_str(text),
            Some(range) => {
                let start = self.offset_of(range.start)?;
                let end = self.offset_of(range.end)?;
                if start > end {
                    return Err(EditError::InvertedRange);
                }
                // remove then insert: ropey splices without copying the
                // untouched left and right subtrees
                self.text.remove(start..end);
                if !text.is_empty() {
                    self.text.insert(start, text);
                }
            }
        }
        self.version = version;
        Ok(())
    }

    /// Convert an LSP position to a char offset, honouring the negotiated
    /// encoding.
    pub fn offset_of(&self, position: Position) -> Result<usize, EditError> {
        let lines = self.text.len_lines();
        // a position pinned exactly at the end of the document is legal and is
        // what an append sends, so the bound is inclusive of the line count
        if position.line as usize >= lines {
            if position.line as usize == lines && position.character == 0 {
                return Ok(self.text.len_chars());
            }
            return Err(EditError::LineOutOfBounds { line: position.line, lines });
        }

        let line_start = self.text.line_to_char(position.line as usize);
        let line = self.text.line(position.line as usize);

        let offset_in_line = match self.encoding {
            PositionEncoding::Utf8 => {
                // characters are byte offsets; map through the line's bytes
                let byte = position.character as usize;
                if byte > line.len_bytes() {
                    return Err(EditError::CharacterOutOfBounds {
                        line: position.line,
                        character: position.character,
                    });
                }
                line.byte_to_char(byte)
            }
            PositionEncoding::Utf16 => {
                let units = position.character as usize;
                if units > line.len_utf16_cu() {
                    return Err(EditError::CharacterOutOfBounds {
                        line: position.line,
                        character: position.character,
                    });
                }
                line.utf16_cu_to_char(units)
            }
        };

        Ok(line_start + offset_in_line)
    }

    /// Convert a char offset back to an LSP position.
    pub fn position_of(&self, offset: usize) -> Position {
        let offset = offset.min(self.text.len_chars());
        let line = self.text.char_to_line(offset);
        let line_start = self.text.line_to_char(line);
        let character = match self.encoding {
            PositionEncoding::Utf8 => {
                self.text.char_to_byte(offset) - self.text.char_to_byte(line_start)
            }
            PositionEncoding::Utf16 => {
                self.text.char_to_utf16_cu(offset) - self.text.char_to_utf16_cu(line_start)
            }
        };
        Position { line: line as u32, character: character as u32 }
    }

    /// byte offset for the parser, which works in bytes
    pub fn byte_of(&self, position: Position) -> Result<usize, EditError> {
        Ok(self.text.char_to_byte(self.offset_of(position)?))
    }

    pub fn position_of_byte(&self, byte: usize) -> Position {
        self.position_of(self.text.byte_to_char(byte.min(self.text.len_bytes())))
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    fn doc(text: &str) -> Document {
        Document::new(text, 1, PositionEncoding::Utf16)
    }

    fn at(line: u32, character: u32) -> Position {
        Position { line, character }
    }

    #[test]
    fn applies_an_incremental_edit() {
        let mut d = doc("const a = 1\nconst b = 2\n");
        d.apply_change(Some(Range { start: at(1, 10), end: at(1, 11) }), "3", 2).unwrap();
        assert_eq!(d.to_string(), "const a = 1\nconst b = 3\n");
        assert_eq!(d.version(), 2);
    }

    #[test]
    fn applies_an_insertion_without_replacing() {
        let mut d = doc("<View bg=\"\" />");
        // cursor between the quotes
        d.apply_change(Some(Range { start: at(0, 10), end: at(0, 10) }), "red", 2).unwrap();
        assert_eq!(d.to_string(), "<View bg=\"red\" />");
    }

    #[test]
    fn a_none_range_replaces_the_whole_document() {
        let mut d = doc("old");
        d.apply_change(None, "brand new", 2).unwrap();
        assert_eq!(d.to_string(), "brand new");
    }

    #[test]
    fn utf16_positions_are_not_char_positions() {
        // an emoji is ONE char but TWO utf-16 code units. treating the LSP
        // character as a char index splices in the wrong place and corrupts
        // the buffer, which is the bug this whole conversion exists to avoid.
        let mut d = doc("<Text>🎨 hi</Text>");
        // in utf-16 the emoji occupies units 6 and 7, so "hi" starts at 9
        let offset = d.offset_of(at(0, 9)).unwrap();
        assert_eq!(d.rope().char(offset), 'h');

        d.apply_change(Some(Range { start: at(0, 9), end: at(0, 11) }), "yo", 2).unwrap();
        assert_eq!(d.to_string(), "<Text>🎨 yo</Text>");
    }

    #[test]
    fn utf8_encoding_indexes_by_byte() {
        let mut d = Document::new("<Text>🎨 hi</Text>", 1, PositionEncoding::Utf8);
        // the emoji is 4 bytes, so "hi" starts at byte 11
        let offset = d.offset_of(at(0, 11)).unwrap();
        assert_eq!(d.rope().char(offset), 'h');
        d.apply_change(Some(Range { start: at(0, 11), end: at(0, 13) }), "yo", 2).unwrap();
        assert_eq!(d.to_string(), "<Text>🎨 yo</Text>");
    }

    #[test]
    fn positions_round_trip() {
        let d = doc("aaa\nb🎨b\nccc");
        for line in 0..3u32 {
            for character in 0..4u32 {
                if let Ok(offset) = d.offset_of(at(line, character)) {
                    let back = d.position_of(offset);
                    // a position inside a surrogate pair normalises to its
                    // start, so compare through the offset rather than the
                    // original character
                    assert_eq!(d.offset_of(back).unwrap(), offset);
                }
            }
        }
    }

    #[test]
    fn appending_at_the_very_end_is_legal() {
        let mut d = doc("abc");
        let end = d.position_of(d.rope().len_chars());
        d.apply_change(Some(Range { start: end, end }), "!", 2).unwrap();
        assert_eq!(d.to_string(), "abc!");
    }

    #[test]
    fn out_of_bounds_edits_are_rejected_rather_than_clamped() {
        // clamping would silently apply the edit somewhere the client did not
        // ask for, desynchronising the buffer from the editor's view
        let mut d = doc("abc");
        assert!(matches!(
            d.apply_change(Some(Range { start: at(9, 0), end: at(9, 1) }), "x", 2),
            Err(EditError::LineOutOfBounds { .. })
        ));
        assert!(matches!(
            d.apply_change(Some(Range { start: at(0, 99), end: at(0, 99) }), "x", 2),
            Err(EditError::CharacterOutOfBounds { .. })
        ));
        assert!(matches!(
            d.apply_change(Some(Range { start: at(0, 2), end: at(0, 1) }), "x", 2),
            Err(EditError::InvertedRange)
        ));
        // and the document is untouched by every rejected edit
        assert_eq!(d.to_string(), "abc");
    }

    #[test]
    fn a_sequence_of_edits_matches_the_same_edits_applied_to_a_string() {
        // the property that matters: incremental application must agree with
        // the naive whole-file result, or the server drifts from the editor
        let mut d = doc("<View bg=\"\" p=\"\" />");
        let mut expected = String::from("<View bg=\"\" p=\"\" />");

        for (offset, insert) in [(10usize, "r"), (11, "e"), (12, "d")] {
            let pos = d.position_of(offset);
            d.apply_change(Some(Range { start: pos, end: pos }), insert, 2).unwrap();
            expected.insert_str(offset, insert);
            assert_eq!(d.to_string(), expected);
        }
        assert_eq!(d.to_string(), "<View bg=\"red\" p=\"\" />");
    }
}
