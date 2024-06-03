const express = require('express');
const router = express.Router();
const axios = require('axios')
require('dotenv').config()
const url = process.env.BASE_URL

class User {
    constructor(token) {
        this.token = token
    }
    async profile () {
        try {
            const response = await axios.get(`${url}user/2/info?serverId=0`, {
                headers: {
                    'authorization': `Bearer ${this.token}`,
                }
            });
            if (response.data.status == 200) {
                return response.data.data.characterNames
            }
        } catch (error) {
            console.log(error.response)
        }
    }

    async redeem (uid, code) {
        try {
            const response = await axios.post(
                `${url}package/apply`,
                {
                    'itemCode': code,
                    'characterId': uid,
                    'serverId': 10002
                },
                {
                    headers: {
                        'authorization': `Bearer ${this.token}`,
                    }
                }
            );
            if (response.data.status == 200) {
                console.log(response.data.message)
            } else {
                console.log(response.data.message)
            }
        } catch (error) {
            console.log(error.response.data)
        }
    }

    async daily (uid, packageId) {
        try {
            const response = await axios.post(
                `${url}package/2/purchase/${packageId}`,
                {
                    'walletToken': 'token',
                    'characterId': uid,
                    'serverId': 10002
                },
                {
                    headers: {
                        'accept-language': 'en-US,en;q=0.9',
                        'authorization': `Bearer ${this.token}`,
                        'origin': 'https://www.eonhub.net',
                        'priority': 'u=1, i',
                        'referer': 'https://www.eonhub.net/',
                        'sec-ch-ua': '"Microsoft Edge";v="125", "Chromium";v="125", "Not.A/Brand";v="24"',
                        'sec-ch-ua-mobile': '?0',
                        'sec-ch-ua-platform': '"Windows"',
                        'sec-fetch-dest': 'empty',
                        'sec-fetch-mode': 'cors',
                        'sec-fetch-site': 'cross-site',
                        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36 Edg/125.0.0.0'
                    }
                }
            );
            if (response.data.status == 200) {
                console.log('Redeem Success!')
            }
        } catch (error) {
            console.log(error.response.data.message)
        }
    }

    async getPackgeId () {
        try {
            const RESPONESE_BIG_BRO_PREMIUM_DAILY_REWARD = await axios.get(`${url}package/2?packageType=BIG_BRO_PREMIUM_DAILY_REWARD`, {
                headers: {
                    'Authorization': `Bearer ${this.token}`
                }
            });
            const RESPONESE_BIG_BRO_DAILY_REWARD = await axios.get(`${url}package/2?packageType=BIG_BRO_DAILY_REWARD`, {
                headers: {
                    'Authorization': `Bearer ${this.token}`
                }
            });
            const RESPONESE_PREMIUM_DAILY_REWARD = await axios.get(`${url}package/2?packageType=PREMIUM_DAILY_REWARD`, {
                headers: {
                    'Authorization': `Bearer ${this.token}`
                }
            });
            const RESPONESE_DAILY_REWARD = await axios.get(`${url}package/2?packageType=DAILY_REWARD`, {
                headers: {
                    'Authorization': `Bearer ${this.token}`
                }
            });

            let packgeId = []
            if (RESPONESE_BIG_BRO_PREMIUM_DAILY_REWARD.data.status == 200) {
                for (let i = 0; i < RESPONESE_BIG_BRO_PREMIUM_DAILY_REWARD.data.data.length; i++) {
                    const resId = RESPONESE_BIG_BRO_PREMIUM_DAILY_REWARD.data.data[i].packageId
                    packgeId.push(resId)
                }
            }
            if (RESPONESE_BIG_BRO_DAILY_REWARD.data.status == 200) {
                for (let i = 0; i < RESPONESE_BIG_BRO_DAILY_REWARD.data.data.length; i++) {
                    const resId = RESPONESE_BIG_BRO_DAILY_REWARD.data.data[i].packageId
                    packgeId.push(resId)
                }
            }
            if (RESPONESE_PREMIUM_DAILY_REWARD.data.status == 200) {
                for (let i = 0; i < RESPONESE_PREMIUM_DAILY_REWARD.data.data.length; i++) {
                    const resId = RESPONESE_PREMIUM_DAILY_REWARD.data.data[i].packageId
                    packgeId.push(resId)
                }
            }
            if (RESPONESE_DAILY_REWARD.data.status == 200) {
                for (let i = 0; i < RESPONESE_DAILY_REWARD.data.data.length; i++) {
                    const resId = RESPONESE_DAILY_REWARD.data.data[i].packageId
                    packgeId.push(resId)
                }
            }
            if (packgeId) {
                return packgeId
            }
        } catch (error) {
            console.log(error.response)
        }
    }
}

let profile = new User()

router.post('/token', async (req, res) => {
    try {
        if (req.body) {
            profile.token = req.body.data
        }
    } catch (error) {
        console.log(error)
    }
})

router.get('/', async (req, res) => {
    try {
        res.send('API OK')
    } catch (error) {
        console.log(error)
    }
});

router.get('/getProfile', async (req, res) => {
    try {
        const profiles = await profile.profile()
        if (profiles) {
            res.json(profiles)
        }
    } catch (error) {
        console.log(error)
    }
});

router.post('/reward', async (req, res) => {
    try {
        const uid = req.body.uid
        const packageId = await profile.getPackgeId()
        for (package of packageId) {
            await profile.daily(uid, package)
        }
        res.send({
            code: 0,
            msg: 'รับรางวัลสำเร็จ!'
        })
    } catch (error) {
        console.log(error)
    }
})

router.post('/redeem', async (req, res) => {
    try {
        const code = req.body.code
        const uid = req.body.uid
        if (code) {
            for (c of code) {
                await profile.redeem(uid, c)
            }
        }
        res.send({
            code: 0,
            msg: 'รับรางวัลสำเร็จ!'
        })
    } catch (error) {
        console.log(error)
    }
})



module.exports = router
