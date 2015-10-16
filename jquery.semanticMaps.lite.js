/*
 * jQuery crknMaps
 * Plugin creado por Masquerade Circus
 * http://masquerade-circus.net
 * Versión 0.3
 */
/*
 * jQuery crknMaps
 * Plugin creado por Masquerade Circus
 * http://www.masquerade-circus.creaken.com
 * Versión 0.3
 */
(function ($) {
	"use strict";
	var semanticMapsActive = false;
	window.googlemapsloaded = function () {
		semanticMapsActive = true;
	};
	$.extend($.fn, {
		semanticMaps : function () {
			function loadGoogle() {
				var script = document.createElement("script");
				script.type = "text/javascript";
				script.src = "http://maps.googleapis.com/maps/api/js?&sensor=false&callback=googlemapsloaded&libraries=places";
				var s = document.getElementsByTagName('script')[0];
				s.parentNode.insertBefore(script, s);
				initSemanticMaps();
			}
			
			function initSemanticMaps() {
				function addSearchBox(map, google){
					// Create the search box and link it to the UI element.
					var input = $('<input id="pac-input" class="form-control" type="text" placeholder="Buscar en los alrededores" style="max-width: 50%">')[0], searchBox, markers = [];
					map.controls[google.maps.ControlPosition.TOP_CENTER].push(input);
					searchBox = new google.maps.places.SearchBox(input);
					
					google.maps.event.addListener(searchBox, 'places_changed', function() {
						var places = searchBox.getPlaces(), i, bounds, place_marker, place;
						if (places.length > 0){
							for (i = 0; place_marker = markers[i]; i++)
								place_marker.setMap(null);
							markers = [];
							bounds = new google.maps.LatLngBounds();
							for (i = 0; place = places[i]; i++) {
								var options = {
									map: map,
									title: place.name,
									animation: google.maps.Animation.DROP,
									position: place.geometry.location
								}
								
								if (place.photos) options.icon = place.photos[0].getUrl({'maxWidth': 35, 'maxHeight': 35});
								place_marker = new google.maps.Marker(options);// Create a marker for each place.
								markers.push(place_marker);
								bounds.extend(options.position);
								
								var contenido = '';
								if (place.photos) contenido += '<img src="'+place.photos[0].getUrl({'maxWidth': 150, 'maxHeight': 100})+'" style="display: block; float: left; margin: 0 1em 1em 0">';
								contenido += '<b>Nombre:</b> '+place.name+'<br><b>Dirección:</b> '+place.formatted_address+'<br>';
								if (place.types && place.types.length > 0) contenido += '<b>Tipo de establecimiento:</b> '+place.types.join(',')+'<br>';
								if (place.website) contenido += '<b>Sitio web:</b> '+place.website+'<br>';
								if (place.formatted_phone_number) contenido += '<b>Teléfono:</b> '+place.formatted_phone_number+'<br>';
								if (place.opening_hours){ 
									contenido += '<b>Horarios:</b> '+place.opening_hours.weekday_text.join(', ')+'<br>';
									contenido += '<b>Abierto ahora:</b> '+ (place.opening_hours.open_now ? 'Sí' : 'No') +'<br>'
								};
								if (place.rating) contenido += '<b>Rating:</b> '+ place.rating +'<br>';
								
								addInfoMarker(map, place_marker, contenido);
							}
							
							for (i in marker)
								bounds.extend(marker[i].position);
							
							map.fitBounds(bounds);
						}
					});

					// Bias the SearchBox results towards places that are within the bounds of the current map's viewport.
					google.maps.event.addListener(map, 'bounds_changed', function() {
						searchBox.setBounds(map.getBounds());
					});
				}
				
				if (typeof google == 'object' && typeof google.maps == 'object' && semanticMapsActive) {
						
						map = new google.maps.Map(a[0], {
							scrollwheel: false,
							center : new google.maps.LatLng(opt.lat, opt.lon),
							zoom : opt.zoom,
							mapTypeId : google.maps.MapTypeId.ROADMAP,
							styles : styles
						});
							
						/*Markers*/
						addMarker = function (map, lat, lon, icon, title, content, callback) {
							i = marker.push(new google.maps.Marker({
									map : map,
									position : new google.maps.LatLng(lat, lon),
									icon : icon,
									optimized : false,
									animation: google.maps.Animation.DROP,
									title : title
							}));
							addInfoMarker(map, marker[i-1], content, callback);
						};
						
						addInfoMarker = function (map, marker,content,callback){
							google.maps.event.addListener(marker, 'click', function () {
								map.setCenter(marker.getPosition());
								if (content.trim().length > 0){
									infowindow;
									infowindow.open(map, marker);
									infowindow.setContent(content);
								}
								if (callback && callback.length > 0){
									var func = new Function('marker', 'infowindow', callback);
									func.call(map, marker, infowindow);
								}
							});
						};
						infowindow = new google.maps.InfoWindow({content : ''});
						marker = [];
						
						for (i = 0; i < opt.markers.length; i++) {
							var cmarker = opt.markers.eq(i), 
								lat = cmarker.data('lat'), 
								lon = cmarker.data('lon'), 
								icon = cmarker.data('icon'), 
								title = cmarker.attr('title'), 
								content = cmarker.html(), 
								callback = cmarker.data('function');
							addMarker(map, lat, lon, icon, title, content, callback);
						}

						$(window).resize(function () {
							map.panTo(new google.maps.LatLng(opt.lat, opt.lon));
						});
						
						if (opt.searchBox != false)
							addSearchBox(map, google);
						
				} else {
					setTimeout(function () {
						initSemanticMaps();
					}, 100);
				}
				
			}
			
			
			
			var a = this,
			map,
			infowindow,
			opt = {
				zoom : a.data('zoom') || 16,
				lat : a.data('lat') || 0,
				lon : a.data('lon') || 0,
				landscape: a.data('landscape'),
				road : a.data('road'),
				water : a.data('water'),
				text : a.data('text'),
				poi : a.data('poi'),
				markers : $('.marker', a),
				searchBox : a.data('searchbox') || false
			},
			marker,
			i,
			addMarker,
			addInfoMarker,			
			styles = [];
			
			
			if (opt.landscape != []._)
				styles.push({ "featureType" : "landscape", "stylers" : [{"color" : "#"+opt.landscape}]});
			if (opt.road != []._)
				styles.push({ "featureType" : "road", "stylers" : [{"color" : "#"+opt.road}]});
			if (opt.text != []._)
				styles.push({ "featureType" : "water", "stylers" : [{"color" : "#"+opt.water}]});
			if (opt.water != []._)
				styles.push({ "elementType" : "labels.text", "stylers" : [ {"saturation" : 1}, {"weight" : 0.4}, {"color" : "#"+opt.text}]});
			if (opt.poi != []._)
				styles.push({"featureType": "poi","elementType": "geometry","stylers": [{ "color": "#"+opt.poi }]});
			
			typeof google == 'object' ? (function () {
				semanticMapsActive = true;
				initSemanticMaps();
			})() : loadGoogle();
			
			return {
				map: a[0],
				addMarker: function(o){
					var a = null, o = $.extend({
						lat: a,
						lon: a,
						icon: a,
						title: a,
						content: a,
						callback: a
					}, o);
					addMarker(map, o.lat, o.lon, o.icon, o.title, o.content, o.callback);
				}
			}
			
		}
	});
})(jQuery);
