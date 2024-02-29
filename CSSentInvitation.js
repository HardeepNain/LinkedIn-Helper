let { cssiLink } = require("./secrets");
let scrollCount = 15;
let functionRunCount = 0;

async function csSentInvitations(browser, tab) {
            
    await tab.goto(cssiLink);
    await tab.waitForTimeout(5000);
    
    for (let i = 0; i < scrollCount; i++){
        await tab.evaluate('window.scrollTo(0, document.body.scrollHeight)');
        await tab.waitForTimeout(3000);
        console.log("scroll no. - " + i);
    }
    let AllConnectElements = await tab.$$('.artdeco-button--secondary.ember-view.full-width');
    console.log(AllConnectElements.length);

    for (let i = 70; i < AllConnectElements.length; i++) {

        let text = await tab.evaluate(function(elem) { return elem.textContent; }, AllConnectElements[i]);
        text = await text.trim();
        console.log((i + 1) + ". " + text);
        
        if (text == "Connect") {
            await AllConnectElements[i].click();
            await tab.waitForSelector('.artdeco-button.artdeco-button--2.artdeco-button--primary.ember-view.ml1');
            await tab.click('.artdeco-button.artdeco-button--2.artdeco-button--primary.ember-view.ml1');
            console.log("Sending connection request to - " + (i + 1));
            await tab.waitForTimeout(2000);
            await tab.waitForSelector('.artdeco-toast-item__dismiss');
            await tab.click('.artdeco-toast-item__dismiss');
            console.log("clicked on cross");
            
        }
        await tab.waitForTimeout(2000);
    }

    while (functionRunCount > 0) {
        functionRunCount--;
        await csSentInvitations(browser, tab);
    }
}

module.exports = csSentInvitations;