let bulkDummyData = [];
let singleApiEventData = {};
const myObjectSetting={};
let myObject={};
const myObjectArray=[];


const workingChanceMethods = {
    basic: [],
    personal: [],
    location: [],
    datetime: [],
    web: [],
    finance: [],
    image: [],
    miscellaneous: []
};

const chanceMethods = {
    basic: ['bool', 'character', 'floating', 'integer', 'natural', 'string', 'word'],
    personal: ['first', 'last', 'name', 'prefix', 'suffix', 'name_prefix', 'name_suffix','phone'],
    location: ['address', 'city', 'province', 'country', 'zip', 'latitude', 'longitude'],
    datetime: ['date', 'year', 'month', 'hour', 'minute', 'second', 'timestamp'],
    web: ['email', 'url', 'domain', 'ip', 'tld', 'twitter'],
    finance: ['cc', 'cc_type', 'currency'],
    image: ['color', 'avatar'],
    miscellaneous: ['guid','hash','ssn','postal']
};

for (const category in chanceMethods) {
    chanceMethods[category].forEach((method) => {
        try {
            chance[method]();
            workingChanceMethods[category].push(method);
        } catch (error) {
            console.log(`Method "${method}" in category "${category}" failed: ${error.message}`);
        }
    });
}

// Chance.js 메서드에 대한 한글 설명을 추가합니다.
const chanceMethodDescriptions = {
    'bool': '부울 값 (true/false)',
    'character': '문자',
    'floating': '부동 소수점 수',
    'integer': '정수',
    'natural': '자연수',
    'string': '문자열',
    'word': '단어',
    'first': '이름',
    'last': '성',
    'name': '이름 (이름과 성 포함)',
    'prefix': '접두사',
    'suffix': '접미사',
    'name_prefix': '이름 접두사',
    'name_suffix': '이름 접미사',
    'phone': "전화번호",
    'address': '주소',
    'city': '도시 이름',
    'province': '주 (행정 구역)',
    'country': '국가 이름',
    'zip': '우편 번호',
    'latitude': '위도',
    'longitude': '경도',
    'date': '날짜',
    'year': '연도',
    'month': '월',
    'hour': '시간 (시간 단위)',
    'minute': '분',
    'second': '초',
    'timestamp': '타임스탬프',
    'email': '이메일 주소',
    'url': 'URL',
    'domain': '도메인',
    'ip': 'IP 주소',
    'tld': '최상위 도메인',
    'twitter': '트위터 핸들',
    'cc': '신용카드 번호',
    'cc_type': '신용카드 유형',
    'currency': '통화 코드',
    'color': '색상',
    'avatar': '아바타 URL',
    'guid': 'GUID',
    'hash' : '해시 값 (MD5, SHA-1, SHA-256 등)',
    'ssn' : '사회 보장 번호 (SSN)',
    'postal' : '우편번호 (미국 형식)'
};


