const cloudinary = require('cloudinary').v2;
const logger = require('../utils/logger');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

/**
 * Upload a file to Cloudinary
 * @param {Buffer} fileBuffer - The file buffer to upload
 * @param {string} folder - The folder to upload to
 * @param {Object} options - Additional upload options
 * @returns {Promise<Object>} Cloudinary upload response
 */
const uploadFile = async (fileBuffer, folder, options = {}) => {
  try {
    // Convert buffer to base64
    const base64File = fileBuffer.toString('base64');
    const dataURI = `data:${options.contentType || 'image/jpeg'};base64,${base64File}`;

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(dataURI, {
      folder,
      resource_type: 'auto',
      ...options
    });

    return {
      url: result.secure_url,
      publicId: result.public_id,
      format: result.format,
      width: result.width,
      height: result.height,
      size: result.bytes
    };
  } catch (error) {
    logger.error('Error uploading file to Cloudinary:', error);
    throw new Error('Failed to upload file');
  }
};

/**
 * Upload an image with transformations
 * @param {Buffer} imageBuffer - The image buffer to upload
 * @param {string} folder - The folder to upload to
 * @param {Object} transformations - Image transformations
 * @returns {Promise<Object>} Cloudinary upload response
 */
const uploadImage = async (imageBuffer, folder, transformations = {}) => {
  try {
    const options = {
      contentType: 'image/jpeg',
      transformation: [
        {
          quality: 'auto:good',
          fetch_format: 'auto',
          ...transformations
        }
      ]
    };

    return await uploadFile(imageBuffer, folder, options);
  } catch (error) {
    logger.error('Error uploading image to Cloudinary:', error);
    throw new Error('Failed to upload image');
  }
};

/**
 * Upload a document
 * @param {Buffer} docBuffer - The document buffer to upload
 * @param {string} folder - The folder to upload to
 * @param {string} format - The document format (pdf, doc, etc.)
 * @returns {Promise<Object>} Cloudinary upload response
 */
const uploadDocument = async (docBuffer, folder, format) => {
  try {
    const options = {
      contentType: `application/${format}`,
      resource_type: 'raw'
    };

    return await uploadFile(docBuffer, folder, options);
  } catch (error) {
    logger.error('Error uploading document to Cloudinary:', error);
    throw new Error('Failed to upload document');
  }
};

/**
 * Delete a file from Cloudinary
 * @param {string} publicId - The public ID of the file to delete
 * @returns {Promise<Object>} Cloudinary deletion response
 */
const deleteFile = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    logger.error('Error deleting file from Cloudinary:', error);
    throw new Error('Failed to delete file');
  }
};

/**
 * Generate a signed URL for a file
 * @param {string} publicId - The public ID of the file
 * @param {Object} options - URL generation options
 * @returns {string} Signed URL
 */
const generateSignedUrl = (publicId, options = {}) => {
  try {
    const signedUrl = cloudinary.url(publicId, {
      secure: true,
      sign_url: true,
      ...options
    });

    return signedUrl;
  } catch (error) {
    logger.error('Error generating signed URL:', error);
    throw new Error('Failed to generate signed URL');
  }
};

module.exports = {
  uploadFile,
  uploadImage,
  uploadDocument,
  deleteFile,
  generateSignedUrl
}; 