# MDS
Projekt MDS
MDS – Multimediální služba (2025/26)

Live streaming platforma s podporou multi-quality HLS, postavená na nginx-rtmp, FFmpeg a Video.js.

Tento projekt je průběžně budovaný v rámci předmětu Multimediální služby a obsahuje základní funkční backend pro ingest, transkódování a zobrazování živého videa.

📦 Obsah projektu
/conf
   nginx.conf
/site
   /viewer
      index.html
   (publisher – zatím ve vývoji)
/hls
   1080p/
   720p/
   480p/
   master.m3u8
/scripts
   compose_hls_multi.bat
   create_master.bat
/ssl
   cert.pem
   key.pem

Funkce (aktuálně hotové)
✔️ RTMP ingest

Server přijímá RTMP streamy (např. z OBS) na:

rtmp://localhost/live/cam1

✔️ Multi-bitrate HLS transkódování

FFmpeg pipeline generuje tři varianty:

1080p (5000 kbps)

720p (3000 kbps)

480p (1500 kbps)

každá varianta má vlastní adresář v /hls.

✔️ Master playlist

Generovaný soubor:

/hls/master.m3u8


který obsahuje přepínání mezi variantami.

✔️ Webový přehrávač (Video.js)

Viewer dostupný přes:

http://localhost/viewer/


Podporuje:

automatický výběr kvality

ruční výběr varianty přes videojs-http-source-selector

responzivní vzhled

🔧 Požadavky

Windows 10/11

FFmpeg 6.x (přidaný do PATH)

nginx s RTMP modulem (verze z cvičení)

OBS nebo jiný RTMP publisher

📥 Instalace a spuštění
1️⃣ Nakopírujte projektovou strukturu

Celý obsah ZIPu rozbalte například do:

C:\1MDS\CV8\

2️⃣ Spusťte nginx

Otevřete PowerShell v adresáři projektu a spusťte:

.\NGINX.exe -p . -c .\conf\nginx.conf


Server začne naslouchat:

HTTP: http://localhost/

RTMP: rtmp://localhost/live

3️⃣ Spusťte FFmpeg transkódování
scripts\compose_hls_multi.bat


Tento skript:

vytvoří /hls adresáře

spustí 3 samostatné transkodéry (1080/720/480)

uloží HLS segmenty a playlisty

4️⃣ Nahrajte stream (OBS)

Nastavení OBS:

Server: rtmp://localhost/live

Stream key: cam1

Po startu se v /hls začnou generovat .ts segmenty.

5️⃣ Otevřete viewer

V prohlížeči jděte na:

http://localhost/viewer/


Zobrazí se adaptivní přehrávač.

🗂 Důležité adresáře
Adresář	Popis
/conf/nginx.conf	Konfigurace nginx + RTMP + HLS mapping
/hls/	Generované HLS segmenty a playlisty
/site/viewer/	Webový přehrávač
/scripts/	Transkódovací skripty
/ssl/	Self-signed certifikát (pro pozdější HTTPS)

🚧 Co je rozpracováno
🔜 Publisher (WebRTC ingest)

náhled kamery (MediaStream API)

WebRTC spojení se serverem

signaling přes WebSocket

jméno publishujícího + overlay

mute mikrofonu

🔜 Dynamická kompozice FFmpeg (mřížka pro 1–6 kamer)
🔜 Webové rozhraní pro přednášející seznam
🧪 Testováno v prohlížečích

Google Chrome (poslední verze)

Microsoft Edge

📄 Licence / použití

Projekt je vytvořen pro účely předmětu MDS 2025/26 a jeho struktura odpovídá metodice a příkladům z laboratorních cvičení.

💬 Kontakt (tým)

rozloženie práce:
https://docs.google.com/document/d/16j0YOs1u3B5rR9D-1Yvw4d3RCO9wjd-Fy4a3qEkfdA4/edit?usp=sharing
