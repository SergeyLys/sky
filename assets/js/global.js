import COMMON from './pages/COMMON';
import HOME from "./pages/HOME";
import PROJECTS from "./pages/PROJECTS";
import CONTACTS from "./pages/CONTACTS";

let init = null;

switch (global.vars.page) {
    case 'home_page':
        init = HOME.init.bind(HOME);
        break;
    case 'projects_page':
        init = PROJECTS.init.bind(PROJECTS);
        break;
    case 'common_page':
        init = COMMON.init.bind(COMMON);
        break;
    case 'contacts_page':
        init = CONTACTS.init.bind(CONTACTS);
        break;
    default:
        init = () => {
            console.log('default init');
        };
}

$(document).ready(init());

$(window).on('resize', function() {

});

$(window).on('scroll', function() {

});

$(window).on('load', function () {

});