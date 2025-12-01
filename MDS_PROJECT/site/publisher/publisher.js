let pc;
let ws;

async function startPublishing() {
    // 1) CAMERA
    const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
    });

    document.getElementById("preview").srcObject = stream;

    // 2) CREATE PEER
    pc = new RTCPeerConnection({
        iceServers: [{ urls: ["stun:stun.l.google.com:19302"] }]
    });

    // 3) ADD TRACKS
    stream.getTracks().forEach(track => pc.addTrack(track, stream));

    // 4) SIGNALING WS
    ws = new WebSocket("ws://localhost:8080");

    ws.onopen = async () => {
        console.log("Signaling pripojený");

        let offer = await pc.createOffer({
    offerToReceiveVideo: true,
    offerToReceiveAudio: true
});

let sdp = offer.sdp;

// prefer H.264 video instead of VP8/VP9
sdp = sdp.replace(/VP9\/90000/g, "H264/90000");
sdp = sdp.replace(/VP8\/90000/g, "H264/90000");

offer.sdp = sdp;

await pc.setLocalDescription(offer);

ws.send(JSON.stringify({
    type: "offer",
    sdp: offer.sdp
}));

    };

    ws.onmessage = async (msg) => {
        const data = JSON.parse(msg.data);

        if (data.type === "answer") {
            console.log("Dostal som ANSWER od FFmpeg");
            await pc.setRemoteDescription({
                type: "answer",
                sdp: data.sdp
            });
        }
    };
}

startPublishing();
