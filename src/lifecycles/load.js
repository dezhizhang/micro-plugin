import { LOADING_SOURCE_CODE, NOT_BOOTSTRAPPED } from "../applications/app.helpers";



function flattenFnArray(fns) {
    fns = Array.isArray(fns) ? fns : [fns];

    return (props) => fns.reduce((p, fn) => p.then(() => fn(props)), Promise.resolve())
}

export async function toLoadPromise(app) {
    app.status = LOADING_SOURCE_CODE;
    let { bootstrap, mount, unmount } = await app.loadApp(app.custormProps);

    app.status = NOT_BOOTSTRAPPED;
    app.bootstrap = flattenFnArray(bootstrap);
    app.mount = flattenFnArray(mount);
    app.unmount = flattenFnArray(unmount);
    return app;
}