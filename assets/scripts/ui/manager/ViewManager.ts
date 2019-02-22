
const { ccclass, property } = cc._decorator;

@ccclass
export default class ViewManager {
    static instance = null;

    static getInstance() {
        if (!this.instance) {
            this.instance = new ViewManager();
        }

        return this.instance;
    }

    isShowing: boolean = false;

    depsCaches: any = {};

    openView(prefabName: string, data?: any, parent?: cc.Node, callBack?: () => void) {
        if (this.isShowing) {
            return;
        }

        this.isShowing = true;

        cc.loader.loadRes("prefab/view/" + prefabName, (err, prefab) => {
            if (!err) {
                let node = cc.instantiate(prefab);
                if (!parent) {
                    parent = cc.director.getScene();
                }

                node.parent = parent;
                node.logicComponent = node.getComponent(prefabName + "Logic");

                let deps = cc.loader.getDependsRecursively(prefab);
                this.retainDeps(deps);

                if (node.logicComponent && node.logicComponent.onEnter) {
                    node.logicComponent.deps = deps;
                    node.logicComponent.onEnter();
                }

                console.log("-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-");
                console.log("deps: " + JSON.stringify(deps));
                console.log("-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-");
            } else {
                console.log("err ------- " + prefabName);
                console.log(JSON.stringify(err));
            }

            this.isShowing = false;
        });
    }

    retainDeps(deps) {
        if (deps && typeof deps === "string") {
            let resCache = this.depsCaches[deps] || 0;
            resCache += 1;
            this.depsCaches[deps] = resCache;
            console.log("depsCaches " + JSON.stringify(this.depsCaches));
            console.log("deps is string-=-=-=-" + deps);
        } else if (deps && deps instanceof Array) {
            deps.forEach(dep => {
                this.retainDeps(dep);
            });
            console.log("deps is array-=-=-=-");
        }
        console.log("depstype: " + typeof (deps));

        console.log("retain========depsCaches: " + JSON.stringify(this.depsCaches));
    }

    releaseDeps(deps) {
        if (deps && typeof deps === "string") {
            if (this.depsCaches[deps] && this.depsCaches[deps] > 0) {
                this.depsCaches[deps] -= 1;
            }
        } else if (deps && deps instanceof Array) {
            deps.forEach(dep => {
                this.releaseDeps(dep);
            });
        }

        console.log("release========depsCaches: " + JSON.stringify(this.depsCaches));
    }

    clearUnusedRes() {
        let tempKeyList = [];
        for (let k in this.depsCaches) {
            if (this.depsCaches[k] === 0) {
                tempKeyList.push(k);
            }
        }

        tempKeyList.forEach(k => {
            cc.loader.release(k);
            delete this.depsCaches[k];
            console.log("release key: " + k);
        });

        console.log("clearUnusedRes========depsCaches: " + JSON.stringify(this.depsCaches));
    }
}
