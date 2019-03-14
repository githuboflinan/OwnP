import LogHelper from "../../core/tool/LogHelper";
import { EventType } from "../../core/constant/EventType";
import EventManager from "../manager/EventManager";
import ViewManager from "../manager/ViewManager";
import UserComponent from "../base/UserComponent";

const { ccclass, property } = cc._decorator;

@ccclass
export default class MainViewLogic extends UserComponent {
    @property(cc.Node)
    askNode: cc.Node = null;

    @property(cc.Prefab)
    topPrefab: cc.Prefab = null;

    eventBack: (data?: any) => void = null;

    onEnter() {
        super.onEnter();

        this.askNode.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.askNode.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);

        this.eventBack = this.onEventBack.bind(this);

        this.addEventListener();

        if (this.topPrefab) {
            this.openPrefab(this.topPrefab, {}, this.node);
        }
    }

    addEventListener() {
        EventManager.getInstance().addEventListener(EventType.TOP_KEY_BACK, this.eventBack);
    }

    removeEventListener() {
        EventManager.getInstance().removeEventListener(EventType.TOP_KEY_BACK, this.eventBack);
    }

    onTouchStart(event: cc.Event.EventTouch) {
        // LogHelper.log("on askNode touch start");
    }

    onTouchEnd(event: cc.Event.EventTouch) {
        LogHelper.log("on askNode touch end");
        ViewManager.getInstance().openView("StageView", null, null, () => {
            this.closeSelf();
        });
    }

    onEventBack() {
        // this.closeSelf();
    }
}
