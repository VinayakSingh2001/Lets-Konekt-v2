const fs = require("fs");
const https = require("https");
const express = require("express");
const app = express();
const socketio = require("socket.io");
app.use(express.static(__dirname));

//we need a key and cert to run https
//we generated them with mkcert
//$ mkcert create-ca
//$ mkcert create-cert
const key = fs.readFileSync("cert.key");
const cert = fs.readFileSync("cert.crt");

//we change our express setup so we can use https
const expressServer = https.createServer({ key, cert }, app);
const io = socketio(expressServer);

expressServer.listen(8181);

//offers will contain {}
const offers = [
  //offererUserName
  //offer
  //offerIceCandidates
  //answererUsername
  //answer
  //answerIceCandidates
];

const connectedSockets = [
  //username , socketId
];

io.on("connection", (socket) => {
  //   console.log("someone has connected");

  const userName = socket.handshake.auth.userName;
  const password = socket.handshake.auth.password;

  connectedSockets.push({
    socketId: socket.id,
    userName: userName,
  });

  socket.on("newOffer", (onewOffer) => {
    offers.push({
      offererUserName: userName,
      offer: newOffer,
      offerIceCandidates: [],
      answererUsername: null,
      answer: null,
      answerIceCandidates: []
    });
    //send out to all connected sockets except the caller
    socket.broadcast.emit('newOfferAwating', offers.slice(-1))
  });
});
