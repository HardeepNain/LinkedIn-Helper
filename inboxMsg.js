const puppeteer = require("puppeteer");
// type your msg here 
let message = `Hardeep Nain\nwww.google.com`;
// jis inbox se lekar jis inbox tak msg bhejna hai unhe niche dedo (start counting from 0)
let startInboxNo = 0;
let endInboxNo = 0;
async function InboxMsg(browser, tab) {

    await tab.waitForSelector('.msg-overlay-list-bubble__convo-card-content');
    let inboxDivs = await tab.$$('.msg-overlay-list-bubble__convo-card-content');
    console.log(inboxDivs.length);
    for (let i = startInboxNo; i <= endInboxNo; i++){
        await inboxDivs[i].click();
        await tab.waitForTimeout(1000);
        await tab.type('.msg-form__contenteditable p', message);
        await tab.waitForTimeout(1000);
        await tab.click('.msg-form__send-button');
        await tab.waitForTimeout(1000);
        await tab.click('.msg-overlay-bubble-header__control li-icon[type="cancel-icon"]');
        await tab.waitForTimeout(1000);
    }


}
module.exports = InboxMsg;