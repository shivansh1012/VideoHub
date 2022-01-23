const mongoose = require("mongoose");

const ChannelMetaDataSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    videoList: {
        type: [mongoose.Schema.Types.ObjectId],
        ref:"VideoMetaData",
        default: []
    }
})

const ChannelMetaData = mongoose.model("ChannelMetaData", ChannelMetaDataSchema, "ChannelMetaData");

module.exports = ChannelMetaData;