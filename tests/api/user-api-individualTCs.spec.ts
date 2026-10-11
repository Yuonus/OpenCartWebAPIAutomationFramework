
// 1. Import "test" and "expect" from the custom API fixture
import { test, expect } from '../../src/fixtures/apifixtures';

// 2. Store and Load the Authorization Token from the ".env.qa" file via process.env
const TOKEN = process.env.API_TOKEN;

// 3. Define/feed the Authorization header to be used across tests
let AUTH_HEADER = {
    Authorization: `Bearer ${TOKEN}`
}

// Helper: Generic Function for POST Call
async function createUser(apiHelper: any) {
    let uniqueEmail = `sabawoon_${Date.now()}@stech.com`;
    let userData = {
        "name": "Sabawoon",
        "email": uniqueEmail,
        "gender": "male",
        "status": "active"
    }
    let response = await apiHelper.post('/public/v2/users', userData, AUTH_HEADER);
    expect(response.status).toBe(201);
    return response.body;
}

// Test Case 01: Create a user test + verify --> AAA Pattern
// Solution Flow/Chaing: POST -- Fetch UserID -- GET/UserID -- Verify
test('Creating User Test', async ({ apiHelper }) => {
    // Creating user
    let userResponse = await createUser(apiHelper); // User will be created here
    let userId = userResponse.id;
    // Getting user
    let getResponse = await apiHelper.get(`/public/v2/users/${userId}`, AUTH_HEADER);
    // You can also directly extract the ID and supply it to the GET Call
    // wait apiHelper.get(`/public/v2/users/${userResponse.id}`)
    expect.soft(getResponse.status).toBe(200);
    expect.soft(getResponse.body.name).toBe('Sabawoon');
});

// Test Case 02: Update the user + verify --> AAA Pattern
// Solution Flow: POST -- Fetch UserID -- GET/UserID -- Verify (Creation) -- PUT/UserID -- GET/UserID -- Verify (Updation)

test('Updating User Test', async ({ apiHelper }) => {
    //1. Creating user
    let userResponse = await createUser(apiHelper);
    //2. Getting user (For POST Call verification)
    let getResponse = await apiHelper.get(`/public/v2/users/${userResponse.id}`, AUTH_HEADER);
    expect.soft(getResponse.status).toBe(200);
    expect.soft(getResponse.body.name).toBe('Sabawoon');
    //3. Updating user
    let userUpdatedData = {
        name: 'Sabawoon Updated',
        status: 'inactive'
    }
    let updateResponse = await apiHelper.put(`/public/v2/users/${userResponse.id}`, userUpdatedData, AUTH_HEADER);
    expect.soft(updateResponse.status).toBe(200);
    expect.soft(updateResponse.body.name).toBe(userUpdatedData.name);
    expect.soft(updateResponse.body.status).toBe(userUpdatedData.status);
    //4. Getting user (For PUT Call verification)
    getResponse = await apiHelper.get(`/public/v2/users/${userResponse.id}`, AUTH_HEADER);
    expect.soft(getResponse.status).toBe(200);
    expect.soft(getResponse.body.name).toBe(userUpdatedData.name);
    expect.soft(getResponse.body.status).toBe(userUpdatedData.status);
});

// Test Case 03: Delete the user + verify --> AAA Pattern
// Solution Flow: POST -- Fetch UserID -- GET/UserID -- Verify (Creation) -- DELETE/UserID -- GET/UserID -- Verify (Deletion)

test('Deleting User Test', async ({ apiHelper }) => {
    //1. Creating user
    let userResponse = await createUser(apiHelper);
    //2. Getting user (For POST Call verification)
    let getResponse = await apiHelper.get(`/public/v2/users/${userResponse.id}`, AUTH_HEADER);
    expect.soft(getResponse.status).toBe(200);
    expect.soft(getResponse.body.name).toBe('Sabawoon');
    //3. Deleting user
    let deleteResponse = await apiHelper.delete(`/public/v2/users/${userResponse.id}`, undefined, AUTH_HEADER);
    expect.soft(deleteResponse.status).toBe(204);
    //4. Getting user (For DELETE Call verification)
    getResponse = await apiHelper.get(`/public/v2/users/${userResponse.id}`, AUTH_HEADER);
    expect.soft(getResponse.status).toBe(404);
    expect.soft(getResponse.body.message).toBe('Resource not found');
});

// [Assignment] Include a PATCH request and verify the user has been successfully updated.
