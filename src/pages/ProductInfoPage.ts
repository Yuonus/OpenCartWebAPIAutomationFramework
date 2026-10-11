
import { Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";

export class ProductInfoPage extends BasePage {


    // 1: Private locators
    private readonly header: Locator;
    private readonly productImages: Locator;
    private readonly productMetaData: Locator;
    private readonly productPricing: Locator;
    private productInfoMap: Map<string, string | number>;

    // 2: Constructor to Initialize the locators
    constructor(page: Page) {
        super(page);
        this.header = page.getByRole('heading', { name: 'MacBook Pro', level: 1 });
        this.productImages = page.locator('div#content li img')
        this.productMetaData = page.locator('div#content ul.list-unstyled:nth-of-type(1) li');
        this.productPricing = page.locator('div#content ul.list-unstyled:nth-of-type(2) li');
        this.productInfoMap = new Map<string, string | number>;
    }

    // 3: Methods -- page behaviors
    async getProductHeader(): Promise<string> {
        return await this.header.innerText();
    }

    async getProductImagesCount(): Promise<number> {
        // Waiting for the visiblity of the first image -- This action is take for safer side
        await this.productImages.first().waitFor({ state: 'visible' });
        return await this.productImages.count()
    }

    /*  Product Meta Data
            •	Brand: Apple
            •	Product Code: Product 18
            •	Reward Points: 800
            •	Availability: Out Of Stock
        We will assume Brand as the key and Apple as the value
    */
    private async getProductMetaData(): Promise<void> {
        let metaData = await this.productMetaData.allInnerTexts();
        // Fetching the data -- we can use Map and we can also use object as the object also store the data in the key-value format
        // I will prefer using the Map
        for (let data of metaData) {
            let meta = data.split(':');
            let metaKey = meta[0].trim();
            let metaValue = meta[1].trim();
            // set() adds the data into the map
            this.productInfoMap.set(metaKey, metaValue);
        }
    }

    /*  Product Price
            •	$2,000.00
            •	Ex Tax: $2,000.00
    */
    private async getProductPriceData(): Promise<void> {
        let priceData = await this.productPricing.allInnerTexts();
        let productPrice = priceData[0].trim();
        let exTaxPrice = priceData[1].split(':')[1].trim();
        this.productInfoMap.set('productprice', productPrice); // Defining our own key. Because price does not have a key
        this.productInfoMap.set('extaxprice', exTaxPrice); // Eventhough Ex Tax has a key, but we will define our own key
    }

    // Creating a method that will extract the product complete information 
    async getProductInfo(): Promise<Map<string, string | number>> {
        this.productInfoMap.set('productheader', await this.getProductHeader());
        this.productInfoMap.set('productimagescount', await this.getProductImagesCount());
        await this.getProductMetaData();
        await this.getProductPriceData();
        return this.productInfoMap;
    }

    /* Note: We only expose "getProductInfo()" method to the test file because this method returs as value */
    /* We will make the "getProductMetaData()" and "getProductPriceData()" methods private --> encapsulation concept (private methods called by public layers)*/

}