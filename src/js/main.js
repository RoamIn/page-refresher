(() => {
    // 配置项
    const STORAGE_TYPE = 'sessionStorage'; // 使用的 storage 类型
    const INTERVAL_OPTION_LIST = [2, 5, 10, 15]; // 时间间隔列表，单位：秒
    const DEFAULT_INTERVAL = INTERVAL_OPTION_LIST[0]; // 时间间隔，单位：秒

    const SELECT_DOM_ID = 'J_PageRefresherInput';
    const CHECKBOX_DOM_ID = 'J_PageRefresherCheckbox';

    const INTERVAL_HASH_KEY = 'c58dd06e8e5fc878a1a7877add6f7cb4115b123e'; // 刷新时间间隔存储键
    const IS_TURN_ON_HASH_KEY = 'a6cb5b48544e16330e24ce0154d76936b3dd68a7'; // 是否开启自动刷新存储键

    // 定时器
    const timer = {
        start(nSec) {
            this._timer = setTimeout(function () {
                refreshPage();
            }, nSec * 1000);

            return this;
        },
        clear() {
            clearTimeout(this._timer);

            return this;
        }
    };

    // html 处理
    const html = {
        build(isTurnOn = false, nSelectedInterval = DEFAULT_INTERVAL) {
            this._html = `<div class="page-refresher-wrapper ${ isTurnOn ? 'turn-on' : 'turn-off' }" style="display: none;">
                            <span class="title">定时刷新</span>
                            <label class="checkbox-group">
                                <input id="${ CHECKBOX_DOM_ID }" type="checkbox" ${ isTurnOn ? 'checked' : '' }>
                                <i></i>
                            </label>
                            <select id="${ SELECT_DOM_ID }" class="sec-select" value="${ nSelectedInterval }">${ this.options(INTERVAL_OPTION_LIST, nSelectedInterval) }</select>
                          </div>`;

            return this;
        },
        options(aList = [], nSelectedInterval = DEFAULT_INTERVAL) {
            let str = '';

            aList.forEach(sec => {
                str += `<option value="${ sec }" ${ sec === nSelectedInterval ? 'selected' : '' }>${ sec }秒</option>`;
            });

            return str;
        },
        inject() {
            const div = document.createElement('div');

            div.innerHTML = this._html;

            document.body.appendChild(div);
        }
    };

    // dom 操作
    const dom = {
        get(elem) {
            this._elem = elem;

            return this;
        },
        hasClass(sClassName) {
            return ` ${ this._elem.className } `.indexOf(` ${ sClassName } `) >= 0;
        },
        addClass(sClassName) {
            if (!this.hasClass(sClassName)) {
                this._elem.className += ( this._elem.className ? ' ' : '' ) + sClassName;
            }

            return this;
        },
        removeClass(sClassName) {
            let set = ` ${ this._elem.className } `;

            // Class name may appear multiple times
            while (set.indexOf(` ${ sClassName } `) >= 0) {
                set = set.replace(` ${ sClassName } `, ' ');
            }

            // trim for prettiness
            this._elem.className = typeof set.trim === 'function' ? set.trim() : set.replace(/^\s+|\s+$/g, '');

            return this;
        },
        toggleClass(sClassName) {
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
        const interval = event.target.value;

        window[STORAGE_TYPE].setItem(INTERVAL_HASH_KEY, interval);
    }

    // 开启、关闭事件处理
    function checkboxChangeEventHandler(event) {
        const isTurnOn = event.target.checked;

        const addClassName = isTurnOn ? 'turn-on' : 'turn-off';
        const removeClassName = isTurnOn ? 'turn-off' : 'turn-on';

        timer.clear();

        if (isTurnOn) {
            let interval = window[STORAGE_TYPE].getItem(INTERVAL_HASH_KEY);

            interval = parseInt(interval);
            timer.start(interval);
        }

        window[STORAGE_TYPE].setItem(IS_TURN_ON_HASH_KEY, isTurnOn);
        dom.get(event.target.parentNode.parentNode).removeClass(removeClassName).addClass(addClassName);
    }

    function init() {
        // 读取时间间隔
        let interval = window[STORAGE_TYPE].getItem(INTERVAL_HASH_KEY);
        // 读取是否开启自动刷新
        const isTurnOn = window[STORAGE_TYPE].getItem(IS_TURN_ON_HASH_KEY) === 'true';

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
