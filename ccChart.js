let { hnLink } = require("./secrets");
let { companies } = require("./secrets");

async function ccChart(browser, tab) {

  await tab.goto(hnLink);
  await tab.waitForTimeout(10000);

  for (let i = 0; i < companies.length; i++) {
    
    let currentCompanyBtn;

    if (i == 0) {
      currentCompanyBtn = await tab.$('button[aria-label="Current company filter. Clicking this button displays all Current company filter options."]');
    } else {
      let btns = await tab.$$(".artdeco-pill.artdeco-pill--slate.artdeco-pill--choice.artdeco-pill--2.search-reusables__filter-pill-button.artdeco-pill--selected.reusable-search-filter-trigger-and-dropdown__trigger");
      currentCompanyBtn = btns[1];
    }

    await currentCompanyBtn.click();
    await tab.waitForTimeout(4000);
    let inputTag = await tab.$('input[placeholder="Add a company"]');

    await inputTag.type(companies[i], { delay: 200 });
    await tab.waitForTimeout(7000);

    let companyResult = await tab.$(".search-typeahead-v2__hit.search-typeahead-v2__hit--autocomplete");
    await companyResult.click();
    await tab.waitForTimeout(2000);

    let showResultsBtns = await tab.$$('button[data-control-name="filter_show_results"]');
    if (i == 0) await showResultsBtns[2].click();
    else await showResultsBtns[1].click();
    await tab.waitForTimeout(7000);

    if (await tab.$('button[aria-label="No results found. Try shortening or rephrasing your search. Click this button to edit your search."]')){
      console.log(companies[i] + " -> 0 results");
    } else {
      let totalResultsEle = await tab.$(".pb2.t-black--light.t-14");
      let text = await tab.evaluate(function (elem) { return elem.textContent;}, totalResultsEle);
      console.log(companies[i] + " -> " + text.trim());
    }
    await tab.waitForTimeout(7000);
  }
}
module.exports = ccChart;