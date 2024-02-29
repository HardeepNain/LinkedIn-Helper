let {msgLink} = require("./secrets");
let { message } = require("./secrets");
let page = 1;

async function msg(browser, tab) {
    if (page == 1)
        await tab.goto(msgLink);

    await tab.waitForTimeout(5000);

    let allmessagebtns = await tab.$$('.entry-point .artdeco-button.artdeco-button--2.artdeco-button--secondary.ember-view');

    for (let i = 0; i < allmessagebtns.length; i++) {
        await allmessagebtns[i].click();
        await tab.waitForSelector('.msg-form__contenteditable.t-14.t-black--light.t-normal.flex-grow-1.full-height.notranslate p');
        await tab.type(".msg-form__contenteditable.t-14.t-black--light.t-normal.flex-grow-1.full-height.notranslate p", message);
        await tab.waitForTimeout(1000);
        await tab.click(".msg-form__send-button.artdeco-button.artdeco-button--1");
        await tab.waitForTimeout(1000);
        await tab.click('.msg-overlay-bubble-header__control li-icon[type="cancel-icon"]');
        await tab.waitForTimeout(1000);
    }

    await tab.evaluate('window.scrollTo(0, document.body.scrollHeight)');
    await tab.waitForSelector('button[aria-label="Next"]', { visible: true });
    let nextBtn = await tab.$('button[aria-label="Next"]');

    let isDisabled = await tab.evaluate(function(elem) { return elem.classList.contains("artdeco-button--disabled"); }, nextBtn);
    if (!isDisabled) {
        await nextBtn.click();
        console.log(page++);
        await msg(browser, tab);
    }

}
module.exports = msg;