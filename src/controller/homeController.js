import DBConnection from "../configs/DBConnection";
import fs from "fs";
import path from "path";
let renderHomePage = async (req, res) => {
  try {
    const posts = await getPosts(0);
    res.render("home", { posts: posts });
  } catch (err) {
    console.log("err");
  }
};

const getPosts = async (id_post) => {
  try {
    return new Promise((resolve, reject) => {
      DBConnection.query(
        "select * from posts where id_post > ?",
        [id_post],
        function (err, rows) {
          if (err) {
            reject(err);
          } else {
            resolve(rows);
          }
        }
      );
    });
  } catch (err) {
    console.log("Error get posts: ", err);
  }
};

const postInfo = async (req, res) => {
  try {
    const postId = req.params.id;
    const property = await getPostInfo(postId);
    const images = await getImagesPost(postId);
    res.render("postInfo", { property: property, images: images });
  } catch (err) {
    console.log("Error postInfo: ", err);
  }
};

const getPostInfo = async (values) => {
  return new Promise((resolve, reject) => {
    DBConnection.query(
      "SELECT * FROM posts where id_post = ?",
      values,
      function (err, rows) {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      }
    );
  });
};

const getImagesPost = async (id) => {
  const directoryPath = path.join(__dirname, `../uploads/${id}`);

  return new Promise((resolve, reject) => {
    fs.readdir(directoryPath, (err, files) => {
      if (err) {
        reject(err);
      } else {
        const imageFiles = files.filter((file) =>
          /\.(png|jpg|jpeg|gif)$/i.test(file)
        );
        const imageUrls = imageFiles.map((file) => `/uploads/${id}/${file}`);
        resolve(imageUrls);
      }
    });
  });
};

module.exports = {
  renderHomePage: renderHomePage,
  postInfo: postInfo,
};
