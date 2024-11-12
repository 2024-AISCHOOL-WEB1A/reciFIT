import React, { useState } from 'react'
import '../assets/css/receipt.css'
import receiptData from '../json/receiptData.json'

const Receipt = () => {
    const [selectedItems, setSelectedItems] = useState(new Array(receiptData.length).fill(false));

    const handleCheckbox = (index) => {
        const updatedSelectedItems = [...selectedItems];
        updatedSelectedItems[index] = !updatedSelectedItems[index];
        setSelectedItems(updatedSelectedItems);
    };


    return (
        <form className='receipt-container'>
            {/* <div className='receipt-bannercon'><img src={`${process.env.PUBLIC_URL}/img/receipt_bg.jpg`}  className='receipt-banner'alt="" /></div> */}

            {/* 왼쪽 영수증 사진 */}
            <div className='receipt'>
                <div className='receipt-pic'>
                    <img src={`${process.env.PUBLIC_URL}/img/receipt_img/receipt2.png`} alt=""
                        className='receipt-img' />
                </div>

                {/* 오른쪽 인식 텍스트 */}
                <div className='receipt-textContainer'>
                    <img src={`${process.env.PUBLIC_URL}/img/receipt_img/Subtract.png`} alt=""
                        className='receipt-top' />

                    <div className='receipt-box'>
                        <div className='receipt-boxTitle'> <h2>인식결과</h2> </div>
                        <div className='receipt-subTitle'>
                            <div className='receipt-subname'>상품명</div>
                            <div className='receipt-subquantity'>수량</div>
                        </div>

                        {receiptData.map((item, index) => (
                            <div key={index} className='receipt-boxMiddle'>
                                <input type="checkbox" className="receipt-checkbox"
                                    checked={selectedItems[index]}
                                    onChange={() => handleCheckbox(index)} />
                                <div className='receipt-name'>{item.name}</div>
                                <div className='receipt-quantity'>{item.quantity}</div>
                            </div>
                        ))}

                        <div className='receipt-info'>
                            영양분 정보
                        </div>
                        <div>

                        </div>
                    </div>
                </div>

                <div className='receipt-CRUD'>
                    <button className='receipt-R'> 확인 </button>
                    <button className='receipt-U'> 수정 </button>
                    <button className='receipt-C'> 추가 </button>
                    <button className='receipt-D'> 삭제 </button>
                </div>
            </div>

        </form>
    )
}

export default Receipt