const httpProxy = require('http-proxy');
const http = require('http');
const minimatch = require('minimatch');
const colors = require('colors');
const moment = require('moment');
const _ = require('lodash');

// Color output
colors.enabled = true;

function logMsg(...args) {
  const timestamp = `[${colors.grey.italic(moment().format('hh:mm:ss'))}]`;
  console.log.apply(console, [timestamp, ...args]);
}

function findTarget(req, servers) {
  const { url } = req;
  for (let i = 0, ii = servers.length; i < ii; i++) {
    let server = servers[i];
    let { match } = server;

    if (
        (typeof match === 'string' && minimatch(url, match)) ||
        (typeof match === 'function' && match( req ))
      ) {
      return server;
    }
  }
}

function create(servers = []) {
  const proxy = httpProxy.createProxy();

  // Listen for the `error` event on `proxy`.
  proxy.on('error', function (err, req/*, res*/) {
    logMsg(colors.red('ERROR ' + req.url), err);
  });

  const httpServer = http.createServer((req, res) => {
    let server = findTarget(req, servers);

    if (!server) {
      logMsg(colors.red('Cannot find appropriate proxy target: '), req.url);
      return;
    }

    let color = colors[server.color];

    if (server.rewrite) {
      req.url = server.rewrite(req.url, req);
    }
    logMsg(colors.magenta(req.method), color(req.url));

    proxy.web(req, res, server);
  });

  // Proxy websockets
  httpServer.on('upgrade', function (req, socket, head) {
    let server = findTarget( req, servers );
    let color = colors[server.color];
    logMsg('Websocket upgrade:', color(req.url));

    proxy.ws(req, socket, head, server);
  });

  // Print information
  console.log('Proxy created for:');
  servers.forEach(function(server) {
    let name = _.padEnd(server.target, 30);
    let color = colors[server.color];
    console.log(color(name), typeof server.match === 'string' ? server.match : typeof server.match);
  });

  return httpServer;
}

module.exports = create;
