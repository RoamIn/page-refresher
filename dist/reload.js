'use strict';

var CHECKBOX_SELECTOR = '#test';

var TIME_INTERVAL = 3 * 1000; // 时间间隔，单位：秒
var STORAGE_TYPE = 'sessionStorage'; // 使用的 storage 类型
var HASH_KEY = 'a62f2225bf70bfaccbc7f1ef2a397836717377de'; // 存储的键

var timer = {
    _timer: null,
    start: function start(nMsec) {
        this._timer = setTimeout(function () {
            reload();
        }, nMsec);

        return this;
    },
    clear: function clear() {
        clearTimeout(this._timer);

        return this;
    }
};

function reload() {
    window.location.reload();
}

function listener(event) {
    var bool = event.target.checked;

    if (bool) {
        timer.clear().start(TIME_INTERVAL);
    } else {
        timer.clear();
    }

    window[STORAGE_TYPE].setItem(HASH_KEY, bool);
}

function setCheckboxStatus(sSelector, bChecked) {
    var $checkbox = document.querySelector(sSelector);

    $checkbox.checked = bChecked;
}

function init() {
    // 读取设置的值
    var val = window[STORAGE_TYPE].getItem(HASH_KEY);

    // 如果定时器开启
    if (val === 'true') {
        timer.start(TIME_INTERVAL);
        setCheckboxStatus(CHECKBOX_SELECTOR, true);
    }

    document.querySelector(CHECKBOX_SELECTOR).addEventListener('change', listener);
}

window.onload = init;