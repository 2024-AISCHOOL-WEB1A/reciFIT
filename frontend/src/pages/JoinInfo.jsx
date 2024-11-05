

import React from 'react'
import '../assets/css/joinInfo.css'

const JoinInfo = () => {
  return (
    <div>
      <div className='info-container'>

        <div className='info-text'>추가정보 입력</div>

        <div className='like-box'>
          <span className='like-text'>선호</span>
          <input type="text" className='info-like'
            placeholder='해당 재료가 포함된 레시피를 우선적으로 추천합니다!' />
        </div>

        <div className='dislike-box'>
          <div className='dislike-text'>비선호</div>
          <input type="text" className='info-dislike' />
        </div>

        <div className='allergy-box'>
          <div className='allergy-text'>제외</div>
          <input type="text" className='info-allergy'
            placeholder='해당 재료가 포함된 레시피는 추천에서 제외됩니다!' />
        </div>
      </div>

      <button type='submit'>확인</button>
    </div>
  )
}

export default JoinInfo