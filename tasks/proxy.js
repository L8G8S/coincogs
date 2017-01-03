var gulp = require('gulp');
var gutil = require('gulp-util');

var http = require('http');

gulp.task('proxy', function () {
    http.createServer(function(request, response) {
        // Set CORS headers
        response.setHeader('Access-Control-Allow-Origin', '*');
        response.setHeader('Access-Control-Request-Method', '*');
        response.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST');
        response.setHeader('Access-Control-Allow-Headers', 'authorization, content-type');
        
        if (request.method === 'OPTIONS') {
            response.writeHead(200);
            response.end();
            return;
        }
        
        // Set routes
        if (request.method === 'POST' && request.url === '/referential/save.svc') {
            
            var body = [];
            request.on('data', function(chunk) {
                body.push(chunk);
            }).on('end', function() {
                body = Buffer.concat(body).toString();
                gutil.log(body);
            });
            
            request.pipe(response);
        } 
        else {
            response.statusCode = 404;
            response.end();
        }
  
    }).listen(8080);
});
