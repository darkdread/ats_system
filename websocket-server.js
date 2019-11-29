const WebSocket = require('ws');
const { WEBSOCKET_PORT } = require('./constants.js');

const wss = new WebSocket.Server({
  port: WEBSOCKET_PORT,
  perMessageDeflate: {
    zlibDeflateOptions: {
      // See zlib defaults.
      chunkSize: 1024,
      memLevel: 7,
      level: 3
    },
    zlibInflateOptions: {
      chunkSize: 10 * 1024
    },
    // Other options settable:
    clientNoContextTakeover: true, // Defaults to negotiated value.
    serverNoContextTakeover: true, // Defaults to negotiated value.
    serverMaxWindowBits: 10, // Defaults to negotiated value.
    // Below options specified as default values.
    concurrencyLimit: 10, // Limits zlib concurrency for perf.
    threshold: 1024 // Size (in bytes) below which messages
    // should not be compressed.
  }
});

let historyLog = "";
let websocketConnections = [];

wss.on('connection', (ws) => {
    websocketConnections.push(ws);
    ws.on('message', (data) => {
        console.log(`received msg: ${data}`);
    });

    ws.send(JSON.stringify({
        'history': historyLog
    }));
});

function addLog(text) {
    historyLog = historyLog + "\n" + text;
};

module.exports = {
    wss: wss,
    websocketConnections: websocketConnections,
    addLog: addLog,
}