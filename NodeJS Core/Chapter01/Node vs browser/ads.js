const xlsx = require('xlsx');
const axios = require('axios');
const cheerio = require('cheerio');
const add_to_sheet = require('./add_to_sheet');

const workbook = xlsx.readFile('xlsx/data.xlsx');
const ws = workbook.Sheets.영화목록;
const records = xlsx.utils.sheet_to_json(ws);

const crawler = async () => {
    add_to_sheet(ws, 'C1', 's', '평점');
    /* 
    상당히 빠르다 요청을 원하는 링크에 한번에 전부 보내기 때문에 하지만
    데이터를 읽어왔을때 순서를 보장하지 않는다.
    */
    //   await Promise.all(records.map(async (r) => {
    //     const response = await axios.get(r.링크);
    //     if (response.status === 200) {
    //       const html = response.data;
    //       const $ = cheerio.load(html);
    //       const text = $('.score.score_left .star_score').text();
    //       console.log(r.제목, '평점', text.trim());
    //       const newCell = 'C' + (i + 2);
    //       add_to_sheet(ws, newCell, 'n', text.trim());
    //     }
    //   }));

    for(const [i,r] of records.entries()) {
        const response = await axios.get(r.링크);
        if (response.status === 200) {
          const html = response.data;
          const $ = cheerio.load(html);
          const text = $('.score.score_left .star_score').text();
          console.log(r.제목, '평점', text.trim());
          const newCell = 'C' + (i + 2);
          add_to_sheet(ws, newCell, 'n', text.trim());
        }
    }
    xlsx.writeFile(workbook, 'xlsx/result.xlsx');
};
crawler();