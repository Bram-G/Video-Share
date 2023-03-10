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
const userName = messagContainer.getAttribute("class");
console.log(userName)
const myVideo = document.createElement('video')
myVideo.muted = true
const peers = {}
//Screen capture
const videoElem = document.getElementById("screenDisplay");
const videoElemGrid = document.getElementById("screenDisplayGrid");
const logElem = document.getElementById("log");
const startElem = document.getElementById("start");
const stopElem = document.getElementById("stop");
let myVideoStream;
var currentPeer;
let iframe = document.getElementById('iframeDisplay')
const muteAudio = document.getElementById('muteAudio')
const videoBox = document.querySelector("#video-sgrid > video");
// gets mic and camera dataconst 
navigator.mediaDevices.getUserMedia({
  video: true,
  audio: true
}).then(stream => {
  myVideoStream = stream;
  // creates video box with stream data
  addVideoStream(myVideo, stream)

  myPeer.on('call', (call) => {
    call.answer(stream);
    const video = document.createElement('video');
    currentPeer = call;
    console.log(currentPeer)

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
          videoElemGrid.style.width="70%"
          videoElemGrid.style.height="70%"
          const screenStream = stream;
          window.stream = stream;
          let videoTrack = screenStream.getVideoTracks()[0]
        console.log(videoTrack)

          if (myPeer) {
            console.log("Current Peer", currentPeer);
            const videoElem = document.getElementById("screenDisplay");
            addScreenStream(videoElem, stream);

            let sender = currentPeer.peerConnection.getSenders().find(function (s) {
                return s.track.kind == videoTrack.kind;
            })
        sender.replaceTrack(videoTrack)

  
      }})
  
      })
    })
  
    


appendMessage( `${userName}` + " Joined room " + ROOM_ID)
// socket.emit('new-user', userName)
socket.on('chat-message', data =>{
  console.log(data.userNameChat)
  appendMessage(`${data.userNameChat}: ${data.message}`)
})
socket.on('user-connected', (userName) =>{
  const msg = document.createElement("li");
  msg.textContent = `${userName} has joined the room.`;
  messagContainer.appendChild(msg);
})
socket.on('youtube-source-in', youtubeSource => {
  console.log(youtubeSource)
  let iframe = document.getElementById('iframeDisplay')
  iframe.setAttribute("src", youtubeSource)
  iframe.style.width="70%"
  iframe.style.height="70%"
})
socket.on('screenshare-source-in', videoElemGrid => {
  videoElemGrid
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


const addScreenStream = (screen, stream) => {
  videoElem.srcObject = stream
  videoElem.addEventListener('loadedmetadata', () => {
    videoElem.play()
  })
  videoElemGrid.append(screen)
};


//Screen capture
const displayMediaOptions = {
  video: {
    displaySurface: "window"
  },
  audio: false
};
stopElem.addEventListener("click", (evt) => {
  iframe.style.width = "1px"
  iframe.style.height = "1px"
  stopCapture();
  videoElemGrid.style.width="1px"
  videoElemGrid.style.height="1px"
}, false);
// Set event listeners for the start and stop buttons

function stopCapture(evt) {
  let tracks = videoElem.srcObject.getTracks();

  tracks.forEach((track) => track.stop());
  videoElem.srcObject = null;
}

//Youtube
let youtubeID = document.getElementById('youtubeForm')
  youtubeID.addEventListener('click', (evt) => {
  let youtubeInput = document.getElementById('youtubeInput').value
  let urlArray = youtubeInput.split("watch?v=")
  urlArray.splice(1, 0, "embed/")
  let youtubeSource = urlArray.join("")
  iframe.setAttribute("src", youtubeSource)
  socket.emit('youtube-socket', youtubeSource)
  iframe.style.width="70%"
  iframe.style.height="70%"
 })

 //Mute 
const muteUnmute = () => {
  const enabled = myVideoStream.getAudioTracks()[0].enabled;
  if (enabled) {
    myVideoStream.getAudioTracks()[0].enabled = false;
    muteAudio.classList.remove("orange")
    muteAudio.classList.add("red")
  } else {
    myVideoStream.getAudioTracks()[0].enabled = true;
    muteAudio.classList.remove("red")
    muteAudio.classList.add("orange")
  }
};
muteAudio.addEventListener('click',(e)=>{
  muteUnmute();
})


// videoBox.addEventListener('dblclick', (evt) => {
//   videoBox.requestFullscreen()
//   console.log('test')
// })

