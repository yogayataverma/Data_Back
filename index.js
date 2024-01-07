const express = require("express");
require('dotenv').config();
const app = express();
const cors = require("cors");
const PORT = process.env.PORT || 5000;
const mongoose = require("mongoose");
mongoose.set("strictQuery" , true);
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
app.use(cors());

console.log(process.env.BACK_URL);
const url = process.env.BACK_URL;
mongoose.connect(url, {
  useNewUrlParser: true, 
  useUnifiedTopology: true
});

const connection = mongoose.connection;

connection.once("open", function() {
  console.log("Connection with MongoDB was successful");
});

const router = express.Router();

let detail = require("./model");

router.route("/").get(function(req, res) {
    detail.countDocuments({}, function(err, count) {
      if (err) {
        res.send(err);
      } else {
        res.send({count});
      }
    });
  });

  app.post('/upload', upload.single('file'), (req, res) => {

    const fileName = req.file.filename; 
    var myobj = { file: fileName }; 
  
    connection.collection("files").insertOne(myobj, function(err, result) {
      if (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
      } else {
        console.log("1 document inserted");
        res.status(200).json({ message: 'File uploaded successfully' });
      }
    });
    });
  

app.use("/", router);

//Server

if(process.env.NODE_ENV === "production")
{
 app.use(express.static(path.join("client/data/build")));
 app.get("*", (req,res)=>{
  res.sendFile(path.resolve(__dirname, "client" , "data" , "build" , "index.html"))
 });
}

app.listen(PORT, function() {
  console.log("Server is running on Port: " + PORT);
});