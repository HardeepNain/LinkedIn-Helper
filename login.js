const puppeteer = require("puppeteer");
const withDrawInvitations = require("./withdraw");
const sentInvitations = require("./sentInvitations");
const csSentInvitations = require("./csSentInvitation");
const msg = require("./msg");
const InboxMsg = require("./inboxMsg");
const companiesFilter = require("./companiesFilter");
const ccChart = require("./ccChart");

const { id,pw } = require("./secrets");
console.log('id', id + ' password', pw);

async function login() {
    let browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null,
        args: ["--start-maximized"],
    });
    let pages = await browser.pages();
    let tab = pages[0];
    await tab.goto("https://www.linkedin.com/login?fromSignIn=true&trk=guest_homepage-basic_nav-header-signin");
    await tab.type("#username", id);
    await tab.type("#password", pw);
    await tab.click(".btn__primary--large.from__button--floating");
    await tab.waitForTimeout(10000);
    
    await withDrawInvitations(browser, tab);
    await sentInvitations(browser, tab);
    await csSentInvitations(browser, tab);
    await msg(browser, tab);
    await InboxMsg(browser, tab);
    await companiesFilter(browser, tab);
    await ccChart(browser, tab);

};
login();