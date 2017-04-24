export default {
    init() {
        this.projectVideoEmbed();
    },

    projectVideoEmbed() {
      $.getScript('http://www.youtube.com/iframe_api').done(function() {
        function onPlayerStateChange(event) {
          switch(event.data) {
            case YT.PlayerState.ENDED:
            // console.log('Video has ended.');
            break;
            case YT.PlayerState.PLAYING:
            // console.log('Video is playing.');
            break;
            case YT.PlayerState.PAUSED:
            // console.log('Video is paused.');
            break;
            case YT.PlayerState.BUFFERING:
            // console.log('Video is buffering.');
            break;
            case YT.PlayerState.CUED:
            // console.log('Video is cued.');
            break;
          }
        }

        $('.video-wrap .overlay').on('click', function() {
          var vidId = $(this).attr('data-id');
          $(this).addClass('hidden');
          $(this).parent().find('.iframe-box').html('<iframe id="player_'+vidId+'" width="420" height="315" src="http://www.youtube.com/embed/' + vidId + '?enablejsapi=1&autoplay=1&autohide=1&showinfo=0" frameborder="0" allowfullscreen></iframe>');

          new YT.Player('player_'+vidId, {
            events: {
              'onStateChange': onPlayerStateChange
            }
          });
        });

      });

    }
}