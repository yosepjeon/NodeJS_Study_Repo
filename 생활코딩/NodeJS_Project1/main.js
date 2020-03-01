'use strict'

let http = require('http');
let fs = require('fs');
let url = require('url');
let qs = require('qs');
let template = require('./lib/template');

let app = http.createServer((request, response) => {
    let _url = request.url;
    let queryData = url.parse(_url, true).query;
    let pathname = url.parse(_url, true).pathname;
    let title = queryData.id;
    let description = 'Hello Node.js';
    let control = '';

    if (pathname === '/') {
        fs.readdir('./data', (error, fileList) => {
            let list = template.list(fileList);

            fs.readFile(`data/${queryData.id}`, 'utf8', (err, description) => {
                if (queryData.id === undefined) {
                    title = 'Welcome'
                    description = 'Hello, Node.js'
                    control = `<a href="/create">create</a>`;
                } else {
                    control = `<a href="/create">create</a> <a href="/update?id=${title}">update</a>
                    <form action='/delete_process' method="post"><input type="hidden" name="id" value="${title}"><input type="submit" value="delete"></form>`;
                }


                var html = template.html(title, list, description, control);

                response.writeHead(200);
                response.end(html);
            });
        });
    } else if (pathname === '/create') {
        fs.readdir('./data', (error, fileList) => {
            let title = 'WEB - create';
            let list = template.list(fileList);

            let html = template.html(title, list, `
                <form action="http://localhost:3000/create_process" method="post">
                    <p><input type="text" name="title" placeholder="title"></p>
                    <p><textarea name="description" placeholder="description"></textarea></p>
                    <p><input type="submit"></p>
                </form>
            `, '');

            response.writeHead(200);
            response.end(html);
        });
    } else if (pathname === '/create_process') {
        let body = '';
        request.on('data', (data) => {
            body = body + data;
        });

        request.on('end', () => {
            let post = qs.parse(body);
            let title = post.title;
            let description = post.description;

            fs.writeFile(`data/${title}`, description, 'utf8', (err) => {
                response.writeHead(302, { Location: `/?id=${title}` });
                response.end();
            });
        });
    } else if (pathname === '/update') {
        fs.readdir('./data', (error, fileList) => {
            fs.readFile(`./data/${queryData.id}`, 'utf8', (err, description) => {
                let title = queryData.id;
                let list = template.list(fileList);
                let html = template.html(title, list, `
                    <form action="/update_process" method="post">
                        <input type="hidden" name="id" value="${title}">
                        <p><input type="text" name="title" placeholder="title" value="${title}"></p>
                        <p><textarea name="description" placeholder="description">${description}</textarea></p>
                        <p><input type="submit"></p>
                    </form>
                `, `<a href="/create">create</a> <a href="/update?id=${title}">update</a>`);

                response.writeHead(200);
                response.end(html);
            });
        });
    } else if (pathname === '/update_process') {
        let body = '';
        request.on('data', (data) => {
            body = body + data;
        });

        request.on('end', () => {
            let post = qs.parse(body);
            let id = post.id;
            let title = post.title;
            let description = post.description;

            fs.rename(`/data/${id}`, `./data/${title}`, (error) => {
                fs.writeFile(`./data/${title}`, description, 'utf8', (err) => {
                    response.writeHead(302, { Location: `/?id=${title}` });
                    response.end();
                });
            })
        });
    } else if (pathname === '/delete_process') {
        let body = '';
        request.on('data', (data) => {
            body = body + data;
        });

        request.on('end', () => {
            let post = qs.parse(body);
            let id = post.id;

            fs.unlink(`./data/${id}`, (error) => {
                response.writeHead(302, { Location: `/` });
                response.end();
            });
        });
    } else {
        response.writeHead(404);
        response.end('Not Found');
    }
});



app.listen(3000);