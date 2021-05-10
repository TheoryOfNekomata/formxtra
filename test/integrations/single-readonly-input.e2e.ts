/// <reference types="cypress" />

import getFormValues from '../../src'

describe('single input template', () => {
	beforeEach(() => {
		cy.intercept({ url: '/' }, { fixture: 'templates/single-readonly-input.html' });
		cy.intercept({ url: '/?*' }, { fixture: 'templates/single-readonly-input.html' }).as('submitted');
	})

	it('should have a single form value', () => {
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
					const before = new URLSearchParams(beforeValues).toString();
					const after = new URLSearchParams(search).toString();
					expect(before).to.equal(after);
				})
			})
	})
});
