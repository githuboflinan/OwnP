import ViewManager from "../manager/ViewManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class GameStart extends cc.Component {
    @property(cc.Node)
    nameNode: cc.Node = null;

    onLoad() {
        let deps = cc.loader.getDependsRecursively("b8583f60-f97a-427b-ba02-53f8e8974eae");
        console.log("========mainScene deps: " + JSON.stringify(deps));

        if (this.nameNode) {
            let label = this.nameNode.getComponent(cc.Label);
            label.string = "this is a test";
        }

        if (this.sprNode) {
            this.sprNode.scale = 1.2;
            this.sprNode.rotation = 90;
        }

        cc.log("hello new game");

        this.testView();
    }

    testView() {
        let cb = () => {
            ViewManager.getInstance().openView("MainView");
        };

        let cb2 = () => {
            // ViewManager.getInstance().clearUnusedRes();
        };

        this.node.runAction(cc.sequence(cc.delayTime(2.0),
                                        cc.callFunc(cb),
                                        cc.delayTime(2.0),
                                        cc.callFunc(cb2)));
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
