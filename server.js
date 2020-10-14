const express = require('express') //Call to express
const app = express() // App set up
const server = require('http').Server(app) // server setup that will run (http is installed) --> specify app
const io = require('socket.io')(server) //importing socket.io
const { v4: uuidV4 } = require('uuid') //v4 a version of a unique id -> for such person 
    //const { Socket } = require('net');
const { ExpressPeerServer } = require('peer'); //imports peer
const peerServer = ExpressPeerServer(server, {
    debug: true
});
app.use('/peerjs', peerServer);

app.set('view engine', 'ejs') //imports the view from room using ejs package
app.use(express.static('public')); // setting public file into server/URL

app.get('/', (req, res) => {
        res.redirect(`/${uuidV4()}`) // redirect localhost port .... to uuid (unique id)

        //res.render('room'); ----> shows room with local host post(server.lister(....))
        // res.status(200).send("Infinity and Beyond"); //-----> shows u if node.js server is active as a status message
    }) //URL where it will live on (root URl)

app.get('/:room', (req, res) => {
    res.render('room', { roomId: req.params.room })
})

// Create a connecttion to server
io.on('connection', socket => {
    socket.on('join-room', (roomId, userId) => {
        socket.join(roomId)
        socket.to(roomId).broadcast.emit('user-connected', userId); // tell everyone user has connected
        //Messages
        socket.on('message', (message) => {
            //send message to the same room
            io.to(roomId).emit('createMessage', message)
        });
    })
})



server.listen(3030); // listen on server and run it (local host: port used is 3030) wil WEBRTC