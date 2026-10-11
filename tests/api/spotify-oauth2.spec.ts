// 1. Import "test" and "expect" from the Playwright Test
import { test, expect } from '@playwright/test'

let OAUTH_CONFIG = {
    tokenURL: 'https://accounts.spotify.com/api/token',
    clientId: process.env.OAUTH_CLIENT_ID!,
    clientSecret: process.env.OAUTH_CLIENT_SECRET!,
    grantType: process.env.GRANT_TYPE!
}

// Class level variable -- that can be used in the upcoming calls
let accessToken: string;

test.beforeEach('POST -- Generate the Access Token', async ({ request }) => {
    let response = await request.post(OAUTH_CONFIG.tokenURL, {
        // Since we are using x-www-form-urlencoded not JSON, we will use the form object
        form: {
            grant_type: OAUTH_CONFIG.grantType,
            client_id: OAUTH_CONFIG.clientId,
            client_secret: OAUTH_CONFIG.clientSecret
        }
    })

    expect(response.status()).toBe(200);
    //take the API response body and convert it from JSON into a JavaScript/TypeScript object."
    let jsonResponse = await response.json();
    // Fetching the Access_Token from the response
    console.log('Token API Response:', jsonResponse);
    accessToken = jsonResponse.access_token;
    // ====== I added: Verify that an access token was returned
    expect(jsonResponse.access_token).toBeTruthy();
    // ====== I added: Verify token type
    expect(jsonResponse.token_type).toBe('Bearer');
    // ====== I added: Verify token expiration exists and is greater than 0
    expect(jsonResponse.expires_in).toBeGreaterThan(0);
    // Printing access_token is not a good practice - I am just doing it here to demo it to you guys for learning purpose
    console.log('Access Token:', accessToken);
});


test('GET albums data Test', async ({ request }) => {
    // https://api.spotify.com/v1/albums/4aawyAB9vmqN3uQ7FjRGTy
    // You can also keep both baseURL and endPointURL at ".env.qa" as we did with GOREST API.
    // Just doing it here for your better visibility

    let baseURL = 'https://api.spotify.com';
    let endPointURL = '/v1/albums/4aawyAB9vmqN3uQ7FjRGTy';

    let albumResponse = await request.get(`${baseURL}${endPointURL}`, {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    });

    expect(albumResponse.status()).toBe(200);
    let jsonBody = await albumResponse.json();
    console.log(jsonBody);
    // Print the followings: album_type, total_tracks, external_urls, images number
    console.log('album_type is: ', jsonBody.album_type);
    console.log('total_tracks are: ', jsonBody.total_tracks);
    console.log('Total external_urls are: ', jsonBody.external_urls.spotify);
    console.log('Total number of images used in spotify album: ', jsonBody.images.length);
    expect(jsonBody.images.length).toBe(3);

    // ====== I added: Verify album_type exists
    expect(jsonBody.album_type).toBeTruthy();
    // ====== I added: Verify total_tracks is greater than 0
    expect(jsonBody.total_tracks).toBeGreaterThan(0);
    // ====== I added: Verify Spotify external URL exists
    expect(jsonBody.external_urls.spotify).toBeTruthy();
    // ====== I added: Verify album ID
    expect(jsonBody.id).toBe('4aawyAB9vmqN3uQ7FjRGTy');
    // ====== I added: Verify at least one artist exists
    expect(jsonBody.artists.length).toBeGreaterThan(0);
});

/*
    Benefits of creating a fresh access_token for every test:

    1: With this approach, you will have a fresh and unexpired access_token for each test.
    2: You will have less flaky and brittle tests.

    Some people:
    >> They will generate the access_token and store it in the .env.qa file,
       and then feed it to their API request.

       The cons of this approach are:
       The token might expire in one or two days, and as a result, you will have flaky and brittle tests.

    >> Another headache with this approach is that they have to keep
       creating a new access_token and keep updating the .env.qa file manually after the token expiration.
*/

