import React, { useState } from 'react'
import '../assets/css/joinInfo.css'

const JoinInfo = () => {

  const [inputValue, setInputValue] = useState('');
  const [words, setWords] = useState([]);

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleKeyDown = (event) => {
    if (event.key === ' ') {
      event.preventDefault();
      if (inputValue.trim()) { // 빈 문자열 제외
        setWords((prev) => [...prev, inputValue.trim()]);
        setInputValue(''); // 필드 초기화
      }
    }
  };

  const handleDelete = (indexToDelete) => {
    setWords((prevWords) => prevWords.filter((_, index) => index !== indexToDelete));
  };


  return (
    <div className='container'>
      <div className='input-area'>
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          className='input'
        />
      </div>


      <div className='text-area'>
        {words.map((word, index) => (

          <span key={index} className='text' >

            {word}

            <button onClick={() => handleDelete(index)} className='delete-button'>
              &times;
            </button>

          </span>

        ))}
      </div>
    </div>
  );
};

export default JoinInfo