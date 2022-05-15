import { started } from "../start";


export function reroute() {
    if(started) {
        // 
    } else {
        // 注册应用时需要预先加载
        return loadApps();
    }
}


function loadApps() {
    
}