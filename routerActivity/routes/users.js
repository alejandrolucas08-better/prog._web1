const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.redirect("/users/signup");
});

router.get("/signin", (req, res) => {
  res.send("<h1>Página de Login (/users/signin)</h1>");
});

router.get("/signup", (req, res) => {
  res.send("<h1>Página de Cadastro (/users/signup)</h1>");
});

router.get("/:userid", (req, res) => {
  res.send(`<h1>Bem-vindo, usuário: ${req.params.userid}!</h1>`);
});

module.exports = router;
