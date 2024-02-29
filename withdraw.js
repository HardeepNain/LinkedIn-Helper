let { wLink } = require("./secrets");
let page = 1;

async function withDrawInvitations(browser, tab) {
    if (page == 1)
        await tab.goto(wLink);

    let count = 0;
    await tab.waitForTimeout(3000);

    let alltimings = await tab.$$('.time-badge.t-12.t-black--light.t-normal');
    let allwithdraws = await tab.$$('.artdeco-button--3');
    
    for (let i = 0; i < alltimings.length; i++) {
        let text = await tab.evaluate(function(elem) { return elem.textContent; }, alltimings[i]);
        text = await text.trim();
        
        if (text == "3 weeks ago" || text == "1 month ago") {
            await allwithdraws[i].click();
            await tab.waitForSelector('.artdeco-modal__confirm-dialog-btn.artdeco-button.artdeco-button--2.artdeco-button--primary');
            await tab.click('.artdeco-modal__confirm-dialog-btn.artdeco-button.artdeco-button--2.artdeco-button--primary');
            console.log(text + i);
            count++;
            await tab.waitForTimeout(2000);
        }
    }
    if (count != 0) {
        await withDrawInvitations(browser, tab);
    }
    
    await tab.waitForSelector('button[aria-label="Next"]', { visible: true });
    let nextBtn = await tab.$('button[aria-label="Next"]');

    let isDisabled = await tab.evaluate(function(elem) { return elem.classList.contains(".artdeco - button--disabled"); }, nextBtn);
    if (!isDisabled) {
        await nextBtn.click();
        console.log(page++);
        await withDrawInvitations(browser, tab);
    }
}

module.exports = withDrawInvitations;