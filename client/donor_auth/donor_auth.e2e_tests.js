'use strict'
describe('Donor Auth', () => {
  const time = browser.params.time;
  const hash = browser.params.hash;
  let navbar = element(by.id('navbar'));
  //signup page
  describe('Signup', () => {
    let signupEl = element(by.id('donor-signup'));
    let emailInputEl = signupEl.element(by.model('DonorAuthCtrl.signupObj.email'));
    let passwordInputEl = signupEl.element(by.model('DonorAuthCtrl.signupObj.password'));
    let signupBtnEl = signupEl.element(by.css('.btn.profile-button'));

    beforeEach(() => {
      browser.get('/donor/signup');
    });

    //login link
    describe('Login Link', () => {
      it('should redirect user to login page', () => {
        signupEl.element(by.css('.signup-text.old-account')).element(by.css('a')).click(); //hrefs to login page
        expect(browser.getLocationAbsUrl()).toBe('/donor/login');
      });
    });//end login link

    //signup form
    describe('Signup Form', () => {
      it('should redirect user to donor profile page on successful signup', () => {
        emailInputEl.sendKeys(`test${time}@donor.com`);
        passwordInputEl.sendKeys(hash);
        signupBtnEl.click();
        expect(browser.getLocationAbsUrl()).toBe('/profile');
        navbar.element(by.css('[name="logout-btn"]')).click(); //logout
      });

      it('should not redirect user on unsuccessful signup', () => {
        emailInputEl.sendKeys(`test${time}@donor.com`);
        passwordInputEl.sendKeys('lol');
        signupBtnEl.click();
        expect(browser.getLocationAbsUrl()).toBe('/donor/signup');
      });
    });//end successful signup
  });//end signup page

  //login page
  describe('Login', () => {
    let loginEl = element(by.id('donor-login'));

    beforeEach(() => {
      browser.get('/donor/login');
    });

    //signup link
    describe('Signup Link', () => {
      it('should redirect user to signup page', () => {
        loginEl.element(by.css('.signup-text.new-account')).element(by.css('a')).click(); //hrefs to signup page
        expect(browser.getLocationAbsUrl()).toBe('/donor/signup');
      });
    });//end signup link

    //successful login
    describe('Login Form', () => {
      let emailInputEl = loginEl.element(by.model('DonorAuthCtrl.loginObj.email'));
      let passwordInputEl = loginEl.element(by.model('DonorAuthCtrl.loginObj.password'));
      let loginBtnEl = loginEl.element(by.css('.btn.profile-button'));

      it('should redirect user to profile page on successful login', () => {
        emailInputEl.sendKeys(`test${time}@donor.com`);
        passwordInputEl.sendKeys(hash);
        loginBtnEl.click();
        expect(browser.getLocationAbsUrl()).toBe('/profile');
        element(by.css('[name="logout-btn"]')).click();
      });

      it('should not redirect user to profile page on unsuccessful', () => {
        emailInputEl.sendKeys(`test${time}@donor.com`);
        passwordInputEl.sendKeys('lol');
        loginBtnEl.click();
        expect(browser.getLocationAbsUrl()).toBe('/donor/login');
      });
    });//end login form
  });//end login page
});
