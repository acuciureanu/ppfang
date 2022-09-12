# PPFang

[![CodeQL](https://github.com/acuciureanu/ppfang/actions/workflows/codeql-analysis.yml/badge.svg)](https://github.com/acuciureanu/ppfang/actions/workflows/codeql-analysis.yml) [![Node.js Package](https://github.com/acuciureanu/ppfang/actions/workflows/publish.yml/badge.svg)](https://github.com/acuciureanu/ppfang/actions/workflows/publish.yml) ![GitHub](https://img.shields.io/github/license/acuciureanu/ppfang)

This is a tool which helps identifying prototype polluting libraries from [cdnjs.com](https://cdnjs.com/).

The idea came to my mind after checking out a tool named [cdnjs-prototype-pollution](https://github.com/aszx87410/cdnjs-prototype-pollution)\
written by [@aszx87410](https://github.com/aszx87410) aka Huli.

My motivation was to create my own tool with a slightly different approach.

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

## Maybe interesting to see

I reimplemented the `cdnjs.service.js` using [`puppeteer-cluster`](https://github.com/thomasdondorf/puppeteer-cluster).

These changes are on the [`make-use-of-puppeteer-cluster`](https://github.com/acuciureanu/ppfang/tree/make-use-of-puppeteer-cluster) branch.

## Greetings to everyone
