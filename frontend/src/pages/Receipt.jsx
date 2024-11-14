import React, { useState } from 'react';
import '../assets/css/receipt.css';
import initialReceiptData from '../json/receiptData.json';
import { Link } from 'react-router-dom';

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

    const handleDelete = (index) => {
        const confirmDelete = window.confirm("삭제하시겠습니까?");
        if (confirmDelete) {
            const updatedData = editData.filter((_, i) => i !== index);
            setEditData(updatedData);
        }
    };


    // 모달 열기/닫기 핸들러
    const handleModalToggle = () => {
        setIsModalOpen(!isModalOpen);
    };

    const handleAdd = () => {
        const newItem = {
            name: "",
            quantity: "",
            unit: "",
            lifedays: ""
        };
        setEditData([...editData, newItem]);
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
                        <div style={{ width: '100%', margin: '10% 0 1% 0', borderBottom: 'dashed 1px rgb(124, 124, 124)' }}></div>
                        <div style={{ width: '100%', margin: '1% 0', borderBottom: 'dashed 1px rgb(124, 124, 124)' }}></div>

                        <div className='receipt-subTitle'>
                            <div className='receipt-sub-name'><h3>상품명</h3></div>
                            <div className='receipt-sub-quantity'><h3>수량</h3></div>
                            <div className='receipt-sub-unit'><h3>단위</h3></div>
                            <div className='receipt-sub-lifedays'><h3>유통기한</h3></div>

                        </div>


                        {editData.map((item, index) => (
                            <div key={index} className='receipt-boxMiddle'>

                                {/* 삭제 버튼 */}
                                {isEditing && (
                                    <img src={`${process.env.PUBLIC_URL}/img/receipt_img/delete.png`}
                                        onClick={() => handleDelete(index)}
                                        className="delete-button" />
                                )}

                                {/* 상품명 */}
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


                                {/* 수량 */}
                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={item.quantity}
                                        onChange={(e) => handleNameChange(index, e.target.value)}
                                        className='receipt-quantity-input'
                                    />
                                ) : (
                                    <div className='receipt-quantity'>{item.quantity}</div>
                                )}

                                {/* 단위 */}
                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={item.unit}
                                        onChange={(e) => handleNameChange(index, e.target.value)}
                                        className='receipt-unit-input'
                                    />
                                ) : (
                                    <div className='receipt-unit'>{item.unit}</div>
                                )}

                                {/* 유통기한 */}
                                <div className='receipt-lifedays'>{item.lifedays}</div>

                            </div>
                        ))}

                        {/* 추가 버튼: 편집 모드일 때만 표시 */}
                        {isEditing && (
                            <button type="button" onClick={handleAdd} className='receipt-add-button'>
                                추가
                            </button>
                        )}

                        <div className='receipt-info' onClick={handleModalToggle}>영양분 정보</div>
                    </div>
                </div>


                <div className='receipt-button'>
                    <button className='receipt-R'><Link to='/'> 확인 </Link> </button>
                    <button type="button" onClick={handleEditToggle} className='receipt-U'>
                        {/* className= {isEditing ? 'receipt-R' : 'receipt-U' */}
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
