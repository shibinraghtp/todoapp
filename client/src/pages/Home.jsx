
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

const Home = () => {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar />

            <main className="flex-grow flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 text-center">
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 tracking-tight mb-4">
                    Organize your life with <span className="text-primary">myToDo</span>
                </h1>
                <p className="max-w-md mx-auto text-lg text-gray-500 mb-8">
                    A simple, clean, and efficient way to manage your daily tasks. Stay productive and focused with myToDo.
                </p>
                <div className="flex gap-4">
                    <Link
                        to="/register"
                        className="px-8 py-3 bg-primary text-white text-lg font-medium rounded-full shadow-lg hover:bg-blue-600 hover:shadow-xl transition-all transform hover:-translate-y-1"
                    >
                        Get Started
                    </Link>
                    <Link
                        to="/login"
                        className="px-8 py-3 bg-white text-gray-700 text-lg font-medium rounded-full shadow-md border border-gray-100 hover:bg-gray-50 hover:shadow-lg transition-all"
                    >
                        Login
                    </Link>
                </div>
            </main>

            <footer className="bg-white border-t border-gray-100 py-6">
                <div className="max-w-7xl mx-auto px-4 text-center text-gray-400 text-sm">
                    &copy; {new Date().getFullYear()} myToDo App. All rights reserved.
                </div>
            </footer>
        </div>
    );
};

export default Home;
