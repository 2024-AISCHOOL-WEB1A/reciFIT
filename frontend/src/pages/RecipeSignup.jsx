import React, { useState } from 'react';
import './RecipeSignup.css'; // CSS 파일 임포트

const RecipeSignup = () => {
    const [recipeTitle, setRecipeTitle] = useState('');
    const [ingredients, setIngredients] = useState([{ name: '', quantity: '', unit: '' }]);
    const [instructions, setInstructions] = useState(['']);
    const [tags, setTags] = useState('');

    const handleIngredientChange = (index, event) => {
        const newIngredients = [...ingredients];
        newIngredients[index][event.target.name] = event.target.value;
        setIngredients(newIngredients);
    };

    const addIngredient = () => {
        setIngredients([...ingredients, { name: '', quantity: '', unit: '' }]);
    };

    const removeIngredient = (index) => {
        const newIngredients = ingredients.filter((_, i) => i !== index);
        setIngredients(newIngredients);
    };

    const handleInstructionChange = (index, event) => {
        const newInstructions = [...instructions];
        newInstructions[index] = event.target.value;
        setInstructions(newInstructions);
    };

    const addInstruction = () => {
        setInstructions([...instructions, '']);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        // API 호출 등 추가 로직
        console.log({ recipeTitle, ingredients, instructions, tags });
    };

    return (
        <form onSubmit={handleSubmit}>
            <h1>레시피 등록</h1>
            <div>
                <label>레시피 제목</label>
                <input
                    type="text"
                    value={recipeTitle}
                    onChange={(e) => setRecipeTitle(e.target.value)}
                    required
                />
            </div>

            <h2>재료 정보</h2>
            {ingredients.map((ingredient, index) => (
                <div key={index}>
                    <input
                        type="text"
                        name="name"
                        placeholder="재료명"
                        value={ingredient.name}
                        onChange={(e) => handleIngredientChange(index, e)}
                        required
                    />
                    <input
                        type="number"
                        name="quantity"
                        placeholder="수량"
                        value={ingredient.quantity}
                        onChange={(e) => handleIngredientChange(index, e)}
                        required
                    />
                    <input
                        type="text"
                        name="unit"
                        placeholder="단위"
                        value={ingredient.unit}
                        onChange={(e) => handleIngredientChange(index, e)}
                        required
                    />
                    <button type="button" onClick={() => removeIngredient(index)}>삭제</button>
                </div>
            ))}
            <button type="button" onClick={addIngredient}>재료 추가</button>

            <h2>조리 방법</h2>
            {instructions.map((instruction, index) => (
                <div key={index}>
                    <textarea
                        value={instruction}
                        onChange={(e) => handleInstructionChange(index, e)}
                        required
                    />
                    <button type="button" onClick={addInstruction}>추가</button>
                </div>
            ))}

            <div>
                <label>태그</label>
                <input
                    type="text"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                />
            </div>

            <button type="submit">저장</button>
        </form>
    );
};

export default RecipeSignup;
