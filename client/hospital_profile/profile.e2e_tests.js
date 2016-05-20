'use strict'
const time = browser.params.time;
const hash = browser.params.hash;
let navbar = element(by.id('navbar'));

describe('Hospital Profile', () => {
  let profileViewEl = element(by.css('.public-view'));

  //not logged in
  describe('User is not logged in as hospital', () => {
    it('should display nothing', () => {
      expect(profileViewEl.isPresent()).toBeFalsy();
    });
  });//end not logged in


  //not logged in
  describe('User is logged in as hospital', () => {
    let editBtnEl = profileViewEl.element(by.css('.profile-button.btn'));
    let editViewEl = element(by.id('edit-view'));

    beforeAll(() => {
      let loginEl = element(by.id('hospital-login'));
      browser.get('/hospital/login');
      loginEl.element(by.model('HospitalAuthCtrl.loginObj.email')).sendKeys(`test${time}@hospital.com`);
      loginEl.element(by.model('HospitalAuthCtrl.loginObj.password')).sendKeys(hash);
      loginEl.element(by.css('.btn.profile-button')).click();
    });
    afterAll(() => {
      navbar.element(by.css('[name="logout-btn"]')).click();
    });

    it('should display a profile view', () => {
      expect(profileViewEl.isPresent()).toBeTruthy();
    });

    //edit info
    describe('Edit Info', () => {
      beforeEach(() => {
        browser.get('/hospital/profile');
      });

      let editInfoEl = editViewEl.element(by.id('edit-info'));
      let editHoursEl = editViewEl.element(by.id('edit-hours'));
      let submitBtnEl = editViewEl.element(by.css('.submit-button'));
      let cancelBtnEl = editViewEl.element(by.css('.cancel-button'));

      let goodInfoData = {
        name: 'magic hospital',
        email: 'magichospital@mail.com',
        address: '944 Market St, San Francisco, CA 94102',
        phonenum: '415-123-4567',
        hospitalurl: 'www.magichospital.com'
      };

      let badInfoData = {
        name: 'hacker hospital',
        email: 'hackerhospital@mail.com',
        // address: '123 fake st',
        phonenum: 'invalid phone num',
        hospitalurl: 'www.hackerhospital.com'
      };

      it('should display edit page on click', () => {
        expect(editViewEl.isDisplayed()).toBeFalsy();
        editBtnEl.click();
        expect(editViewEl.isDisplayed()).toBeTruthy();
      });

      it('should render updated hospital information on submit', () => {
        editBtnEl.click();
        for (let key in goodInfoData) {
          editInfoEl.element(by.model(`HospitalProfileCtrl.hospital.${key}`))
            .clear().sendKeys(goodInfoData[key]);
        }
        submitBtnEl.click();
        for (let key in goodInfoData) {
          expect(profileViewEl.element(by.binding(`HospitalProfileCtrl.hospital.${key}`)).getText())
            .toEqual(goodInfoData[key]);
        }
      });

      it('should render original hospital information on cancel', () => {
        editBtnEl.click();
        for (let key in badInfoData) {
          editInfoEl.element(by.model(`HospitalProfileCtrl.hospital.${key}`));
        }
        cancelBtnEl.click();
        for (let key in badInfoData) {
          expect(profileViewEl.element(by.binding(`HospitalProfileCtrl.hospital.${key}`)).getText())
            .toEqual(goodInfoData[key]);
        }
      });
    });//end edit info

    xdescribe('Edit Blood Levels', () => {
      it('should update blood level', () => {
        //pending...
      });
    });
  });//end not logged in
});
