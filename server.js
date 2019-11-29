const express = require("express");
const path = require('path');
const app = express();
const bodyParser = require('body-parser');
const { spawn } = require('child_process');
const child = spawn('python', ['main.py', '420420']);

// use child.stdout.setEncoding('utf8'); if you want text chunks
child.stdout.on('data', (chunk) => {
  // data from standard output is here as buffers
});

// since these are streams, you can pipe them elsewhere
child.stderr.on('data', (chunk) => {
    console.log(`error: ${chunk}`);
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
    console.log(req);

    if (req.method == "POST"){
        let ats_code = req.body.ats_code;
        res.send(ats_code);
    }
});

app.listen(80, () => {
    console.log("Server running on port 80");
});