/// <reference types="cypress" />

import getFormValues from '../../src'

describe('blank template', () => {
	beforeEach(() => {
		cy.intercept({ url: '/' }, { fixture: 'templates/blank.html' });
		cy.intercept({ url: '/?*' }, { fixture: 'templates/blank.html' }).as('submitted');
	})

	it('should have blank form value', () => {
		let beforeValues;
		cy
			.visit('/')
			.get('form')
			.then((formResult) => {
				const [form] = Array.from(formResult);
				beforeValues = getFormValues(form);
				form.submit();
				cy.wait('@submitted')
				cy.location('search').then(search => {
					console.log(beforeValues)
					const before = new URLSearchParams(beforeValues).toString();
					const after = new URLSearchParams(search).toString();
					expect(before).to.equal(after);
				})
			})
	});
})
