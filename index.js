/* eslint-disable no-await-in-loop */
/* eslint-disable no-console */
const request = require('request');
const fs = require('fs');
const moment = require('moment');
const extract = require('extract-zip');
const { resolve: path } = require('path');
const csv = require('csvtojson');

const { DailyInfo } = require('./datasources')();

moment.locale('en');
const args = process.argv.slice(2);
console.info('myArgs: ', args);
switch (args[0]) {
  case 'download':
    console.log(args[1], 'download data');
    downloadDailyInfo(args[1]);
    break;
  case 'downloads':
    downloadDailyInfos(args[1], args[2]);
    break;
  default:
    console.log('Sorry, that is not something I know how to do.');
}

async function downloadDailyInfo(date, stockExchange = 'HSX') {
  try {
    const mdate = moment(date);
    const date1 = mdate.format('YYYYMMDD');
    const date2 = mdate.format('DDMMYYYY');
    const date3 = mdate.format('DD.MM.YYYY');
    if (!mdate.isValid()) {
      console.log('not worker ');
      return;
    }
    if (mdate.weekday() === 6 || mdate.weekday() === 0) {
      console.log('not worker ');
      return;
    }
    const dailyInfo = await DailyInfo.findOne({ date: date1 });
    if (dailyInfo) {
      console.log('data exists');
      return;
    }
    const options = {
      method: 'GET',
      url: `https://images1.cafef.vn/data/${date1}/CafeF.SolieuGD.${date2}.zip`,
      headers:
      {
        'cache-control': 'no-cache',
      },
    };
    const downloadPath = path(`./downloads/${date1}.zip`);
    await new Promise(((resolve) => request(options, (error) => {
      if (error) throw new Error(error);
    }).pipe(fs.createWriteStream(downloadPath))
      .on('finish', resolve)));

    await extract(downloadPath, { dir: path('./data') });
    console.log('Extraction complete');

    const data = await csv({
      noheader: false,
      headers: ['ticker', 'date', 'open', 'high', 'low', 'close', 'volume', 'stockEx'],
    }).subscribe((object) => {
      object.stockEx = stockExchange;
    }).fromFile(path(`./data/CafeF.${stockExchange}.${date3}.csv`));
    await DailyInfo.insertMany(data);
    console.log('Insert complete');
  } catch (e) {
    console.log('err: ', e);
  }
}

async function downloadDailyInfos(from, to) {
  console.log('downloads');
  const todate = to ? moment(to) : moment().add(-1, 'days');
  const fromdate = moment(from);
  for (let d = fromdate; +d <= +todate; d = moment(d).add(1, 'days')) {
    if (d.weekday() !== 6 && d.weekday() !== 0) {
      await downloadDailyInfo(d);
    }
  }
}
