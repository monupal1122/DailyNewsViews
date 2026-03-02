const express = require('express');
const router = express.Router();
const adminApiController = require('../controllers/adminApiController');
const adminController = require('../controllers/adminController'); // Re-using some logic
const articleController = require('../controllers/articleController');
const { protectAdmin, restrictTo } = require('../middlewares/authMiddleware');
const { upload } = require('../config/cloudinary');

// General
router.use(protectAdmin);

router.get('/dashboard', adminApiController.getDashboardStats);
router.get('/me', adminApiController.getMe);
router.put('/me', upload.single('image'), adminApiController.updateMe);

// Articles
router.get('/articles', adminApiController.getAllArticles);
router.get('/articles/:id', adminApiController.getArticleById);
router.post('/articles', upload.single('image'), articleController.createArticle);
router.post('/articles/:id', upload.single('image'), articleController.updateArticle);
router.delete('/articles/:id', articleController.deleteArticle);

// AI Helpers
router.post('/articles/suggest-tags', adminController.suggestTags);
router.post('/articles/generate-slug', adminController.generateSlugAPI);

// Categories
router.get('/categories', adminApiController.getAllCategories);
router.post('/categories', restrictTo('admin', 'author'), adminApiController.createCategory);
router.put('/categories/:id', restrictTo('admin'), adminApiController.updateCategory);
router.delete('/categories/:id', restrictTo('admin'), adminApiController.deleteCategory);

// Subcategories
router.get('/subcategories', adminApiController.getAllSubcategories);
router.post('/subcategories', restrictTo('admin', 'author'), adminApiController.createSubcategory);
router.put('/subcategories/:id', restrictTo('admin'), adminApiController.updateSubcategory);
router.delete('/subcategories/:id', restrictTo('admin'), adminApiController.deleteSubcategory);

// Author Management (Admin only)
router.get('/authors', restrictTo('admin'), adminApiController.getAllAuthors);
router.post('/authors', restrictTo('admin'), adminApiController.createAuthor);
router.put('/authors/:id', restrictTo('admin'), adminApiController.updateAuthor);
router.delete('/authors/:id', restrictTo('admin'), adminApiController.deleteAuthor);

// Ads Management
router.get('/ads', adminApiController.getAllAds);
router.get('/ads/:id', adminApiController.getAdById);
router.post('/ads', upload.single('image'), adminApiController.createAd);
router.put('/ads/:id', upload.single('image'), adminApiController.updateAd);
router.delete('/ads/:id', adminApiController.deleteAd);

module.exports = router;
