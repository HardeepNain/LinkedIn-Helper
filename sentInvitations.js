const puppeteer = require("puppeteer");
let pageNo = 1;
// give connection page link here
let link = 'https://www.linkedin.com/search/results/people/?connectionOf=%5B%22ACoAABoQ7WkBzamEv3C8b5mHlZBQ83mTu7E0Qc0%22%5D&geoUrn=%5B%22101174742%22%2C%22102257491%22%5D&network=%5B%22F%22%2C%22S%22%5D&origin=FACETED_SEARCH&sid=IsD';

async function sentInvitations(browser, tab) {
    if (pageNo == 1)
        await tab.goto(link);
    
    await tab.waitForTimeout(10000);

    let AllConnectElements = await tab.$$('.entity-result__actions.entity-result__divider .artdeco-button.artdeco-button--2.artdeco-button--secondary.ember-view .artdeco-button__text'); // saari timings nikal li

    for (let i = 0; i < AllConnectElements.length; i++) { // timings pe loop lgaya

        let text = await tab.evaluate(function(elem) { return elem.textContent; }, AllConnectElements[i]); // Connect wale element ka text nikala
        text = await text.trim(); // text me extra spaces ko htaya

        if (text == "Connect") { // agr to wo text idhar given text se match hua 
            await AllConnectElements[i].click(); // to usse related Connect button pe click hoga
            await tab.waitForSelector('.artdeco-button.artdeco-button--2.artdeco-button--primary.ember-view.ml1');
            await tab.click('.artdeco-button.artdeco-button--2.artdeco-button--primary.ember-view.ml1'); // Connection confirm hoga
            console.log(text + i); // just to check ki element Connect ho rhe hai ki nhi 
        }
        await tab.waitForTimeout(1000);
    }
    await tab.waitForTimeout(5000);
    await tab.evaluate('window.scrollTo(0, document.body.scrollHeight)'); // niche tak scroll hoga taki nextBtn ka element attach ho jaaye
   
    await tab.waitForTimeout(5000);
    let nextBtn = await tab.$('button[aria-label="Next"]'); 
    // console.log(nextBtn);
    
    let isDisabled = await tab.evaluate(function(elem) { return elem.classList.contains(".artdeco-button--disabled"); }, nextBtn); // hum check krte hai ki kya iss button ki classlist me disabled class hai??
    // console.log(isDisabled);
    if (!isDisabled) {
        await nextBtn.click();
        console.log(pageNo++);
        await sentInvitations(browser, tab);
    }
}
module.exports = sentInvitations;