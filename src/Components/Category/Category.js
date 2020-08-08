import React, { useState, useLayoutEffect } from "react";
import { Link } from "react-router-dom";
import "./Category.scss";

export default function Category({ info, getTooltipMouseProps }) {
  const [categoryColor, setCategoryColor] = useState("");
  const pathname = `/${info.id}`;
  const categoryTitle = info.name;

  useLayoutEffect(() => {
    if (!categoryColor) {
      setCategoryColor(getBackgroundColor());
    }
  }, [categoryColor]);

  return (
    <Link
      to={{
        pathname,
        state: {
          categoryColor,
          categoryTitle,
        },
      }}
      className="category"
      style={{ backgroundColor: categoryColor }}
      {...getTooltipMouseProps({ displayedText: categoryTitle })}
    >
      <div className="gradient">
        <h3 className="category-title">{`${breakAtSlash(categoryTitle)}`}</h3>
        <img
          className="category-image"
          alt="Category"
          src={`${info.icons[0].url}`}
        />
      </div>
    </Link>
  );
}

function getRandomNum() {
  return Math.floor(Math.random() * 255);
}

//Generates a random color for each category tile
function getBackgroundColor() {
  return `rgb(
    ${getRandomNum()},
    ${getRandomNum()},
    ${getRandomNum()}
    )`;
}

const slashRegex = /\//g;

//Function to fix wrapping of some playlist titles that include "/"
//such as "Dance/Electronic"
function breakAtSlash(string) {
  if (string.match(slashRegex)) {
    const index = string.indexOf("/");
    string = string.slice(0, index) + "/ " + string.slice(index + 1);
  }
  return string;
}
