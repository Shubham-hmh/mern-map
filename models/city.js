

const mongoose = require('mongoose');
 const citySchema = new mongoose.Schema({
    city: {
        type: String,
        required: true,
    },
    temp: {
        type: String,
        required: true,
    },
    descp: {
        type: String,
    }
    ,
    lat:{
        type: String,

    },
    lon:{
        type: String,

    },
    humidity:{
        type: String,

    }

}, { timestamps: true }
);


module.exports=mongoose.model('City',citySchema);