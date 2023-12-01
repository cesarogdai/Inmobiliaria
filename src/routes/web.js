import express from "express";
import homeController from "../controller/homeController";
import adminController from "../controller/adminController";
let router = express.Router();

let initWebRoutes = (app) => {
  //MAIN PAGE
  router.get("/", homeController.renderHomePage);

  //ADMIN PAGE
  router.get("/admin", adminController.renderLogin);
  router.post("/adminLogin", adminController.handleLogin);
  router.get("/admin/dashboard", adminController.adminDashboard);
  router.get("/uploadPost", adminController.uploadPost);
  return app.use("/", router);
};
module.exports = initWebRoutes;
