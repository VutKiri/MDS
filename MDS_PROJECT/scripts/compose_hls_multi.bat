@echo off
set OUT=C:\1MDS\MDS_PROJECT\hls

REM Vyčisti stary obsah HLS
rmdir /S /Q "%OUT%" 2>nul
mkdir "%OUT%"
mkdir "%OUT%\1080p"
mkdir "%OUT%\720p"
mkdir "%OUT%\480p"

echo Spustam 1080p stream...
start cmd /k ffmpeg -y -i rtmp://localhost/live/cam1 ^
  -vf scale=1920:1080 -c:v h264 -preset veryfast -b:v 4500k -maxrate 5000k -bufsize 9000k ^
  -c:a aac -ar 48000 -ac 2 ^
  -hls_time 4 -hls_list_size 30 -hls_flags delete_segments+independent_segments ^
  -hls_segment_filename "%OUT%\1080p\seg_%%06d.ts" "%OUT%\1080p\index.m3u8"

echo Spustam 720p stream...
start cmd /k ffmpeg -y -i rtmp://localhost/live/cam1 ^
  -vf scale=1280:720 -c:v h264 -preset veryfast -b:v 2500k -maxrate 3000k -bufsize 6000k ^
  -c:a aac -ar 48000 -ac 2 ^
  -hls_time 4 -hls_list_size 30 -hls_flags delete_segments+independent_segments ^
  -hls_segment_filename "%OUT%\720p\seg_%%06d.ts" "%OUT%\720p\index.m3u8"

echo Spustam 480p stream...
start cmd /k ffmpeg -y -i rtmp://localhost/live/cam1 ^
  -vf scale=854:480 -c:v h264 -preset veryfast -b:v 1200k -maxrate 1500k -bufsize 3000k ^
  -c:a aac -ar 48000 -ac 2 ^
  -hls_time 4 -hls_list_size 30 -hls_flags delete_segments+independent_segments ^
  -hls_segment_filename "%OUT%\480p\seg_%%06d.ts" "%OUT%\480p\index.m3u8"

REM ===== vytvor master.m3u8 =====
(
  echo #EXTM3U
  echo.
  echo #EXT-X-STREAM-INF:BANDWIDTH=5000000,RESOLUTION=1920x1080
  echo 1080p/index.m3u8
  echo.
  echo #EXT-X-STREAM-INF:BANDWIDTH=3000000,RESOLUTION=1280x720
  echo 720p/index.m3u8
  echo.
  echo #EXT-X-STREAM-INF:BANDWIDTH=1500000,RESOLUTION=854x480
  echo 480p/index.m3u8
) > "%OUT%\master.m3u8"

echo HOTOVO – HLS priecinky a master.m3u8 su pripravene.

