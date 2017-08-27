# page-refresher

> Auto refresh web page

## 目录

- [Build Setup](#build-setup)
- [在线演示](#在线演示)
- [代码示例](#代码示例)
- [事件](#事件)
- [杂记](#杂记)


## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

For detailed explanation on how things work, checkout the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).

## 在线演示

在线演示: [go to live demo](http://htmlpreview.github.io/?https://github.com/ct-adc/ct-adc-custom-input/blob/master/view/demo.html).

![demo.gif](./src/img/demo.gif)

## 代码示例

```html
<number-input class="form-control"
                              :min="setting.min"
                              :max="setting.max"
                              :sep="setting.sep"
                              :step="setting.step"
                              v-model="setting.val"></number-input>
```

```javascript
import { NumberInput } from 'cy-adc-custom-input.vue';

export default {
    components: {
        NumberInput
    },
    data() {
        return {
            setting: {
                min: 1,
                max: 100000,
                sep: ',', // default[,]
                step: 4, // default[3]
                val: 'awdawd12345678'
            }
        };
    }
};
```

## 事件

- input: 每次输入[input]都触发，返回最新 value
- change: 每次失去焦点[blur]触发，返回最新 value

## 杂记

#### 功能

- 数值范围
  > 设置最小值（min）和最大值（max）

- 整数、浮点数、不限
  > 设置

- 正数、负数、不限
  > 设置

- 千分位逗号分隔
  > 分割位数（step）可以设置、分隔符（sep）可以设置



#### 参数

- min: 最小值
- max: 最大值

- sep: 千分位分隔符
- step: 分割步长

- val: 绑定的数值

#### 处理步骤

1. 将输入的字符 val 格式化
  - 使用相应数字类型的正则，将 val 格式化为所需要的数字类型 num
  - 整数非 0 开头；无小数点；无负号
  - 浮点数小于 0 可以 0 开头，此外不能 0 开头；可以有一个小数点
  - 正数不能出现负号（也不考虑 + 符号）
  - 负数 - 开头，只能一个 -
2. 判断 num 的范围
  - 如果小于 min，则 num 为 min
  - 如果大于 max，则 num 为 max
  - 否则，则 num 不变
3. emit 此时的 num
4. 将 num 用分隔符 sep 进行分割，分割步长为 step
  - 将数字以非数字符（负号、小数点）分割成数组
  - 整数部分，每 step 个长度插入一个 sep
  - 合并数组成 val
5. 显示 val

#### 问题

- 如果实时限制 val 的 min、max，则无法更改第一个数字，比如 1~1000，如何输入 2
 - 可以 emit change 的时候判断校正数值范围

- 如果实时格式化千分位，会导致光标位置错位（概率性出现）
  - 同样也可以 emit change 的时候格式化（不喜欢这种方式）
  - 在 input 的时候，使用 [selectText](https://developer.mozilla.org/zh-CN/docs/Web/API/HTMLInputElement/setSelectionRange) 将光标移至末尾