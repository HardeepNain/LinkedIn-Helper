let { nhLink } = require("./secrets");
let { companies } = require("./secrets");

async function companiesFilter(browser, tab) {

    await tab.goto(nhLink);
    await tab.waitForTimeout(10000);

    let currentCompanyBtn = await tab.$('button[aria-label="Current company filter. Clicking this button displays all Current company filter options."]');
    await currentCompanyBtn.click();
    await tab.waitForTimeout(4000);

    let inputTag = await tab.$('input[placeholder="Add a company"]')
    
    for (let i = 0; i < companies.length; i++) {
        await inputTag.type(companies[i], { delay: 200 });
        await tab.waitForTimeout(7000);
        
        let allResults = await tab.$$('.search-typeahead-v2__hit.search-typeahead-v2__hit--autocomplete');
        if (allResults.length!=0) {
            await allResults[0].click();
            await tab.waitForTimeout(2000);
        }
        else {
            await inputTag.type("");
            await tab.keyboard.down("Control");
            await tab.keyboard.press("A");
            await tab.keyboard.press("X");
            await tab.keyboard.up("Control");
        }
        
    }

    let allBtns = await tab.$$('button[data-control-name="filter_show_results"]');
    await allBtns[2].click();
}
module.exports = companiesFilter;