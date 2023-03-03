const mongoose = require("mongoose");

const SensorSchema = new mongoose.Schema({
  sensorId: {
    type: String,
    required: true,
  },
  tempValues:{
    type:Array,
    required:true,
  },
  timeStamp:{
    type: String,
    required: true,
  }
});

const SensorData = mongoose.model("SensorData", SensorSchema);

module.exports = SensorData;