'use strict';

var config = require('../config');
var http = require('http');
var express = require('express');
var gulp = require('gulp');
var gutil = require('gulp-util');
var morgan = require('morgan');
var argv = require('yargs').argv;
var proxy = require('express-http-proxy');

gulp.task('server', function () {

    var server = express();

    // log all requests to the console
    server.use(morgan('dev'));
    server.use(express.static(config.dist.root));

    // Serve index.html for all routes to leave routing up to Angular
    server.all('/', function (req, res) {
        res.sendFile('index.html', {root: 'build'});
    });

    // cant use both at the same time
    if (argv.p && argv.m) {
        gutil.log('Options -p and -m shouldn\'t be used together');
        throw err;
    }

    // proxy
    if (argv.p) {
        server.all('/hospital-control/*', proxy('localhost:' + argv.p, {
            forwardPath: function (req, res) {
                return require('url').parse(req.url).path;
            }
        }));
    }

    // mock-server
    if (argv.m) {
        gutil.log('Starting mock server');
        config.server.forEach(function (item) {
            require(item).call(this, server);
        });
    }

    // Start webserver if not already running
    var s = http.createServer(server);
    s.on('error', function (err) {
        if (err.code === 'EADDRINUSE') {
            gutil.log('Development server is already started at port ' + config.serverPort);
        }
        else {
            throw err;
        }
    });

    s.listen(config.serverPort);

});