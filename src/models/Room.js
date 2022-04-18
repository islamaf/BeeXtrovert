const mongoose = require('mongoose')
const uuid = require('uuid')
const Schema = mongoose.Schema

var r = (Math.random() + 1).toString(36).substring(7)

const roomSchema = new Schema({
    name: {
        type: String,
        default: r,
        required: true
    },
    userCount: {
        type: Number,
        required: true,
        default: 0
    },
    ageGroup: {
        type: String,
        required: true
    },
    countryCode: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    language: {
        type: String,
        required: true
    },
    interests: {
        type: Array,
        required: true
    },
    users: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    }],
    messages: [{
        message: {
            type: String
        },
        message_id: {
            type: Number,
            default: 0
        },
        from: {
            type: mongoose.Schema.Types.ObjectId
        },
        from_username: {
            type: String
        },
        created_at: {
            type: Date,
            default: new Date().getTime()
        }
    }],
    reports: [{
        from: {
            type: mongoose.Schema.Types.ObjectId
        },
        to: {
            type: mongoose.Schema.Types.ObjectId
        }
    }],
    banned: [
        mongoose.Schema.Types.ObjectId
    ]
})

roomSchema.pre('save', async function (next) {
    const room = this

    next()
})

const Room = mongoose.model('Room', roomSchema)

module.exports = Room