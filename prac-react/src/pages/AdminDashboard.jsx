import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    collection, query, orderBy, onSnapshot,
    addDoc, updateDoc, deleteDoc, doc, serverTimestamp,
} from 'firebase/firestore';
import {
    BookOpen, ClipboardList, LogOut, Plus, Edit2, Trash2, X,
    Leaf, TrendingUp, CheckCircle, XCircle, Clock, Users,
    AlertTriangle, Save, ChevronRight, ExternalLink, Search,
    Mail, Phone, GraduationCap, Calendar, MapPin, Eye,
    Send, ShieldAlert,
} from 'lucide-react';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';
import { sendStatusEmail } from '../emailService';
import { useToast } from '../context/ToastContext';

// ─── Constants ────────────────────────────────────────────────────────────────

const LEVELS = ['Beginner', 'Intermediate', 'Advanced'];

const BLANK_COURSE = {
    title: '',
    category: '',
    imageUrl: '',
    description: '',
    duration: '4 weeks',
    level: 'Beginner',
    instructor: '',
    lessons: '',
    topics: [''],
    isNew: true,
};

const LEVEL_STYLE = {
    Beginner: 'bg-emerald-100 text-emerald-700',
    Intermediate: 'bg-amber-100 text-amber-700',
    Advanced: 'bg-rose-100 text-rose-700',
};

const STATUS_STYLE = {
    pending: 'bg-amber-100 text-amber-700 border-amber-200',
    approved: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    rejected: 'bg-rose-100 text-rose-700 border-rose-200',
};

const STATUS_ICON = {
    pending: Clock,
    approved: CheckCircle,
    rejected: XCircle,
};

// ─── Helper: format Firestore timestamp ──────────────────────────────────────

function formatDate(ts) {
    if (!ts) return '—';
    const d = ts.toDate ? ts.toDate() : new Date(ts);
    return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

// ─── Stat Card ────────────────────────────────────────────────────────────────

function StatCard({ label, value, icon: Icon, color }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className={`rounded-2xl border p-5 ${color}`}
        >
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-xs font-semibold uppercase tracking-wider opacity-60">{label}</p>
                    <p className="mt-1 text-3xl font-bold">{value}</p>
                </div>
                <div className="rounded-xl bg-current/10 p-2.5 opacity-80">
                    <Icon className="h-5 w-5" />
                </div>
            </div>
        </motion.div>
    );
}

// ─── Overview Tab ─────────────────────────────────────────────────────────────

