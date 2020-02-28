'use strict'

let http = require('http');
let fs = require('fs');
let url = require('url');
let qs = require('qs');

let app = http.createServer((request, response) => {
    let _url = request.url;
    let queryData = url.parse(_url, true).query;
    let pathname = url.parse(_url, true).pathname;
    let title = queryData.id;
    let description = 'Hello Node.js';

    if (pathname === '/') {
        fs.readdir('./data', (error, fileList) => {
            let list = templateList(fileList);

            fs.readFile(`data/${queryData.id}`, 'utf8', (err, description) => {
                if (queryData.id === undefined) {
                    title = 'Welcome'
                    description = 'Hello, Node.js'
                }

                var template = templateHTML(title,list,description);

                response.writeHead(200);
                response.end(template);
            });
        });
    } else if(pathname === '/create') {
        fs.readdir('./data',(error,fileList) => {
            let title = 'WEB - create';
            let list = templateList(fileList);

            let template = templateHTML(title, list, `
                <form action="http://localhost:3000/create_process" method="post">
                    <p><input type="text" name="title" placeholder="title"></p>
                    <p><textarea name="description" placeholder="description"></textarea></p>
                    <p><input type="submit"></p>
                </form>
            `);

            response.writeHead(200);
            response.end(template);
        });
    }else if(pathname === '/create_process') {
        let body = '';
        request.on('data',(data) => {
            body = body + data;
        });

        request.on('end',() => {
            let post = qs.parse(body);
            let title = post.title;
            let description = post.description;

            fs.writeFile(`data/${title}`,description,'utf8',(err) => {
                response.writeHead(302,{Location:`/?id=${title}`});
                response.end();
            });
        });
    } else {
        response.writeHead(404);
        response.end('Not Found');
    }
});

function templateHTML(title, list, description) {
    var template = `
        <!doctype html>
        <html>
        <head>
          <title>WEB1 - ${title}</title>
          <meta charset="utf-8">
        </head>
        <body>
          <h1><a href="/">WEB</a></h1>
            ${list}
          <a href="/create">create</a>
          ${description}
        </body>
        </html>
        `;

        return template;
}

function templateList(fileList) {
    var list = '<ul>';

    for (var i = 0; i < fileList.length; i++) {
        list = list + `<li><a href="/?id=${fileList[i]}">${fileList[i]}</a></li>`
    }

    list = list + '</ul>';

    return list;
}

app.listen(3000);