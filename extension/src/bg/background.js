// if you checked "fancy-settings" in extensionizr.com, uncomment this lines

// var settings = new Store("settings", {
//     "sample_setting": "This is how you use Store.js to remember values"
// });

var serverhost = 'http://127.0.0.1:8000';

	chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
        if (request.find === true) {
            //var url = serverhost + '/find_entities/?text=\"Kirk Cousins is the best quarterback of all time.\"';
			//var url = serverhost + '/find_entities/?text='+ encodeURIComponent(request.text);
            var url = serverhost + '/find_entities/';

            /**var xhr = new XMLHttpRequest();
            xhr.open("POST", url, true);
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.responseType = 'json';
            xhr.onreadystatechange = function() {
                if (xhr.readyState == XMLHttpRequest.DONE) {
                    //console.log(xhr.response)
                    sendResponse({farewell: xhr.response});
                }
            }
            xhr.send(JSON.stringify({
                site_text: request.text
            }));**/

            //var csrftoken = getCookie('csrftoken');
            fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({site_text: request.text})
            }).then(res => res.json())
            .then(res => sendResponse({farewell: res}))
            .catch(error => console.log(error))

			
			//var url = "http://127.0.0.1:8000/wiki/get_wiki_summary/?topic=%22COVID19%22"	
			//fetch(url)
			//.then(response => response.json())
			//.then(response => sendResponse({farewell: response}))
			//.catch(error => console.log(error))
				
			return true;  // Will respond asynchronously.
        }
	});

    async function executeInCurrentTab({ file, func, args }) {
        const tab = await getCurrentTab();
        const executions = await chrome.scripting.executeScript({
            target: { tabId: tab.id, allFrames: true },
            ...(file && { files: [file] }),
            func,
            args,
        });
    
        if (executions.length == 1) {
            return executions[0].result;
        }
    
        // If there are many frames, concatenate the results
        return executions.flatMap((execution) => execution.result);
    }

    /** chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
        if (request.highlight === true) {
            executeInCurrentTab({ file: 'js/content-script.js' });
            //highlightText(document.body);
            //els = document.querySelectorAll('p');
    
            //for (const e in request.ent) {
            //console.log(e);
            //highlight(els, e);
            //}
    
            sendResponse({messageStatus: "received"});
        }
      });
    
    function highlightText(element) {
        var nodes = element.childNodes;
        for (var i = 0, l = nodes.length; i < l; i++) {
            if (nodes[i].nodeType === 3) { // Node Type 3 is a text node
                var text = nodes[i].innerHTML;
                nodes[i].innerHTML = "<span style='background-color:#FFEA00'>" + text + "</span>";
            }  
            else if (nodes[i].childNodes.length > 0) {
                highlightText(nodes[i]);  // Not a text node or leaf, so check it's children
            }
        }
    }
    
    function highlight(els, t) {
        let re = new RegExp(t, "g"); // search for all instances
    
        for (const element of els) {
            let newText = element.innerHTML.replace(re, `<mark>${t}</mark>`);
            element.innerHTML = newText;
        }
    } **/