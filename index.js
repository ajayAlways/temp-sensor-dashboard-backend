const express = require('express');
const bodyParser = require('body-parser')
const cors = require('cors')
const mongoose = require('mongoose')
const sensorDataModel = require("./models");
const { query } = require('express');
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

//To get all the collection of the data
app.get('/',async (req,res) => {
    // const sensors = await sensorDataModel.distinct('sensorId');
    // const retData = sensors.map(async (sensorId)=>{
    //     let data = {};
    //     data[sensorId]= await sensorDataModel.find({sensorId:sensorId}).sort({_id:-1});
    //     return data;
    // });
    // console.log(retData);
    const retData = await sensorDataModel.find({}).sort({_id:-1})

    try{
        res.send(retData)
    }catch(error){
        res.status(500).send(error);
    }
});

// to get the latest temperature value 
app.get('/latestTemp/:sensorId', async(req,res) => {
    const sensorId = req.params.sensorId;
    const retData = await sensorDataModel.find({sensorId:sensorId}).sort({_id:-1}).limit(1)
    try{
        res.send(retData)
    }catch(error){
        res.status(500).send(error);
    }
})

// to get the distinct sensors
app.get('/sensors', async (req,res)=>{
    const retData = await sensorDataModel.distinct('sensorId')
    try{
        res.send(retData)
    }catch(error){
        res.status(500).send(error);
    }
});

// to post the temperature values
app.post('/temp',async (req,res)=>{
    const data = req.body;
    console.log(data)

    const sensorData = new sensorDataModel(data);

    try{
        await sensorData.save();
        res.send("data sent to database")
    }catch(error){
        res.status(500).send(error);
    }
});

// to get the temperature values of today
app.get('/temp/today/:sensorId', async(req,res)=>{
    // const sensorId = req.query.sensorId ? req.query.sensorId : null;
    const sensorId = req.params.sensorId;
    const date = req.query.date ? req.query.date : null;

    const query = {};
    if(sensorId && date){
        query.$and = [
            {sensorId:sensorId},
            {timeStamp:{$gte:date}}
        ]
    }
    const retData = await sensorDataModel.find(query).sort({timeStamp:-1})
    try{
        res.send(retData)
    }catch(error){
        res.status(500).send(error);
    }
});

// to get the values inbetween the range
app.get('/temp/range/:sensorId',async (req,res)=>{
    // const sensorId = req.query.sensorId ? req.query.sensorId : null;
    const sensorId = req.params.sensorId;
    const from = req.query.from ? req.query.from : null;
    const to = req.query.to ? req.query.to : null;

    const query = {};
    let retData = [];
    if(sensorId && from && to){
        query.$and = [
                {sensorId:sensorId},
                {timeStamp:{$gte:from}},
                {timeStamp:{$lte:to}}
            ]
        retData = await sensorDataModel.find(query).sort({timeStamp:1});
    }

    try{
        res.send(retData)
    }catch(error){
        res.status(500).send(error);
    }
});


app.listen(port,() => console.log(`App listening on port ${port}`))
