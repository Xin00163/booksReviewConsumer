const Repository = require("../repositories/books");
const ReviewsClient = require("../utils/ReviewsClient");

class BooksController {
  static async getAll(req, res) {
    try {
      const books = Repository.findAll();
      return res.status(200).json([...books.values()]);
    } catch (err) {
      return res.status(500).end(err);
    }
  }

  static async getWithAllStatsWithFilter(req, res) {
    try {
      const title = req.query.title || "";
      const booksCollection = Repository.findBy("title", title);

      if (booksCollection.size <= 0) {
        return res.status(404).end();
      }

      const statsSummary = await ReviewsClient.getAllBooksStatistics();

      statsSummary.forEach(bookStats => {
        const book = booksCollection.get(bookStats.id);
        if (book) {
          booksCollection.set(book.id, {
            ...book,
            totalReviews: bookStats.totalReviews,
            averageRating: bookStats.averageRating
          });
        }
      });

      return res.status(200).json([...booksCollection.values()]);
    } catch (err) {
      return res.status(500).end();
    }
  }

  static async getWithStatsWithFilter(req, res) {
    try {
      const title = req.query.title || "";
      const booksCollection = Repository.findBy("title", title);

      if (booksCollection.size <= 0) {
        return res.status(404).end();
      }

      const bookIds = [...booksCollection.keys()];
      const statsSummary = await ReviewsClient.getBooksStatistics(bookIds);

      statsSummary.forEach(bookStats => {
        const book = booksCollection.get(bookStats.id);
        if (book) {
          booksCollection.set(book.id, {
            ...book,
            totalReviews: bookStats.totalReviews,
            averageRating: bookStats.averageRating
          });
        }
      });

      return res.status(200).json([...booksCollection.values()]);
    } catch (err) {
      return res.status(500).end();
    }
  }

  static async getWithReviewsWithFilter(req, res) {
    try {
      const title = req.query.title || "";
      const booksCollection = Repository.findBy("title", title);

      if (booksCollection.size <= 0) {
        return res.status(404).end();
      }

      const bookIds = [...booksCollection.keys()];
      const reviewsSummary = await ReviewsClient.getBooksReviews(bookIds);
      const bookListDTO = new Map(booksCollection);
      const reviewsMap = {};

      reviewsSummary.forEach(bookReviews => {
        const book = bookListDTO.get(bookReviews.bookId);
        if (book) {
          if (reviewsMap[book.id]) {
            reviewsMap[book.id][bookReviews.id] = {
              headline: bookReviews.headline,
              message: bookReviews.message
            };
          } else {
            reviewsMap[book.id] = {
              [bookReviews.id]: {
                headline: bookReviews.headline,
                message: bookReviews.message
              }
            };
          }
        }
      });

      for (const [bookId, reviewsObj] of Object.entries(reviewsMap)) {
        const book = bookListDTO.get(bookId);
        if (book) {
          book.reviews = reviewsObj;
        }
      }

      return res.status(200).json([...bookListDTO.values()]);
    } catch (err) {
      console.error(err);
      return res.status(500).end();
    }
  }
}

module.exports = BooksController;
