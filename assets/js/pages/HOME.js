import HeaderFunctions from "../modules/headerFunctions";
import FormFunctions from "../modules/formFunctions";
import Sliders from "../modules/sliders.js";
import MapInit from "../modules/map.js";

export default {
    init(){
        HeaderFunctions.init();
        Sliders.init();
        // MapInit.init();
        FormFunctions.init();
    }
};