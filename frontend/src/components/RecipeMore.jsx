import React, { useState } from 'react';
import '../assets/css/recipeList.css';
import RecipeMoreItem from './RecipeMoreItem';
import { useSelector } from 'react-redux';

const RecipeMore = () => {

  return (
    <div>
        <div className='recipeMoreHeader'>
            <h3>총 3,670개의 레시피</h3>
        </div>

        <div className='recipeMoreContainer'>
            <RecipeMoreItem/>
            <RecipeMoreItem/>
            <RecipeMoreItem/>
            <RecipeMoreItem/>
            <RecipeMoreItem/>
            <RecipeMoreItem/>
            <RecipeMoreItem/>
            <RecipeMoreItem/>
            <RecipeMoreItem/>
            <RecipeMoreItem/>
        </div>
    </div>
  )
}

export default RecipeMore