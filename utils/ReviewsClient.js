const axios = require("axios");
const config = require("../config/index");

class ReviewsClient {
  static async getBooksStatistics(bookIds = []) {
    const reviewsSummaryEndpoint = `${config.reviewsServiceBaseURL}/stats`;
    try {
      const response = await axios.get(reviewsSummaryEndpoint, {
        params: {
          bookId: [...bookIds]
        },
        responseType: "json"
      });

      return response.data;
    } catch (err) {
      return [];
    }
  }

  static async getAllBooksStatistics() {
    const reviewsSummaryEndpoint = `${config.reviewsServiceBaseURL}/stats`;
    try {
      const response = await axios.get(reviewsSummaryEndpoint, {
        responseType: "json"
      });

      return response.data;
    } catch (err) {
      return [];
    }
  }

  static async getBooksReviews(bookIds = []) {
    const reviewsSummaryEndpoint = `${config.reviewsServiceBaseURL}/reviews`;
    try {
      const response = await axios.get(reviewsSummaryEndpoint, {
        params: {
          bookId: [...bookIds]
        },
        responseType: "json"
      });

      return response.data;
    } catch (err) {
      return [];
    }
  }
}

module.exports = ReviewsClient;
