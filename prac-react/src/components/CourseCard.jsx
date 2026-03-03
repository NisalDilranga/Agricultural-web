import { useNavigate } from 'react-router-dom';
import { Clock, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

function CourseCard({
  id,
  title,
  category,
  image,
  isComingSoon = false,
  isNew = false,
}) {
  const navigate = useNavigate();
  const showComingSoon = Boolean(isComingSoon);
  const showNew = !showComingSoon && Boolean(isNew);

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -8, scale: 1.02 }}
      onClick={() => navigate(`/course/${id}`)}
      className="group cursor-pointer overflow-hidden rounded-2xl border border-slate-200 shadow-sm transition-all duration-300 hover:shadow-xl"
    >
      <motion.div
        className="relative h-48 overflow-hidden"
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.4 }}
      >
        <img
          src={image}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {showComingSoon ? (
          <span className="absolute left-3 top-3 rounded-full bg-amber-500 px-3 py-1 text-xs font-semibold text-white shadow">
            Coming Soon
          </span>
        ) : null}
        {showNew ? (
          <span className="absolute left-3 top-3 rounded-full bg-emerald-600 px-3 py-1 text-xs font-semibold text-white shadow">
            New
          </span>
        ) : null}
      </motion.div>

      <div className="px-4 py-4">
        <h3 className="mb-1 text-lg font-semibold text-slate-900 transition-colors group-hover:text-emerald-600">
          {title}
        </h3>
        <p className="mb-3 text-sm text-slate-500">{category}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-xs text-slate-600">
            <div className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              <span>4 weeks</span>
            </div>
            <div className="flex items-center gap-1">
              <CheckCircle className="h-3.5 w-3.5 text-emerald-600" />
              <span>Certified</span>
            </div>
          </div>
          <span className="text-xs font-medium text-emerald-600 opacity-0 transition-opacity group-hover:opacity-100">
            View Details →
          </span>
        </div>
      </div>
    </motion.article>
  );
}

export default CourseCard;
