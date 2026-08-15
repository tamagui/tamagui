// Request handlers: completion, hover, colours, diagnostics.
//
// Everything here resolves against a snapshot taken once per request, so a
// config rebuild landing mid-request cannot make one response internally
// inconsistent. The vocabulary is rebuilt lazily and only when the config
// revision it was derived from has moved.

use std::sync::Arc;

use lsp_types::*;
use tamagui_config::ConfigSnapshot;
use tamagui_grammar::{CursorContext, EntryKind, ModifierKind, Vocabulary};

use tamagui_lsp::{Document, Workspace};

use crate::sites;

pub struct State {
    pub workspace: Workspace,
    vocabulary: Option<Vocabulary>,
}

impl State {
    pub fn new(workspace: Workspace) -> Self {
        Self { workspace, vocabulary: None }
    }

    /// drop the cached vocabulary so the next request rebuilds it
    pub fn invalidate_vocabulary(&mut self) {
        self.vocabulary = None;
    }

    /// Rebuild the vocabulary if the config revision has moved past the one it
    /// was derived from.
    ///
    /// This is split from reading it so callers can hold an immutable borrow of
    /// the vocabulary and the document at the same time; a single `&mut self`
    /// accessor would keep the whole `State` mutably borrowed for the rest of
    /// the request.
    fn ensure_vocabulary(&mut self, config: &ConfigSnapshot) {
        let stale = self
            .vocabulary
            .as_ref()
            .is_none_or(|v| v.revision != config.revision);
        if stale {
            self.vocabulary = Some(Vocabulary::from_config(config));
        }
    }

    fn snapshot(&self) -> Arc<ConfigSnapshot> {
        self.workspace.config().snapshot()
    }

    pub fn completion(&mut self, params: CompletionParams) -> Option<CompletionResponse> {
        let uri = params.text_document_position.text_document.uri.to_string();
        let position = params.text_document_position.position;
        let config = self.snapshot();

        let document = self.workspace.get(&uri)?;
        let text = document.to_string();
        let offset = byte_offset(document, position)?;
        let site = sites::at(&text, offset, &config.style_props)?;

        self.ensure_vocabulary(&config);
        let vocabulary = self.vocabulary.as_ref()?;
        let cursor = offset - site.value_start;
        let completions = tamagui_grammar::complete(vocabulary, &site.value, cursor);

        let document = self.workspace.get(&uri)?;
        let replace = lsp_range(
            document,
            site.value_start + completions.replace.start,
            site.value_start + completions.replace.end,
        )?;

        let items = completions
            .entries
            .iter()
            .map(|entry| {
                let kind = match entry.kind {
                    EntryKind::ThemeKey => CompletionItemKind::COLOR,
                    EntryKind::Token => CompletionItemKind::VALUE,
                    EntryKind::Modifier(_) => CompletionItemKind::KEYWORD,
                };
                CompletionItem {
                    label: entry.name.to_string(),
                    kind: Some(kind),
                    detail: Some(entry.detail.to_string()),
                    label_details: Some(CompletionItemLabelDetails {
                        description: Some(match entry.kind {
                            EntryKind::Modifier(ModifierKind::Media) => "Tamagui media".into(),
                            EntryKind::Modifier(ModifierKind::Theme) => "Tamagui theme".into(),
                            EntryKind::Modifier(ModifierKind::State) => "Tamagui state".into(),
                            EntryKind::Modifier(ModifierKind::Platform) => {
                                "Tamagui platform".into()
                            }
                            _ => format!(
                                "Tamagui {}",
                                entry.category.as_deref().unwrap_or("value")
                            ),
                        }),
                        ..Default::default()
                    }),
                    // an explicit edit over the clause span, never the whole
                    // literal: that is what keeps sibling clauses intact
                    text_edit: Some(CompletionTextEdit::Edit(TextEdit {
                        range: replace,
                        new_text: match completions.context {
                            // completing a modifier keeps its colon
                            CursorContext::Modifier => entry.name.to_string(),
                            CursorContext::Value => entry.name.to_string(),
                        },
                    })),
                    ..Default::default()
                }
            })
            .collect::<Vec<_>>();

        Some(CompletionResponse::List(CompletionList {
            // the set depends on the typed prefix, so the client must re-ask
            is_incomplete: true,
            items,
        }))
    }

