
const { ccclass } = cc._decorator;

@ccclass
export default class LogHelper {
    static log(message) {
        if (window["console"]) {
            console.log("console log: " + message);
        } else {
            cc.log(message);
        }
    }

    static logErr(message) {
        cc.error(message);
    }
}
