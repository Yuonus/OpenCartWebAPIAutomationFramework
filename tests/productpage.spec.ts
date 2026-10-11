import { test, expect } from '../src/fixtures/pagefixtures'

test.beforeEach(async ({ loginPage }) => {
    await loginPage.goToLoginPage();
    await loginPage.doLogin(process.env.USERNAME1!, process.env.PASSWORD!);
});

test('Verify the product header', async ({ homePage, searchResultsPage, productInfoPage, page }) => {
    await homePage.doSearch('macbook');
    await searchResultsPage.selectProduct('MacBook Pro');
    expect(await productInfoPage.getProductHeader()).toBe('MacBook Pro');
    // await page.pause();
});

test('Verify product images count', async ({ homePage, searchResultsPage, productInfoPage }) => {
    await homePage.doSearch('macbook');
    await searchResultsPage.selectProduct('MacBook Pro');
    expect(await productInfoPage.getProductImagesCount()).toBe(4);
});

test('Verify product information/data', async ({ homePage, searchResultsPage, productInfoPage, page }) => {
    await homePage.doSearch('macbook');
    await searchResultsPage.selectProduct('MacBook Pro');

    let actualProductInfoMap = await productInfoPage.getProductInfo();
    console.log('Actual Product Details:', actualProductInfoMap);

    expect.soft(actualProductInfoMap.get('productheader')).toBe('MacBook Pro');
    expect.soft(actualProductInfoMap.get('productimagescount')).toBe(4);
    expect.soft(actualProductInfoMap.get('Brand')).toBe('Apple');
    expect.soft(actualProductInfoMap.get('Product Code')).toBe('Product 18');
    expect.soft(actualProductInfoMap.get('Reward Points')).toBe('800');
    expect.soft(actualProductInfoMap.get('Availability')).toBe('Out Of Stock');
    expect.soft(actualProductInfoMap.get('productprice')).toBe('$2,000.00');
    expect.soft(actualProductInfoMap.get('extaxprice')).toBe('$2,000.00');
});

// Common Features Testing
// The common features for product page: footers, logo, searchbox, cart button
test('Application Logo exists on the Product Page', async ({ basePage }) => {
    expect(await basePage.isLogoVisible()).toBeTruthy();
});

test('Application Search Box exists on the Product Page', async ({ basePage }) => {
    expect(await basePage.isSearchBoxVisible()).toBeTruthy();
});

test('Application Cart button exists on the Product Page', async ({ basePage }) => {
    expect(await basePage.isCartButtonVisible()).toBeTruthy();
});

test('Application Footers exists on the Product Page', async ({ basePage }) => {
    expect(await basePage.getPageFootersCount()).toBe(16);
});
