✅ 1) Spusti ingest (príjem WebM od MediaRecorderu)

Toto vždy musí bežať ako prvé.

node media-ingest.js


Ak je všetko OK, uvidíš:

🚀 MEDIA INGEST server starting...
✔ WS ingest beží na ws://localhost:8090
👉 Publisher pripojený
✔ EBML HEADER OK
🎬 KEYFRAME OK → spúšťam FFmpeg ingest

✅ 2) Spusti live-server (HLS + viewer web)

Toto vytvára HLS a hostuje stránku /viewer.

node live-server.js


Po spustení:

🎬 Spúšťam FFmpeg → HLS z udp://127.0.0.1:10000
🌐 HTTP server (viewer + HLS) beží na http://localhost:8080/viewer

✅ 3) Spusti web aplikáciu Publisher (tvoj front-end, čo odosiela kameru)

Stačí otvoriť v prehliadači publisher stránku (tvoj HTML + JS):

publisher/index.html


Zvyčajne otváraš cez Live Server vo VSCode alebo cez file:// cestu.

✅ 4) Publisher – postup:

Zapneš kameru (getUserMedia sa načíta automaticky).

Prihlásiš sa (ak máš login).

Klikneš Start.

MediaRecorder začne posielať WebM cez WebSocket → ingest → FFmpeg → UDP → HLS.

✅ 5) Otvor viewer

V prehliadači:

👉 http://localhost:8080/viewer

Po pár sekundách:

manifest sa načíta

video sa spustí

status = Vysílání běží

🔥 Celá pipeline (pre istotu ešte raz)
Publisher (MediaRecorder WebM)
       ↓  WebSocket
media-ingest.js  →  FFmpeg → UDP 10000
       ↓
live-server.js → FFmpeg HLS → /hls/master.m3u8
       ↓
Viewer (HLS.js)

🧨 Dôležité rady
Po každej úprave pipeline:

Zatvoriť terminal s media-ingest.js

Zatvoriť terminal s live-server.js

Vymazať priečinok /hls

Až potom znovu spustiť oba servery

Keď nevidíš video:

Skontroluj, či MediaRecorder posiela dáta (má logy)

Skontroluj, či ingest prijíma KEYFRAME

Skontroluj, či HLS generuje segmenty v priečinku /hls
