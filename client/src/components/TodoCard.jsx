import { Link } from 'react-router-dom';

const TodoCard = ({ todo, onToggle, onDelete }) => {
    // Supabase uses 'id', MongoDB used '_id'
    // Supabase uses 'is_completed', MongoDB used 'isCompleted' (mapped in backend? No, backend select(*) returns raw columns)
    // Let's handle potentially both or switch to Supabase keys.
    const id = todo.id || todo._id;
    const isCompleted = todo.is_completed !== undefined ? todo.is_completed : todo.isCompleted;

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-start justify-between">
                <div className="flex items-start flex-1">
                    <input
                        type="checkbox"
                        checked={isCompleted}
                        onChange={() => onToggle(id, !isCompleted)}
                        className="mt-1 h-5 w-5 text-primary border-gray-300 rounded focus:ring-primary cursor-pointer"
                    />
                    <div className="ml-4 flex-1">
                        <Link to={`/todo/${id}`} className="group">
                            <h3 className={`text-lg font-semibold ${isCompleted ? 'text-gray-400 line-through' : 'text-gray-900 group-hover:text-primary transition-colors'}`}>
                                {todo.title}
                            </h3>
                            {todo.description && (
                                <p className={`mt-1 text-sm ${isCompleted ? 'text-gray-400 line-through' : 'text-gray-500'}`}>
                                    {todo.description}
                                </p>
                            )}
                        </Link>
                        <div className="mt-2 text-xs text-gray-400">
                            {new Date(todo.created_at || todo.createdAt).toLocaleDateString()}
                        </div>
                    </div>
                </div>
                <button
                    onClick={() => onDelete(id)}
                    className="ml-4 text-gray-400 hover:text-red-500 transition-colors p-1"
                    aria-label="Delete"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                </button>
            </div>
        </div>
    );
};

export default TodoCard;
