import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';

const TodoDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isNew = id === 'new';

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        isCompleted: false,
    });
    const [loading, setLoading] = useState(!isNew);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!isNew) {
            fetchTodo();
        }
    }, [id]);

    const fetchTodo = async () => {
        try {
            const res = await axios.get(`/api/todos/`);
            const allTodos = res.data;
            // Handle potential number vs string ID if Supabase uses Int IDs
            const todo = allTodos.find(t => (t.id || t._id).toString() === id.toString());

            if (todo) {
                setFormData({
                    title: todo.title,
                    description: todo.description || '',
                    isCompleted: todo.is_completed !== undefined ? todo.is_completed : todo.isCompleted,
                });
            } else {
                setError('Todo not found');
            }
            setLoading(false);
        } catch (err) {
            console.error(err);
            setError('Failed to fetch todo');
            setLoading(false);
        }
    };

    const onChange = (e) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setFormData({ ...formData, [e.target.name]: value });
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isNew) {
                await axios.post('/api/todos', formData);
            } else {
                await axios.put(`/api/todos/${id}`, formData);
            }
            navigate('/dashboard');
        } catch (err) {
            setError('Failed to save todo');
            console.error(err);
        }
    };

    const onDelete = async () => {
        if (window.confirm('Are you sure you want to delete this task?')) {
            try {
                await axios.delete(`/api/todos/${id}`);
                navigate('/dashboard');
            } catch (err) {
                console.error(err);
                setError('Failed to delete todo');
            }
        }
    }

    if (loading) return <div className="flex justify-center items-center min-h-screen">Loading...</div>;

    return (
        <div className="min-h-screen bg-white flex flex-col">
            <Navbar />
            <div className="flex-grow flex justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
                <div className="max-w-2xl w-full bg-white p-8 rounded-2xl shadow-lg h-fit">
                    <div className="flex items-center justify-between mb-8">
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="text-gray-500 hover:text-gray-700 flex items-center"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                            </svg>
                            Back to Dashboard
                        </button>
                        <h2 className="text-2xl font-bold text-gray-900">
                            {isNew ? 'New Task' : 'Edit Task'}
                        </h2>
                    </div>

                    {error && (
                        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 text-red-700">
                            <p>{error}</p>
                        </div>
                    )}

                    <form onSubmit={onSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                                Title
                            </label>
                            <input
                                type="text"
                                name="title"
                                id="title"
                                required
                                value={formData.title}
                                onChange={onChange}
                                className="mt-1 block w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
                                placeholder="What needs to be done?"
                            />
                        </div>

                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                                Description
                            </label>
                            <textarea
                                name="description"
                                id="description"
                                rows={4}
                                value={formData.description}
                                onChange={onChange}
                                className="mt-1 block w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
                                placeholder="Add more details..."
                            />
                        </div>

                        {!isNew && (
                            <div className="flex items-center">
                                <input
                                    id="isCompleted"
                                    name="isCompleted"
                                    type="checkbox"
                                    checked={formData.isCompleted}
                                    onChange={onChange}
                                    className="h-5 w-5 text-primary focus:ring-primary border-gray-300 rounded"
                                />
                                <label htmlFor="isCompleted" className="ml-3 block text-sm font-medium text-gray-700">
                                    Mark as completed
                                </label>
                            </div>
                        )}

                        <div className="flex items-center justify-between pt-6 border-t border-gray-100">
                            {!isNew && (
                                <button
                                    type="button"
                                    onClick={onDelete}
                                    className="px-4 py-2 border border-red-300 shadow-sm text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                >
                                    Delete Task
                                </button>
                            )}
                            <div className={`flex ${isNew ? 'w-full justify-end' : ''}`}>
                                <button
                                    type="button"
                                    onClick={() => navigate('/dashboard')}
                                    className="mr-3 px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                                >
                                    {isNew ? 'Create Task' : 'Save Changes'}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default TodoDetail;
