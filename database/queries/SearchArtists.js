const Artist = require('../models/artist');

/**
 * Searches through the Artist collection
 * @param {object} criteria An object with a name, age, and yearsActive
 * @param {string} sortProperty The property to sort the results by
 * @param {integer} offset How many records to SKIP in the result set
 * @param {integer} limit How many records to return in the result set
 * @return {promise} A promise that resolves with the artists, count, offset, and limit
 * like this: { all: [artists], count: count, offset: offset, limit: limit }
 */

 // the values of offset and limit are default values
module.exports = (criteria, sortProperty, offset = 0, limit = 20) => {

  const query = Artist.find(buildQuery(criteria))
  /*
  We add a property to an object, not an array. This is es6, same as:
  - const sortOrderandProperty = {};
  - sortOrderandProperty[sortProperty] = 1;
  .- sort(sortOrder)
  */
  .sort({ [sortProperty]: 1 })
  // offset default value is 0 but can change
  .skip(offset)
  .limit(limit);

// count refers to the amount of artists that match the search criterea
  return Promise.all([query, Artist.find(buildQuery(criteria)).count()])
  .then((results) => {
    return {
      all: results[0],
      count: results[1],
      offset: offset,
      limit: limit
    };
  });
};

  // by default age and yearsActive is not included in the criteria
const buildQuery = (criteria) => {
  const query = {};

  if (criteria.name) {
    query.$text = { $search: criteria.name };
  }

  if (criteria.age) {
    query.age = {
      // $gte only gets artists that have an age that is higher or equal to the included value
      $gte: criteria.age.min,
        // $lte only gets artists that have an age that is lower or equal to the included value
      $lte: criteria.age.max
    };
  }

  if (criteria.yearsActive) {
    query.yearsActive = {
      $gte: criteria.yearsActive.min,
      $lte: criteria.yearsActive.max
    };
  }

  return query;
};
