
const express = require("express");
const app = express();
const City = require("./models/city");
const weatherData = require("./utils/weatherData");
const path =require("path");

const dotenv=require('dotenv');   
dotenv.config();

const port = process.env.PORT || 5000;
const mongoose = require("mongoose");


mongoose.connect(process.env.MONGO_URL)   // it give promises.
.then(function(db){                    
    console.log("Database connected")
})
.catch(function(err){
    console.log(err);
});



app.use(express.json());

// //UPDATE CITY ------ ------------------------------>
app.put("/cities/:id", async (req, res) => {
    try {
        const updatedCity = await City.findByIdAndUpdate(req.params.id, {
            $set: req.body

        }, { new: true })
        res.json(updatedCity);

    }
    catch (err) {
        res.status(500).json(err);
    }

});


// //DELETE city------------------------------------------>
app.delete("/cities/:id", async (req, res) => {
    try {
        await City.findByIdAndDelete(req.params.id)
        res.status(200).json('City has been deleted...')
    }
    catch (err) {
        res.status(500).json(err);
    }
});

//GET ALL city data from database --------------> 
app.get("/cities", async (req, res) => {
    try {
        let { page, limit } = req.query;
        if (!page) page = 1;
        if (!limit) limit = 30;
        let skip = (page - 1) * limit;
        const cities = await City.find().skip(skip).limit(limit);
     //   console.log("hello", cities);
        //res.status(200).json(cities);
        res.status(200).send({ page: page, limit: limit, cities: cities });
    }
    catch (err) {
        res.status(500).json(err);
    }
});


//Refresh weather Data in 5 minutes. --------------->
const updateAll = async () => {
    const allData = await City.find();
    allData.forEach(element => {
        const id = element._id;
        const city = element.city;
      //  console.log(id, "checking",city,);
        weatherData(city, async (error, { temp, descp, city, lat, lon, humidity }) => {
            if (error) {
                res.send({ err });
            }
            await City.findByIdAndUpdate(id , {temp,descp,city,lat, lon ,humidity});
        })
    });
}
setInterval(updateAll,300000);


app.post("/weather", (req, res) => {
    const address = req.query.address;
    if (!address) {
        res.send({
            error: "You must enter city name"
        })
    }
    weatherData(address, (error, { temp, descp, city, lat, lon, humidity }) => {
        if (error) {
            res.send({ err })
        }

        const cityData = new City({ temp, descp, city, lat, lon, humidity })
        cityData.save();
        // console.log(temp, descp, city, lat, lon, humidity);
        res.send({
            city,
            lat,
            lon,
            descp,
            humidity
        });
    })
})

//static files
app.use(express.static(path.join(__dirname,'./frontend/build')));
app.get('*',function(req,res){
    res.sendFile(path.join(__dirname,'./frontend/build/index.html'));
});


app.listen(port, () => {
    console.log(`connection is successful at ${port}`);
});





