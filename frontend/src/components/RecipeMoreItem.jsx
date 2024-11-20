import React, { useState } from "react";
import "../assets/css/recipeList.css";
import { useNavigate } from "react-router-dom";

const RecipeMoreItem = ({ item }) => {
  const navigate = useNavigate();
  const handleRecipeDetail = () => {
    navigate(`/recipe/${item?.rcp_idx}`);
  };

  return (
    <div className="recipe-item-container" onClick={handleRecipeDetail}>
      <img src={item?.ck_photo_url} alt="Recipe Photo" />
      <span>{item?.ck_name}</span>
    </div>
  );
};

export default RecipeMoreItem;
