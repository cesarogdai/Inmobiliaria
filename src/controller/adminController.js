import DBConnection from "../configs/DBConnection";

const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const fs = require("fs");
const path = require("path");

const isAuthenticated = (req, res, next) => {
  if (req.session && req.session.isAdmin) {
    return next();
  }
  res.redirect("/");
};

const renderLogin = (req, res) => {
  res.render("admin");
};

const handleLogin = (req, res) => {
  console.log("request_body: ", req.body);
  const { username, password } = req.body;

  if (username === "admin" && password === "123") {
    req.session.isAdmin = true;
    res.redirect("/admin/dashboard");
  } else {
    res.render("login", { error: "Credenciales invalidas" });
  }
};

const adminDashboard = (req, res) => {
  if (req.session.isAdmin) {
    res.render("adminDashboard");
  } else {
    res.redirect("/admin");
  }
};

const uploadPost = (req, res) => {
  if (req.session.isAdmin) {
    res.render("uploadPost");
  } else {
    res.redirect("/admin");
  }
};

let createPost = async (req, res) => {
  console.log("request_body: ", req.body);
  const {
    description,
    price,
    phone,
    caracteristicas,
    ubicacion,
    codigo,
    destacado,
    tipo,
    estado_propiedad,
  } = req.body;

  // Assuming you have 'DBConnection' available for executing queries
  try {
    // Insert the post data into the database
    const insertResult = await insertProduct([
      description,
      price,
      phone,
      ubicacion,
    ]);

    res.send({ status: "correct" });
  } catch (error) {
    console.error("Error creating post:", error);
    res.send({ status: "error" });
  }
};

let insertProduct = async (values) => {
  return new Promise((resolve, reject) => {
    DBConnection.query(
      `INSERT INTO posts ( description, price,phone,ubicacion
        )
       VALUES (?, ?, ?, ?)`,
      values,
      function (err, result) {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      }
    );
  });
};

module.exports = {
  isAuthenticated: isAuthenticated,
  renderLogin: renderLogin,
  handleLogin: handleLogin,
  adminDashboard: adminDashboard,
  uploadPost: uploadPost,
  createPost: createPost,
};
