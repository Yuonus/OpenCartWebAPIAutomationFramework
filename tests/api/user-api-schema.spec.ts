
// 1. Import "test" and "expect" from the custom API fixture and Ajv module from ajv library
import { test, expect } from '../../src/fixtures/apifixtures';
import Ajv from 'ajv';

// 2. Store and Load the Authorization Token from the ".env.qa" file via process.env
const TOKEN = process.env.API_TOKEN;

// 3. Define/feed the Authorization header to be used across tests
let AUTH_HEADER = {
    Authorization: `Bearer ${TOKEN}`
}

// 4. Setting up the AJV Library
let ajv = new Ajv();

// 5. Defining the JSON schema
let userSchema = {
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
        "status",
        // "S_Tech"
    ]
}

// Defining all users schema
let userArraySchema = {
    "type": "array",
    "items": userSchema
}

// 6. Writing the test cases
// Flow: Create the user -- Fetch the userID -- Fetch the response body -- validate the schema
test('@smoke Get a user -- schema Test', async ({ apiHelper }) => {
    let uniqueEmail = `sabawoon_${Date.now()}@stech.com`;
    let userData = {
        "name": "sabawoon",
        "email": uniqueEmail,
        "gender": "male",
        "status": "active"
    }
    let response = await apiHelper.post('/public/v2/users', userData, AUTH_HEADER);
    expect((response).status).toBe(201);
    let userId = response.body.id;
    console.log('Generated User ID:', userId);

    // Get user
    let getUserResponse = await apiHelper.get(`/public/v2/users/${userId}`, AUTH_HEADER);
    expect((getUserResponse).status).toBe(200);

    // Verifying response schema
    let validateResponseBody = ajv.compile(userSchema);
    /*
        validateResponseBody: this will now behave like a method for me and we will supply the response body we fetched from the GET Call to this method
        validateResponseBody(getUserResponse.body): and this method will return a boolean (When hovered the mouse over it you will not see boolean)
    */
    let isSchemaValid = validateResponseBody(getUserResponse.body);
    if (!isSchemaValid) {
        console.log('SCHEMA ERRORS: ', validateResponseBody.errors);
    }
    expect(isSchemaValid).toBeTruthy();
});

// All users schema test
test('@smoke Get all users -- schema Test', async ({ apiHelper }) => {
    let getUsersResponse = await apiHelper.get(`/public/v2/users`, AUTH_HEADER);
    expect((getUsersResponse).status).toBe(200);
    let validateResponseBody = ajv.compile(userArraySchema);

    let isSchemaValid = validateResponseBody(getUsersResponse.body);
    if (!isSchemaValid) {
        console.log('SCHEMA ERRORS: ', validateResponseBody.errors);
    }
    expect(isSchemaValid).toBeTruthy();
});


/*
            Negative Testing Scenarios
    Some Explanations
    if (!isSchemaValid) {console.log('SCHEMA ERRORS: ', validateResponseBody.errors);}
    In that line of the code, we are deliberately adding the negation "!"
       to make the condition incorrect.
       It means:
       - If the schema is invalid, then print the errors.
       - If the schema is valid, then the test passes.

       Edge Cases to consider
        1: Make the "id" data type a string in "userSchema" required array and run the test again.
            It should print the schema errors.
        2: Make the "id" type back to number, and this time remove "status"
            from the required fields. Then run the test again.
            Note: This time the test will NOT fail. Why?

            a: Because you send a GET request. The API behaves normally and
                sends back the full user profile:
                {
                    "id": 123,
                    "name": "sabawoon",
                    "email": "sabawoon@stech.com",
                    "gender": "male",
                    "status": "active"
                }
            b: AJV checks your list:
                AJV looks at the response and then looks at the schema you wrote.
                If you removed "email" from the "required" array, your checklist
                only says:
                "Check if id, name, gender, and status exist."
            c: AJV passes the test:
                AJV checks:
                - id      -> Yes
                - name    -> Yes
                - gender  -> Yes
                - status  -> Yes
                Because you removed "email" from the required list, AJV simply
                ignores the fact that the email is sitting right there in the
                response.

                It basically says:
                "Well, email isn't on my required checklist, so I don't care
                about it. Test Passed!"
                (Because the email is still present in the response, that is why the test is not failing.)
      
            The Takeaway:
            Just because a field is "required" by the API's database does not mean
            AJV automatically knows that.

            How can I make the test fail by manipulating the required field?
            To make the required check fail, you have to create a situation where
            your schema demands a field, but the API response does NOT contain it.

            Simply add one extra field to the "required" array.
            For example, add: "S_Tech"

            The POST call and the GET response will not have this extra field.
            Now the test will fail because AJV will be expecting the extra field
            "S_Tech", but it is not present in the response.

            Here is how the test will fail:
                SCHEMA ERRORS: [
                    {
                        instancePath: '',
                        schemaPath: '#/required',
                        keyword: 'required',
                        params: {
                            missingProperty: 'S_Tech'
                        },
                        message: "must have required property 'S_Tech'"
                    }
                ]
*/


