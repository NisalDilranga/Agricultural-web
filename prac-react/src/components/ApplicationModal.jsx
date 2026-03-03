import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    X, CheckCircle, Send, User, Phone, Mail,
    MapPin, GraduationCap, Calendar,
} from 'lucide-react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';

const EDUCATION_LEVELS = [
    'Primary School',
    'Secondary School (O/L)',
    'Advanced Level (A/L)',
    'Diploma',
    "Bachelor's Degree",
    "Master's Degree",
    'PhD',
    'Other',
];

const INITIAL_FORM = {
    name: '',
    age: '',
    address: '',
    phone: '',
    email: '',
    educationLevel: '',
};

function inputClass(hasError) {
    return `w-full rounded-xl border ${hasError
        ? 'border-red-300 bg-red-50 focus:border-red-400 focus:ring-red-200'
        : 'border-slate-200 bg-slate-50 focus:border-emerald-500 focus:ring-emerald-500/20'
        } px-4 py-2.5 text-sm text-slate-700 outline-none transition focus:bg-white focus:ring-2`;
}

function Field({ label, icon, error, children }) {
    return (
        <div>
            <label className="mb-1.5 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                {icon}
                {label}
            </label>
            {children}
            <AnimatePresence>
                {error && (
                    <motion.p
                        key="err"
                        initial={{ opacity: 0, y: -4, height: 0 }}
                        animate={{ opacity: 1, y: 0, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-1 text-xs text-red-500"
                    >
                        {error}
                    </motion.p>
                )}
            </AnimatePresence>
        </div>
    );
}

function LoadingSpinner() {
    return (
        <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"
                strokeDasharray="32" strokeDashoffset="12" />
        </svg>
    );
}

function ApplicationModal({ courseId, courseName, onClose }) {
    const [form, setForm] = useState(INITIAL_FORM);
    const [errors, setErrors] = useState({});
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [submitError, setSubmitError] = useState('');

    function validate() {
        const e = {};
        if (!form.name.trim()) e.name = 'Full name is required';
        const age = Number(form.age);
        if (!form.age || isNaN(age) || age < 15 || age > 80)
            e.age = 'Please enter a valid age (15–80)';
        if (!form.address.trim()) e.address = 'Address is required';
        if (!form.phone.trim() || !/^\+?[\d\s\-]{7,15}$/.test(form.phone.trim()))
            e.phone = 'Enter a valid phone number';
        if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()))
            e.email = 'Enter a valid email address';
        if (!form.educationLevel) e.educationLevel = 'Please select your education level';
        return e;
    }

    function handleChange(e) {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setSubmitError('');
        const newErrors = validate();
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }
        setLoading(true);
        try {
            await addDoc(collection(db, 'applications'), {
                ...form,
                age: Number(form.age),
                courseId: String(courseId),
                courseName,
                status: 'pending',
                submittedAt: serverTimestamp(),
            });
            setSubmitted(true); // only set true on actual success
        } catch (err) {
            console.error('Firestore write failed:', err);
            if (err.code === 'permission-denied') {
                setSubmitError('Submission blocked by server. Please contact the administrator.');
            } else {
                setSubmitError('Something went wrong. Please check your connection and try again.');
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ backgroundColor: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)' }}
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
            <motion.div
                initial={{ opacity: 0, scale: 0.88, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.88, y: 30 }}
                transition={{ type: 'spring', damping: 26, stiffness: 320 }}
                className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="bg-gradient-to-r from-emerald-700 to-emerald-500 px-6 py-5">
                    <div className="flex items-start justify-between">
                        <div>
                            <h2 className="text-xl font-bold text-white">Course Application</h2>
                            <p className="mt-0.5 max-w-xs truncate text-sm text-emerald-100">{courseName}</p>
                        </div>
                        <motion.button
                            whileHover={{ scale: 1.1, rotate: 90 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={onClose}
                            className="rounded-full bg-white/20 p-1.5 text-white hover:bg-white/30 transition"
                        >
                            <X className="h-4 w-4" />
                        </motion.button>
                    </div>
                </div>

                {/* Body */}
                <div className="max-h-[72vh] overflow-y-auto">
                    <AnimatePresence mode="wait">
                        {submitted ? (
                            /* Success */
                            <motion.div
                                key="success"
                                initial={{ opacity: 0, scale: 0.85 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ type: 'spring', damping: 20 }}
                                className="flex flex-col items-center justify-center px-8 py-16 text-center"
                            >
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: 'spring', damping: 14, delay: 0.15 }}
                                    className="mb-5 rounded-full bg-emerald-100 p-5"
                                >
                                    <CheckCircle className="h-14 w-14 text-emerald-600" />
                                </motion.div>
                                <h3 className="mb-2 text-2xl font-bold text-slate-900">Application Submitted!</h3>
                                <p className="mb-2 max-w-xs text-slate-500">
                                    Your application for{' '}
                                    <strong className="text-slate-700">{courseName}</strong> has been received.
                                </p>
                                <p className="mb-8 text-sm text-slate-400">
                                    We'll reach out to <strong className="text-slate-600">{form.email}</strong> within 3–5 business days.
                                </p>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={onClose}
                                    className="rounded-full bg-emerald-600 px-10 py-2.5 text-sm font-semibold text-white hover:bg-emerald-500 transition shadow-lg shadow-emerald-600/25"
                                >
                                    Close
                                </motion.button>
                            </motion.div>
                        ) : (
                            /* Form */
                            <motion.form
                                key="form"
                                onSubmit={handleSubmit}
                                className="space-y-4 px-6 py-6"
                            >
                                {/* Submit error */}
                                <AnimatePresence>
                                    {submitError && (
                                        <motion.div
                                            key="submitErr"
                                            initial={{ opacity: 0, y: -8 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0 }}
                                            className="flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600"
                                        >
                                            <span className="mt-0.5 shrink-0">⚠️</span>
                                            {submitError}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                                <Field label="Full Name" icon={<User className="h-3.5 w-3.5" />} error={errors.name}>
                                    <input type="text" name="name" value={form.name} onChange={handleChange}
                                        placeholder="e.g. Kamal Perera" className={inputClass(!!errors.name)} />
                                </Field>

                                <Field label="Age" icon={<Calendar className="h-3.5 w-3.5" />} error={errors.age}>
                                    <input type="number" name="age" value={form.age} onChange={handleChange}
                                        placeholder="Your age (15 – 80)" min="15" max="80" className={inputClass(!!errors.age)} />
                                </Field>

                                <Field label="Address" icon={<MapPin className="h-3.5 w-3.5" />} error={errors.address}>
                                    <textarea name="address" value={form.address} onChange={handleChange}
                                        placeholder="No. 12, Kandy Road, Colombo 07" rows={2}
                                        className={inputClass(!!errors.address) + ' resize-none'} />
                                </Field>

                                <Field label="Phone Number" icon={<Phone className="h-3.5 w-3.5" />} error={errors.phone}>
                                    <input type="tel" name="phone" value={form.phone} onChange={handleChange}
                                        placeholder="+94 71 234 5678" className={inputClass(!!errors.phone)} />
                                </Field>

                                <Field label="Email Address" icon={<Mail className="h-3.5 w-3.5" />} error={errors.email}>
                                    <input type="email" name="email" value={form.email} onChange={handleChange}
                                        placeholder="you@example.com" className={inputClass(!!errors.email)} />
                                </Field>

                                <Field label="Education Level" icon={<GraduationCap className="h-3.5 w-3.5" />} error={errors.educationLevel}>
                                    <select name="educationLevel" value={form.educationLevel} onChange={handleChange}
                                        className={inputClass(!!errors.educationLevel)}>
                                        <option value="">Select your education level</option>
                                        {EDUCATION_LEVELS.map((level) => (
                                            <option key={level} value={level}>{level}</option>
                                        ))}
                                    </select>
                                </Field>

                                <motion.button
                                    type="submit"
                                    disabled={loading}
                                    whileHover={{ scale: loading ? 1 : 1.02 }}
                                    whileTap={{ scale: loading ? 1 : 0.97 }}
                                    className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3.5 text-sm font-semibold text-white shadow-lg shadow-emerald-600/20 transition hover:bg-emerald-500 disabled:opacity-70"
                                >
                                    {loading ? (
                                        <><LoadingSpinner /> Submitting…</>
                                    ) : (
                                        <><Send className="h-4 w-4" /> Submit Application</>
                                    )}
                                </motion.button>
                            </motion.form>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
        </motion.div>
    );
}

export default ApplicationModal;
