/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function () {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function () {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function () {
        app.receivedEvent('deviceready');

        document.getElementById("createFile").addEventListener("click", createFile);
        document.getElementById("writeFile").addEventListener("click", writeFile);
        document.getElementById("readFile").addEventListener("click", readFile);
        document.getElementById("removeFile").addEventListener("click", removeFile);

    },
    // Update DOM on a Received Event
    receivedEvent: function (id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};


// Download Function from https://www.tutorialspoint.com/cordova/cordova_file_system.htm

function createFile() {
    var type = window.externalRootDirectory;
    var size = 5*1024*1024;

    window.requestFileSystem(type, size, successCallback, errorCallback)

    function successCallback(fs) {
        fs.root.getFile('log.txt', {create: true, exclusive: true}, function(fileEntry) {
            alert('File creation successfull!')
        }, errorCallback);
    }

    function errorCallback(error) {
        alert("ERROR: " + error.code)
    }

}

function writeFile() {
    var type = window.externalRootDirectory;
    var size = 5*1024*1024;

    window.requestFileSystem(type, size, successCallback, errorCallback)

    function successCallback(fs) {

        fs.root.getFile('log.txt', {create: true}, function(fileEntry) {

            fileEntry.createWriter(function(fileWriter) {
                fileWriter.onwriteend = function(e) {
                    alert('Write completed.');
                };

                fileWriter.onerror = function(e) {
                    alert('Write failed: ' + e.toString());
                };

                var blob = new Blob(['Lorem Ipsum'], {type: 'text/plain'});
                fileWriter.write(blob);
            }, errorCallback);

        }, errorCallback);

    }

    function errorCallback(error) {
        alert("ERROR: " + error.code)
    }

}

function readFile() {
    var type = window.TEMPORARY;
    var size = 5*1024*1024;

    window.requestFileSystem(type, size, successCallback, errorCallback)

    function successCallback(fs) {

        fs.root.getFile('log.txt', {}, function(fileEntry) {

            fileEntry.file(function(file) {
                var reader = new FileReader();

                reader.onloadend = function(e) {
                    var txtArea = document.getElementById('textarea');
                    txtArea.value = this.result;
                };

                reader.readAsText(file);

            }, errorCallback);

        }, errorCallback);
    }

    function errorCallback(error) {
        alert("ERROR: " + error.code)
    }

}

function removeFile() {
    var type = window.TEMPORARY;
    var size = 5*1024*1024;

    window.requestFileSystem(type, size, successCallback, errorCallback)

    function successCallback(fs) {
        fs.root.getFile('log.txt', {create: false}, function(fileEntry) {

            fileEntry.remove(function() {
                alert('File removed.');
            }, errorCallback);

        }, errorCallback);
    }

    function errorCallback(error) {
        alert("ERROR: " + error.code)
    }

}