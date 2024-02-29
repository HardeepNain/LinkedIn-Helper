let { imsg } = require("./secrets");
let startInboxNo = 0;
let endInboxNo = 7;

async function InboxMsg(browser, tab) {

    await tab.waitForSelector('.msg-overlay-list-bubble__convo-card-content');
    let inboxDivs = await tab.$$('.msg-overlay-list-bubble__convo-card-content');
    
    for (let i = startInboxNo; i <= endInboxNo; i++){
        await inboxDivs[i].click();
        await tab.waitForTimeout(1000);
        await tab.type('.msg-form__contenteditable p', imsg);
        await tab.waitForTimeout(1000);
        await tab.click('.msg-form__send-button');
        await tab.waitForTimeout(1000);
        await tab.click('.msg-overlay-bubble-header__control li-icon[type="cancel-icon"]');
        await tab.waitForTimeout(1000);
    }

}
module.exports = InboxMsg;