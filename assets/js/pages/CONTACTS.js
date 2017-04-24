import HeaderFunctions from "../modules/headerFunctions";
import Sliders from "../modules/sliders.js";
import FormFunctions from "../modules/formFunctions";
import GMap from '../modules/map.js';

export default {
    init(){
        HeaderFunctions.init();
        Sliders.init();
        GMap.init();
        FormFunctions.init();
    }
};