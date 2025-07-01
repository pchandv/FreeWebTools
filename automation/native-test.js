const {Builder, By, Key} = require('selenium-webdriver');

(async function() {
  const driver = await new Builder()
    .usingServer('http://127.0.0.1:4723')
    .withCapabilities({
      platformName: 'Windows',
      deviceName: 'WindowsPC',
      app: 'C:\\Windows\\System32\\notepad.exe'
    })
    .build();
  try {
    await driver.sleep(1000);
    const editor = await driver.findElement(By.className('Edit'));
    await editor.sendKeys('Hello from WinAppDriver', Key.RETURN);
    await driver.sleep(1000);
  } finally {
    await driver.quit();
  }
})();

