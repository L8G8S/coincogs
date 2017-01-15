var gulp = require('gulp');
var gutil = require('gulp-util');
var fs = require('fs');

var http = require('http');

function handlePostRequest(request, response) {
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

        return true;
    } 

    return false;
}

function handleGetRequest(request, response) {
    if (request.method === 'GET') {
        /* search filters */
        if(request.url.indexOf('/search/filters') == 0) {
            var mockFile = request.url.replace('/search/', './data/mock_search_');
            if(fs.existsSync(mockFile)) {
                fs.readFile(mockFile, function (err, data) {
                    response.setHeader('Content-Type', 'application/json');
                    response.write(data);
                    response.end();
                });
            }
            else {
                response.statusCode = 404;
                response.end();
            }
        }
        /*search results*/
        else if(request.url.indexOf('/search/results') == 0) {
            var mockFile = request.url.replace('/search/', './data/mock_search_');
            if(fs.existsSync(mockFile)) {
                fs.readFile(mockFile, function (err, data) {
                    response.setHeader('Content-Type', 'application/json');
                    response.write(data);
                    response.end();
                });
            }
            else {
                response.statusCode = 404;
                response.end();
            }
        }

        else /* marketplace filters */
        if(request.url.indexOf('/marketplace/filters') == 0) {
            var mockFile = request.url.replace('/marketplace/', './data/mock_marketplace_');
            if(fs.existsSync(mockFile)) {
                fs.readFile(mockFile, function (err, data) {
                    response.setHeader('Content-Type', 'application/json');
                    response.write(data);
                    response.end();
                });
            }
            else {
                response.statusCode = 404;
                response.end();
            }
        }
        /* marketplace results*/
        else if(request.url.indexOf('/marketplace/results') == 0) {
            var mockFile = request.url.replace('/search/', './data/mock_marketplace_');
            if(fs.existsSync(mockFile)) {
                fs.readFile(mockFile, function (err, data) {
                    response.setHeader('Content-Type', 'application/json');
                    response.write(data);
                    response.end();
                });
            }
            else {
                response.statusCode = 404;
                response.end();
            }
        }

        return true;
    }

    return false;
}

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

        var handled = false;
        
        handled |= handlePostRequest(request, response);;
        handled |= handleGetRequest(request, response);;

        if(!handled) {
            response.statusCode = 404;
            response.end();
        }  
    }).listen(8080);
});
