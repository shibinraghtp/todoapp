import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    // Helper to get display name
    const getDisplayName = () => {
        if (!user) return '';
        if (user.user_metadata && user.user_metadata.username) {
            return user.user_metadata.username;
        }
        return user.email;
    }

    return (
        <nav className="bg-white shadow-sm border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex">
                        <Link to="/" className="flex-shrink-0 flex items-center">
                            <span className="text-2xl font-bold text-primary">myToDo</span>
                        </Link>
                    </div>
                    <div className="flex items-center">
                        {user ? (
                            <>
                                <span className="text-gray-700 mr-4">Hello, {getDisplayName()}</span>
                                <button
                                    onClick={handleLogout}
                                    className="text-gray-500 hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    className="text-gray-500 hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors"
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    className="bg-primary text-white ml-4 px-4 py-2 rounded-full text-sm font-medium hover:bg-blue-600 transition-colors shadow-md hover:shadow-lg"
                                >
                                    Register
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
