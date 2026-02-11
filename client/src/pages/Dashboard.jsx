import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import TodoCard from '../components/TodoCard';
import { Link } from 'react-router-dom';

const Dashboard = () => {
    const [todos, setTodos] = useState([]);
    const [filter, setFilter] = useState('all');
    const { user } = useContext(AuthContext);

    useEffect(() => {
        fetchTodos();
    }, []);

    const fetchTodos = async () => {
        try {
            const res = await axios.get('/api/todos');
            setTodos(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const toggleTodo = async (id, isCompleted) => {
        try {
            // Backend expects 'isCompleted' in body to update 'is_completed' column?
            // Let's check backend route: 
            // router.put('/:id', ... const { isCompleted } ... updates.is_completed = isCompleted)
            // Yes, backend maps it.
            const res = await axios.put(`/api/todos/${id}`, { isCompleted });

            // Update local state. 
            // Supabase returns updated object with snake_case.
            // We need to match ID.
            setTodos(todos.map((todo) => {
                const currentId = todo.id || todo._id;
                if (currentId === id) {
                    return res.data;
                }
                return todo;
            }));
        } catch (err) {
            console.error(err);
        }
    };

    const deleteTodo = async (id) => {
        if (window.confirm('Are you sure you want to delete this task?')) {
            try {
                await axios.delete(`/api/todos/${id}`);
                setTodos(todos.filter((todo) => (todo.id || todo._id) !== id));
            } catch (err) {
                console.error(err);
            }
        }
    };

    const filteredTodos = todos.filter((todo) => {
        const isCompleted = todo.is_completed !== undefined ? todo.is_completed : todo.isCompleted;
        if (filter === 'active') return !isCompleted;
        if (filter === 'completed') return isCompleted;
        return true;
    });

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar />
            <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-4 sm:mb-0">My Tasks</h1>

                    <div className="flex bg-white rounded-lg p-1 shadow-sm border border-gray-200">
                        <button
                            onClick={() => setFilter('all')}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${filter === 'all' ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:text-gray-900'}`}
                        >
                            All
                        </button>
                        <button
                            onClick={() => setFilter('active')}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${filter === 'active' ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:text-gray-900'}`}
                        >
                            Active
                        </button>
                        <button
                            onClick={() => setFilter('completed')}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${filter === 'completed' ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:text-gray-900'}`}
                        >
                            Completed
                        </button>
                    </div>
                </div>

                {todos.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
                        <div className="mx-auto h-24 w-24 text-gray-300 mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900">No tasks yet</h3>
                        <p className="mt-1 text-gray-500">Get started by creating a new task.</p>
                        <div className="mt-6">
                            <Link to="/todo/new" className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                                Create New Task
                            </Link>
                        </div>
                    </div>
                ) : (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        <Link to="/todo/new" className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-xl hover:border-primary hover:bg-blue-50 transition-colors group h-full min-h-[150px]">
                            <div className="h-10 w-10 text-gray-400 group-hover:text-primary mb-2">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                            </div>
                            <span className="text-gray-500 font-medium group-hover:text-primary">Create New Task</span>
                        </Link>

                        {filteredTodos.map((todo) => (
                            <TodoCard key={todo.id || todo._id} todo={todo} onToggle={toggleTodo} onDelete={deleteTodo} />
                        ))}
                    </div>
                )}
            </main>

            {/* Mobile FAB */}
            <Link
                to="/todo/new"
                className="fixed bottom-6 right-6 bg-primary text-white p-4 rounded-full shadow-lg hover:bg-blue-600 hover:shadow-xl transition-all sm:hidden"
                aria-label="Create Task"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
            </Link>
        </div>
    );
};

export default Dashboard;
