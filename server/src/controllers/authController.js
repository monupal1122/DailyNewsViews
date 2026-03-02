const Admin = require('../models/Admin');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const sendEmail = require('../services/emailService');

const signToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '2d'
    });
};

const sendResponse = (req, res, statusCode, data, redirectPath) => {
    if (req.originalUrl.startsWith('/api')) {
        return res.status(statusCode).json(data);
    }
    if (redirectPath) {
        return res.redirect(redirectPath);
    }
    // Default fallback
    res.status(statusCode).json(data);
};

const handleLogin = async (req, res, requiredRole, loginView) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.render(loginView, { error: 'Please provide email and password' });
        }

        const user = await Admin.findOne({ email: email.toLowerCase() }).select('+password');

        if (!user || !(await user.comparePassword(password, user.password))) {
            return res.render(loginView, { error: 'Incorrect email or password' });
        }

        // Role verification
        if (user.role !== requiredRole) {
            return res.render(loginView, {
                error: `Access Denied: This portal is for ${requiredRole}s only.`
            });
        }

        if (!process.env.JWT_SECRET) {
            console.error('CRITICAL: JWT_SECRET is missing from environment variables!');
        }

        const token = signToken(user._id);
        const cookieOptions = {
            expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production'
        };

        res.cookie('token', token, cookieOptions);

        const redirectPath = user.role === 'admin' ? '/admin/dashboard' : '/author/dashboard';
        res.redirect(redirectPath);
    } catch (error) {
        console.error('LOGIN ERROR DETAIL:', error);
        res.status(500).render(loginView, { error: `Internal Error: ${error.message}` });
    }
};

exports.adminLogin = async (req, res) => {
    await handleLogin(req, res, 'admin', 'admin/login');
};

exports.authorLogin = async (req, res) => {
    await handleLogin(req, res, 'author', 'author/login');
};

exports.login = async (req, res) => {
    // Keeping this for generic API login if needed
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ message: 'Missing credentials' });

        const user = await Admin.findOne({ email: email.toLowerCase() }).select('+password');
        if (!user || !(await user.comparePassword(password, user.password))) {
            return res.status(401).json({ message: 'Incorrect email or password' });
        }

        const token = signToken(user._id);
        res.cookie('token', token, {
            expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production'
        });

        res.status(200).json({ status: 'success', token, data: { user } });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.logout = (req, res) => {
    res.cookie('token', 'loggedout', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true
    });

    // Redirect based on the route that called logout
    if (req.originalUrl.startsWith('/author')) {
        return res.redirect('/author/login');
    }
    res.redirect('/admin/login');
};

exports.getForgotPassword = (req, res) => {
    res.render('admin/forgot-password', { error: null, message: null });
};

exports.forgotPassword = async (req, res) => {
    try {
        console.log('Forgot password request for:', req.body.email);

        // 1) Get user based on POSTed email (handles both admin and author)
        const user = await Admin.findOne({ email: req.body.email.toLowerCase() });

        if (user) {
            console.log('User found, generating token...');
            const resetToken = user.createPasswordResetToken();
            await user.save({ validateBeforeSave: false });

            // 3) Send it to user's email
            // Use the provided frontend URL or fallback to the request origin for development
            const frontendURL = process.env.FRONTEND_URL || `${req.protocol}://${req.get('host')}`.replace('3000', '8081');
            const resetURL = `${frontendURL}/reset-password/${resetToken}`;

            const message = `Forgot your password? Click the link below to reset it: ${resetURL}.\nIf you didn't forget your password, please ignore this email!`;

            try {
                const html = `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e1e1e1; border-radius: 10px;">
                        <h2 style="color: #0b5f17;">Password Reset Request</h2>
                        <p>You requested a password reset for your Daily Chronicle account. Click the button below to set a new password:</p>
                        <div style="text-align: center; margin: 30px 0;">
                            <a href="${resetURL}" style="background-color: #0b5f17; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">Reset My Password</a>
                        </div>
                        <p style="color: #666; font-size: 14px;">If the button doesn't work, copy and paste this link into your browser:</p>
                        <p style="word-break: break-all; color: #0b5f17;">${resetURL}</p>
                        <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
                        <p style="font-size: 12px; color: #999;">This link is valid for 10 minutes. If you didn't request this, you can safely ignore this email.</p>
                    </div>
                `;

                await sendEmail({
                    email: user.email,
                    subject: 'Your password reset token (valid for 10 min)',
                    message,
                    html
                });
                console.log('Reset email sent successfully');
            } catch (err) {
                console.error('Email sending failed:', err.message);
                user.passwordResetToken = undefined;
                user.passwordResetExpires = undefined;
                await user.save({ validateBeforeSave: false });
                return res.status(500).json({ status: 'error', message: 'There was an error sending the email. Try again later!' });
            }
        }

        // Generic Success Response (Security: don't reveal if email exists)
        return res.status(200).json({
            status: 'success',
            message: 'If an account with that email exists, a password reset link has been sent.'
        });

    } catch (error) {
        console.error('FORGOT PASSWORD GLOBAL ERROR:', error);
        res.status(500).json({ status: 'error', message: error.message });
    }
};

