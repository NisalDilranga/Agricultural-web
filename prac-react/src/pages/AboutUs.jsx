import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
    Leaf, Target, Eye, Heart, Lightbulb, Users, BookOpen,
    Award, Globe, ArrowRight, CheckCircle, Sprout, Shield,
    TrendingUp, MapPin,
} from 'lucide-react';

// ─── Data ──────────────────────────────────────────────────────────────────

const stats = [
    { value: '1948', label: 'Year Established', icon: Shield },
    { value: '50K+', label: 'Farmers Trained', icon: Users },
    { value: '25+', label: 'Courses Available', icon: BookOpen },
    { value: '9', label: 'Provinces Covered', icon: MapPin },
];

const values = [
    {
        icon: Leaf,
        title: 'Sustainability',
        description:
            'We champion farming practices that protect the environment and ensure long-term food security for future generations.',
        color: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    },
    {
        icon: Lightbulb,
        title: 'Innovation',
        description:
            'We embrace modern agricultural technologies and research to equip farmers with cutting-edge tools and knowledge.',
        color: 'bg-amber-50 text-amber-600 border-amber-100',
    },
    {
        icon: Heart,
        title: 'Community',
        description:
            'We build strong networks among farmers, researchers, and policymakers to foster a thriving agricultural community.',
        color: 'bg-rose-50 text-rose-600 border-rose-100',
    },
    {
        icon: Award,
        title: 'Excellence',
        description:
            'We are committed to delivering world-class agricultural education that meets the highest standards of quality.',
        color: 'bg-blue-50 text-blue-600 border-blue-100',
    },
];

const team = [
    {
        initials: 'DR',
        name: 'Dr. Roshan Fernando',
        role: 'Director General',
        description: 'Over 25 years of experience in agricultural policy, research, and rural development across South Asia.',
        color: 'from-emerald-500 to-teal-600',
    },
    {
        initials: 'SP',
        name: 'Dr. Sandya Perera',
        role: 'Head of Education',
        description: 'Leads the curriculum design and oversees all training programs with a focus on sustainable farming.',
        color: 'from-amber-500 to-orange-600',
    },
    {
        initials: 'MK',
        name: 'Eng. Mahesh Kumar',
        role: 'Agri-Tech Lead',
        description: 'Spearheads the digital transformation of agricultural practices through precision farming and IoT.',
        color: 'from-blue-500 to-indigo-600',
    },
    {
        initials: 'PN',
        name: 'Prof. Priya Nanayakkara',
        role: 'Research Director',
        description: 'Leads groundbreaking research in soil science, crop genetics and climate-resilient agriculture.',
        color: 'from-rose-500 to-pink-600',
    },
    {
        initials: 'AJ',
        name: 'Ms. Amali Jayawardena',
        role: 'Community Relations',
        description: 'Bridges the gap between rural farming communities and government support programs island-wide.',
        color: 'from-purple-500 to-violet-600',
    },
    {
        initials: 'RL',
        name: 'Mr. Rajan Liyanage',
        role: 'Field Operations',
        description: 'Manages on-the-ground training programs and extension services across all nine provinces.',
        color: 'from-cyan-500 to-sky-600',
    },
];

const milestones = [
    { year: '1948', event: 'Department of Agriculture established at Independence.' },
    { year: '1975', event: 'Launched the first national farmer training program.' },
    { year: '1998', event: 'Introduced computer-aided agricultural research facilities.' },
    { year: '2010', event: 'Expanded outreach to all 9 provinces with mobile units.' },
    { year: '2018', event: 'Launched precision agriculture and drone pilot programs.' },
    { year: '2024', event: 'Introduced online learning platform for remote farmers.' },
];

// ─── Section fade-in variant ────────────────────────────────────────────────

const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const stagger = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.12 } },
};

// ─── Component ──────────────────────────────────────────────────────────────

