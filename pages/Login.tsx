
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader } from 'lucide-react';

const Login: React.FC = () => {
    const { signInWithGoogle, loading, user, isAdmin } = useAuth();
    const navigate = useNavigate();

    // Auto-redirect if already signed in
    React.useEffect(() => {
        if (!loading && user) {
            navigate(isAdmin ? '/admin' : '/', { replace: true });
        }
    }, [user, loading, isAdmin, navigate]);

    const handleGoogleSignIn = async () => {
        await signInWithGoogle();
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-950 via-brand-primary to-emerald-700 flex items-center justify-center p-4">
            {/* Background decoration */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-32 -right-32 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
                <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
            </div>

            <div className="relative bg-white rounded-[2.5rem] shadow-2xl p-10 max-w-md w-full text-center">
                {/* Logo */}
                <div className="flex items-center justify-center mb-8">
                    <img src="/logo.png" alt="Yustech Logic System Service" className="h-20 w-auto object-contain" />
                </div>

                <div className="w-12 h-1 bg-brand-primary rounded-full mx-auto mb-8" />

                <h1 className="text-2xl font-black text-gray-900 mb-2">Welcome Back</h1>
                <p className="text-gray-500 mb-8 text-sm">Sign in to track orders, manage your wishlist, and more.</p>

                {loading ? (
                    <div className="flex flex-col items-center gap-3 py-4">
                        <Loader size={32} className="text-brand-primary animate-spin" />
                        <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">Signing you in...</p>
                    </div>
                ) : (
                    <button
                        onClick={handleGoogleSignIn}
                        className="w-full flex items-center justify-center gap-3 bg-white border-2 border-gray-200 text-gray-700 font-black py-4 rounded-2xl hover:border-brand-primary hover:bg-blue-50 transition-all shadow-sm hover:shadow-md active:scale-95 group"
                    >
                        {/* Google SVG Icon */}
                        <svg className="w-6 h-6" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                        </svg>
                        <span>Continue with Google</span>
                    </button>
                )}

                <p className="text-gray-400 text-[11px] mt-8 leading-relaxed">
                    By signing in, you agree to Yustech's terms of service.<br />
                    Admin access is granted to authorized personnel only.
                </p>
            </div>
        </div>
    );
};

export default Login;
