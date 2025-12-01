const WebSocket = require("ws");
const { spawn } = require("child_process");
const fs = require("fs");

// vytvor WS server
const wss = new WebSocket.WebSocketServer({ port: 8080 });

console.log("Signaling server beží na ws://localhost:8080");

wss.on("connection", (ws) => {
    console.log("Publisher connected.");

    ws.on("message", async (msg) => {
        const data = JSON.parse(msg);

        // BROWSER SENDS OFFER
        if (data.type === "offer") {
            console.log("Dostal som SDP OFFER, ukladám...");

            fs.writeFileSync("offer.sdp", data.sdp);

            console.log("Spúšťam FFmpeg (WebRTC → HLS)…");

            const ffmpeg = spawn("ffmpeg", [
                "-protocol_whitelist", "file,crypto,data,dtls,srtp,webrtc,tcp,udp,rtp",
                "-i", "offer.sdp",


                // HLS test output — neskôr zmeníme na grid
                "-vf", "format=yuv420p",
                "-f", "hls",
                "-hls_time", "2",
                "-hls_list_size", "5",
                "-hls_flags", "delete_segments",
                "../hls/master.m3u8"
            ]);

            // ČÍTAJ ANSWER SDP Z FFmpeg OUTPUTU
            ffmpeg.stderr.on("data", (buf) => {
                const text = buf.toString();

                if (text.includes("v=0")) {
                    console.log("Mám ANSWER SDP → posielam publisherovi...");
                    ws.send(JSON.stringify({
                        type: "answer",
                        sdp: text
                    }));
                }

                console.log(text);
            });

            ffmpeg.on("close", () => {
                console.log("FFmpeg closed.");
            });
        }
    });
});
