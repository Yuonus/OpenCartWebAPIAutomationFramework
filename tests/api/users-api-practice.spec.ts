
import { test, expect, APIResponse } from '@playwright/test'

// as we need the auth token in almost all the tests. we will create one object for it
let AUTH_TOKEN = {
    Authorization: 'Bearer 95153343132a8e6e24d4f7e7c26ec8fc29fb3c9a63a1b558611b210081e97b0c'
}

test('Get All Users API Test', async ({ request }) => {
    request.get('https://gorest.co.in/public/v2/users');
});

// If you want to add any extra information you can add one extra paremeter 
test('Get All Users API Test1', async ({ request }) => {
    let response: APIResponse = await request.get('https://gorest.co.in/public/v2/users', {
        headers: AUTH_TOKEN
    });
    // console.log(response); // Displays response metadata such as status, headers, and other response information, but not the actual response body.
    // Convert the response body to JSON to access and display the actual user data.
    let jsonBody = await response.json();
    console.log(jsonBody);
    console.log(response.status()); // Displays the HTTP status code, for example: 200
    console.log(response.statusText()); // Displays the HTTP status message, for example: OK
    // Verify that the API request was successful
    expect(response.status()).toBe(200);
});

// Creating User
test('Creating a User POST API Test', async ({ request }) => {
    // User JavaScript Object
    let uniqueEmail = `sabawoon_${Date.now()}@stech.com`;
    // You can also use: Math.random();
    // const uniqueEmail = `sabawoon_${Math.random().toString(36).substring(2, 8)}@stech.com`;
    let userData = {
        "name": "sabawoon",
        "email": uniqueEmail,
        "gender": "male",
        "status": "active"
    }
    let response: APIResponse = await request.post('https://gorest.co.in/public/v2/users', {
        headers: AUTH_TOKEN,
        data: userData
    });
    // console.log(response); // Displays response metadata such as status, headers, and other response information, but not the actual response body.
    // Convert the response body to JSON to access and display the actual user data.
    let jsonBody = await response.json();
    console.log(jsonBody);
    console.log(response.status()); // Displays the HTTP status code, for example: 201
    console.log(response.statusText()); // Displays the HTTP status message, for example: Created
    // Verify that the API request was successful
    expect.soft(response.status()).toBe(201);
    expect.soft(response.statusText()).toBe('Created');
});

// userData is a JavaScript object. Normally, we would convert it to JSON (Serialization) using JSON.stringify() before sending it in an API request.
// However, Playwright automatically handles the serialization when we pass the object through the data property.
// JavaScript Object → JSON (Serialization)


test('Updating a User PUT API Test', async ({ request }) => {
    let userData = {
        name: 'Hiwad Yuonus',
        email: 'Hiwad@stech.com',
        gender: 'male',
        status: 'inactive'
    }
    let response: APIResponse = await request.put('https://gorest.co.in/public/v2/users/8632598', {
        headers: AUTH_TOKEN,
        data: userData
    });
    let jsonBody = await response.json();
    console.log(jsonBody);
    console.log(response.status());
    console.log(response.statusText());
    expect.soft(response.status()).toBe(200);
    expect.soft(response.statusText()).toBe('OK');
});

test('Updating a User Partial Information PATCH API Test', async ({ request }) => {
    let userData = {
        name: 'Hiwad Yuonus Tech Giant',
        email: 'Hiwad@stech.com',
        gender: 'male',
        status: 'active'
    }
    let response: APIResponse = await request.put('https://gorest.co.in/public/v2/users/8632598', {
        headers: AUTH_TOKEN,
        data: userData
    });
    let jsonBody = await response.json();
    console.log(jsonBody);
    console.log(response.status());
    console.log(response.statusText());
    expect.soft(response.status()).toBe(200);
    expect.soft(response.statusText()).toBe('OK');
});


test('Deleting a User DELETE API Test', async ({ request }) => {
    // We dont need the body object for DELETE API Call
    let response: APIResponse = await request.delete('https://gorest.co.in/public/v2/users/8633207', {
        headers: AUTH_TOKEN,
    });
    console.log(response.status());
    console.log(response.statusText());
    expect.soft(response.status()).toBe(204);
    expect.soft(response.statusText()).toBe('No Content');
});


