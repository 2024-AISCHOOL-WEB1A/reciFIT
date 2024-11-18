import React, { useState } from 'react'
import '../assets/css/recipeList.css';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const RecipeMoreItem = () => {
    const {
        photoSrc,
        recipeName,
        instructions,
        servings,
        time,
        difficulty,
        ingredients,
        description
    } = useSelector((state) => state.recipe);

    return (
        <div>
            <div className="ItemContainer">
                <img id="ItemPhoto" src={photoSrc} alt="Recipe Photo" />
                <span id='recipeName'>{recipeName}</span>
            </div>
            

            {/* <div className="itemPhoto">
                <Link to={`/recipe/${item.id}`}>
                    <img src={item.photoSrc} />
                </Link>
            </div>
            <div className="itemName">
                <h4>{item.name}</h4>
            </div> */}

            <div>
                
            </div>
        </div>
    )
}

export default RecipeMoreItem