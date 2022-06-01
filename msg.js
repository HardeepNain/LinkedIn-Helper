const puppeteer = require("puppeteer");
// yaha pe saare filter wilter lgake uska link bhejdo 
let link = 'https://www.linkedin.com/search/results/people/?geoUrn=%5B%22102713980%22%5D&network=%5B%22F%22%5D&origin=FACETED_SEARCH&sid=qmp';
let message = `Hardeep Nain\nwww.google.com`;
let page = 1;
async function msg(browser, tab) {
    if (page == 1)
        await tab.goto(link);

    await tab.waitForTimeout(5000);
    let allmessagebtns = await tab.$$('.entry-point .artdeco-button.artdeco-button--2.artdeco-button--secondary.ember-view');
    console.log(allmessagebtns.length);
    for (let i = 0; i < allmessagebtns.length; i++) {
        await allmessagebtns[1].click();
        await tab.waitForSelector('.msg-form__contenteditable.t-14.t-black--light.t-normal.flex-grow-1.full-height.notranslate p');
        await tab.type(".msg-form__contenteditable.t-14.t-black--light.t-normal.flex-grow-1.full-height.notranslate p", message);
        await tab.waitForTimeout(1000);
        await tab.click(".msg-form__send-button.artdeco-button.artdeco-button--1");
        await tab.waitForTimeout(1000);
        await tab.click('.msg-overlay-bubble-header__control li-icon[type="cancel-icon"]');
        await tab.waitForTimeout(1000);
    }

    await tab.evaluate('window.scrollTo(0, document.body.scrollHeight)'); // niche tak scroll hoga taki nextBtn ka element attach ho jaaye
    await tab.waitForSelector('button[aria-label="Next"]', { visible: true });
    let nextBtn = await tab.$('button[aria-label="Next"]');

    let isDisabled = await tab.evaluate(function(elem) { return elem.classList.contains("artdeco-button--disabled"); }, nextBtn); // hum check krte hai ki kya iss button ki classlist me disabled class hai?? 
    if (!isDisabled) {
        await nextBtn.click();
        console.log(page++);
        await msg(browser, tab);
    }


}
module.exports = msg;

