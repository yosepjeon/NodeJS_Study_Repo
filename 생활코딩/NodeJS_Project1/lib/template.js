let template = {
    html: function (title, list, description, control) {
        return `
        <!doctype html>
        <html>
        <head>
          <title>WEB1 - ${title}</title>
          <meta charset="utf-8">
        </head>
        <body>
          <h1><a href="/">WEB</a></h1>
            ${list}
            ${control}
            ${description}
        </body>
        </html>
        `;
    },
    list: function (fileList) {
        let list = '<ul>';

        for (let i = 0; i < fileList.length; i++) {
            list = list + `<li><a href="/?id=${fileList[i]}">${fileList[i]}</a></li>`
        }

        list = list + '</ul>';

        return list;
    }
}

module.exports = template;