const {Builder, By, until} = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

(async function testForm() {
  let options = new chrome.Options();
  options.addArguments('--headless'); 
  options.addArguments('--no-sandbox');
  options.addArguments('--disable-dev-shm-usage');
  options.addArguments('--disable-gpu');
  options.addArguments('--remote-debugging-port=9222');
  options.addArguments(`--user-data-dir=/tmp/selenium-${Date.now()}`);

  let driver = await new Builder()
    .forBrowser('chrome')
    .setChromeOptions(options)
    .build();

  try {
    await driver.get('http://<TESTING-WEB-SERVER-IP>/');
    await driver.findElement(By.name('name')).sendKeys('Alice');
    await driver.findElement(By.name('email')).sendKeys('alice@example.com');
    await driver.findElement(By.name('role')).sendKeys('Developer');
    await driver.findElement(By.id('submit')).click();

    await driver.wait(until.elementLocated(By.id('success')), 3000);
    console.log('Test Success');
  } catch (e) {
    console.log('Test Failed', e);
  } finally {
    await driver.quit();
  }
})();
