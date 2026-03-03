import { Mail, Phone, MapPin, Shield } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import logoSrc from "../assets/img/Department-LOGO.png";

const Footer = () => {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="bg-[#1f2e24] py-12 text-white"
    >
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="md:col-span-2"
          >
            <div className="mb-4 flex items-center gap-3">
              <img
                src={logoSrc}
                alt="Agriculture Department"
                className="h-15 w-auto object-contain"
                loading="lazy"
              />
              {/* <span className="text-xl font-semibold">
                Agriculture Department
              </span> */}
            </div>
            <p className="max-w-md text-primary-foreground/70">
              Empowering farmers with knowledge and skills to build a
              sustainable agricultural future. Join thousands of learners
              transforming their farming practices.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <h3 className="mb-4 text-lg font-semibold">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="text-primary-foreground/70 transition-colors hover:text-primary-foreground"
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href="#courses"
                  className="text-primary-foreground/70 transition-colors hover:text-primary-foreground"
                >
                  All Courses
                </a>
              </li>
              <li>
                <a
                  href="#new-courses"
                  className="text-primary-foreground/70 transition-colors hover:text-primary-foreground"
                >
                  New Courses
                </a>
              </li>
              <li>
                <Link
                  to="/about"
                  className="text-primary-foreground/70 transition-colors hover:text-primary-foreground"
                >
                  About Us
                </Link>
              </li>
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            <h3 className="mb-4 text-lg font-semibold">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-primary-foreground/70">
                <Mail className="h-4 w-4" />
                <span>info@agridept.edu</span>
              </li>
              <li className="flex items-center gap-2 text-primary-foreground/70">
                <Phone className="h-4 w-4" />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center gap-2 text-primary-foreground/70">
                <MapPin className="h-4 w-4" />
                <span>123 Farm Road, Agriculture City</span>
              </li>
            </ul>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mt-8 flex flex-col items-center justify-between gap-3 border-t border-primary-foreground/20 pt-8 sm:flex-row"
        >
          <p className="text-sm text-primary-foreground/60">
            &copy; {new Date().getFullYear()} Agriculture Department. All rights reserved.
          </p>
          <Link
            to="/admin/login"
            className="flex items-center gap-1.5 rounded-full border border-white/10 px-3 py-1.5 text-xs text-white/30 transition hover:border-emerald-500/40 hover:text-emerald-400"
          >
            <Shield className="h-3 w-3" />
            Admin Login
          </Link>
        </motion.div>
      </div>
    </motion.footer>
  );
};

export default Footer;
