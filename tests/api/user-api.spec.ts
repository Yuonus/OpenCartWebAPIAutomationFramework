
// 1. Import "test" and "expect" from the custom API fixture
import { test, expect } from '../../src/fixtures/apifixtures';

// 2. Store and Load the Authorization Token from the ".env.qa" file via process.env
const TOKEN = process.env.API_TOKEN;

// 3. Define/feed the Authorization header to be used across tests
let AUTH_HEADER = {
    Authorization: `Bearer ${TOKEN}`
}

// Declare userId globally to share its state across sequential test cases
let userId: number;

/*
    Test Sequence: Get all users -> POST (create) user -> GET user by ID (For Testing) -> PUT (update) user (Using the ID) -> DELETE user (Using the ID).
    We are creating 5 test cases that need to run sequentially rather than in parallel.
    To enforce this sequential order, we group the tests using a "describe" block combined with the "serial" property.
    Why use "serial"? The "describe" property groups the tests, and "serial" ensures they execute sequentially.
*/

// 4: Create the test case
test.describe.serial('Runing E2E GOREST CRUD APIs Test', () => {

    // GET Call: Fetch all users
    test('GET API - Fetching all users', async ({ apiHelper }) => { // Note: Here we will use our own custom "apiHelper" fixture not the in-built "request" fixture
        let response = await apiHelper.get('/public/v2/users', AUTH_HEADER);
        expect(response.status).toBe(200);
        expect(response.body.length).toBeGreaterThan(0);
    });

    // POST Call: Create a fresh user
    test('POST API -- Creating a new User Test', async ({ apiHelper }) => {
        let uniqueEmail = `sabawoon_${Date.now()}@stech.com`;
        let userData = {
            "name": "sabawoon",
            "email": uniqueEmail,
            "gender": "male",
            "status": "active"
        }
        let response = await apiHelper.post('/public/v2/users', userData, AUTH_HEADER);
        expect((response).status).toBe(201);
        /*
           1: Fetch the User ID dynamically to use later in PUT, DELETE, and GET calls.
           2: Store the User ID in a class-level "userId" variable and set its type to number.
           3: Why declare userId at the class level? So it can be shared and reused across all test cases that need it.
        */
        userId = response.body.id;
        console.log('Generated User ID:', userId);
    });

    // [Assignment] Create a GET request here to verify the newly created user using the dynamic userId. We did the exact same thing in the practice session.

    // PUT Call: Update the newly created user
    // To update the user, remove the dynamic email (as discussed in the practice session) and only update the username and status.
    test('PUT API -- Updating the User Test', async ({ apiHelper }) => {
        let userData = {
            "name": "Sabawoon Automation Labs",
            "status": "inactive"
        }
        let response = await apiHelper.put(`/public/v2/users/${userId}`, userData, AUTH_HEADER);
        expect.soft((response).status).toBe(200);
        expect.soft(response.body.name).toBe(userData.name);
        expect.soft(response.body.status).toBe(userData.status);
    });

    // [Assignment] Create a GET request here to verify the updated user data. We did the exact same thing in the practice session.

    // DELETE Call: Delete the newly created user
    // Delete requests do not require a body.
    test('DELETE API -- Deleting the User Test', async ({ apiHelper }) => {
        // Pass `undefined` as the second argument because a DELETE request does not require a payload body
        let response = await apiHelper.delete(`/public/v2/users/${userId}`, undefined, AUTH_HEADER);
        expect.soft((response).status).toBe(204);
    });

    // [Assignment] Create a GET request here to verify the user has been successfully deleted. We did the exact same thing in the practice session.
    // Note: You can also manually verify this by checking the same User ID in Postman.

});


