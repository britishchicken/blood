'use strict'
describe('Hospital Auth', () => {
  const time = browser.params.time;
  const hash = browser.params.hash;
  let navbar = element(by.id('navbar'));
  //signup page
  describe('Signup', () => {
    let signupEl = element(by.id('hospital-signup'));
    let emailInputEl = signupEl.element(by.model('HospitalAuthCtrl.signupObj.email'));
    let passwordInputEl = signupEl.element(by.model('HospitalAuthCtrl.signupObj.password'));
    let signupBtnEl = signupEl.element(by.css('.btn.profile-button'));

    beforeEach(() => {
      browser.get('/hospital/signup');
    });

    //login link
    describe('Login Link', () => {
      it('should redirect user to login page', () => {
        signupEl.element(by.css('.signup-text')).element(by.css('a')).click(); //hrefs to login page
        expect(browser.getLocationAbsUrl()).toBe('/hospital/login');
      });
    });//end login link

    //signup form
    describe('Signup Form', () => {
      it('should redirect user to hospital profile page on successful signup', () => {
        emailInputEl.sendKeys(`test${time}@hospital.com`);
        passwordInputEl.sendKeys(hash);
        signupBtnEl.click();
        expect(browser.getLocationAbsUrl()).toBe('/hospital/profile');
        element(by.css('[name="logout-btn"]')).click(); //logout
      });

      it('should not redirect user on unsuccessful signup', () => {
        emailInputEl.sendKeys(`test${time}@hospital.com`);
        passwordInputEl.sendKeys('lol');
        signupBtnEl.click();
        expect(browser.getLocationAbsUrl()).toBe('/hospital/signup');
      });
    });//end successful signup
  });//end signup page

  //login page
  describe('Login', () => {
    let loginEl = element(by.id('hospital-login'));

    beforeEach(() => {
      browser.get('/hospital/login');
    });

    //signup link
    describe('Signup Link', () => {
      it('should redirect user to signup page', () => {
        loginEl.element(by.css('a')).click(); // hrefs to signup page
        expect(browser.getLocationAbsUrl()).toBe('/hospital/signup');
      });
    });//end signup link

    //successful login
    describe('Login Form', () => {
      let emailInputEl = loginEl.element(by.model('HospitalAuthCtrl.loginObj.email'));
      let passwordInputEl = loginEl.element(by.model('HospitalAuthCtrl.loginObj.password'));
      let loginBtnEl = loginEl.element(by.css('.btn.profile-button'));

      it('should not redirect user to profile page on unsuccessful', () => {
        emailInputEl.sendKeys(`test${time}@hospital.com`);
        passwordInputEl.sendKeys('lol');
        loginBtnEl.click();
        expect(browser.getLocationAbsUrl()).toBe('/hospital/login');
      });

      it('should redirect user to profile page on successful login', () => {
        emailInputEl.sendKeys(`test${time}@hospital.com`);
        passwordInputEl.sendKeys(hash);
        loginBtnEl.click();
        expect(browser.getLocationAbsUrl()).toBe('/hospital/profile');
        navbar.element(by.css('[name="logout-btn"]')).click();
      });
    });//end login form
  });//end login page
});
