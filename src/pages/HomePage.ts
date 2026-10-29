import { Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";

export class HomePage extends BasePage {

    // 1: Private locators
    private readonly logoutLink: Locator;
    private readonly headers: Locator;
    // Added on Day 3 for HomePage Search Field and search icone
    private readonly searchBox: Locator;
    private readonly searchIcon: Locator;

    // 2: Constructor to Initialize the locators
    constructor(page: Page) {
        super(page);
        this.logoutLink = page.getByRole('link', { name: 'Logout' });
        this.headers = page.getByRole('heading', { level: 2 });
        this.searchBox = page.getByRole('textbox', { name: 'Search' });
        this.searchIcon = page.locator('#search button');
    }

    // 3: Methods -- page behaviors

    async getHomePageTitle(): Promise<string> {
        return await this.page.title();
    }
    async isLogoutLinkExist(): Promise<boolean> {
        await this.logoutLink.waitFor({ state: 'visible' });
        return await this.logoutLink.isVisible();
    }

    async getHomePageHeaders(): Promise<string[]> {
        return await this.headers.allInnerTexts();
    }

    // Added on Day 3 to search and click on the search icon
    async doSearch(searchKey: string): Promise<void> {
        console.log('Search key:', searchKey);
        await this.searchBox.fill(searchKey);
        await this.searchIcon.click();
    }

}