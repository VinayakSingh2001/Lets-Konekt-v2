let stream = null;
let mediaStream = null;
const videoEl = document.querySelector("#my-video");

const constraints = {
  audio: true,
  video: true,
};

const getMicAndCamera = async (e) => {
  try {
    stream = await navigator.mediaDevices.getUserMedia(constraints);
    console.log(stream);
    changeButtons([
      "green",
      "blue",
      "blue",
      "grey",
      "grey",
      "grey",
      "grey",
      "grey",
    ]);
  } catch (error) {
    console.log("user denied access");
    console.log(error);
  }
};

const showMyFeed = async (e) => {
  if (!stream) {
    alert("no stream. stream is loading....");
    return;
  }
  console.log("show my feed is working");
  videoEl.srcObject = stream;
  const tracks = stream.getTracks();
  console.log(tracks);
  changeButtons([
    "green",
    "green",
    "blue",
    "blue",
    "blue",
    "grey",
    "grey",
    "blue",
  ]);
};

const stopMyFeed = async (e) => {
  const tracks = stream.getTracks();
  tracks.forEach((track) => {
    track.stop();
    changeButtons([
      "blue",
      "grey",
      "grey",
      "grey",
      "grey",
      "grey",
      "grey",
      "grey",
    ]);
  });
};

document
  .querySelector("#share")
  .addEventListener("click", (e) => getMicAndCamera(e));

document
  .querySelector("#show-video")
  .addEventListener("click", (e) => showMyFeed(e));

document
  .querySelector("#stop-video")
  .addEventListener("click", (e) => stopMyFeed(e));

document
  .querySelector("#change-size")
  .addEventListener("click", (e) => changeVideoSize(e));

document
  .querySelector("#start-record")
  .addEventListener("click", (e) => startRecording(e));
document
  .querySelector("#stop-record")
  .addEventListener("click", (e) => stopRecording(e));
document
  .querySelector("#play-record")
  .addEventListener("click", (e) => playRecording(e));
document
  .querySelector("#share-screen")
  .addEventListener("click", (e) => shareScreen(e));

document
  .querySelector("#audio-input")
  .addEventListener("change", (e) => changeAudioInput(e));
document
  .querySelector("#audio-output")
  .addEventListener("change", (e) => changeAudioOutput(e));
document
  .querySelector("#video-input")
  .addEventListener("change", (e) => changeVideo(e));
