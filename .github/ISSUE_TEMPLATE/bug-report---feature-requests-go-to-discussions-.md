---
name: Bug report - Feature requests go to Discussions!
about: Create a report to help us improve
title: "[bug] "
labels: ''
assignees: ''

---

**Describe the bug**
A clear and concise description of what the bug is.

**To Reproduce**
Include steps to reproduce.

If you want a 5x higher chance of getting it fixed ASAP, make a repo with a reproduction!

```
npm create tamagui-app@latest
```

Make your changes and then push and link it here. 🙏🙏🙏🙏🙏

**System Info (please complete the following information):** 

Output of `npx envinfo --system --npmPackages '{vitest,vite,@vitejs/*}' --binaries --browsers`

**Tamagui info**

Paste all the following below:

- [ ] yarn.lock or similar
- [ ] If it's a specific file, add `//! debug` to the top (the `!` works in esbuild compiled packages but not necessary always) and include that (only for compiler, but helps to know if it's on or off).
- [ ] Run your server/bundler with `DEBUG=tamagui` and include that output at the bottom.
