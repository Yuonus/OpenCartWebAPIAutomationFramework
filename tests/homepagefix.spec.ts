
import { test, expect } from '../src/fixtures/pagefixtures'


test.beforeEach(async ({ loginPage }) => {
    await loginPage.goToLoginPage();
    // await loginPage.doLogin("aseer@gmail.com", "Test123");
    await loginPage.doLogin(process.env.USERNAME1!, process.env.PASSWORD!);
    // The ! tells TypeScript they're definitely strings.
    // Without this Argument of type 'string | undefined' is not assignable to parameter of type 'string'.
    // ype 'undefined' is not assignable to type 'string'.
});


test('@smoke Home Page Title Test', async ({ homePage }) => {
    let pageTitle = await homePage.getHomePageTitle();
    console.log('Home Page title:', pageTitle);
    expect(pageTitle).toBe('My Account');
});

test('@smoke Logout link exist Test', async ({ homePage }) => {
    let logoutPageExistence = await homePage.isLogoutLinkExist();
    expect(logoutPageExistence).toBeTruthy();
    // or you can directly verify it
    // expect(await homePage.isLogoutLinkExist()).toBeTruthy();
});

test('@regression Home Page Headers Exist', async ({ homePage }) => {
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

// Common Features Testing
// The common features for home page: footers, logo, searchbox, cart button
test('@smoke Application Logo exists on the Home Page', async ({ basePage }) => {
    expect(await basePage.isLogoVisible()).toBeTruthy();
});

test('@smoke Application Search Box exists on the Home Page', async ({ basePage }) => {
    expect(await basePage.isSearchBoxVisible()).toBeTruthy();
});

test('@smoke Application Cart button exists on the Home Page', async ({ basePage }) => {
    expect(await basePage.isCartButtonVisible()).toBeTruthy();
});

test('@smoke Application Footers exists on the Home Page', async ({ basePage }) => {
    expect(await basePage.getPageFootersCount()).toBe(16);
});
