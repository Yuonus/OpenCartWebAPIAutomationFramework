import { Locator, Page } from "@playwright/test";

export class BasePage {

    protected readonly page: Page; // Protected -- Because we want only the BasePage children classes should be able to access it
    // `page` is a reference to the Playwright Page object,
    // and `Page` is its TypeScript type.

    // `protected` means the `page` property can be accessed
    // within BasePage and only by classes that extend BasePage.

    // `readonly` means the `page` reference can be assigned
    // only once, typically through the constructor.

    // Added on Day 9th of framework
    // Application Common Features locators across all pages
    protected readonly logo: Locator;
    protected readonly searchBox: Locator;
    protected readonly searchIcon: Locator;
    protected readonly footerLinks: Locator;
    protected readonly currency: Locator;
    protected readonly cartButton: Locator;


    constructor(page: Page) {
        this.page = page;
        this.logo = page.getByRole('img', { name: 'naveenopencart' }); // UI shows the role as image -- but PW supports 'img'
        this.searchBox = page.getByRole('textbox', { name: 'Search' });
        this.searchIcon = page.getByRole('button', { name: '' });
        // For search icon the below locator can also be used
        // this.searchIcon = page.locator('div#search button');
        this.footerLinks = page.locator('footer a');
        this.currency = page.locator('#form-currency');
        // this.cartButton = page.getByRole('button', { name: ' 0 item(s) - $0.00' });  This breaks, as it uses the same exact cart button name that can change dynamically:
        this.cartButton = page.getByRole('button', { name: /item\(s\) -/ });
        // We can also use a cssSelector
        // this.cartButton = page.locator('div#cart button.dropdown-toggle');
    }

    // Application common features/actions like: footer, logo, search ... etc.

    async isLogoVisible(): Promise<boolean> {
        await this.logo.waitFor({ state: 'visible' });
        return await this.logo.isVisible();
    }

    async isSearchBoxVisible() {
        await this.searchBox.waitFor({ state: 'visible' });
        return await this.searchBox.isVisible();
    }

    async isSearchIcon() {
        return await this.searchIcon.isVisible();
    }

    /* Page Footer relevant methods starts here */
    async getPageFooters(): Promise<string[]> {
        await this.footerLinks.waitFor({ state: 'visible' });
        return await this.footerLinks.allInnerTexts();
    }

    async getPageFootersCount(): Promise<number> {
        await this.footerLinks.first().waitFor({ state: 'visible' });
        return await this.footerLinks.count();
    }

    /* Page Footer relevant methods finishes here */

    async isCurrencyDDVisible() {
        await this.currency.waitFor({ state: 'visible' });
        return await this.currency.isVisible();
    }

    async isCartButtonVisible() {
        await this.cartButton.first().waitFor({ state: 'visible' });
        return await this.cartButton.isVisible();
    }

    // Page Level Generic Methods
    async getPageTitle(): Promise<string> {
        return await this.page.title();
    }

    getPageCurrentURL(): string {
        return this.page.url();
    }

    async waitForPageLoad() {
        await this.page.waitForLoadState('load');
    }


    /* 
        Take Screenshot: We studied taking screenshots and configuring screenshots from the playwright.config.ts file, but here we will learn how to take a custom screenshot at any moment or second when we need to take one.
        Developing Requirements: 
        >> Supply the name for the screenshot. This happens in the method parameter. 
        >> Use the screenshot() method and define what kind of screenshot you want to take. 
            :: Full page screenshot --> Use fullPage property 
            :: Screenshot Path (storage) --> Provide the path where you want to save the screenshot. I will choose the reports folder for storing the screenshots. 
            :: If you want to take a screenshot at any step of the tests, you can call this method. 
     */
    async takeScreenshot(name: string) {
        await this.page.screenshot({
            fullPage: true,
            path: `reports/screenshot/${name}.png`
        });
    }


    // Usecase --- Application common features are placed here. footer, logo, search
}