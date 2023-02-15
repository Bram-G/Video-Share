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
const userName = messagContainer.getAttribute("data-name");
const myVideo = document.createElement('video')
myVideo.muted = true
const peers = {}
//Screen capture
const videoElem = document.getElementById("screenDisplay");
const videoElemGrid = document.getElementById("screenDisplayGrid");
const logElem = document.getElementById("log");
const startElem = document.getElementById("start");
const stopElem = document.getElementById("stop");
var currentPeer;
let iframe = document.getElementById('iframeDisplay')
hidden = document.getElementsByClassName("hidden")
// gets mic and camera dataconst 
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
          videoElemGrid.style.width="80%"
          videoElemGrid.style.height="80%"
          const screenStream = stream;
          window.stream = stream;
          let videoTrack = screenStream.getVideoTracks()[0]
          // console.log(screenStream.getVideoTracks()[0])

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
socket.on('user-connected', (userName) =>{
  const msg = document.createElement("li");
  msg.textContent = `${userName} has joined the room.`;
  messagContainer.appendChild(msg);
})
socket.on('youtube-source-in', youtubeSource => {
  console.log(youtubeSource)
  let iframe = document.getElementById('iframeDisplay')
  iframe.setAttribute("src", youtubeSource)
  iframe.style.width="50%"
  iframe.style.height="40%"
})

function appendMessage(message){
  const messageElement = document.createElement('div')
  messageElement.innerText = message
  messagContainer.append(messageElement)
}

//when user clicks send then it grabs the value of input and emits it
messageForm.addEventListener("submit", function (e) {
  e.preventDefault();
  if (messageInput.value) {
    //Sending the message AND the name of the User to the server
    socket.emit("chat message", { msg: messageInput.value, name: userName });
    messageInput.value = "";
  }
});

socket.on("chat message", function (msg) {
  //sets new date object
  const date = new Date();
  const pm = date.getHours() >= 12;
  let hour12 = date.getHours() % 12;
  if (!hour12) hour12 += 12;
  //if minute is less than 10 it will add 0 in front, other wise it looks weird ex. 2:1 pm now looks like 2:01pm
  const minute = (date.getMinutes() < 10 ? "0" : "") + date.getMinutes();
  //creates document that will hold user message
  const item = document.createElement("li");
  //setting text content to the name and msg using object key pairs
  item.textContent = `${msg.name} ${hour12}:${minute} ${pm ? "pm" : "am"}: ${
    msg.msg
  }`;
  messages.appendChild(item);
  cardBody.scrollTop = cardBody.scrollHeight;
});

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
  stopCapture();
  videoElemGrid.style.width="2%"
  videoElemGrid.style.height="2%"
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
  iframe.style.width="50%"
  iframe.style.height="40%"
 })

