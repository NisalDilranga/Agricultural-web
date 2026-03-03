import { motion } from "framer-motion";

function SectionHeading({ id, title, subtitle }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="mb-5 flex flex-col items-start gap-2 sm:flex-row sm:items-end sm:justify-between"
      id={id}
    >
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-emerald-600">
          Courses
        </p>
        <h2 className="text-2xl font-semibold text-slate-900">{title}</h2>
      </div>
      {subtitle ? (
        <p className="text-sm text-slate-500 sm:text-right">{subtitle}</p>
      ) : null}
    </motion.div>
  );
}

export default SectionHeading;
