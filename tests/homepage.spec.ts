

import { test, expect } from '@playwright/test'
import { LoginPage } from '../src/pages/LoginPage'
import { HomePage } from '../src/pages/HomePage'

let loginPage: LoginPage;
let homePage: HomePage;

// The pre-requisite/precondition for the homepage is to login first
test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goToLoginPage();
    await loginPage.doLogin("aseer@gmail.com", "Test123");
    homePage = new HomePage(page);

});

test.skip('Home Page Title Test', async () => {
    let pageTitle = await homePage.getHomePageTitle();
    console.log('Home Page title:', pageTitle);
    expect(pageTitle).toBe('My Account');
});

test.skip('Logout link exist Test', async () => {
    let logoutPageExistence = await homePage.isLogoutLinkExist();
    expect(logoutPageExistence).toBeTruthy();
    // or you can directly verify it
    // expect(await homePage.isLogoutLinkExist()).toBeTruthy();
});

test.skip('Home Page Headers Exist', async () => {
    let allHeaders = await homePage.getHomePageHeaders();
    console.log('Home Page Headers:', allHeaders);
    expect.soft(allHeaders).toHaveLength(4);
    expect.soft(allHeaders).toEqual([
        'My Account',
        'My Orders',
        'My Affiliate Account',
        'Newsletter'
    ]);
});