    pub fn hover(&mut self, params: HoverParams) -> Option<Hover> {
        let uri = params
            .text_document_position_params
            .text_document
            .uri
            .to_string();
        let position = params.text_document_position_params.position;
        let config = self.snapshot();

        let document = self.workspace.get(&uri)?;
        let text = document.to_string();
        let offset = byte_offset(document, position)?;
        let site = sites::at(&text, offset, &config.style_props)?;
        let cursor = offset - site.value_start;

        self.ensure_vocabulary(&config);
        let vocabulary = self.vocabulary.as_ref()?;
        let parsed = tamagui_grammar::value::parse(&site.value);
        let clause = parsed.clause_at(cursor)?;

        // a modifier under the cursor explains itself and its media query
        if let Some(modifier) = clause.modifiers.iter().find(|m| m.span.contains(cursor)) {
            let name = modifier.span.of(&site.value);
            let entry = vocabulary.modifiers.get(name)?;
            let body = match entry.kind {
                EntryKind::Modifier(ModifierKind::Media) => {
                    format!("**{name}** · Tamagui media\n\n```json\n{}\n```", entry.detail)
                }
                EntryKind::Modifier(kind) => {
                    format!("**{name}** · Tamagui {}", modifier_label(kind))
                }
                _ => format!("**{name}**"),
            };
            let document = self.workspace.get(&uri)?;
            let range = lsp_range(
                document,
                site.value_start + modifier.span.start,
                site.value_start + modifier.span.end,
            )?;
            return Some(Hover {
                contents: HoverContents::Markup(MarkupContent {
                    kind: MarkupKind::Markdown,
                    value: body,
                }),
                range: Some(range),
            });
        }

        // otherwise the payload: show what it resolves to, per theme
        let name = clause.payload.of(&site.value);
        let entry = vocabulary.values.get(name)?;
        let mut lines = Vec::new();
        match entry.kind {
            EntryKind::ThemeKey => {
                lines.push(format!("**{name}** · Tamagui theme value"));
                // the per-theme resolution is the thing Tailwind's hover has no
                // analogue for, so it leads
                for theme in config.themes.theme_names().take(64) {
                    if theme.contains('_') {
                        continue;
                    }
                    if let Some(value) = config.themes.value_by_name(theme, name) {
                        lines.push(format!("- `{theme}`: `{}`", value.raw));
                    }
                    if lines.len() > 4 {
                        break;
                    }
                }
            }
            EntryKind::Token => {
                let category = entry.category.as_deref().unwrap_or("token");
                lines.push(format!(
                    "**{name}** · Tamagui {category} token = `{}`",
                    entry.detail
                ));
            }
            EntryKind::Modifier(_) => return None,
        }

        let document = self.workspace.get(&uri)?;
        let range = lsp_range(
            document,
            site.value_start + clause.payload.start,
            site.value_start + clause.payload.end,
        )?;
        Some(Hover {
            contents: HoverContents::Markup(MarkupContent {
                kind: MarkupKind::Markdown,
                value: lines.join("\n"),
            }),
            range: Some(range),
        })
    }

    /// Inline colour swatches, the feature Tailwind IntelliSense calls colour
    /// decorators. Resolved against the first root theme, which is what an
    /// editor gutter can meaningfully show for a theme-dependent value.
    pub fn document_colors(&mut self, params: DocumentColorParams) -> Vec<ColorInformation> {
        let uri = params.text_document.uri.to_string();
        let config = self.snapshot();

        let Some(document) = self.workspace.get(&uri) else { return Vec::new() };
        let text = document.to_string();
        self.ensure_vocabulary(&config);
        let Some(vocabulary) = self.vocabulary.as_ref() else { return Vec::new() };
        let preview = config
            .themes
            .theme_names()
            .find(|t| !t.contains('_'))
            .map(str::to_string);

        let mut out = Vec::new();
        for site in sites::all(&text, &config.style_props) {
            let parsed = tamagui_grammar::value::parse(&site.value);
            for clause in &parsed.clauses {
                let name = clause.payload.of(&site.value);
                if name.is_empty() || !vocabulary.values.contains(name) {
                    continue;
                }
                let rgba = preview
                    .as_deref()
                    .and_then(|theme| config.themes.value_by_name(theme, name))
                    .and_then(|v| v.rgba);
                let Some(rgba) = rgba else { continue };

                let Some(document) = self.workspace.get(&uri) else { continue };
                let Some(range) = lsp_range(
                    document,
                    site.value_start + clause.payload.start,
                    site.value_start + clause.payload.end,
                ) else {
                    continue;
                };
                out.push(ColorInformation {
                    range,
                    color: Color {
                        red: rgba.r as f32 / 255.0,
                        green: rgba.g as f32 / 255.0,
                        blue: rgba.b as f32 / 255.0,
                        alpha: rgba.alpha_f32(),
                    },
                });
            }
        }
        out
    }

    pub fn diagnostics(&mut self, uri: &str) -> Vec<Diagnostic> {
        let config = self.snapshot();
        // an empty config means the compiler has not run; reporting every value
        // as unknown would bury the editor in noise that is not the user's fault
        if config.themes.theme_count() == 0 {
            return Vec::new();
        }
        let Some(document) = self.workspace.get(uri) else { return Vec::new() };
        let text = document.to_string();
        self.ensure_vocabulary(&config);
        let Some(vocabulary) = self.vocabulary.as_ref() else { return Vec::new() };

        let mut found = Vec::new();
        for site in sites::all(&text, &config.style_props) {
            for diagnostic in tamagui_grammar::diagnose(vocabulary, &config, &site.value) {
                found.push((
                    site.value_start + diagnostic.span.start,
                    site.value_start + diagnostic.span.end,
                    diagnostic.message,
                ));
            }
        }

        let Some(document) = self.workspace.get(uri) else { return Vec::new() };
        found
            .into_iter()
            .filter_map(|(start, end, message)| {
                Some(Diagnostic {
                    range: lsp_range(document, start, end)?,
                    severity: Some(DiagnosticSeverity::WARNING),
                    source: Some("tamagui".into()),
                    message,
                    ..Default::default()
                })
            })
            .collect()
    }
}

fn modifier_label(kind: ModifierKind) -> &'static str {
    match kind {
        ModifierKind::State => "state",
        ModifierKind::Media => "media",
        ModifierKind::Platform => "platform",
        ModifierKind::Theme => "theme",
    }
}

fn byte_offset(document: &Document, position: Position) -> Option<usize> {
    document
        .byte_of(tamagui_lsp::Position {
            line: position.line,
            character: position.character,
        })
        .ok()
}

fn lsp_range(document: &Document, start: usize, end: usize) -> Option<Range> {
    let s = document.position_of_byte(start);
    let e = document.position_of_byte(end);
    Some(Range {
        start: Position { line: s.line, character: s.character },
        end: Position { line: e.line, character: e.character },
    })
}
