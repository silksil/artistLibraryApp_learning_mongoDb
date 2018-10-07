const Artist = require('../models/artist');

/**
 * Sets a group of Artists as retired
 * @param {array} _ids - An array of the _id's of of artists to update
 * @return {promise} A promise that resolves after the update
 */
module.exports = (_ids) => {
  return Artist.update(
    // look at id's and if the id is in the list of arguments
    { _id: { $in: _ids } },
    // update the status to true
    { retired: true },
    // To update in bulk, you have to pass `multi` as true. By default it is false
    { multi: true }
  );
};
