const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.render("about", { title: "Página Sobre" });
});

module.exports = router;
