import { AnimatePresence, motion, useAnimate } from "motion/react";
import { useEffect } from "react";

export default function IntroAnimation() {
  const [header, headerAnimate] = useAnimate();
  const [middle, middleAnimate] = useAnimate();

  const [name1, name1Animate] = useAnimate();
  const [name2, name2Animate] = useAnimate();

  const animationCycle = async () => {
    await headerAnimate(
      header.current,
      { opacity: 1, x: 50 },
      { duration: 1.5 },
    );

    await middleAnimate(
      middle.current,
      { opacity: 1, x: -50 },
      {
        duration: 1.5,
      },
    );

    name1Animate(name1.current, { opacity: 1, x: -70 }, { duration: 1.5 });
    name2Animate(name2.current, { opacity: 1, x: 70 }, { duration: 1.5 });
  };

  useEffect(() => {
    animationCycle();
    console.log("HI");
  });

  return (
    <AnimatePresence>
      <div className="bg-black h-full w-full overflow-hidden grid grid-rows-3 m-0 p-0">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          className="text-white flex justify-center items-center "
          ref={header}
        >
          <p className="text-6xl "> Welcome to Life 360</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 50 }}
          className="text-white flex justify-center items-center"
          ref={middle}
        >
          <p className="text-6xl"> Created by </p>
        </motion.div>

        <div className="text-white flex justify-center items-center">
          <motion.p
            initial={{ x: -70, opacity: 0 }}
            className="text-5xl"
            ref={name1}
          >
            Srikar Yadlapati
          </motion.p>
          <motion.p
            initial={{ x: 70, opacity: 0 }}
            className="text-5xl"
            ref={name2}
          >
            Alex Liu
          </motion.p>
        </div>
      </div>
    </AnimatePresence>
  );
}
