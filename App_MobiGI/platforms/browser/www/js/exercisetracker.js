/**
 * Created by S4m on 09.05.2017.
 */

// Calculating Distance of the Workout
function gps_distance(lat1, lon1, lat2, lon2) {
    // http://www.movable-type.co.uk/scripts/latlong.html
    var R = 6371; // km
    var dLat = (lat2 - lat1) * (Math.PI / 180);
    var dLon = (lon2 - lon1) * (Math.PI / 180);
    var lat1 = lat1 * (Math.PI / 180);
    var lat2 = lat2 * (Math.PI / 180);

    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c;

    return d;
}

// Accelerometer (Device motion)
// code:  https://github.com/apache/cordova-plugin-device-motion
// could not be implemented

// Pedometer
// code from: https://github.com/leecrossley/cordova-plugin-pedometer
// not implemented due tue it is based on the accelerometer plugin


// GeoPosition
// some code from:
// https://code.tutsplus.com/tutorials/build-an-exercise-tracking-app-geolocation-tracking--mobile-11070
// https://code.tutsplus.com/tutorials/build-an-exercise-tracking-app-persistence-graphing--mobile-11074
document.addEventListener("deviceready",
    function () {

        if (navigator.network.connection.type == Connection.NONE) {
            //$("#home_network_button").text('No Internet Access')
            //    .attr("data-icon", "delete")
            //    .button('refresh');
            $("#home_network_button").text("No Internet Access")
                .buttonMarkup({icon: 'delete'})
                .button('refresh');
        }
    }
);

// Define variables
var track_id = '';      // Name/ID of the exercise
var watch_id = null;    // ID of the geolocation
var tracking_data = []; // Array containing GPS position objects

var publish_text = true;
var select_activity = "";

var data_dict = {};
var addpair = function (my_key, my_value) {
    data_dict[my_key] = my_value;
};
var givevalue = function (my_key) {
    return data_dict[my_key];
};

// Hit start button
$("#startTracking_start").live('click', function () {

    // Start tracking Position
    watch_id = navigator.geolocation.watchPosition(
        // (code changed by SHI - 20170515)
        // onSuccess
        function onSuccess(position) {

            dataStore = {
                'timestamp': position.timestamp,
                'activity': select_activity,
                'coords': {
                    'accuracy': position.coords.accuracy,
                    'altitude': position.coords.altitude,
                    'altitudeAccuracy': position.coords.altitudeAccuracy,
                    'heading': position.coords.heading,
                    'latitude': position.coords.latitude,
                    'longitude': position.coords.longitude,
                    'speed': position.coords.speed
                }
            };

            console.log("Store json: " + JSON.stringify(dataStore));

            tracking_data.push(dataStore);

            // get coords to publish
            var lat = position.coords.latitude;
            var lng = position.coords.longitude;
            $("#position_info").html("Your current Position is: " + "<br>" + "lat : " + lat + " lng : " + lng);

            // Store Data to dict
            addpair(track_id, JSON.stringify(tracking_data));
            console.log("dict: " + data_dict);
        },
        /*
         // origial function replaced
         function(position){
         tracking_data.push(position);
         var lat = position.coords.latitude;
         var lng = position.coords.longitude;
         $("#position_info").html("Your current Position is: " + "<br>" + "lat : " + lat + " lng : " + lng + "<br>" + tracking_data);
         },
         */

        // Error
        function onError(error) {
            console.log(error);
            alert("error starttracking: " + error);
        },

        // Settings
        {frequency: 2000, enableHighAccuracy: true});

    // Fill up variables
    track_id = $("#track_id").val();
    try {

        if ($("#select_activity").val() == "Select activity...") {
            select_activity = "No Activity";
        }
        else {
            select_activity = $("#select_activity").val();
        }
    }
    catch (err) {
        select_activity = "No Activity";
    }

    // Tidy up the UI
    $("#track_id").hide();
    $("#startTracking_status").html("Tracking workout: <strong>" + track_id + "</strong>");
    $("#position_info").hide();
});

