import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Category.scss";

export default function Category(props) {
  const [categoryColor, setCategoryColor] = useState("");

  //Generates a random color for each category tile
  const backgroundColor = `rgb(
    ${getRandomNum()},
    ${getRandomNum()},
    ${getRandomNum()}
    )`;
  // Not going straight to swipe anymore
  //const pathname = `/swipe/${props.info.id}`;
  const pathname = `/${props.info.id}`;
  const categoryTitle = props.info.name;

  if (!categoryColor) {
    setCategoryColor(backgroundColor);
  }

  return (
    <Link
      to={{
        pathname: pathname,
        state: {
          categoryColor,
          categoryTitle,
        },
      }}
      className="category"
      style={{ backgroundColor: categoryColor }}
    >
      <div className="gradient">
        <h3 className="category-title">{`${categoryTitle}`}</h3>
        <img
          className="category-image"
          alt="Category"
          src={`${props.info.icons[0].url}`}
        />
      </div>
    </Link>
  );
}

function getRandomNum() {
  return Math.floor(Math.random() * 255);
}
