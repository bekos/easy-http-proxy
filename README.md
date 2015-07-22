# easy-http-proxy

> Easy proxying for node

## Install

```sh
npm install --save-dev easy-http-proxy
```

## Usage

```js
var easyProxy = require('easy-http-proxy');

var servers = [
  { match: '/some/path/**', target: 'https://server.example.com', color: 'yellow'},
  { match: '/another/path/**', target: 'https://other-server.example.com', color: 'green'},
  { match: '/**', target: 'https://localhost', color: 'grey'},
];

var proxy  = easyProxy(servers);
proxy.listen( 9999 )
```

You can then access your proxy through `http://localhost:9999`

## API

### Servers configuration

 *  **target:** url to proxy the request
 *  **color**: color to use for this requests in console. Available [colors](https://www.npmjs.com/package/colors#text-colors).
 * **match:** glob string or function(`req`) to determine whether this the appropriate server to proxy this request
 * **rewrite_(url)_:** rewrite logic to match the target server's endpoint

See the [node-http-proxy Options](https://github.com/nodejitsu/node-http-proxy#options) for available configuration.
