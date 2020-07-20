# Domain Switcher (Chrome Extension)

![CI](https://github.com/Macavity/domain-switcher-extension/workflows/CI/badge.svg)

Inspired by https://github.com/stevehanson/domain-switcher-chrome but decided to do a complete do-over with Vue/Webpack/ESLint.

The extension allows to easily switch between different environments of configured projects.

Example:
Project "My Burger House" has these Domains:

| Domain                | Purpose                       |
| :-------------------- | :---------------------------- |
| local.my-burger.dev   | Local Development Environment |
| staging.my-burger.com | Staging Environment           |
| www.my-burger.com     | Production Environment        |

If the user is currently on one of these Domains, the Extension will highlight this and allow the user to switch
to the current page - on a different environment.

## Development

To load the extension manually:

1. download or clone the current master
2. Run `npm install`
3. Run `npm run build`
4. Go to [chrome://extensions](chrome://extensions), choose "Load unpacked extensions" and select the "dist" directory of the downloaded project directory
