(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.microPlugin = {}));
})(this, (function (exports) { 'use strict';

    // 是否被加载
    let started = false;

    function start() {
        started = true;
        // 加载应用
        reroute();
    }

    function reroute() {
        const { appsToLoad, appsToMount, appsToUnmount } = getAppChanges();
        console.log(appsToLoad, appsToMount, appsToUnmount);
        if (started) ; else {
            // 注册应用时需要预先加载
            return loadApps();
        }
    }


    function loadApps() {

    }

    // 描述应用的整个状态

    // 应用初始化
    const NOT_LOADED = 'NOT_LOADED';
    // 加载资源
    const LOADING_SOURCE_CODE = 'LOADING_SOURCE_CODE';
    // 应用还没有调用bootstrap
    const NOT_BOOTSTRAPPED = 'NOT_BOOTSTRAPPED';
    //启动中
    const BOOTSTRAPPING = 'BOOTSTRAPPING';
    // 没有调用mount方法
    const NOT_MOUNTED = 'NOT_MOUNTED';
    //加载应用
    const MOUNTED = 'MOUNTED';

    // 当前应用是否要被激活
    function shouldBeActive(app) {
        return app.activeWhen(window.location);
    }

    // 用来存放所有应用
    const apps = [];

    function registerApplication(appName, loadApp, activeWhen, customProps) {
        apps.push({
            name: appName,
            loadApp,
            activeWhen,
            customProps,
            status: NOT_LOADED
        });

        reroute();

    }

    function getAppChanges() {
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

            }
        });
        return { appsToUnmount, appsToLoad, appsToMount }
    }

    exports.registerApplication = registerApplication;
    exports.start = start;

    Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=index.js.map
