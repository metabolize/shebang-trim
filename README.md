# shebang-trim

[![version](https://img.shields.io/npm/v/shebang-trim?style=flat-square)][npm]
[![license](https://img.shields.io/npm/l/shebang-trim?style=flat-square)][npm]
[![build](https://img.shields.io/circleci/project/github/metabolize/shebang-trim?style=flat-square)][build]
[![code style](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)][prettier]

[npm]: https://npmjs.com/shebang-trim/
[build]: https://circleci.com/gh/metabolize/shebang-trim/tree/master
[prettier]: https://prettier.io/

Replace `ts-node` shebangs with `node` shebangs in compiled scripts.

```js
{
  "scripts": {
    "build": "tsc",
    "postbuild": "shebang-trim dist/cli.js"
  }
}
```

Before:

```js
#!/usr/bin/env ts-node
'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
...
```

```js
#!/usr/bin/env node
'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
...
```

## Background

When creating a TypeScript CLI it's helpful to use `ts-node` during
development. In production, the CLI ships with compiled sources which
are runnable using `node`. If the compiled source still depends on
`ts-node`, it won't run unless `ts-node` is installed.
[`tsc` passes through the existing shebang line][tsc] at compile-time.
This script rewrites it.

[tsc]: https://github.com/microsoft/TypeScript/issues/2749

## Contribute

Pull requests welcome!

## Support

If you are having issues, please let me know.

## License

The project is licensed under the MIT license.
