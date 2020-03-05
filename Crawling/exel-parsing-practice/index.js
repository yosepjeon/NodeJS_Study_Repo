const xlsx = require('xlsx');
const axios = require('axios');
const cheerio = require('cheerio');
const addToSheet = require('./add_to_sheet');

const workbook = xlsx.readFile('./xlsx/data.xlsx');
const ws = workbook.Sheets.영화목록;
const records = xlsx.utils.sheet_to_json(ws);

// records.forEach((r,i) => {
//     console.log(i,r.제목,r.링크);
// });

const crawler = async () => {
    addToSheet(ws, 'C1', 's', '평점');
    // /*
    // 링크들에 한번에 요청을 보내기 때문에 상당히 빠르다
    // 하지만 요청 완료후 받는 데이터의 순서를 보장하지 않는다.
    // */
    let startTime;
    let endTime;

    startTime = new Date().getTime();
    crawlingByForEach(records);
    endTime = new Date().getTime();
    console.log('Foreach로 크롤링:',endTime - startTime);

    // /*
    // 훨씬 느리지만 순서를 보장 따라서 이 두개는 Trade Off 문제로
    // 순서를 중시하면 foreach, 속도를 중시하면 promise.all
    // */
    startTime = new Date().getTime();
    crawlingByPromiseAll(records);
    endTime = new Date().getTime();
    console.log('Promise.all로 크롤링:',endTime - startTime);
}


let crawlingByPromiseAll = async function crawlingByPromiseAll(records) {
    let i =0;
    await Promise.all(records.map(async (r) => {
        const response = await axios.get(r.링크);
        if (response.status === 200) {
            const html = response.data;
            const $ = cheerio.load(html);
            const text = $('.score.score_left .star_score').text();
            console.log(r.제목, '평점', text.trim());
            const newCell = 'C' + (i + 2);
            i++;
        }
    }));

    xlsx.writeFile(workbook,'./xlsx/result.xlsx');
}

let crawlingByForEach = async function crawlingByForEach(records) {
    for (const [i, r] of records.entries()) {
        const response = await axios.get(r.링크);
        if (response.status === 200) {
            const html = response.data;
            const $ = cheerio.load(html);
            const text = $('.score.score_left .star_score').text();
            console.log(r.제목, '평점', text.trim());
            const newCell = 'C' + (i + 2);
            addToSheet(ws, newCell, 'n', text.trim());
        }
    }

    xlsx.writeFile(workbook,'./xlsx/result.xlsx');
}

crawler();