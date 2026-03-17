import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  SlidersHorizontal,
  X,
  ChevronDown,
  BookOpen,
} from "lucide-react";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import CourseCard from "../components/CourseCard";
import Hero from "../components/Hero";

const PAGE_SIZE = 6;

// ─── Skeleton Card ────────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm animate-pulse">
      <div className="h-44 w-full bg-slate-200" />
      <div className="p-4 space-y-3">
        <div className="h-3 w-1/3 rounded-full bg-slate-200" />
        <div className="h-4 w-2/3 rounded-full bg-slate-200" />
        <div className="h-3 w-full rounded-full bg-slate-100" />
        <div className="h-3 w-4/5 rounded-full bg-slate-100" />
      </div>
    </div>
  );
}

function Home() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [showFilter, setShowFilter] = useState(false);
  const filterRef = useRef(null);

  // ── Firestore real-time listener ──────────────────────────────────────────
  useEffect(() => {
    const q = query(collection(db, "courses"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(
      q,
      (snap) => {
        setCourses(
          snap.docs.map((d) => ({
            id: d.id,
            ...d.data(),
            image: d.data().imageUrl || "",
          })),
        );
        setLoading(false);
      },
      () => setLoading(false),
    );
    return unsub;
  }, []);

  // ── Close filter panel when clicking outside ──────────────────────────────
  useEffect(() => {
    function handleClickOutside(e) {
      if (filterRef.current && !filterRef.current.contains(e.target)) {
        setShowFilter(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ── Derived data ──────────────────────────────────────────────────────────
  // Courses marked isComingSoon go to "Upcoming" section
  const upcomingCourses = courses.filter((c) => c.isComingSoon);

  // All unique categories from DB
  const allCategories = [
    ...new Set(courses.map((c) => c.category).filter(Boolean)),
  ].sort();

  // Filter all courses by search + category (exclude upcoming courses)
  const filteredCourses = courses.filter((course) => {
    const matchSearch =
      course.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.category?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCat =
      selectedCategories.length === 0 ||
      selectedCategories.includes(course.category);
    const notUpcoming = !course.isComingSoon;
    return matchSearch && matchCat && notUpcoming;
  });

  const visibleCourses = filteredCourses.slice(0, visibleCount);
  const remaining = filteredCourses.length - visibleCount;
  const hasMore = remaining > 0;

  // ── Handlers ─────────────────────────────────────────────────────────────
  function toggleCategory(cat) {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat],
    );
    setVisibleCount(PAGE_SIZE);
  }

  function clearFilters() {
    setSelectedCategories([]);
    setSearchQuery("");
    setVisibleCount(PAGE_SIZE);
  }

  function handleSearchChange(e) {
    setSearchQuery(e.target.value);
    setVisibleCount(PAGE_SIZE);
  }

  const activeFilterCount = selectedCategories.length;

  return (
    <>
      <Hero />
      <main className="flex flex-col gap-10 pb-16 pt-4">
        {/* ── Upcoming / New Courses ── */}
        {(loading || upcomingCourses.length > 0) && (
          <motion.section
            id="new-courses"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8 }}
          >
            <div className="container mx-auto px-4 py-16">
              <motion.h2
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="mb-12 text-center text-3xl font-bold text-slate-900 md:text-4xl"
              >
                Upcoming Courses
              </motion.h2>
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                variants={{
                  hidden: { opacity: 0 },
                  visible: {
                    opacity: 1,
                    transition: { staggerChildren: 0.15 },
                  },
                }}
                className="mx-auto grid max-w-6xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
              >
                {loading
                  ? Array.from({ length: 3 }).map((_, i) => (
                      <SkeletonCard key={i} />
                    ))
                  : upcomingCourses.map((course) => (
                      <CourseCard
                        key={course.id}
                        id={course.id}
                        title={course.title}
                        category={course.category}
                        image={course.image}
                        isComingSoon={course.isComingSoon}
                      />
                    ))}
              </motion.div>
            </div>
          </motion.section>
        )}

        {/* ── All Courses ── */}
        <section id="courses" className="py-4">
          <div className="container mx-auto px-4">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mb-12 text-center text-3xl font-bold text-slate-900 md:text-4xl"
            >
              All Courses
            </motion.h2>

            {/* ── Search + Filter row ── */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mx-auto mb-6 flex max-w-2xl flex-col gap-3 sm:flex-row"
            >
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search courses or categories…"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="w-full rounded-full border border-slate-200 bg-white py-2.5 pl-10 pr-10 text-sm text-slate-700 shadow-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                />
                {searchQuery && (
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setVisibleCount(PAGE_SIZE);
                    }}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              {/* Filter button */}
              <div className="relative" ref={filterRef}>
                <button
                  type="button"
                  onClick={() => setShowFilter((v) => !v)}
                  className={`inline-flex items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-semibold shadow-sm transition
                    ${
                      activeFilterCount > 0
                        ? "border-emerald-600 bg-emerald-600 text-white hover:bg-emerald-500"
                        : "border-slate-300 bg-white text-slate-700 hover:border-emerald-500 hover:text-emerald-700"
                    }`}
                >
                  <SlidersHorizontal className="h-4 w-4" />
                  Filter
                  {activeFilterCount > 0 && (
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white text-xs font-bold text-emerald-700">
                      {activeFilterCount}
                    </span>
                  )}
                  <ChevronDown
                    className={`h-3.5 w-3.5 transition-transform ${showFilter ? "rotate-180" : ""}`}
                  />
                </button>

                {/* Filter dropdown */}
                <AnimatePresence>
                  {showFilter && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.97 }}
                      transition={{ duration: 0.18 }}
                      className="absolute right-0 z-20 mt-2 w-64 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl"
                    >
                      <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
                        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                          Filter by Category
                        </span>
                        {activeFilterCount > 0 && (
                          <button
                            onClick={clearFilters}
                            className="text-xs font-semibold text-emerald-600 hover:text-emerald-500"
                          >
                            Clear all
                          </button>
                        )}
                      </div>

                      <div className="max-h-60 overflow-y-auto p-2">
                        {allCategories.length === 0 ? (
                          <p className="py-4 text-center text-xs text-slate-400">
                            No categories yet
                          </p>
                        ) : (
                          allCategories.map((cat) => {
                            const active = selectedCategories.includes(cat);
                            return (
                              <button
                                key={cat}
                                onClick={() => toggleCategory(cat)}
                                className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-sm transition
                                ${active ? "bg-emerald-50 font-semibold text-emerald-700" : "text-slate-600 hover:bg-slate-50"}`}
                              >
                                <span>{cat}</span>
                                {active && (
                                  <div className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-600">
                                    <svg
                                      className="h-2.5 w-2.5 text-white"
                                      viewBox="0 0 12 12"
                                      fill="none"
                                    >
                                      <path
                                        d="M2 6l3 3 5-5"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                      />
                                    </svg>
                                  </div>
                                )}
                              </button>
                            );
                          })
                        )}
                      </div>

                      <div className="border-t border-slate-100 px-4 py-2.5 text-center">
                        <button
                          onClick={() => setShowFilter(false)}
                          className="text-xs font-semibold text-slate-500 hover:text-slate-700"
                        >
                          Done
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>

            {/* Active filter chips */}
            <AnimatePresence>
              {(activeFilterCount > 0 || searchQuery) && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mx-auto mb-6 flex max-w-2xl flex-wrap items-center gap-2 overflow-hidden"
                >
                  {selectedCategories.map((cat) => (
                    <span
                      key={cat}
                      className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700"
                    >
                      {cat}
                      <button onClick={() => toggleCategory(cat)}>
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                  {(activeFilterCount > 0 || searchQuery) && (
                    <button
                      onClick={clearFilters}
                      className="text-xs font-semibold text-slate-400 underline hover:text-slate-600"
                    >
                      Clear all
                    </button>
                  )}
                  <span className="text-xs text-slate-400">
                    {filteredCourses.length} course
                    {filteredCourses.length !== 1 ? "s" : ""} found
                  </span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Course grid */}
            {loading ? (
              <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            ) : (
              <>
                <motion.div
                  layout
                  className="mx-auto grid max-w-6xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
                >
                  <AnimatePresence mode="popLayout">
                    {visibleCourses.map((course) => (
                      <motion.div
                        key={course.id}
                        layout
                        initial={{ opacity: 0, scale: 0.94 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.94 }}
                        transition={{ duration: 0.25 }}
                      >
                        <CourseCard
                          id={course.id}
                          title={course.title}
                          category={course.category}
                          image={course.image}
                          isNew={course.isNew}
                        />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>

                {/* Empty state */}
                {filteredCourses.length === 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-16 flex flex-col items-center gap-3 text-center"
                  >
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">
                      {searchQuery || activeFilterCount > 0 ? (
                        <Search className="h-6 w-6 text-slate-400" />
                      ) : (
                        <BookOpen className="h-6 w-6 text-slate-400" />
                      )}
                    </div>
                    <p className="font-semibold text-slate-600">
                      {searchQuery || activeFilterCount > 0
                        ? "No courses found"
                        : "No courses added yet"}
                    </p>
                    <p className="text-sm text-slate-400">
                      {searchQuery || activeFilterCount > 0
                        ? "Try adjusting your search or clearing the filters."
                        : "Courses added by the admin will appear here."}
                    </p>
                    {(searchQuery || activeFilterCount > 0) && (
                      <button
                        onClick={clearFilters}
                        className="mt-1 rounded-full bg-emerald-600 px-6 py-2 text-sm font-semibold text-white transition hover:bg-emerald-500"
                      >
                        Clear Filters
                      </button>
                    )}
                  </motion.div>
                )}

                {/* Load More */}
                {hasMore && (
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-12 flex flex-col items-center gap-2"
                  >
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.96 }}
                      onClick={() => setVisibleCount((v) => v + PAGE_SIZE)}
                      className="rounded-full border-2 border-emerald-600 px-8 py-3 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-600 hover:text-white"
                    >
                      Load More ({remaining} more course
                      {remaining !== 1 ? "s" : ""})
                    </motion.button>
                    <p className="text-xs text-slate-400">
                      Showing {visibleCount} of {filteredCourses.length} courses
                    </p>
                  </motion.div>
                )}
              </>
            )}
          </div>
        </section>
      </main>
    </>
  );
}

export default Home;
