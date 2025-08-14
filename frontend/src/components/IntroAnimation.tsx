import { AnimatePresence, motion, useAnimate } from "motion/react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

export default function IntroAnimation() {
  const [scope, animate] = useAnimate();
  const [text, setText] = useState<string>("Welcome to Life 360");
  const [next, setNext] = useState<boolean>(false);

  const nav = useNavigate();

  const animateName = (name1: string[], name2: string[]) => {
    const DURATION = 0.25;
    const TOTAL_DURATION = 4;

    const delay1 = TOTAL_DURATION / name1.length;
    const delay2 = TOTAL_DURATION / name2.length;

    return (
      <div className="w-screen flex justify-center items-center flex-col gap-10">
        <div className="">
          {name1.map((el, i) => (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{
                duration: DURATION,
                delay: 0.6 + i * delay1,
              }}
              key={i}
            >
              {el}
            </motion.span>
          ))}
        </div>

        <div>
          {name2.map((el, i) => (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{
                duration: DURATION,
                delay: 0.6 + i * delay2,
              }}
              key={i}
            >
              {el}
            </motion.span>
          ))}
        </div>
      </div>
    );
  };

  const timeline = async () => {
    await animate(
      scope.current,
      { opacity: 1, y: -30 },
      {
        delay: 0.5,
        duration: 0.1,
        type: "spring",
        bounce: 0.005,
        mass: 0.4,
        ease: "easeIn",
        stiffness: 15,
        damping: 0.8,
      },
    );
    await animate(scope.current, { opacity: 0 });
    setText("Developed by ");
    await animate(
      scope.current,
      { opacity: 1 },
      { delay: 0.5, repeat: 0, duration: 1 },
    );
    await animate(scope.current, { delay: 0.5, opacity: 0, duration: 1 });
    setNext(true);
    await animate(scope.current, { opacity: 1 }, { delay: 0.5, duration: 0.5 });

    const TOTAL_ANIMATION_TIME = 0.6 + 4 + 0.25;
    await new Promise((resolve) =>
      setTimeout(resolve, TOTAL_ANIMATION_TIME * 1000),
    );

    await new Promise((resolve) => setTimeout(resolve, 2000));
  };

  useEffect(() => {
    async function run() {
      await timeline();
      nav("/home");
    }

    run();
  }, []);

  const renderContent = () => {
    if (next) {
      const name1 = "Srikar Yadlapati  -  @TheSilentIce".split("");
      const name2 = "Alex Liu  -  @LiuAlexR".split("");
      return animateName(name1, name2);
    }
    return text;
  };

  return (
    <AnimatePresence>
      <div className="bg-black h-full w-full overflow-hidden grid grid-rows-[1fr_7fr_1fr] m-0 p-0">
        <div />

        <div className="flex justify-center items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            ref={scope}
            className="text-white text-6xl"
          >
            {renderContent()}
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
}
