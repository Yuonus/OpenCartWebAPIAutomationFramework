import { test as baseTest } from '@playwright/test'
import { ApiHelper } from '../api/ApiHelper';

//2: Defining Types for API fixtures-- API references
type ApiFixtures = {
    apiHelper: ApiHelper
}

// 3: Extending Playwright's request with our custom fixtures
export let test = baseTest.extend<ApiFixtures>({
    apiHelper: async ({ request }, use) => {
        let apiHelper = new ApiHelper(request, process.env.API_Base_URL!);
        await use(apiHelper);
    }
})
export { expect } from '@playwright/test';