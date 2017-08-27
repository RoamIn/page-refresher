(() => {
    'use strict';

    const CHECKBOX_DOM_ID = 'J_PageRefresherCheckbox';
    const SECOND_INPUT_DOM_ID = 'J_PageRefresherSecondInput';

    const TIME_INTERVAL = 5 * 1000; // 时间间隔，单位：秒
    const STORAGE_TYPE = 'sessionStorage'; // 使用的 storage 类型
    const HASH_KEY = 'a62f2225bf70bfaccbc7f1ef2a397836717377de'; // 存储的键

    const timer = {
        start(nMsec) {
            this._timer = setTimeout(function () {
                refreshPage();
            }, nMsec);

            return this;
        },
        clear() {
            clearTimeout(this._timer);

            return this;
        }
    };

    const html = {
        build(isTurnOn = false) {
            this._html = `<div class="page-refresher-wrapper ${ isTurnOn ? 'turn-on' : 'turn-off' }">
                    <label>
                        <input id="${ CHECKBOX_DOM_ID }" type="checkbox" ${ isTurnOn ? 'checked' : '' }>
                        <i></i>
                    </label>
                    <input id="${ SECOND_INPUT_DOM_ID }" type="text">
                </div>`;

            return this;
        },
        inject() {
            const div = document.createElement('div');

            div.innerHTML = this._html;
            document.body.appendChild(div);
        }
    };

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

    function refreshPage() {
        window.location.reload();
    }

    function checkboxChangeEventHandler(event) {
        const isTurnOn = event.target.checked;

        const addClassName = isTurnOn ? 'turn-on' : 'turn-off';
        const removeClassName = isTurnOn ? 'turn-off' : 'turn-on';

        timer.clear();

        if (isTurnOn) {
            timer.start(TIME_INTERVAL);
        }

        window[STORAGE_TYPE].setItem(HASH_KEY, isTurnOn);
        dom.get(event.target.parentNode.parentNode).removeClass(removeClassName).addClass(addClassName);
    }

    function init() {
        // 读取设置的值
        const isTurnOn = window[STORAGE_TYPE].getItem(HASH_KEY) === 'true';

        // 如果定时器开启
        if (isTurnOn) {
            timer.start(TIME_INTERVAL);
        }

        html.build(isTurnOn).inject();

        document.getElementById(CHECKBOX_DOM_ID).addEventListener('change', checkboxChangeEventHandler);
    }

    init();
})();
