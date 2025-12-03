

const video = document.getElementById('localVideo');
const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const grayscaleSwitch = document.getElementById('grayscaleSwitch');
const usernameInput = document.getElementById('jmeno_uzivatele');
const passwordInput = document.getElementById('password');
const loginBtn = document.getElementById('loginBtn');
const microphonSwitch = document.getElementById('microphonSwitch');
let grayScaleEnabled = false;
let microphonSwitchEnable = false;
const canvasVideo = document.getElementById('modifiedVideo');
const ctxVideo = canvasVideo.getContext('2d');
const canvasOverlay = document.getElementById('overlay');
var mediaRecorder; // MediaRecorder instance
var localStream; // Media stream z kamery
let ws; // Spojeni s WebSocket serverem


startBtn.disabled = true; // zablokovane start tlacitko





// Funkce, která zahájí streamování, jakmile je uživatel ověřen
function startStreamingSetup(clientId) {
    // Připojení k WebSocket serveru
    ws = new WebSocket('ws://localhost:3000?clientId=' + clientId);
    ws.binaryType = 'arraybuffer';

    ws.onopen = () => 
    {
      console.log('Connected to WebSocket server');
        
      const videoStreamFromCanvas = canvasVideo.captureStream(30); // Získá stream z Canvasu (upravené video)
      const mixedStream = new MediaStream(); // Vytvoří nový stream

        // 1. Přidání upraveného VIDEO tracku (z canvasu)
      videoStreamFromCanvas.getVideoTracks().forEach(track => 
      {
      mixedStream.addTrack(track);
      });
      
      if(microphonSwitchEnable)
      {
        // 2. Přidání PŮVODNÍHO AUDIO tracku (z localStream)
        localStream.getAudioTracks().forEach(track => 
        {
        mixedStream.addTrack(track);
        });
      }

      // 3. Inicializace MediaRecorder sloučeným streamem
      mediaRecorder = new MediaRecorder(mixedStream, { mimeType: 'video/webm; codecs=vp8' });

      // 4. Nastavení odesílání datových bloků
      mediaRecorder.ondataavailable = e => 
        {
            if (e.data.size > 0 && ws.readyState === WebSocket.OPEN) 
            {
              ws.send(e.data); // odeslat chunk na server
            }
        };

        startRecording(); // Spustí MediaRecorder
    };

    ws.onclose = () => 
    {
      console.log('Disconnected from WebSocket server.');
      startBtn.disabled = false;
      stopBtn.disabled = true;
      if(loginBtn) loginBtn.style.display = 'block';
      //znovu nacte prihlasovaci tlacitko
    };
    
    ws.onerror = (error) => 
    {
      console.error("WebSocket Error:", error);
      startBtn.disabled = false;
      stopBtn.disabled = true;
      if(loginBtn) loginBtn.style.display = 'block';
    };
}

loginBtn.addEventListener('click', async (e) => {
  const username = usernameInput.value;
  const password = passwordInput.value;
  // Zablokujeme tlačítko, aby uživatel neklikal, dokud se neověří
  loginBtn.disabled = true;
  // --- 1. Autentizace na Serveru ---
  const authUrl = 'http://localhost:3000/authenticate'  //Předpokládaný HTTP endpoint pro ověření*/
    try
    {
      const authResponse = await fetch(authUrl,
        {
          method: 'POST',
          headers: {'Content-Type': 'application/json',},
          body: JSON.stringify({ username, password })

        });
      const authResult = await authResponse.json();
      
      if (authResponse.ok && authResult.authenticated)
      {
        console.log('Autentizace úspěšná.');
        // --- 2. Spuštění streamování po ověření ---
        const clientId = 'user' + Math.floor(Math.random() * 1000);
        document.getElementById('clientIdSpan').innerText = clientId;
        // Zahájí nastavení WebSocketu a streamování
        startBtn.disabled = false; // Odblokovat tlačítko pro nový pokus
        }
        else
        {
          // Autentizace selhala
          alert('Chyba: Neplatné uživatelské jméno nebo heslo.');
          loginBtn.disabled = false;
        }
    } catch (error) 
      {
        // Chyba při komunikaci (např. server není dostupný)
        console.error('Chyba při autentizaci:', error);
        alert('Chyba: Server pro ověření není dostupný.');
        loginBtn.disabled = false;

      }

})

startBtn.addEventListener('click', () =>
  {
  if(startBtn.disabled){
    return;
  }
  startBtn.disabled = true;
  const clientId = 'user' + Math.floor(Math.random() *1000);
  document.getElementById('clientIdSpan').innerText = clientId;
  startStreamingSetup(clientId);
})





async function init() 
{
  localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
  video.srcObject = localStream;

  video.onloadedmetadata = () => 
  {
  canvasVideo.width = video.videoWidth;
  canvasVideo.height = video.videoHeight;

  canvasOverlay.width = video.videoWidth;
  canvasOverlay.height = video.videoHeight;

  // Spustit obsluzne funkce canvasů
  processVideoCanvas();
  };
}

function processVideoCanvas() 
{
  ctxVideo.drawImage(video, 0, 0, canvasVideo.width, canvasVideo.height);

  // grayscale efekt
  if (grayScaleEnabled) 
    {
    const frame = ctxVideo.getImageData(0, 0, canvasVideo.width, canvasVideo.height);
    const data = frame.data;
    for (let i = 0; i < data.length; i += 4) 
      {
        const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
        data[i] = data[i + 1] = data[i + 2] = avg;
      }
    ctxVideo.putImageData(frame, 0, 0);
  }

  requestAnimationFrame(processVideoCanvas);
}

function startRecording() 
{
  mediaRecorder.start(200); // parametr určuje velikost chunku v ms
  console.log('Recording started');

  startBtn.disabled = true;
  stopBtn.disabled = false;
}


function stopRecording() 
{
  mediaRecorder.stop();
  console.log('Recording stopped');
}

stopBtn.addEventListener('click', () => 
  {
    stopRecording();
    ws.close();
  });

grayscaleSwitch.addEventListener('change', () => 
  {
  grayScaleEnabled = grayscaleSwitch.checked;
  console.log('sedej je', grayScaleEnabled)
  });

microphonSwitch.addEventListener('change', () =>
{
  microphonSwitchEnable = microphonSwitch.checked;
  console.log('mikrofon je ', microphonSwitchEnable);
})

init();