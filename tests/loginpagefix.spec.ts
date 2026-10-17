
// import process from 'node:process';
import { test, expect } from '../src/fixtures/pagefixtures'
import * as allure from "allure-js-commons";
import { CsvHelper } from '../src/utils/CsvHelper';
// import { ExcelHelper } from '../src/utils/ExcelHelper';
import { JsonHelper } from '../src/utils/JsonHelper';


test.beforeEach(async ({ loginPage }) => {
    await loginPage.goToLoginPage();
});

test('@smoke Login Page title test', async ({ loginPage }) => {
    // let pageTitle = await loginPage.getLoginPageTitle(); Removed 
    let pageTitle = await loginPage.getPageTitle(); // Calling the method from BasePage class
    console.log('Login page title:', pageTitle);
    expect(pageTitle).toBe('Account Login');
});

test('@regression Forgot password link exist test', async ({ loginPage }) => {
    // loginPage.isForgottenPwdLinkExist();
    expect(await loginPage.isForgottenPwdLinkExist()).toBeTruthy();

});

test('@regression User is able to login to the application with valid credentials test', async ({ loginPage, homePage }) => {
    await allure.suite("Login Tests");
    await allure.severity("Critical");
    await allure.feature("Authentication");
    await allure.story("Valid Login");
    await allure.description("Verify user can login with valid credentials");

    await allure.step("Login with valid creds", async () => {
        await loginPage.doLogin(process.env.USERNAME1!, process.env.PASSWORD!);
    });

    await allure.step("Verify Logout link is visible", async () => {
        expect(await homePage.isLogoutLinkExist()).toBeTruthy();
    });

    await allure.step("Verify Home page title is visible and correct", async () => {
        expect.soft(await homePage.getHomePageTitle()).toBe('My Account');
    });

    // Playwright Steps
    // await loginPage.doLogin("aseer@gmail.com", "Test123");
    // await loginPage.doLogin(process.env.USERNAME1!, process.env.PASSWORD!);
    // expect.soft(await homePage.isLogoutLinkExist()).toBeTruthy();
    // expect.soft(await homePage.getHomePageTitle()).toBe('My Account');
});


// Writing test against CSV file test data

// Data Driven approach 1: read csv data directly from the CSV file and loop the test method row wise. This test will run three times
// Because we have three set of data
let testCSVData = CsvHelper.readCsv('src/testdata/logindata.csv');
for (let row of testCSVData) {
    // test('User should not be able to login to the application using invaild credentials test', async ({ loginPage, homePage }) => {
    test(`@regression User should not be able to login to the application using invaild credentials (CSV Data) test - ${row.username} - ${row.password}`, async ({ loginPage, homePage }) => {
        // Supply the set of invalid data for negative testing
        await loginPage.doLogin(row.username, row.password);
        expect(await loginPage.isInvalidLoginErrorDisplayed()).toBeTruthy();
    });
}




/*
    test('User should not be able to login to the application using invaild credentials test', async ({ loginPage, homePage }) => {
    Error: duplicate test title "User should not be able to login to the application using invaild credentials test", first declared in loginpagefix.spec.ts:36
    You will have to make the test Unique

    I don't have any other test using that exact name in my file, so why is Playwright saying it's a duplicate?
    The error is happening because your test() block is inside a for...of loop.
    Even though you only typed the test name once in your file, Playwright reads the CSV file, loops through your 3 rows of data, and attempts to create 3 separate tests. 
    Because the test name is a static string, Playwright tries to register 3 tests with the exact same name, which triggers the duplicate test title error.
    To fix this, you need to make the test title dynamic so that each iteration of the loop gets a unique name. 
        The Fix
             Change your single quotes (') to backticks (`) and append data from your CSV row into the title.
    
    Why this works:
        If your CSV has three usernames (user1@test.com, user2@test.com, user3@test.com), Playwright will now register three distinct tests:
        User should not be able to login... test - user1@test.com
        User should not be able to login... test - user2@test.com
        User should not be able to login... test - user3@test.com
*/


// Data Driven approach 2: read xlsx data directly from the excel file and loop the test method row wise. This test will run three times because we have three set of data
// let testExcelData = ExcelHelper.readExcel('src/testdata/opencarttestdata.xlsx', 'login');
// for (let row of testExcelData) {
//     // test('User should not be able to login to the application using invaild credentials (Excel Data) test', async ({ loginPage, homePage }) => {
//     // Error: duplicate test title "User should not be able to login to the application using invaild credentials (Excel Data) test", first declared in loginpagefix.spec.ts
//     test(`User should not be able to login to the application using invaild credentials (Excel Data) test - ${row.username} - ${row.password}`, async ({ loginPage, homePage }) => {
//         // Supply the set of invalid data for negative testing
//         await loginPage.doLogin(row.username, row.password);
//         expect(await loginPage.isInvalidLoginErrorDisplayed()).toBeTruthy();
//     });
// }

// Data Driven approach 3: read json data directly from the json file and loop the test method row wise. This test will run three times because we have three set of data
let testJsonData = JsonHelper.readJson('src/testdata/logindata.json');
for (let row of testJsonData) {
    test(`@regression User should not be able to login to the application using invaild credentials (Json Data) test - ${row.username} - ${row.password}`, async ({ loginPage, homePage }) => {
        await loginPage.doLogin(row.username, row.password);
        expect(await loginPage.isInvalidLoginErrorDisplayed()).toBeTruthy();
    });
}


// Common Features Testing
// The common features for login page: footers, logo, searchbox
test('@smoke Application Logo exists on the Login Page', async ({ basePage }) => {
    expect(await basePage.isLogoVisible()).toBeTruthy();
});
// To see with loginPage destructure
// test('Application Logo exists on the Login Page', async ({ loginPage }) => {
//     expect(await loginPage.isLogoVisible()).toBeTruthy();
// });

test('@smoke Application Search Box exists on the Login Page', async ({ basePage }) => {
    expect(await basePage.isSearchBoxVisible()).toBeTruthy();
});

test('@smoke Application Cart button exists on the Login Page', async ({ basePage }) => {
    expect(await basePage.isCartButtonVisible()).toBeTruthy();
});

test('@smoke Application Footers exists on the Login Page', async ({ basePage }) => {
    expect(await basePage.getPageFootersCount()).toBe(16);
});
