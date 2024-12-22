# Contributing to `tamagui`

We are grateful your contributions to Tamagui. A couple guidelines:

- Assume good intentions.
- Stay constructive.

#### Table of content

- [Contributing to `tamagui`](#contributing-to-tamagui) - [Table of content](#table-of-content)
  - [Set up your development environment](#set-up-your-development-environment)
  - [Issue and Pull Request Guidelines](#issue-and-pull-request-guidelines)
    - [Issues](#issues)
    - [Pull Requests](#pull-requests)
  - [UI Kit Contributions](#ui-kit-contributions)
    - [Bugs and Fixing them](#bugs-and-fixing-them)
    - [Testing](#testing)
  - [Documentation Contributions](#documentation-contributions)
  - [Other ways to Contribute](#other-ways-to-contribute)

## Set up your development environment

Since Tamagui is a monorepo it's quite easy to contribute to which ever part you're interested in, just go to the particular directory and you're set. To set up your development environment you'll first need clone the Tamagui repo:

```bash
git clone https://github.com/tamagui/tamagui
```

This might take some time depending on your internet speed. Once it's done run the following command to install the dependencies:

```bash
yarn install
```

And then build the app:

```bash
yarn build
```

You may see some errors due to encryption, as the studio has encrypted contents. This is fine and won't affect contributions to Tamagui.

That's it! You should be good to go. As you are developing you'll also want to have a `yarn watch` running somewhere ongoing to ensure packages JS and types are rebuilt as you iterate.

## Issue and Pull Request Guidelines

Do not open issues for general support questions, that is what our [discord](https://discord.gg/vhEKmdCZw6) is for. Please do not open pull requests that do not address pre-existing issues, unless spoken about and approved in our discord. These rules are to uphold order and code quality, and most of all separate the wheat from the chaff.

### Issues

When opening issues please make sure that they adhere to these guidelines:

- Bug reports:

  - Make sure that your bug is reproducible and not a one off thing.
  - Make sure that your bug is Tamagui specific and not an integration with other libraries that we might not support yet. (Seek help in discord for these).
  - Use the Reproducible Bug Report template for all bug reports.

For now this is the only GitHub issue we support, for any other kinds of issues or general questions please join our discord and feel free to ask for help in the `help-casual` channel or open a help discussion in the `help board`.

If your issue does not adhere to these guidelines, in order to save everyone's time we will close it on sight.

### Pull Requests

We're grateful to the community for contributing to the code base.

When opening a Pull Request:

- Give the person reviewing your code context to the problem and the solution.
- If possible, try to keep PR's small and tightly scoped.

## UI Kit Contributions

**Note**: While developing, you'll want to watch the build watching in a dedicated terminal.

```bash
yarn watch
```

**Note**: you may see some errors around "studio" as you run build - this is fine, we encrypt some of the non-open-source projects in the repo. The errors do not block anything.

### Bugs and Fixing them

To report unexpected behavior, such as components not rendering correctly, unresponsive components, incompatibilities with supported libraries etc.

Thank you for taking the time to let the Tamagui team and community know about the issue.

When making pull requests addressing bug, please make sure that the PR:

- [ ] Gives context to the reviewer, step-by-step if possible on how to reproduce the issue before the code change, and what functionality is broken.
- [ ] The solution does not regress another part of the code base.
- [ ] The solution is current with `master` branch.
- [ ] The solution should have tests (if needed)

### Testing

It's easiest to use the sandbox project to test and develop things for web:

```bash
yarn sandbox
```

`sandbox` runs on
[port 9000](http://localhost:9000/)

This runs a client-side only Vite build of Tamagui, with a complete configuration already set up.

native test are run in `code/kitchen-sink`

Create a development build run `yarn ios` from `code/kitchen-sink`

Expo go is not supported in `kitchen-sink`. `kitchen-sink` uses a custom built version of `react-native-reanimated` so we can test everything including the various native integrations like native Sheet and native toasts. If you run Expo Go on `kitchen-sink` Metro's eager require eval errors due to demos folder being glob imported.

```bash
# Android
yarn kitchen-sink:build:android

# iOS
yarn kitchen-sink:build:ios
```

After the build has been completed, run the below command to start the Expo app:

```bash
yarn kitchen-sink
```

Once you've made changes, you can add tests. All compiler and CSS generation tests live in `packages/static-tests`, other tests live in `code/kitchen-sink/tests` or in other `-tests` packages.

Before submitting a PR, please check everything works across every combination of environments.

To do so, run the site first in development to test if it works entirely at runtime:

```bash
# Make sure you have run `yarn watch` before you execute this command.

yarn site
```

`site` runs on [port 5005](http://localhost:5005)

You use `pages/test.tsx` as an easy way to load things. If it looks good, try running again with the compiler on:

```bash
yarn site:extract
```

Finally, if that looks good, build to production and test that:

```bash
yarn site:prod
```

This flow ensures it works with Vite, Webpack, Metro, Next.js with SSR, and with the compiler both on and off.

## Other ways to Contribute

To get more involved in the community, join the [discord](https://discord.gg/vhEKmdCZw6)