$("#startTracking_stop").live('click', function () {
    // Stop tracking the user
    navigator.geolocation.clearWatch(watch_id);

    // Save the tracking data (code changed by SHI - 20170515)
    window.localStorage.setItem(track_id, data_dict[track_id]);
    //window.localStorage.setItem(track_id, JSON.stringify(tracking_data));

    // Reset watch_id and tracking_data
    var watch_id = null;
    tracking_data = [];
    select_activity = "";
    data_dict = {};

    // Tidy up the UI
    $("#track_id").val("").show();
    $("#startTracking_status").html("Stopped tracking workout: <strong>" + track_id + "</strong>");
    $("#select_activity").not(':checked');
    $("#position_info").html("").show;
});

$("#home_clearstorage_button").live('click', function () {
    window.localStorage.clear();
});

$("#home_seedgps_button").live('click', function () {
    window.localStorage.setItem('Sample block', '[{"timestamp":1335700802000,"coords":{"heading":null,"altitude":null,"longitude":170.33488333333335,"accuracy":0,"latitude":-45.87475166666666,"speed":null,"altitudeAccuracy":null}},{"timestamp":1335700803000,"coords":{"heading":null,"altitude":null,"longitude":170.33481666666665,"accuracy":0,"latitude":-45.87465,"speed":null,"altitudeAccuracy":null}},{"timestamp":1335700804000,"coords":{"heading":null,"altitude":null,"longitude":170.33426999999998,"accuracy":0,"latitude":-45.873708333333326,"speed":null,"altitudeAccuracy":null}},{"timestamp":1335700805000,"coords":{"heading":null,"altitude":null,"longitude":170.33318333333335,"accuracy":0,"latitude":-45.87178333333333,"speed":null,"altitudeAccuracy":null}},{"timestamp":1335700806000,"coords":{"heading":null,"altitude":null,"longitude":170.33416166666666,"accuracy":0,"latitude":-45.871478333333336,"speed":null,"altitudeAccuracy":null}},{"timestamp":1335700807000,"coords":{"heading":null,"altitude":null,"longitude":170.33526833333332,"accuracy":0,"latitude":-45.873394999999995,"speed":null,"altitudeAccuracy":null}},{"timestamp":1335700808000,"coords":{"heading":null,"altitude":null,"longitude":170.33427333333336,"accuracy":0,"latitude":-45.873711666666665,"speed":null,"altitudeAccuracy":null}},{"timestamp":1335700809000,"coords":{"heading":null,"altitude":null,"longitude":170.33488333333335,"accuracy":0,"latitude":-45.87475166666666,"speed":null,"altitudeAccuracy":null}}]');
    window.localStorage.setItem('Sample Muttenz', '[{"timestamp":1494366039,"activity":"walking","coords":{"altitude":null,"speed":null,"altitudeAccuracy":null,"accuracy":0,"heading":null,"latitude":47.53343424644297,"longitude":7.647811924831444}},{"timestamp":1494376039,"activity":"walking","coords":{"altitude":null,"speed":null,"altitudeAccuracy":null,"accuracy":0,"heading":null,"latitude":47.53320514562638,"longitude":7.647614359555965}},{"timestamp":1494386039,"activity":"walking","coords":{"altitude":null,"speed":null,"altitudeAccuracy":null,"accuracy":0,"heading":null,"latitude":47.53299336200655,"longitude":7.647445342000614}},{"timestamp":1494396039,"activity":"walking","coords":{"altitude":null,"speed":null,"altitudeAccuracy":null,"accuracy":0,"heading":null,"latitude":47.53314657284183,"longitude":7.646490248556102}},{"timestamp":1494406039,"activity":"walking","coords":{"altitude":null,"speed":null,"altitudeAccuracy":null,"accuracy":0,"heading":null,"latitude":47.53367138793076,"longitude":7.643951310510298}},{"timestamp":1494416039,"activity":"walking","coords":{"altitude":null,"speed":null,"altitudeAccuracy":null,"accuracy":0,"heading":null,"latitude":47.53406042600069,"longitude":7.642599268547949}},{"timestamp":1494426039,"activity":"walking","coords":{"altitude":null,"speed":null,"altitudeAccuracy":null,"accuracy":0,"heading":null,"latitude":47.53397150778124,"longitude":7.642489930718918}},{"timestamp":1494436039,"activity":"walking","coords":{"altitude":null,"speed":null,"altitudeAccuracy":null,"accuracy":0,"heading":null,"latitude":47.53392032330245,"longitude":7.642182859385558}},{"timestamp":1494446039,"activity":"walking","coords":{"altitude":null,"speed":null,"altitudeAccuracy":null,"accuracy":0,"heading":null,"latitude":47.53402336934874,"longitude":7.64126753261418}},{"timestamp":1494456039,"activity":"walking","coords":{"altitude":null,"speed":null,"altitudeAccuracy":null,"accuracy":0,"heading":null,"latitude":47.53435210076379,"longitude":7.639281311688029}},{"timestamp":1494466039,"activity":"walking","coords":{"altitude":null,"speed":null,"altitudeAccuracy":null,"accuracy":0,"heading":null,"latitude":47.53416699067378,"longitude":7.639221464495107}},{"timestamp":1494476039,"activity":"walking","coords":{"altitude":null,"speed":null,"altitudeAccuracy":null,"accuracy":0,"heading":null,"latitude":47.53412290498257,"longitude":7.638953991973576}},{"timestamp":1494486039,"activity":"walking","coords":{"altitude":null,"speed":null,"altitudeAccuracy":null,"accuracy":0,"heading":null,"latitude":47.53351401829625,"longitude":7.638747717871397}},{"timestamp":1494496039,"activity":"walking","coords":{"altitude":null,"speed":null,"altitudeAccuracy":null,"accuracy":0,"heading":null,"latitude":47.5335293159634,"longitude":7.638640434117157}},{"timestamp":1494506039,"activity":"walking","coords":{"altitude":null,"speed":null,"altitudeAccuracy":null,"accuracy":0,"heading":null,"latitude":47.53365059205396,"longitude":7.638598149881323}}]');
});

