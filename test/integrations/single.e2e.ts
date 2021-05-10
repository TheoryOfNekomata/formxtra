/// <reference types="cypress" />

import getFormValues from '../../src'
import {makeSearchParams} from '../utils/search';

describe('single input template', () => {
	beforeEach(() => {
		cy.intercept({ url: '/' }, { fixture: 'templates/single-input.html' });
		cy.intercept({ url: '/?*' }, { fixture: 'templates/single-input.html' }).as('submitted');
	})

	it('should have a single form value', () => {
		let form
		cy
			.visit('/')
			.get('form')
			.then((formResult) => {
				[form] = Array.from(formResult);
			})
			.get('[type="submit"]')
			.click()
			.wait('@submitted')
			.location('search')
			.then(search => {
				const before = makeSearchParams(getFormValues(form)).toString();
				const after = new URLSearchParams(search).toString();
				expect(before).to.equal(after);
			})
	})
});

describe('single readonly template', () => {
	beforeEach(() => {
		cy.intercept({ url: '/' }, { fixture: 'templates/single-readonly-input.html' });
		cy.intercept({ url: '/?*' }, { fixture: 'templates/single-readonly-input.html' }).as('submitted');
	})

	it('should have a single form value', () => {
		let form
		cy
			.visit('/')
			.get('form')
			.then((formResult) => {
				[form] = Array.from(formResult);
			})
			.get('[type="submit"]')
			.click()
			.wait('@submitted')
			.location('search')
			.then(search => {
				const before = makeSearchParams(getFormValues(form)).toString();
				const after = new URLSearchParams(search).toString();
				expect(before).to.equal(after);
			})
	})
});

describe('single disabled template', () => {
	beforeEach(() => {
		cy.intercept({ url: '/' }, { fixture: 'templates/single-disabled-input.html' });
		cy.intercept({ url: '/?*' }, { fixture: 'templates/single-disabled-input.html' }).as('submitted');
	})

	it('should have a single form value', () => {
		let form
		cy
			.visit('/')
			.get('form')
			.then((formResult) => {
				[form] = Array.from(formResult);
			})
			.get('[type="submit"]')
			.click()
			.wait('@submitted')
			.location('search')
			.then(search => {
				const before = makeSearchParams(getFormValues(form)).toString();
				const after = new URLSearchParams(search).toString();
				expect(before).to.equal(after);
			})
	})
});

describe('single input with double button submitters template', () => {
	beforeEach(() => {
		cy
			.intercept(
				{ url: '/' },
				{ fixture: 'templates/single-input-with-double-button-submitters.html' }
			);

		cy
			.intercept(
				{ url: '/?*' },
				{ fixture: 'templates/single-input-with-double-button-submitters.html' }
			)
			.as('submitted');
	})

	it('should have a single form value', () => {
		let submitter;
		let form;
		cy
			.visit('/')
			.get('form')
			.then((formResult) => {
				[form] = Array.from(formResult);
			})
			.get('[name="action"][value="Bar"]')
			.then((submitterEl) => {
				[submitter] = Array.from(submitterEl)
			})
			.click()
			.wait('@submitted')
			.location('search')
			.then(search => {
				const before = makeSearchParams(getFormValues(form, submitter as HTMLInputElement)).toString();
				const after = new URLSearchParams(search).toString();
				expect(before).to.equal(after);
			})
	})
});

describe('single input with double input submitters template', () => {
	beforeEach(() => {
		cy
			.intercept(
				{ url: '/' },
				{ fixture: 'templates/single-input-with-double-input-submitters.html' }
			);

		cy
			.intercept(
				{ url: '/?*' },
				{ fixture: 'templates/single-input-with-double-input-submitters.html' }
			)
			.as('submitted');
	})

	it('should have a single form value', () => {
		let submitter;
		let form;
		cy
			.visit('/')
			.get('form')
			.then((formResult) => {
				[form] = Array.from(formResult);
			})
			.get('[name="action"][value="Foo"]')
			.then((submitterEl) => {
				[submitter] = Array.from(submitterEl)
			})
			.click()
			.wait('@submitted')
			.location('search')
			.then(search => {
				const before = makeSearchParams(getFormValues(form, submitter as HTMLInputElement)).toString();
				const after = new URLSearchParams(search).toString();
				expect(before).to.equal(after);
			})
	})
});
