const Hamburger = ({ isActive, setIsActive }) => {
  return (
    <div
      className="grid gap-1 cursor-pointer"
      onClick={() => setIsActive((prev) => !prev)}
    >
      {/* Top bar */}
      <span
        className={`${
          isActive ? "rotate-45 translate-y-2" : "rotate-0 translate-y-0"
        } w-9 bg-black h-1 block transition-all duration-200`}
      ></span>

      <span
        className={`${
          isActive ? "opacity-0" : "opacity-100"
        } w-9 bg-black h-1 block transition-all duration-200`}
      ></span>

      {/* Bottom bar */}
      <span
        className={`${
          isActive ? "-rotate-45 -translate-y-2" : "rotate-0 translate-y-0"
        } w-9 bg-black h-1 block transition-all duration-200`}
      ></span>
    </div>
  );
};

export default Hamburger;
