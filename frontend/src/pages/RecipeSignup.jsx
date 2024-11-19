//레시피 등록페이지
import React, { useState } from 'react';
import '../assets/css/recipeSignup.css'; // CSS 파일 임포트

const RecipeSignup = () => {
    const [ingredients, setIngredients] = useState('');
    const [steps, setSteps] = useState([]);
    const [stepFiles, setStepFiles] = useState([]);

    const handleAddMaterialGroup = () => {
        // 재료 묶음 추가 로직 (예: 모달 열기)
        console.log('재료 묶음 추가');
    };

    const handleFileChange = (event) => {
        const files = Array.from(event.target.files);
        setStepFiles(files);
    };

    const handleAddStep = () => {
        setSteps([...steps, { text: '', files: [] }]);
    };
    const [recipeTitle, setRecipeTitle] = useState('');
    const [recipeIntro, setRecipeIntro] = useState('');
    const [videoUrl, setVideoUrl] = useState('');
    const [categories, setCategories] = useState({
        category1: '',
        category2: '',
        category3: '',
});
    const [cookingInfo, setCookingInfo] = useState({
        portion: '',
        time: '',
        degree: '',
    });
    const [tips, setTips] = useState('');
    const [tags, setTags] = useState('');

    const handleSubmit = (action) => {
        console.log({
            recipeTitle,
            recipeIntro,
            videoUrl,
            categories,
            cookingInfo,
            tips,
            tags,
            action,
        });
          // 더하기 API 호출 로직 추가 가능

        };


    return (
        <div className="container recipe_regi">
            <div className="regi_center">
                <div className="regi_title">
                    <h1>레시피 등록</h1>
                    <div className="tit_right">
                        {/* <a href="javascript:void(0);" onClick={() => alert("단계별 추가 정보 입력 안내")}>
                            <img src="https://recipe1.ezmember.co.kr/img/btn_tip.gif" alt="단계별 추가 정보 입력 안내" />
                        </a>
                        <a href="javascript:void(0);" id="btnRecipeIdGuide">
                            <img src="https://recipe1.ezmember.co.kr/img/btn_id2.gif" alt="레시피ID 활용 안내" />
                        </a>
                        <a href="javascript:void(0);" id="btnRecipeInsertGuide">
                            <img src="https://recipe1.ezmember.co.kr/img/btn_guide.gif" alt="레시피 등록 안내" />
                        </a> */}
                    </div>
                </div>

                <div className="cont_box pad_l_60">
                    
                    <div className="cont_line">
                        <p className="cont_tit4">레시피 제목</p>
                        <input
                            type="text"
                            value={recipeTitle}
                            onChange={(e) => setRecipeTitle(e.target.value)}
                            className="form-control"
                            placeholder="예) 소고기 미역국 끓이기"
                            style={{ width: '610px' }}
                        />
                    </div>

                    <div className="cont_line pad_b_25" style={{ display: 'flex', alignItems: 'flex-start' }}>
                        <div style={{ flex: 1 }}>
                        <p className="cont_tit4">요리소개</p>
                        <textarea
                            value={recipeIntro}
                            onChange={(e) => setRecipeIntro(e.target.value)}
                            className="form-control step_cont"
                            placeholder="이 레시피의 탄생배경을 적어주세요."
                            style={{ height: '100px', width: '610px', resize: 'none' }}
                        />
                        </div>
                        <div style={{ marginLeft: '-20px', textAlign: 'center',marginTop: '-55px',marginRight: '65px' }}>
                                <img
                                    src="https://recipe1.ezmember.co.kr/img/pic_none4.gif" // 여기에 실제 이미지 URL을 넣으세요
                                    alt="요리 대표 사진"
                                    style={{ width: '175px', height: '175px', border: '1px solid #ccc', borderRadius: '8px' }}
                                />
                            </div>
                    </div>
                    <hr style={{margin: '20px 0', height: '2px', backgroundColor: '#f4b057', border: 'none' }} />

                    {/* <div className="cont_line pad_b_25">
                        <p className="cont_tit4">동영상</p>
                        <textarea
                            value={videoUrl}
                            onChange={(e) => setVideoUrl(e.target.value)}
                            className="form-control step_cont"
                            placeholder="동영상이 있으면 주소를 입력하세요."
                            style={{ height: '100px', width: '380px', resize: 'none' }}
                        />
                    </div> */}

                    <div className="cont_line">
                        <p className="cont_tit4">카테고리</p>
                        <select
                            name="cok_sq_category_4"
                            onChange={(e) => setCategories({ ...categories, category1: e.target.value })}
                        >
                            <option value="">종류별</option>
                            <option value="63">밑반찬</option>
                            <option value="56">메인반찬</option>
                            <option value="54">국/탕</option>
                            <option value="55">찌개</option>
                            <option value="60">디저트</option>
                            <option value="53">면/만두</option>
                            <option value="52">밥/죽/떡</option>
                            <option value="61">퓨전</option>
                            <option value="57">김치/젓갈/장류</option>
                            <option value="58">양념/소스/잼</option>
                            <option value="65">양식</option>
                            <option value="64">샐러드</option>
                            <option value="68">스프</option>
                            <option value="66">빵</option>
                            <option value="69">과자</option>
                            <option value="59">차/음료/술</option>
                            <option value="62">기타</option>
                            {/* 다른 카테고리 추가 */}
                        </select>
                        <select
                            name="cok_sq_category_2"
                            onChange={(e) => setCategories({ ...categories, category2: e.target.value })}
                        >
                            <option value="">상황별</option>
                            <option value="12">일상</option>
                            <option value="18">초스피드</option>
                            <option value="13">손님접대</option>
                            <option value="19">술안주</option>
                            <option value="21">다이어트</option>
                            <option value="15">도시락</option>
                            <option value="43">영양식</option>
                            <option value="17">간식</option>
                            <option value="45">야식</option>
                            <option value="20">푸드스타일링</option>
                            <option value="46">해장</option>
                            <option value="44">명절</option>
                            <option value="14">이유식</option>
                            <option value="22">기타</option>
                            {/* 다른 카테고리 추가 */}
                        </select>
                        <select
                            name="cok_sq_category_1"
                            onChange={(e) => setCategories({ ...categories, category3: e.target.value })}
                        >
                            <option value="">방법별</option>
                            <option value="6">볶음</option>
                            <option value="1">끓이기</option>
                            <option value="7">부침</option>
                            <option value="36">조림</option>
                            <option value="41">무침</option>
                            <option value="42">비빔</option>
                            <option value="8">찜</option>
                            <option value="10">절임</option>
                            <option value="9">튀김</option>
                            <option value="38">삶기</option>
                            <option value="67">굽기</option>
                            <option value="39">데치기</option>
                            <option value="37">회</option>
                            <option value="11">기타</option>
                            {/* 다른 카테고리 추가 */}
                        </select>
                        <select name="cok_sq_category_3" id="cok_sq_category_3"  text="재료별">
                        <option value="" >재료별</option><option value="70">소고기</option>
                        <option value="71">돼지고기</option>
                        <option value="72">닭고기</option>
                        <option value="23">육류</option>
                        <option value="28">채소류</option>
                        <option value="24">해물류</option>
                        <option value="50">달걀/유제품</option>
                        <option value="33">가공식품류</option>
                        <option value="47">쌀</option>
                        <option value="32">밀가루</option>
                        <option value="25">건어물류</option>
                        <option value="31">버섯류</option>
                        <option value="48">과일류</option>
                        <option value="27">콩/견과류</option>
                        <option value="26">곡류</option>
                        <option value="34">기타</option>
                        </select>
                        </div>

                    <div className="cont_line">
                        <p className="cont_tit4">요리정보</p>
                        <span>인원</span>
                        <select
                            name="cok_portion"
                            onChange={(e) => setCookingInfo({ ...cookingInfo, portion: e.target.value })}
                        >
                            <option value="">인원</option>
                            <option value="1">1인분</option>
                            <option value="2">2인분</option>
                            <option value="3">3인분</option>
                            <option value="4">4인분</option>
                            <option value="5">5인분</option>
                            <option value="6">6인분이상</option>
                            {/* 다른 인원 추가 */}
                        </select>
                        <span className="pad_l_30">시간</span>
                        <select
                            name="cok_time"
                            onChange={(e) => setCookingInfo({ ...cookingInfo, time: e.target.value })}
                        >
                            <option value="">시간</option>
                            <option value="5">5분이내</option>
                            <option value="10">10분이내</option>
                            <option value="15">15분이내</option>
                            <option value="20">20분이내</option>
                            <option value="30">30분이내</option>
                            <option value="60">60분이내</option>
                            <option value="90">90분이내</option>
                            <option value="120">2시간이내</option>
                            <option value="999">2시간이상</option>
                            </select>
                            {/* 다른 시간 추가 */}
                        
                        <span className="pad_l_30">난이도</span>
                        <select
                            name="cok_degree"
                            onChange={(e) => setCookingInfo({ ...cookingInfo, degree: e.target.value })}
                        >
                            <option value="">난이도</option>
                            <option value="1">아무나</option>
                            <option value="2">초급</option>
                            <option value="3">중급</option>
                            <option value="4">고급</option>
                            <option value="5">신의경지</option>

                            {/* 다른 난이도 추가 */}
                        </select>
                    </div>
                </div>

                <div className="cont_box pad_l_60">
                <p className="cont_tit3">
                    재료 정보
                    <button
                        id="btnAutoMaterialModal"
                        type="button"
                        className="btn-sm btn-default"
                        onClick={handleAddMaterialGroup}
                    >
                        <span className="glyphicon glyphicon-plus"></span> 재료 한번에 입력
                    </button>
                    <span className="cont_tit3_s">
                        ※ 재료 한번에 입력 버튼을 통해 재료를 "," 쉼표로 구분하여 한번에 입력할 수 있어요.
                    </span>
                </p>
                <span className="guide mag_b_15" style={{ width: '100%' }}>
                    재료가 남거나 부족하지 않도록 정확한 계량정보를 적어주세요.
                </span>
                <div className="mag_b_25 ui-sortable" id="divMaterialGroupArea">
                    {/* 재료 그룹 입력 부분 */}
                    <textarea
                        value={ingredients}
                        onChange={(e) => setIngredients(e.target.value)}
                        className="form-control step_cont"
                        placeholder="재료를 입력하세요."
                        style={{ height: '100px', width: '100%', resize: 'none' }}
                    />
                </div>
                <div className="noti">
                    ※ 양념, 양념장, 소스, 드레싱, 토핑, 시럽, 육수 밑간 등으로 구분해서 작성해주세요.
                    <div className="noti_btn">
                        <button type="button" onClick={handleAddMaterialGroup} className="btn-lg btn-default">
                            <span className="glyphicon glyphicon-plus"></span> 재료 묶음 추가
                        </button>
                    </div>
                </div>
            </div>

            <div className="cont_box pad_l_60">
                <input
                    type="file"
                    name="file"
                    id="multifile_1"
                    style={{ display: 'none' }}
                    multiple
                    onChange={handleFileChange}
                />
                <p className="cont_tit3">
                    요리순서
                    <button
                        type="button"
                        onClick={() => document.getElementById('multifile_1').click()}
                        className="btn-sm btn-default"
                    >
                        <span className="glyphicon glyphicon-plus"></span> 순서사진 한번에 넣기
                    </button>
                </p>
                <span className="guide mag_b_15">
                    <b>요리의 맛이 좌우될 수 있는 중요한 부분은 빠짐없이 적어주세요.</b><br />
                    예) 10분간 익혀주세요 ▷ 10분간 약한불로 익혀주세요.<br />
                    마늘편은 익혀주세요 ▷ 마늘편을 충분히 익혀주셔야 매운 맛이 사라집니다.<br />
                    꿀을 조금 넣어주세요 ▷ 꿀이 없는 경우, 설탕 1스푼으로 대체 가능합니다.
                </span>
            </div>
                <div className="regi_btm">
                    <button type="button" onClick={() => handleSubmit('save')} className="btn-lg btn-primary">저장</button>
                    {/* <button type="button" onClick={() => handleSubmit('save_public')} className="btn-lg btn-warning">저장 후 공개하기</button> */}
                    <button type="button" onClick={() => window.history.back()} className="btn-lg btn-default">취소</button>
                </div>
            </div>

            {/* 재료 한번에 입력 모달 */}
            {/* <div id="divAutoMaterialModal" className="modal fade">
                <div className="modal-dialog" style={{ width: '700px' }}>
                    <div className="modal-content new_folder">
                        <div className="modal-header">
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true"><img src="https://recipe1.ezmember.co.kr/img/btn_close.gif" alt="닫기" /></span>
                            </button>
                            <h4 className="modal-title text-left" id="auto_material_title">재료 한번에 입력</h4>
                        </div>

                        <div className="modal-body" style={{ padding: '5px' }}>
                            <dl className="blog_select">
                                <dt style={{ padding: '10px 0 5px 0', fontSize: '17px', textAlign: 'center' }}>
                                    요리에 들어갈 재료, 양념을 작성 또는 따로 작성된 것을 복사/붙여넣기 해주세요.
                                </dt>
                                <dd>
                                    <textarea
                                        id="q_auto_material"
                                        className="form-control step_cont"
                                        style={{ height: '120px', width: '620px', resize: 'none' }}
                                        placeholder="<예시>\n[스테이크 재료] 돼지고기 500g, 양파 1/2개, 고추 1개, 간장\n[파절임] 대파 3개, 고춧가루 1숟가락, 매실엑기스 3숟가락, 식초 3숟가락\n[양념] 고춧가루 2T, 진간장 1T, 참치액 1T, 참기름 1T, 매실액 1T, 통깨"
                                    ></textarea>
                                    <p style={{ fontSize: '15px', lineHeight: '1.8', padding: '15px 0 0 15px', margin: '0' }}>
                                        *재료가 남거나 부족하지 않도록 <strong>정확히</strong> 작성<br />
                                        *각 식재료는 <strong>"," 쉼표로</strong> 구분<br />
                                        *한개, 반개, 한개반과 같은 표기는 1개, <strong>1/2개, 1+1/2개(또는 1.5개)</strong>와 같이 작성<br />
                                        *재료 및 양념, 소스 등을 구분할 경우 <strong>"[]" 대괄호를 사용</strong><br />
                                        *입력란에 작성된 <strong>예시를 참고</strong>
                                    </p>
                                </dd>
                            </dl>
                        </div>
                        <div className="modal-footer">
                            <button type="button" id="btnAutoMaterialConfirm" className="btn-lg btn-primary">확인</button>
                            <button type="button" className="btn-lg btn-default" data-dismiss="modal">취소</button>
                        </div>
                        <p style={{ textAlign: 'center', padding: '0 0 20px 0' }}>
                            <img src="https://recipe1.ezmember.co.kr/img/img_use.gif?v.1" alt="사용 안내" />
                        </p>
                    </div>
                </div>
            </div> */}
        </div>
    );
};


export default RecipeSignup;
