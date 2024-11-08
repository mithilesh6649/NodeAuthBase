const db = require("../models/index");
const config = require("../config/config");
const Category = db.categories;

const helper = require('../utils/index');

//  load Validation
const {
    userValidator
} = require('../validators');



class MiscController {
    /********************* Get Categories with Pagination ********************/
    getCategories = async (req, res) => {
        try {
            // Get pagination parameters from the query string (default to page 1 and limit 10)
            const page = parseInt(req.query.page) || 1; // Default to page 1 if not provided
            const limit = parseInt(req.query.limit) || 10; // Default to limit 10 if not provided

            // Calculate offset based on current page and limit
            const offset = (page - 1) * limit;

            // Retrieve categories with pagination
            const categories = await Category.findAndCountAll({
                limit: limit, // Limit the number of records per page
                offset: offset, // Skip the first (page - 1) * limit records
                order: [
                    ['id', 'ASC']
                ] // Optional: Sort by ID in ascending order (or other fields)
            });

            // If no categories found
            if (!categories || categories.rows.length === 0) {
                let data = helper.failed(404, 'No categories found');
                return res.status(404).json(data);
            }

            // Pagination info
            const totalPages = Math.ceil(categories.count / limit); // Calculate total pages
            const currentPage = page;
            const totalItems = categories.count;
            const data = {
                categories: categories.rows, // The categories data
                pagination: {
                    totalItems: totalItems,
                    totalPages: totalPages,
                    currentPage: currentPage,
                    limit: limit
                }
            };

            // Successful response with categories data and pagination info
            let response = helper.success(200, 'Categories retrieved successfully', data);
            return res.status(200).json(response);

        } catch (e) {
            console.error('Error during category retrieval:', e); // Log the actual error to understand the issue

            let data = helper.failed(500, 'Something went wrong!');
            return res.status(500).json(data);
        }
    };
}

module.exports = new MiscController();