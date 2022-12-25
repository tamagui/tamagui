---
name: Bug (Feature requests and all else in discussions)
about: Bug
title: "[bug] "
labels: ''
assignees: ''

---

**Avoid having to fill out an issue and get much faster response time by** forking this repo, reproducing  the bug, and then submitting it was a PR with the title "[Issue] ...".

If it's a bug in the starter use `apps/starter` to reproduce. For native-only bugs editing `apps/kitchen-sink` is easier.

---

**Note**: Add `debug="verbose"` prop to JSX, as well as to the `styled` definition. Always test disabling the compiler before filing, you can disable per-file with `//! tamagui-ignore` at the top of the file.

---

**Describe the bug**


**To Reproduce**

```
npm create tamagui
```

Make your changes and then push and link it here. 🙏🙏🙏🙏🙏

**System Info (please complete the following information):** 

Output of `npx envinfo --system --npmPackages --binaries --browsers`

---

- [ ] yarn.lock or similar
- [ ] If it's a specific file, add `//! debug` to the top (the `!` works in esbuild compiled packages but not necessary always) and include that (only for compiler, but helps to know if it's on or off).
- [ ] Run your server/bundler with `DEBUG=tamagui` and include that output at the bottom.
