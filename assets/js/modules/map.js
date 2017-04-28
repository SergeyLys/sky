export default {
	init() {
		this.initMap();
	},

	initMap() {

				$.getScript("http://maps.google.com/maps/api/js?key=AIzaSyC1mu5p7L3KMHnWQXTk4LTWR3BSiaQtdW8&sensor=true").done(function () {
						const mapId = $('#map');
						const dataLat = parseFloat(mapId.attr('data-lat'));
						const dataLng = parseFloat(mapId.attr('data-lng'));
						const center = {lat: dataLat, lng: dataLng};

						var map = new google.maps.Map(document.getElementById("map"), {
								zoom: 16,
								center: center,
								scrollwheel: false,
								draggable: true,
								zoomControl: true,
								zoomControlOptions: {
										position: google.maps.ControlPosition.TOP_RIGHT
								},
								panControl: false,
								mapTypeControl: false,
								streetViewControl: false
						});

						var marker = new google.maps.Marker({
								position: center,
								map: map,
								icon: $('#map').attr('data-pin'),
								title: "my place"
						});
				});
		}
}
