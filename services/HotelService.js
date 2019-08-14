'use strict';

const filter = require('lodash/filter');
const isUndefined = require('lodash/isUndefined');
const get = require('lodash/get');
const isEmpty = require('lodash/isEmpty');
const lowerCase = require('lodash/lowerCase');

const { DEFAULT_PAGE_INDEX, DEFAULT_PAGE_LIMIT } = require('../constants/hotels.constants');

class HotelServices {
    constructor() {
        this._find = this._find.bind(this);
        this._filterBedrooms = this._filterBedrooms.bind(this);
        this._paginate = this._paginate.bind(this);
        this._sort = this._sortPrice.bind(this);
        this.buildList = this.buildList.bind(this);
    }

    _find(dataToSearch, searchValue, getSearchTermFromResults) {
        if(searchValue !== getSearchTermFromResults) {
            return {};
        }

        const { listings, pageTitle } = dataToSearch;
        return {
            listings,
            pageTitle,
            totalRecords: listings.length
        };
    }

    _filterBedrooms({ listings, pageTitle, totalRecords }, bedroomsCount) {
        const updatedListing = filter(listings, (value, index) => value.bedrooms === bedroomsCount);
        return {
            listings: updatedListing,
            pageTitle,
            totalRecords: updatedListing.length
        }
    }

    _paginate({ listings, pageTitle, totalRecords }, pageIndex, limit) {
        const totalListings = listings.length;
        const getMinIndex = totalListings <= pageIndex * limit ? 0 : pageIndex * limit;
        const getMaxIndex = (pageIndex + 1) * limit;

        const updatedListing = filter(listings, (value, index) => index >= getMinIndex && index < getMaxIndex)
        return {
            listings: updatedListing,
            pageTitle,
            totalRecords
        }
    }

    _sortPrice({ listings, pageTitle, totalRecords }, sortingOrder) {
        return {
            listings: sortingOrder === 'desc' ? 
                listings.sort((a, b) => get(b, 'averagePrice.value', 0) - get(a, 'averagePrice.value', 0)) :
                listings.sort((a, b) => get(a, 'averagePrice.value', 0) - get(b, 'averagePrice.value', 0)),   
            pageTitle,
            totalRecords
        }
    }

    buildList(dataToSearch, req) {
        try {
            const searchValue = lowerCase(req.sanitize(req.query.searchValue));
            const getSearchValueFromResults = lowerCase(get(dataToSearch, 'searchTerm.name'));
    
            let dataFound = this._find(dataToSearch, searchValue, getSearchValueFromResults);
            if (isEmpty(dataFound)) {
                return {};
            } 

            const bedroomsToFind = !isUndefined(req.sanitize(req.query.bedroomsCount));
            if (bedroomsToFind) {
                dataFound = this._filterBedrooms(dataFound, parseInt(req.sanitize(req.query.bedroomsCount)));
            }
    
            const searchPage = isUndefined(req.sanitize(req.query.pageIndex)) ? DEFAULT_PAGE_INDEX : parseInt(req.sanitize(req.query.pageIndex));
            const searchLimit = isUndefined(req.sanitize(req.query.maxCount)) ? DEFAULT_PAGE_LIMIT : parseInt(req.sanitize(req.query.maxCount));
    
            const paginatedResults = this._paginate(dataFound, searchPage, searchLimit);
    
            const sortingOrder = req.sanitize(req.query.sortingOrder);
    
            return sortingOrder ? this._sortPrice(paginatedResults, sortingOrder) : paginatedResults;
        } catch(err) {
            throw new Error(err);
        }

    }
};


module.exports = new HotelServices();