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
       type: String,
       required: true,
     },
     inv: { //AutoGenned I guess
      type: String,
      trim: true,
      required: false,
     },
     xOverall: { //AutoGenned
       type: Number,
       required: false,
       min: 0,
     },
     yOverall: { //AutoGenned
       type: Number,
       required: false,
       min: 0,
     },
     owner: { //AutoGenned
       type: mongoose.Schema.ObjectId,
       required: true,
       ref: 'Account',
     },
     createdDate: { //AutoGenned
       type: Date,
       default: Date.now,
     },
});

const ItemModel = mongoose.model('Item', itemSchema);
module.exports = ItemModel;