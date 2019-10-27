const booksDatabase = new Map();

class Repository {
  static insert(object) {
    if (object === null || typeof object !== "object") {
      return false;
    }

    if (!object.hasOwnProperty("id")) {
      return false;
    }

    booksDatabase.set(object.id, object);
  }

  static delete(key, value) {
    if (key && !value) {
      booksDatabase.delete(key);
    }

    if (key && value) {
      booksDatabase.forEach((object, mapKey) => {
        if (object.hasOwnProperty(key) && object[key] === value) {
          booksDatabase.delete(mapKey);
        }
      });
    }
  }

  static findAll() {
    return booksDatabase;
  }

  static findBy(key, value) {
    const results = new Map();

    booksDatabase.forEach(object => {
      if (object.hasOwnProperty(key) && object[key] === value) {
        results.set(object.id, object);
      }
    });

    return results;
  }
}

module.exports = Repository;
