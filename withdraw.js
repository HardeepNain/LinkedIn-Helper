let { wLink } = require("./secrets");
let page = 1;

async function withDrawInvitations(browser, tab) {
    if (page == 1)
        await tab.goto(wLink);

    let count = 0; //[#1]
    await tab.waitForTimeout(3000);

    let alltimings = await tab.$$('.time-badge.t-12.t-black--light.t-normal'); // saari timings nikal li
    let allwithdraws = await tab.$$('.artdeco-button--3'); // aur saare withdraw buttons bhi nikal liye
    
    for (let i = 0; i < alltimings.length; i++) { // timings pe loop lgaya
        let text = await tab.evaluate(function(elem) { return elem.textContent; }, alltimings[i]); // timing wale element ka text nikala
        text = await text.trim(); // text me extra spaces ko htaya
        
        if (text == "3 weeks ago" || text == "1 month ago") { // agr to wo text idhar given text se match hua 
            await allwithdraws[i].click(); // to usse related withdraw button pe click hoga
            await tab.waitForSelector('.artdeco-modal__confirm-dialog-btn.artdeco-button.artdeco-button--2.artdeco-button--primary');
            await tab.click('.artdeco-modal__confirm-dialog-btn.artdeco-button.artdeco-button--2.artdeco-button--primary'); // withdraw confirm hoga
            console.log(text + i); // just to check ki element withdraw ho rhe hai ki nhi 
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

/*
#1. Humne ek count rkha hai jise hum tabhi increase krte hai jab kisi page pe humne nikalne wala element mil jaaye
    kyunki hume us page pe element mila hai jise hum nikal dete hai to isse jaise hi ek element nikalta hai to us page pe ek element next wale page se aa jaata hai 
    ab kyunki hmara code to alltimings ki length tak hi chalega 
    maanlo ek page pe total 100 elements hai that means ki ek page pe sirf 100 baar hi loop chalega element nikle ya na nikle
    aur 100 ke baad next wale page pe move kr jaate hai 
    ab isse hota ye hai ki jo element prev wale page pe chle gye the wo skip ho jaate hai
    
    to iska solution maine count lga ke nikala hai 
    isse hoga ye ki jaise hi kisi page pe koi element nikalega count++ hoga 
    to jab loop khtam hoga to count check hoga ki kahi iss page se element nikle to nhi 
    agr element nikale hai to means ki kuch or element bhi ispe aaye honge next page to 
    to hum next page pe move krne ki bjay fxn ko dobara se call lga dete hai
    aur fir iss page pe jo element aaye the wo nikal jaate hai ab firse next page se kuch element aayenge
    to iska matlab jab tak current page pe ek bhi element aisa hai jp remove krna hai tab tak hume next page pe move nhi krenge
    kyunki agr koi element aisa hai jo remove hoga to surely koi element aayega aur agr element remove hua hai to count bhi bdega aur call firse lgegi

    ab agr dekha jaaye to agr hume ek baar remove krne wale element mil gye to hume usi page se remove krte rhenge 
    aur next page pe move hi nhi krenge 
    to ab kuch log ye soch skte hai ki fir humne next wala button bnaya hi kyu ??
    to iska ans ye hai ki jo element remove krne hai us page tak to nextBtn wala code hi pahunchata hai
*/