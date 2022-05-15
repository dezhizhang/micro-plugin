

/**
 * @param {*} appName 应用名称
 * @param {*} loadApp 加载应用
 * @param {*} activeWhen 当前激活的应用
 * @param {*} customProps 自定义属性
*/

import { NOT_LOADED } from "./app.helpers";

// 用来存放所有应用
const app = [];

export function registerApplication(appName,loadApp,activeWhen,customProps) {
    app.push({
        name:appName,
        loadApp,
        activeWhen,
        customProps,
        status:NOT_LOADED
    });
    
}

