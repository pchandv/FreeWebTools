# Hybrid UI Automation Project

This project demonstrates automating a Windows desktop application that hosts a WebView2-based Angular UI. Native UI automation is performed with **WinAppDriver** using `selenium-webdriver`, while the WebView2 content is automated with **Playwright** connecting over CDP.

## Prerequisites

- Windows 10/11 machine
- [Node.js](https://nodejs.org/) and npm installed
- [WinAppDriver](https://github.com/microsoft/WinAppDriver) installed and running (`WinAppDriver.exe`)
- The target app should expose WebView2 with remote debugging enabled on `localhost:9222`

## Setup

1. Open `cmd` and navigate to the `automation` folder.
2. Run `setup.bat` to install dependencies:
   ```cmd
   setup.bat
   ```

## Validation

Run `validate.bat` to ensure Node.js, npm, WinAppDriver and dependencies are ready:

```cmd
validate.bat
```

## Running Tests

- **Native UI test** (`native-test.js`): launches Notepad as a placeholder and types text using WinAppDriver.
- **WebView2 test** (`web-test.js`): connects to `localhost:9222` and prints the first 100 characters of the page body.

Execute both tests sequentially with:

```cmd
run-all-tests.bat
```

## File Overview

- `package.json` - Node.js project manifest with dependencies and test scripts
- `setup.bat` - installs npm dependencies
- `validate.bat` - quick environment checks
- `native-test.js` - sample WinAppDriver test using Notepad
- `web-test.js` - Playwright test connecting to WebView2 via CDP
- `run-all-tests.bat` - runs native and web tests sequentially

Use these scripts as a starting point for automating your hybrid Delphi/WPF/WebView2 application.

