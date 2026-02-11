const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const todoRoutes = require('./routes/todos');

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize Supabase Client (for server-side operations if needed, e.g. bypassing RLS with service key)
// We need to handle case where env vars are missing during build time potentially, 
// but runtime they must ensure to be present.
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseKey) {
    if (process.env.NODE_ENV !== 'production') {
        console.warn('Missing Supabase Credentials in environment');
    }
}

const supabase = createClient(
    supabaseUrl || 'https://placeholder.supabase.co',
    supabaseKey || 'placeholder'
);

// Middleware
app.use(cors({
    origin: ['http://localhost:5173', 'https://your-vercel-app.vercel.app'], // Add your Vercel URL here later
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));
app.use(express.json());

// Inject supabase client into request
app.use((req, res, next) => {
    req.supabase = supabase;
    next();
});

// Routes
app.use('/api/todos', todoRoutes);

app.get('/', (req, res) => {
    res.send('MyToDo API (Supabase Edition) is running');
});

// Start Server ONLY if run directly (not imported as module)
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}

module.exports = app;
