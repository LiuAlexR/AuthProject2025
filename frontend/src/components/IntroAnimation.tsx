import { AnimatePresence, motion, useAnimate } from "motion/react";
import { useEffect } from "react";

export default function IntroAnimation() {
  const [header, headerAnimate] = useAnimate();

  const animationCycle = async () => {
    await headerAnimate(
      header.current,
      { opacity: 1, x: 30 },
      { duration: 0.5 },
    );
  };

  useEffect(() => {
    animationCycle();
    console.log("HI");
  });

  return (
    <div className="bg-black h-full w-full overflow-hidden grid grid-rows-3 m-0 p-0">
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          className="text-white flex justify-center items-center "
          ref={header}
        >
          <p className="text-6xl "> Welcome to Life 360</p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
