const mongoose = require('mongoose');

const usesSchema = new mongoose.Schema({
  name : {
    type: String,
    require: true
  },
  userName: {
    type: String,
    require: true
  },
  email: {
    type: String,
    require: true
  },
  password: {
    type: String,
    require: true
  }
})

mongoose.model("USER", usesSchema)