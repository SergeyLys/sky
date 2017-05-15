import '../libs/slick';

export default {
    init() {
        this.headerSlider();
        this.homeProjectSlider();
        this.homeVerticalSlider();
        this.centeredSlider();
        this.doubleSlider();
    },

    headerSlider() {
        $('.site-header_slider').slick({
            dots: true,
            arrows: false,
            autoplay: true,
            autoplaySpeed: 2000
        });
    },

    homeProjectSlider() {
      $('.projects-slider').slick({
          centerMode: true,
          responsive: [
          {
            breakpoint: 1023,
            settings: {
              centerMode: false
            }
          }
        ]
      });

      $('.projects-slider-info .b-info_item').eq(0).addClass('active');

      $('.projects-slider').on('beforeChange', function(event, slick, currentSlide, nextSlide){
        $('.projects-slider-info .b-info_item').removeClass('active');

        if ($('.projects-slider-info .b-info_item').eq(nextSlide).length != 0) {
          $('.projects-slider-info .b-info_item').eq(nextSlide).addClass('active');
        }
      });
    },

    homeVerticalSlider() {
      $('.home-verical-slider').slick({
        dots: true
      });
    },

    centeredSlider() {
      $('.center-slider').slick({
        centerMode: true,
        slidesToShow: 3,
        responsive: [
          {
            breakpoint: 1023,
            settings: {
              centerMode: false,
              slidesToShow: 1
            }
          }
        ]
      });
    },

    doubleSlider() {
      $('.double-slider').slick({
        centerMode: true,
        slidesToShow: 2,
        centerPadding: '80px',
        responsive: [
          {
            breakpoint: 1023,
            settings: {
              centerMode: false,
              slidesToShow: 1,
              centerPadding: '0px'
            }
          }
        ]
      });
    }
}