/// <reference types="cypress" />

import getFormValues from '../../src'
import {makeSearchParams} from '../utils/search';

describe('blank template', () => {
	beforeEach(() => {
		cy.intercept({ url: '/' }, { fixture: 'templates/blank.html' });
		cy.intercept({ url: '/?*' }, { fixture: 'templates/blank.html' }).as('submitted');
	})

	it('should have blank form value', () => {
		let form;
		cy
			.visit('/')
			.get('form')
			.then((formResult) => {
				[form] = Array.from(formResult);
			})
			.submit()
			.wait('@submitted')
			.location('search')
			.then(search => {
				const before = makeSearchParams(getFormValues(form)).toString();
				const after = new URLSearchParams(search).toString();
				expect(before).to.equal(after);
			})
	});
})
