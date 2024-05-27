const ChevronIcon = ({ direction = "bottom" }) => {
  const styles = {
    left: "rotate-90",
    right: "-rotate-90",
    top: "rotate-180",
    bottom: "",
  };

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="12"
      height="12"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 12 12"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M9.5 4.25L6 7.75l-3.5-3.5"
      ></path>
    </svg>
  );
};

export default ChevronIcon;
