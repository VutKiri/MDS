@echo off
set OUT=C:\1MDS\MDS_PROJECT\hls
mkdir %OUT% 2>nul

ffmpeg -y -i rtmp://localhost/live/cam1 ^
  -c:v h264 -profile:v high -g 48 -sc_threshold 0 -c:a aac -ar 48000 -ac 2 ^
  -hls_time 4 -hls_list_size 120 -hls_flags delete_segments+independent_segments+program_date_time ^
  -master_pl_name master.m3u8 -hls_segment_filename "%OUT%/720p/seg_%%06d.ts" "%OUT%/720p/index.m3u8"
