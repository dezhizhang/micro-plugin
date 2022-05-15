

/**
 * @param {*} appName 应用名称
 * @param {*} loadApp 加载应用
 * @param {*} activeWhen 当前激活的应用
 * @param {*} customProps 自定义属性
*/

import { reroute } from "../navigations/reroute";
import { BOOTSTRAPPING, LOADING_SOURCE_CODE, NOT_BOOTSTRAPPED, NOT_LOADED, NOT_MOUNTED, shouldBeActive, MOUNTED } from "./app.helpers";

// 用来存放所有应用
const apps = [];

export function registerApplication(appName, loadApp, activeWhen, customProps) {
    apps.push({
        name: appName,
        loadApp,
        activeWhen,
        customProps,
        status: NOT_LOADED
    });

    reroute();

}

export function getAppChanges() {
    const appsToUnmount = []; // 要自裁的app
    const appsToLoad = []; // 要加载的app
    const appsToMount = []; // 需要挂载

    apps.forEach(app => {
        const appShouldBeActive = shouldBeActive(app);
        switch (app.status) {
            case NOT_LOADED:
            case LOADING_SOURCE_CODE:
                if (appShouldBeActive) {
                    appsToLoad.push(app);
                }
                break;
            case NOT_BOOTSTRAPPED:
            case BOOTSTRAPPING:
            case NOT_MOUNTED:
                if (appShouldBeActive) {
                    appsToMount.push(app);

                }
                break;
            case MOUNTED:
                if (!appShouldBeActive) {
                    appsToUnmount.push(app);
                }
            default:

        }
    })
    return { appsToUnmount, appsToLoad, appsToMount }
}

