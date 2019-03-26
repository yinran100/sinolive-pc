# sinolive-pc

## 项目运行命令

```
npm install
```

###然后将根目录下的/ element-ui.common.js 文件拷到 node_modules/element-ui/lib/下，覆盖原有文件，且是 element2.4.11 版本，若不是，则把文件里 ElTableFooter 组件的 render 函数直接替换，即可实现走势图底部多行展示的效果，其中 col 属性是重写组件里的，若底部统计只有一行，可用官方的例子，直接返回一个数组，若有多行，请放在对象里的 col 属性里；

### 项目运行命令

```
npm run serve
```

### Compiles and minifies for production

```
npm run build
```

### Run your tests

```
npm run test
```

### Lints and fixes files

```
npm run lint
```
