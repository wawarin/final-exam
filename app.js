const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const PORT =3000;
app.use(express.json());

const testRouter = require("./modules/final")
app.use("/exam", testRouter)


app.listen(PORT,()=>console.log("Server is running"));
