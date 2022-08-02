const { io } = require("socket.io-client");
const socket = io("http://localhost:3000");



// let username = 'Hasnat';
// let phoneNo = Math.floor(Math.random()*1000).toString();
//let roomId = Math.floor(Math.random()*10000).toString();

let Rooms = [];
let Users = [];

function myFunction(username, ) {
  socket.on("connect", () => {
    socket.emit("new_user", username, phoneNo, id = socket.id);
    console.log("connected", socket.id, username, phoneNo);
    
  });
  console.log("name:",name.value, "phone: ",phone.value);
}

// socket.on("connect", () => {
//   socket.emit("new_user", username, phoneNo, id = socket.id);
//   console.log("connected", socket.id, username, phoneNo);
  
// });


// socket.on("user_list", (users)=>{
//   Users = users
//   console.log(users)
// })

// socket.emit("create-new-room","English Room", socket.id);

// socket.on("room-created",(room)=>{
//   Rooms.push(room);
//   console.log("Your room is created: ", room)
// })

// socket.emit("add-user-to-room","English Room", socket.id);

// socket.on("user-added-to-room",(payload,rooms)=>{
//   Rooms = rooms;
//   console.log("User added to room: ", payload)
// })

// socket.emit('send-message-to-room','English Room','Hello',socket.id);

// socket.on("message-received",(roomName,message,username)=>{
//   Rooms.forEach((room) => {
//     if (room.roomName === roomName) {
//       room.messages.push({ username: username, message: message });
//     } 
//   });
//   console.log("Message received: ", message, username)
// });


// console.log(Rooms)
// console.log(Users)