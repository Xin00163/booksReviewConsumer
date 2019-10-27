const booksRouter = require("./routes/booksRouter");
const express = require("express");
const cookieParser = require("cookie-parser");
const logger = require("morgan");

if (process.env.DB_SEED) {
  console.log("+ Seeding DB data");
  const Repository = require("./repositories/books");
  const DataSet = require("./data/books.json");

  DataSet.forEach(bookObject => {
    console.log(`  - ${bookObject.title}`);
    Repository.insert(bookObject);
  });
}

const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/books", booksRouter);

module.exports = app;
