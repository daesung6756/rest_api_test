const GenerateRecordInfo = document.getElementById("generateRecordInfo")
const bulkRecord = document.getElementById("bulkRecordInput")
const deKeyInput = document.getElementById("bulkDeInput")
const chance = new Chance();

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
    if(deKey){
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

function sendSingleDummyData(deKey) {
    deKey.trim()
    if(deKey){
        try {
            const response = axios.post("/sendRecord", {singleDummyData, deKey}, {
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

    singleDummyData = {
        "ContactKey": ContactKey,
        "EmailAddress": EmailAddress,
        "FirstName": FirstName,
        "LastName": LastName,
        "Phone": Phone
    }
    dummyDataWriter(singleDummyData)
}

function dummyDataWriter( obj ) {
    GenerateRecordInfo.innerHTML = ""
    const p = document.createElement("p")
    const jsonString = JSON.stringify(obj,null, 2);
    p.textContent = jsonString
    GenerateRecordInfo.appendChild(p)

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