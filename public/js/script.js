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
const myScreen = document.createElement('screenStream')
myVideo.muted = true
const peers = {}
// const messages = document.getElementById("messages");
const userName = {};
//Screen capture
const videoElem = document.getElementById("screenDisplay");
const logElem = document.getElementById("log");
const startElem = document.getElementById("start");
const stopElem = document.getElementById("stop");


navigator.mediaDevices.getUserMedia({
  video: true,
  audio: true
}).then(stream => {
  addVideoStream(myVideo, stream)

  myPeer.on('call', (call) => {
    call.answer(stream);
    const video = document.createElement('video');
    call.on('stream', (userVideoStream) => {
      addVideoStream(video, userVideoStream)
    })
  })
  socket.on('user-connected', userId => {
    console.log("user connected" + userId)
    connectToNewUser(userId, stream)

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
socket.on('screen-share',myVideo,stream =>{
  
})

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
  const myScreen = document.createElement('screenStream')
  call.on('stream', userVideoScreen => {
    addVideoStream(myScreen, userVideoScreen)
  })
  call.on('close', () => {
    myScreen.remove()
  })

  // peers[userId] = call
};


const addScreenStream = (screen, stream) => {
  screen.srcObject = stream
  screen.addEventListener('loadedmetadata', () => {
    screen.play()
  })
  videoGrid.append(screen)
};


//Screen capture
const displayMediaOptions = {
  video: {
    displaySurface: "window"
  },
  audio: false
};

// Set event listeners for the start and stop buttons
startElem.addEventListener("click", (evt) => {
  startCapture();
}, false);

stopElem.addEventListener("click", (evt) => {
  stopCapture();
}, false);

function startCapture() {
  logElem.innerHTML = "";
    navigator.mediaDevices.getDisplayMedia(displayMediaOptions).then(stream =>{
      addScreenStream(myScreen,stream)
      myPeer.on('call', call =>{
        call.answer(stream);
        const Screen = document.createElement('screenStream');
        call.on('stream', (userScreenShare) =>{
          addVideoStream(myScreen,userScreenShare)
        })

      })

    })

  }


function stopCapture(evt) {
  let tracks = videoElem.srcObject.getTracks();

  tracks.forEach((track) => track.stop());
  videoElem.srcObject = null;
}