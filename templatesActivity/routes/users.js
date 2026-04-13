const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.redirect("/users/signup");
});

router.get("/signin", (req, res) => {
  res.render("users/signin", { title: "Página de Login" });
});

router.get("/signup", (req, res) => {
  res.render("users/signup", { title: "Página de Cadastro" });
});

router.get("/:userid", (req, res) => {
  res.render("users/profile", { title: "Perfil do Usuário", userid: req.params.userid });
});

module.exports = router;
