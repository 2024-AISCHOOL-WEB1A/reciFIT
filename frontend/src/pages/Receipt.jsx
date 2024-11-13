import React, { useState } from 'react';
import '../assets/css/receipt.css';
import initialReceiptData from '../json/receiptData.json';

const Receipt = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editData, setEditData] = useState(initialReceiptData);
    const [isEditing, setIsEditing] = useState(false);

    // 수정 버튼 클릭 시 편집 모드 토글
    const handleEditToggle = () => {
        setIsEditing(!isEditing);
    };

    // 항목의 이름 변경
    const handleNameChange = (index, value) => {
        const updatedData = [...editData];
        updatedData[index] = { ...updatedData[index], name: value };
        setEditData(updatedData);
    };

    // 수량 증가 및 감소
    const handleQuantityChange = (index, change) => {
        const updatedData = [...editData];
        const newQuantity = updatedData[index].quantity + change;
        if (newQuantity >= 1) { // 수량이 1 이하로 감소하지 않도록 함
            updatedData[index] = { ...updatedData[index], quantity: newQuantity };
            setEditData(updatedData);
        }


    };

    // 모달 열기/닫기 핸들러
    const handleModalToggle = () => {
        setIsModalOpen(!isModalOpen);
    };

    return (
        <form className='receipt-container'>
            <div className='receipt'>
                <div className='receipt-pic'>
                    <h1 style={{ color: 'white', paddingBottom: '10%' }}>Picture</h1>
                    <img src={`${process.env.PUBLIC_URL}/img/receipt_img/receipt2.png`} alt="" className='receipt-img' />
                </div>

                <div className='receipt-arrow'><img src={`${process.env.PUBLIC_URL}/img/receipt_img/arrow.png`} alt="" /></div>

                <div className='receipt-right'>
                    <div className='receipt-door'></div>
                    <div className='receipt-illustration'>
                        <div className='receipt-title'> <h1>Receipt</h1></div>
                        
                        <div style={{ display: 'flex' }}>
                            <span className='receipt-nick'> 상냥한 고비 님 </span>
                            <span className='receipt-date'>2024 / 11 / 11</span>
                        </div>
                        <div style={{ width: '100%', margin: '10% 0 1% 0', borderBottom: 'dashed 1px rgb(124, 124, 124)'}}></div>
                        <div style={{ width: '100%', margin: '1% 0', borderBottom: 'dashed 1px rgb(124, 124, 124)'}}></div>

                        <div className='receipt-subTitle'>
                            <div className='receipt-subname'><h3>상품명</h3></div>
                            <div className='receipt-subquantity'><h3>수량</h3></div>
                            <div className='receipt-subunit'><h3>단위</h3></div>
                            <div className='receipt-subExpiration'><h3>유통기한</h3></div>


                        </div>

                        {editData.map((item, index) => (
                            <div key={index} className='receipt-boxMiddle'>
                                {isEditing && (
                                    <input
                                        type="checkbox"
                                        className="edit-checkbox"
                                    />
                                )}
                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={item.name}
                                        onChange={(e) => handleNameChange(index, e.target.value)}
                                        className='receipt-name-input'
                                    />
                                ) : (
                                    <div className='receipt-name'>{item.name}</div>
                                )}
                                <div className='receipt-quantity-container'>
                                    {isEditing && (
                                        <button
                                            type="button"
                                            onClick={() => handleQuantityChange(index, -1)}
                                            className='quantity-button'
                                        >
                                            -
                                        </button>
                                    )}
                                    <div className='receipt-quantity'>{item.quantity}</div>
                                    {isEditing && (
                                        <button
                                            type="button"
                                            onClick={() => handleQuantityChange(index, 1)}
                                            className='quantity-button'
                                        >
                                            +
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                        <div className='receipt-info' onClick={handleModalToggle}>영양분 정보</div>
                    </div>
                </div>

                <div className='receipt-button'>
                    <button className='receipt-R'> 확인 </button>
                    <button type="button" onClick={handleEditToggle} className={isEditing ? 'receipt-R' : 'receipt-U'}>
                        {isEditing ? '저장' : '수정'}
                    </button>

                </div>
            </div>
            {/* 모달 창 */}
            {isModalOpen && (
                <div className="modal-overlay" onClick={handleModalToggle}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h2>영양분 정보</h2>
                        <p>여기에 영양분 정보가 표시됩니다.</p>
                        <button onClick={handleModalToggle}>닫기</button>
                    </div>
                </div>
            )}
        </form>
    );
};

export default Receipt;
