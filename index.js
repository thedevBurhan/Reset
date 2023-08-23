const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();

//configure thhe environment

const PORT=process.env.PORT 
const UrlMongodb=process.env.UrlMongodb;
// initialize express server framework
const app = express();
// MiddleWare
app.use(express.json());
app.use(bodyParser.json());
app.use(cors());
//UserssRouter
const usersRouter=require("./Routers/users")
app.use("/users",usersRouter);
// mongoDB Configuration
mongoose
  .connect(UrlMongodb, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB database connection established successfully.");
    app.listen(PORT, () => {
      console.log(`Server is running on port localHost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error(`Error connecting to MongoDB`, error);
  });
