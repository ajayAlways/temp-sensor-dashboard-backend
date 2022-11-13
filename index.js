const express = require('express');
const bodyParser = require('body-parser')
const cors = require('cors')
const mongoose = require('mongoose')
const sensorDataModel = require("./models");
require('dotenv').config();

const app = express();

const port = process.env.PORT || 8000;

app.use(cors());

// Configuring body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const uri = process.env.URI;

mongoose.connect(
    uri,
    {}
  );

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", function () {
  console.log("Connected successfully");
});

app.get('/',async (req,res) => {
    const retData = await sensorDataModel.find({});

    try{
        res.send(retData)
    }catch(error){
        res.status(500).send(error);
    }
});

app.post('/dht',async (req,res)=>{
    const sensor = req.body.sensor;
    const temp = parseFloat(req.body.temp);
    const humid = parseFloat(req.body.humid);

    const data = {
        "sensor":sensor,
        "temperature":temp,
        "humidity":humid,
    };

    const sensorData = new sensorDataModel(data);

    try{
        await sensorData.save();
        res.send("data sent to database")
    }catch(error){
        response.status(500).send(error);
    }
});


app.listen(port,() => console.log(`App listening on port ${port}`))
