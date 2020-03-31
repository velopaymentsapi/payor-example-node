const request = require('request');
const moment = require('moment-timezone');
const redis = require("redis");
const bluebird = require("bluebird");
bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

// this just runs in background and refreshes oauth2 access token for the client
class Velo {
    constructor(){
        this.refreshBefore = 300; // 5 mins
        if (process.env.SYNC_SIDECAR === "false") {
            console.log('sync sidecar disabled ... oauth managed locally');
            console.log("calling velo oauth client cred grant to get access token");
            this.requestAccessToken();
        } else {
            console.log('sync sidecar enabled ... oauth not managed locally');
        }
    }
    requestAccessToken(){
        console.log("updating velo access token (use redis if multiple instances)");
        const options = {
            url: process.env.VELO_BASE_URL+'/v1/authenticate?grant_type=client_credentials', 
            headers: {
                'Authorization': 'Basic '+Buffer.from(process.env.VELO_API_APIKEY+":"+process.env.VELO_API_APISECRET).toString('base64'),
                'Content-Type': 'application/json'
            }
        };
        request.post(options, (err, httpResponse, body) => {
            if (err) {
                return console.error('Velo OAuth Grant failed:', err);
            }
            const info = JSON.parse(body);
            console.log('Velo OAuth Grant successful!'); //  Server responded with:', info.access_token, info.expires_in);

            this.setAccessTokenAndExpiration(info.access_token, info.expires_in);
        });
    }
    checkAccessTokenExpiration(){
        if (process.env.SYNC_SIDECAR === "false") {
            console.log("check if access token is going to expire soon ... if so ... grab new one");
            if(moment().unix() >= this.getAccessTokenExpiration()) {
                this.requestAccessToken()
            }
        }
    }
    setAccessTokenAndExpiration(t, ttl) {
        // use redis if multiple instances
        process.env.VELO_API_ACCESSTOKEN = t;
        process.env.VELO_API_ACCESSTOKENEXPIRATION = ((moment().unix() + ttl) - this.refreshBefore);
    }
    async getAccessToken() {
        if (process.env.SYNC_SIDECAR === "false") {
            return process.env.VELO_API_ACCESSTOKEN;
        } else {
            let client = redis.createClient("redis://redis:6379", {detect_buffers: true});
            return await client.getAsync('VELO_API_ACCESSTOKEN');
        }
    }
    getAccessTokenExpiration() {
        return parseInt(process.env.VELO_API_ACCESSTOKENEXPIRATION,10);
    }
}
  
module.exports = new Velo();
