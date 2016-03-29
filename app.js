'use strict';

const express = require('express');
const app = express();
const db = require('./models/');
const bodyParser = require('body-parser');
const server = require('http').createServer(app);
const io = require('socket.io')(server);

const PORT = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({
  extended: false
}));

app.use(bodyParser.json())

app.get('/', function(request, response) {
  console.log(request);
    db.sequelize.sync().then(() => {
    //Model.findOrCreate[[sequelize method]]
    db.message.create({name:'Jessa', text:'Hi'}).then(function() {
      db.message.findAll({}).then(function(messages) {
        console.log('----->', messages);
        response.send(messages);
      });
    })
  });
});

db.sequelize.sync().then(() => {
  server.listen(PORT, () => {
    console.log(`Server listening on port: ${PORT}`);
  });
});

io.on('connection', (socket) => {
  var room_name;

  socket.on('join:room', (data) => {
    room_name = data.room_name;
    socket.join(room_name);

    db.message.findAll({where: {room:room_name}}).then(function(messages) {
      console.log(messages)
        var arr = [];
        var stuff = arr.concat(messages)
        // messages.forEach(function(message) {
        return stuff
        //});
      }).then(function(res) {
        io.in(room_name).emit('message', res)
      })
    });

  //   db.message.findAll({where: {room:room_name}}).then(function(messages) {
  //     messages.forEach( function (message) {
  //       console.log('roooom', room_name)
  //       console.log(message.dataValues);
  //       socket.broadcast.to(room_name).emit('message', message.dataValues);
  //     });
  //   });
  // });

  socket.on('leave:room', (msg) => {
    msg.text = msg.user + ' has left the room';
    socket.leave(msg.room);
    socket.in(msg.room).emit('message', msg);
  });

  socket.on('send:message', (msg) => {
    socket.in(msg.room).emit('message', msg);
    console.log("Just got: ", msg);
    db.message.create(msg);
  });

});
