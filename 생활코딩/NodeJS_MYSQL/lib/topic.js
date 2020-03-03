let db = require('./db');
let template = require('./template');
let url = require('url');
let qs = require('querystring');
let sanitizeHtml = require('sanitize-html');

exports.home = function (request, response) {
    db.query(`SELECT * FROM topic`, (error, topics) => {
        console.log(topics);
        let title = 'Welcome';
        var description = 'Hello, Node.js';
        let list = template.list(topics);
        let html = template.HTML(title, list,
            `<h2>${title}</h2>${description}`,
            `<a href="/create">create</a>`
        );
        response.writeHead(200);
        response.end(html);
    });
}

exports.page = function (request, response) {
    let _url = request.url;
    let queryData = url.parse(_url, true).query;

    db.query(`SELECT * FROM topic`, (error, topics) => {
        if (error) {
            throw error;
        }

        db.query(`SELECT * FROM topic LEFT JOIN author ON topic.author_id = author.id WHERE topic.id = ?`, [queryData.id], (error2, topic) => {
            if (error2) {
                throw error2;
            }

            let title = topic[0].title;
            let description = topic[0].description;
            let list = template.list(topics);
            let html = template.HTML(title, list,
                `<h2>${sanitizeHtml(title)}</h2>${sanitizeHtml(description)} <p>by ${sanitizeHtml(topic[0].name)}</p>`,
                ` <a href="/create">create</a>
                      <a href="/update?id=${queryData.id}">update</a>
                      <form action="delete_process" method="post">
                        <input type="hidden" name="id" value="${queryData.id}">
                        <input type="submit" value="delete">
                      </form>`
            );
            response.writeHead(200);
            response.end(html);
        });
    });
}

exports.create = function (request, response) {
    db.query('SELECT * FROM topic', (error, topics) => {
        db.query(`SELECT * FROM author`, (error2, authors) => {
            let title = 'Create';
            let list = template.list(topics);
            let html = template.HTML(sanitizeHtml(title), list,
                `
              <form action="/create_process" method="post">
                <p><input type="text" name="title" placeholder="title"></p>
                <p>
                  <textarea name="description" placeholder="description"></textarea>
                </p>
                <p>
                  ${template.authorSelect(authors)}
                </p>
                <p>
                  <input type="submit">
                </p>
              </form>
            `, `<a href="/create">create</a>`);
            response.writeHead(200);
            response.end(html);
        });
    });
}

exports.create_process = function (request, response) {
    let body = '';
    request.on('data', function (data) {
        body = body + data;
    });
    request.on('end', function () {
        let post = qs.parse(body);
        let title = post.title;
        let description = post.description;

        db.query(`
        INSERT INTO topic (title, description, created, author_id)
        VALUES(?,?,NOW(),?)`, [title, description, post.author], (error, result) => {
            if (error) {
                throw error;
            } else {
                console.log(result);
                response.writeHead(302, { Location: `/?id=${result.insertId}` });
                response.end();
            }
        });
    });
}

exports.update = function (request, response) {
    let _url = request.url;
    let queryData = url.parse(_url, true).query;

    db.query(`SELECT * FROM topic`, (error, topics) => {
        if (error) {
            throw error;
        } else {
            db.query(`SELECT * FROM topic WHERE id=?`, [queryData.id], (error2, topic) => {
                if (error2) {
                    throw error2;
                }

                db.query(`SELECT * FROM author`, (error3, authors) => {
                    let list = template.list(topics);
                    let html = template.HTML(sanitizeHtml(topic[0].title), list, `
                <form action="/update_process" method="post">
                  <input type="hidden" name="id" value="${topic[0].id}">
                  <p><input type="text" name="title" value="${sanitizeHtml(topic[0].title)}"></p>
                  <p><textarea name="description" placeholder="description">${sanitizeHtml(topic[0].description)}</textarea></p>
                  <p>${template.authorSelect(authors, topic[0].author_id)}</p>
                  <p><input type="submit"></p>
                </form>
              `, `<a href="/create">create</a> <a href="/update?id=${topic[0].id}">update</a>`
                    );

                    response.writeHead(200);
                    response.end(html);
                });
            });
        }
    });
}

exports.update_process = function (request, response) {
    let body = '';
    request.on('data', function (data) {
        body = body + data;
    });
    request.on('end', function () {
        let post = qs.parse(body);

        db.query(`UPDATE topic SET title=?, description=?, author_id=? WHERE id=?`, [post.title, post.description, post.author, post.id], (error, result) => {
            response.writeHead(302, { Location: `/?id=${post.id}` });
            response.end();
        });
    });
}

exports.delete_process = function (request, response) {
    let body = '';
    request.on('data', function (data) {
        body = body + data;
    });
    request.on('end', function () {
        let post = qs.parse(body);

        db.query(`DELETE FROM topic WHERE id = ?`, [post.id], (error, result) => {
            if (error) {
                throw error;
            } else {
                response.writeHead(302, { Location: `/` });
                response.end();
            }
        });
    });
}