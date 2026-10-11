
import { Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";

export class SearchResultsPage extends BasePage {


    // 1: Private locators
    private readonly searchResults: Locator;

    // 2: Constructor to Initialize the locators
    constructor(page: Page) {
        super(page);
        this.searchResults = page.locator('div.product-layout');
    }

    // 3: Methods -- page behaviors

    async getProductSearchResultsCount(): Promise<number> {
        return await this.searchResults.count();
    }

    async selectProduct(productName: string): Promise<void> {
        console.log('Product name:', productName);
        // getByRole('link', {name: 'MacBook Pro', exact: true}) --> We will have replace "MacBook Pro" with the parameter "productName"
        // so, the user can give any other product. and we have used first() method in case if there are multiple of those products it can 
        // select the first one
        this.page.getByRole('link', { name: productName, exact: true }).first().click();

    }

}