function AboutUs() {
    return (
        <div className="min-h-screen bg-[#faf8f5]">

            {/* ── Hero ── */}
            <section className="relative overflow-hidden bg-gradient-to-br from-[#0d1f12] via-[#1a3324] to-[#102518] pt-32 pb-24">
                {/* Decorative blobs */}
                <div className="pointer-events-none absolute inset-0">
                    <div className="absolute -left-32 top-0 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl" />
                    <div className="absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-emerald-600/10 blur-3xl" />
                </div>

                <div className="container relative mx-auto max-w-5xl px-6 text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-600 shadow-2xl shadow-emerald-600/30"
                    >
                        <Sprout className="h-8 w-8 text-white" />
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.15, duration: 0.7 }}
                        className="text-4xl font-bold text-white sm:text-5xl lg:text-6xl"
                    >
                        About the{' '}
                        <span className="bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
                            Department
                        </span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.7 }}
                        className="mx-auto mt-5 max-w-2xl text-lg text-white/65"
                    >
                        Empowering Sri Lanka's agricultural sector since 1948 through education,
                        research, and sustainable farming innovation.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.45, duration: 0.7 }}
                        className="mt-8 flex flex-wrap items-center justify-center gap-4"
                    >
                        <Link
                            to="/#courses"
                            className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-600/30 transition hover:bg-emerald-500"
                        >
                            <BookOpen className="h-4 w-4" />
                            Explore Courses
                        </Link>
                        <a
                            href="#mission"
                            className="inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white/80 transition hover:border-white/40 hover:text-white"
                        >
                            Learn More
                            <ArrowRight className="h-4 w-4" />
                        </a>
                    </motion.div>
                </div>
            </section>

            {/* ── Stats band ── */}
            <section className="bg-emerald-700 py-12">
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                    variants={stagger}
                    className="container mx-auto grid max-w-5xl grid-cols-2 gap-6 px-6 lg:grid-cols-4"
                >
                    {stats.map(({ value, label, icon: Icon }) => (
                        <motion.div
                            key={label}
                            variants={fadeUp}
                            className="flex flex-col items-center text-center"
                        >
                            <Icon className="mb-2 h-6 w-6 text-emerald-200" />
                            <p className="text-3xl font-extrabold text-white">{value}</p>
                            <p className="mt-1 text-sm text-emerald-200">{label}</p>
                        </motion.div>
                    ))}
                </motion.div>
            </section>

            {/* ── Mission & Vision ── */}
            <section id="mission" className="py-20">
                <div className="container mx-auto max-w-5xl px-6">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.2 }}
                        variants={stagger}
                        className="grid grid-cols-1 gap-8 md:grid-cols-2"
                    >
                        {/* Mission */}
                        <motion.div
                            variants={fadeUp}
                            className="rounded-3xl border border-emerald-100 bg-white p-8 shadow-sm"
                        >
                            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100">
                                <Target className="h-6 w-6 text-emerald-600" />
                            </div>
                            <h2 className="mb-3 text-2xl font-bold text-slate-900">Our Mission</h2>
                            <p className="leading-relaxed text-slate-600">
                                To advance agriculture in Sri Lanka by providing accessible, high-quality
                                education and training programs that empower farmers with modern knowledge,
                                sustainable techniques, and innovative tools — strengthening rural
                                livelihoods and national food security.
                            </p>
                            <ul className="mt-5 space-y-2">
                                {['Accessible education for all farmers', 'Science-based farming practices', 'Support for small-scale agriculture'].map((item) => (
                                    <li key={item} className="flex items-center gap-2 text-sm text-slate-600">
                                        <CheckCircle className="h-4 w-4 shrink-0 text-emerald-500" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </motion.div>

                        {/* Vision */}
                        <motion.div
                            variants={fadeUp}
                            className="rounded-3xl border border-blue-100 bg-white p-8 shadow-sm"
                        >
                            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100">
                                <Eye className="h-6 w-6 text-blue-600" />
                            </div>
                            <h2 className="mb-3 text-2xl font-bold text-slate-900">Our Vision</h2>
                            <p className="leading-relaxed text-slate-600">
                                A Sri Lanka where every farmer thrives through knowledge, technology, and
                                sustainable practices — becoming a regional leader in climate-smart
                                agriculture and ensuring food sovereignty for present and future generations.
                            </p>
                            <ul className="mt-5 space-y-2">
                                {['Climate-resilient food systems', 'Technology-driven farming', 'Regional agricultural leadership'].map((item) => (
                                    <li key={item} className="flex items-center gap-2 text-sm text-slate-600">
                                        <CheckCircle className="h-4 w-4 shrink-0 text-blue-500" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* ── Values ── */}
            <section className="bg-white py-20">
                <div className="container mx-auto max-w-5xl px-6">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.2 }}
                        variants={fadeUp}
                        className="mb-12 text-center"
                    >
                        <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-emerald-600">
                            What We Stand For
                        </p>
                        <h2 className="text-3xl font-bold text-slate-900 md:text-4xl">Our Core Values</h2>
                    </motion.div>

                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.1 }}
                        variants={stagger}
                        className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
                    >
                        {values.map(({ icon: Icon, title, description, color }) => (
                            <motion.div
                                key={title}
                                variants={fadeUp}
                                whileHover={{ y: -6 }}
                                className="rounded-2xl border bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
                            >
                                <div className={`mb-4 flex h-11 w-11 items-center justify-center rounded-xl border ${color}`}>
                                    <Icon className="h-5 w-5" />
                                </div>
                                <h3 className="mb-2 font-bold text-slate-900">{title}</h3>
                                <p className="text-sm leading-relaxed text-slate-500">{description}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* ── Timeline ── */}
            <section className="py-20">
                <div className="container mx-auto max-w-3xl px-6">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.2 }}
                        variants={fadeUp}
                        className="mb-12 text-center"
                    >
                        <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-emerald-600">
                            Our Journey
                        </p>
                        <h2 className="text-3xl font-bold text-slate-900 md:text-4xl">Key Milestones</h2>
                    </motion.div>

                    <div className="relative">
                        {/* Vertical line */}
                        <div className="absolute left-6 top-0 h-full w-0.5 bg-emerald-100 sm:left-1/2 sm:-ml-px" />

                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, amount: 0.1 }}
                            variants={stagger}
                            className="space-y-8"
                        >
                            {milestones.map(({ year, event }, i) => (
                                <motion.div
                                    key={year}
                                    variants={fadeUp}
                                    className={`relative flex gap-6 sm:gap-0 ${i % 2 === 0 ? 'sm:flex-row' : 'sm:flex-row-reverse'}`}
                                >
                                    {/* Content */}
                                    <div className={`w-full pl-14 sm:w-1/2 sm:pl-0 ${i % 2 === 0 ? 'sm:pr-10 sm:text-right' : 'sm:pl-10'}`}>
                                        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
                                            <span className="text-xs font-bold text-emerald-600">{year}</span>
                                            <p className="mt-1 text-sm text-slate-600">{event}</p>
                                        </div>
                                    </div>

                                    {/* Dot */}
                                    <div className="absolute left-4 top-5 flex h-5 w-5 items-center justify-center rounded-full border-2 border-emerald-500 bg-white shadow sm:left-1/2 sm:-ml-2.5 sm:top-6">
                                        <div className="h-2 w-2 rounded-full bg-emerald-500" />
                                    </div>

                                    {/* Spacer for alternating side */}
                                    <div className="hidden sm:block sm:w-1/2" />
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ── Team ── */}
            <section className="bg-white py-20">
                <div className="container mx-auto max-w-5xl px-6">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.2 }}
                        variants={fadeUp}
                        className="mb-12 text-center"
                    >
                        <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-emerald-600">
                            The People Behind It
                        </p>
                        <h2 className="text-3xl font-bold text-slate-900 md:text-4xl">Meet Our Team</h2>
                        <p className="mx-auto mt-3 max-w-xl text-slate-500">
                            Dedicated professionals working tirelessly to transform agriculture through education and innovation.
                        </p>
                    </motion.div>

                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.1 }}
                        variants={stagger}
                        className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
                    >
                        {team.map(({ initials, name, role, description, color }) => (
                            <motion.div
                                key={name}
                                variants={fadeUp}
                                whileHover={{ y: -6 }}
                                className="group overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition-shadow hover:shadow-lg"
                            >
                                {/* Avatar banner */}
                                <div className={`flex h-28 items-center justify-center bg-gradient-to-br ${color}`}>
                                    <span className="text-3xl font-extrabold text-white/90 tracking-wide">{initials}</span>
                                </div>
                                <div className="p-5">
                                    <h3 className="font-bold text-slate-900">{name}</h3>
                                    <p className="mb-2 text-xs font-semibold text-emerald-600">{role}</p>
                                    <p className="text-sm leading-relaxed text-slate-500">{description}</p>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* ── CTA ── */}
            <section className="bg-gradient-to-br from-[#0d1f12] via-[#1a3324] to-[#102518] py-20">
                <div className="container mx-auto max-w-3xl px-6 text-center">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.3 }}
                        variants={fadeUp}
                    >
                        <Globe className="mx-auto mb-5 h-12 w-12 text-emerald-400" />
                        <h2 className="text-3xl font-bold text-white md:text-4xl">
                            Ready to Grow Your Agricultural Knowledge?
                        </h2>
                        <p className="mx-auto mt-4 max-w-xl text-white/60">
                            Join thousands of farmers and agri-professionals who are transforming their
                            practices through our expert-led courses — all completely free.
                        </p>
                        <div className="mt-8 flex flex-wrap justify-center gap-4">
                            <Link
                                to="/#courses"
                                className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-8 py-3.5 text-sm font-semibold text-white shadow-xl shadow-emerald-600/30 transition hover:bg-emerald-500"
                            >
                                <BookOpen className="h-4 w-4" />
                                Browse All Courses
                            </Link>
                            <Link
                                to="/"
                                className="inline-flex items-center gap-2 rounded-full border border-white/20 px-8 py-3.5 text-sm font-semibold text-white/80 transition hover:border-white/40 hover:text-white"
                            >
                                Back to Home
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>

        </div>
    );
}

export default AboutUs;
