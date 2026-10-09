# Railway Bun lockfile compatibility probe

Run `bun install --frozen-lockfile --dry-run` in this directory using Bun 1.2.22, then Bun 1.4.2.

RAN: 1.2.22 exits 1 with `Unknown lockfile version` and `lockfile had changes, but lockfile is frozen`. 1.4.2 exits 0 for the same fixture. The committed v3 repository lockfile also uses version 2. Docker's Bun pin now matches the root `packageManager` at 1.4.2.

INFERRED: the old Docker pin ignores the committed lockfile and resolves dependencies again during its non-frozen install. This is a deployment compatibility defect. It is not proof of the latest Railway deployment's failure cause: authenticated build logs remain unavailable.

The fixture contains one real dependency so Bun cannot treat it as an empty install and remove the lockfile. The package integrity is from Bun's generated lockfile; the fixture selects version 2 to match the repository.
