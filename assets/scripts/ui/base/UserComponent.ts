import ViewManager from "../manager/ViewManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class UserComponent extends cc.Component {
    @property(cc.boolean)
    isAutoRelease: boolean = true;

    deps: any = [];

    data: any = null;

    onEnter() {
        // todo
        console.log("onEnter in UserComponent-=-=-=-");
    }

    openPrefab(prefab: cc.Prefab, data?: any, parent?: cc.Node, callBack?: () => void) {
        let node = cc.instantiate(prefab);
        if (!parent) {
            parent = cc.director.getScene();
        }

        node.parent = parent;
        node.logicComponent = node.getComponent(node.name + "Logic");

        if (node.logicComponent && node.logicComponent.onEnter) {
            node.logicComponent.data = data;
            node.logicComponent.onEnter();
        }

        return node;
    }

    addEventListener() {
        // todo
    }

    removeEventListener() {
        // todo
    }

    closeSelf() {
        this.node.parent = null;
        this.node.destroy();
    }

    onDestroy() {
        this.removeEventListener();

        if (this.isAutoRelease) {
            ViewManager.getInstance().releaseDeps(this.deps);
            ViewManager.getInstance().clearUnusedRes();
        }
    }
}
