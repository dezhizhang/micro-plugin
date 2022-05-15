import { reroute } from './reroute';

export const routingEventsListeningTo = ['hashchange', 'popstate'];


function urlReroute() {
    reroute([], arguments);
};

const capturedEventListeners = {
    hashchange: [],
    popstate: [],
}

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
}


window.removeEventListener = function (eventName, fn) {
    if (routingEventsListeningTo.indexOf(eventName) >= 0) {
        capturedEventListeners[eventName] = capturedEventListeners[eventName].filter(l => l !== fn);
        return
    }
    return originalRemoveEventListener.apply(this, arguments);
}


