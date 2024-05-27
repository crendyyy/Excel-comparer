import { createPortal } from "react-dom";
import { motion } from "framer-motion";

const Backdrop = (props) => {
  return (
    <div
      className="fixed bottom-0 left-0 right-0 top-0 z-[55] bg-black opacity-80"
      onClick={props.onCancel}
    ></div>
  );
};

const Overlay = (props) => {
  return (
    <motion.div
      initial={{ x: "-50%", y: "-40%", opacity: 0 }}
      animate={{ x: "-50%", y: "-50%", opacity: 1 }}
      exit={{ x: "-50%", y: "-55%", opacity: 0 }}
      transition={{ duration: 0.2, type: "spring" }}
      className="fixed left-2/4 top-2/4 z-[60] m-auto w-fit rounded-primary bg-white"
    >
      {props.children}
    </motion.div>
  );
};

const Dialog = (props) => {
  const backdropElement = document.querySelector("#backdrop-root");
  const overlayElement = document.querySelector("#overlay-root");

  return (
    <>
      {createPortal(<Backdrop onCancel={props.onCancel} />, backdropElement)}
      {createPortal(
        <Overlay state={props.state} onCancel={props.onCancel}>
          {props.children}
        </Overlay>,
        overlayElement
      )}
    </>
  );
};

export default Dialog;
