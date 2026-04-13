const express = require("express");
const router = express.Router();

router.post("/", (req, res) => {
  res.send("<h1>Página de Dados (/data) - Método POST</h1>");
});

module.exports = router;
