import { reroute } from "./navigations/reroute";

// 是否被加载
export let started = false;

export function start() {
    started = true;
    // 加载应用
    reroute();
}

