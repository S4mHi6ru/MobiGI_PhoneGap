/**
 * Created by S4m on 09.05.2017.
 */

document.addEventListener("deviceready", function(){

    if(navigator.network.connection.type == Connection.NONE){
        $("#home_network_button").text('No Internet Access')
            .attr("data-icon", "delete")
            .button('refresh');
    }

});

var track_id = '';      // Name/ID of the exercise
var watch_id = null;    // ID of the geolocation
var tracking_data = []; // Array containing GPS position objects

$("#startTracking_start").live('click', function(){

    // Start tracking the User
    watch_id = navigator.geolocation.watchPosition(

        // Success
        function(position){
            tracking_data.push(position);
        },

        // Error
        function(error){
            console.log(error);
        },

        // Settings
        { frequency: 3000, enableHighAccuracy: true });

    // Tidy up the UI
    track_id = $("#track_id").val();

    $("#track_id").hide();

    $("#startTracking_status").html("Tracking workout: <strong>" + track_id + "</strong>");
});

$("#startTracking_stop").live('click', function(){
    // Stop tracking the user
    navigator.geolocation.clearWatch(wath_id);

    // Save the tracking data
    window.localStorage.setItem(track_i, JSON.stringify(tracking_data));

    // Reset watch_id and tracking_data
    var watch_id = null;
    var tracking_data = null;

    // Tidy up the UI
    $("trak_id").val("").show();
    $("#startTracking_status").html("Stopped tracking workout: <strong>" + track_id + "</srong>");
});

$("#home_clearstorage_button").live('click',function(){
    window.localStorage.clear();
});

$("#home_seedgps_button").live('click', function(){
    window.localStorage.setItem('Sample block', '[{"timestamp":1335700802000,"coords":{"heading":null,"altitude":null,"longitude":170.33488333333335,"accuracy":0,"latitude":-45.87475166666666,"speed":null,"altitudeAccuracy":null}},{"timestamp":1335700803000,"coords":{"heading":null,"altitude":null,"longitude":170.33481666666665,"accuracy":0,"latitude":-45.87465,"speed":null,"altitudeAccuracy":null}},{"timestamp":1335700804000,"coords":{"heading":null,"altitude":null,"longitude":170.33426999999998,"accuracy":0,"latitude":-45.873708333333326,"speed":null,"altitudeAccuracy":null}},{"timestamp":1335700805000,"coords":{"heading":null,"altitude":null,"longitude":170.33318333333335,"accuracy":0,"latitude":-45.87178333333333,"speed":null,"altitudeAccuracy":null}},{"timestamp":1335700806000,"coords":{"heading":null,"altitude":null,"longitude":170.33416166666666,"accuracy":0,"latitude":-45.871478333333336,"speed":null,"altitudeAccuracy":null}},{"timestamp":1335700807000,"coords":{"heading":null,"altitude":null,"longitude":170.33526833333332,"accuracy":0,"latitude":-45.873394999999995,"speed":null,"altitudeAccuracy":null}},{"timestamp":1335700808000,"coords":{"heading":null,"altitude":null,"longitude":170.33427333333336,"accuracy":0,"latitude":-45.873711666666665,"speed":null,"altitudeAccuracy":null}},{"timestamp":1335700809000,"coords":{"heading":null,"altitude":null,"longitude":170.33488333333335,"accuracy":0,"latitude":-45.87475166666666,"speed":null,"altitudeAccuracy":null}}]');

});