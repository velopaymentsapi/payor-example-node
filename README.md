# Velo Payor Example - Node.js

This is a simplified example of an API for a payor that integrates with Velo Payments. This example uses the [express](http://expressjs.com/) framework. It also uses the Velo Javascript client: [velo-node](https://github.com/velopaymentsapi/velo-node)

### Usage

Copy the `.env.example` file and create new file `src/.env` with its contents.

You will need to replace the following variables with the information you recieved from Velo.

```
VELO_API_APIKEY=contact_velo_for_info
VELO_API_APISECRET=contact_velo_for_info
VELO_API_PAYORID=contact_velo_for_info
```

First time spinning up the api ... we will need to create the network 

```
make network
```

To spin up the api & database ... 
```
make up
```

To test the example api import the following Postman collection & environment files via

[![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/86c785f2ee6edbfc1751#?env%5BVelo%20Payor%20Example%20Dev%5D=W3sia2V5IjoiYXBpX3VybCIsInZhbHVlIjoiaHR0cDovL2xvY2FsaG9zdDo0NTY3IiwiZGVzY3JpcHRpb24iOiIiLCJlbmFibGVkIjp0cnVlfSx7ImtleSI6Imp3dF90b2tlbiIsInZhbHVlIjoiIiwiZGVzY3JpcHRpb24iOiIiLCJlbmFibGVkIjp0cnVlfSx7ImtleSI6InBheWVlX2lkIiwidmFsdWUiOiIiLCJkZXNjcmlwdGlvbiI6IiIsImVuYWJsZWQiOnRydWV9LHsia2V5IjoicGF5bWVudF9pZCIsInZhbHVlIjoiIiwiZGVzY3JpcHRpb24iOiIiLCJlbmFibGVkIjp0cnVlfSx7ImtleSI6InNvdXJjZV9hY2NvdW50X2lkIiwidmFsdWUiOiIiLCJkZXNjcmlwdGlvbiI6IiIsImVuYWJsZWQiOnRydWV9LHsia2V5Ijoic291cmNlX2FjY291bnRfbmFtZSIsInZhbHVlIjoiIiwiZGVzY3JpcHRpb24iOiIiLCJ0eXBlIjoidGV4dCIsImVuYWJsZWQiOnRydWV9XQ==)

Make sure to edit the environment file variables with any need values.

All calls are dependant on calling Public > Authenticate ... in order to get a JWT. This needs to occur once for an auth token to the express api.