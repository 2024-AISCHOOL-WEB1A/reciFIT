import React from 'react'
import { useState, useEffect } from "react";
import DataTable from "../components/DataTable";
import '../assets/css/receipt.css';


const headers = [
    { text: '상품명', value: 'name' },
    { text: '수량', value: 'quantity' },
    { text: '구매일자', value: 'date' }
];

const initialItems = [
    { name: '계란', quantity: '1', date: '2024.11.01'},
    { name: '모짜렐라치즈', quantity: '3', date: '2024.11.01'},
    { name: '바나나', quantity: '1', date: '2024.11.01'}
];


const Receipt = () => {
    const [items, setItems] = useState(initialItems);
    const [selection, setSelection] = useState([]);
    const [newItem, setNewItem] = useState({ name: '', quantity: '', date: '' });
    const [editData, setEditData] = useState({ name: '', quantity: '', date: '' }); // 수정할 데이터를 담을 상태



    useEffect(() => {
        if (selection.length === 1) {
            // 선택된 항목이 하나일 때만 수정할 데이터 설정
            const selectedItem = items.find((item) => item.name === selection[0]);
            if (selectedItem) {
                setEditData({ ...selectedItem });
            }
        } else {
            // 선택된 항목이 없거나 1개 이상일 때는 초기화
            setEditData({ name: '', quantity: '', date: '' });
        }
    }, [selection, items]);  // 항목 추가 함수
    const handleAddItem = () => {
        if (!newItem.name || !newItem.quantity || !newItem.date) {
            alert("모든 필드를 입력해 주세요.");
            return;
        }

        setItems((prevItems) => [...prevItems, newItem]);
        setNewItem({ name: '', quantity: '', date: '' }); // 입력 필드 초기화
    };

    // 삭제 함수
    const handleDelete = (selectedItems) => {
        setItems((prevItems) =>
            prevItems.filter((item) => !selectedItems.includes(item.name))
        );
        setSelection([]); // 선택 해제
    };

    // 선택된 항목 업데이트 함수
    const handleUpdate = () => {
        if (selection.length !== 1) {
            alert("하나의 항목만 선택할 수 있습니다.");
            return;
        }

        setItems((prevItems) =>
            prevItems.map((item) =>
                item.name === selection[0]
                    ? { ...editData } // 선택된 항목을 editData로 업데이트
                    : item
            )
        );

        // 선택 해제 및 편집 데이터 초기화
        setSelection([]);
        setEditData({ name: '', quantity: '', date: '' });
    };



    return (
        <div className="receipt-container">
            <DataTable
                headers={headers}
                items={items}
                selectable={true}
                updateSelection={setSelection}
                onDelete={handleDelete}
                onUpdate={handleUpdate}
            />

            {/* 삭제 버튼 */}
            <button className='receipt-delete'
            onClick={() => handleDelete(selection)} disabled={selection.length === 0}>
                삭제
            </button>

            {/* 수정 버튼 */}
            <button className='receipt-change'
            onClick={() => handleUpdate(selection)} disabled={selection.length === 0}>
                수정
            </button>

            {/* 새 항목 추가 입력 필드 */}
            <div className='receipt-add'>
                <input
                    type="text"
                    placeholder="상품명"
                    value={newItem.name}
                    onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                />
                <input
                    type="text"
                    placeholder="수량"
                    value={newItem.quantity}
                    onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })}
                />
                <input
                    type="text"
                    placeholder="구매일자"
                    value={newItem.date}
                    onChange={(e) => setNewItem({ ...newItem, date: e.target.value })}
                />
                <button onClick={handleAddItem}>추가</button>
            </div>

            {/* 수정 영역 */}
            {selection.length === 1 && (
                <div>
                    <h3>항목 수정</h3>
                    <label>
                        상품명:
                        <input
                            type="text"
                            value={editData.name}
                            onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                        />
                    </label>
                    <br />
                    <label>
                        수량:
                        <input
                            type="text"
                            value={editData.quantity}
                            onChange={(e) => setEditData({ ...editData, quantity: e.target.value })}
                        />
                    </label>
                    <br />
                    <label>
                        구매일자:
                        <input
                            type="text"
                            value={editData.date}
                            onChange={(e) => setEditData({ ...editData, date: e.target.value })}
                        />
                    </label>
                    <br />
                    <button onClick={handleUpdate}>저장</button>
                </div>
            )}
        </div>
    )
}

export default Receipt