// When the user views the history page
$('#history').live('pageshow', function () {
    // Count the number of entries in localStorage and display this information to the user
    tracks_recorded = window.localStorage.length;
    $("#tracks_recorded").html("<strong>" + tracks_recorded + "</strong> workout(s) recorded");

    // Empty the list of recorded tracks
    $("#history_tracklist").empty();

    // Iterate over all of the recorded tracks, populating the list
    for (i = 0; i < tracks_recorded; i++) {
        $("#history_tracklist").append("<li><a href='#track_info' data-ajax='false'>" + window.localStorage.key(i) + "</a></li>");
    }

    // Tell jQueryMobile to refresh the list
    $("#history_tracklist").listview('refresh');
});

// When the user clicks a link to view track info, set/change the track_id attribute on the track_info page
$("#history_tracklist li a").live('click', function () {
    $("#track_info").attr("track_id", $(this).text());
});

// When the user views the Track Info page
$('#track_info').live('pageshow', function () {
    // Find the track_id of the workout they are viewing
    var key = $(this).attr("track_id");

    // Update the Track Info page header to the track_id
    $("#track_info div[data-role=header] h1").text(key);

    // Get all the GPS data for the specific workout
    var data = window.localStorage.getItem(key);
    //console.log("loaded data " + data);

    // Turn the stringified GPS data back into a JS object
    try {
        data = JSON.parse(data);
        //console.log(data);
    }
    catch (err) {
        console.log("parse err:" + err);
        data = JSON.parse(givevalue(track_id));
        alert("parsed data from var instead of json: " + err);
    }


    // Calculate the total distance travelled
    total_km = 0;
    //console.log("length: " + data.length);
    for (i = 0; i < data.length; i++) {

        if (i === (data.length - 1)) {
            break;
        }
        total_km += gps_distance(data[i].coords.latitude, data[i].coords.longitude, data[i + 1].coords.latitude, data[i + 1].coords.longitude);
    }

    total_km_rounded = total_km.toFixed(2);

    // Calculate the total time taken for the track
    start_time = new Date(data[0].timestamp).getTime();
    end_time = new Date(data[data.length - 1].timestamp).getTime();

    total_time_ms = end_time - start_time;
    total_time_s = total_time_ms / 1000;

    final_time_m = Math.floor(total_time_s / 60);
    final_time_s = Math.round((total_time_s - (final_time_m * 60)) * 100) / 100;

    $("#track_info_info").html('Travelled <strong>' + total_km_rounded + ' km </strong> in <strong>' + final_time_m + ' m</strong> and <strong>' + final_time_s + ' s</strong>'
        + ' by ' + ' <strong>' + data[0].activity + '</strong>');

    // Plotting the Route on the Google Map
    // Set the initial Lat and Long of the Google Map
    var myLatLng = new google.maps.LatLng(data[0].coords.latitude, data[0].coords.longitude);

    // Google Map Options
    var myOptions = {
        zoom: 15,
        center: myLatLng,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    // Create the Google Map, set options
    var map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
    var trackCoords = [];

    //Add each GPS entry to an array
    for (i = 0; i < data.length; i++) {
        trackCoords.push(new google.maps.LatLng(data[i].coords.latitude, data[i].coords.longitude));
    }

    // Plot the GPS entries as a line on the Google Map
    var trackPath = new google.maps.Polyline({
        path: trackCoords,
        strokeColor: "#FF0000",
        strokeOpacity: 1.0,
        strokeWeight: 2
    });

    // Apply the line to the map
    trackPath.setMap(map);
});

// create preformated test from datastore
function create_text() {
    var text = [];

    for (var i in localStorage) {
        try {
            console.log("JSON parse try 1");
            text.push("<h4>" + i + "</h4>" + "<pre>" + JSON.stringify(JSON.parse(window.localStorage.getItem(window.localStorage.key(i))), ' ', 2) + "</pre>");
            //text.push("<h4>" + i + "</h4>" + "<pre>" + JSON.stringify(jQuery.parseJSON(localStorage[i]), '', 2) + "</pre>");
        }
        catch (err){
            console.log('err with parse JSON 2');
        }
        try {
            console.log("JSON parse try 2");
            text.push("<h4>" + i + "</h4>" + "<pre>" + JSON.stringify(JSON.parse(localStorage[i]), '', 2) + "</pre>");
        }
        catch (err) {
            console.log('err with parse JSON 2');
            text.push("<h4>" + i + "</h4>" + "<pre>" + JSON.stringify(localStorage[i], '', 2) + "</pre>");
        }
    }
    return text;
}

// Save File Button - Data export --> send data
$("#home_save_file").live('click', function () {

    document.addEventListener('deviceready', function () {
        // cordova.plugins.email is now available

    }, false);

    console.log('---------- START: Mail ----------');

    var text = create_text();
    cordova.plugins.email.open({
        app: 'mailto',
        subject: 'Sent with mailto'
    });
    cordova.plugins.email.open({
        //to:      'max@mustermann.de',
        //cc:      'erika@mustermann.de',
        //bcc:     ['john@doe.com', 'jane@doe.com'],
        subject: 'Data from FHNW Tracker',
        body:    text.join("")
    });

    console.log('---------- STOP: Mail ----------');


    /*
    window.resolveLocalFileSystemURL(cordova.file.documentsDirectory, function (dir) {
        console.log("got main dir", dir);
        dir.getFile("myfile.csv", {
            create: true
        }, function (file) {
            console.log("got the file", file);
            logOb = file;
            var csv = "";
            //we should have the same amount of name/cookie fields
            var name = "testdata1";
            var cookies = "testdata2",
                csv = csv + "" + name + "," + cookies + "\n";
            console.log("csv-" + csv);
            writeLog(csv);
        });
    });

    function writeLog(str) {
        if (!logOb) return;
        logOb.createWriter(function (fileWriter) {
            fileWriter.seek(fileWriter.length);

            var blob = new Blob([str], {
                type: 'text/plain'
            });
            fileWriter.write(blob);
            console.log("ok, in theory i worked");
        }, fail);
    }
    */
});

// Show stored data in a app view
$("#show_dict").live('click', function () {

    if (publish_text === true) {
        console.log('---------- START: Show Data ----------');
        console.log(data_dict);
        console.log(window.localStorage);
        console.log('---------- STOP: Show Data ----------');

        var text = create_text();

        $("#publish_data").html("<div class='ui-field-contain'><h3>Your Data: </h3><br>" + text.join("") + "</div>");
    }
    else {
        $("#publish_data").html("");
    }
    publish_text = !publish_text;
});