
import { APIRequestContext } from "@playwright/test";

export class ApiHelper {

    private readonly request: APIRequestContext;
    private readonly baseURL: string;

    // 2: Constrcutor 
    constructor(request: APIRequestContext, baseURL: string) {
        this.request = request;
        this.baseURL = baseURL;
    }

    // Helper Methods
    // 1: GET Call
    async get(endPoint: string, headers?: Record<string, string>) {
        let response = await this.request.get(`${this.baseURL}${endPoint}`, {
            headers: headers // headers: headers (First headers is coming from Playwright and the second headers should be supplied by us)
        });
        // To print the body and status code (Recommendation: Do not print it, it will clutter the logs)
        console.log('[GET CALL]');
        console.log(await response.json(), response.status());
        return {
            status: response.status(),
            body: await response.json()
        }
    }

    // 2: POST Call
    async post(endPoint: string, data: object, headers: Record<string, string>) {
        let response = await this.request.post(`${this.baseURL}${endPoint}`, {
            headers: headers,
            data: data
        });
        console.log('[POST CALL]');
        console.log(await response.json(), response.status());
        return {
            status: response.status(),
            body: await response.json()
        }
    }

    // 3: PUT Call
    async put(endPoint: string, data: object, headers: Record<string, string>) {
        let response = await this.request.put(`${this.baseURL}${endPoint}`, {
            headers: headers,
            data: data
        });
        console.log('[PUT CALL]');
        console.log(await response.json(), response.status());
        return {
            status: response.status(),
            body: await response.json()
        }
    }

    // 4: DELETE Call
    async delete(endPoint: string, data?: object, headers?: Record<string, string>) {
        let response = await this.request.delete(`${this.baseURL}${endPoint}`, {
            headers: headers,
            data: data
        });
        console.log('[DELETE CALL]');
        console.log(response.status());
        return {
            status: response.status(),
        }
    }

    /*
        Make data optional (data?: object): Many DELETE endpoints do not expect a request body. If data is required, you will be forced to pass undefined or an empty object for standard deletions.
        Why did you make the headers optional?
        Because headers is a required parameter and --> A required parameter cannot follow an optional parameter.
        Important Note: When calling the delete method without a body payload, always pass undefined as the second parameter. Because JavaScript maps arguments by position, skipping it will push your headers into the data argument, leading to a 404 error.
        Expected: 204
            Received: 404

            67 |     test('DELETE API -- Deleting the User Test', async ({ apiHelper }) => {
            68 |         let response = await apiHelper.delete(`/public/v2/users/${userId}`, AUTH_HEADER);
            69 |         expect.soft((response).status).toBe(204);
               |                                        ^
            70 |     });
    */



}

