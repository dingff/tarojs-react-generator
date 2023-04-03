# tarojs-react-generator

> Taro 页面/组件创建工具，支持 Taro 3 + React

## 安装


```bash
npm install tarojs-react-generator --save-dev
```

## 使用


修改项目 `config/index.js` 中的 plugins 配置

```js
const config = {
  ...
  plugins: [
    ...
    ['tarojs-react-generator', {
      css: 'sass',
      cssModules: true
    }]
  ]
  ...
}
```

### 插件配置

| 参数项 | 类型 | 说明 | 默认值 |
| :-----| :---- | :---- | :---- |
| css | string | 指定 css 预处理器，可选 ```none```, ```sass```, ```less```, ```stylus``` | ```sass```|
| cssModules | boolean | 是否开启 cssModules，可选 ```true```, ```false```  | ```true``` |
| typescript | boolean | 是否使用 typescript，可选 ```true```, ```false```  | ```false``` |
| hooks | boolean | 是否使用 hooks，可选 ```true```, ```false```  | ```false``` |
| createConfigFile | boolean | 是否单独创建页面配置文件，可选 ```true```, ```false```  | ```true``` |
| updateRouter | object | 创建页面后更新路由配置 |  |
| pageTpl | string | 自定义页面模板的路径，如'src/tpl/page.ejs'，注入变量有 ```name```, ```upperFirst```, ```lowerFirst``` | 默认为''，不使用自定义模板 |
| componentTpl | string | 自定义组件模板的路径，注入变量有 ```name```, ```upperFirst```, ```lowerFirst``` | 默认为''，不使用自定义模板 |
| configTpl | string | 自定义配置模板的路径，注入变量有 ```name```, ```upperFirst```, ```lowerFirst``` | 默认为''，不使用自定义模板 |
| styleTpl | string | 自定义样式模板的路径，注入变量有 ```name```, ```isPage```, ```upperFirst```, ```lowerFirst``` | 默认为''，不使用自定义模板 |

### updateRouter 参数

| 参数项 | 类型 | 说明 | 默认值 |
| :-----| :---- | :---- | :---- |
| enable | boolean | 是否开启，可选 ```true```, ```false```  | ```true``` |
| space | number | 插入位置缩进空格数 | ```4``` |

##### 模板示例
src/tpl/page.ejs
```js
/**
 * 模板注入变量
 * @param name: string 文件名
 * @param upperFirst: function 将首字母大写的函数
 * @param lowerFirst: function 将首字母小写的函数
 */
import { useEffect } from 'react'
import { View } from '@tarojs/components'
import styles from './index.module.scss'

function <%= upperFirst(name) %>() {

  return (
    <View className={styles.<%= name %>Page}>
      hello
    </View>
  )
}

export default <%= upperFirst(name) %>
```
src/tpl/style.ejs
```js
<% if (isPage) { %>.<%= name %>Page {

}
<% } else { %>.<%= lowerFirst(name) %>Com {

}
<% } %>
```

### 命令行参数

| 参数项 | 类型 | 说明 |
| :-----| :---- | :---- |
| --com | string | 创建一个公共组件/页面组件 |
| --page | string | 创建一个页面 |


### 示例

##### 创建公共组件
```bash
taro g --com Button
```


##### 创建页面组件（index为页面文件夹名称）
```bash
taro g --com index/Button  
```


##### 创建页面
```bash
taro g --page mine
```

```
-- 页面：pages/mine/index.tsx
-- 配置：pages/mine/index.config.tsx
-- 样式：pages/mine/index.module.scss
```



##### 创建页面（指定路径）
```bash
taro g --page index/bannerDetail
```

```
-- 页面：pages/index/bannerDetail/index.tsx
-- 配置：pages/index/bannerDetail/index.config.tsx
-- 样式：pages/index/bannerDetail/index.module.scss
```
