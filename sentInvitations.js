let { siLink } = require("./secrets");
let pageNo = 1; // What is the use of this pageNo : Watch video of sentInvitation explanation

async function sentInvitations(browser, tab) {
    if (pageNo == 1) 
        await tab.goto(siLink); // iss link pe direct honge
    
    await tab.waitForTimeout(10000);

    // us page pe jitne bhi connect wale button/element the nikal liye
    let AllConnectElements = await tab.$$('.entity-result__actions.entity-result__divider .artdeco-button.artdeco-button--2.artdeco-button--secondary.ember-view .artdeco-button__text');

    for (let i = 0; i < AllConnectElements.length; i++) { // connections pe loop lgaya

        let text = await tab.evaluate(function(elem) { return elem.textContent; }, AllConnectElements[i]); // Connect wale element ka text nikala
        text = await text.trim(); // text me extra spaces ko htaya

        if (text == "Connect") { // agr to wo text idhar given text se match hua 
            await AllConnectElements[i].click(); // to usse related Connect button pe click hoga
            
            // agr kabhi bhi kisi se connect krne ke liye email chahiye hua ya fir ye specify krna hua ki kaise jaante ho us case me hum if me aayenge aur dialog box ko band krke us wale bande ko skip kr denge
            if (await tab.$('label[for="email"]') || await tab.$('button[role="radio"]')) {
                let cancelIcon = await tab.$('li-icon[type="cancel-icon"]');
                await cancelIcon.click();
                // console.log("clicked on cross");
            }
            // agr if true nhi hota to hum confirm wale button ke liye wait krke uspe click kr denge
            else {
                await tab.waitForSelector('.artdeco-button.artdeco-button--2.artdeco-button--primary.ember-view.ml1');
                await tab.click('.artdeco-button.artdeco-button--2.artdeco-button--primary.ember-view.ml1'); // Connection confirm hoga
                await tab.waitForTimeout(1000);
                // console.log("clicked on connect");
            }
            console.log(text + i); // just to check ki element Connect ho rhe hai ki nhi 
        }
        await tab.waitForTimeout(1000);
    }

    await tab.waitForTimeout(5000);
    await tab.evaluate('window.scrollTo(0, document.body.scrollHeight)'); // niche tak scroll hoga taki nextBtn ka element attach ho jaaye
   
    await tab.waitForTimeout(5000);
    let nextBtn = await tab.$('button[aria-label="Next"]'); // nextBtn nikal liya 
    // console.log(nextBtn);
    
    let isDisabled = await tab.evaluate(function(elem) { return elem.classList.contains(".artdeco-button--disabled"); }, nextBtn); // hum check krte hai ki kya iss button ki classlist me disabled class hai??
    // console.log(isDisabled);
    // agr nextBtn disable nhi hua to hum nextBtn pe click krenge aur page increase kr denge taki hmare given link pe dobara se redirect na ho jaaye aur fir hum sentInvitation ki recursive call lga denge
    if (!isDisabled) {
        await nextBtn.click();
        console.log(pageNo++);
        await sentInvitations(browser, tab);
    }
}

module.exports = sentInvitations; // sentInvitations ko export kr diya taki login me import krke use kr ske