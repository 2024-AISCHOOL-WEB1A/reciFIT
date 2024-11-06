import React, { useEffect, useState } from 'react'
import '../assets/css/receipt.css'

const Receipt = () => {

    return (
        <div className='receipt-container'>
            <div className='receipt-pic'>
                영수증 인식 완료 화면
            </div>

            <div className='receipt-text'>
                인식 글자
            </div>

            <div className='receipt-CRUD'>
                수정 / 삭제 / 추가 버튼
            </div>
        </div>
    )
}

export default Receipt