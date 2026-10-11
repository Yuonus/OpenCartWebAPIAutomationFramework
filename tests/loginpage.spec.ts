
// import { test, expect } from '@playwright/test'
// import { LoginPage } from '../src/pages/LoginPage'

// let loginPage: LoginPage;

// test('Login Page title test', async ({ page }) => {
//     // To access the methods of the LoginPage.ts file/class we should create its object
//     loginPage = new LoginPage(page);
//     await loginPage.goToLoginPage();
//     let pageTitle = await loginPage.getLoginPageTitle();
//     console.log('Login page titile:', pageTitle);
//     expect(pageTitle).toBe('Account Login');
// });

// test('Forgot password link exist test', async ({ page }) => {
//     // To access the methods of the LoginPage.ts file/class we should create its object
//     loginPage = new LoginPage(page);
//     await loginPage.goToLoginPage();
//     // loginPage.isForgottenPwdLinkExist();
//     expect(await loginPage.isForgottenPwdLinkExist()).toBeTruthy();

// });

// test('User is able to login to the application test', async ({ page }) => {
//     // To access the methods of the LoginPage.ts file/class we should create its object
//     loginPage = new LoginPage(page);
//     await loginPage.goToLoginPage();
//     await loginPage.doLogin("aseer@gmail.com", "Test123");

// });

/*
    Considering the above tests:

    >> Looking at the above test cases, each test case has the following two
       repetitive steps:
        loginPage = new LoginPage(page);
        await loginPage.goToLoginPage();
    >> To prevent these repetitive steps, we will use the concept of hooks.
    >> We will use the beforeEach() hook to execute these steps before
       every test case.
*/


import { test, expect } from '@playwright/test'
import { LoginPage } from '../src/pages/LoginPage'
import { HomePage } from '../src/pages/HomePage'

let loginPage: LoginPage;
let homePage: HomePage;

test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goToLoginPage();
    homePage = new HomePage(page);
});

/* Note: Inside the hooks we can use the in-built "{page}" fixture */
/* Note: Now we dont need to have the page destructuring inside individual tests */

test.skip('Login Page title test', async () => {
    let pageTitle = await loginPage.getLoginPageTitle();
    console.log('Login page title:', pageTitle);
    expect(pageTitle).toBe('Account Login');
});

test.skip('Forgot password link exist test', async () => {
    // loginPage.isForgottenPwdLinkExist();
    expect(await loginPage.isForgottenPwdLinkExist()).toBeTruthy();

});

test.skip('User is able to login to the application test', async () => {
    await loginPage.doLogin("aseer@gmail.com", "Test123");
    expect.soft(await homePage.isLogoutLinkExist()).toBeTruthy();
    expect.soft(await homePage.getHomePageTitle()).toBe('My Account');
});












