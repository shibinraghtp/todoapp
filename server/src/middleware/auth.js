const { createClient } = require('@supabase/supabase-js');

// We need a separate client instance or just use the one passed in req?
// Middleware runs before route, so strictly we can use a local instance to verify.
// Actually, verifying JWT is stateless if we have the secret, but using getUser() is the easiest SDK way.

module.exports = async function (req, res, next) {
    // Get token from header
    const token = req.header('x-auth-token');

    // Check if no token
    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
        // Verify token using Supabase
        // We can use the service client to getUser(token)
        // Note: getUser(token) is the correct way to validate a JWT and get the user identity
        const { data: { user }, error } = await req.supabase.auth.getUser(token);

        if (error || !user) {
            console.error('Auth error:', error);
            return res.status(401).json({ message: 'Token is not valid' });
        }

        console.log('Authenticated User:', user.id);
        req.user = user;
        next();
    } catch (err) {
        console.error(err);
        res.status(401).json({ message: 'Token is not valid' });
    }
};
