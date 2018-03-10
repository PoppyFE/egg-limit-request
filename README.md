# egg-limit-request

[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![Test coverage][codecov-image]][codecov-url]
[![David deps][david-image]][david-url]
[![Known Vulnerabilities][snyk-image]][snyk-url]
[![npm download][download-image]][download-url]

[npm-image]: https://img.shields.io/npm/v/egg-limit-request.svg?style=flat-square
[npm-url]: https://npmjs.org/package/egg-limit-request
[travis-image]: https://img.shields.io/travis/eggjs/egg-limit-request.svg?style=flat-square
[travis-url]: https://travis-ci.org/eggjs/egg-limit-request
[codecov-image]: https://img.shields.io/codecov/c/github/eggjs/egg-limit-request.svg?style=flat-square
[codecov-url]: https://codecov.io/github/eggjs/egg-limit-request?branch=master
[david-image]: https://img.shields.io/david/eggjs/egg-limit-request.svg?style=flat-square
[david-url]: https://david-dm.org/eggjs/egg-limit-request
[snyk-image]: https://snyk.io/test/npm/egg-limit-request/badge.svg?style=flat-square
[snyk-url]: https://snyk.io/test/npm/egg-limit-request
[download-image]: https://img.shields.io/npm/dm/egg-limit-request.svg?style=flat-square
[download-url]: https://npmjs.org/package/egg-limit-request

<!--
Description here.
-->

## Install

```bash
$ npm i egg-limit-request --save
```

## Usage

```js
// {app_root}/config/plugin.js
exports.limitRequest = {
  enable: true,
  package: 'egg-limit-request',
};
```

## Configuration

```js
// {app_root}/config/config.default.js
exports.limitRequest = {
};
```

see [config/config.default.js](config/config.default.js) for more detail.

## Example

<!-- example here -->

## Questions & Suggestions

Please open an issue [here](https://github.com/eggjs/egg/issues).

## License

[MIT](LICENSE)
