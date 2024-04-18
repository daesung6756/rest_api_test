require('dotenv').config()
const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const app = express();
const PORT = 3000;
const cors = require('cors');

const ACCOUNT_ID = process.env.ACCOUNT_ID;
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const SUB_DOMAIN = process.env.SUB_DOMAIN;
const DATA_EXTENSION_EXTERNAL_KEY = process.env.DATA_EXTENSION_EXTERNAL_KEY
const authUrl = `https://${SUB_DOMAIN}.auth.marketingcloudapis.com/v2/token`;

app.use(cors());
// 정적 파일을 제공할 폴더 설정
app.use(express.static('public'));

// Body parser middleware to handle post requests
app.use(bodyParser.json());

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


const endpoint = `https://${SUB_DOMAIN}.rest.marketingcloudapis.com/hub/v1/dataeventsasync/key:${DATA_EXTENSION_EXTERNAL_KEY}/rowset`;

app.post('/test', async (req, res) => {

    try {
        const accessToken = await getAccessToken(); // 액세스 토큰을 얻을 때까지 기다립니다.
        const users = req.body;
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
        }
    } catch (error) {
        console.error('실패', error);
        res.status(500).json({ message: '실패입니다.', error: error.message });
    }
});


