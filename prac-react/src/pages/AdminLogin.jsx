import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, LogIn, Leaf, AlertCircle, KeyRound, ArrowLeft, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

function Spinner() {
    return (
        <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
            <circle
                cx="12" cy="12" r="10"
                stroke="currentColor" strokeWidth="3"
                strokeDasharray="32" strokeDashoffset="12"
            />
        </svg>
    );
}

function AdminLogin() {
    const navigate = useNavigate();
    const { login, user, resetPassword } = useAuth();

    // ── Login state ──
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // ── Forgot password state ──
    const [mode, setMode] = useState('login'); // 'login' | 'forgot'
    const [resetEmail, setResetEmail] = useState('');
    const [resetLoading, setResetLoading] = useState(false);
    const [resetError, setResetError] = useState('');
    const [resetSent, setResetSent] = useState(false);

    // Already logged in → redirect to dashboard
    if (user) return <Navigate to="/admin" replace />;

    async function handleSubmit(e) {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await login(email, password);
            navigate('/admin');
        } catch {
            setError('Invalid email or password. Please try again.');
        } finally {
            setLoading(false);
        }
    }

    async function handleResetPassword(e) {
        e.preventDefault();
        setResetError('');
        if (!resetEmail.trim()) {
            setResetError('Please enter your email address.');
            return;
        }
        setResetLoading(true);
        try {
            await resetPassword(resetEmail.trim());
            setResetSent(true);
        } catch (err) {
            if (err.code === 'auth/user-not-found') {
                setResetError('No account found with this email address.');
            } else {
                setResetError('Failed to send reset email. Please try again.');
            }
        } finally {
            setResetLoading(false);
        }
    }

    function switchToForgot() {
        setResetEmail(email); // pre-fill with whatever they typed
        setResetError('');
        setResetSent(false);
        setMode('forgot');
    }

    function switchToLogin() {
        setError('');
        setMode('login');
    }

    return (
        <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-[#0d1f12] via-[#1a3324] to-[#0d1f12] p-4">
            {/* Ambient blobs */}
            <div className="pointer-events-none absolute inset-0">
                <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl" />
                <div className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl" />
                <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-800/20 blur-2xl" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="relative w-full max-w-md"
            >
                {/* Logo + title */}
                <div className="mb-8 flex flex-col items-center gap-4">
                    <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ delay: 0.2, type: 'spring', damping: 14 }}
                        className="flex h-18 w-18 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 shadow-2xl shadow-emerald-600/40"
                    >
                        <Leaf className="h-9 w-9 text-white" />
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.35 }}
                        className="text-center"
                    >
                        <h1 className="text-2xl font-bold text-white">Admin Portal</h1>
                        <p className="mt-1 text-sm text-white/40">Department of Agriculture</p>
                    </motion.div>
                </div>

                {/* Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                    className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-2xl"
                >
                    <AnimatePresence mode="wait">

                        {/* ── LOGIN FORM ── */}
                        {mode === 'login' && (
                            <motion.div
                                key="login"
                                initial={{ opacity: 0, x: -24 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 24 }}
                                transition={{ duration: 0.25 }}
                            >
                                <h2 className="mb-6 text-lg font-semibold text-white">Sign in to your account</h2>

                                {/* Error banner */}
                                <AnimatePresence>
                                    {error && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -8 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0 }}
                                            className="mb-5 flex items-center gap-2.5 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400"
                                        >
                                            <AlertCircle className="h-4 w-4 shrink-0" />
                                            {error}
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                <form onSubmit={handleSubmit} className="space-y-4">
                                    {/* Email */}
                                    <div>
                                        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-white/50">
                                            Email Address
                                        </label>
                                        <div className="relative">
                                            <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
                                            <input
                                                type="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                required
                                                placeholder="admin@agridept.gov"
                                                className="w-full rounded-xl border border-white/10 bg-white/10 py-3 pl-11 pr-4 text-sm text-white placeholder-white/25 outline-none transition focus:border-emerald-500 focus:bg-white/15 focus:ring-2 focus:ring-emerald-500/20"
                                            />
                                        </div>
                                    </div>

                                    {/* Password */}
                                    <div>
                                        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-white/50">
                                            Password
                                        </label>
                                        <div className="relative">
                                            <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
                                            <input
                                                type={showPassword ? 'text' : 'password'}
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                required
                                                placeholder="••••••••"
                                                className="w-full rounded-xl border border-white/10 bg-white/10 py-3 pl-11 pr-12 text-sm text-white placeholder-white/25 outline-none transition focus:border-emerald-500 focus:bg-white/15 focus:ring-2 focus:ring-emerald-500/20"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword((v) => !v)}
                                                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30 transition hover:text-white/60"
                                            >
                                                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                            </button>
                                        </div>
                                    </div>

                                    {/* Forgot password link */}
                                    <div className="flex justify-end">
                                        <button
                                            type="button"
                                            onClick={switchToForgot}
                                            className="text-xs text-emerald-400 transition hover:text-emerald-300 hover:underline"
                                        >
                                            Forgot password?
                                        </button>
                                    </div>

                                    {/* Submit */}
                                    <motion.button
                                        type="submit"
                                        disabled={loading}
                                        whileHover={{ scale: loading ? 1 : 1.02 }}
                                        whileTap={{ scale: loading ? 1 : 0.97 }}
                                        className="mt-2 flex w-full items-center justify-center gap-2.5 rounded-xl bg-emerald-600 py-3.5 text-sm font-semibold text-white shadow-lg shadow-emerald-600/20 transition hover:bg-emerald-500 disabled:opacity-70"
                                    >
                                        {loading ? (
                                            <><Spinner />Signing in…</>
                                        ) : (
                                            <><LogIn className="h-4 w-4" />Sign In</>
                                        )}
                                    </motion.button>
                                </form>
                            </motion.div>
                        )}

                        {/* ── FORGOT PASSWORD FORM ── */}
                        {mode === 'forgot' && (
                            <motion.div
                                key="forgot"
                                initial={{ opacity: 0, x: 24 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -24 }}
                                transition={{ duration: 0.25 }}
                            >
                                {/* Back button */}
                                <button
                                    onClick={switchToLogin}
                                    className="mb-5 flex items-center gap-1.5 text-xs text-white/40 transition hover:text-white/70"
                                >
                                    <ArrowLeft className="h-3.5 w-3.5" />
                                    Back to Sign In
                                </button>

                                {/* Icon + heading */}
                                <div className="mb-6 flex items-center gap-3">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-600/20">
                                        <KeyRound className="h-5 w-5 text-emerald-400" />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-semibold text-white">Reset Password</h2>
                                        <p className="text-xs text-white/40">We'll send a reset link to your email</p>
                                    </div>
                                </div>

                                <AnimatePresence mode="wait">
                                    {resetSent ? (
                                        /* ── Success state ── */
                                        <motion.div
                                            key="sent"
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            className="flex flex-col items-center gap-4 py-6 text-center"
                                        >
                                            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/15">
                                                <CheckCircle className="h-8 w-8 text-emerald-400" />
                                            </div>
                                            <div>
                                                <p className="font-semibold text-white">Reset link sent!</p>
                                                <p className="mt-1 text-sm text-white/50">
                                                    Check your inbox at{' '}
                                                    <strong className="text-white/70">{resetEmail}</strong>
                                                </p>
                                                <p className="mt-1 text-xs text-white/30">Also check your spam folder.</p>
                                            </div>
                                            <button
                                                onClick={switchToLogin}
                                                className="mt-2 rounded-xl bg-emerald-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-500"
                                            >
                                                Back to Sign In
                                            </button>
                                        </motion.div>
                                    ) : (
                                        /* ── Reset form ── */
                                        <motion.form
                                            key="resetform"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            onSubmit={handleResetPassword}
                                            className="space-y-4"
                                        >
                                            {/* Error */}
                                            <AnimatePresence>
                                                {resetError && (
                                                    <motion.div
                                                        initial={{ opacity: 0, y: -8 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        exit={{ opacity: 0 }}
                                                        className="flex items-center gap-2.5 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400"
                                                    >
                                                        <AlertCircle className="h-4 w-4 shrink-0" />
                                                        {resetError}
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>

                                            <div>
                                                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-white/50">
                                                    Email Address
                                                </label>
                                                <div className="relative">
                                                    <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
                                                    <input
                                                        type="email"
                                                        value={resetEmail}
                                                        onChange={(e) => setResetEmail(e.target.value)}
                                                        required
                                                        placeholder="admin@agridept.gov"
                                                        className="w-full rounded-xl border border-white/10 bg-white/10 py-3 pl-11 pr-4 text-sm text-white placeholder-white/25 outline-none transition focus:border-emerald-500 focus:bg-white/15 focus:ring-2 focus:ring-emerald-500/20"
                                                    />
                                                </div>
                                            </div>

                                            <motion.button
                                                type="submit"
                                                disabled={resetLoading}
                                                whileHover={{ scale: resetLoading ? 1 : 1.02 }}
                                                whileTap={{ scale: resetLoading ? 1 : 0.97 }}
                                                className="flex w-full items-center justify-center gap-2.5 rounded-xl bg-emerald-600 py-3.5 text-sm font-semibold text-white shadow-lg shadow-emerald-600/20 transition hover:bg-emerald-500 disabled:opacity-70"
                                            >
                                                {resetLoading ? (
                                                    <><Spinner />Sending…</>
                                                ) : (
                                                    <><KeyRound className="h-4 w-4" />Send Reset Link</>
                                                )}
                                            </motion.button>
                                        </motion.form>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        )}

                    </AnimatePresence>
                </motion.div>

                <p className="mt-6 text-center text-xs text-white/25">
                    © {new Date().getFullYear()} Department of Agriculture. Admin access only.
                </p>
            </motion.div>
        </div>
    );
}

export default AdminLogin;
