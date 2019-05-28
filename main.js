const puppeteer = require('puppeteer');
const cheerio = require('cheerio');

(async() => {
const browser = await puppeteer.launch();
const page = await browser.newPage();
await page.goto('https://www.qoo10.sg/gmkt.inc/Bestsellers/?g=2', {waitUntil: 'networkidle2'});
await page.setViewport({width: 1280, height: 1024});
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
    link: item.find('.tt').attr('href'),
    price: item.find('del').text(),
    discount_price: item.find('strong').text()
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
    link: item.find('.tt').attr('href'),
    price: item.find('del').text(),
    discount_price: item.find('strong').text()
  }
  productList.push(product);
});
console.log(productList);
//await page.pdf({path: 'page.pdf', format: 'A4'});
await browser.close();
})();

