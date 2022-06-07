require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const route = require("./route/route");
const app = express();
const morgan = require("morgan");


app.use(morgan("tiny"));
app.use(bodyParser.json());

mongoose.connect(process.env.MONGODB,
    { useNewUrlParser: true })
    .then(() => console.log("MongoDb is connected"))
    .catch(err => console.log(err));

app.use("/", route);

app.listen(process.env.PORT || 3000, function () {
    console.log("Express app running on port " + (process.env.PORT || 3000))
});