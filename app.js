//jshint esversion:6

require('dotenv').config();
const express= require('express');
const { watchFile } = require('fs');
const https=require('https');
const bodyParser=require('body-parser');
const mongoose=require('mongoose');

const app=express();
app.use(bodyParser.urlencoded({extended:true}));


mongoose.connect('mongodb://localhost:27017/weather');
const projectSchema=new mongoose.Schema({
    city:String,
    temperature:Number
});


const CityName = mongoose.model('CityName', projectSchema);



app.get("/",function(req,res){
    res.sendFile(__dirname + "/index.html");
    

});

app.post("/",function(req,res){
  
   
    const query=req.body.cityName;
    const apiKey=process.env.API_TOKEN;
    const units="metric";
    const url="https://api.openweathermap.org/data/2.5/weather?q="+query+"&APPID="+apiKey+"&units="+units;
    https.get(url,function(response){
        console.log(response.statusCode);
        response.on("data",function(data){
            const weatherData=JSON.parse(data);
            console.log(weatherData);
            const temp=weatherData.main.temp;
            const description=weatherData.weather[0].description;
            const icon=weatherData.weather[0].icon;
           const imageUrl="http://openweathermap.org/img/wn/"+icon+"@2x.png";
            console.log(description);
            res.write("<h1>The Temperature in "+query +" is " + temp + " degree Celcius</h1>");
            res.write("<p>The weather is currently "+ description + "</p>");
            res.write("<img src=" + imageUrl +">");
            res.send();
            const citydata = new CityName ({ 
                city:query,
                temperature:temp
            });
            citydata.save().then(() => console.log('added'));
            
        });


    });
   

});





app.listen(process.env.PORT || 3000,function(){
    console.log("Server running on port 3000");
});
















