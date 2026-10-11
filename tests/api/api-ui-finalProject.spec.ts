import { test, expect } from '../../src/fixtures/apifixtures';

const baseURL = 'https://thinking-tester-contact-list.herokuapp.com';

test('Final Project - API and UI Integration', async ({ request, page }) => {

    // ============================================================
    // 1. CREATE USER THROUGH UI
    // ============================================================

    // Generate unique user information for every test run
    const timestamp = Date.now();

    const firstName = 'Sabawoon';
    const lastName = 'Yuonus';
    const email = `sabawoon.${timestamp}@stech.com`;
    const password = 'Password123!';

    await page.goto(baseURL);

    // Click Sign Up
    await page.getByRole('button', { name: 'Sign up' }).click();

    // Fill registration form
    await page.getByRole('textbox', { name: 'First Name' }).fill(firstName);
    await page.getByRole('textbox', { name: 'Last Name' }).fill(lastName);
    await page.getByRole('textbox', { name: 'Email' }).fill(email);
    await page.getByRole('textbox', { name: 'Password' }).fill(password);

    // Submit registration
    await page.getByRole('button', { name: 'Submit' }).click();

    // Verify we can see the login page
    await expect(page.getByRole('textbox', { name: 'Email' })).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'Password' })).toBeVisible();


    // ============================================================
    // 2. LOGIN THROUGH UI
    // ============================================================

    await page.getByRole('textbox', { name: 'Email' }).fill(email);
    await page.getByRole('textbox', { name: 'Password' }).fill(password);

    await page.getByRole('button', { name: 'Submit' }).click();

    // Verify Contact List page
    await expect(page).toHaveURL(/contactList/);
    await expect(
        page.getByRole('heading', { name: 'Contact List' })
    ).toBeVisible();


    // ============================================================
    // 3. LOGIN THROUGH API
    // ============================================================

    let loginResponse = await request.post(`${baseURL}/users/login`, {
        headers: {
            'Content-Type': 'application/json'
        },
        data: {
            email: email,
            password: password
        }
    });

    expect(loginResponse.status()).toBe(200);
    let loginBody = await loginResponse.json();
    let token = loginBody.token;
    expect(token).toBeTruthy();
    console.log('API Token:', token);


    // ============================================================
    // 4. CREATE SIX CONTACTS THROUGH API
    // ============================================================

    let contacts = [
        {
            firstName: 'John',
            lastName: 'Smith',
            birthdate: '1990-01-01',
            email: `john.${timestamp}@example.com`,
            phone: '8005551001',
            street1: '100 Main Street',
            city: 'New York',
            stateProvince: 'NY',
            postalCode: '10001',
            country: 'USA'
        },
        {
            firstName: 'Sarah',
            lastName: 'Johnson',
            birthdate: '1991-02-02',
            email: `sarah.${timestamp}@example.com`,
            phone: '8005551002',
            street1: '200 Main Street',
            city: 'Boston',
            stateProvince: 'MA',
            postalCode: '02101',
            country: 'USA'
        },
        {
            firstName: 'Michael',
            lastName: 'Brown',
            birthdate: '1992-03-03',
            email: `michael.${timestamp}@example.com`,
            phone: '8005551003',
            street1: '300 Main Street',
            city: 'Chicago',
            stateProvince: 'IL',
            postalCode: '60601',
            country: 'USA'
        },
        {
            firstName: 'Emily',
            lastName: 'Davis',
            birthdate: '1993-04-04',
            email: `emily.${timestamp}@example.com`,
            phone: '8005551004',
            street1: '400 Main Street',
            city: 'Denver',
            stateProvince: 'CO',
            postalCode: '80202',
            country: 'USA'
        },
        {
            firstName: 'David',
            lastName: 'Wilson',
            birthdate: '1994-05-05',
            email: `david.${timestamp}@example.com`,
            phone: '8005551005',
            street1: '500 Main Street',
            city: 'Seattle',
            stateProvince: 'WA',
            postalCode: '98101',
            country: 'USA'
        },
        {
            firstName: 'Jessica',
            lastName: 'Miller',
            birthdate: '1995-06-06',
            email: `jessica.${timestamp}@example.com`,
            phone: '8005551006',
            street1: '600 Main Street',
            city: 'Miami',
            stateProvince: 'FL',
            postalCode: '33101',
            country: 'USA'
        }
    ];

    let contactIDs: string[] = [];

    for (let contact of contacts) {

        let createResponse = await request.post(
            `${baseURL}/contacts`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                data: contact
            }
        );

        expect(createResponse.status()).toBe(201);

        let createBody = await createResponse.json();

        expect(createBody._id).toBeTruthy();

        contactIDs.push(createBody._id);

        console.log(
            `Created contact: ${contact.firstName} ${contact.lastName}`
        );

        console.log(`Contact ID: ${createBody._id}`);
    }

    // We should now have six contact IDs
    expect(contactIDs).toHaveLength(6);


    // ============================================================
    // 5. VERIFY SIX CONTACTS IN UI
    // ============================================================

    // Refresh the page so the UI retrieves the API-created contacts
    await page.reload();

    for (let contact of contacts) {

        await expect(
            page.getByText(
                `${contact.firstName} ${contact.lastName}`
            )
        ).toBeVisible();
    }


    // ============================================================
    // 6. DELETE ONE CONTACT THROUGH API
    // ============================================================

    let contactToDelete = contacts[0];
    let contactIDToDelete = contactIDs[0];

    let deleteResponse = await request.delete(
        `${baseURL}/contacts/${contactIDToDelete}`,
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

    expect(deleteResponse.status()).toBe(200);

    console.log(
        `Deleted contact: ${contactToDelete.firstName} ${contactToDelete.lastName}`
    );


    // ============================================================
    // 7. VERIFY DELETED CONTACT IS NOT IN UI
    // ============================================================

    await page.reload();

    await expect(
        page.getByText(
            `${contactToDelete.firstName} ${contactToDelete.lastName}`
        )
    ).not.toBeVisible();


    // ============================================================
    // 8. UPDATE ONE CONTACT THROUGH API
    // ============================================================

    let contactToUpdate = contacts[1];
    let contactIDToUpdate = contactIDs[1];

    let updatedContact = {
        ...contactToUpdate,
        firstName: 'Updated',
        lastName: 'Contact',
        email: `updated.${timestamp}@example.com`
    };

    let updateResponse = await request.put(
        `${baseURL}/contacts/${contactIDToUpdate}`,
        {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            data: updatedContact
        }
    );

    expect(updateResponse.status()).toBe(200);

    console.log('Contact updated successfully');


    // ============================================================
    // 9. VERIFY UPDATED CONTACT IN UI
    // ============================================================

    await page.reload();

    await expect(
        page.getByText('Updated Contact')
    ).toBeVisible();

    await expect(
        page.getByText(`${contactToUpdate.firstName} ${contactToUpdate.lastName}`)
    ).not.toBeVisible();


    // ============================================================
    // FINAL ASSERTION
    // ============================================================

    console.log('==========================================');
    console.log('FINAL PROJECT PASSED');
    console.log('6 contacts created through API');
    console.log('Contacts verified through UI');
    console.log('1 contact deleted through API');
    console.log('Deletion verified through UI');
    console.log('1 contact updated through API');
    console.log('Update verified through UI');
    console.log('==========================================');
});
