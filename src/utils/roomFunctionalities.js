const User = require('../models/User')
const Room = require('../models/Room')

const getUsersInRoom = async (user_id, room) => {
    const usersInRoom = []

    try {
        const checkRoom = await Room.findById(room)

        if (checkRoom) {
            for (var i = 0; i < checkRoom.users.length; i++) {
                const user = await User.findById(checkRoom.users[i]._id)

                let sameUser = false
                
                if (user) {
                    if (user_id === user._id.toString()) {
                        sameUser = true
                    }

                    usersInRoom.push({
                        id: user._id,
                        room_id: room,
                        username: user.username,
                        sameUser: sameUser
                    })
                } else {
                    throw new Error()
                }
            }

            return usersInRoom
        } else {
            throw new Error()
        }
    } catch (e) {
        return e
    }
}

module.exports = {
    getUsersInRoom
}