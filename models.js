const mongoose = require("mongoose");

const SensorSchema = new mongoose.Schema({
  sensor: {
    type: String,
    required: true,
  },
  temperature: {
    type: Number,
    default: 0,
  },
  humidity: {
    type: Number,
    default:0,
  },
  timestamp:{
    type: Date,
    default: Date.now
  }
});

const SensorData = mongoose.model("SensorData", SensorSchema);

module.exports = SensorData;