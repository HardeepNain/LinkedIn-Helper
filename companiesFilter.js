let { nhLink } = require("./secrets");
let { companies } = require("./secrets");

async function companiesFilter(browser, tab) {

    await tab.goto(nhLink);
    await tab.waitForTimeout(10000);

    let currentCompanyBtn = await tab.$('button[aria-label="Current company filter. Clicking this button displays all Current company filter options."]'); // current company filter wala btn nikal lete h
    // console.log(currentCompanyBtn);
    await currentCompanyBtn.click();
    await tab.waitForTimeout(4000);

    let inputTag = await tab.$('input[placeholder="Add a company"]') // input tag nikal liya
    // console.log(inputTag);
    
    for (let i = 0; i < companies.length; i++) { // companies wale array pe loop chla dete h
        await inputTag.type(companies[i], { delay: 200 }); // company type hogi arram se
        await tab.waitForTimeout(7000);
        
        let allResults = await tab.$$('.search-typeahead-v2__hit.search-typeahead-v2__hit--autocomplete'); // type krne ke baad saare results jo aate h nikal liye
        // console.log(allResults.length);
        if (allResults.length!=0) {
            await allResults[0].click(); // first wale result pe click kr diya
            await tab.waitForTimeout(2000);
        }
        else {
            // kabhi kbar aisa hota h ki jo company ka naam hume diya h wo linkedin pe milta hi nhi h matlab results me show nhi hota
            // uske kaafi reasons ho skte h jaise ki hmari company ke naam ke typing mistake ho etc.
            // to us case allResults[0].click() pe aake code fat jaayega agr hum inn statements ko if-else me nhi likhte
            // aur fir array me next company uske aage se type hona start hogi aur fir wo bhi nhi resutls me nhi aa paayegi
            // jisse humara code bekar ho skta h
            // to hum chahte h ki agr koi aisi company aaye to wo company skip ho jaaye usi ke liye maine ye niche wala code likha h
            await inputTag.type("");
            await tab.keyboard.down("Control");
            await tab.keyboard.press("A");
            await tab.keyboard.press("X");
            await tab.keyboard.up("Control");
        }
        
    }

    // saare companies daal dene ke baad hum show results wale button pe click kr denge
    let allBtns = await tab.$$('button[data-control-name="filter_show_results"]');
    await allBtns[2].click();
}
module.exports = companiesFilter;