const form = document.getElementById("signInForm")
const record = document.getElementById("record-input")
const chance = new Chance();

form.addEventListener("submit", (e) => {
    e.preventDefault()
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
            alert('로그인 성공!');
        })
        .catch(error => {
            // 요청이 실패했을 때 실행할 작업을 여기에 추가합니다.
            console.error('로그인 요청 실패:', error);
            alert('로그인에 실패했습니다.');
        });
});

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function sendDummyData() {
    try {
        const response = axios.post("/test", dummyData, {
            headers: { 'Content-Type': 'application/json' }
        });
        console.log('Response:', response.data);
        alert('Data successfully sent to the server!');
    } catch (error) {
        console.error('Error sending data to the server:', error);
        alert('Failed to send data to the server. Please try again later.');
    }
}

// makeDummyData 함수를 호출하여 더미 데이터 생성
function makeDummyData(record) {
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

function isUtmTagExists() {
    return window.location.href.includes('utm_tag');
}

function getUtmTagValue() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('utm_tag').trim();
}