import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { BookOpen, X, Menu } from "lucide-react";
import logoSrc from "../assets/img/Department-LOGO.png";

const navLinks = [
  { name: "Home", to: "/" },
  { name: "Courses", href: "/#courses" },   // scroll link, not a route
  { name: "About Us", to: "/about" },
];

/** Decide which nav label should be underlined based on the current pathname. */
function getActiveLink(pathname) {
  if (pathname === "/") return "Home";
  if (pathname === "/about") return "About Us";
  if (pathname.startsWith("/course/")) return "Courses"; // course detail → highlight Courses
  return null;
}

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  // Tracks which nav item the user most recently clicked (so "Courses" underlines on click)
  const [clickedLink, setClickedLink] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();

  // Route-derived active link
  const routeActive = getActiveLink(location.pathname);
  // Use route when it gives a definite answer, otherwise fall back to the last click
  const activeLink = routeActive ?? clickedLink;

  // Clear clickedLink whenever the route changes
  useEffect(() => {
    setClickedLink(null);
  }, [location.pathname]);

  // ── Scroll watcher ────────────────────────────────────────────────────────
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // ── Close mobile menu on desktop resize ───────────────────────────────────
  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 640) setIsMenuOpen(false); };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // ── Courses click: mark active + scroll to section ────────────────────────
  function handleCoursesClick(e) {
    e.preventDefault();
    setIsMenuOpen(false);
    setClickedLink("Courses");

    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        document.getElementById("courses")?.scrollIntoView({ behavior: "smooth" });
      }, 120);
    } else {
      document.getElementById("courses")?.scrollIntoView({ behavior: "smooth" });
    }
  }

  // ── Render a single desktop nav item ─────────────────────────────────────
  function DesktopNavItem({ link, index }) {
    const isActive = activeLink === link.name;

    const baseClass =
      "group relative px-4 py-2 text-sm font-medium transition-colors duration-200 " +
      (isActive ? "text-emerald-700 font-semibold" : "text-slate-600 hover:text-emerald-700");

    const underlines = (
      <>
        {/* Permanent underline when active */}
        {isActive && (
          <motion.span
            layoutId="nav-indicator"
            className="absolute bottom-0 left-3 right-3 h-0.5 rounded-full bg-emerald-600"
            transition={{ type: "spring", stiffness: 380, damping: 30 }}
          />
        )}
        {/* Hover underline when not active */}
        {!isActive && (
          <span className="absolute bottom-0 left-3 right-3 h-0.5 scale-x-0 rounded-full bg-emerald-300 transition-transform duration-200 group-hover:scale-x-100" />
        )}
      </>
    );

    if (link.href) {
      return (
        <motion.a
          href={link.href}
          onClick={handleCoursesClick}
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 + index * 0.07, duration: 0.4 }}
          className={baseClass}
        >
          {link.name}
          {underlines}
        </motion.a>
      );
    }

    return (
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08 + index * 0.07, duration: 0.4 }}
      >
        <Link
          to={link.to}
          onClick={() => setClickedLink(null)}
          className={baseClass}
        >
          {link.name}
          {underlines}
        </Link>
      </motion.div>
    );
  }

  // ── Render a single mobile nav item ──────────────────────────────────────
  function MobileNavItem({ link, index }) {
    const isActive = activeLink === link.name;

    const cls =
      "flex items-center rounded-xl px-3 py-3 text-sm font-medium transition " +
      (isActive
        ? "bg-emerald-50 text-emerald-700 font-semibold"
        : "text-slate-700 hover:bg-emerald-50 hover:text-emerald-700");

    if (link.href) {
      return (
        <motion.a
          href={link.href}
          onClick={handleCoursesClick}
          initial={{ x: -16, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: index * 0.07 }}
          className={cls}
        >
          {link.name}
        </motion.a>
      );
    }

    return (
      <motion.div
        initial={{ x: -16, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: index * 0.07 }}
      >
        <Link
          to={link.to}
          onClick={() => { setIsMenuOpen(false); setClickedLink(null); }}
          className={cls}
        >
          {link.name}
        </Link>
      </motion.div>
    );
  }

  // ── JSX ──────────────────────────────────────────────────────────────────
  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.55, ease: "easeOut" }}
        className={`fixed left-0 right-0 top-0 z-40 transition-all duration-300 ${scrolled
            ? "bg-white/95 shadow-md shadow-black/5 backdrop-blur-xl"
            : "bg-white/80 backdrop-blur-md"
          }`}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">

          {/* Logo */}
          <Link to="/" className="flex shrink-0 items-center gap-2.5" onClick={() => setIsMenuOpen(false)}>
            <img src={logoSrc} alt="Department of Agriculture" className="h-12 w-auto object-contain" loading="eager" />
          </Link>

          {/* Desktop nav links */}
          <nav className="hidden items-center gap-1 sm:flex">
            {navLinks.map((link, i) => (
              <DesktopNavItem key={link.name} link={link} index={i} />
            ))}
          </nav>

          {/* Desktop CTA */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.35, duration: 0.4 }}
            className="hidden sm:block"
          >
            <motion.a
              href="/#courses"
              onClick={handleCoursesClick}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-emerald-600/25 transition hover:bg-emerald-500"
            >
              <BookOpen className="h-4 w-4" />
              Browse Courses
            </motion.a>
          </motion.div>

          {/* Mobile hamburger */}
          <motion.button
            type="button"
            whileTap={{ scale: 0.88 }}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            onClick={() => setIsMenuOpen((v) => !v)}
            className="relative flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-emerald-400 sm:hidden"
          >
            <AnimatePresence mode="wait" initial={false}>
              {isMenuOpen ? (
                <motion.span key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.18 }}>
                  <X className="h-5 w-5" />
                </motion.span>
              ) : (
                <motion.span key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.18 }}>
                  <Menu className="h-5 w-5" />
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              key="mobile-menu"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.28, ease: "easeInOut" }}
              className="overflow-hidden border-t border-slate-100 bg-white/98 backdrop-blur-xl sm:hidden"
            >
              <nav className="flex flex-col gap-1 px-5 py-4">
                {navLinks.map((link, i) => (
                  <MobileNavItem key={link.name} link={link} index={i} />
                ))}
                {/* Mobile CTA */}
                <motion.div
                  initial={{ x: -16, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: navLinks.length * 0.07 + 0.05 }}
                  className="mt-3 border-t border-slate-100 pt-3"
                >
                  <a
                    href="/#courses"
                    onClick={handleCoursesClick}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3 text-sm font-semibold text-white transition hover:bg-emerald-500"
                  >
                    <BookOpen className="h-4 w-4" />
                    Browse Courses
                  </a>
                </motion.div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Scroll border */}
        <motion.div
          animate={{ opacity: scrolled ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-200 to-transparent"
        />
      </motion.header>

      {/* Mobile backdrop */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMenuOpen(false)}
            className="fixed inset-0 z-30 bg-black/20 sm:hidden"
          />
        )}
      </AnimatePresence>
    </>
  );
}

export default Header;
