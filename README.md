# MDS – Multimediální streamovací služba (základní verze)

Tento projekt implementuje základ streamovací pipeline pro předmět Multimediální služby (MDS).  
Aktuální verze umožňuje přijmout RTMP stream, převést jej do více kvalit pomocí FFmpeg, vytvořit HLS adaptivní stream a přehrát jej pomocí Video.js.

---

## Struktura projektu

CV8/
├── conf/
│ └── nginx.conf
│
├── hls/
│ ├── 1080p/
│ ├── 720p/
│ ├── 480p/
│ └── master.m3u8
│
├── scripts/
│ └── compose_hls_multi.bat
│
├── site/
│ ├── index.html
│ └── viewer/
│ └── index.html
│
├── NGINX.exe
└── README.md

yaml
Kopírovať kód

---

## Co je aktuálně funkční

- RTMP ingest (např. z OBS)
- FFmpeg transkódování do 1080p / 720p / 480p
- Generování HLS segmentů a playlistů
- Vytváření master.m3u8 (ručně)
- Webový přehrávač pomocí Video.js + výběr kvality
- Kompletní pipeline:  
  `OBS → RTMP → FFmpeg → HLS → Viewer`

---

## Jak spustit projekt

### 1. Spuštění Nginx

V kořenové složce projektu:

.\NGINX.exe -p . -c .\conf\nginx.conf
Po spuštění:

RTMP ingest: rtmp://localhost/live

Webová stránka: http://localhost/

### 2. Spuštění transkódování (FFmpeg)
powershell
Kopírovať kód
scripts\compose_hls_multi.bat
Skript:

vytvoří složku hls/

spustí 3 samostatné FFmpeg procesy

generuje .ts segmenty a index.m3u8 v 1080p/720p/480p

### 3. Nastavení OBS
Server: rtmp://localhost/live

Stream key: cam1

Po spuštění streamu začne Nginx přijímat video a FFmpeg generovat HLS.

### 4. Spuštění webového přehrávače
V prohlížeči otevřete:

arduino
Kopírovať kód
http://localhost/viewer/
Funkce přehrávače:

Volba kvality videa

Automatický výběr bitrate

Video.js UI

Co zatím není implementováno (další fáze projektu)
WebRTC publisher (MediaStream API + WebRTC)

Signaling server (WebSocket)

Dynamická kompozice video mřížky (1–6 vstupů)

Mix více audio stop

DVR buffer (20 minut zpětného přehrávání)

Seznam připojených přednášejících
rozloženie práce:
https://docs.google.com/document/d/16j0YOs1u3B5rR9D-1Yvw4d3RCO9wjd-Fy4a3qEkfdA4/edit?usp=sharing
