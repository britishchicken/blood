'use strict'
describe('Navigation Bar', () => {
  const time = browser.params.time;
  const hash = browser.params.hash;
  let navbar = element(by.id('navbar'));

  let calendarNavEl = navbar.element(by.css('.glyphicon.glyphicon-calendar'));
  let bloodLevelNavEl = navbar.element(by.css('.glyphicon.glyphicon-signal'));
  let profileNavEl = navbar.element(by.css('.glyphicon.glyphicon-user'));
  let loginNavEl = navbar.element(by.css('.glyphicon.glyphicon-log-in'));
  let logoutNavEl = navbar.element(by.css('.glyphicon.glyphicon-remove'));
  let signupNavEl = navbar.element(by.css('.glyphicon.glyphicon-ok'));

  describe('when user is not logged in', () => {
    it('should display login button, and signup buttons', () => {
      [calendarNavEl, bloodLevelNavEl, profileNavEl, logoutNavEl].forEach(el => {
        expect(el.isDisplayed()).toBeFalsy();
      });
      [loginNavEl, signupNavEl].forEach(el => {
        expect(el.isDisplayed()).toBeTruthy();
      });
    });
  });

  describe('when user is logged in as a hospital', () => {
    let loginEl = element(by.id('hospital-login'));
    let emailInputEl = loginEl.element(by.model('HospitalAuthCtrl.loginObj.email'));
    let passwordInputEl = loginEl.element(by.model('HospitalAuthCtrl.loginObj.password'));
    let loginBtnEl = loginEl.element(by.css('.btn.profile-button'));

    beforeAll(() => {
      browser.get('/hospital/login');
      emailInputEl.sendKeys(`test${time}@hospital.com`);
      passwordInputEl.sendKeys(hash);
      loginBtnEl.click();
    });
    afterAll(() => {
      navbar.element(by.css('[name="logout-btn"]')).click();
    });

    it('should display calendar, blood levels, profile, and logout buttons', () => {
      [loginNavEl, signupNavEl].forEach(el => {
        expect(el.isDisplayed()).toBeFalsy();
      });
      [calendarNavEl, bloodLevelNavEl, profileNavEl, logoutNavEl].forEach(el => {
        expect(el.isDisplayed()).toBeTruthy();
      });
    });
  });

  describe('when user is logged in as a donor', () => {
    let loginEl = element(by.id('donor-login'));
    let emailInputEl = loginEl.element(by.model('DonorAuthCtrl.loginObj.email'));
    let passwordInputEl = loginEl.element(by.model('DonorAuthCtrl.loginObj.password'));
    let loginBtnEl = loginEl.element(by.css('.btn.profile-button'));

    beforeAll(() => {
      loginNavEl.click()
      emailInputEl.sendKeys(`test${time}@donor.com`);
      passwordInputEl.sendKeys(hash);
      loginBtnEl.click();
    });
    afterAll(() => {
      element(by.css('[name="logout-btn"]')).click();
    });
    // shows calendar, bloodlevels, profile, and logout
    it('should display profile, and logout buttons', () => {
      [calendarNavEl, bloodLevelNavEl, loginNavEl, signupNavEl].forEach(el => {
        expect(el.isDisplayed()).toBeFalsy();
      });
      [profileNavEl, logoutNavEl].forEach(el => {
        expect(el.isDisplayed()).toBeTruthy();
      });
    });
  });
});
