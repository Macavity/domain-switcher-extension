# Domain Switcher (Chrome Extension)

[![Build Status](https://travis-ci.org/Macavity/domain-switcher-extension.svg?branch=master)](https://travis-ci.org/Macavity/domain-switcher-extension)

Inspired by https://github.com/stevehanson/domain-switcher-chrome but decided to do a complete do-over with Vue/Webpack/ESLint.

The extension allows to easily switch between different environments of configured projects.

Example:
Project "My Burger House" has these Domains:

|Domain   |Purpose|
|:--------------------|:------|
| local.my-burger.dev   | Local Development Environment|
| staging.my-burger.com | Staging Environment|
| www.my-burger.com     | Production Environment|

If the user is currently on one of these Domains, the Extension will highlight this and allow the user to switch 
to the current page - on a different environment.
