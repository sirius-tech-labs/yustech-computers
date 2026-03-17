
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldOff, Loader } from 'lucide-react';

const ProtectedAdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user, loading, isAdmin } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
                <Loader size={40} className="text-tech-blue animate-spin mb-4" />
                <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Checking access...</p>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (!isAdmin) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
                <div className="bg-white rounded-[2.5rem] shadow-2xl p-12 max-w-md w-full text-center border border-gray-100">
                    <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <ShieldOff size={40} className="text-red-500" />
                    </div>
                    <h1 className="text-2xl font-black text-gray-900 mb-3">Access Denied</h1>
                    <p className="text-gray-500 mb-2">
                        Your account (<span className="font-bold text-gray-700">{user.email}</span>) does not have admin privileges.
                    </p>
                    <p className="text-gray-400 text-sm mb-8">Please contact the site administrator if you believe this is an error.</p>
                    <a
                        href="/"
                        className="inline-flex items-center gap-2 bg-tech-blue text-white px-8 py-3 rounded-xl font-black hover:bg-blue-900 transition"
                    >
                        Go to Homepage
                    </a>
                </div>
            </div>
        );
    }

    return <>{children}</>;
};

export default ProtectedAdminRoute;
