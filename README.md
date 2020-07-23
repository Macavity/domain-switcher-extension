# Domain Switcher (Chrome Extension)

![CI](https://github.com/Macavity/domain-switcher-extension/workflows/CI/badge.svg)

Inspired by https://github.com/stevehanson/domain-switcher-chrome but decided to do a complete do-over with Vue/Webpack/ESLint.

The extension allows to easily switch between different environments of configured projects.

## How to use

Example:
Project "My Burger House" has these Domains:

| Domain                        | Purpose            |
| :---------------------------- | :----------------- |
| Local Development Environment | local.domain.dev   |
| Staging Environment           | staging.domain.com |
| Production Environment        | www.domain.com     |

If the user is currently on one of these Domains, the Extension will highlight this and allow the user to switch
to the current page - on a different environment.

### Configure Static Projects

| Label      | URL Pattern        |
| :--------- | :----------------- |
| Local      | local.domain.dev   |
| Staging    | staging.domain.com |
| Production | www.domain.com     |

### Configure Regular Expression Projects

| Label      | URL Pattern                 | Target Pattern         |
| :--------- | :-------------------------- | :--------------------- |
| Local      | ([a-z]+).domain.dev         | \$1.domain.dev         |
| Staging    | ([a-z]+).staging.domain.com | \$1.staging.domain.com |
| Production | ([a-z]+).domain.com         | \$1.domain.com         |

## Development

To load the extension manually:

1. download or clone the current master
2. Run `npm install`
3. Run `npm run build`
4. Go to [chrome://extensions](chrome://extensions), choose "Load unpacked extensions" and select the "dist" directory of the downloaded project directory
