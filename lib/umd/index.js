(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.microPlugin = {}));
})(this, (function (exports) { 'use strict';

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
    //自裁中
    const UNMOUNTING = 'UNMOUNTING';

    // 当前应用是否要被激活
    function shouldBeActive(app) {
        return app.activeWhen(window.location);
    }

    async function toBootstrapPromise(app) {
        if (app.status !== NOT_BOOTSTRAPPED) {
            return app;
        }

        app.status = BOOTSTRAPPING;
        await app.bootstrap(app.customProps);
        app.status = NOT_MOUNTED;
        return app;
    }

    function flattenFnArray(fns) {
        fns = Array.isArray(fns) ? fns : [fns];

        return (props) => fns.reduce((p, fn) => p.then(() => fn(props)), Promise.resolve())
    }

    async function toLoadPromise(app) {
        if(app.loadPromise) {
            return app.loadPromise;
        }
        return (app.loadPromise) = Promise.resolve().then(async() => {
            app.status = LOADING_SOURCE_CODE;
            let { bootstrap, mount, unmount } = await app.loadApp(app.custormProps);
        
            app.status = NOT_BOOTSTRAPPED;
            app.bootstrap = flattenFnArray(bootstrap);
            app.mount = flattenFnArray(mount);
            app.unmount = flattenFnArray(unmount);
            delete app.loadPromise;
            return app;
        })
       
    }

    async function toMountPromise(app) {
        if(app.status !== NOT_MOUNTED) {
            return app
        }

        app.status = MOUNTED;
        await app.mount(app.customProps);
        app.status = NOT_MOUNTED;
        return app;

    }

    async function toUnmountPromise(app) {
        if (app.status !== MOUNTED) {
            return app;
        }

        app.status = UNMOUNTING;
        await app.unmount(app.customProps);
        app.status = NOT_MOUNTED;
        return app;

    }

    // 是否被加载
    let started = false;

    function start() {
        started = true;
        // 加载应用
        reroute();
    }

    const routingEventsListeningTo = ['hashchange', 'popstate'];


    function urlReroute() {
        reroute();
    }
    const capturedEventListeners = {
        hashchange: [],
        popstate: [],
    };

    window.addEventListener('hashchange', urlReroute);
    window.addEventListener('popstate', urlReroute);


    const originalAddEventListener = window.addEventListener;
    const originalRemoveEventListener = window.removeEventListener;


    window.addEventListener = function (eventName, fn) {
        if (routingEventsListeningTo.indexOf(eventName) >= 0 && !capturedEventListeners[eventName].some((listener) => listener == fn)) {
            capturedEventListeners[eventName].push(eventName);
            return;
        } else {
            return originalAddEventListener.apply(this, arguments);
        }
    };


    window.removeEventListener = function (eventName, fn) {
        if (routingEventsListeningTo.indexOf(eventName) >= 0) {
            capturedEventListeners[eventName] = capturedEventListeners[eventName].filter(l => l !== fn);
            return
        }
        return originalRemoveEventListener.apply(this, arguments);
    };

    function reroute() {
        const { appsToLoad, appsToMount, appsToUnmount } = getAppChanges();
        console.log(appsToLoad, appsToMount, appsToUnmount);
        if (started) {
            // 装载
            return performAppChanges();
        } else {
            // 注册应用时需要预先加载
            return loadApps();
        }

        async function loadApps() {
            let apps = await Promise.all(appsToLoad.map(toLoadPromise));
            console.log('apps', apps);

        }

        async function performAppChanges() {
            appsToUnmount.map(toUnmountPromise);
            appsToLoad.map(async (app) => {
                app = await toLoadPromise(app);
                app = await toBootstrapPromise(app);
                return await toMountPromise(app)
            });
            appsToMount.map(async (app) => {
                app = await toBootstrapPromise(app);
                return toMountPromise(app);
            });
        }
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
