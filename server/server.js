require('dotenv').config();
const express = require('express');
const path = require('path');
const helmet = require('helmet');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const flash = require('connect-flash');

// Modules & Config
const connectDB = require('./src/config/db');
const { connectRedis } = require('./src/config/redis');
const Admin = require('./src/models/Admin');
const passport = require('./src/config/passport');
const apiRoutes = require('./src/routes/apiRoutes');
const adminApiRoutes = require('./src/routes/adminApiRoutes');

// Global Error Handlers for Production Stability
process.on('uncaughtException', (err) => {
    console.error('!!! UNCAUGHT EXCEPTION !!!');
    console.error(err);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('!!! UNHANDLED REJECTION !!!');
    console.error(reason);
});

const app = express();
// USE THE PORT HOSTINGER GIVES US, OR FALLBACK TO 5000
const PORT = process.env.PORT || 5000;

console.log('--- SYSTEM STACK ---');
console.log(`Node Version: ${process.version}`);
console.log(`Port Assigned: ${PORT}`);
console.log(`Environment: ${process.env.NODE_ENV}`);
console.log('--------------------');

// 1. Set View Engine (Adjusted path for root)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src/views'));

// 2. Middlewares
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps or curl)
        if (!origin) return callback(null, true);
        const allowedOrigins = [
            'http://localhost:8081',
            'http://localhost:8082',
            'http://localhost:5173',
            'http://127.0.0.1:8081',
            'http://127.0.0.1:8082',
            'http://127.0.0.1:5173',
            'http://localhost:3000'
        ];
        if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV === 'development') {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
}));
app.use(helmet({
    contentSecurityPolicy: false,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// 3. Session & Passport
app.use(session({
    secret: process.env.SESSION_SECRET || 'your_secret_key',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// 4. Global Variables
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    const error = req.flash('error');
    res.locals.error = error.length > 0 ? error[0] : null;
    next();
});

// 5. Routes
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', message: 'Server is running', version: process.version });
});

app.use('/api', apiRoutes);
app.use('/api/admin', adminApiRoutes);

app.get('/', (req, res) => {
    res.json({ message: 'Daily News Views API is running' });
});

// 6. Error Handling
app.use((err, req, res, next) => {
    console.error('SERVER ERROR:', err.message);
    if (process.env.NODE_ENV === 'development') console.error(err.stack);

    const statusCode = err.status || 500;
    const message = process.env.NODE_ENV === 'development' ? err.message : 'Something broke!';

    if (req.originalUrl.startsWith('/api')) {
        return res.status(statusCode).json({ status: 'error', message });
    }
    res.status(statusCode).send(message);
});

// 7. Server Startup
const startServer = async () => {
    // Start listening immediately (Prevents Hostinger 503)
    app.listen(PORT, () => {
        console.log(`>>> SERVER BOOTED SUCCESS ON PORT: ${PORT} <<<`);
    });

    try {
        await connectDB();
        connectRedis();

        // Seed Admin
        const adminExists = await Admin.findOne({ email: process.env.ADMIN_EMAIL });
        if (!adminExists && process.env.ADMIN_EMAIL) {
            await Admin.create({
                name: 'System Admin',
                email: process.env.ADMIN_EMAIL,
                password: process.env.ADMIN_PASSWORD,
                role: 'admin'
            });
            console.log('Admin user seeded successfully');
        }
    } catch (error) {
        console.error(`Post-startup error: ${error.message}`);
    }
};

startServer();
