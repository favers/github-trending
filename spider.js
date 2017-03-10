'use strict';

const request = require('superagent');
const cheerio = require('cheerio');
const fs = require('fs');
const schedule = require('node-schedule');
const shell = require('shelljs');

const URL = 'https://github.com/trending/javascript';

let date = new Date();
let formatDate = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;

function requestHtml() {
    return request.get(URL).then(res => res.text);
}

function gitAddCommitPush(date) {
    if (shell.exec(`git add -A && git commit -m "add ${date}" && git push`).code === 0) {
        console.log('提交成功');
    }
}

function getData(html) {
    let $ = cheerio.load(html);
    return Array.from($('.repo-list li').map(function () {
        let link = $(this).find('h3 a').attr('href');
        let desc = $(this).find('.py-1 p').text().trim();
        return ({
            link,
            desc
        });
    }));
}

async function start() {
    console.log('开始爬取数据');
    let html = await requestHtml();
    let data = getData(html);
    console.log(data);
    console.log('开始提交数据');
    gitAddCommitPush(formatDate);
    console.log('结束本次任务');
}


(function () {
    schedule.scheduleJob('30 * * * * *', function () {
        start();
    })
}())