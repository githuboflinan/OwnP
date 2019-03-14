import ViewManager from "../manager/ViewManager";
import EventManager from "../manager/EventManager";
import { EventType } from "../../core/constant/EventType";
import UserComponent from "../base/UserComponent";

const {ccclass, property} = cc._decorator;

@ccclass
export default class StageViewLogic extends UserComponent {
    @property(cc.Prefab)
    topPrefab: cc.Prefab = null;

    topBackFunc: (data?: any) => void = null;

    askNode: cc.Node = null;

    onEnter() {
        if (this.topPrefab) {
            this.openPrefab(this.topPrefab, {}, this.node);
        }

        this.topBackFunc = this.topBackEvent.bind(this);

        this.addEventListener();

        let askNode = this.node.getChildByName("askNode");
        askNode.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        askNode.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);

        this.askNode = askNode;
    }

    onTouchStart(event: cc.Event.EventTouch) {
        // let pos = this.node.convertTouchToNodeSpaceAR(event.touch);
    }

    onTouchEnd(event: cc.Event.EventTouch) {
        // let pos = this.node.convertTouchToNodeSpaceAR(event.touch);
        this.setSpriteFrameByName("ex_back.pn", this.askNode);
    }

    topBackEvent(data?: any) {
        ViewManager.getInstance().openView("MainView", null, null, () => {
            this.closeSelf();
        });
    }

    addEventListener() {
        EventManager.getInstance().addEventListener(EventType.TOP_KEY_BACK, this.topBackFunc);
    }

    removeEventListener() {
        EventManager.getInstance().removeEventListener(EventType.TOP_KEY_BACK, this.topBackFunc);
    }
}
