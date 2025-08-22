const audio = document.getElementById("radioNative");
const playBtn = document.getElementById("playbtn");

audio.volume = 0.8;
audio.play().catch(() => console.log("Autoplay bloqueado"));

// Función para Play/Stop (stop = recargar el stream para que siga en vivo)
playBtn.addEventListener("click", () => {
  if (!audio.paused) {
    audio.pause();
    playBtn.textContent = "▶️ Reproducir";
  } else {
    audio.load(); // reset para sincronizar al vivo
    audio.play();
    playBtn.textContent = "⏸️ Pausar";
  }
});

// Inicializar Luna (solo interfaz de metadatos y carátula)
$("#lunaradio").lunaradio({
  radioname: "BELLOS RECUERDOS",
  streamurl: "https://whmsonic.playerfullhd.com:7034",
  streamtype: "shoutcast2",
  shoutcastpath: "/stream",
  shoutcastid: "1",
  itunestoken: "1000lIPN",
  metadatainterval: 5000,
  coverimage: "js/brlogo.png"
});
