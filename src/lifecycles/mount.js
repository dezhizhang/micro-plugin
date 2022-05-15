import { MOUNTED, NOT_MOUNTED } from "../applications/app.helpers";

export async function toMountPromise(app) {
    if(app.status !== NOT_MOUNTED) {
        return app
    }

    app.status = MOUNTED;
    await app.mount(app.customProps);
    app.status = NOT_MOUNTED;
    return app;

}

