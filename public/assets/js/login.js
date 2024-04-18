const express = require('express');
const app = express();
const fs = require('fs');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));

const userFilePath = 'user.json';

app.post('/login', (req, res) => {
    const { userId, userPassword } = req.body;

    // user.json 파일에서 사용자 정보를 가져옴
    fs.readFile(userFilePath, (err, data) => {
        if (err) {
            console.error('Error reading user file:', err);
            return res.status(500).send('Internal Server Error');
        }

        const users = JSON.parse(data);

        // 사용자명과 비밀번호 비교
        const user = users.find(user => user.userId === userId);
        if (!user) {
            return res.status(401).send('Invalid userId');
        }

        // bcrypt를 사용하여 비밀번호 확인
        const passwordMatch = bcrypt.compareSync(userPassword, user.userPassword);
        if (passwordMatch) {
            return res.status(200).send('Login successful!');
            // return res.send('Login successful!');
            // return res.redirect('/public/main.html');
        } else {
            return res.status(401).send('Invalid userPassword');
        }
    });
});

module.exports = app;
