const { chromium } = require('playwright');

async function dump() {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    
    try {
        // Since we are running the app locally, let's go to the earn page
        console.log('Navigating to http://localhost:5173/user/earn...');
        await page.goto('http://localhost:5173/user/earn');
        
        // Wait for page to load
        await page.waitForTimeout(3000);
        
        // Let's get list of tasks rendered
        const taskTitles = await page.evaluate(() => {
            const elements = document.querySelectorAll('h4');
            return Array.from(elements).map(el => el.textContent.trim());
        });
        
        console.log('Task titles rendered on Earn page:', taskTitles);
        
        // Let's see if there is any redirect or login page
        console.log('Current URL:', page.url());
        
        // Let's check localStorage
        const localStorageTasks = await page.evaluate(() => {
            return localStorage.getItem('dromoney_tasks');
        });
        console.log('localStorage tasks length:', localStorageTasks ? JSON.parse(localStorageTasks).length : 0);
        
    } catch (e) {
        console.error('Error:', e);
    } finally {
        await browser.close();
    }
}

dump();
