const db = require("../models/index");
const {
    Op
} = require("sequelize");
const config = require("../config/config");
const User = db.users;
const UserCategory = db.user_categories;
const UserDetail = db.user_details;
const Category = db.categories;
const UserSubcategory = db.user_subcategories;
const UserTiming = db.user_timings;
const UserMenu = db.user_menus;
const UserMenuItem = db.user_menu_items;
const UserMenuItemImage = db.user_menu_item_images;



const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const helper = require("../utils/index");
const {
    sendVerificationEmail,
    sendPasswordResetEmail
} = require("../utils/mailer");
const fs = require("fs");
const path = require("path");
const {
    saveUploadedFile
} = require("../utils/upload");

// Load Validation
const {
    userValidator
} = require("../validators");

const generateAccessToken = async (user) => {
    const token = jwt.sign(user, config.JWT_SECRET_KEY, {
        expiresIn: "24h"
    });
    return token;
};

class VendorController {
    // Add Menu
    addMenus = async (req, res) => {
        const transaction = await db.sequelize.transaction(); // Start a transaction

        try {
            // Destructure fields from the request
            const {
                category_id,
                title,
                description
            } = req.fields;

            // Validate required fields
            if (!category_id || !title || !description) {
                return res.status(400).json(helper.failed(400, "Missing required fields"));
            }

            // Create a new menu item in the database
            const userMenu = await UserMenu.create({
                category_id,
                title,
                description,
                user_id: req.user.user.id // Example user_id (should be dynamic based on logged-in user)
            }, {
                transaction
            });

            // Commit transaction
            await transaction.commit();

            // Return success response including created menu item
            return res.status(201).json(helper.success(201, "Menu added successfully", {
                userMenu
            }));
        } catch (e) {
            await transaction.rollback(); // Rollback transaction on error
            console.error("Error during adding menu item:", e);
            return res.status(500).json(helper.failed(500, "Something went wrong!"));
        }
    };

    // Add Menu Item
    addMenuItem = async (req, res) => {
        console.log('dsfds');
        const transaction = await db.sequelize.transaction(); // Start a transaction

        try {
            // Destructure fields from the request
            const {
                category_id,
                title,
                description,
                item_type,
                is_gluten_free,
                price
            } = req.fields;

            // Validate required fields
            if (!category_id || !title || !description || !item_type || !price) {
                return res.status(400).json(helper.failed(400, "Missing required fields"));
            }

            // Create new menu item in the database
            const newMenuItem = await UserMenuItem.create({
                category_id,
                title,
                description,
                item_type,
                is_gluten_free,
                price,
                user_id: req.user.user.id // Example user_id (should be dynamic based on logged-in user)
            }, {
                transaction
            });

            // Directory for image uploads
            const targetDir = path.join(__dirname, "..", "public", "images", "menu_items");
            const options = {
                maxSize: 50 * 1024 * 1024, // 50MB size limit
                allowedTypes: ["image/jpeg", "image/jpg", "image/png", "image/gif"],
            };

            let imageCount = 0;

            // Process images if present
            if (req.files && req.files.item_images && req.files.item_images.length > 0) {
                const imagePromises = req.files.item_images.map(async (file) => {
                    // Generate image URL
                    const imageUrl = `/images/menu_items/${file.name}`;

                    // Save the uploaded file
                    await saveUploadedFile(file, targetDir, options);

                    // Create the image record in the database
                    const newImage = await UserMenuItemImage.create({
                        user_menu_item_id: newMenuItem.id,
                        image: imageUrl,
                        status: 1, // Active status
                    }, {
                        transaction
                    });

                    // Increment image count if image is added successfully
                    if (newImage) {
                        imageCount++;
                    }
                });

                // Wait for all images to be processed
                await Promise.all(imagePromises);
            }

            // Commit transaction
            await transaction.commit();

            // Return success response including image count
            return res.status(201).json(
                helper.success(201, "Menu item added successfully", {
                    newMenuItem,
                    imageCount,
                })
            );
        } catch (e) {
            await transaction.rollback(); // Rollback transaction on error
            console.error("Error during adding menu item:", e);
            return res.status(500).json(helper.failed(500, "Something went wrong!"));
        }
    };


