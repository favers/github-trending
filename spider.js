'use strict';

const request = require('superagent');
const cheerio = require('cheerio');
const fs = require('fs');
const exec = require('child_process').exec; 

const URL = 'https://github.com/trending/javascript';

function requestHtml() {
    return request.get(URL).then(res => res.text);
}

async function gitAddCommitPush(date,fileName){
    // let gitAdd = `git add ${fileName}`;
    // let gitCommit = `git commit -m ${date}`;
    // let gitPush = 'git push -u origin master';

    await exec('git add -A')
    await exec('git commit -m "exec git add test"')
    await exec('git push')
}   

gitAddCommitPush('2017-03-08 test add','spider.js');