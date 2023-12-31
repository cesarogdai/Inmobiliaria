let product={
  name:1
};
let renderHomePage = async  (req, res) => {
  try {
      const products = await getProducts(8);
      return res.render("home", {
        user: req.user,
        products: products,
      });
    } catch (err) {
      console.log("Error: ", err);
    }
};

let getProducts = async (empresa_id) => {
  try {
    return new Promise((resolve, reject) => {
      DBConnection.query(
        `SELECT p.product_name, p.description, p.image, p.code, COUNT(*) AS code_count, MAX(p.uploaded_at) AS most_recent_uploaded_at
        FROM products p
        WHERE p.id_empresa = ?
        GROUP BY p.code, p.product_name, p.description, p.image
        ORDER BY code_count DESC, most_recent_uploaded_at DESC;
        `,
        [empresa_id],
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
    console.log("Error getProducts: ", err);
  }
};
module.exports = {
  renderHomePage: renderHomePage,
  };

let getPosts = async (req, res) => {};

module.exports = {
  renderHomePage: renderHomePage,
};
import DBConnection from "../configs/DBConnection";

let handleHelloWorld = async (req, res) => {
  try {
    const products = await getProducts(req.user[0].id_empresa);
    return res.render("homepage", {
      user: req.user,
      products: products,
    });
  } catch (err) {
    console.log("Error: ", err);
  }
};

