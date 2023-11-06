require("dotenv").config();

const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const connection = require("./config/db");
connection();

app.use(express.json());
app.use(cors());

app.use("/pethub", require("./router"));

app.use("/pethub/admin", require("./router/admin"));

app.use("/pethub/product", require("./router/product/index"));
app.use("/pethub/product/category", require("./router/product/category"));

const port = process.env.PORT || 4003;
app.listen(port, console.log(`Listening on port ${port}`));