describe('Navigation Bar', () => {

  // '#/' should be renamed to '#/map/' or something
  describe('Blood Map Link', () => {
    beforeEach(() => {
      browser.get('#/');
    });


    it('should render bloodMap when user is logged in', () => {
      browser.getLocationAbsUrl().then(url => {
        expect(url).toEqual('/');
      });
    });

    it('should not render bloodMap when user is not logged in', () => {
    });
  });

  describe('Profile Link', () => {
    beforeEach(() => {
      browser.get('#/profile');
    });

    it('should render Profile when user is logged in', () => {
      browser.getLocationAbsUrl().then(url => {
        expect(url).toEqual('/profile');
      });
    });

    it('should not render Profile when user is not logged in', () => {    
    });
  });

  describe('Login Link', () => {
    beforeEach(() => {
      browser.get('#/');
    });

    it('should do something', () => {
    });

    it('should probably do something else', () => {
    });
  });

});