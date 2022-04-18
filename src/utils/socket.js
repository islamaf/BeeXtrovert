const User = require('../models/User')
const Room = require('../models/Room')
const { generateMessage } = require('./messages')
const { getUsersInRoom } = require('./roomFunctionalities')

const socket = (io) => {
    io.on('connection', async (socket) => {
        console.log('A new user has connected!')

        let regex = /(?<=chat\/).*$/
        let url = socket.handshake.headers.referer
        var room = url.match(regex)[0]
        var userId = socket.handshake.session.userId
        var username = socket.handshake.session.userName
        const allUsers = await getUsersInRoom(userId, room)

        socket.on('join', async (callback) => {
            let room_name = ""
            const r = await Room.findById(room)
            if (r) {
                room_name = r.name
            }

            if (r.banned.includes(userId)) {
                return callback("You can not join this room.")
            }

            socket.join(room)

            let roomUsers = await io.in(room).fetchSockets()
            // if (roomUsers.length > 0) {
            //     console.log(roomUsers[0].handshake.session.userId)
            //     console.log(roomUsers[0].handshake.session.userName)
            // }

            if (r.messages.length === 0) {
                socket.emit('message', generateMessage(undefined, 'Admin', room, `Nothing has been said yet!`))
            }
            socket.broadcast.to(room).emit('message', generateMessage(undefined, 'Admin', room, `${username} has joined!`))

            io.to(room).emit('allMessages', r.messages)

            io.to(room).emit('roomData', {
                name: room_name,
                room_id: room,
                users: allUsers
            })

            callback()
        })

        socket.on('sendMessage', (message, callback) => {
            io.to(room).emit('message', generateMessage(userId, username, room, message))
            callback('Delivered!')
        })

        // console.log(socket.handshake.query.player)
        // console.log(socket.handshake.headers.referer)
        // console.log(socket.request.url)
        // console.log(socket.handshake.session.userId)

        socket.on('disconnect', () => {
            // console.log('user disconnected');
            io.to(room).emit('message', generateMessage(undefined, 'Admin', room, `${username} has left!`))
        });
    })
}

module.exports = socket