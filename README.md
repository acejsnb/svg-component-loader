## 安装
- `npm install -D svg-component-loader`
- `yarn add -D svg-component-loader`

## 使用
```
    vue2
    {
        test: /\.svg$/,
        use: ['vue-loader', 'svg-component-loader')]
    }
```

```
    vue3
    {
        test: /\.svg$/,
        use: ['babel-loader', 'svg-component-loader')]
    }
```

```
    react
    {
        test: /\.svg$/,
        use: ['babel-loader', 'svg-component-loader')]
    }
```
