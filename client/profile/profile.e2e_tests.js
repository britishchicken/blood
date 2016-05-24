'use strict'
describe('Donor Profile', () => {
  const time = browser.params.time;
  const hash = browser.params.hash;
  let navbar = element(by.id('navbar'));
  let userViewEl = element(by.css('.panel-body.user-view'));

  beforeAll(() => {
    let loginEl = element(by.id('donor-login'));
    browser.get('/donor/login');
    loginEl.element(by.model('DonorAuthCtrl.loginObj.email')).sendKeys(`test${time}@donor.com`);
    loginEl.element(by.model('DonorAuthCtrl.loginObj.password')).sendKeys(hash);
    loginEl.element(by.css('.btn.profile-button')).click();
  });
  afterAll(() => {
    navbar.element(by.css('[name="logout-btn"]')).click();
  });

  //logged in
  describe('when user is logged in as a donor', () => {
    //edit profile
    describe('on Edit Profile', () => {
      let editFormEl = userViewEl.element(by.css('.simple-form.profile-edit-form'));
      let editBtnEl = userViewEl.element(by.css('.profile-button.btn.edit-button'));
      let submitBtnEl = userViewEl.element(by.css('.profile-button-submit.btn'));
      let cancelBtnEl = userViewEl.element(by.css('.profile-button-cancel.btn'));
      const goodUserData = {
        name: 'user',
        email: 'user@mail.com',
        address: '123 fake st.'
      };
      const goodBloodTypeData = 'AB+';

      const badUserData = {
        name: 'bad',
        email: 'bad@mail.com',
        address: 'bad st.'
      };
      const badBloodTypeData = 'O-';

      afterAll(() => {
        editBtnEl.click();
        editFormEl.element(by.model('ProfileCtrl.user.email')).clear().sendKeys(`test${time}@donor.com`);
        submitBtnEl.click();
      });

      it('should display edit view on click', () => {
        expect(editFormEl.isDisplayed()).toBeFalsy();
        editBtnEl.click();
        expect(editFormEl.isDisplayed()).toBeTruthy();
        cancelBtnEl.click();
      });

      it('should render updated profile information on submit', () => {
        editBtnEl.click();
        for (let key in goodUserData) {
          editFormEl.element(by.model(`ProfileCtrl.user.${key}`)).clear().sendKeys(goodUserData[key]);
        }
        editFormEl.element(by.cssContainingText('option', 'AB+')).click();
        submitBtnEl.click();
        for (let key in goodUserData) {
          expect(userViewEl.element(by.binding(`ProfileCtrl.user.${key}`)).getText()).toEqual(goodUserData[key]);
        }
        expect(userViewEl.element(by.binding('ProfileCtrl.user.bloodtype')).getText()).toEqual(goodBloodTypeData);
      });

      it('should render original profile information on cancel', () => {
        editBtnEl.click();
        for (let key in badUserData) {
          editFormEl.element(by.model(`ProfileCtrl.user.${key}`)).clear().sendKeys(badUserData[key]);
        }
        cancelBtnEl.click();
        for (let key in badUserData) {
          expect(userViewEl.element(by.binding(`ProfileCtrl.user.${key}`)).getText()).toEqual(badUserData[key]);
        }
      });
    });//end edit profile

    //profile view
    describe('on Events View', () => {
      let upcomingEventsEl = element(by.css('.panel-body.panel-lower.events'));

      xit('should render upcoming events', () => {
      });

      xit('should render past events', () => {
      });
    });

    describe('on Friends and Favorite Hospital View', () => {
      xit('should render friends', () => {
      });
      xit('should render favorite hopsitals', () => {
      });
    });
    // });//end profile view
  });//end logged in
});
