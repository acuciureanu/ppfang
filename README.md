# PPFang 
[![CodeQL](https://github.com/acuciureanu/ppfang/actions/workflows/codeql-analysis.yml/badge.svg)](https://github.com/acuciureanu/ppfang/actions/workflows/codeql-analysis.yml)

This is a tool which helps identifying prototype polluting libraries from [cdnjs.com](https://cdnjs.com/).

The idea came to my mind after checking out a tool named [cdnjs-prototype-pollution](https://github.com/aszx87410/cdnjs-prototype-pollution)
written by [@aszx87410](https://github.com/aszx87410) aka Huli.

My motivation was to create my own tool with a slightly different approach.

### Install dependencies

```sh
$ npm install
```

### Run the tool

```sh
$ node index.js

Processing https://cdnjs.cloudflare.com/ajax/libs/vue/3.2.38/vue.cjs.js ...
Processing https://cdnjs.cloudflare.com/ajax/libs/react-is/18.2.0/umd/react-is.production.min.js ...
Processing https://cdnjs.cloudflare.com/ajax/libs/react/18.2.0/umd/react.production.min.js ...
Processing https://cdnjs.cloudflare.com/ajax/libs/react-dom/18.2.0/umd/react-dom.production.min.js ...
Processing https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.2.0/js/bootstrap.min.js ...
[...]
Saved findings to: [PATH]\cdnjs.findings.json
```

### Make use of the findings

```
   {
        "name": "asciidoctor.js",
        "url": "https://cdnjs.cloudflare.com/ajax/libs/asciidoctor.js/1.5.9/asciidoctor.min.js",
        "findings": [
            "String.prototype.$initialize", 
[...]
```

In this case, the first finding is `String.prototype.$initialize`.

We can execute an `alert()` in this way: `String.prototype.$initialize.call().alert(document.domain)`.

### Configuration

There is a config file names `app.config.js` which can be found in the root of the project.

I defined some options for `cdnjs`. For example, you can change the `filename` to which the findings are thrown.

Also, the `concurrency` option can come pretty handy in case you need that changed to speed things up.

```js
export default {
    cdnjs: {
        concurrency: 10,
        api: {
            url: 'https://api.cdnjs.com',
        },
        export: {
            filename: 'cdnjs.findings.json',
        },
    },
};
```

After the tool finishes the job, it will dump all the results in `cdnjs.findings.json`.

# Greetings to everyone
