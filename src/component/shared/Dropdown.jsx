import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import ChevronIcon from "../icons/ChevronIcon";

const Dropdown = (props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState(props.value);
  const dropdownRef = useRef(null);

  const closeDropdown = () => {
    setIsOpen(false);
  };

  const handleSelectOption = (id, columnType, selectOp) => {
    setSelectedValue(columnType || selectOp);
    props.setValue(columnType || id);
    closeDropdown();
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      closeDropdown();
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <div
      className={`relative w-full h-full max-w-sm max-md:max-w-none`}
      ref={dropdownRef}
    >
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`flex h-full items-center justify-between gap-1 rounded-${props.rounded} border  border-${props.border} bg-gray-50 px-${
          props.px
        } py-${props.py} ${
          isOpen
            ? "!border-primary !bg-primary-lighten shadow-input outline-none"
            : ""
        } ${selectedValue ? "font-semibold text-base text-black" : ""}`}
      >
        {selectedValue}
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }}>
          <ChevronIcon />
        </motion.div>
      </div>

      {isOpen && (
        <ul className={`absolute top-14 z-[70] w-full rounded-${props.rounded} border border-slate-200 bg-white drop-shadow-sm`}>
          {props.options?.map((option) => (
            <li
              key={option.id}
              onClick={() =>
                handleSelectOption(
                  option.id,
                  option.columnType,
                  option.selectOp
                )
              }
              className={`flex cursor-pointer justify-${props.justify} px-${props.px} 
              py-${props.py}  ${
                option.id === props.value ? "text-primary" : ""
              }`}
            >
              <p
                className={`rounded-md px-2 py-1 ${
                  option.columnType === "Done" ? "text-[#16A34A]" : ""
                }${option.columnType === "Pending" ? "text-yellow-600" : ""}`}
              >
                {option.columnType || option.selectOp}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Dropdown;
