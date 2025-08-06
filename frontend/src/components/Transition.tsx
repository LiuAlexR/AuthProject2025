import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState, type ReactElement } from "react";

interface TransitionProps {
  page: React.ReactNode;
  initialState: boolean;
}

export default function Transition(props: TransitionProps) {
  const [check, setCheck] = useState<boolean>(props.initialState);

  useEffect(() => {
    if (!check) {
      setCheck(true);
    }
  }, [check]);

  return (
    <>
      <AnimatePresence mode="wait">
        {check && (
          <motion.div
            className="w-full h-full"
            initial={{ opacity: 0, y: -25 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0.2, x: -25 }}
            transition={{ duration: 1, ease: "linear" }}
          >
            {props.page}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
