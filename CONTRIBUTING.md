# Contributing to `tamagui`

Welcome to the Tamagui contributing guide. We appreciate your interest in contributing to Tamagui. In our effort to make Tamagui open and inclusive to all we have written a [code of conduct](#TODO), please endeavour to read through it.

#### Table of content

- [Set up your development environment](#set-up-your-development-environment)
- [Issue and Pull Request Guidelines](#issue-and-pull-request-guidelines)
- [UI Kit Contributions](#ui-kit-contributions)
- [Documentation Contributions](#documentation-contributions)

## Set up your development environment

Since Tamagui is a monorepo it's quite easy to contribute to which ever part you're interested in, just go to the particular directory and you're set. To set up your development environment you'll first need clone the Tamagui repo:

```bash
git clone https://github.com/tamagui/tamagui
```

This might take some time depending on your internet speed. Once it's done run the following command to install the dependencies:

```bash
yarn install
```

That's it! You should be good to go.

## Issue and Pull Request Guidelines

Do not open issues for general support questions, that is what our [discord](https://discord.gg/vhEKmdCZw6) is for. Please do not open pull requests that do not address pre-existing issues, unless spoken about and approved in our discord. These rules are to uphold order and code quality, and most of all seperate the wheat from the chaff.

### Issues

When opening issues please make sure that they adhere to these guidelines:

- Bug reports:

  - Make sure that your bug is reproducible and not a one off thing.
  - Make sure that your bug is Tamagui specific and not an integration with other libraries that we might not support yet. (Seek help in discord for these).
  - Use the Reproducible Bug Report template for all bug reports.

For now this is the only Github issue we support, for any other kinds of issues or general questions please join our discord and feel free to ask for help in the `help-casual` channel or open a help discussion in the `help board`.

If your issue does not adhere to these guidelines, in order to save everyones time we will close it on sight.

### Pull Requests

Please make sure that your [pull request](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/about-pull-requests) adheres to these strict guidelines.

Your pull request should:

- address a pre-existing issue, unless reviewed and approved in the discord.
- have a detailed explanation of what it addresses and how you went about the solution.
- make use of any one of the pull request templates depending on whether you're contributing to the documentation or the UI kit.
- address a single issue. Do not fix multiple issues in a single PR unless they are connected or closely related.

Endeavour to adhere to these rules and make use of the proper templates, lest your pull requests be closed without review.

## UI Kit Contributions

Contributions to the UI Kit otherwise known as code level contributions should come in the form of pull requests or issues. Pull requests can be done by forking the repo, creating a branch for that specific change and making changes locally. For issues, make sure that you follow the guidelines mentioned previously in the Issues section.

**Note**: Make sure to run the `yarn build` command before running any of the projects in the `/app` directory.

### Bugs and Fixing them

This kind of issue type should be used whenever you would like to report any kind of unexpected behavior, such as components not rendering correctly, unresponsive components, incompatibilities with supported libraries etc. Things like general questions, how tos or feature requests are not eligible to be reported as bugs and will be closed on sight.

When making pull requests addressing bug issues please make sure that they meet the following criteria:

- [ ] The bug should not be reproducible anymore.
- [ ] The solution adheres to the code style and quality of the repo.
- [ ] The solution does not break or change the behavior of any other part of Tamagui.
- [ ] The solution is up to date with the current release of Tamagui.

If your pull request ticks all these boxes then congratulations your PR is ready for review, and you're well on your way to being a Tamagui contributor.

## Documentation Contributions

Contributions to the documentation can come in many formats such as issues, pull requests, discord discussions or blog posts. However, the primary ways of contributing being issues and pull requests. If you would like to contribute directly to the Tamagui documentation please make sure to read the [writing guide](#TODO) before doing anything.

## Other ways to Contribute

If you're not quite up to contributing to documentation or code, don't worry you can always contribute in other ways. You can contribute by: 

- answering questions other community members might have;
- helping other community members debug their code; 
- sharing your progress in learning Tamagui;
- sharing some of your awesome projects built using Tamagui; or
- advocating for Tamagui by writing blog posts and making tutorials.

We're open and welcoming of all kinds of contributions. Take that first step by joining our [discord](https://discord.gg/vhEKmdCZw6), and get to know more about the Tamagui community.