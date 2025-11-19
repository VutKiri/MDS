import { WebSocketServer } from 'ws';
import { URL } from 'url';
import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const PORT = 3000;
const OUTPUT_DIR = path.resolve('../recordings');

if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR);

const wss = new WebSocketServer({ port: PORT });
const clients = new Map(); // clientId -> { ws, fileStream }

wss.on('connection', (ws, req) => {
  // Získání clientId z query parametru
  const params = new URL(req.url, `http://${req.headers.host}`).searchParams;
  const clientId = params.get('clientId');
  if (!clientId) {
    ws.close(1008, 'clientId is required');
    return;
  }

  console.log(`✅ Client connected: ${clientId}`);

  // Pripravit soubor pro ukladani videa
  const filename = path.join(OUTPUT_DIR, `client_${clientId}.mp4`);

  // Spustit ffmpeg proces
  const ffmpeg = spawn('ffmpeg', [
    '-y',                // přepsat soubor pokud existuje
    '-f', 'webm',        // format vstupu
    '-i', 'pipe:0',      // vstup je ze standardního vstupu (stdin)
    '-c:v', 'libx264',   // kodek videa
    '-preset', 'veryfast',
    '-crf', '23',
    '-c:a', 'none',       // kodek audia
    filename
  ]);

  // Přesměrování výstupu ffmpegu (pro ladeni)
  ffmpeg.stderr.on('data', data => console.log(`FFmpeg (${clientId}): ${data}`));
  ffmpeg.on('close', code => console.log(`FFmpeg process for ${clientId} exited with ${code}`));


  clients.set(clientId, { ws, ffmpeg });

  ws.on('message', (chunk) => {
    if (chunk instanceof Buffer || chunk instanceof ArrayBuffer) {
      ffmpeg.stdin.write(Buffer.from(chunk));
    }
  });

  ws.on('close', () => {
    console.log(`❌ Client disconnected: ${clientId}`);
    ffmpeg.stdin.end(); // poslat EOF do ffmpeg procesu
    clients.delete(clientId);
  });
});

console.log(`WebSocket server running on ws://localhost:${PORT}`);
