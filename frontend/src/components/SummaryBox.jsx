import React from "react";

const SummaryBox = ({ title, value, unit = "", onClick }) => {
  return (
    <div
      onClick={onClick}
      className="cursor-pointer bg-white shadow rounded-2xl p-4 hover:shadow-md transition"
    >
      <p className="text-sm text-gray-800 font-semibold">{title}</p>
      <p className="text-2xl font-semibold text-red-700">
        {value} {unit}
      </p>
    </div>
  );
};

export default SummaryBox;
