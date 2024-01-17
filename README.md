# PPFang - Identify Client-Side Prototype Pollution

[![CodeQL](https://github.com/acuciureanu/ppfang/actions/workflows/codeql-analysis.yml/badge.svg)](https://github.com/acuciureanu/ppfang/actions/workflows/codeql-analysis.yml) [![Node.js Package](https://github.com/acuciureanu/ppfang/actions/workflows/publish.yml/badge.svg)](https://github.com/acuciureanu/ppfang/actions/workflows/publish.yml) ![GitHub](https://img.shields.io/github/license/acuciureanu/ppfang)

Are you concerned about prototype pollution vulnerabilities in your JavaScript code? Look no further! PPFang is here to help you identify and eliminate prototype polluting libraries.

<a href="https://www.buymeacoffee.com/alexcuciureanu" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/default-orange.png" alt="Buy Me A Coffee" height="41" width="174"></a>

## Inspiration

My project was influenced by Huli's ([@aszx87410](https://github.com/aszx87410)) work on [cdnjs-prototype-pollution](https://github.com/aszx87410/cdnjs-prototype-pollution). After exploring his approach, I was motivated to develop my own project, taking a different path.

## What is PPFang?

PPFang is a powerful tool designed to detect and mitigate prototype pollution vulnerabilities in your client-side JavaScript code. With PPFang, you can ensure the security and reliability of your applications by identifying and eliminating potential risks.

## Features

🔍 Verify the latest libraries from cdnjs.com

📜 Check a list of URLs for client-side prototype polluting functions

🚀 Easy installation and usage

## Prerequisites

Before getting started with PPFang, make sure you have the following prerequisites installed on your Ubuntu/Debian system:

- libnss3
- libxss1
- libasound2
- libatk-bridge2.0-0
- libgtk-3-0
- libgbm-dev

## Installation

To install PPFang, simply run the following command:

## Prerequisites on `Ubuntu/Debian`

In case you get the following message on `Ubuntu/Debian`:

```
/.cache/puppeteer/chrome/linux-1108766/chrome-linux/chrome: error while loading shared libraries: libatk-1.0.so.0: cannot open shared object file: No such file or directory
```

You might need to install the following packages:

```sh
sudo apt-get install libnss3 libxss1 libasound2 libatk-bridge2.0-0 libgtk-3-0 libgbm-dev
```

## Install dependencies

```sh
npm install -g ppfang
```

Or, if you prefer to install it from as an npm package from this repo directly.

```sh
npm install -g .
```

Or, if you want to simply run it.

```sh
node index.js
```

or with arguments

```sh
node index.js -- [arguments go here]
```

## Usage

```text
Usage: ppfang [command] [option]

A tool which helps identifying client-side prototype polluting libraries

Options:
  -h, --help       display help for command

Commands:
  cdnjs [options]  Verifies the latest libraries from cdnjs.com
  pipe [options]   Checks a list of urls provided through stdin for client-side prototype polluting functions
  help [command]   display help for command


Examples:

  ppfang cdnjs

  ppfang cdnjs -c 50

  cat urls.txt | ppfang pipe -c 10

  echo "https://somesite.com/" | ppfang pipe

  gau --blacklist png,jpg,gif,txt,json,js some-random-domain.com | ppfang pipe -c 50

  ppfang --help || ppfang

Happy hunting!
```

## Interpreting Results 🧐

PPFang will output a list of potential prototype pollution vulnerabilities. For example, you might see a result like `String.prototype.$initialize`. This means that the `$initialize` function is potentially polluting the `String` prototype.

## Testing Vulnerabilities 🔍

You can test the potential impact of this pollution by executing a function in the context of this prototype. For instance, you can execute an `alert()` function like this:

```javascript
String.prototype.$initialize.call(alert(document.domain))
```

For more special cases, such as getting results where the function names have names like: `String.prototype.$<=>`, `String.prototype.$==`, `String.prototype.$eql?` and so on. You can do it like this:

```javascript
String.prototype['$<=>'].call(alert(1))
```


In this example, `document.domain` is passed to the `alert()` function. If the prototype pollution vulnerability is exploitable, this will display an alert box with the current document's domain.

## Mitigating Risks 🛡️

Once you've identified potential vulnerabilities, take the steps to mitigate them. This might involve refactoring your code or removing the offending library.

Remember, the goal of PPFang is to help you identify these potential vulnerabilities so you can take steps to mitigate them. Always ensure to validate the findings and take appropriate action to secure your code.

## Presentations which mentioned PPFang

[sec4dev 2022 – Bypassing CSPs Zero to hero – Robbe Van Roey](https://www.youtube.com/watch?v=V75Bg2Y0_8k)

## Greetings to everyone
