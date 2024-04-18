const record = document.getElementById("record-input")
const bulkDeKey = document.getElementById("bulk-de-input")
const chance = new Chance();

// 숫자 유효성 검사
function isValidNumber(number) {
    return typeof number === 'number' && !isNaN(number);
}
// 이메일형식 유효성 검사
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function sendBulkDummyData(deKey) {
    if(deKey){
        try {
            const response = axios.post("/sendRecords", dummyData, {
                headers: { 'Content-Type': 'application/json' }
            });
            console.log('Response:', response.data);
            alert('Data successfully sent to the server!');
        } catch (error) {
            console.error('Error sending data to the server:', error);
            alert('Failed to send data to the server. Please try again later.');
        }
    }
}

// makeDummyData 함수를 호출하여 더미 데이터 생성
function makeDummyData(record) {
    if(!isValidNumber(record)) {
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

            dummyData.push({
                "ContactKey": ContactKey,
                "EmailAddress": EmailAddress,
                "FirstName": FirstName,
                "LastName": LastName,
                "Phone": Phone
            });
        }
        console.log(dummyData)
    } else {
        alert("숫자를 입력하세요.")
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

// container 높이 조절
window.addEventListener('load', function() {
    const headerHeight = document.querySelector('.header').offsetHeight;
    const footerHeight = document.querySelector('.footer').offsetHeight;
    const container = document.querySelector('.container');
    const calculatedHeight = window.innerHeight - (headerHeight + footerHeight);
    container.style.minHeight = calculatedHeight + 'px';
});