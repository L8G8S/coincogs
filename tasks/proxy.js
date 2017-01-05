var gulp = require('gulp');
var gutil = require('gulp-util');
var fs = require('fs');

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
        if (request.method === 'POST') {

            if(request.url === '/referential/save.svc'){
                var body = [];
                request.on('data', function(chunk) {
                    body.push(chunk);
                }).on('end', function() {
                    body = Buffer.concat(body).toString();
                    gutil.log(body);
                });
            
                request.pipe(response);
            }

        } 
        else if (request.method === 'GET') {
            /* search filters */
            if(request.url === '/referential/search_filters.json') {
                fs.readFile('./data/mock_search_filters.json', function (err, data) {
                    response.setHeader('Content-Type', 'application/json');
                    response.write(data);
                    response.end();
                });
            }
            else if(request.url === '/referential/search_filters_moderne.json') {
                fs.readFile('./data/mock_search_filters_moderne.json', function (err, data) {
                    response.setHeader('Content-Type', 'application/json');
                    response.write(data);
                    response.end();
                });
            }
        }
        else {
            response.statusCode = 404;
            response.end();
        }
  
    }).listen(8080);
});
