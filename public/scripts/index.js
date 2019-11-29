const HOST = "172.22.68.222";
const WEBSOCKET_PORT = "8080";

// Create WebSocket connection.
const socket = new WebSocket(`ws://${HOST}:${WEBSOCKET_PORT}`);

// Connection opened
socket.addEventListener('open', function (event) {
    socket.send('Hello Server!');
});

// Listen for messages
socket.addEventListener('message', function (event) {
    console.log('Message from server ', event.data);

    let obj = JSON.parse(event.data);

    if (obj.output != undefined){
        let p = document.createElement("p");
        p.innerHTML = `<span class="output">${obj.output}</span>`;
        document.querySelector("#output").appendChild(p);
    } else if (obj.error != undefined){
        let p = document.createElement("p");
        p.innerHTML = `<span class="error">${obj.error}</span>`;
        document.querySelector("#output").appendChild(p);
    }
});

document.querySelector("form").onsubmit = () => {

    fetch('/ayylmao', {
        headers: { "Content-Type": "application/json" },
        method: "POST",
        body: JSON.stringify({
            'ats_code': document.querySelector("input[name='ats_code']").value
        })
    })
    .then(res => res.text()) // parse response as JSON (can be res.text() for plain response)
    .then(response => {
        // here you do what you want with response
        console.log(response);
    })
    .catch(err => {
        console.log(err);
    });
    return false;
}