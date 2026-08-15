// Exercises the grammar against the REAL config artifact this repo generates,
// and times the operations an editor performs per keystroke.
//
// Run with: cargo run --release -p tamagui-grammar --example real_config

use std::path::PathBuf;
use std::time::Instant;

use tamagui_grammar::{Vocabulary, complete, diagnose};

fn main() {
    let path = PathBuf::from(env!("CARGO_MANIFEST_DIR"))
        .join("../../../..")
        .join("code/tamagui.dev/.tamagui/tamagui.config.json");

    let bytes = std::fs::read(&path)
        .unwrap_or_else(|e| panic!("needs the real artifact at {}: {e}", path.display()));
    println!("artifact: {:.2} MB", bytes.len() as f64 / 1024.0 / 1024.0);

    let t = Instant::now();
    let config = tamagui_config::load_from_slice(&bytes).expect("artifact should load");
    println!("config load:        {:>9.2?}   {}", t.elapsed(), config.describe());

    let t = Instant::now();
    let vocabulary = Vocabulary::from_config(&config);
    println!(
        "vocabulary build:   {:>9.2?}   {} values, {} modifiers",
        t.elapsed(),
        vocabulary.values.len(),
        vocabulary.modifiers.len()
    );

    // the per-keystroke path
    let cases = [
        ("background", "empty prefix -> whole vocabulary"),
        ("back", "short prefix"),
        ("background-", "narrowing prefix"),
        ("background-hover", "exact"),
    ];
    println!();
    for (typed, label) in cases {
        let t = Instant::now();
        let mut count = 0;
        for _ in 0..1000 {
            let c = complete(&vocabulary, typed, typed.len());
            count = c.entries.len();
        }
        println!(
            "complete {:<20} {:>9.2?}/call  -> {} entries   ({label})",
            format!("\"{typed}\""),
            t.elapsed() / 1000,
            count
        );
    }

    // the diagnostic path, including a levenshtein suggestion
    println!();
    for value in [
        "background hover:background-hover press:background-press",
        "backgorund",
        "background hovr:background-hover",
    ] {
        let t = Instant::now();
        let mut found = Vec::new();
        for _ in 0..1000 {
            found = diagnose(&vocabulary, &config, value);
        }
        println!(
            "diagnose {:>9.2?}/call  -> {} finding(s)  {:?}",
            t.elapsed() / 1000,
            found.len(),
            found.first().map(|d| d.message.as_str()).unwrap_or("clean")
        );
    }

    // proof the clause-replacement property holds on a real value
    println!();
    let value = "background hover:background-h";
    let c = complete(&vocabulary, value, value.len());
    let accepted = &c.entries[0].name;
    let next = format!("{}{}{}", &value[..c.replace.start], accepted, &value[c.replace.end..]);
    println!("accepting a completion at the end of a multi-clause value:");
    println!("  before: {value}");
    println!("  after:  {next}");
}
