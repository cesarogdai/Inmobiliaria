import express from "express";
import hbs from "hbs";
import fs from "fs";

const partialsPath = __dirname + "/../views/partials";
const navbar = hbs.compile(
  fs.readFileSync(partialsPath + "/navbar.hbs").toString("utf-8")
);

const navbar_admin = hbs.compile(
  fs.readFileSync(partialsPath + "/navbar_admin.hbs").toString("utf-8")
);

let configViewEngine = (app) => {
  app.use(express.static("./src/public"));
  app.set("view engine", "hbs");
  app.set("views", "./src/views");

  //Normal Navbar
  hbs.registerPartial("navbar", navbar);

  //Admin navbar
  hbs.registerPartial("navbar_admin", navbar_admin);
  hbs.registerHelper("stringify", function (obj) {
    return JSON.stringify(obj);
  });
  hbs.registerHelper("parseJSON", function (obj) {
    return JSON.parse(obj);
  });

  hbs.registerHelper("printProp", function (array, property) {
    if (array && array.length > 0) {
      return array.map((item) => item[property]).join(", "); // Join multiple values if needed
    } else {
      return ""; // Return an empty string if the array is empty or undefined
    }
  });
};

export default configViewEngine;
