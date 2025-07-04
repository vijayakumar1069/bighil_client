import React from "react";

const SectionHeading = ({ icon, label, title, subTitle, color }) => {
  const iconBgClass = `bg-${color}/30`;
  const iconTextClass = `text-${color}`;

  return (
    <div className="flex  gap-3 bg-white dark:bg-black rounded-md p-4 shadow-md">
      <div className="flex items-center gap-2">
        <div className={`p-3 rounded-full ${iconBgClass}`}>
          <div className={`w-5 h-5 ${iconTextClass}`}>{icon}</div>
        </div>
      </div>
      <div className="">
        <div className="text-sm font-light text-text_color/90 dark:text-text-light">
          {label}
        </div>
        <h2
          className={`${
            label === "Department" ? "text-sm" : "text-lg"
          } font-light text-text_color dark:text-text-light mt-1`}
        >
          {Array.isArray(title)
            ? title.map((t, index) => (
                <span key={index}>
                  {index === title.length - 1 ? t : t + ", "}
                </span>
              ))
            : title}
          <span className="text-xs text-text_color dark:text-text-light">
            {subTitle && `(${subTitle})`}
          </span>
        </h2>

        {/* {subTitle && (
          <h2 className="text-sm font-light text-text_color dark:text-text-light mt-1">
            {subTitle}
          </h2>
        )} */}
      </div>
    </div>
  );
};

export default SectionHeading;
