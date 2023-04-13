const CustomViewIcon = ({ className = "", width = 20, height = 20 }) => {
  return (
    <svg
      className={className}
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="1.22266" y="1.18433" width="16" height="14.2105" rx="3.5" />
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M8.77323 11.4211V5.15796H9.66797V11.4211H8.77323Z"
        fill="white"
      />
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M6.0884 7.84208L12.3516 7.84208L12.3516 8.73682L6.0884 8.73682L6.0884 7.84208Z"
        fill="white"
      />
    </svg>
  );
};

export default CustomViewIcon;