function Overview({ stats, recentApps }) {
    return (
        <div className="space-y-8">
            {/* Stat grid */}
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                <StatCard label="Total Courses" value={stats.courses} icon={BookOpen} color="bg-slate-50 border-slate-200 text-slate-700" />
                <StatCard label="Applications" value={stats.total} icon={ClipboardList} color="bg-blue-50 border-blue-200 text-blue-700" />
                <StatCard label="Pending" value={stats.pending} icon={Clock} color="bg-amber-50 border-amber-200 text-amber-700" />
                <StatCard label="Approved" value={stats.approved} icon={CheckCircle} color="bg-emerald-50 border-emerald-200 text-emerald-700" />
            </div>

            {/* Recent applications */}
            <div>
                <h2 className="mb-4 text-lg font-semibold text-slate-800">Recent Applications</h2>
                {recentApps.length === 0 ? (
                    <div className="rounded-2xl border border-slate-100 bg-slate-50 py-12 text-center text-slate-400">
                        <ClipboardList className="mx-auto mb-2 h-8 w-8 opacity-40" />
                        <p className="text-sm">No applications yet</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {recentApps.map((app) => {
                            const Icon = STATUS_ICON[app.status] || Clock;
                            return (
                                <motion.div
                                    key={app.id}
                                    initial={{ opacity: 0, x: -12 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-white px-5 py-4 shadow-sm"
                                >
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-sm font-bold text-slate-600">
                                        {app.name?.[0]?.toUpperCase() || '?'}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="font-medium text-slate-800 truncate">{app.name}</p>
                                        <p className="text-xs text-slate-500 truncate">{app.courseName}</p>
                                    </div>
                                    <div className={`flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-semibold ${STATUS_STYLE[app.status] || STATUS_STYLE.pending}`}>
                                        <Icon className="h-3 w-3" />
                                        {app.status || 'pending'}
                                    </div>
                                    <p className="shrink-0 text-xs text-slate-400">{formatDate(app.submittedAt)}</p>
                                </motion.div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}

// ─── Courses Tab ──────────────────────────────────────────────────────────────

function CoursesTab({ courses, loading, onEdit, onDelete }) {
    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-200 border-t-emerald-600" />
            </div>
        );
    }

    if (courses.length === 0) {
        return (
            <div className="rounded-2xl border border-dashed border-slate-200 py-20 text-center text-slate-400">
                <BookOpen className="mx-auto mb-3 h-10 w-10 opacity-30" />
                <p className="text-base font-medium">No courses added yet</p>
                <p className="mt-1 text-sm">Click "Add Course" to create your first course.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {courses.map((course) => (
                <motion.div
                    key={course.id}
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md"
                >
                    {/* Image */}
                    <div className="relative h-40 overflow-hidden bg-slate-100">
                        {course.imageUrl ? (
                            <img src={course.imageUrl} alt={course.title} className="h-full w-full object-cover" />
                        ) : (
                            <div className="flex h-full items-center justify-center">
                                <BookOpen className="h-10 w-10 text-slate-300" />
                            </div>
                        )}
                        <span className={`absolute left-3 top-3 rounded-full px-2.5 py-0.5 text-xs font-semibold ${LEVEL_STYLE[course.level] || 'bg-slate-100 text-slate-600'}`}>
                            {course.level}
                        </span>
                        {course.isNew && (
                            <span className="absolute right-3 top-3 rounded-full bg-emerald-600 px-2.5 py-0.5 text-xs font-semibold text-white">
                                New
                            </span>
                        )}
                    </div>

                    {/* Body */}
                    <div className="p-4">
                        <p className="text-xs font-medium uppercase tracking-wide text-emerald-600">{course.category}</p>
                        <h3 className="mt-0.5 font-semibold text-slate-900 line-clamp-1">{course.title}</h3>
                        <p className="mt-1 text-xs text-slate-500 line-clamp-2">{course.description}</p>

                        <div className="mt-4 flex items-center justify-between">
                            <div className="text-xs text-slate-500">
                                <span className="font-medium text-slate-700">{course.instructor || '—'}</span>
                                {course.lessons ? ` · ${course.lessons} lessons` : ''}
                            </div>
                            <div className="flex items-center gap-1">
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => onEdit(course)}
                                    className="rounded-lg bg-slate-100 p-1.5 text-slate-500 transition hover:bg-emerald-100 hover:text-emerald-600"
                                    title="Edit"
                                >
                                    <Edit2 className="h-3.5 w-3.5" />
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => onDelete(course)}
                                    className="rounded-lg bg-slate-100 p-1.5 text-slate-500 transition hover:bg-rose-100 hover:text-rose-600"
                                    title="Delete"
                                >
                                    <Trash2 className="h-3.5 w-3.5" />
                                </motion.button>
                            </div>
                        </div>
                    </div>
                </motion.div>
            ))}
        </div>
    );
}


// ─── Applications Tab ─────────────────────────────────────────────────────────

function ApplicationsTab({ applications, onUpdateStatus }) {
    const toast = useToast();
    const [search, setSearch] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [expanded, setExpanded] = useState(null);
    const [sendingEmail, setSendingEmail] = useState(null);
    const [confirmPending, setConfirmPending] = useState(null); // { app, newStatus }
    async function handleStatusChange(app, newStatus) {
        await onUpdateStatus(app.id, newStatus);
        toast.info(`Status changed to "${newStatus}" for ${app.name}`);
        setConfirmPending(null);

        if (newStatus === 'approved' || newStatus === 'rejected') {
            setSendingEmail(app.id);
            try {
                await sendStatusEmail(app, newStatus);
                toast.success(`Email sent to ${app.email} — application ${newStatus}!`);
            } catch (err) {
                console.error('EmailJS send failed:', err);
                toast.error(`Status updated, but email failed. Check EmailJS config.`);
            } finally {
                setSendingEmail(null);
            }
        }
    }

    const filtered = applications.filter((app) => {
        const matchSearch =
            app.name?.toLowerCase().includes(search.toLowerCase()) ||
            app.email?.toLowerCase().includes(search.toLowerCase()) ||
            app.courseName?.toLowerCase().includes(search.toLowerCase());
        const matchStatus = filterStatus === 'all' || app.status === filterStatus;
        return matchSearch && matchStatus;
    });

    if (applications.length === 0) {
        return (
            <div className="rounded-2xl border border-dashed border-slate-200 py-20 text-center text-slate-400">
                <ClipboardList className="mx-auto mb-3 h-10 w-10 opacity-30" />
                <p className="text-base font-medium">No applications yet</p>
                <p className="mt-1 text-sm">Applications submitted via the site will appear here.</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Filters */}
            <div className="flex flex-wrap gap-3">
                <div className="relative flex-1 min-w-48">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search by name, email or course…"
                        className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-700 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/15"
                    />
                </div>
                <div className="flex gap-2">
                    {['all', 'pending', 'approved', 'rejected'].map((s) => (
                        <button
                            key={s}
                            onClick={() => setFilterStatus(s)}
                            className={`rounded-xl border px-3 py-2 text-xs font-semibold capitalize transition ${filterStatus === s
                                ? 'border-emerald-600 bg-emerald-600 text-white'
                                : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                                }`}
                        >
                            {s}
                        </button>
                    ))}
                </div>
            </div>

            {/* List */}
            {filtered.length === 0 ? (
                <p className="py-10 text-center text-sm text-slate-400">No applications match your filter.</p>
            ) : (
                <div className="space-y-3">
                    {filtered.map((app) => {
                        const Icon = STATUS_ICON[app.status] || Clock;
                        const isOpen = expanded === app.id;
                        return (
                            <motion.div
                                key={app.id}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
                            >
                                {/* Summary row */}
                                <div
                                    className="flex cursor-pointer items-center gap-4 px-5 py-4 transition hover:bg-slate-50"
                                    onClick={() => setExpanded(isOpen ? null : app.id)}
                                >
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-emerald-100 to-emerald-200 text-sm font-bold text-emerald-700">
                                        {app.name?.[0]?.toUpperCase() || '?'}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="font-semibold text-slate-800">{app.name}</p>
                                        <p className="mt-0.5 text-xs text-slate-500 truncate">
                                            {app.courseName} · {formatDate(app.submittedAt)}
                                        </p>
                                    </div>

                                    {/* Status badge */}
                                    <div className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${STATUS_STYLE[app.status] || STATUS_STYLE.pending}`}>
                                        <Icon className="h-3 w-3" />
                                        {app.status || 'pending'}
                                    </div>

                                    {/* Expand icon */}
                                    <motion.div
                                        animate={{ rotate: isOpen ? 90 : 0 }}
                                        transition={{ duration: 0.2 }}
                                        className="text-slate-400"
                                    >
                                        <ChevronRight className="h-4 w-4" />
                                    </motion.div>
                                </div>

                                {/* Expanded detail */}
                                <AnimatePresence>
                                    {isOpen && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.25 }}
                                            className="overflow-hidden"
                                        >
                                            <div className="border-t border-slate-100 bg-slate-50 px-5 py-5">
                                                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                                                    <InfoRow icon={<Mail className="h-3.5 w-3.5" />} label="Email" value={app.email} />
                                                    <InfoRow icon={<Phone className="h-3.5 w-3.5" />} label="Phone" value={app.phone} />
                                                    <InfoRow icon={<Calendar className="h-3.5 w-3.5" />} label="Age" value={app.age} />
                                                    <InfoRow icon={<MapPin className="h-3.5 w-3.5" />} label="Address" value={app.address} />
                                                    <InfoRow icon={<GraduationCap className="h-3.5 w-3.5" />} label="Education" value={app.educationLevel} />
                                                    <InfoRow icon={<BookOpen className="h-3.5 w-3.5" />} label="Course Applied" value={app.courseName} />
                                                </div>

                                                {/* Status change buttons */}
                                                <div className="mt-5 flex flex-wrap gap-2 items-center">
                                                    <p className="mr-2 self-center text-xs font-semibold text-slate-500 uppercase tracking-wide">Change Status:</p>
                                                    {['pending', 'approved', 'rejected'].map((s) => (
                                                        <button
                                                            key={s}
                                                            onClick={() => {
                                                                if (app.status !== s) setConfirmPending({ app, newStatus: s });
                                                            }}
                                                            disabled={app.status === s || sendingEmail === app.id}
                                                            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold capitalize transition disabled:opacity-40 ${s === 'approved'
                                                                ? 'bg-emerald-600 text-white hover:bg-emerald-500'
                                                                : s === 'rejected'
                                                                    ? 'bg-rose-600 text-white hover:bg-rose-500'
                                                                    : 'bg-amber-500 text-white hover:bg-amber-400'
                                                                }`}
                                                        >
                                                            {sendingEmail === app.id && app.status !== s ? (
                                                                <svg className="h-3 w-3 animate-spin" viewBox="0 0 24 24" fill="none">
                                                                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="32" strokeDashoffset="12" />
                                                                </svg>
                                                            ) : (
                                                                (s === 'approved' || s === 'rejected') && <Mail className="h-3 w-3" />
                                                            )}
                                                            {s}
                                                        </button>
                                                    ))}
                                                    {(app.status === 'approved' || app.status === 'rejected') && (
                                                        <span className="text-xs text-slate-400 flex items-center gap-1">
                                                            <Mail className="h-3 w-3" /> Email sent on status change
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        );
                    })}
                </div>
            )}

            {/* Status change confirmation */}
            <AnimatePresence>
                {confirmPending && (
                    <ConfirmDialog
                        icon={
                            confirmPending.newStatus === 'approved'
                                ? <CheckCircle className="h-6 w-6 text-emerald-600" />
                                : confirmPending.newStatus === 'rejected'
                                    ? <XCircle className="h-6 w-6 text-rose-600" />
                                    : <Clock className="h-6 w-6 text-amber-500" />
                        }
                        iconBg={
                            confirmPending.newStatus === 'approved' ? 'bg-emerald-100'
                                : confirmPending.newStatus === 'rejected' ? 'bg-rose-100'
                                    : 'bg-amber-100'
                        }
                        title={`Mark as ${confirmPending.newStatus}?`}
                        message={
                            <>
                                Change <strong className="text-slate-700">{confirmPending.app.name}</strong>'s
                                application status to{' '}
                                <strong className="capitalize text-slate-700">{confirmPending.newStatus}</strong>?
                                {(confirmPending.newStatus === 'approved' || confirmPending.newStatus === 'rejected') &&
                                    <span className="block mt-1 text-xs text-slate-400">An email notification will be sent to the applicant.</span>
                                }
                            </>
                        }
                        confirmLabel={`Yes, mark ${confirmPending.newStatus}`}
                        confirmClass={
                            confirmPending.newStatus === 'approved' ? 'bg-emerald-600 hover:bg-emerald-500'
                                : confirmPending.newStatus === 'rejected' ? 'bg-rose-600 hover:bg-rose-500'
                                    : 'bg-amber-500 hover:bg-amber-400'
                        }
                        onConfirm={() => handleStatusChange(confirmPending.app, confirmPending.newStatus)}
                        onCancel={() => setConfirmPending(null)}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}

function InfoRow({ icon, label, value }) {
    return (
        <div className="flex items-start gap-2">
            <span className="mt-0.5 text-slate-400">{icon}</span>
            <div>
                <p className="text-xs text-slate-400">{label}</p>
                <p className="text-sm font-medium text-slate-700">{value || '—'}</p>
            </div>
        </div>
    );
}

// ─── Course Form Slide Panel ───────────────────────────────────────────────────

function CourseFormPanel({ course, onClose, onSuccess }) {
    const isEdit = Boolean(course);
    const [form, setForm] = useState(
        isEdit ? { ...course, topics: course.topics?.length ? course.topics : [''] } : { ...BLANK_COURSE }
    );
    const [saving, setSaving] = useState(false);
    const [errors, setErrors] = useState({});

    function handleChange(e) {
        const { name, value, type, checked } = e.target;
        setForm((p) => ({ ...p, [name]: type === 'checkbox' ? checked : value }));
        if (errors[name]) setErrors((p) => ({ ...p, [name]: undefined }));
    }

    function handleTopicChange(i, val) {
        setForm((p) => {
            const t = [...p.topics];
            t[i] = val;
            return { ...p, topics: t };
        });
    }

    function addTopic() {
        setForm((p) => ({ ...p, topics: [...p.topics, ''] }));
    }

    function removeTopic(i) {
        setForm((p) => ({ ...p, topics: p.topics.filter((_, idx) => idx !== i) }));
    }

    function validate() {
        const e = {};
        if (!form.title.trim()) e.title = 'Required';
        if (!form.category.trim()) e.category = 'Required';
        if (!form.description.trim()) e.description = 'Required';
        if (!form.instructor.trim()) e.instructor = 'Required';
        return e;
    }

    async function handleSubmit(e) {
        e.preventDefault();
        const errs = validate();
        if (Object.keys(errs).length) { setErrors(errs); return; }

        setSaving(true);
        try {
            const payload = {
                ...form,
                lessons: Number(form.lessons) || 0,
                topics: form.topics.filter(Boolean),
                updatedAt: serverTimestamp(),
            };

            if (isEdit) {
                await updateDoc(doc(db, 'courses', course.id), payload);
                onSuccess?.(`Course "${form.title}" updated successfully!`, 'success');
            } else {
                await addDoc(collection(db, 'courses'), { ...payload, createdAt: serverTimestamp() });
                onSuccess?.(`Course "${form.title}" added successfully!`, 'success');
            }
            onClose();
        } catch (err) {
            console.error(err);
            onSuccess?.('Failed to save course. Please try again.', 'error');
        } finally {
            setSaving(false);
        }
    }

    return (
        <>
            {/* Backdrop */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Panel */}
            <motion.aside
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 30, stiffness: 350 }}
                className="fixed right-0 top-0 z-50 flex h-full w-full max-w-lg flex-col bg-white shadow-2xl"
            >
                {/* Header */}
                <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
                    <div>
                        <h2 className="font-bold text-slate-900">{isEdit ? 'Edit Course' : 'Add New Course'}</h2>
                        <p className="text-xs text-slate-500 mt-0.5">Fill in the course details below</p>
                    </div>
                    <button onClick={onClose} className="rounded-full p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
                    {/* Title */}
                    <FormField label="Course Title *" error={errors.title}>
                        <input name="title" value={form.title} onChange={handleChange} placeholder="e.g. Organic Farming Basics" className={fic(errors.title)} />
                    </FormField>

                    {/* Category */}
                    <FormField label="Category *" error={errors.category}>
                        <input name="category" value={form.category} onChange={handleChange} placeholder="e.g. Sustainable Science" className={fic(errors.category)} />
                    </FormField>

                    {/* Image URL */}
                    <FormField label="Image URL" error={errors.imageUrl}>
                        <input name="imageUrl" value={form.imageUrl} onChange={handleChange} placeholder="https://example.com/course-image.jpg" className={fic()} />
                    </FormField>

                    {/* Description */}
                    <FormField label="Description *" error={errors.description}>
                        <textarea name="description" value={form.description} onChange={handleChange} placeholder="Brief course overview…" rows={3} className={fic(errors.description) + ' resize-none'} />
                    </FormField>

                    {/* Row: Level + Duration */}
                    <div className="grid grid-cols-2 gap-3">
                        <FormField label="Level">
                            <select name="level" value={form.level} onChange={handleChange} className={fic()}>
                                {LEVELS.map((l) => <option key={l}>{l}</option>)}
                            </select>
                        </FormField>
                        <FormField label="Duration">
                            <input name="duration" value={form.duration} onChange={handleChange} placeholder="4 weeks" className={fic()} />
                        </FormField>
                    </div>

                    {/* Row: Instructor + Lessons */}
                    <div className="grid grid-cols-2 gap-3">
                        <FormField label="Instructor *" error={errors.instructor}>
                            <input name="instructor" value={form.instructor} onChange={handleChange} placeholder="Dr. Jane Doe" className={fic(errors.instructor)} />
                        </FormField>
                        <FormField label="No. of Lessons">
                            <input type="number" name="lessons" value={form.lessons} onChange={handleChange} placeholder="12" min="0" className={fic()} />
                        </FormField>
                    </div>

                    {/* Topics */}
                    <div>
                        <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-500">
                            Topics / What You'll Learn
                        </label>
                        <div className="space-y-2">
                            {form.topics.map((topic, i) => (
                                <div key={i} className="flex items-center gap-2">
                                    <input
                                        value={topic}
                                        onChange={(e) => handleTopicChange(i, e.target.value)}
                                        placeholder={`Topic ${i + 1}`}
                                        className={fic() + ' flex-1'}
                                    />
                                    <button type="button" onClick={() => removeTopic(i)} className="shrink-0 rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-500 transition">
                                        <X className="h-4 w-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                        <button type="button" onClick={addTopic} className="mt-2 text-xs font-semibold text-emerald-600 hover:text-emerald-700 transition">
                            + Add Topic
                        </button>
                    </div>

                    {/* Mark as New */}
                    <label className="flex cursor-pointer items-center gap-3">
                        <input
                            type="checkbox"
                            name="isNew"
                            checked={form.isNew}
                            onChange={handleChange}
                            className="h-4 w-4 rounded accent-emerald-600"
                        />
                        <span className="text-sm font-medium text-slate-700">Mark as "New" course</span>
                    </label>
                </form>

                {/* Footer */}
                <div className="flex gap-3 border-t border-slate-100 px-6 py-4">
                    <button onClick={onClose} className="flex-1 rounded-xl border border-slate-200 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50">
                        Cancel
                    </button>
                    <motion.button
                        type="button"
                        onClick={handleSubmit}
                        disabled={saving}
                        whileHover={{ scale: saving ? 1 : 1.02 }}
                        whileTap={{ scale: saving ? 1 : 0.97 }}
                        className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-600 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-600/20 transition hover:bg-emerald-500 disabled:opacity-70"
                    >
                        {saving ? (
                            <span className="flex items-center gap-2">
                                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="32" strokeDashoffset="12" />
                                </svg>
                                Saving…
                            </span>
                        ) : (
                            <>
                                <Save className="h-4 w-4" />
                                {isEdit ? 'Save Changes' : 'Add Course'}
                            </>
                        )}
                    </motion.button>
                </div>
            </motion.aside>
        </>
    );
}

// Shared input class helper
function fic(hasError) {
    return `w-full rounded-xl border ${hasError ? 'border-red-300 bg-red-50' : 'border-slate-200 bg-slate-50'} px-3.5 py-2.5 text-sm text-slate-700 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/15`;
}

function FormField({ label, error, children }) {
    return (
        <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">{label}</label>
            {children}
            {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
        </div>
    );
}

// ─── Delete Confirmation Modal ────────────────────────────────────────────────

function DeleteConfirm({ course, onConfirm, onCancel }) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-60 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
            onClick={onCancel}
        >
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ type: 'spring', damping: 25 }}
                className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-100">
                    <AlertTriangle className="h-6 w-6 text-rose-600" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Delete Course?</h3>
                <p className="mt-1 text-sm text-slate-500">
                    Are you sure you want to delete <strong className="text-slate-700">"{course.title}"</strong>? This action cannot be undone.
                </p>
                <div className="mt-6 flex gap-3">
                    <button onClick={onCancel} className="flex-1 rounded-xl border border-slate-200 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50">
                        Cancel
                    </button>
                    <button onClick={onConfirm} className="flex-1 rounded-xl bg-rose-600 py-2.5 text-sm font-semibold text-white transition hover:bg-rose-500">
                        Delete
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
}

// ─── Generic Confirmation Dialog ─────────────────────────────────────────────

function ConfirmDialog({ icon, iconBg = 'bg-slate-100', title, message, confirmLabel = 'Confirm', confirmClass = 'bg-emerald-600 hover:bg-emerald-500', onConfirm, onCancel }) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
            onClick={onCancel}
        >
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 12 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 12 }}
                transition={{ type: 'spring', damping: 25, stiffness: 350 }}
                className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-2xl ${iconBg}`}>
                    {icon}
                </div>
                <h3 className="text-lg font-bold text-slate-900">{title}</h3>
                <div className="mt-1.5 text-sm text-slate-500">{message}</div>
                <div className="mt-6 flex gap-3">
                    <button
                        onClick={onCancel}
                        className="flex-1 rounded-xl border border-slate-200 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className={`flex-1 rounded-xl py-2.5 text-sm font-semibold text-white transition ${confirmClass}`}
                    >
                        {confirmLabel}
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
}

// ─── Sidebar Nav Item ─────────────────────────────────────────────────────────

function NavItem({ id, label, icon: Icon, badge, active, onClick }) {
    return (
        <motion.button
            onClick={() => onClick(id)}
            className={`flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-all ${active
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/30'
                : 'text-white/60 hover:bg-white/10 hover:text-white'
                }`}
            whileHover={{ x: active ? 0 : 3 }}
            whileTap={{ scale: 0.97 }}
        >
            <Icon className="h-4.5 w-4.5 shrink-0" />
            <span className="flex-1 text-left">{label}</span>
            {badge > 0 && (
                <span className="rounded-full bg-amber-500 px-2 py-0.5 text-xs font-bold text-white">
                    {badge}
                </span>
            )}
        </motion.button>
    );
}

// ─── Main Dashboard Component ─────────────────────────────────────────────────

function AdminDashboard() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const toast = useToast();

    const [activeTab, setActiveTab] = useState('overview');
    const [courses, setCourses] = useState([]);
    const [applications, setApplications] = useState([]);
    const [courseLoading, setCourseLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingCourse, setEditingCourse] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

    // ── Real-time Firestore listeners ──────────────────────────────────────────

    useEffect(() => {
        const q = query(collection(db, 'courses'), orderBy('createdAt', 'desc'));
        const unsub = onSnapshot(q, (snap) => {
            setCourses(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
            setCourseLoading(false);
        }, () => setCourseLoading(false));
        return unsub;
    }, []);

    useEffect(() => {
        const q = query(collection(db, 'applications'), orderBy('submittedAt', 'desc'));
        const unsub = onSnapshot(q, (snap) => {
            setApplications(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
        }, () => { });
        return unsub;
    }, []);

    // ── Actions ────────────────────────────────────────────────────────────────

    async function handleLogout() {
        try {
            await logout();
            navigate('/admin/login');
        } catch {
            toast.error('Logout failed. Please try again.');
        }
    }

    async function handleDeleteCourse(id) {
        const target = deleteTarget;
        try {
            await deleteDoc(doc(db, 'courses', id));
            toast.success(`Course "${target?.title}" deleted.`);
        } catch {
            toast.error('Failed to delete course. Please try again.');
        }
        setDeleteTarget(null);
    }

    async function handleUpdateAppStatus(appId, status) {
        await updateDoc(doc(db, 'applications', appId), { status });
    }

    // ── Derived stats ──────────────────────────────────────────────────────────

    const stats = {
        courses: courses.length,
        total: applications.length,
        pending: applications.filter((a) => !a.status || a.status === 'pending').length,
        approved: applications.filter((a) => a.status === 'approved').length,
    };

    const tabHeaders = {
        overview: { title: 'Overview', subtitle: `Welcome back, ${user?.email}` },
        courses: { title: 'Courses', subtitle: `${stats.courses} course${stats.courses !== 1 ? 's' : ''} in database` },
        applications: { title: 'Applications', subtitle: `${stats.total} total · ${stats.pending} pending` },
    };

    // ── Render ─────────────────────────────────────────────────────────────────

    return (
        <div className="flex h-screen overflow-hidden bg-slate-50">

            {/* ── Sidebar ── */}
            <aside className="flex w-64 flex-col shrink-0 bg-[#152219]">
                {/* Brand */}
                <div className="border-b border-white/10 px-6 py-5">
                    <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-600 shadow-lg shadow-emerald-900/40">
                            <Leaf className="h-5 w-5 text-white" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-white">Admin Portal</p>
                            <p className="text-xs text-white/40">Agri Department</p>
                        </div>
                    </div>
                </div>

                {/* Nav */}
                <nav className="flex-1 space-y-1 p-4">
                    <NavItem id="overview" label="Overview" icon={TrendingUp} active={activeTab === 'overview'} onClick={setActiveTab} />
                    <NavItem id="courses" label="Courses" icon={BookOpen} active={activeTab === 'courses'} onClick={setActiveTab} />
                    <NavItem id="applications" label="Applications" icon={ClipboardList} badge={stats.pending} active={activeTab === 'applications'} onClick={setActiveTab} />
                </nav>

                {/* User + logout */}
                <div className="border-t border-white/10 p-4">
                    <div className="mb-3 rounded-xl bg-white/5 px-3 py-2.5">
                        <p className="truncate text-xs font-medium text-white">{user?.email}</p>
                        <p className="text-xs text-white/40">Administrator</p>
                    </div>
                    <button
                        onClick={() => setShowLogoutConfirm(true)}
                        className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-white/50 transition hover:bg-white/10 hover:text-white"
                    >
                        <LogOut className="h-4 w-4" />
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* ── Main ── */}
            <div className="flex flex-1 flex-col overflow-hidden">

                {/* Top bar */}
                <header className="flex shrink-0 items-center justify-between border-b border-slate-100 bg-white px-8 py-4">
                    <div>
                        <h1 className="text-xl font-bold text-slate-900 capitalize">{tabHeaders[activeTab]?.title}</h1>
                        <p className="mt-0.5 text-xs text-slate-500">{tabHeaders[activeTab]?.subtitle}</p>
                    </div>
                    {activeTab === 'courses' && (
                        <motion.button
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => { setEditingCourse(null); setShowForm(true); }}
                            className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-600/20 transition hover:bg-emerald-500"
                        >
                            <Plus className="h-4 w-4" />
                            Add Course
                        </motion.button>
                    )}
                </header>

                {/* Content area */}
                <main className="flex-1 overflow-y-auto p-8">
                    <AnimatePresence mode="wait">
                        {activeTab === 'overview' && (
                            <motion.div key="overview" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                <Overview stats={stats} recentApps={applications.slice(0, 5)} />
                            </motion.div>
                        )}
                        {activeTab === 'courses' && (
                            <motion.div key="courses" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                <CoursesTab
                                    courses={courses}
                                    loading={courseLoading}
                                    onEdit={(c) => { setEditingCourse(c); setShowForm(true); }}
                                    onDelete={(c) => setDeleteTarget(c)}
                                />
                            </motion.div>
                        )}
                        {activeTab === 'applications' && (
                            <motion.div key="applications" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                <ApplicationsTab applications={applications} onUpdateStatus={handleUpdateAppStatus} />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </main>
            </div>

            {/* Course form slide panel */}
            <AnimatePresence>
                {showForm && (
                    <CourseFormPanel
                        course={editingCourse}
                        onClose={() => { setShowForm(false); setEditingCourse(null); }}
                        onSuccess={(msg, type) => { toast[type]?.(msg); setShowForm(false); setEditingCourse(null); }}
                    />
                )}
            </AnimatePresence>

            {/* Delete confirmation */}
            <AnimatePresence>
                {deleteTarget && (
                    <DeleteConfirm
                        course={deleteTarget}
                        onConfirm={() => handleDeleteCourse(deleteTarget.id)}
                        onCancel={() => setDeleteTarget(null)}
                    />
                )}
            </AnimatePresence>

            {/* Logout confirmation */}
            <AnimatePresence>
                {showLogoutConfirm && (
                    <ConfirmDialog
                        icon={<LogOut className="h-6 w-6 text-slate-600" />}
                        iconBg="bg-slate-100"
                        title="Sign out?"
                        message="Are you sure you want to sign out of the admin portal?"
                        confirmLabel="Yes, sign out"
                        confirmClass="bg-slate-700 hover:bg-slate-600"
                        onConfirm={handleLogout}
                        onCancel={() => setShowLogoutConfirm(false)}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}

export default AdminDashboard;
