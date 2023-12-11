class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  checkForPaginationQuery = () => {
    // making the response skip 3 documents and limit the output to 10 documents/page
    // query = query.skip(3).limit(4);
    const page = this.queryString.page * 1 || 1; // getting the page of the sent by user and if he didnt send any make the defualt value is 1
    const limit = this.queryString.limit * 1 || 1000; // setting the defualt limit to 1000 whenever the limit is not specified
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);

    return this;
  };

  checkForFieldQuery = () => {
    if (this.queryString.fields) {
      // getting the limiters for showing only few vars in the response
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      // remove the "__V" paramter and the "-" means remove/reverse
      this.query = this.query.select('-__v,-password');
    }
    return this;
  };

  checkForSortingQuery = () => {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      // sort the query response by the value thats been hold by the sort key
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt');
    }
    return this;
  };

  filteringQueryHandler = () => {
    const queryObj = { ...this.queryString }; // making a new object that equalls the queries as JS when assigning makes only a refrence not a copy
    const excludedFields = ['page', 'sort', 'limit', 'fields']; // removing the special queries
    excludedFields.forEach((el) => delete queryObj[el]); // iterating over the query params and removing the special queries from it
    let queryString = JSON.stringify(queryObj);
    // making a regular expression to match the exact ("\b" means to look for the same word not a subset of another word) word from the query
    // (g in the end) means that it may happen multiple times and when it happens we need to convert all of them
    // when theres a "match" we replace it with the "$" and concated with it the same item that was matched
    queryString = queryString.replace(
      /\b(gte|gt|lte|lt)\b/g,
      (match) => `$${match}`
    );
    this.query = this.query.find(JSON.parse(queryString));
    return this;
  };

  removeSpecialQueries = () => {
    return queryObj;
  };
}

module.exports = APIFeatures;