    getMenuList = async (req, res) => {
        try {
            // Get pagination parameters from the query string (default to page 1 and limit 10)
            const page = parseInt(req.query.page) || 1; // Default to page 1 if not provided
            const limit = parseInt(req.query.limit) || 10; // Default to limit 10 if not provided

            // Calculate offset based on current page and limit
            const offset = (page - 1) * limit;

            // Retrieve user menus with pagination and relations to User and Category
            const usermenus = await UserMenu.findAndCountAll({
                limit: limit, // Limit the number of records per page
                offset: offset, // Skip the first (page - 1) * limit records
                order: [
                    ['id', 'ASC']
                ],
                include: [{
                        model: User, // Include the User model
                        as: 'user', // Alias defined in the UserMenus model
                        required: false, // Set to false to allow UserMenus without a related User
                        //  attributes: ['id', 'name'], // You can choose the fields you want to include for the user
                    },
                    {
                        model: Category, // Include the Category model
                        as: 'category', // Alias defined in the UserMenus model
                        required: false, // Set to false to allow UserMenus without a related Category
                        //  attributes: ['id', 'name'], // You can choose the fields you want to include for the category
                    },
                    {
                        model: UserMenuItem, // Include the Category model
                        as: 'user_menu_items', // Alias defined in the UserMenus model
                        required: false, // Set to false to allow UserMenus without a related Category
                        //  attributes: ['id', 'name'], // You can choose the fields you want to include for the category
                    }
                ],
                where: {
                    user_id: req.user.user.id // Filter by user_id from the authenticated user
                }
            });

            // If no usermenus found
            if (!usermenus || usermenus.rows.length === 0) {
                let data = helper.failed(404, 'No user menus found');
                return res.status(404).json(data);
            }

            // Pagination info
            const totalPages = Math.ceil(usermenus.count / limit); // Calculate total pages
            const currentPage = page;
            const totalItems = usermenus.count;
            const data = {
                usermenus: usermenus.rows, // The user menus data
                pagination: {
                    totalItems: totalItems,
                    totalPages: totalPages,
                    currentPage: currentPage,
                    limit: limit
                }
            };

            // Successful response with user menus data and pagination info
            let response = helper.success(200, 'User menus retrieved successfully', data);
            return res.status(200).json(response);

        } catch (e) {
            console.error('Error during user menu retrieval:', e); // Log the actual error to understand the issue

            let data = helper.failed(500, 'Something went wrong!');
            return res.status(500).json(data);
        }
    };

    getMenuItemList = async (req, res) => {
        try {
            // Get pagination parameters from the query string (default to page 1 and limit 10)
            const page = parseInt(req.query.page) || 1; // Default to page 1 if not provided
            const limit = parseInt(req.query.limit) || 10; // Default to limit 10 if not provided

            // Calculate offset based on current page and limit
            const offset = (page - 1) * limit;

            // Retrieve user menus with pagination and relations to User and Category
            const usermenus = await UserMenuItem.findAndCountAll({
                limit: limit, // Limit the number of records per page
                offset: offset, // Skip the first (page - 1) * limit records
                order: [
                    ['id', 'ASC']
                ],
                where: {
                    user_menu_id: 1 // Filter by user_id from the authenticated user
                },
                include: [{
                    model: UserMenuItemImage, // Include the User model
                    // as: 'user', // Alias defined in the UserMenus model
                    required: false, // Set to false to allow UserMenus without a related User
                    //  attributes: ['id', 'name'], // You can choose the fields you want to include for the user
                }],

            });

            // If no usermenus found
            if (!usermenus || usermenus.rows.length === 0) {
                let data = helper.failed(404, 'No user menus found');
                return res.status(404).json(data);
            }

            // Pagination info
            const totalPages = Math.ceil(usermenus.count / limit); // Calculate total pages
            const currentPage = page;
            const totalItems = usermenus.count;
            const data = {
                usermenus: usermenus.rows, // The user menus data
                pagination: {
                    totalItems: totalItems,
                    totalPages: totalPages,
                    currentPage: currentPage,
                    limit: limit
                }
            };

            // Successful response with user menus data and pagination info
            let response = helper.success(200, 'User menus retrieved successfully', data);
            return res.status(200).json(response);

        } catch (e) {
            console.error('Error during user menu retrieval:', e); // Log the actual error to understand the issue

            let data = helper.failed(500, 'Something went wrong!');
            return res.status(500).json(data);
        }
    };

}

module.exports = new VendorController();