const express = require("express");
const path = require('path');
const app = express();

const wsserver = require("./websocket-server")
const bodyParser = require('body-parser');
const { spawn } = require('child_process');

// cmd for windows, bash for linux.
const child = spawn("cmd");
// const child = spawn("bash");

// use child.stdout.setEncoding('utf8'); if you want text chunks
child.stdout.on('data', (chunk) => {
    console.log(`stdout: ${chunk}`);

    wsserver.websocketConnections.forEach(ws => {
        ws.send(JSON.stringify({
            "output": chunk.toString()
        }));
    });

    wsserver.addLog(chunk.toString());
});

child.stderr.on('data', (chunk) => {
    console.log(`stderr: ${chunk}`);

    wsserver.websocketConnections.forEach(ws => {
        ws.send(JSON.stringify({
            "error": chunk.toString()
        }));
    });

    wsserver.addLog(chunk.toString());
});

child.on('close', (code) => {
    console.log(`child process exited with code ${code}`);
});

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }))

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

app.post("/ayylmao", (req, res)=> {
    // console.log(req);

    if (req.method == "POST"){
        let ats_code = req.body.ats_code;

        child.stdin.write(`python -u main.py ${ats_code}\n`);

        res.send(ats_code);
    }
});

app.listen(80, () => {
    console.log("Server running on port 80");
});