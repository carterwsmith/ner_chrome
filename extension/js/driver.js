document.addEventListener('DOMContentLoaded', function() {
    document.getElementById("main_button").addEventListener("click", geturl);
});

function geturl() {
    chrome.tabs.query({active: true, currentWindow: true}, tabs => {
        let url = tabs[0].url;
        document.getElementById('status').innerHTML = 'Starting...';
    });

    chrome.tabs.executeScript(null, { file: "js/jquery-3.6.0.min.js" }, function() {
        chrome.tabs.executeScript(null,
            {code:"$('p').text()"},
            function(results) {
                //console.log(results);
                document.getElementById('status').innerHTML = 'Processing...';
                sendreq(results)
            }
        );
    });

    /**chrome.tabs.executeScript(
        null, 
        {code:"var x = $('p'); x"},
        //{code:"var x = 10; x"},
        function(results) {
            console.log(results);
            document.getElementById('status').innerHTML = 'Processing...';
            sendreq(results)
        } 
    ); **/
}

function sendreq(site_text) {
    //console.log(site_text);
    chrome.runtime.sendMessage(
        {find: true, text: site_text},
        function(response) {
            result = response.farewell;
            entities = result.entities;
            console.log(entities);
            highlight_ent(entities);
        });
}

function highlight_ent(entities) {
    document.getElementById('status').innerHTML = 'Highlighting...';

    chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
        chrome.tabs.sendMessage(tabs[0].id, {action: "highlight_text", ent: entities}, 
        function(response) {
            if (response.messageStatus == "received") {
                document.getElementById('status').innerHTML = 'Complete!';
            }
        });  
    });

    /**
    chrome.runtime.sendMessage(
        {highlight: true, ent: entities},
        function(response) {
            console.log(response);
            if (response.messageStatus == "received") {
                document.getElementById('status').innerHTML = 'Complete!';
            }
        }
    ); */
}