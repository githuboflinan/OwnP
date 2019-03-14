import LogHelper from "../../core/tool/LogHelper";
import UIResMap from "../../core/constant/UIResMap";

const { ccclass, property } = cc._decorator;

@ccclass
export default class ViewManager {
    static getInstance() {
        if (!ViewManager.instance) {
            ViewManager.instance = new ViewManager();
        }

        return ViewManager.instance;
    }

    private static instance = null;

    isShowing: boolean = false;

    depsCaches: any = {};

    openView(prefabName: string, data?: any, parent?: cc.Node, callBack?: () => void) {
        if (this.isShowing) {
            return;
        }

        this.isShowing = true;

        cc.loader.loadRes("prefab/view/" + prefabName, (err, prefab) => {
            LogHelper.log("open view: " + prefabName);
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
                    node.logicComponent.data = data;
                    node.logicComponent.deps = deps;
                    node.logicComponent.onEnter();
                }

                if (callBack) {
                    callBack();
                }
            } else {
                LogHelper.log(`open view ${prefabName} failed, [ERROR]: ` + JSON.stringify(err));
            }

            this.isShowing = false;
        });
    }

    loadSpriteFrameByName(imgName: string, node: cc.Node, callback: (deps) => void) {
        if (imgName !== "" && node) {
            let sprite = node.getComponent(cc.Sprite);
            if (sprite) {
                let resInfo = UIResMap[imgName];
                if (resInfo) {
                    let resCache = cc.loader.getRes(resInfo.resName, resInfo.resType);
                    if (resCache) {
                        if (resInfo.resType.name === "cc_SpriteFrame") {
                            sprite.spriteFrame = resCache;
                        } else if (resInfo.resType.name === "cc_SpriteAtlas") {
                            sprite.spriteFrame = resCache.getSpriteFrame(imgName.split(".")[0]);
                        }

                        let deps = cc.loader.getDependsRecursively(resCache);
                        callback(deps)
                    } else {
                        cc.loader.loadRes(resInfo.resName, resInfo.resType, (err, res) => {
                            if (err) {
                                LogHelper.log(`loadRes ${resInfo.resName} failed!!!!!! \n[ERROR]: ` + JSON.stringify(err));
                            } else {
                                if (resInfo.resType.name === "cc_SpriteFrame") {
                                    sprite.spriteFrame = res;
                                } else if (resInfo.resType.name === "cc_SpriteAtlas") {
                                    sprite.spriteFrame = res.getSpriteFrame(imgName.split(".")[0]);
                                }

                                let deps = cc.loader.getDependsRecursively(res);
                                callback(deps)
                            }
                        });
                    }
                } else {
                    LogHelper.logErr(`img ${imgName} is not exists!!!!!!!!!!!`);
                }
            }
        }
    }

    retainDeps(deps) {
        if (deps && typeof deps === "string") {
            let resCache = this.depsCaches[deps] || 0;
            resCache += 1;
            this.depsCaches[deps] = resCache;
            LogHelper.log("retain deps: " + deps);
        } else if (deps && deps instanceof Array) {
            deps.forEach(dep => {
                this.retainDeps(dep);
            });
        }
    }

    releaseDeps(deps) {
        if (deps && typeof deps === "string") {
            if (this.depsCaches[deps] && this.depsCaches[deps] > 0) {
                this.depsCaches[deps] -= 1;

                LogHelper.log("release========deps: " + deps);
            }
        } else if (deps && deps instanceof Array && deps.length > 0) {
            deps.forEach(dep => {
                this.releaseDeps(dep);
            });
        }
    }

    clearUnusedRes() {
        let tempKeyList = [];

        for (let key in this.depsCaches) {
            if (this.depsCaches.hasOwnProperty(key)) {
                let count = this.depsCaches[key];

                if (count > 1) {
                    LogHelper.log("key: " + key + " count: " + count);
                } else if (count === 0) {
                    tempKeyList.push(key);
                }
            }
        }

        tempKeyList.forEach(k => {
            cc.loader.release(k);
            delete this.depsCaches[k];
            LogHelper.log("release key: " + k);
        });

        LogHelper.log("after clearUnusedRes========depsCaches: " + JSON.stringify(this.depsCaches));
    }
}
