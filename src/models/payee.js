const validate = require("validate.js");
const db = require("../db");
const uuidv4 = require('uuid/v4');
const VeloPayments = require('velo-payments');

class Payee {
    constructor(i){
        this.fields = [
            "email", 
            "first_name", 
            "last_name", 
            "address1", 
            "address2", 
            "city", 
            "state", 
            "postal_code", 
            "country_code", 
            "phone_number", 
            "date_of_birth", 
            "national_id", 
            "bank_name", 
            "routing_number", 
            "account_number", 
            "iban", 
            "velo_id", 
            "velo_invite_status"
        ];
        this.create_constraints = {
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
        this.fields.forEach(function(item, index, array) {
            if (i !== undefined && item in i) {
                this.instance[item] = i[item];
            } else {
                this.instance[item] = null;
            }
        }.bind(this));
    }
    validateCreate() {
        return validate(this.instance, this.create_constraints);
    }
    convertToVelo(data) {
        let address = new VeloPayments.Address();
        address.line1 = this.instance.address1;
        address.city = this.instance.city;
        address.country = this.instance.country_code;
        address.zipOrPostcode = this.instance.postal_code;
        
        let paymentChannel = new VeloPayments.CreatePaymentChannel();
        paymentChannel.countryCode = this.instance.country_code;
        paymentChannel.currency = "USD";
        paymentChannel.accountName = this.instance.bank_name;
        paymentChannel.routingNumber = this.instance.routing_number;
        paymentChannel.accountNumber = data.account_number;
        
        let challenge = new VeloPayments.Challenge();
        challenge.description = "first nine numbers";
        challenge.value = "123456789";

        let individual = new VeloPayments.Individual();
        individual.nationalIdentification = data.national_id;
        individual.dateOfBirth = data.date_of_birth;
        let individual_name = new VeloPayments.IndividualName();
        individual_name.firstName = this.instance.first_name;
        individual_name.lastName = this.instance.last_name;
        individual.name = individual_name;

        let payee = new VeloPayments.CreatePayee();
        payee.remoteId = this.instance.id;
        payee.email = this.instance.email;
        payee.country = this.instance.country_code;
        payee.displayName = this.instance.first_name + " " + this.instance.last_name;
        payee.paymentChannel = paymentChannel;
        payee.challenge = challenge;
        payee.language = "EN";
        payee.cellphoneNumber = this.instance.phone_number;
        payee.type = "Individual";
        payee.individual = individual;
        payee.address = address;

        return payee;
    }
    create() {
        this.instance.id = uuidv4();
        db.none('insert into payees(id, email, first_name, last_name, address1, address2, city, state, postal_code, country_code, phone_number, date_of_birth, national_id, bank_name, routing_number, account_number, iban, velo_id, velo_creation_id, velo_invite_status, is_active)' +
            'values(${id}, ${email}, ${first_name}, ${last_name}, ${address1}, ${address2}, ${city}, ${state}, ${postal_code}, ${country_code}, ${phone_number}, ${date_of_birth}, ${national_id}, ${bank_name}, ${routing_number}, ${account_number}, ${iban}, ${velo_id}, ${velo_creation_id}, ${velo_invite_status}, ${is_active})',
            this.instance)
        .then(function () {
            res.status(200)
                .json({
                status: 'success',
                message: 'Inserted'
                });
        })
        .catch(function (err) {
            return next(err);
        });
    }
    list(page, size) {
        let limit = (size === undefined) ? 50 : size ;
        let offset = (page === 1) ? 0 : ((page-1) * limit);
        return db.any('SELECT * FROM payees ORDER BY created_at LIMIT $1 OFFSET $2', [limit, offset])
            .then(data => {
                // console.log('DATA:', data); // print data;
                return data;
            })
            .catch(error => {
                console.log('ERROR:', error); // print the error;
            });
    }
}

module.exports = Payee;