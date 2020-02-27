var http = require('http');
var fs = require('fs');
var url = require('url');

var app = http.createServer((request, response) => {
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
          <h2>${title}</h2>
          <p>${description}</p>
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