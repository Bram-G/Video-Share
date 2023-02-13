const joinRoom = (event) => {
    event.preventDefault();
    var newRoomId = document.getElementById('roomId').value.trim();
    if(newRoomId.length === 36) {
        console.log(newRoomId);
        document.location.replace(`/room/${newRoomId}`)
    }
}
document.querySelector('.joinForm').addEventListener('submit', joinRoom);
