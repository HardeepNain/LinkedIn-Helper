let { imsg } = require("./secrets");
// jis inbox se lekar jis inbox tak msg bhejna hai unhe niche dedo (start counting from 0)
let startInboxNo = 0;
let endInboxNo = 7;

async function InboxMsg(browser, tab) {

    await tab.waitForSelector('.msg-overlay-list-bubble__convo-card-content');
    let inboxDivs = await tab.$$('.msg-overlay-list-bubble__convo-card-content'); // inbox me jitne bhi div h wo nikal liye
    // console.log(inboxDivs.length);
    
    for (let i = startInboxNo; i <= endInboxNo; i++){
        await inboxDivs[i].click(); // ek div pe click hoga aur dialog box open hoga
        await tab.waitForTimeout(1000);
        await tab.type('.msg-form__contenteditable p', imsg); // msg type hoga
        await tab.waitForTimeout(1000);
        await tab.click('.msg-form__send-button'); // send button pe click hoga
        await tab.waitForTimeout(1000);
        await tab.click('.msg-overlay-bubble-header__control li-icon[type="cancel-icon"]'); // dialog box band hoga
        await tab.waitForTimeout(1000);
    }

}
module.exports = InboxMsg;