
const { ccclass, property } = cc._decorator;

@ccclass
export default class UserComponent extends cc.Component {
    onEnter() {
        // todo
        console.log("onEnter in UserComponent-=-=-=-");
    }
}
