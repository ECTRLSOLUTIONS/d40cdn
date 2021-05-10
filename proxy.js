var http = require('http'),
    request = require('request'),
    url = require('url');

var port = process.env.PORT || 8000,
    proxyURL = process.env.PROXY_URL || 'https://raw.githubusercontent.com/',
    allowOrigin = process.env.ALLOW_ORIGIN || '*',
    allowMethods = process.env.ALLOW_METHODS || '*',
    allowHeaders = process.env.ALLOW_HEADERS || 'X-Requested-With'

http.createServer(function (req, res) {
  var r = request(url.resolve(proxyURL, req.url));

  // Add CORS Headers
  r.on('response', function(_r) {
    _r.headers['access-control-allow-origin'] = allowOrigin;
    _r.headers['access-control-allow-methods'] = allowMethods;
    _r.headers['access-control-allow-headers'] = allowHeaders;
   // _r.headers['cross-origin-resource-policy'] = 'cross-origin';
 
  });

  // Stream the response
  req.pipe(r).pipe(res);
}).listen(port);

console.log('Proxying ' + proxyURL + ' on port ' + port);