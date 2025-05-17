# Contributing to Vue 3 + TypeScript + Pinia Starter

First off, thank you for considering contributing to this project! Every contribution helps make this project better.

## Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the issue list as you might find out that you don't need to create one. When you are creating a bug report, please include as many details as possible:

* Use a clear and descriptive title
* Describe the exact steps which reproduce the problem
* Provide specific examples to demonstrate the steps
* Describe the behavior you observed after following the steps
* Explain which behavior you expected to see instead and why
* Include screenshots if relevant

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, please include:

* Use a clear and descriptive title
* Provide a step-by-step description of the suggested enhancement
* Provide specific examples to demonstrate the steps
* Describe the current behavior and explain which behavior you expected to see instead
* Explain why this enhancement would be useful

### Pull Requests

Please follow these steps to have your contribution considered by the maintainers:

1. Follow all instructions in the template
2. Follow the styleguides
3. After you submit your pull request, verify that all status checks are passing

#### Pull Request Process

1. Update the README.md with details of changes to the interface, if applicable
2. Update the documentation with any new features or changes
3. The PR will be merged once you have the sign-off of at least one maintainer

## Styleguides

### Git Commit Messages

* Use the present tense ("Add feature" not "Added feature")
* Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
* Limit the first line to 72 characters or less
* Reference issues and pull requests liberally after the first line
* Consider starting the commit message with an applicable emoji:
    * 🎨 `:art:` when improving the format/structure of the code
    * 🐎 `:racehorse:` when improving performance
    * 🚱 `:non-potable_water:` when plugging memory leaks
    * 📝 `:memo:` when writing docs
    * 🐛 `:bug:` when fixing a bug
    * 🔥 `:fire:` when removing code or files
    * 💚 `:green_heart:` when fixing the CI build
    * ✅ `:white_check_mark:` when adding tests
    * 🔒 `:lock:` when dealing with security
    * ⬆️ `:arrow_up:` when upgrading dependencies
    * ⬇️ `:arrow_down:` when downgrading dependencies

### TypeScript Styleguide

* Use type annotations for all variables, parameters, and return types
* Prefer interfaces over type aliases
* Use PascalCase for type names
* Use camelCase for variable and function names
* Document complex types with JSDoc comments
* Avoid using `any` type
* Use readonly where possible
* Use strict null checks

### Vue Styleguide

* Use Composition API with `<script setup>`
* Keep components focused and single-responsibility
* Use TypeScript for all components
* Document component props and events
* Use PascalCase for component names
* Use kebab-case for custom element names
* Order template, script, and style tags consistently
* Use scoped styles by default

### Testing Styleguide

* Write meaningful test descriptions
* Follow AAA (Arrange-Act-Assert) pattern
* Mock external dependencies
* Test edge cases
* Keep tests focused and atomic
* Use meaningful variable names in tests
* Clean up after tests

## Development Setup

1. Fork and clone the repository
2. Install dependencies: `npm install`
3. Create a branch for your changes
4. Make your changes
5. Run tests: `npm run test`
6. Push to your fork and submit a pull request

## Project Structure

```
├── src/
│   ├── components/   # Reusable Vue components
│   ├── stores/       # Pinia stores
│   ├── types/        # TypeScript type definitions
│   ├── utils/        # Utility functions
│   ├── App.vue       # Root component
│   └── main.ts       # Application entry point
├── test/
│   └── unit/         # Unit tests
├── .github/
│   └── workflows/    # GitHub Actions CI
└── docs/            # Documentation
```

## Additional Notes

### Issue and Pull Request Labels

* `bug` - Something isn't working
* `enhancement` - New feature or request
* `documentation` - Improvements or additions to documentation
* `good first issue` - Good for newcomers
* `help wanted` - Extra attention is needed
* `question` - Further information is requested

## Getting Help

If you need help, you can:

* Check the documentation
* Open an issue with the question label
* Reach out to the maintainers

Thank you for contributing! 🎉
