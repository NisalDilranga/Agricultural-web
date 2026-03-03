import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { doc, getDoc } from 'firebase/firestore';
import {
    ArrowLeft, Clock, BookOpen, User, Award,
    CheckCircle, AlertCircle, Layers,
} from 'lucide-react';
import { db } from '../firebase';
import { getCourseById } from '../data/courses';
import ApplicationModal from '../components/ApplicationModal';

const LEVEL_STYLE = {
    Beginner: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    Intermediate: 'bg-amber-100 text-amber-700 border-amber-200',
    Advanced: 'bg-rose-100 text-rose-700 border-rose-200',
};

function StatBadge({ icon, label }) {
    return (
        <div className="flex items-center gap-2 rounded-xl border border-slate-100 bg-slate-50 px-4 py-2.5">
            <span className="text-emerald-600">{icon}</span>
            <span className="text-sm font-medium text-slate-700">{label}</span>
        </div>
    );
}

function CourseDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        setLoading(true);
        setCourse(null);

        // 1️⃣ Check static courses first (numeric IDs)
        const staticCourse = getCourseById(id);
        if (staticCourse) {
            setCourse(staticCourse);
            setLoading(false);
            return;
        }

        // 2️⃣ Otherwise fetch from Firestore (admin-added courses have string IDs)
        getDoc(doc(db, 'courses', id))
            .then((snap) => {
                if (snap.exists()) {
                    setCourse({ id: snap.id, ...snap.data() });
                }
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center pt-24">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-emerald-200 border-t-emerald-600" />
            </div>
        );
    }

    if (!course) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center gap-4 pt-24 text-center">
                <p className="text-xl font-semibold text-slate-500">Course not found.</p>
                <button
                    onClick={() => navigate('/')}
                    className="rounded-full bg-emerald-600 px-6 py-2 text-sm font-semibold text-white transition hover:bg-emerald-500"
                >
                    Back to Home
                </button>
            </div>
        );
    }

    const levelStyle = LEVEL_STYLE[course.level] || 'bg-slate-100 text-slate-700 border-slate-200';
    // Handle both static (course.image) and Firestore (course.imageUrl) courses
    const imageSource = course.image || course.imageUrl;

    return (
        <>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
                className="min-h-screen bg-[#faf8f5] pb-20 pt-24"
            >
                <div className="container mx-auto max-w-5xl px-4">

                    {/* Back button */}
                    <motion.button
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.1 }}
                        onClick={() => navigate(-1)}
                        className="mb-6 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 shadow-sm transition-all hover:border-emerald-300 hover:text-emerald-600"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Courses
                    </motion.button>

                    {/* Hero image */}
                    <motion.div
                        initial={{ opacity: 0, y: 18 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.6 }}
                        className="relative mb-10 overflow-hidden rounded-3xl shadow-xl"
                    >
                        {imageSource ? (
                            <img src={imageSource} alt={course.title} className="h-72 w-full object-cover md:h-80" />
                        ) : (
                            <div className="flex h-72 w-full items-center justify-center bg-gradient-to-br from-emerald-100 to-emerald-200 md:h-80">
                                <BookOpen className="h-20 w-20 text-emerald-400" />
                            </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                            <div className="mb-2 flex flex-wrap items-center gap-2">
                                <span className={`inline-flex items-center gap-1 rounded-full border px-3 py-0.5 text-xs font-semibold ${levelStyle}`}>
                                    <Layers className="h-3 w-3" />
                                    {course.level}
                                </span>
                                {course.isComingSoon && (
                                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-500 px-3 py-0.5 text-xs font-semibold text-white">
                                        Coming Soon
                                    </span>
                                )}
                                {course.isNew && !course.isComingSoon && (
                                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500 px-3 py-0.5 text-xs font-semibold text-white">
                                        New
                                    </span>
                                )}
                            </div>
                            <h1 className="text-2xl font-bold text-white drop-shadow md:text-3xl">{course.title}</h1>
                            <p className="mt-1 text-sm text-white/75">{course.category}</p>
                        </div>
                    </motion.div>

                    {/* Main grid */}
                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">

                        {/* Left: course info */}
                        <div className="space-y-8 lg:col-span-2">
                            {/* Stat badges */}
                            <motion.div
                                initial={{ opacity: 0, y: 16 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="flex flex-wrap gap-3"
                            >
                                <StatBadge icon={<Clock className="h-4 w-4" />} label={course.duration || '4 weeks'} />
                                {course.lessons > 0 && (
                                    <StatBadge icon={<BookOpen className="h-4 w-4" />} label={`${course.lessons} Lessons`} />
                                )}
                                {course.instructor && course.instructor !== 'TBA' && (
                                    <StatBadge icon={<User className="h-4 w-4" />} label={course.instructor} />
                                )}
                                <StatBadge icon={<Award className="h-4 w-4" />} label="Certificate Included" />
                            </motion.div>

                            {/* Description */}
                            <motion.div
                                initial={{ opacity: 0, y: 16 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.35 }}
                            >
                                <h2 className="mb-3 text-xl font-semibold text-slate-900">About This Course</h2>
                                <p className="leading-relaxed text-slate-600">{course.description}</p>
                            </motion.div>

                            {/* Topics */}
                            {course.topics?.length > 0 && (
                                <motion.div
                                    initial={{ opacity: 0, y: 16 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4 }}
                                >
                                    <h2 className="mb-4 text-xl font-semibold text-slate-900">What You'll Learn</h2>
                                    <ul className="space-y-3">
                                        {course.topics.map((topic, i) => (
                                            <motion.li
                                                key={i}
                                                initial={{ opacity: 0, x: -12 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: 0.45 + i * 0.07 }}
                                                className="flex items-start gap-3"
                                            >
                                                <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" />
                                                <span className="text-slate-600">{topic}</span>
                                            </motion.li>
                                        ))}
                                    </ul>
                                </motion.div>
                            )}
                        </div>

                        {/* Right: apply card */}
                        <motion.div
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="lg:col-span-1"
                        >
                            <div className="sticky top-24 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg">
                                <div className="border-b border-slate-100 px-6 py-5">
                                    <p className="text-2xl font-extrabold text-slate-900">Free</p>
                                    <p className="text-sm text-slate-500">Government Funded Program</p>
                                </div>

                                <div className="space-y-4 px-6 py-5">
                                    {course.isComingSoon ? (
                                        <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-amber-700">
                                            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
                                            <p className="text-sm font-medium">
                                                Applications will open soon. Check back later!
                                            </p>
                                        </div>
                                    ) : (
                                        <motion.button
                                            type="button"
                                            whileHover={{ scale: 1.03, boxShadow: '0 12px 32px rgba(16,185,129,0.35)' }}
                                            whileTap={{ scale: 0.97 }}
                                            onClick={() => setShowModal(true)}
                                            className="w-full rounded-xl bg-emerald-600 py-3.5 text-center text-base font-semibold text-white transition hover:bg-emerald-500"
                                        >
                                            Apply Now
                                        </motion.button>
                                    )}

                                    <ul className="space-y-2.5 pt-1">
                                        {['Full course access', 'Certificate on completion', 'Expert instructors', 'Lifetime access to materials'].map((item) => (
                                            <li key={item} className="flex items-center gap-2 text-sm text-slate-600">
                                                <CheckCircle className="h-4 w-4 shrink-0 text-emerald-500" />
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </motion.div>

                    </div>
                </div>
            </motion.div>

            {/* Application modal */}
            <AnimatePresence>
                {showModal && (
                    <ApplicationModal
                        courseId={course.id}
                        courseName={course.title}
                        onClose={() => setShowModal(false)}
                    />
                )}
            </AnimatePresence>
        </>
    );
}

export default CourseDetail;
