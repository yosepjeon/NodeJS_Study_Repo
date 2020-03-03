let db = require('./db');
let template = require('./template');
let qs = require('querystring');
let url = require('url');
let sanitizeHtml = require('sanitize-html');

exports.home = function (request, response) {
    db.query(`SELECT * FROM topic`, (error, topics) => {
        db.query(`SELECT * FROM author`, (error2, authors) => {
            let title = 'author';
            let list = template.list(topics);
            let html = template.HTML(title, list,
                `
                    ${template.authorTable(authors)}
                    <style>
                        table{
                            border-collapse: collapse;
                        }
                        td{
                            border:1px solid black;
                        }
                    </style>
                    <form action="/author/create_process" method="post">
                        <p>
                            <input type="text" name="name" placeholder="name">
                        </p>
                        <p>
                            <textarea name="profile" placeholder="description"></textarea>
                        </p>
                        <p>
                            <input type="submit">
                        </p>
                    </form>
                `, ``);

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
        INSERT INTO author (name, profile)
        VALUES(?,?)`, [post.name, post.profile], (error, result) => {
            if (error) {
                throw error;
            } else {
                console.log(result);
                response.writeHead(302, { Location: `/author` });
                response.end();
            }
        });
    });
}

exports.update = function (request, response) {
    db.query(`SELECT * FROM topic`, (error, topics) => {
        if (error) {
            throw error;
        } else {
            db.query(`SELECT * FROM author`, (error2, authors) => {
                let _url = request.url;
                let queryData = url.parse(_url, true).query;

                db.query(`SELECT * FROM author WHERE id=?`, [queryData.id], (error3, author) => {
                    let title = 'author';
                    let list = template.list(topics);
                    let html = template.HTML(title, list,
                        `
                            ${template.authorTable(authors)}
                            <style>
                                table{
                                    border-collapse: collapse;
                                }
                                td{
                                    border:1px solid black;
                                }
                            </style>
                            <form action="/author/update_process" method="post">
                                <p>
                                    <input type="hidden" name="id" value="${queryData.id}">
                                </p>
                                <p>
                                    <input type="text" name="name" value="${sanitizeHtml(author[0].name)}" placeholder="name">
                                </p>
                                <p>
                                    <textarea name="profile" placeholder="description">${sanitizeHtml(author[0].profile)}</textarea>
                                </p>
                                <p>
                                    <input type="submit" value="update">
                                </p>
                            </form>
                        `, ``);

                    response.writeHead(200);
                    response.end(html);
                });
            });
        }
    });
}

exports.update_process = function(request,response) {
    let body = '';

    request.on('data',(data) => {
        body = body + data;
    });

    request.on('end',() => {
        let post = qs.parse(body);
        db.query(`UPDATE author SET name=?, profile=? WHERE id=?`,
        [post.name,post.profile,post.id],(error,result) => {
            if(error) {
                throw error;
            }else {
                response.writeHead(302,{Location:`/author`});
                response.end();
            }
        });
    });
}

exports.delete_process = function(request,response) {
    let body = '';

    request.on('data',(data) => {
        body = body + data;
    });

    request.on('end',() => {
        let post = qs.parse(body);
        db.query(`DELETE FROM topic WHERE author_id=?`,[post.id],(error1,result)=> {
            if(error1) {
                throw error1;
            }else {
                db.query(`DELETE FROM author WHERE id=?`,[post.id],(error2,result2) => {
                    if(error2) {
                        throw error2;
                    }else {
                        response.writeHead(302,{Location:`/author`});
                        response.end();
                    }
                });
            }
        });
    });
}