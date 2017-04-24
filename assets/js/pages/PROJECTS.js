import HeaderFunctions from "../modules/headerFunctions";
import Sliders from "../modules/sliders.js";
import PLAYER from '../modules/YTembed.js';

export default {
    init(){
        HeaderFunctions.init();
        Sliders.init();
        PLAYER.init();
    }
};