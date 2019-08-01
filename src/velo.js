const request = require('request');
const moment = require('moment-timezone');

// this just runs in background and refreshes oauth2 access token for the client
class Velo {
    constructor(){
        console.log("calling velo oauth client cred grant to get access token");
        this.refreshBefore = 300; // 5 mins
        this.requestAccessToken();
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
        console.log("check if access token is going to expire soon ... if so ... grab new one");
        if(moment().unix() >= this.getAccessTokenExpiration()) {
            this.requestAccessToken()
        }
    }
    setAccessTokenAndExpiration(t, ttl) {
        // use redis if multiple instances
        process.env.VELO_API_ACCESSTOKEN = t;
        process.env.VELO_API_ACCESSTOKENEXPIRATION = ((moment().unix() + ttl) - this.refreshBefore);
    }
    getAccessToken() {
        return process.env.VELO_API_ACCESSTOKEN;
    }
    getAccessTokenExpiration() {
        return parseInt(process.env.VELO_API_ACCESSTOKENEXPIRATION,10);
    }
  }
  
  module.exports = new Velo();

  // '{"error":"invalid_token","error_description":"2a54cfa7-663d-4f21-9f08-f63dc3345322"}',