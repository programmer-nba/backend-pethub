require("dotenv").config();

const express = require("express");
const app = express();
const connection = require("./config/db");
connection();

app.use(express.json());



const port = process.env.PORT || 4003;
app.listen(port, console.log(`Listening on port ${port}`));