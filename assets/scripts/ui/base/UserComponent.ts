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

    setSpriteFrameByName(imgName: string, node: cc.Node) {
        let callBack = deps => {
            if (deps && typeof deps === "string") {
                if (this.deps.indexOf(deps) === -1) {
                    this.deps.push(deps);
                    ViewManager.getInstance().retainDeps(deps);
                    cc.loader.release(deps);
                }
            } else if (deps && deps instanceof Array) {
                deps.forEach(v => {
                    if (this.deps.indexOf(v) === -1) {
                        this.deps.push(v);
                        ViewManager.getInstance().retainDeps(v);
                    }
                });
            }
        };

        ViewManager.getInstance().loadSpriteFrameByName(imgName, node, callBack);
    }

    closeSelf() {
        this.node.parent = null;
        this.node.destroy();
    }

    onDestroy() {
        cc.log("--------------------destory node --------------------" + this.node.name);
        this.removeEventListener();

        ViewManager.getInstance().releaseDeps(this.deps);

        if (this.isAutoRelease) {
            ViewManager.getInstance().clearUnusedRes();
        }
    }
}
