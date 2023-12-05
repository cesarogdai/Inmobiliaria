import express from "express";
import homeController from "../controller/homeController";
import adminController from "../controller/adminController";
const multer = require("multer");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
let router = express.Router();

let initWebRoutes = (app) => {
  //MAIN PAGE
  router.get("/", homeController.renderHomePage);
  router.get("/postInfo/:id", homeController.postInfo);

  //ADMIN PAGE
  router.get("/admin", adminController.renderLogin);
  router.post("/adminLogin", adminController.handleLogin);
  router.get("/admin/dashboard", adminController.adminDashboard);
  router.get("/uploadPost", adminController.uploadPost);
  router.post("/createPost", adminController.createPost);
  return app.use("/", router);
};
module.exports = initWebRoutes;
