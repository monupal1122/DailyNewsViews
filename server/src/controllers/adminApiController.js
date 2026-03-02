const Article = require('../models/Article');
const Category = require('../models/Category');
const Subcategory = require('../models/Subcategory');
const Admin = require('../models/Admin');
const Ad = require('../models/Ads');
const { generateSlug } = require('../utils/slugGenerator');

// Dashboard Status
exports.getDashboardStats = async (req, res) => {
    try {
        const query = req.admin.role === 'admin' ? {} : { author: req.admin._id };

        const articleCount = await Article.countDocuments(query);
        const featuredCount = await Article.countDocuments({ ...query, isFeatured: true });

        const totalViewsResult = await Article.aggregate([
            { $match: query },
            { $group: { _id: null, total: { $sum: "$viewCount" } } }
        ]);
        const totalViews = totalViewsResult.length > 0 ? totalViewsResult[0].total : 0;

        // Analytics: Articles per day
        const last7Days = new Date();
        last7Days.setDate(last7Days.getDate() - 7);

        const articlesPerDay = await Article.aggregate([
            { $match: { ...query, createdAt: { $gte: last7Days } } },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        const chartData = { labels: [], data: [] };
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const dateStr = d.toISOString().split('T')[0];
            const found = articlesPerDay.find(item => item._id === dateStr);

            chartData.labels.push(d.toLocaleDateString('en-US', { weekday: 'short' }));
            chartData.data.push(found ? found.count : 0);
        }

        const topArticles = await Article.find(query)
            .select('title viewCount category')
            .populate('category', 'name')
            .sort({ viewCount: -1 })
            .limit(5);

        const latestArticles = await Article.find(query)
            .populate('category', 'name')
            .populate('author', 'name')
            .sort({ createdAt: -1 })
            .limit(5);

        res.status(200).json({
            status: 'success',
            data: {
                stats: { articleCount, featuredCount, totalViews },
                chartData,
                topArticles,
                latestArticles
            }
        });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

// Article Management
exports.getAllArticles = async (req, res) => {
    try {
        const query = req.admin.role === 'admin' ? {} : { author: req.admin._id };
        const articles = await Article.find(query)
            .populate('category author')
            .sort({ createdAt: -1 });
        res.status(200).json({ status: 'success', data: articles });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

// Category Management
exports.getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find().sort({ name: 1 });
        res.status(200).json({ status: 'success', data: categories });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

exports.createCategory = async (req, res) => {
    try {
        const { name, slug, description, status } = req.body;
        const category = await Category.create({
            name,
            slug: slug || generateSlug(name),
            description,
            status: status || 'active'
        });
        res.status(201).json({ status: 'success', data: category });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

exports.updateCategory = async (req, res) => {
    try {
        const updateData = { ...req.body };
        if (updateData.name && !updateData.slug) {
            updateData.slug = generateSlug(updateData.name);
        }
        const category = await Category.findByIdAndUpdate(req.params.id, updateData, { new: true });
        res.status(200).json({ status: 'success', data: category });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

exports.deleteCategory = async (req, res) => {
    try {
        await Category.findByIdAndDelete(req.params.id);
        res.status(200).json({ status: 'success', message: 'Category deleted' });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

// Subcategory Management
exports.getAllSubcategories = async (req, res) => {
    try {
        const query = {};
        if (req.query.category) query.category = req.query.category;
        const subcategories = await Subcategory.find(query).populate('category', 'name').sort({ name: 1 });
        res.status(200).json({ status: 'success', data: subcategories });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

exports.createSubcategory = async (req, res) => {
    try {
        const { name, category, description, status } = req.body;
        const subcategory = await Subcategory.create({
            name,
            slug: req.body.slug || generateSlug(name),
            category,
            description,
            status: status || 'active'
        });
        res.status(201).json({ status: 'success', data: subcategory });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

exports.updateSubcategory = async (req, res) => {
    try {
        const updateData = { ...req.body };
        if (updateData.name && !updateData.slug) {
            updateData.slug = generateSlug(updateData.name);
        }
        const subcategory = await Subcategory.findByIdAndUpdate(req.params.id, updateData, { new: true });
        res.status(200).json({ status: 'success', data: subcategory });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

exports.deleteSubcategory = async (req, res) => {
    try {
        await Subcategory.findByIdAndDelete(req.params.id);
        res.status(200).json({ status: 'success', message: 'Subcategory deleted' });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

// Author Management
exports.getAllAuthors = async (req, res) => {
    try {
        // We use +password to include the field that is select: false by default
        const authors = await Admin.find().select('+password').sort({ name: 1 }).lean();

        const authorsWithStats = await Promise.all(authors.map(async (author) => {
            const count = await Article.countDocuments({ author: author._id });
            return {
                ...author,
                articleCount: count,
                hasPassword: !!author.password
            };
        }));

        res.status(200).json({ status: 'success', data: authorsWithStats });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

exports.createAuthor = async (req, res) => {
    try {
        const { name, email, password, role, bio } = req.body;
        const author = await Admin.create({ name, email, password, role, bio });
        res.status(201).json({ status: 'success', data: author });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

exports.updateAuthor = async (req, res) => {
    try {
        const { name, role, bio, password } = req.body;
        const author = await Admin.findById(req.params.id);

        if (!author) return res.status(404).json({ status: 'error', message: 'Author not found' });

        if (name) author.name = name;
        if (role) author.role = role;
        if (bio !== undefined) author.bio = bio;

        // Only update password if a new one is provided
        if (password && password.trim() !== '') {
            author.password = password;
        }

        await author.save();
        res.status(200).json({ status: 'success', data: author });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

exports.deleteAuthor = async (req, res) => {
    try {
        await Admin.findByIdAndDelete(req.params.id);
        res.status(200).json({ status: 'success', message: 'Author deleted' });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

// Profile / Me
exports.getMe = (req, res) => {
    res.status(200).json({
        status: 'success',
        data: {
            user: {
                id: req.admin._id,
                name: req.admin.name,
                email: req.admin.email,
                role: req.admin.role,
                bio: req.admin.bio,
                profileImage: req.admin.profileImage,
                socialLinks: req.admin.socialLinks
            }
        }
    });
};

exports.updateMe = async (req, res) => {
    try {
        const updateData = {
            name: req.body.name,
            email: req.body.email,
            bio: req.body.bio,
            socialLinks: req.body.socialLinks ? JSON.parse(req.body.socialLinks) : undefined
        };

        if (req.file) {
            updateData.profileImage = req.file.path;
        }

        const admin = await Admin.findByIdAndUpdate(req.admin._id, updateData, { new: true, runValidators: true });

        res.status(200).json({
            status: 'success',
            data: {
                user: {
                    id: admin._id,
                    name: admin.name,
                    email: admin.email,
                    role: admin.role,
                    bio: admin.bio,
                    profileImage: admin.profileImage,
                    socialLinks: admin.socialLinks
                }
            }
        });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

exports.getArticleById = async (req, res) => {
    try {
        const article = await Article.findById(req.params.id).populate('category author subcategories');
        if (!article) return res.status(404).json({ status: 'error', message: 'Article not found' });

        // Ownership check
        if (req.admin.role !== 'admin' && article.author.toString() !== req.admin._id.toString()) {
            return res.status(403).json({ status: 'error', message: 'Not authorized' });
        }

        res.status(200).json({ status: 'success', data: article });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

// Ads Management
exports.getAllAds = async (req, res) => {
    try {
        const query = req.admin.role === 'admin' ? {} : { author: req.admin._id };
        const ads = await Ad.find(query).sort({ createdAt: -1 });
        res.status(200).json({ status: 'success', data: ads });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

exports.getAdById = async (req, res) => {
    try {
        const ad = await Ad.findById(req.params.id);
        if (!ad) return res.status(404).json({ status: 'error', message: 'Ad not found' });

        if (req.admin.role !== 'admin' && ad.author?.toString() !== req.admin._id.toString()) {
            return res.status(403).json({ status: 'error', message: 'Not authorized' });
        }

        res.status(200).json({ status: 'success', data: ad });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
}

exports.createAd = async (req, res) => {
    try {
        const { title, type, location, status, startDate, endDate, link } = req.body;
        const ad = await Ad.create({
            title,
            type,
            location,
            status,
            startDate,
            endDate,
            link,
            author: req.admin._id,
            image: req.file ? req.file.path : undefined
        });
        res.status(201).json({ status: 'success', data: ad });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

exports.updateAd = async (req, res) => {
    try {
        const ad = await Ad.findById(req.params.id);
        if (!ad) return res.status(404).json({ status: 'error', message: 'Ad not found' });

        if (req.admin.role !== 'admin' && ad.author?.toString() !== req.admin._id.toString()) {
            return res.status(403).json({ status: 'error', message: 'Not authorized' });
        }

        const updateData = { ...req.body };
        if (req.file) updateData.image = req.file.path;

        const updatedAd = await Ad.findByIdAndUpdate(req.params.id, updateData, { new: true });
        res.status(200).json({ status: 'success', data: updatedAd });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

exports.deleteAd = async (req, res) => {
    try {
        const ad = await Ad.findById(req.params.id);
        if (!ad) return res.status(404).json({ status: 'error', message: 'Ad not found' });

        if (req.admin.role !== 'admin' && ad.author?.toString() !== req.admin._id.toString()) {
            return res.status(403).json({ status: 'error', message: 'Not authorized' });
        }

        await Ad.findByIdAndDelete(req.params.id);
        res.status(200).json({ status: 'success', message: 'Ad deleted' });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};
