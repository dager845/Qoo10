const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
var Excel = require('exceljs');
var workbook = new Excel.Workbook();

(async() => {
const browser = await puppeteer.launch();
const page = await browser.newPage();
await page.goto('https://www.qoo10.sg/gmkt.inc/Bestsellers/?g=2', {waitUntil: 'networkidle2'});

/*
// Get the height of the rendered page
const bodyHandle = await page.$('body');
const { height } = await bodyHandle.boundingBox();
await bodyHandle.dispose();

// Scroll one viewport at a time, pausing to let content load
const viewportHeight = page.viewport().height;
let viewportIncr = 0;
while (viewportIncr + viewportHeight < height) {
  await page.evaluate(_viewportHeight => {
    window.scrollBy(0, _viewportHeight);
  }, viewportHeight);
  //await page.waitFor(100);
  viewportIncr = viewportIncr + viewportHeight;
}

await page.focus('#content > div > div.bst_ct > div:nth-child(6) > h3');
await page.waitFor(1000);

// Scroll back to top
await page.evaluate(_ => {
  window.scrollTo(0, 0);
});
*/
//await page.setViewport({width: 1280, height: 1024});
const sheetName = await page.evaluate(() => {
  let title = (document.querySelector("#content > div > div.bst_ct > div:nth-child(2) > h3")).innerText;
  return title;
});

var sheet = workbook.addWorksheet(sheetName);

sheet.columns = [
  { header: 'RANK', key: 'rank', width: 10 },
  { header: 'NAME', key: 'name', width: 32 },
  { header: 'PRICE', key: 'price', width: 10},
  { header: 'DISCOUNTPRICE', key: 'dis_price', width: 10},
  { header: 'LINK', key: 'link', width: 10},
];

const elements1 = await page.evaluate(() => {
  let elements = (document.querySelector("#content > div > div.bst_ct > div:nth-child(2) > div > ol")).innerHTML;
  return elements;
});
const $ = cheerio.load(elements1);
var productList = [];
var itemList1 = $('.item');
itemList1.each(function(elem) {
  var item = $(this);
  var product = {
    rank: parseInt(item.find('.rank').text()),
    name: item.find('.tt').text(),
    price: item.find('del').text(),
    discount_price: item.find('strong').text(),
    link: item.find('.tt').attr('href')
  }
  productList.push(product);
});

const elements2 = await page.evaluate(() => {
  let elements = (document.querySelector("#more_bestseller_area > ol")).innerHTML;
  return elements;
});
const A = cheerio.load(elements2);
var itemList2 = A('.item');
itemList2.each(function(elem) {
  var item = A(this);
  var product = {
    rank: parseInt(item.find('.rank').text()),
    name: item.find('.tt').text(),
    price: item.find('del').text(),
    discount_price: item.find('strong').text(),
    link: item.find('.tt').attr('href')
  }
  sheet.addRow(product);
  productList.push(product);
});


//console.log(productList);
//await page.pdf({path: 'page.pdf', format: 'A4'});
await browser.close();
})();

