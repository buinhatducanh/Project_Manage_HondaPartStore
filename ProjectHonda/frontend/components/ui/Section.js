import React from "react";
import PropTypes from "prop-types";
import "../../css/Section.css"; // Nhớ import CSS vào file này

const Section = ({ title, children }) => {
  return (
    <div className="my-8  ">
      <div className="flex">
        <div className="relative inline-block bg-red-600 text-white font-bold pl-4 pr-20 py-2 uppercase mx-4 section-title ">
          <span>{title}</span>
          <div className="triangle w-full"></div>
        </div>
        <div className="w-full border-b-4 border-red-800"></div>
      </div>

      <div className="mt-4">{children}</div>
    </div>
  );
};

Section.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node,
};

export default Section;
