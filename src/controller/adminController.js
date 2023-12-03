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

const renderLogin = async (req, res) => {
  try {
    const posts = await getPosts;
    res.render("admin", {
      posts: posts,
    });
  } catch (err) {
    console.log("err", err);
  }
};

const handleLogin = (req, res) => {
  const { username, password } = req.body;

  if (username === "admin" && password === "123") {
    req.session.isAdmin = true;
    res.redirect("/admin/dashboard");
  } else {
    res.render("admin", { error: "Credenciales invalidas" });
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

const uploads_dir = path.join(__dirname, "../uploads");

if (!fs.existsSync(uploads_dir)) {
  fs.mkdirSync(uploads_dir);
}

const handleFileUpload = upload.single("image");

const createPost = async (req, res) => {
  try {
    const { description, ubicacion } = req.body;
    console.log("req_files: ", req.body);

    // Use multer.any() to handle multiple file uploads
    const uploadMiddleware = upload.any();

    uploadMiddleware(req, res, async (err) => {
      if (err) {
        console.log("File upload error: ", err);
        res.send({ error: "No se pudo cargar la imagen" });
        return;
      }

      // Process other form fields
      const { description, ubicacion } = req.body;
      console.log("Description: ", description);
      console.log("Ubicacion: ", ubicacion);

      const { insertId } = await insertProduct([description, ubicacion]);

      let imageFileName; // Declare it outside the loop

      req.files.forEach((file) => {
        const imageBuffer = file.buffer;
        imageFileName = file.originalname; // Update its value inside the loop
        const imagePath = path.join(
          uploads_dir,
          insertId.toString(),
          imageFileName
        );
        fs.mkdirSync(path.join(uploads_dir, insertId.toString()), {
          recursive: true,
        });
        fs.writeFileSync(imagePath, imageBuffer);
      });

      const imagePathInDB = `/uploads/${insertId.toString()}/${imageFileName}`;
      await updateProductImage(insertId, imagePathInDB);

      res.send({ data: "success" });
    });
  } catch (err) {
    console.log("Error creating post: ", err);
    res.send({ data: "error" });
  }
};

let insertProduct = async (values) => {
  return new Promise((resolve, reject) => {
    DBConnection.query(
      `INSERT INTO posts ( description, ubicacion
        )
       VALUES (?, ?)`,
      values,
      function (err, result) {
        if (err) {
          console.log("error insertProduct: ", err);
          reject(err);
        } else {
          resolve(result);
        }
      }
    );
  });
};

const updateProductImage = async (postId, imagePath) => {
  return new Promise((resolve, reject) => {
    DBConnection.query(
      "update posts set image = ? where id_post = ?",
      [imagePath, postId],
      function (err, result) {
        if (err) {
          console.log("error updateProductImage: ", err);
          reject(err);
        } else {
          resolve(result);
        }
      }
    );
  });
};

const getPosts = async (req, res) => {
  try {
    return new Promise((resolve, reject) => {
      DBConnection.query("select * from posts", function (err, rows) {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  } catch (err) {
    console.log("Error get posts: ", err);
  }
};

module.exports = {
  isAuthenticated: isAuthenticated,
  renderLogin: renderLogin,
  handleLogin: handleLogin,
  adminDashboard: adminDashboard,
  uploadPost: uploadPost,
  createPost: createPost,
};
