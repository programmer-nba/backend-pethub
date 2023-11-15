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

app.use("/pethub/product-shop", require("./router/product/product-shop"));

app.use("/pethub/supplier", require("./router/supplier/index"));

app.use("/pethub/shop", require("./router/shop/index"));
app.use("/pethub/employee", require("./router/employee"));

const port = process.env.PORT || 4003;
app.listen(port, console.log(`Listening on port ${port}`));