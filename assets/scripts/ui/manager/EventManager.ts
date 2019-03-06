import { EventType } from "../../core/constant/EventType";

const { ccclass } = cc._decorator;

@ccclass
export default class EventManager {
    static getInstance() {
        if (!EventManager.instance) {
            EventManager.instance = new EventManager();
        }

        return EventManager.instance;
    }

    private static instance = null;

    listenerList: any = {};

    addEventListener(eventType: EventType, callBack: () => void) {
        let eventArr = this.listenerList[eventType] || [];
        if (eventArr.indexOf(callBack) === -1) {
            eventArr.push(callBack);
        }

        this.listenerList[eventType] = eventArr;
    }

    removeEventListener(eventType: EventType, callBack: () => void) {
        let eventArr = this.listenerList[eventType];
        if (eventArr) {
            let index = eventArr.indexOf(callBack);
            if (index !== -1) {
                eventArr.splice(index, 1);
            }
        }
    }

    dispatchEvent(eventType: EventType, data?: any) {
        let eventArr = this.listenerList[eventType];
        if (eventArr) {
            eventArr.forEach(callback => {
                callback(data);
            });
        }
    }
}
