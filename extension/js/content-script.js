//document.body.style.backgroundColor = 'orange';
//console.log('ok');

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "highlight_text") {

        for (const e of message.ent) {
            console.log(e);
            els = document.querySelectorAll('p');
            for (const el of els) {
                let re = new RegExp(e, "g"); // search for all instances
                let newText = el.innerHTML.replace(re, `<mark>${e}</mark>`);
                el.innerHTML = newText;
            }
        }

        sendResponse({messageStatus: "received"});
    }
});