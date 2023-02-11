let { hnLink } = require("./secrets");
let { companies } = require("./secrets");

async function ccChart(browser, tab) {

  await tab.goto(hnLink);
  await tab.waitForTimeout(10000);

  for (let i = 0; i < companies.length; i++) { // given companies pe loop maar diya
    
    let currentCompanyBtn;

    if (i == 0) { // agr hum first time pe current company wala button nikalte h to ye niche wala filter se use nikal skte h lekin iske baad ye filter kaam nhi krega
      currentCompanyBtn = await tab.$('button[aria-label="Current company filter. Clicking this button displays all Current company filter options."]');
      // console.log(currentCompanyBtn);
    } else { // isiliye hum saare button nikal lete h filter wale aur usme se fir current company wala dund lete h
      let btns = await tab.$$(".artdeco-pill.artdeco-pill--slate.artdeco-pill--choice.artdeco-pill--2.search-reusables__filter-pill-button.artdeco-pill--selected.reusable-search-filter-trigger-and-dropdown__trigger");
      currentCompanyBtn = btns[1];
      // console.log(currentCompanyBtn);
    }

    await currentCompanyBtn.click(); // current company button pe click hoga
    await tab.waitForTimeout(4000);
    let inputTag = await tab.$('input[placeholder="Add a company"]'); // input tag nikalenge
    // console.log(inputTag);

    await inputTag.type(companies[i], { delay: 200 }); // ek ek krke companies type hogi
    await tab.waitForTimeout(7000);

    let companyResult = await tab.$(".search-typeahead-v2__hit.search-typeahead-v2__hit--autocomplete"); // same companiesFilter ke jaise jo results aaye h unme se bas 1st nikal lenge kyunki hume click to usi pe hi krna h
    await companyResult.click();
    await tab.waitForTimeout(2000);

    let showResultsBtns = await tab.$$('button[data-control-name="filter_show_results"]');  // show results ke liye btns nikalenge aur show results wala btn dundke uspe click kr denge
    if (i == 0) await showResultsBtns[2].click(); // jb hum first time aate h tb tk current company wala filter applied nhi hota isiliye show results 3rd no. par hota h
    else await showResultsBtns[1].click(); // lekin 2nd time se current company wala filter pahle se hi applied milega isiliye us case me show results wala button 2nd no. par hoga
    await tab.waitForTimeout(7000);

    // agr pahle baare me hi humne jo company apply kri h uska koi bhi banda hmare connection me nhi mila to fir else wala filter bhi show nhi hoga
    // to taki us case me hmara code na phate uske liye maine if wala case daala h
    // agr applied company me hmare connection me se koi banda ya bande kaam krte hue to hum else me enter krenge 
    // aur fir hum us bando ki sankhya ka text nikal ke console kra denge jisko fir hum copy krke manuplate krenge
    if (await tab.$('button[aria-label="No results found. Try shortening or rephrasing your search. Click this button to edit your search."]')){
      console.log(companies[i] + " -> 0 results");
    } else {
      let totalResultsEle = await tab.$(".pb2.t-black--light.t-14");
      let text = await tab.evaluate(function (elem) { return elem.textContent;}, totalResultsEle);
      //   console.log(text);
      console.log(companies[i] + " -> " + text.trim());
    }
    await tab.waitForTimeout(7000);
  }
}
module.exports = ccChart;
