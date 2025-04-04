const mongoose = require("mongoose");

const regionalSchema = new mongoose.Schema({
  bankName: {
    type: String,
    required: true,
  },
  participants: {
    type: Number,
   
  },
  phone: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  jobTitle: {
    type: String,
    required: true,
  },
  course: {
    type: String,
    default: 'ESG Trianing',
  },
  month: {
    type: String,
    required: true,
    
  },
  // region: {
  //   type: String,
  //   required: true,
    
  // },
  Date1 : {
    type: String,
    required: true,
  },
  Date2: {
    type: String,
    required: true,
  },
  Date3: {
    type: String,
    required: true,
  },
  
  


  
  dateSubmitted: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Regional", regionalSchema);
