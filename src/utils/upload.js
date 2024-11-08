const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

/**
 * Save an uploaded image to the server.
 * 
 * @param {Object} file - The uploaded file object from `req.files`.
 * @param {String} targetDir - The directory where the image should be saved.
 * @param {Object} options - Options to customize validation (e.g., max file size, allowed types).
 * @returns {Promise<String>} - Returns a promise with the saved file path or an error message.
 */
function saveUploadedFile(file, targetDir, options = {}) {
    return new Promise((resolve, reject) => {
        // Validation

        // 1. Check if the file exists
        if (!file) {
            return reject('No file uploaded.');
        }

        // 2. Validate file type
        const allowedTypes = options.allowedTypes || ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
        const mimeType = file.type;
        console.log('Uploaded file MIME type:', file.type);
        if (!allowedTypes.includes(mimeType)) {
            return reject('Invalid file type. Only JPG, PNG, and GIF are allowed.');
        }

        // 3. Validate file size (limit: 5MB by default)
        const maxSize = options.maxSize || 5 * 1024 * 1024; // 5MB default size limit
        const fileSize = file.size;

        if (fileSize > maxSize) {
            return reject('File is too large. Maximum size allowed is 5MB.');
        }

        // Ensure the target directory exists
        const dirPath = path.join(__dirname, "../../" + targetDir);

        // Check if the directory exists and create it if it doesn't
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath, {
                recursive: true
            });
        }

        // Read the uploaded file data
        const rawData = fs.readFileSync(file.tempFilePath || file.path);

        // Get the file extension from the MIME type
        let ext = mimeType.split("/")[1];

        // Generate a new filename based on the current time and random string
        let randomString = crypto.randomBytes(6).toString('hex'); // Generates a 12-character random string
        let filename = "Node" + new Date().getTime() + "_" + randomString + "." + ext;

        // Define the new file path
        const newPath = path.join(dirPath, filename);

        // Write the file to the new location
        fs.writeFile(newPath, rawData, (err) => {
            if (err) {
                return reject('Error writing the file: ' + err);
            }
            //  resolve(newPath); // Return the new file path if successful
            const fileUrl = `/public/images/${filename}`;
            resolve(fileUrl); // Return the relative URL
        });
    });
}

module.exports = {
    saveUploadedFile
};