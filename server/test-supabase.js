require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

console.log('Testing Supabase Connection...');
console.log('URL:', supabaseUrl);
console.log('Key Length:', supabaseKey ? supabaseKey.length : 'MISSING');

if (!supabaseUrl || !supabaseKey) {
    console.error('ERROR: Missing Credentials in .env');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
    try {
        // 1. Try to read (should work even if empty)
        console.log('Attempting to select from "todos"...');
        const { data, error } = await supabase.from('todos').select('*').limit(1);

        if (error) {
            console.error('SELECT Error:', error);
        } else {
            console.log('SELECT Success. Data:', data);
        }

        // 2. Try to insert a dummy row (if table exists)
        // We need a valid user_id if there is a constraint.
        // However, if we don't have a user_id, we can't test INSERT fully if the FK constraint exists.
        // But getting a specific error about FK constraint is better than "500".

        // We'll skip insert for now unless we can mock a user, 
        // but the SELECT query confirms connectivity and Table Existence.

    } catch (err) {
        console.error('Unexpected Error:', err);
    }
}

testConnection();
