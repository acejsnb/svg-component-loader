const vue = require('vue');
const react = require('react');

module.exports = async function (svg) {
    const ctx = this;
    const { async, _module: { resourceResolveData: { relativePath } } } = ctx;
    // 根据路径获取文件名字
    const pathArr = relativePath.includes('\\') ? relativePath.split('\\') : relativePath.split('/');
    let source = svg.replaceAll('\n', '').replaceAll('   ', ''),
        name = pathArr.pop(),
        svgHtml = '';
    if (!name.endsWith('.svg')) name = pathArr.pop();
    const callback = async();
    const reg = /<svg (([\s\S])*?)<\/svg>/ig;
    const regDefs = /<defs(([\s\S])*?)<\/defs>/ig;
    const regStyle = /<style(([\s\S])*?)<\/style>/ig;
    const regT = / t="(([\s\S])*?)"/ig;
    const regPid = / p-id="(([\s\S])*?)"/ig;
    const regClass = / class="(([\s\S])*?)"/ig;
    if (source.includes('</defs>')) source = source.replace(regDefs, '');
    if (source.includes('</style>')) source = source.replace(regStyle, '');
    if (source.includes(' t="')) source = source.replace(regT, '');
    if (source.includes(' p-id="')) source = source.replace(regPid, '');
    if (source.includes(' class="')) source = source.replace(regClass, '');
    if (reg.test(source)) svgHtml = `<svg class="v-svg-${name.replace('.svg', '')}" ${RegExp.$1}</svg>`;
    // if (context.issuer.endsWith('.jsx') || context.issuer.endsWith('.tsx')) callback(null, `export default () => ${svgHtml}`);
    // else if (context.issuer.endsWith('.vue')) callback(null, `<template>${svgHtml}</template>`);
    // else callback(null, svgHtml);
    let result = '';
    if (vue && !react) {
        result = vue.version.startsWith('3') ? `
          export default {
            setup() {
              return () => (
                ${svgHtml}
              )
            }
          }
        ` : `<template>${svgHtml}</template>`;
    } else {
        result = `export default () => ${svgHtml}`;
    }
    callback(null, result);
};
