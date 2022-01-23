const mongoose = require('mongoose')

const ModelMetaDataSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  videoList: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'VideoMetaData',
    default: []
  }
})

const ModelMetaData = mongoose.model('ModelMetaData', ModelMetaDataSchema, 'ModelMetaData')

module.exports = ModelMetaData
