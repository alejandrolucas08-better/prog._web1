const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.send("<h1>Página Sobre (/about)</h1>");
});

module.exports = router;
