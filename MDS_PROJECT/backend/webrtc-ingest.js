import WebSocket, { WebSocketServer } from "ws";
import { RTCPeerConnection, RTCVideoSink, RTCAudioSink } from "wrtc";
import { spawn } from "child_process";

const wss = new WebSocketServer({ port: 8080 });

console.log("WebRTC ingest server beží na ws://localhost:8080");

wss.on("connection", (ws) => {
    console.log("WebSocket klient pripojený.");

    ws.on("message", async (msg) => {
        const data = JSON.parse(msg);

        if (data.type === "offer") {
            console.log("Dostal som WebRTC offer.");

            const pc = new RTCPeerConnection({
                sdpSemantics: "unified-plan"
            });

            const videoSink = new RTCVideoSink();
            const audioSink = new RTCAudioSink();

            // Spustenie FFmpeg
            const ffmpeg = spawn("ffmpeg", [
                "-y",

                // Video (raw)
                "-f", "rawvideo",
                "-pixel_format", "I420",
                "-video_size", "640x360",
                "-framerate", "30",
                "-i", "pipe:3",

                // Audio (raw PCM)
                "-f", "s16le",
                "-ar", "48000",
                "-ac", "1",
                "-i", "pipe:4",

                // Výstup
                "-c:v", "libx264",
                "-preset", "veryfast",
                "-b:v", "2500k",
                "-c:a", "aac",
                "-f", "hls",
                "-hls_time", "2",
                "-hls_list_size", "5",
                "-hls_flags", "delete_segments",
                "C:/1MDS/MDS_PROJECT/hls/master.m3u8"
            ], {
                stdio: ["pipe", "pipe", "pipe", "pipe", "pipe"]
            });

            console.log("FFmpeg spustený.");

            pc.ontrack = (event) => {
                if (event.track.kind === "video") {
                    console.log("Prišiel VIDEO track");
                    videoSink.setTrack(event.track);

                    videoSink.onframe = ({ frame }) => {
                        ffmpeg.stdio[3].write(Buffer.from(frame.data));
                    };
                }

                if (event.track.kind === "audio") {
                    console.log("Prišiel AUDIO track");
                    audioSink.setTrack(event.track);

                    audioSink.ondata = ({ samples }) => {
                        ffmpeg.stdio[4].write(Buffer.from(samples.buffer));
                    };
                }
                if (data.type === "ice" && data.candidate) {
                    console.log("ICE candidate od klienta.");
                    pc.addIceCandidate(data.candidate);
                }

            };

            await pc.setRemoteDescription(data);
            const answer = await pc.createAnswer();
            await pc.setLocalDescription(answer);

            ws.send(JSON.stringify(pc.localDescription));
        }
    });
});
