import React from 'react'
import '../assets/css/receipt.css'
import receiptData from '../json/receiptData.json'

const Receipt = () => {
    // const [selectedItems, setSelectedItems] = useState(new Array(receiptData.length).fill(false));

    // const handleCheckbox = (index) => {
    //     const updatedSelectedItems = [...selectedItems];
    //     updatedSelectedItems[index] = !updatedSelectedItems[index];
    //     setSelectedItems(updatedSelectedItems);
    // };


    return (
        <form className='receipt-container'>
            <div className='receipt'>
                <div className='receipt-pic'>
                    <h2 style={{ color: 'white', paddingBottom: '10%' }}>picture</h2>
                    <img src={`${process.env.PUBLIC_URL}/img/receipt_img/receipt2.png`} alt="" className='receipt-img' />
                </div>

                {/* 오른쪽 인식 텍스트 */}
                <div className='receipt-right'>
                    {/* 영수증 출입구 일러 */}
                    <div className='receipt-door'></div>
                    {/* 영수증 일러 */}
                    <div className='receipt-illustration'>
                        <div className='receipt-title'> <h2>Receipt</h2> </div>
                        <div style={{ width: '100%', margin: '3% 0' }}> ******************************** </div>
                        <div style={{ display: 'flex' }}>
                            <span className='receipt-nick'> 상냥한 고비 님 </span>
                            <span className='receipt-date'>2024 / 11 / 11</span>
                        </div>

                        <div className='receipt-subTitle'>
                            <div className='receipt-subname'>상품명</div>
                            <div className='receipt-subquantity'>수량</div>
                        </div>

                        {receiptData.map((item, index) => (
                            <div key={index} className='receipt-boxMiddle'>
                                <div className='receipt-name'>{item.name}</div>
                                <div className='receipt-quantity'>{item.quantity}</div>
                            </div>
                        ),

                        )}
                    </div>
                    <div className='receipt-info'>영양분 정보</div>
                </div>

                <div className='receipt-CRUD'>
                    <button className='receipt-R'> 확인 </button>
                    <button className='receipt-U'> 수정 </button>
                </div>
            </div>

        </form >
    )
}

export default Receipt