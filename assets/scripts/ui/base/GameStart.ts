import ViewManager from "../manager/ViewManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class GameStart extends cc.Component {
    @property([cc.SpriteAtlas])
    commonAtlas: cc.SpriteAtlas[] = [];

    onLoad() {
        this.retainCommonDeps();

        ViewManager.getInstance().openView("MainView", null, null);
    }

    retainCommonDeps() {
        this.commonAtlas.forEach(atlas => {
            let deps = cc.loader.getDependsRecursively(atlas);
            ViewManager.getInstance().retainDeps(deps);
        });
    }

    onTouchStart(event: cc.Event.EventTouch) {
        // let pos = this.node.convertTouchToNodeSpaceAR(event.touch);
    }

    onTouchEnd(event: cc.Event.EventTouch) {
        ViewManager.getInstance().openView("MainView");
    }

    initSDK() {
        // todo
    }

    initSolution() {
        // todo
    }

    enterGame() {
        // todo
    }
}
