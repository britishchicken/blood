'use strict'
describe('Calendar', () => {
  const time = browser.params.time;
  const hash = browser.params.hash;
  let navbar = element(by.id('navbar'));

  beforeAll(() => {
    let calendarNavEl = navbar.element(by.css('.glyphicon.glyphicon-calendar'));
    let loginEl = element(by.id('hospital-login'));
    let emailInputEl = loginEl.element(by.model('HospitalAuthCtrl.loginObj.email'));
    let passwordInputEl = loginEl.element(by.model('HospitalAuthCtrl.loginObj.password'));
    let loginBtnEl = loginEl.element(by.css('.btn.profile-button'));

    browser.get('/hospital/login');
    emailInputEl.sendKeys(`test${time}@hospital.com`);
    passwordInputEl.sendKeys(hash);
    loginBtnEl.click();
    calendarNavEl.click();
  });

  xdescribe('Hospital Event Creation', () => {
    it('should be possible', () => {
      let now = new Date();
      let lastWeek = new Date(now.getTime() - (1000 * 60 * 60 * 24 * 7));
      let nextWeek = new Date(now.getTime() + (1000 * 60 * 60 * 24 * 7));

      let dateTimeEl = element(by.model('CalendarCtrl.dateTime'));
      dateTimeEl.clear().sendKeys(lastWeek);
      dateTimeEl.clear().sendKeys(nextWeek);

      console.log($('#calendar'));
    });
  });

  xdescribe('Donor View', () => {

  });
});