exports.getResetPassword = async (req, res) => {
    try {
        const hashedToken = crypto
            .createHash('sha256')
            .update(req.params.token)
            .digest('hex');

        const admin = await Admin.findOne({
            passwordResetToken: hashedToken,
            passwordResetExpires: { $gt: Date.now() }
        });

        if (!admin) {
            return res.render('admin/forgot-password', {
                error: 'This reset link is invalid or has expired. Please request a new one.',
                message: null
            });
        }

        res.render('admin/reset-password', { token: req.params.token, error: null });
    } catch (error) {
        res.redirect('/admin/forgot-password');
    }
};

exports.resetPassword = async (req, res) => {
    try {
        const { password, passwordConfirm } = req.body;
        console.log('Attempting password reset with token...');

        // 1. Strong Password Validation
        if (password !== passwordConfirm) {
            return res.render('admin/reset-password', { token: req.params.token, error: 'Passwords do not match' });
        }

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d\w\W]{8,}$/;
        if (!passwordRegex.test(password)) {
            const error = 'Password must be at least 8 characters long and include an uppercase letter, a lowercase letter, and a number.';
            return res.render('admin/reset-password', { token: req.params.token, error });
        }

        // 2) Get admin based on the token
        const hashedToken = crypto
            .createHash('sha256')
            .update(req.params.token)
            .digest('hex');

        const admin = await Admin.findOne({
            passwordResetToken: hashedToken,
            passwordResetExpires: { $gt: Date.now() }
        });

        // 3) If token has not expired, and there is admin, set the new password
        if (!admin) {
            console.log('RESET FAILED: Token invalid or expired in DB');
            const error = 'Token is invalid or has expired';
            if (req.originalUrl.startsWith('/api')) return res.status(400).json({ message: error });
            return res.render('admin/reset-password', { token: req.params.token, error });
        }

        console.log('Admin found for token, updating password...');
        admin.password = password;
        admin.passwordResetToken = undefined;
        admin.passwordResetExpires = undefined;
        await admin.save();

        // 4) Log the admin in, send JWT
        const token = signToken(admin._id);
        res.cookie('token', token, {
            expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production'
        });

        if (req.originalUrl.startsWith('/api')) {
            return res.status(200).json({ status: 'success', message: 'Password reset successful!' });
        }

        req.flash('success_msg', 'Password reset successful! You are now logged in.');
        const redirectPath = admin.role === 'admin' ? '/admin/dashboard' : '/author/dashboard';
        res.redirect(redirectPath);

    } catch (error) {
        console.error('RESET PASSWORD ERROR:', error);
        res.status(500).json({ message: error.message });
    }
};

exports.googleCallback = (req, res) => {
    const token = signToken(req.user._id);
    const cookieOptions = {
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production'
    };

    res.cookie('token', token, cookieOptions);
    const redirectPath = req.user.role === 'admin' ? '/admin/dashboard' : '/author/dashboard';
    res.redirect(redirectPath);
};

exports.updatePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword, confirmPassword } = req.body;
        const admin = await Admin.findById(req.admin._id).select('+password');

        // 1. Check if current password is correct
        if (!(await admin.comparePassword(currentPassword, admin.password))) {
            req.flash('error_msg', 'The current password you entered is incorrect.');
            return res.redirect('/admin/account');
        }

        // 2. Check if new passwords match
        if (newPassword !== confirmPassword) {
            req.flash('error_msg', 'The new passwords do not match.');
            return res.redirect('/admin/account');
        }

        // 3. Check for strong password
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d\w\W]{8,}$/;
        if (!passwordRegex.test(newPassword)) {
            req.flash('error_msg', 'New password must be at least 8 characters long and include an uppercase letter, a lowercase letter, and a number.');
            return res.redirect('/admin/account');
        }

        // 4. Update password
        admin.password = newPassword;
        await admin.save();

        req.flash('success_msg', 'Password updated successfully!');
        const redirectUrl = req.admin.role === 'admin' ? '/admin/account' : '/author/account';
        res.redirect(redirectUrl);
    } catch (error) {
        console.error('UPDATE PASSWORD ERROR:', error);
        req.flash('error_msg', 'An error occurred while updating the password.');
        const redirectUrl = req.admin.role === 'admin' ? '/admin/account' : '/author/account';
        res.redirect(redirectUrl);
    }
};
