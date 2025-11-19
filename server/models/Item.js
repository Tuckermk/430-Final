const mongoose = require('mongoose');
const _ = require('underscore');

const setName = (name) => _.escape(name).trim();
//Idea with this schema is that it is the WHOLE item
//with the pieces of it done in a array of blocks to be remade if needed
const itemSchema = new mongoose.Schema({
     name: {
       type: String,
       required: true,
       trim: true,
       set: setName,
     },
     pieces: {
       type: Array,
       items: {
         type: _.object,
         shape: String,
         subX: Number,
         subY: Number,
       },
       required: true,
     },
     xOverall: {
       type: Number,
       required: true,
       min: 0,
     },
     yOverall: {
       type: Number,
       required: true,
       min: 0,
     },
     owner: {
       type: mongoose.Schema.ObjectId,
       required: true,
       ref: 'Account',
     },
     createdDate: {
       type: Date,
       default: Date.now,
     },
});