// id="add-property" 버튼을 클릭할 때 새로운 li 요소를 추가하는 함수
document.querySelector('#add-property').addEventListener('click', function() {
    const propertyGroup = document.querySelector('#add-property-group');
    const newPropertyItem = document.createElement('li');

    // 새로운 li 요소의 HTML 콘텐츠 설정
    newPropertyItem.innerHTML = `
        <fieldset class="input-btn-field">
            <input type="text" class="key-name-input" placeholder="키 값을 입력하세요">
            <button type="button" class="option-selector bg-dark-brown" disabled>속성 선택</button>
        </fieldset>
        <button type="button" class="remove-btn">삭제</button>
    `;

    // remove-btn 이벤트 핸들러 추가
    newPropertyItem.querySelector('.remove-btn').addEventListener('click', function() {
        // li 요소 삭제
        const inputField = newPropertyItem.querySelector('input');
        const key = inputField.value.trim();

        // myObjectSetting 객체에서 해당 키를 삭제
        if (key && key in myObjectSetting) {
            delete myObjectSetting[key];
        }

        // id="displayMyObjectSetting" 요소에 myObjectSetting을 JSON 형식으로 표시
        displayMyObjectSetting();

        // li 요소 삭제
        newPropertyItem.remove();
    });

    // option-selector 버튼 이벤트 핸들러 추가
    newPropertyItem.querySelector('.option-selector').addEventListener('click', function() {
        openPropertyPopup((selectedMethod) => {
            // 선택한 메서드를 버튼에 표시
            this.textContent = selectedMethod;

            // 앞에 있는 input의 키 값과 선택한 메서드를 myObjectSetting에 추가
            const inputField = newPropertyItem.querySelector('input');
            const key = inputField.value.trim();

            if (key) {
                // 키가 이미 myObjectSetting에 존재하는지 확인
                if (key in myObjectSetting) {
                    alert('해당 키가 이미 존재합니다. 다른 키를 입력하세요.');
                    return;
                }

                // myObjectSetting 객체에 키와 메서드 명 추가
                myObjectSetting[key] = selectedMethod;

                // displayMyObjectSetting에 myObjectSetting을 JSON 형식으로 표시
                displayMyObjectSetting();
                inputField.readOnly = true
                this.disabled = true
            } else {
                alert('키 값을 입력하세요.');
            }
        });
    });

    // input 필드의 입력 이벤트 모니터링
    newPropertyItem.querySelector('input').addEventListener('input', function() {
        const optionSelectorBtn = newPropertyItem.querySelector('.option-selector');
        if (this.value.trim() !== '') {
            optionSelectorBtn.disabled = false;
        } else {
            optionSelectorBtn.disabled = true;
        }
    });

    // li 요소를 propertyGroup에 추가
    propertyGroup.appendChild(newPropertyItem);
});


// 팝업을 통해 Chance.js 메서드 리스트를 표시하는 함수
function openPropertyPopup(callback) {
    // 팝업 창 생성
    const popup = window.open('', '_blank', 'width=300,height=400');

    // 팝업 콘텐츠 생성
    const popupContent = document.createElement('div');
    popupContent.style.padding = '10px';

    // Chance.js 메서드 목록을 카테고리별로 그룹화하여 팝업에 표시
    const categories = [
        { name: 'Basic', methods: workingChanceMethods.basic },
        { name: 'Personal', methods: workingChanceMethods.personal },
        { name: 'Location', methods: workingChanceMethods.location },
        { name: 'Date & Time', methods: workingChanceMethods.datetime },
        { name: 'Web', methods: workingChanceMethods.web },
        { name: 'Finance', methods: workingChanceMethods.finance },
        { name: 'Image', methods: workingChanceMethods.image },
        { name: 'Miscellaneous', methods: workingChanceMethods.miscellaneous }
    ];

    // 카테고리별로 메서드 버튼을 생성
    categories.forEach(category => {
        // 카테고리 제목을 팝업 콘텐츠에 추가
        const categoryTitle = document.createElement('h3');
        categoryTitle.textContent = category.name;
        popupContent.appendChild(categoryTitle);

        // 각 메서드에 대해 버튼 생성
        category.methods.forEach(method => {
            // `chanceMethodDescriptions`에서 메서드 설명을 가져옵니다.
            const methodDescription = chanceMethodDescriptions[method];

            // 버튼 생성
            const button = document.createElement('button');
            button.textContent = methodDescription; // 메서드 설명을 버튼 텍스트로 사용
            button.addEventListener('click', function() {
                // 선택한 메서드 전달
                callback(method);
                popup.close();
            });
            popupContent.appendChild(button);
        });
    });

    // 팝업 콘텐츠를 팝업 창에 추가
    popup.document.body.appendChild(popupContent);
}


function displayMyObjectSetting() {
    const displayDiv = document.querySelector('#displayMyObjectSetting');
    displayDiv.innerHTML = `<pre>${JSON.stringify(myObjectSetting, null, 2)}</pre>`;
}

