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

appendMessage( `user` + " Joined room " + ROOM_ID)
// socket.emit('new-user', userName)
socket.on('chat-message', data =>{
  appendMessage(`${data.name}: ${data.message}`)
})
socket.on('user-connected', userId =>{
  appendMessage(`${userId} connected`)
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

