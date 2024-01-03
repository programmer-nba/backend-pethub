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
app.use("/pethub/product/productgroup", require("./router/product/productGroup"))
app.use("/pethub/product/brand", require("./router/product/brand"))

app.use("/pethub/product-shop", require("./router/product/product-shop"));

app.use("/pethub/promotion", require("./router/promotion"))
app.use("/pethub/cashier", require("./router/cashier"));
app.use("/pethub/member",require("./router/member"))

app.use("/pethub/shopping", require("./router/shopping"));


app.use("/pethub/supplier", require("./router/supplier/index"));

app.use("/pethub/shop", require("./router/shop/index"));
app.use("/pethub/employee", require("./router/employee"));
// app.use("/pethub/order", require("./router/order/order"));

// app.use("/pethub/order", require("./router/order/order"));

const port = process.env.PORT || 4003;
app.listen(port, console.log(`Listening on port ${port}`));