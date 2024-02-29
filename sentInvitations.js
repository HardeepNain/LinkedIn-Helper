let { siLink } = require("./secrets");
let pageNo = 1;

async function sentInvitations(browser, tab) {
    if (pageNo == 1) 
        await tab.goto(siLink);
    
    await tab.waitForTimeout(10000);

    let AllConnectElements = await tab.$$('.entity-result__actions.entity-result__divider .artdeco-button.artdeco-button--2.artdeco-button--secondary.ember-view .artdeco-button__text');

    for (let i = 0; i < AllConnectElements.length; i++) {

        let text = await tab.evaluate(function(elem) { return elem.textContent; }, AllConnectElements[i]);
        text = await text.trim();

        if (text == "Connect") {
            await AllConnectElements[i].click();
            
            if (await tab.$('label[for="email"]') || await tab.$('button[role="radio"]')) {
                let cancelIcon = await tab.$('li-icon[type="cancel-icon"]');
                await cancelIcon.click();
            }
            else {
                await tab.waitForSelector('.artdeco-button.artdeco-button--2.artdeco-button--primary.ember-view.ml1');
                await tab.click('.artdeco-button.artdeco-button--2.artdeco-button--primary.ember-view.ml1');
                await tab.waitForTimeout(1000);
            }
            console.log(text + i);
        }
        await tab.waitForTimeout(1000);
    }

    await tab.waitForTimeout(5000);
    await tab.evaluate('window.scrollTo(0, document.body.scrollHeight)');
   
    await tab.waitForTimeout(5000);
    let nextBtn = await tab.$('button[aria-label="Next"]');
    
    let isDisabled = await tab.evaluate(function(elem) { return elem.classList.contains(".artdeco-button--disabled"); }, nextBtn);
    if (!isDisabled) {
        await nextBtn.click();
        console.log(pageNo++);
        await sentInvitations(browser, tab);
    }
}

module.exports = sentInvitations;