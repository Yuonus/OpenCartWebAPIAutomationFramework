// 1. Import "test" and "expect" from the custom API fixture
import { request } from 'node:http';
import { test, expect } from '../../src/fixtures/apifixtures';

// Class level variable so we can use it in later calls
let tokenID: string;

test.beforeEach('Generating the Token', async ({ request }) => {
    // You can also maintain the credentials in ".env.qa" file -- Assignment
    let credentials = {
        username: 'admin',
        password: 'password123'
    }
    // You can break the URL into two parts like we did in previous examples -- i will use the whole URL
    let authResponse = await request.post('https://restful-booker.herokuapp.com/auth', {
        headers: { 'Content-Type': 'application/json' },
        data: credentials
    });
    expect(authResponse.status()).toBe(200);
    let jsonResponse = await authResponse.json();
    console.log('Auth API Response:', jsonResponse);
    // Fetching and storing the token --> {"token": "abc123" }
    tokenID = jsonResponse.token;
    console.log('Token -->', tokenID);
});

// As per the Booker api Documentation "Creates a new auth token to use for access to the PUT and DELETE /booking"
// Only the PUT and DELETE Calls need it, so I will use it in those calls only
test('Booking API CRUD Opertaion', async ({ request }) => {
    // First: User Creation -- POST Call
    let bookingResponse = await request.post('https://restful-booker.herokuapp.com/booking', {
        headers: { 'Content-Type': 'application/json' },
        data: {
            "firstname": "Sabawoon",
            "lastname": "Yuonus",
            "totalprice": 119,
            "depositpaid": true,
            "bookingdates": {
                "checkin": "2018-01-01",
                "checkout": "2019-01-01"
            },
            "additionalneeds": "Breakfast"
        }
    });
    expect(bookingResponse.status()).toBe(200);
    // Fetching the ID
    let bookingJson = await bookingResponse.json();
    let bookingID = bookingJson.bookingid;
    console.log('Booking ID:', bookingID);

    // 2: Update the booking uising the booking ID -- here we need the token
    // Update: breakfast to lunch -- totalprice to 80
    let updatedResponse = await request.put(`https://restful-booker.herokuapp.com/booking/${bookingID}`, {
        headers: { cookie: `token=${tokenID}` },
        data: {
            "firstname": "Sabawoon",
            "lastname": "Yuonus",
            "totalprice": 80,
            "depositpaid": true,
            "bookingdates": {
                "checkin": "2018-01-01",
                "checkout": "2019-01-01"
            },
            "additionalneeds": "Lunch"
        }
    });
    expect.soft(updatedResponse.status()).toBe(200);
    // Verifying the updated info
    expect.soft((await updatedResponse.json()).totalprice).toBe(80);
    expect.soft((await updatedResponse.json()).additionalneeds).toBe('Lunch');

    // 3: Delete the booking uising the booking ID -- here we need the token
    let deletedResponse = await request.delete(`https://restful-booker.herokuapp.com/booking/${tokenID}`, {
        headers: {
            'Content-Type': 'application/json',
            cookie: `token=${tokenID}`
        }
    });
    expect.soft(deletedResponse.status()).toBe(201);

});

// Assignment: You guys do the same task using the ApiHelper