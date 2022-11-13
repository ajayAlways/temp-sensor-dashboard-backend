const express = require('express');
const bodyParser = require('body-parser')
const cors = require('cors')

const app = express();

const port = 3000;

let temperature = [];
let humidity = [];

app.use(cors());

// Configuring body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/',(req,res) => {
    
    res.send(`temp ${temperature.length} & humid ${humidity.length}`);
});

app.post('/dht',(req,res)=>{
    const data = req.body;

    console.log(data);
    temperature.push(data.temp);
    humidity.push(data.humid);

    res.send('data is added to db');
});


app.listen(port,() => console.log(`App listening on port ${port}`))
