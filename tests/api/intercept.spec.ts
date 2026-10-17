// 1. Import "test" and "expect" from the Playwright Test
import { test, expect } from '@playwright/test'

test('@smoke Intercept and log requests', async ({ page }) => {
    page.route('**/*', async (route) => {
        // console.log(route.request().method(), route.request().url(), route.request().headers(), route.request().response());
        // To write it cleanly 
        console.log(route.request().method());
        console.log(route.request().url());
        console.log(route.request().headers());
        console.log(route.request().response());
        await route.continue();
    })

    // navigate to web application
    await page.goto('https://naveenautomationlabs.com/opencart/');
});

/* 
route.continue() means: "I intercepted this request, but I don't want to change it. Send it to the real server."
So there are three particularly important operations:
await route.continue(); // Let the request go to the real server
await route.fulfill(...); // Provide your own response
await route.abort(); // Block the request
*/

test('@smoke Mock search data API ', async ({ page }) => {

    let fakeProducts = [
        { name: 'Fake Macbook Pro', price: '$599' },
        { name: 'Fake iPhone 18', price: '$1009' },
    ];
    // https://naveenautomationlabs.com/opencart/index.php?route=product/search&search=MacBook
    await page.route('**/index.php?route=product/search&search=MacBook', async (route) => {
        await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify(fakeProducts)
        });
    });

    // navigate to web application
    await page.goto('https://s_tech.com/index.php?route=product/search&search=MacBook');
    await page.pause(); // added for visible observation
});

// fulfill() is used to fill the fake data in API Mocking
// Use case of Mocking:

test('@smoke Mock search page with fake HTML', async ({ page }) => {

    await page.route('**/index.php?route=product/search&search=macbook', async (route) => {
        await route.fulfill({
            status: 200,
            contentType: 'text/html',
            body: `
                <html>
                <body>
                    <h1>Search Results</h1>
                    <div class="product-layout">
                        <h4><a href="#">Fake MacBook Pro</a></h4>
                        <p class="price">$599</p>
                    </div>
                    <div class="product-layout">
                        <h4><a href="#">Fake iPhone 20</a></h4>
                        <p class="price">$999</p>
                    </div>
                </body>
                </html>
            `,
        });
    });

    await page.goto('https://naveenautomationlabs.com/opencart/index.php?route=product/search&search=macbook');

    // now assert on the fake HTML
    const heading = await page.textContent('h1');
    expect(heading).toBe('Search Results');

    const products = await page.locator('.product-layout h4').allTextContents();
    expect(products).toEqual(["Fake MacBook Pro", "Fake iPhone 20"]);

    const prices = await page.locator('.price').allTextContents();
    expect(prices).toEqual(["$599", "$999"]);
    
    await page.pause(); // added for visible observation

});


test('@smoke simulate OpenCart server error', async ({ page }) => {

    await page.route('**/index.php**', async route => {

        await route.fulfill({
            status: 500,
            contentType: 'application/json',
            body: JSON.stringify({
                error: 'Internal Server Error'
            })
        });
    });

    await page.goto('https://naveenautomationlabs.com/opencart/');
  await page.pause();
});

  
//   await page.pause();
