const GenerateRecordInfo = document.getElementById("generateRecordInfo")
const bulkRecord = document.getElementById("bulkRecordInput")
const deKeyInput = document.getElementById("bulkDeInput")
const apiEventInput = document.getElementById("singleApiEventInput")
const loader = document.getElementById("loader");
const chance = new Chance();
const form = document.getElementById("signInForm")

// 숫자 유효성 검사
function isValidNumber(number) {
    console.log(number)
    const valueRegex = /^-?\d*\.?\d+$/
    return valueRegex.test(String(number));
}

// 이메일형식 유효성 검사
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function sendBulkDummyData(deKey) {
    deKey.trim()
    if(deKey.length === 36){
        try {
            const response = axios.post("/sendRecords", {bulkDummyData, deKey}, {
                headers: { 'Content-Type': 'application/json' }
            });
            console.log('Response:', response.data);
            alert('Data successfully sent to the server!');
        } catch (error) {
            console.error('Error sending data to the server:', error);
            alert('Failed to send data to the server. Please try again later.');
        }
    } else {
        deKeyInput.focus()
        alert("DE 외부키를 입력하세요.")
    }
}

function sendApiEventData(apiKey) {
    apiKey.trim()
    if(apiKey.length === 45){
        try {
            const response = axios.post("/sendApiEvent", {singleApiEventData, apiKey}, {
                headers: { 'Content-Type': 'application/json' }
            });
            console.log('Response:', response);
            alert('Data successfully sent to the server!');
        } catch (error) {
            console.error('Error sending data to the server:', error);
            alert('Failed to send data to the server. Please try again later.');
        }
    } else if (Object.keys(singleApiEventData).length === 0){
        alert("데이터를 생성하세요.")
    } else {
        apiEventInput.focus()
        alert("API 키가 올바르지 않거나 값이 없습니다.")
    }
}
// makeBulkDummyData 함수를 호출하여 더미 데이터 생성
function makeBulkDummyData(record) {
    record.trim()

    if(!isValidNumber(record)) {
        bulkRecord.value =""
        bulkRecord.focus()
        alert("숫자만 입력하세요.")
        return;
    }

    if(record){
        for (let i = 0; i < record; i++) {
            const ContactKey = chance.guid();
            const EmailAddress = chance.email();
            const FirstName = chance.first();
            const LastName = chance.last();
            const Phone = chance.phone();

            bulkDummyData.push({
                "ContactKey": ContactKey,
                "EmailAddress": EmailAddress,
                "FirstName": FirstName,
                "LastName": LastName,
                "Phone": Phone
            });
        }
        dummyDataWriter(bulkDummyData)
    } else {
        alert("숫자를 입력하세요.")
    }
}

function makeSingleDummyData() {
    const ContactKey = chance.guid();
    const EmailAddress = chance.email();
    const FirstName = chance.first();
    const LastName = chance.last();
    const Phone = chance.phone();

    singleApiEventData = {
        "ContactKey": ContactKey,
        "EmailAddress": EmailAddress,
        "FirstName": FirstName,
        "LastName": LastName,
        "Phone": Phone
    }
    dummyDataWriter(singleApiEventData)
}

function dummyDataWriter( obj ) {
    GenerateRecordInfo.innerHTML = ""
    const jsonString = JSON.stringify(obj,null, 2);
    GenerateRecordInfo.value =  jsonString;

}
async function login() {
    loadingEvent(900)
    const userId = document.getElementById("userId");
    const userPassword = document.getElementById("userPassword");

    if (!userId || !userPassword) {
        console.error('userId 또는 userPassword 요소를 찾을 수 없습니다.');
        return;
    }

    const email = userId.value.trim();
    const password = userPassword.value.trim();

    if (!email || !isValidEmail(email)) {
        alert('올바른 이메일 주소를 입력하세요.');
        return;
    }

    if (!password || password.length < 8) {
        alert('비밀번호는 최소 8자 이상이어야 합니다.');
        return;
    }

    const loginData = {
        userId: email, // email이 userId로 사용될 수 있음
        userPassword: password,
        utmTag: isUtmTagExists() ? `utm_tag=${getUtmTagValue()}` : false
    }

    axios.post('/login', loginData)
        .then(response => {
            // 서버로부터 응답을 받았을 때 실행할 작업을 여기에 추가합니다.
            console.log(response.data);
            alert("로그인에 성공했습니다.")
            window.location.href = '/main';
        })
        .catch(error => {
            // 요청이 실패했을 때 실행할 작업을 여기에 추가합니다.
            console.error('로그인 요청 실패:', error);
            alert('로그인에 실패했습니다.');
        });
}
async function logout() {
    try {
        // 백엔드 로그아웃 엔드포인트로 POST 요청 보내기
        const response = await axios.post('/logout', {
            headers: {
                'Content-Type': 'application/json',
            },
        });

        // 요청 처리 결과 확인
        if (response.status === 200) {
            // 로그아웃이 성공하면 로그인 페이지로 리디렉션
            window.location.href = '/';
        } else {
            // 로그아웃 실패 시 오류 메시지 출력
            console.error('로그아웃 실패:', response.data.message);
        }
    } catch (error) {
        console.error('로그아웃 중 에러 발생:', error);
    }
}

// utm tag 유/무 확인
function isUtmTagExists() {
    return window.location.href.includes('utm_tag');
}

// utm tag value 가져오기
function getUtmTagValue() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('utm_tag').trim();
}

function loadingEvent (second) {
    loader.classList.add("is-show")
    const loadingTimer = setTimeout(() => {
        loader.classList.remove("is-show")
        clearTimeout(loadingTimer)
    }, second)

}
const commonFunc = {
    toggle : function (elem , className){
        elem.classList.toggle(className)
    },
}

document.addEventListener("DOMContentLoaded", () => {


    if(form){
        form.addEventListener("submit", (e) => {
            e.preventDefault()
            login()
        });
    }
})

// container 높이 조절
window.addEventListener('load', function() {
    const headerHeight = document.querySelector('.header').clientHeight;
    const footerHeight = document.querySelector('.footer').clientHeight;
    const container = document.querySelector('.container');
    const content = document.querySelector('.content');
    const calculatedHeight = window.innerHeight - (headerHeight + footerHeight + 41);

    container.style.minHeight = calculatedHeight + 'px';
    if(content.classList.contains("is-center")) content.style.minHeight = calculatedHeight + 'px';

    loadingEvent(900)
});