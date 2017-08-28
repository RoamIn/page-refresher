'use strict';

(function () {
    // 配置项
    var INTERVAL = 10; // 时间间隔，单位：秒
    var STORAGE_TYPE = 'sessionStorage'; // 使用的 storage 类型
    var CSS_FILE_PATH = './dist/1.0.0/css/page-refresher.min.css'; // css 文件路径

    var INPUT_DOM_ID = 'J_PageRefresherInput';
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
            var interval = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : INTERVAL;

            this._html = '<div class="page-refresher-wrapper ' + (isTurnOn ? 'turn-on' : 'turn-off') + '" style="display: none;">\n                            <label>\n                                <input id="' + CHECKBOX_DOM_ID + '" type="checkbox" ' + (isTurnOn ? 'checked' : '') + '>\n                                <i></i>\n                            </label>\n                            <input id="' + INPUT_DOM_ID + '" type="text" value="' + interval + '">\n                          </div>';

            return this;
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

    // 加载 css 样式
    function loadCss(sFilePath) {
        var head = document.getElementsByTagName('head')[0],
            link = document.createElement('link');

        link.href = sFilePath;
        link.rel = 'stylesheet';
        head.insertBefore(link, head.firstChild);
    }

    // 刷新时间间隔改变事件处理
    function inputChangeEventHandler(event) {
        var interval = event.target.value;

        interval = interval.replace(/^[0\D]*|\D*/g, ''); // 去除非数字，以及0开头
        interval = interval === '' ? INTERVAL : interval; // 如果为空则设置默认值

        event.target.value = interval;
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

        // 加载样式文件
        loadCss(CSS_FILE_PATH);

        // 如果未设置刷新时间
        if (interval === null) {
            window[STORAGE_TYPE].setItem(INTERVAL_HASH_KEY, INTERVAL);
        }

        interval = interval || INTERVAL;

        // 如果定时器开启
        if (isTurnOn) {
            timer.start(interval || INTERVAL);
        }

        // 生成 html 并注入
        html.build(isTurnOn, interval).inject();

        // 事件监听
        document.getElementById(INPUT_DOM_ID).addEventListener('change', inputChangeEventHandler);
        document.getElementById(CHECKBOX_DOM_ID).addEventListener('change', checkboxChangeEventHandler);
    }

    init();
})();