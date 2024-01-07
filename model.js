const mongoose = require("mongoose");

const Schema = mongoose.Schema;

let detail = new Schema({

  file: {
    type: String
  }
});

module.exports = mongoose.model("file", detail);