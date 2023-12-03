import DBConnection from "../configs/DBConnection";
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

module.exports = {
  renderHomePage: renderHomePage,
};
