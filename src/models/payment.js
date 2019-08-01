const validate = require("validate.js");
const db = require("../db");

class Payment {
    constructor(i){
        this.fields = [
            "name", 
            "velo_payout_id", 
            "velo_status"
        ];
        this.constraints = {
            name: {
                presence: true,
                exclusion: {
                within: ["nicklas"],
                message: "'%{value}' is not allowed"
                }
            }
        };
        this.instance = {};
        // populate instance
    }
    validateCreate() {
        return validate(this.instance, this.constraints);
    }
    convertToVelo(data) {
        
    }
}

module.exports = Payment;