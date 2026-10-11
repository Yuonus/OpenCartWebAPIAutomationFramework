import { Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";

export class LoginPage extends BasePage {

    // 1: Private Locators
    private readonly emailId: Locator;
    private readonly password: Locator;
    private readonly loginBtn: Locator;
    private readonly forgottenPasswordLink: Locator;
    private readonly loginErrorMessage;

    // 2: Constructor of the page class: to initialize the locators
    constructor(page: Page) {
        super(page);
        this.emailId = page.getByRole('textbox', { name: 'E-Mail Address' });
        this.password = page.getByRole('textbox', { name: 'Password' });
        this.loginBtn = page.getByRole('button', { name: 'Login' });
        this.forgottenPasswordLink = page.getByRole('link', { name: 'Forgotten Password' }).first();
        this.loginErrorMessage = page.locator('div.alert.alert-danger.alert-dismissible');
    }

    // 3: Public page actions (methods) / behavior: Encapsulation
    // Note: If you don't write public with methods, they will be public by default
    async goToLoginPage(): Promise<void> {
        await this.page.goto('opencart/index.php?route=account/login');

        /*
            Note:

            https://naveenautomationlabs.com/opencart/index.php?route=account/login
            https://naveenautomationlabs.com/ ---> Domain Name (Base URL)
            opencart/index.php?route=account/login ---> Partial URL
                >> In the goToLoginPage() method, we will not maintain the Partial URL.
                >> The domain name (Base URL) will be stored inside the playwright.config.ts file.

            Why should we not maintain/use the full URL, including the domain name?
            Reason:
            If you supply the full URL:
            "https://naveenautomationlabs.com/opencart/index.php?route=account/login"

            it may fail when running against different environments such as QA, DEV, or STAGE,
            because each environment will have its own URL/domain specifier.
            For example:
                DEV   ---> https://dev.naveenautomationlabs.com/
                QA    ---> https://qa.naveenautomationlabs.com/
                STAGE ---> https://stage.naveenautomationlabs.com/

            To avoid this issue, we will use only the partial URL, which remains the same
            across environments.

            The Base URL for each environment will be stored in the playwright.config.ts file.
    */
    }

    // Removed -- as we have a generic method for page title in the BasePage class
    // async getLoginPageTitle(): Promise<string> {
    //     return await this.page.title();
    // }

    // In this method, we have used Encapsulation because we are using a private locator inside a public method.
    // The locator (forgottenPasswordLink) is private and can only be accessed
    // within the class, while the public method provides controlled access to it.
    async isForgottenPwdLinkExist(): Promise<boolean> {
        return await this.forgottenPasswordLink.isVisible();
    }

    async doLogin(username: string, password: string): Promise<void> {
        console.log(`User Creds: ${username} - ${password}`);
        await this.emailId.fill(username);
        await this.password.fill(password);
        await this.loginBtn.click();
    }

    async isInvalidLoginErrorDisplayed(): Promise<boolean> {
        return await this.loginErrorMessage.isVisible();
    }



}

