const express = require("express");
const router = express.Router();

router.post("/", (req, res) => {
  res.render("data-post", { title: "Página de Dados" });
});

module.exports = router;
