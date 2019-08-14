const { checkSchema } = require('express-validator');

module.exports = checkSchema({
    searchValue: {
        in: ['query'],
        errorMessage: 'searchTerm is required or it is misspelled',
        optional: false,
        isString: true
    },
    pageIndex: {
        in: ['query'],
        errorMessage: 'values for query `page` is not correct. should be a number',
        optional: true,
        isInt: true,
        toInt: true
    },
    bedroomsCount: {
        in: ['query'],
        errorMessage: 'values for query `bedrooms` is not correct. should be a number',
        optional: true,
        isInt: true,
        toInt: true
    },
    maxCount: {
        in: ['query'],
        errorMessage: 'values for query `limit` is not correct. should be a number',
        optional: true,
        isInt: true,
        toInt: true
    },
    sortingOrder: {
        in: ['query'],
        optional: true,
        matches: {
            options: [/\b(?:desc|asc)\b/],
            errorMessage: 'Invalid query `order` value. should be `asc` or `desc`'
        }
    },
})