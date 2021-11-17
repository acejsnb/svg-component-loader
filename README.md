## 安装
- `npm install -D svg-component-loader`
- `yarn add -D svg-component-loader`

## 使用
```
    vue2
    {
        test: /\.svg$/,
        use: ['vue-loader', 'vuecomponent-svg-loader')]
    }
```

```
    vue3
    {
        test: /\.svg$/,
        use: ['babel-loader', 'vuecomponent-svg-loader')]
    }
```

```
    react
    {
        test: /\.svg$/,
        use: ['babel-loader', 'vuecomponent-svg-loader')]
    }
```
