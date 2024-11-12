import React from 'react'
import '../assets/css/recipe.css';

import { useSelector, useDispatch } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft, faUsers, faHourglassStart, faStar } from '@fortawesome/free-solid-svg-icons';
// import { updateTitle } from './redux/reducers/createSlice';


const RecipeDetail = () => {

    const dispatch = useDispatch();

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
        <div id="recipe">
            <div id="recipe-details-title">
                <div id="recipe-details-goback">
                    <FontAwesomeIcon icon={faAngleLeft} />
                </div>
            </div>

            <div className='detail-container'>
                {/* Recipe Photo */}
                <div className="photo">
                    <img id="photo" src={photoSrc} alt="Recipe Photo" />
                </div>

                {/* Recipe Name */}
                <div id="recipe_name">{recipeName}</div>

                {/* Introduction */}
                <div id="instruction">{instructions}</div>

                {/* Additional Information */}
                <div className="rowflex">
                    <div className="recipe-detail-rowflex-div">
                        <FontAwesomeIcon icon={faUsers} />
                        <div>{servings} 인분</div>
                    </div>
                    <div className="recipe-detail-rowflex-div">
                        <FontAwesomeIcon icon={faHourglassStart} />
                        <div>{time} 소요시간</div>
                    </div>
                    <div className="recipe-detail-rowflex-div">
                        <FontAwesomeIcon icon={faStar} />
                        <div>{difficulty} 난이도</div>
                    </div>
                </div>

                {/* Ingredients */}
                <div id="ingredient-wrapper">
                    {ingredients && ingredients.map((ingredient, index) => (
                        <div key={index}>{ingredient}</div>
                    ))}
                </div>

                {/* Description */}
                <div id="description-title">요리 방법</div>
                <div id="description">{description}</div>

            </div>
        </div>
    );
}

export default RecipeDetail