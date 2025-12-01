// Simple signaling server for WebRTC
// Run with: node server.js

const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });

let clients = new Map(); // socket → {name, id}

console.log("Signaling server running on ws://localhost:8080");

wss.on('connection', (socket) => {

  socket.on('message', (msg) => {
    let data = {};

    // Always parse JSON
    try { data = JSON.parse(msg); }
    catch { return; }

    // === 1) REGISTER publisher ===
    if (data.type === "register") {
      clients.set(socket, { id: data.id, name: data.name });
      console.log(`+ Publisher connected: ${data.name} (${data.id})`);
      return;
    }

    // === 2) BROADCAST signaling data to all other clients ===
    wss.clients.forEach(client => {
      if (client !== socket && client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(data));
      }
    });
  });

  socket.on('close', () => {
    let info = clients.get(socket);
    if (info) {
      console.log(`- Publisher disconnected: ${info.name}`);
      clients.delete(socket);
    }
  });
});
