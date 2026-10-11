
import { test, expect } from '../src/fixtures/pagefixtures'
import { CsvHelper } from '../src/utils/CsvHelper';

test.beforeEach(async ({ loginPage }) => {
    await loginPage.goToLoginPage();
    await loginPage.doLogin(process.env.USERNAME1!, process.env.PASSWORD!);
});

// Data Provider:
let productData = CsvHelper.readCsv('src/testdata/product.csv');
for (let row of productData) {

    test(`Verify Search Result count - ${row.searchKey} - ${row.productName}`, async ({ homePage, searchResultsPage }) => {
        await homePage.doSearch(row.searchKey);
        let actResultCount = await searchResultsPage.getProductSearchResultsCount();
        console.log('Search Results Count', actResultCount);
        expect(actResultCount).toBe(Number(row.resultCount)); // Just for Macbook Pro  -- it is hard coded
    });
    /*      Note:
                Expected: "2"
                Received: 2
            You will get the above error in this line: --> " expect(actResultCount).toBe(row.resultCount);"
            This happens because values read from the CSV file are treated as strings, while the application returns the search result count as a number.
            To compare the values correctly, convert the CSV string to a number:
             expect(actResultCount).toBe(Number(row.resultCount));
    
            Another reason is that our generic readCsv() method also returns the values as strings, so we have to convert the value back to a number:
            static readCsv(filePath: string): Record<string, string>[]
    */
}

// Data Provider:
for (let row of productData) {
    test(`Verify user is able to land on the product page - ${row.searchKey} - ${row.productName}`, async ({ homePage, searchResultsPage, page }) => {
        await homePage.doSearch(row.searchKey);
        await searchResultsPage.selectProduct(row.productName);
        await expect(page).toHaveTitle(row.productName);
        //  expect(await page.title()).toBe(row.productName);
    });
}

// Common Features Testing
// The common features for search page: footers, logo, searchbox, cart button
test('Application Logo exists on the Search Page', async ({ basePage }) => {
    expect(await basePage.isLogoVisible()).toBeTruthy();
});

test('Application Search Box exists on the Search Page', async ({ basePage }) => {
    expect(await basePage.isSearchBoxVisible()).toBeTruthy();
});

test('Application Cart button exists on the Search Page', async ({ basePage }) => {
    expect(await basePage.isCartButtonVisible()).toBeTruthy();
});

test('Application Footers exists on the Search Page', async ({ basePage }) => {
    expect(await basePage.getPageFootersCount()).toBe(16);
});
