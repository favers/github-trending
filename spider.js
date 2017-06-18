'use strict';


const request = require('superagent');
const cheerio = require('cheerio');
const fs = require('fs');
const schedule = require('node-schedule');
const shell = require('shelljs');

// 抓取url地址
const URL = 'https://github.com/trending/javascript';

// 获取页面内容
function requestHtml() {
    return request.get(URL).then(res => res.text);
}

// 提交采集的数据到git
function gitAddCommitPush(date) {
    try {
        if (shell.exec(`git add -A && git commit -m "add ${date}" && git push`).code === 0) {
            console.log('提交成功');
        }
    } catch (error) {
        console.log('提交失败');
    }
}

// 获取页面数据
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

// 将数据写入文件
async function wirteFile(date, data) {
    let writeStr = `### ${date} \n`;
    data.map((item) => {
        writeStr += `* [${(item.link).slice(1)}](https://github.com/${item.link}):${item.desc} \n`;
    });

    if (!fs.existsSync(currentMonth)) {
        fs.mkdirSync(currentMonth);
    }

    fs.writeFileSync(`./${currentMonth}/${date}.md`, writeStr);
}

// 开始程序
async function start() {
    // 格式化当前日期
    let date = new Date();
    let formatDate = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    let currentMonth = `${date.getFullYear()}-${date.getMonth() + 1}`;

    console.log('开始爬取数据');
    let html = await requestHtml();
    let data = getData(html);
    await wirteFile(formatDate, data);
    console.log('开始提交数据');
    await gitAddCommitPush(formatDate);
    console.log('结束本次任务');
}


(function () {
    console.log('程序开始运行');
    schedule.scheduleJob('00 00 9 * * *', function () {
        start();
    })
}())
