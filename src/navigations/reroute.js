import { getAppChanges } from "../applications/app";
import { toBootstrapPromise } from "../lifecycles/bootstrap";
import { toLoadPromise } from "../lifecycles/load";
import { toMountPromise } from "../lifecycles/mount";
import { toUnmountPromise } from '../lifecycles/unmount';
import { started } from "../start";


export function reroute() {
    const { appsToLoad, appsToMount, appsToUnmount } = getAppChanges();
    console.log(appsToLoad, appsToMount, appsToUnmount)
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
        let unmountPromise = appsToUnmount.map(toUnmountPromise);
        appsToLoad.map(async (app) => {
            app = await toLoadPromise(app);
            app = await toBootstrapPromise(app);
            return await toMountPromise(app)
        });
        appsToMount.map(async (app) => {
            app = await toBootstrapPromise(app);
            return toMountPromise(app);
        })
    }
}
