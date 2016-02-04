'use strict';

describe('Dashboard feature', function () {

    beforeEach(function () {
        browser.get('/#/dashboard');
        browser.waitForAngular();
    });

    it('should show dashboard title', function () {
        expect(element.all(by.css('.green')).first().getText()).toMatch('teste');
    });

});
