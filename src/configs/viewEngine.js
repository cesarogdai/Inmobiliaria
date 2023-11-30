import express from "express";
import hbs from "hbs";
import fs from "fs";

const partialsPath = __dirname + "/../views/partials";
const navbar = hbs.compile(
  fs.readFileSync(partialsPath + "/navbar.hbs").toString("utf-8")
);

let configViewEngine = (app) => {
  app.use(express.static("./src/public"));
  app.set("view engine", "hbs");
  app.set("views", "./src/views");

  hbs.registerPartial("navbar", navbar);
};

export default configViewEngine;
