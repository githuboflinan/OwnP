import LogHelper from "../../core/tool/LogHelper";
import { EventType } from "../../core/constant/EventType";
import EventManager from "../manager/EventManager";
import UserComponent from "./UserComponent";

const {ccclass, property} = cc._decorator;
@ccclass
export default class TopNodeLogic extends UserComponent {
    onEnter() {
        // todo
    }

    onBackClick() {
        EventManager.getInstance().dispatchEvent(EventType.TOP_KEY_BACK);
    }

    test() {
        // LogHelper.log("this is a test for top node");
    }
}

