const socket = io();

const welcome = document.getElementById("welcome");
const form = welcome.querySelector("form");
const room = document.getElementById("room");
let roomName;
room.hidden = true;

function addMessage(message) {
  const ul = room.querySelector("ul");
  const li = document.createElement("li");
  li.innerText = message;
  ul.append(li);
}

function showRoom() {
  const h3 = room.querySelector("h3");
  const msgForm = room.querySelector("#msg");
  const nameForm = room.querySelector("#name");
  room.hidden = false;
  welcome.hidden = true;
  h3.innerText = `Room ${roomName}`;
  msgForm.addEventListener("submit", messageSubmit);
  nameForm.addEventListener("submit", nicknameSubmit);
}

function messageSubmit(event){
  event.preventDefault();
  const input = room.querySelector("#msg input");
  const value = input.value;
  socket.emit("new_message", value, roomName, () => {
    addMessage(`You : ${value}`);
  });
  input.value = "";
}

function handleRoomSubmit(event) {
  event.preventDefault();
  const input = form.querySelector("input");
  socket.emit("enter_room", input.value, showRoom);
  roomName = input.value;
  input.value = "";
}

function nicknameSubmit(event) {
  event.preventDefault();
  const input = room.querySelector("#name input");
  const value = input.value;
  socket.emit("nickname", value);
}

form.addEventListener("submit", handleRoomSubmit);

socket.on("welcome", (user) => {
    addMessage(`${user} joined!`);
});

socket.on("bye", (user) => {
    addMessage(`${user} left!`);
})

socket.on("new_message", addMessage);