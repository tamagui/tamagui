// Benchmarks against the REAL config artifact this repo generates, not a
// synthetic one. tamagui.dev's is 13.5 MB with 1,152 themes x 236 keys, which
// is the size that decides whether the load can happen on a file-watcher event
// without the editor noticing.
//
// Run with: cargo bench -p tamagui-config

use std::path::PathBuf;
use std::time::Duration;

use criterion::{Criterion, criterion_group, criterion_main};
use tamagui_config::{ConfigHandle, load_from_slice};

fn artifact_path() -> PathBuf {
    // crates/tamagui-config -> code/lsp -> code -> repo root
    PathBuf::from(env!("CARGO_MANIFEST_DIR"))
        .join("../../../..")
        .join("code/tamagui.dev/.tamagui/tamagui.config.json")
}

fn read_artifact() -> Vec<u8> {
    let path = artifact_path();
    std::fs::read(&path).unwrap_or_else(|e| {
        panic!(
            "benchmark needs the real config artifact at {}: {e}.\n\
             generate it by building tamagui.dev once.",
            path.display()
        )
    })
}

fn bench_load(c: &mut Criterion) {
    let bytes = read_artifact();

    // report the shape once so the numbers are interpretable
    let snapshot = load_from_slice(&bytes).expect("artifact should load");
    println!("\nartifact: {} MB on disk", bytes.len() / 1024 / 1024);
    println!("resident: {}\n", snapshot.describe());

    let mut group = c.benchmark_group("config");
    group.sample_size(20).measurement_time(Duration::from_secs(20));

    group.bench_function("load_full_artifact", |b| {
        b.iter(|| load_from_slice(std::hint::black_box(&bytes)).unwrap())
    });

    group.finish();
}

fn bench_lookup(c: &mut Criterion) {
    let bytes = read_artifact();
    let snapshot = load_from_slice(&bytes).expect("artifact should load");

    // pick real ids up front: this measures the matrix hit, not name hashing
    let theme = snapshot.themes.theme_id("dark").or_else(|| {
        snapshot.themes.theme_names().next().and_then(|n| snapshot.themes.theme_id(n))
    });
    let key = snapshot
        .themes
        .key_names()
        .next()
        .and_then(|n| snapshot.themes.key_id(n));

    let (Some(theme), Some(key)) = (theme, key) else {
        panic!("artifact carried no themes");
    };

    let mut group = c.benchmark_group("theme_lookup");

    // the hot path: hover resolves one token across a few preview themes
    group.bench_function("by_id", |b| {
        b.iter(|| {
            std::hint::black_box(
                snapshot.themes.value(std::hint::black_box(theme), std::hint::black_box(key)),
            )
        })
    });

    // what a caller pays when it has not interned yet
    group.bench_function("by_name", |b| {
        b.iter(|| std::hint::black_box(snapshot.themes.value_by_name("dark", "background")))
    });

    group.finish();
}

fn bench_publish(c: &mut Criterion) {
    let bytes = read_artifact();
    let handle = ConfigHandle::new(load_from_slice(&bytes).expect("artifact should load"));

    let mut group = c.benchmark_group("handle");

    // every request pays this to reach the config, so it has to be ~free
    group.bench_function("load_snapshot", |b| {
        b.iter(|| std::hint::black_box(handle.load().revision))
    });

    group.finish();
}

criterion_group!(benches, bench_load, bench_lookup, bench_publish);
criterion_main!(benches);
