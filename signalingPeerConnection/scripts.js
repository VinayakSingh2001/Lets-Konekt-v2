const userName = "Rob-" + Math.floor(Math.random() * 100000);
const password = "x";
document.querySelector("#user-name").innerHTML = userName;
const socket = io.connect("https://localhost:8181/", {
  auth: {
    userName,
    password,
  },
});

const localVideoEl = document.querySelector("#local-video");
const remoteVideoEl = document.querySelector("#remote-video");

let peerConfiguration = {
  iceServers: [
    {
      urls: ["stun:stun.l.google.com:19302", "stun:stun1.l.google.com:19302"],
    },
  ],
};

let localStream;
let remoteStream;
let peerConnection;

const constraints = {
  audio: true,
  video: true,
};

const call = async (e) => {
  const stream = await navigator.mediaDevices.getUserMedia(constraints);
  console.log(stream);
  localVideoEl.srcObject = stream;
  localStream = stream;

  await createPeerConnection();

  try {
    console.log("creating offer ...");
    const offer = await peerConnection.createOffer();
    console.log(offer);
    peerConnection.setLocalDescription(offer);
    socket.emit("newOffer", offer);
  } catch (error) {
    console.log(error);
  }
};

const createPeerConnection = () => {
  return new Promise(async (resolve, reject) => {
    peerConnection = await new RTCPeerConnection(peerConfiguration);

    localStream.getTracks().forEach((track) => {
      peerConnection.addTrack(track, localStream);
    });

    peerConnection.addEventListener("icecandidate", (e) => {
      console.log(".......ice candidate found .....");
      console.log(e);
    });
    resolve();
  });
};

document.querySelector("#call").addEventListener("click", call);
