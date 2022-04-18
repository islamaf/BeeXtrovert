const Room = require('../models/Room')
const mongoose = require('mongoose')

const generateMessage = (user_id, username, room, text) => {
    if (username !== 'Admin') {
        Room.findById(room, (err, found) => {
            if (err) {
                console.log(err)
                return err
            }
            
            Room.findByIdAndUpdate(room, {
                $push: {
                    messages: {
                        message: text,
                        message_id: found.messages.length + 1,
                        from: mongoose.Types.ObjectId(user_id),
                        from_username: username
                    }
                }
            }, { new: true }, (err, updated) => {
                if (err) {
                    console.log(err)
                    return err
                }
            })
        })
    }

    return {
        username,
        text,
        createdAt: new Date().getTime()
    }
}

module.exports = {
    generateMessage
}