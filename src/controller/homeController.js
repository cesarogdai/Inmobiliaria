let renderHomePage = (req, res) => {
  let products = { name: 0 };
  res.render("home", products);
};

let getPosts = async (req, res) => {};

module.exports = {
  renderHomePage: renderHomePage,
};
