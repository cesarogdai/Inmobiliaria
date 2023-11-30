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

module.exports = {
  isAuthenticated: isAuthenticated,
  renderLogin: renderLogin,
  handleLogin: handleLogin,
  adminDashboard: adminDashboard,
};
