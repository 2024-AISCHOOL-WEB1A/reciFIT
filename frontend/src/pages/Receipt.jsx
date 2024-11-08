import React, { useEffect, useState } from 'react'
import '../assets/css/receipt.css'

const Receipt = () => {

    return (
        <div className='receipt-container'>
            <div className='receipt-pic'>
                <img src={`${process.env.PUBLIC_URL}/img/receipt_img/receipt1.jpg`} alt="" 
                className='receipt-img'/>
            </div>

            <div className='receipt-text'>
                인식 글자
            </div>

            <div className='receipt-CRUD'>
                <button className='receipt-U'> 수정 </button>
                <button className='receipt-C'> 추가 </button>
                <button className='receipt-D'> 삭제 </button>
                <button className='receipt-R'> 확인 </button>
            </div>
        </div>
    )
}

export default Receipt