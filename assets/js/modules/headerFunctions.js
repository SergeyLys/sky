import select2 from '../libs/select2.js';


export default {

    init(){
        this.headerFunctions();
    },

    headerFunctions () {

        $(document).on('click', function() {
            $('.menu-button').removeClass('active');
            $('.site-nav').slideUp('active');
        });

        $('.menu-button').on('click', function (e) {
            e.stopPropagation();
            $(this).toggleClass('active');
            $('.site-nav').slideToggle('active').toggleClass('active');
        });

        $('.site-nav').on('click', function(e) {
            e.stopPropagation();
        });

        function formatState (state) {
            if (!state.id) { return state.text; }
            console.log(state.element.value.split('_')[0].toLowerCase());
            var $state = $(
                '<span><img class="contextChange" src= "../images/flags/' + state.element.value.split('_')[0].toLowerCase() + '.png" class="img-flag" /> ' + state.text + '</span>'
                );
            return $state;
        }

        $(".lang").select2({
            // templateResult: formatState,
            // templateSelection: formatState,
            minimumResultsForSearch: Infinity
        });

        // $('.lang').on("select2:select", function(e){
        //     console.log(e.params);
        //     window.location.replace(e.params.data.id.split('_')[1]);
        // });

    }
};