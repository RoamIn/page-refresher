'use strict';

(function () {
    // 配置项
    var STORAGE_TYPE = 'sessionStorage'; // 使用的 storage 类型
    var INTERVAL_OPTION_LIST = [2, 5, 10, 15]; // 时间间隔列表，单位：秒
    var DEFAULT_INTERVAL = INTERVAL_OPTION_LIST[0]; // 时间间隔，单位：秒

    var SELECT_DOM_ID = 'J_PageRefresherInput';
    var CHECKBOX_DOM_ID = 'J_PageRefresherCheckbox';

    var INTERVAL_HASH_KEY = 'c58dd06e8e5fc878a1a7877add6f7cb4115b123e'; // 刷新时间间隔存储键
    var IS_TURN_ON_HASH_KEY = 'a6cb5b48544e16330e24ce0154d76936b3dd68a7'; // 是否开启自动刷新存储键

    // 定时器
    var timer = {
        start: function start(nSec) {
            this._timer = setTimeout(function () {
                refreshPage();
            }, nSec * 1000);

            return this;
        },
        clear: function clear() {
            clearTimeout(this._timer);

            return this;
        }
    };

    // html 处理
    var html = {
        build: function build() {
            var isTurnOn = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
            var nSelectedInterval = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : DEFAULT_INTERVAL;

            this._html = '<div class="page-refresher-wrapper ' + (isTurnOn ? 'turn-on' : 'turn-off') + '" style="display: none;">\n                            <span class="title">\u5B9A\u65F6\u5237\u65B0</span>\n                            <label class="checkbox-group">\n                                <input id="' + CHECKBOX_DOM_ID + '" type="checkbox" ' + (isTurnOn ? 'checked' : '') + '>\n                                <i></i>\n                            </label>\n                            <select id="' + SELECT_DOM_ID + '" class="sec-select" value="' + nSelectedInterval + '">' + this.options(INTERVAL_OPTION_LIST, nSelectedInterval) + '</select>\n                          </div>';

            return this;
        },
        options: function options() {
            var aList = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
            var nSelectedInterval = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : DEFAULT_INTERVAL;

            var str = '';

            aList.forEach(function (sec) {
                str += '<option value="' + sec + '" ' + (sec === nSelectedInterval ? 'selected' : '') + '>' + sec + '\u79D2</option>';
            });

            return str;
        },
        inject: function inject() {
            var div = document.createElement('div');

            div.innerHTML = this._html;

            document.body.appendChild(div);
        }
    };

    // dom 操作
    var dom = {
        get: function get(elem) {
            this._elem = elem;

            return this;
        },
        hasClass: function hasClass(sClassName) {
            return (' ' + this._elem.className + ' ').indexOf(' ' + sClassName + ' ') >= 0;
        },
        addClass: function addClass(sClassName) {
            if (!this.hasClass(sClassName)) {
                this._elem.className += (this._elem.className ? ' ' : '') + sClassName;
            }

            return this;
        },
        removeClass: function removeClass(sClassName) {
            var set = ' ' + this._elem.className + ' ';

            // Class name may appear multiple times
            while (set.indexOf(' ' + sClassName + ' ') >= 0) {
                set = set.replace(' ' + sClassName + ' ', ' ');
            }

            // trim for prettiness
            this._elem.className = typeof set.trim === 'function' ? set.trim() : set.replace(/^\s+|\s+$/g, '');

            return this;
        },
        toggleClass: function toggleClass(sClassName) {
            if (this.hasClass(sClassName)) {
                this.removeClass(sClassName);
            } else {
                this.addClass(sClassName);
            }

            return this;
        }
    };

    // 刷新页面
    function refreshPage() {
        window.location.reload();
    }

    // 刷新时间间隔改变事件处理
    function selectChangeEventHandler(event) {
        var interval = event.target.value;

        window[STORAGE_TYPE].setItem(INTERVAL_HASH_KEY, interval);
    }

    // 开启、关闭事件处理
    function checkboxChangeEventHandler(event) {
        var isTurnOn = event.target.checked;

        var addClassName = isTurnOn ? 'turn-on' : 'turn-off';
        var removeClassName = isTurnOn ? 'turn-off' : 'turn-on';

        timer.clear();

        if (isTurnOn) {
            var interval = window[STORAGE_TYPE].getItem(INTERVAL_HASH_KEY);

            interval = parseInt(interval);
            timer.start(interval);
        }

        window[STORAGE_TYPE].setItem(IS_TURN_ON_HASH_KEY, isTurnOn);
        dom.get(event.target.parentNode.parentNode).removeClass(removeClassName).addClass(addClassName);
    }

    function init() {
        // 读取时间间隔
        var interval = window[STORAGE_TYPE].getItem(INTERVAL_HASH_KEY);
        // 读取是否开启自动刷新
        var isTurnOn = window[STORAGE_TYPE].getItem(IS_TURN_ON_HASH_KEY) === 'true';

        // 如果未设置刷新时间
        if (interval === null) {
            window[STORAGE_TYPE].setItem(INTERVAL_HASH_KEY, DEFAULT_INTERVAL);
        }

        interval = interval || DEFAULT_INTERVAL;
        interval = parseInt(interval);

        // 如果定时器开启
        if (isTurnOn) {
            timer.start(interval || DEFAULT_INTERVAL);
        }

        // 生成 html 并注入
        html.build(isTurnOn, interval).inject();

        // 事件监听
        document.getElementById(SELECT_DOM_ID).addEventListener('change', selectChangeEventHandler);
        document.getElementById(CHECKBOX_DOM_ID).addEventListener('change', checkboxChangeEventHandler);
    }

    init();
})();