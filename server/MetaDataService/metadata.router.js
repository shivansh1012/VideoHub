const router = require("express").Router();

const VideoMetaData = require("../Models/VideoMetaData.js");
const ChannelMetaData = require("../Models/ChannelMetaData.js");
const ModelMetaData = require("../Models/ModelMetaData.js");

router.get("/", async (req, res) => {
    try {
        const videoID = req.query.id;
        if (!videoID) {
            return res.status(400).send("Requires Video ID");
        }
        const videoData = await VideoMetaData.findById(req.query.id).populate("channel","name").populate("model");

        const channelVideoList = await ChannelMetaData.findById(videoData.channel["_id"]).populate("videoList");
    
        var moreVideos=channelVideoList["videoList"];
        // for (var i = 0; i < videoData.model.length; i++) {
        //     var modelVideoList = await ModelMetaData.findById(videoData.model[i]["_id"]).populate("videoList")
        //     moreVideos=moreVideos.concat(modelVideoList.videoList);
        // }

        // console.log(videoData.tags.length)
        // console.log(moreVideos)
        res.status(200).json({ videoData, moreVideos: Array.from(moreVideos) });
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

router.get("/model", async (req, res) => {
    try {
        const modelID = req.query.id;
        if (!modelID) {
            return res.status(400).send("Requires Model ID");
        }
        const modelData = await ModelMetaData.findById(modelID).populate("videoList");

        res.status(200).json({ modelData });
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

router.get("/channel", async (req, res) => {
    try {
        const channelID = req.query.id;
        if (!channelID) {
            return res.status(400).send("Requires Channel ID");
        }
        const channelData = await ChannelMetaData.findById(channelID).populate("videoList");

        res.status(200).json({ channelData });
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

router.get("/list", async (req, res) => {
    try {
        const videoList = await VideoMetaData.find().populate("channel","name").populate("model");

        res.status(200).json({ videoList });
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

router.get("/randomVideo", async (req, res) => {
    try {

        res.status(200).json({ videoList });
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: "Internal Server Error" });
    }
})

router.get("/search", async (req, res) => {
    try {
        const query = req.query.query;
        
        if (!query) {
            return res.status(400).send("Requires Query");
        }

        var regexValue1 = query;

        var queryOptions = {
            $and: [{
                filename: {
                    '$regex': regexValue1,
                    '$options': 'i'
                }
            }]
        }
        
        let resultVideoList=await VideoMetaData.find(queryOptions).populate("channel","name").populate("model");
        res.status(200).json({ resultVideoList });
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

module.exports = router;