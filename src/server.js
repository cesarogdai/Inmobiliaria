require("dotenv").config();
import express from "express";
import configViewEngine from "./configs/viewEngine";
import initWebRoutes from "./routes/web";
import adminController from "./controller/adminController";
import bodyParser from "body-parser";
import session from "express-session";

const path = require("path");

let app = express();
app.use(
  session({
    secret: "adminkey",
    resave: true,
    saveUninitialized: true,
  })
);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

configViewEngine(app);
initWebRoutes(app);
app.use("/public", express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

let port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Project is working on ${port}`));
