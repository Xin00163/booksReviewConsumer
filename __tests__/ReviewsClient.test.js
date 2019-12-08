const ReviewsClient = require("../utils/ReviewsClient");
const { Pact, Matchers } = require("@pact-foundation/pact");

const CONSUMER = "Books";
const PROVIDER = "Reviews";
const MOCK_PROVIDER_PORT = 3002;

describe("Reviews clinet tests", () => {
  let provider;
  beforeAll(async () => {
    provider = new Pact({
      consumer: CONSUMER,
      provider: PROVIDER,
      port: MOCK_PROVIDER_PORT,
      log: process.cwd() + "/logs/pact.log",
      dir: process.cwd() + "/pacts",
      logLevel: "INFO",
      spec: 2
    });

    await provider.setup();
  });

  test("should receive the review statistics for specific books", async () => {
    await provider.addInteraction({
      state: "has book statistics",
      uponReceiving: "a request for all books stats summary",
      withRequest: {
        method: "GET",
        path: "/stats"
      },
      willRespondWith: {
        status: 200,
        headers: { "Content-Type": "application/json; charset=utf-8" },
        body: Matchers.eachLike({
          id: Matchers.like("1"),
          totalReviews: Matchers.like(100),
          averageRating: Matchers.like(7.5)
        })
      }
    });
    const result = await ReviewsClient.getAllBooksStatistics();
    expect(result.length).toEqual(1);
    await expect(provider.verify()).resolves.toBeTruthy();
  });

  test("should handle a request that responds with no stats summary", async () => {
    await provider.addInteraction({
      state: "Has no interaction",
      uponReceiving: "a request for book statistics",
      withRequest: {
        method: "GET",
        path: "/stats"
      },
      willRespondWith: {
        status: 404
      }
    });
    const result = await ReviewsClient.getAllBooksStatistics();
    expect(result.length).toEqual(0);
    await expect(provider.verify()).resolves.toBeTruthy();
  });

  test("should receive a request for a book review summary", async () => {
    await provider.addInteraction({
      state: "has reviews",
      uponReceiving: "a request for book reviews summary",
      withRequest: {
        method: "GET",
        path: "/reviews",
        query: {
          "bookId[]": Matchers.eachLike("1")
        }
      },
      willRespondWith: {
        status: 200,
        headers: { "Content-Type": "application/json; charset=utf-8" },
        body: Matchers.eachLike({
          bookId: "1",
          headline: Matchers.like("a wonderful story"),
          message: Matchers.like("It is so intriguing"),
          ipAddress: Matchers.ipv4Address(),
          gender: Matchers.term({
            matcher: "F|M",
            generate: "F"
          }),
          anonymous: Matchers.boolean(),
          createdAt: Matchers.iso8601DateTimeWithMillis()
        })
      }
    });
    const result = await ReviewsClient.getBooksReviews([1]);
    expect(result.length).toEqual(1);
    await expect(provider.verify()).resolves.toBeTruthy();
  });

  test("should handle a request which responds with no review summary", async () => {
    await provider.addInteraction({
      state: "Has no interaction",
      uponReceiving: "a request for books review",
      withRequest: {
        method: "GET",
        path: "/reviews",
        query: {
          "bookId[]": Matchers.eachLike("1")
        }
      },
      willRespondWith: {
        status: 404
      }
    });
    const result = await ReviewsClient.getBooksReviews([1]);
    expect(result.length).toEqual(0);
    await expect(provider.verify()).resolves.toBeTruthy();
  });

  afterAll(async () => {
    await provider.finalize();
  });
});
