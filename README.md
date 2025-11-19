# MDS
🟦 MDS – Live Streaming Platforma

Základná funkčná verzia projektu pre predmet MDS 2025/26.
Systém umožňuje prijímať RTMP stream, prevádzať ho do viacerých HLS kvalít a prehrávať ho cez webový prehliadač.

📁 Struktura projektu
conf/nginx.conf          - konfigurace nginx + RTMP + HLS
site/viewer/index.html   - HLS přehrávač (Video.js)
scripts/compose_hls_multi.bat - generování HLS (1080/720/480)
hls/                     - generované HLS segmenty
NGINX.exe                - server

✅ Co je aktuálně funkční

RTMP ingest (příjem streamu např. z OBS)

FFmpeg transkódování do 3 kvalit (1080p / 720p / 480p)

HLS výstup s master.m3u8

Webový přehrávač s Video.js + výběr kvality

Plně funkční end-to-end pipeline:

OBS → RTMP → FFmpeg → HLS → Viewer

🚀 Jak systém spustit
1️⃣ Spusť Nginx

V hlavním adresáři projektu spusť:

.\NGINX.exe -p . -c .\conf\nginx.conf


Server běží na:

RTMP: rtmp://localhost/live

Web: http://localhost/

2️⃣ Spusť FFmpeg transkódování
scripts\compose_hls_multi.bat


Tento skript:

vytvoří složku hls/

spustí 3 samostatné transkódovací procesy

průběžně generuje .ts segmenty a playlisty

3️⃣ Pusť stream z OBS

OBS nastavení:

Server: rtmp://localhost/live

Stream key: cam1

Po startu OBS se okamžitě začnou generovat HLS soubory v hls/.

4️⃣ Otevři webový přehrávač

V prohlížeči otevři:

http://localhost/viewer/


Přehrávač umí:

automatický výběr kvality

manuální přepnutí rozlišení (1080p/720p/480p)

💡 Poznámky

HLS segmenty jsou průběžně generované do /hls/

master.m3u8 obsahuje seznam všech kvalit

Pro další vývoj se bude doplňovat WebRTC publisher a dynamická mřížka (zatím není součástí)

📌 Stav projektu

Aktuálně hotová pouze streaming / transkódovací / přehrávací část.
Publisher (WebRTC), kompozice více kamer, seznam přednášejících a UI pro publikující se doplní později.

rozloženie práce:
https://docs.google.com/document/d/16j0YOs1u3B5rR9D-1Yvw4d3RCO9wjd-Fy4a3qEkfdA4/edit?usp=sharing
