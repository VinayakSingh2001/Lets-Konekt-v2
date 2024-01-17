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
let didIOffer = false;

const constraints = {
  audio: true,
  video: true,
};

const call = async (e) => {
  await fetchUserMedia();

  await createPeerConnection();

  try {
    console.log("creating offer ...");
    const offer = await peerConnection.createOffer();
    console.log(offer);
    peerConnection.setLocalDescription(offer);
    didIOffer = true;
    socket.emit("newOffer", offer);
  } catch (error) {
    console.log(error);
  }
};

const answerOffer = async (offerObj) => {
  await fetchUserMedia();
  await createPeerConnection(offerObj);
  const answer = await peerConnection.createAnswer({});
  peerConnection.setLocalDescription(answer);
  console.log(offerObj);
  console.log(answer);
};

const fetchUserMedia = () => {
  return new Promise(async (resolve, reject) => {
    //RTCPeerConnection is the thing that creates the connection
    //we can pass a config object, and that config object can contain stun servers
    //which will fetch us ICE candidates
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        // audio: true,
      });
      localVideoEl.srcObject = stream;
      localStream = stream;
      resolve();
    } catch (err) {
      console.log(err);
      reject();
    }
  });
};

const createPeerConnection = (offerObj) => {
  return new Promise(async (resolve, reject) => {
    peerConnection = await new RTCPeerConnection(peerConfiguration);

    localStream.getTracks().forEach((track) => {
      //add localtracks so that they can be sent once the connection is established

      peerConnection.addTrack(track, localStream);
    });

    peerConnection.addEventListener("icecandidate", (e) => {
      console.log(".......ice candidate found .....");
      console.log(e);
      if (e.candidate) {
        socket.emit("sendIceCandidateToSignalingServer", {
          iceCandidate: e.candidate,
          iceUserName: userName,
          didIOffer,
        });
      }
    });

    if (offerObj) {
      //this won't be set when called from call();
      //will be set when we call from answerOffer()
      // console.log(peerConnection.signalingState) //should be stable because no setDesc has been run yet
      await peerConnection.setRemoteDescription(offerObj.offer);
      // console.log(peerConnection.signalingState) //should be have-remote-offer, because client2 has setRemoteDesc on the offer
    }

    resolve();
  });
};

document.querySelector("#call").addEventListener("click", call);
