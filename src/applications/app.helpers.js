// 描述应用的整个状态

// 应用初始化
export const NOT_LOADED = 'NOT_LOADED';
// 加载资源
export const LOADING_SOURCE_CODE = 'LOADING_SOURCE_CODE';
// 应用还没有调用bootstrap
export const NOT_BOOTSTRAPPED = 'NOT_BOOTSTRAPPED';
//启动中
export const BOOTSTRAPPING = 'BOOTSTRAPPING';
// 没有调用mount方法
export const NOT_MOUNTED = 'NOT_MOUNTED';
//加载应用
export const MOUNTED = 'MOUNTED';
// 正在挂载中
export const MOUNTING = 'MOUNTING';
// 更新中
export const UPDATINMG = 'UPDATINMG';
//自裁中
export const UNMOUNTING = 'UNMOUNTING';
// 完全绡
export const UNLOADING = 'NLOADING';
// 文件加载失败
export const LOAD_ERR = 'LOAD_ERR';
// 代码出错
export const SKIP_BECAUSE_BROKEN = 'SKIP_BECAUSE_BROKEN';

// 当前应用是否被激活
export function isAactive(app) {
    app.status === NOT_MOUNTED
}

// 当前应用是否要被激活
export function shouldBeActive(app) {
    return app.activeWhen(window.location);
}

