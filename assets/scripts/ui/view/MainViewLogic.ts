import ViewManager from "../manager/ViewManager";
import UserComponent from "../base/UserComponent";

const { ccclass, property } = cc._decorator;

@ccclass
export default class MainViewLogic extends UserComponent {
    @property(cc.Node)
    askNode: cc.Node = null;

    deps: any = [];

    onEnter() {
        super.onEnter();
        console.log("onEnter in MainView-=-=-=-=");

        this.askNode.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.askNode.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
    }

    onTouchStart(event: cc.Event.EventTouch) {
        console.log("on askNode touch start");
    }

    onTouchEnd(event: cc.Event.EventTouch) {
        console.log("on askNode touch end");
        this.node.parent = null;
        this.node.destroy();
    }

    onDestroy() {
        ViewManager.getInstance().releaseDeps(this.deps);
        ViewManager.getInstance().clearUnusedRes();
        console.log("onDestroy clear -=-=-=-=-=-=");
    }
}
