const socket = io('/')
const videoGrid = document.getElementById('video-grid')
const myPeer = new Peer(undefined, {
  secure: true,
  host: "0.peerjs.com",
  port: "443",
});
const messageForm = document.getElementById('send-container')
const messagContainer = document.getElementById('message-container')
const messageInput = document.getElementById('message-input')
const myVideo = document.createElement('video')
myVideo.muted = true
const peers = {}
// const messages = document.getElementById("messages");
const userName = {};
//Screen capture
const videoElem = document.getElementById("screenDisplay");
const logElem = document.getElementById("log");
const startElem = document.getElementById("start");
const stopElem = document.getElementById("stop");
var currentPeer = null;
// gets mic and camera data
navigator.mediaDevices.getUserMedia({
  video: true,
  audio: true
}).then(stream => {
  // creates video box with stream data
  addVideoStream(myVideo, stream)

  myPeer.on('call', (call) => {
    call.answer(stream);
    const video = document.createElement('video');
    currentPeer = call;

    call.on('stream', (userVideoStream) => {
      addVideoStream(video, userVideoStream)
    })
  })
  socket.on('user-connected', userId => {
    console.log("user connected" + userId)
    connectToNewUser(userId, stream)

  })
  
  startElem.addEventListener("click", (e) => {
    logElem.innerHTML = "";
      navigator.mediaDevices.getDisplayMedia(displayMediaOptions).then(stream =>{
        // addScreenStream(videoElem,stream)
        
          const screenStream = stream;
          window.stream = stream;

          if (myPeer) {
            console.log("Current Peer", currentPeer);
            const videoElem = document.getElementById("screenDisplay");
            addScreenStream(videoElem, stream);

            let sender = currentPeer.peerConnection.getSenders().find(function (s) {
                return s.track.kind == videoTrack.kind;
            })
        sender.replaceTrack(videoTrack)
          // call.answer(stream);
          // call.on("stream", function (stream) {
          //       addScreenStream(videoElem, stream);
        // });
  
      }})
  
      })
    })
  
    



appendMessage( `${userName}` + " Joined room " + ROOM_ID)
// socket.emit('new-user', userName)
socket.on('chat-message', data =>{
  console.log(data.userNameChat)
  appendMessage(`${data.userNameChat}: ${data.message}`)
})
socket.on('user-connected', userId =>{
  appendMessage(`${userName} connected`)
})
// socket.on('screen-share',myVideo,stream =>{
  
// })

function appendMessage(message){
  const messageElement = document.createElement('div')
  messageElement.innerText = message
  messagContainer.append(messageElement)
}

messageForm.addEventListener('submit', e=>{
  e.preventDefault()
  const message = messageInput.value
  appendMessage(`You: ${message}`)
  socket.emit('send-chat-message', message)
  messageInput.value = ""
})

socket.on('user-disconnected', (userId) => {
  console.log("User Disconnected " +userId)
  if (peers[userId]) peers[userId].close()
  appendMessage(`${userId} disconnected`)

})

myPeer.on('open', (id) => {
  socket.emit('join-room', ROOM_ID, id)
});
const addVideoStream = (video, stream) => {
  video.srcObject = stream
  video.addEventListener('loadedmetadata', () => {
    video.play()
  })
  videoGrid.append(video)
};
const connectToNewUser = (userId, stream) => {
  const call = myPeer.call(userId, stream)
  const video = document.createElement('video')
  call.on('stream', userVideoStream => {
    addVideoStream(video, userVideoStream)
  })
  call.on('close', () => {
    video.remove()
  })

  peers[userId] = call
};

const connectToNewUserScreen = (userId, stream) => {
  const call = myPeer.call(userId, stream)
  const videoElem = document.getElementById("screenDisplay")
  call.on('stream', userVideoScreen => {
    addVideoStream(videoElem, userVideoScreen)
  })
  call.on('close', () => {
    videoElem.remove()
  })

  // peers[userId] = call
};


const addScreenStream = (screen, stream) => {
  videoElem.srcObject = stream
  videoElem.addEventListener('loadedmetadata', () => {
    videoElem.play()
  })
  videoElem.append(screen)
};


//Screen capture
const displayMediaOptions = {
  video: {
    displaySurface: "window"
  },
  audio: false
};
stopElem.addEventListener("click", (evt) => {
  stopCapture();
}, false);
// Set event listeners for the start and stop buttons





function stopCapture(evt) {
  let tracks = videoElem.srcObject.getTracks();

  tracks.forEach((track) => track.stop());
  videoElem.srcObject = null;
}
