
import { test, expect } from '../../src/fixtures/apifixtures';
import Ajv from 'ajv';

const TOKEN = process.env.API_TOKEN;

let AUTH_HEADER = {
    Authorization: `Bearer ${TOKEN}`
}

let ajv = new Ajv();

let mutliusersArraySchema = {
    "type": "array",
    "items": {
        "type": "object",
        "properties": {
            "id": {
                "type": "number"
            },
            "name": {
                "type": "string"
            },
            "email": {
                "type": "string"
            },
            "gender": {
                "type": "string"
            },
            "status": {
                "type": "string"
            }
        },
        "required": [
            "id",
            "name",
            "email",
            "gender",
            "status"
        ]
    }
}

// Writing the test cases
// Flow: Create the user -- Fetch the userID -- Fetch the response body -- validate the schema
test('Get all users -- schema Test', async ({ apiHelper }) => {
    let uniqueEmail = `sabawoon_${Date.now()}@stech.com`;
    let userData = {
        "name": "sabawoon",
        "email": uniqueEmail,
        "gender": "male",
        "status": "active"
    }
    let response = await apiHelper.post('/public/v2/users', userData, AUTH_HEADER);
    expect((response).status).toBe(201);


    let getUsersResponse = await apiHelper.get(`/public/v2/users`, AUTH_HEADER);
    expect((getUsersResponse).status).toBe(200);

    let validateResponseBody = ajv.compile(mutliusersArraySchema);
    let isSchemaValid = validateResponseBody(getUsersResponse.body);
    if (!isSchemaValid) {
        console.log('SCHEMA ERRORS: ', validateResponseBody.errors);
    }
    expect(isSchemaValid).toBeTruthy();
});


