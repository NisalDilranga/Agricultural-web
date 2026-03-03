import { motion } from "framer-motion";
import heroVideo from "../assets/videos/herov.mp4";

function Hero() {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="relative flex h-125 w-full items-center justify-center overflow-hidden md:h-200 mt-10"
      aria-labelledby="hero-title"
    >
      <video
        className="absolute inset-0 h-full w-full object-cover"
        src={heroVideo}
        autoPlay
        loop
        muted
        playsInline
      />
      <div className="absolute inset-0 bg-black/10" />

      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
        className="relative z-10 mx-auto max-w-3xl px-5 text-center"
      >
        <motion.h1
          id="hero-title"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.8 }}
          className="text-4xl font-extrabold leading-tight tracking-tight text-white drop-shadow-xl sm:text-5xl lg:text-7xl"
        >
          Enhance Your{" "}
          <span className="relative inline-block">
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.1, duration: 0.8 }}
              className="bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent"
            >
              Agricultural
            </motion.span>
            {/* animated underline */}
            <motion.span
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 1.5, duration: 0.6, ease: "easeOut" }}
              className="absolute -bottom-1 left-0 right-0 h-1 origin-left rounded-full bg-gradient-to-r from-emerald-400/50 to-teal-300/50"
            />
          </span>{" "}
          Skills
        </motion.h1>
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.8 }}
          className="mt-5 text-lg font-medium text-white/80 drop-shadow-md sm:text-xl"
        >
          Discover expert-led courses designed to transform your farming
          knowledge and practices.{" "}
          <span className="font-semibold text-white">Completely free.</span>
        </motion.p>
        <motion.button
          type="button"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.1, duration: 0.8 }}
          whileHover={{
            scale: 1.05,
            boxShadow: "0 20px 50px rgba(16, 185, 129, 0.4)",
          }}
          whileTap={{ scale: 0.95 }}
          className="mt-15 inline-flex items-center justify-center rounded-full bg-emerald-600 px-8 py-3.5 text-lg font-semibold text-white shadow-lg shadow-emerald-600/30 transition hover:bg-emerald-500"
        >
          <a href="#courses">Explore Courses</a>
        </motion.button>
        {/* <div className="flex justify-between mt-30 text-white/90 drop-shadow-md">
          <p>101010101011</p>
          <p>email@gmail.com</p>
          <p>email@gmail.com</p>
        </div> */}
      </motion.div>
    </motion.section>
  );
}

export default Hero;
