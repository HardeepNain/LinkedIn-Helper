let { cssiLink } = require("./secrets");
let scrollCount = 15; // jitni baar scroll krwana chahte ho wo yha bta do
let functionRunCount = 0; // jitni baar function ko re run krwana chahte ho

async function csSentInvitations(browser, tab) {
            
    await tab.goto(cssiLink); // yha pe page wali chij isiliye nhi rkhi kyunki har baar page reload hone pe nye bnde bhi aate hai
    await tab.waitForTimeout(5000);
    
    for (let i = 0; i < scrollCount; i++){
        await tab.evaluate('window.scrollTo(0, document.body.scrollHeight)'); // niche tak scroll hoga taki nextBtn ka element attach ho jaaye
        await tab.waitForTimeout(3000);
        // if (await tab.$('.scaffold-finite-scroll__load-button')) {
        //     tab.click('.scaffold-finite-scroll__load-button');
        // }
        console.log("scroll no. - " + i);
    }
    let AllConnectElements = await tab.$$('.artdeco-button--secondary.ember-view.full-width'); // saari timings nikal li
    console.log(AllConnectElements.length);

    for (let i = 70; i < AllConnectElements.length; i++) { // timings pe loop lgaya

        let text = await tab.evaluate(function(elem) { return elem.textContent; }, AllConnectElements[i]); // Connect wale element ka text nikala
        text = await text.trim(); // text me extra spaces ko htaya
        console.log((i + 1) + ". " + text);
        
        if (text == "Connect") { // agr to wo text idhar given text se match hua 
            await AllConnectElements[i].click(); // to usse related Connect button pe click hoga
            await tab.waitForSelector('.artdeco-button.artdeco-button--2.artdeco-button--primary.ember-view.ml1');
            await tab.click('.artdeco-button.artdeco-button--2.artdeco-button--primary.ember-view.ml1'); // Connection confirm hoga
            console.log("Sending connection request to - " + (i + 1)); // just to check ki element Connect ho rhe hai ki nhi 
            await tab.waitForTimeout(2000);
            await tab.waitForSelector('.artdeco-toast-item__dismiss');
            await tab.click('.artdeco-toast-item__dismiss'); // click on cross jo connection request bhejne ke baad aata hai
            console.log("clicked on cross");
            
        }
        await tab.waitForTimeout(2000);
    }

    // waise ye recursion call lgane ki jrurat nhi hai kyunki hum chahe to scroll count jyada rkh ke ek hi baar me kaafi inivitation bhej skte hai
    // lekin bas aise hi recursion call lga di taki ek baar me jyada nhi bhi bheje to bhi program ko jyada baar run krlo jisse bhi jyada invitation bheje jaa skte hai
    while (functionRunCount > 0) {
        functionRunCount--;
        await csSentInvitations(browser, tab);
    }
}

module.exports = csSentInvitations;
