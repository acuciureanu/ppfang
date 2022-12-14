# PPFang

[![CodeQL](https://github.com/acuciureanu/ppfang/actions/workflows/codeql-analysis.yml/badge.svg)](https://github.com/acuciureanu/ppfang/actions/workflows/codeql-analysis.yml) [![Node.js Package](https://github.com/acuciureanu/ppfang/actions/workflows/publish.yml/badge.svg)](https://github.com/acuciureanu/ppfang/actions/workflows/publish.yml) ![GitHub](https://img.shields.io/github/license/acuciureanu/ppfang)

This is a tool which helps identifying prototype polluting libraries.

<a href="https://www.buymeacoffee.com/alexcuciureanu" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/default-orange.png" alt="Buy Me A Coffee" height="41" width="174"></a>


The inspiration came from [cdnjs-prototype-pollution](https://github.com/aszx87410/cdnjs-prototype-pollution) by [@aszx87410](https://github.com/aszx87410) aka Huli.

The motivation was to create my own tool with a slightly different approach.

## Install dependencies

```sh
npm install -g ppfang
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

In this case, the first finding is `String.prototype.$initialize`.

We can execute an `alert()` in this way: `String.prototype.$initialize.call().alert(document.domain)`.

## Presentations which mentioned PPFang

[sec4dev 2022 – Bypassing CSPs Zero to hero – Robbe Van Roey](https://www.youtube.com/watch?v=V75Bg2Y0_8k)

## Maybe interesting to see

I reimplemented the `cdnjs.service.js` using [`puppeteer-cluster`](https://github.com/thomasdondorf/puppeteer-cluster).

These changes are on the [`make-use-of-puppeteer-cluster`](https://github.com/acuciureanu/ppfang/tree/make-use-of-puppeteer-cluster) branch.

## Greetings to everyone
