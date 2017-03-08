'use strict';

const request = require('superagent');
const cheerio = require('cheerio');
const fs = require('fs');

const URL = 'https://github.com/trending/javascript';

function requestHtml() {
    return request.get(URL).then(res => res.text);
}