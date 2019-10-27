const express = require("express");
const router = express.Router();

const BooksController = require("../controllers/BooksController");

router.get("/", BooksController.getAll);
router.get("/stats", BooksController.getWithAllStatsWithFilter);
router.get("/reviews", BooksController.getWithReviewsWithFilter);

module.exports = router;
