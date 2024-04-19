require('dotenv').config()
const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieSession = require("cookie-session");
const app = express();
const PORT = 3000;
const cors = require('cors');

const ACCOUNT_ID = process.env.ACCOUNT_ID;
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const SUB_DOMAIN = process.env.SUB_DOMAIN;
const USER_ID = process.env.USER_ID;
const USER_PASSWORD = process.env.USER_PASSWORD;
const JSON_WEB_TOKEN = process.env.TOKEN;

let DATA_EXTENSION_EXTERNAL_KEY = null;
let EVENT_DEFINITION_KEY = null;

const authUrl = `https://${SUB_DOMAIN}.auth.marketingcloudapis.com/v2/token`;

app.use(cors());

// html파일에 직접 접근 거부
app.use('/main.html', (req, res) => {
    return res.redirect('/main');
});

// 정적 파일을 제공할 폴더 설정
app.use(express.static('public'));

// Body parser middleware to handle post requests
app.use(bodyParser.json());

// 세션 데이터 암호화
app.use(cookieSession({ name: "auth", keys: ["COOKIE_SECRET"], httpOnly: true }));

// 기본 경로에 index.html 파일 제공
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

async function getAccessToken() {
    try {
        const response = await axios.post(authUrl, {
            grant_type: 'client_credentials',
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET,
            account_id: ACCOUNT_ID
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const responseData = response.data;
        const accessToken = responseData["access_token"];

        if (accessToken && accessToken.length > 0) {
            console.log("인증 성공");
            return accessToken;
        } else {
            console.error('Access token not received');
            throw new Error('액세스 토큰을 받지 못했습니다.');
        }
    } catch (error) {
        if (error.response) {
            console.error('Error during authentication:', error.response.status);
            if (error.response.status === 400) {
                throw new Error('잘못된 요청입니다. 클라이언트 자격 증명 또는 요청 형식을 확인하세요.');
            } else if (error.response.status === 401) {
                throw new Error('인증 실패. 클라이언트 자격 증명 또는 액세스 권한을 확인하세요.');
            } else {
                throw new Error('인증 요청 중 오류가 발생했습니다.');
            }
        } else if (error.request) {
            console.error('No response received during authentication');
            throw new Error('인증 요청에 응답이 없습니다.');
        } else {
            console.error('Error during authentication:', error.message);
            throw new Error('인증 중에 오류가 발생했습니다.');
        }
    }
}


// DE
app.post('/sendRecords', async (req, res) => {
    try {
        const accessToken = await getAccessToken(); // 액세스 토큰을 얻을 때까지 기다립니다.
        const users = req.body.bulkDummyData;
        const data = users.map(user => ({
            "keys": {
                "ContactKey": user.ContactKey
            },
            "values": {
                "EmailAddress": user.EmailAddress,
                "FirstName": user.FirstName,
                "LastName": user.LastName,
                "Phone": user.Phone
            }
        }));

        DATA_EXTENSION_EXTERNAL_KEY = req.body.deKey

        const endpoint = `https://${SUB_DOMAIN}.rest.marketingcloudapis.com/hub/v1/dataeventsasync/key:${DATA_EXTENSION_EXTERNAL_KEY}/rowset`;

        const config = {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        };

        const response = await axios.post(endpoint, data, config);
        const responseData = response.data;

        if (response.status === 200) {
            res.status(200).json({ message: '성공', response: responseData });
        } else if(response.status === 202) {
            res.status(202).json({ message: '잠시 대기중', response: responseData });
        } else if(response.status === 413) {
            res.status(413).json({ message: '레코드 갯수가 너무 많습니다. (최대 하루 5000개)', response: responseData });
        }
    } catch (error) {
        console.error('실패', error);
        res.status(500).json({ message: '실패입니다.', error: error.message });
    }
});

// API EVENT (ENTRY)
app.post('/sendApiEvent', async (req, res) => {
    try {
        const accessToken = await getAccessToken(); // 액세스 토큰을 얻을 때까지 기다립니다.
        const { ContactKey, EmailAddress, FirstName, LastName, Phone } = req.body.singleApiEventData;

        EVENT_DEFINITION_KEY = req.body.apiKey;

        const data = {
            "ContactKey": ContactKey,
            "EventDefinitionKey": EVENT_DEFINITION_KEY,
            "Data": {
                "SubscriberKey": ContactKey,
                "EmailAddress": EmailAddress,
                "FirstName": FirstName,
                "LastName": LastName,
                "Phone": Phone,
            }
        }

        const endpoint = `https://${SUB_DOMAIN}.rest.marketingcloudapis.com/interaction/v1/events`;

        const config = {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            }
        };

        const response = await axios.post(endpoint, data, config);
        const responseData = response.data;

        if (response.status === 200 || response.status === 201) {
            res.status(200 || 201).json({ message: '성공', response: responseData });
        } else if (response.status === 202) {
            res.status(202).json({ message: '잠시 대기중', response: responseData });
        }
    } catch (error) {
        console.error('에러 코드:', error.response?.status);
        console.error('에러 메시지:', error.message);
        console.error('API 응답 데이터:', error.response?.data);

        res.status(error.response?.status || 500).json({ message: '실패입니다.', error: error.message});
    }
});


//로그인 기능
app.post('/login', async(req, res) => {

    try {
        const { userId, userPassword, utmTag } = req.body;

        //아이디 확인
        const IdMatch = (USER_ID == userId);
        if(!IdMatch) {
            return res.status(401).send('아이디를 확인해주세요.');
        }

        //비밀번호 확인
        const passwordMatch = bcrypt.compareSync(userPassword, USER_PASSWORD);
        if(passwordMatch) {
            const jsonWebToken = jwt.sign({ id: userId },
                                            JSON_WEB_TOKEN,
                                            {
                                                algorithm: 'HS256',
                                                allowInsecureKeySizes: true,
                                                expiresIn: 86400, // 24H
                                            });
            
            req.session.token = jsonWebToken;
            req.session.utmTag = utmTag;

            return res.status(200).redirect('/main');
        } else {
            return res.status(401).send('비밀번호를 확인해주세요.');
        }
    } catch(error) {
        res.status(500).json({ message: '로그인 시도 중 문제가 생겼습니다.', error: error.message });
    }

});

//토큰 검증
const verifyToken = (req, res, next) => {
    const jsonWebToken = req.session.token;

    if (!jsonWebToken) {
        return res.status(403).send({
            message: "토큰 검증 실패 !!",
        });
    }

    jwt.verify(jsonWebToken, JSON_WEB_TOKEN, (err, decoded) => {
        if (err) {
            return res.status(401).send({
                message: "토큰 검증 실패 !!",
            });
        }
        next();
    });
};

//JWT가 존재하는 유저만 main 페이지로 이동
app.get('/main', verifyToken, (req, res) => {

    console.log(req.session.token);
    console.log(req.session.utmTag);
    res.sendFile(__dirname + '/public/main.html');

});

app.post('/logout', (req, res) => {
    // 세션 파기
    req.session.destroy((err) => {
        if (err) {
            // 세션 파기 실패 시
            console.error('로그아웃 처리 중 문제가 생겼습니다:', err);
            return res.status(500).json({
                message: '로그아웃 처리 중 문제가 생겼습니다.',
                error: err.message,
            });
        }
        // 세션 파기 성공 시
        console.log('로그아웃 성공');
        res.status(200).send('로그아웃되었습니다.');

        // 선택 사항: 로그인 페이지로 리디렉션
        // res.redirect('/login');
    });
});