function createData() {
    // `const myObjectSetting={};` 객체에 키가 있는지 확인
    const hasKeysInMyObjectSetting = Object.keys(myObjectSetting).length > 0;

    // 키가 없으면 더미데이터 셋팅부터 진행하라는 메시지 표시
    if (!hasKeysInMyObjectSetting) {
        alert('더미데이터 셋팅부터 진행하세요.');
        return;
    }

    // `id="data-length"` 입력 필드에서 값 가져오기
    const dataLengthInput = document.querySelector('#data-length');
    let dataLength = parseInt(dataLengthInput.value, 10);

    // `data-length` 값이 숫자가 아니거나 유효한 숫자가 아닌 경우
    if (isNaN(dataLength) || dataLength < 0) {
        alert('유효한 숫자를 입력하세요.');
        return;
    }

    // `data-length`가 0이면 빈 값으로 처리
    if (dataLength === 0) {
        document.querySelector('#dummyData').value = '';
        return;
    }

    if(dataLength === 1) {
        const obj = {};

        for (const key in myObjectSetting) {
            if (myObjectSetting.hasOwnProperty(key)) {
                const methodName = myObjectSetting[key];

                // 찬스 메서드 발동하여 값 생성
                const value = chance[methodName]();

                // 키와 값 매핑
                obj[key] = value;
            }
        }

        myObject = obj
    }

    // `myObjectSetting` 객체의 키와 값을 반복
    for (let i = 0; i < dataLength; i++) {
        // 새로운 객체를 초기화
        const obj = {};

        for (const key in myObjectSetting) {
            if (myObjectSetting.hasOwnProperty(key)) {
                const methodName = myObjectSetting[key];

                // 찬스 메서드 발동하여 값 생성
                const value = chance[methodName]();

                // 키와 값 매핑
                obj[key] = value;
            }
        }

        // 여러 객체일 때
        myObjectArray.push(obj);
    }

    // 결과를 `#dummyData` 요소에 JSON 형식으로 표시
    const displayTextarea = document.querySelector('#dummyData');
    displayTextarea.value = JSON.stringify(dataLength === 1 ? myObject : myObjectArray, null, 2);
}

function resetDummyData() {
    // `dummyData` 요소의 값을 빈 문자열로 초기화합니다.
    document.querySelector('#dummyData').value = '';
    // 완료 알람을 표시합니다.
    alert('데이터가 초기화되었습니다.');
}

function exportCsvDummyData() {
    // `dummyData` 요소의 값을 가져옵니다.
    const dummyDataValue = document.querySelector('#dummyData').value;

    // JSON 형식의 데이터를 파싱합니다.
    let jsonData;
    try {
        jsonData = JSON.parse(dummyDataValue);
    } catch (error) {
        alert('JSON 파싱 오류: 유효한 JSON 형식의 데이터를 입력하세요.');
        return;
    }

    // CSV 형식의 문자열을 생성합니다.
    const csvRows = [];

    // 배열의 헤더를 추출합니다.
    const headers = Object.keys(jsonData[0]);
    csvRows.push(headers.join(','));

    // 각 객체를 CSV 형식으로 변환합니다.
    jsonData.forEach(item => {
        const values = headers.map(header => {
            // 값에 따옴표를 추가하여 CSV 형식에 맞추어줍니다.
            const value = item[header] === undefined ? '' : item[header];
            return `"${value}"`;
        });
        csvRows.push(values.join(','));
    });

    // CSV 문자열을 만듭니다.
    const csvString = csvRows.join('\n');

    // CSV 파일을 생성하기 위해 blob을 생성합니다.
    const blob = new Blob([csvString], { type: 'text/csv' });

    // Blob URL을 생성합니다.
    const url = URL.createObjectURL(blob);

    // 임시적으로 링크 요소를 생성합니다.
    const a = document.createElement('a');
    a.href = url;
    a.download = 'data.csv'; // 파일 이름을 지정합니다.
    a.click(); // 다운로드를 실행합니다.

    // Blob URL을 해제합니다.
    URL.revokeObjectURL(url);

    // 완료 알람을 표시합니다.
    alert('CSV 파일이 생성되었습니다.');
}

function clipboardCopyDummyData() {
    // `dummyData` 요소의 값을 가져옵니다.
    const dummyDataValue = document.querySelector('#dummyData').value;

    // 클립보드에 복사합니다.
    navigator.clipboard.writeText(dummyDataValue)
        .then(() => {
            // 완료 알람을 표시합니다.
            alert('데이터가 클립보드에 복사되었습니다.');
        })
        .catch(() => {
            // 에러 발생 시 경고 알람을 표시합니다.
            alert('클립보드 복사 중 문제가 발생했습니다.');
        });
}