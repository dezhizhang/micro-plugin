import { getAppChanges } from "../applications/app";
import { started } from "../start";


export function reroute() {
    const { appsToLoad, appsToMount, appsToUnmount } = getAppChanges();
    console.log(appsToLoad, appsToMount, appsToUnmount)
    if (started) {
        // 
    } else {
        // 注册应用时需要预先加载
        return loadApps();
    }
}


function loadApps() {

}