const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

// Note within: req.user from auth middleware contains the Supabase User object.
// req.user.id is the UUID.

// Get all todos for the logged-in user
router.get('/', auth, async (req, res) => {
    try {
        const { data: todos, error } = await req.supabase
            .from('todos')
            .select('*')
            .eq('user_id', req.user.id)
            .order('created_at', { ascending: false });

        if (error) throw error;
        res.json(todos);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Create a new todo
router.post('/', auth, async (req, res) => {
    try {
        const { title, description } = req.body;

        const { data: todo, error } = await req.supabase
            .from('todos')
            .insert([
                {
                    title,
                    description,
                    user_id: req.user.id,
                    is_completed: false
                }
            ])
            .select()
            .single();

        if (error) throw error;
        res.json(todo);
    } catch (err) {
        console.error('Supabase Insert Error:', err);
        res.status(500).json({ message: 'Server Error', error: err.message, details: err });
    }
});

// Update a todo
router.put('/:id', auth, async (req, res) => {
    const { title, description, isCompleted } = req.body;

    // Build update object
    const updates = {};
    if (title) updates.title = title;
    if (description) updates.description = description;
    if (typeof isCompleted !== 'undefined') updates.is_completed = isCompleted;

    try {
        // Check ownership first? 
        // RLS (Row Level Security) handles this if configured, but since we are using 
        // Service Key (admin) in backend, we MUST verify ownership manually here 
        // OR just use the user_id in the query filter.

        // Simplest safe update: update where id matches AND user_id matches.
        const { data: todo, error } = await req.supabase
            .from('todos')
            .update(updates)
            .eq('id', req.params.id)
            .eq('user_id', req.user.id)
            .select()
            .single();

        if (error) throw error;
        if (!todo) return res.status(404).json({ message: 'Todo not found or unauthorized' });

        res.json(todo);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Delete a todo
router.delete('/:id', auth, async (req, res) => {
    try {
        const { error } = await req.supabase
            .from('todos')
            .delete()
            .eq('id', req.params.id)
            .eq('user_id', req.user.id);

        if (error) throw error;

        res.json({ message: 'Todo removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
