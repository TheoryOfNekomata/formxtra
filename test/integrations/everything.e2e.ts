/// <reference types="cypress" />

import getFormValues from '../../src'
import {makeSearchParams} from '../utils/search';

describe('default template', () => {
	beforeEach(() => {
		cy.intercept({ url: '/' }, { fixture: 'templates/everything.html' });
		cy.intercept({ url: '/?*' }, { fixture: 'templates/everything.html' }).as('submitted');
	})

	it('should have a single form value', () => {
		let form;
		let submitter;

		cy
			.visit('/')

		cy
			.get('[name="first_name"]')
			.type('John')

		cy
			.get('[name="middle_name"]')
			.type('Marcelo')

		cy
			.get('[name="last_name"]')
			.type('Dela Cruz')

		cy
			.get('[name="gender"][value="m"]')
			.check()

		cy
			.get('[name="civil_status"]')
			.select('Married')

		cy
			.get('[name="new_registration"]')
			.check()

		cy
			.get('[name="nationality"][value="filipino"]')
			.check()

		cy
			.get('[name="dependent"][value="Jun"]')
			.check()

		cy
			.get('button.dependents')
			.click()

		cy
			.get('.additional-dependent [name="dependent"][type="text"]')
			.last()
			.type('Juana')

		cy
			.get('button.dependents')
			.click()

		cy
			.get('.additional-dependent [name="dependent"][type="text"]')
			.last()
			.type('Jane')

		cy
			.get('button.dependents')
			.click()

		cy
			.get('.additional-dependent [name="dependent"][type="text"]')
			.last()
			.type('Josh')

		cy
			.get('[name="notes"]')
			.type('Test content\n\nNew line\n\nAnother line')

		cy
			.get('form')
			.then((theForm) => {
				[form] = Array.from(theForm)
			})

		cy
			.get('[name="submit"][value="Hi"]')
			.then((submitterEl) => {
				[submitter] = Array.from(submitterEl) as HTMLButtonElement[];
				submitterEl.trigger('click');
			})

		cy
			.wait('@submitted')
			.location('search')
			.then(search => {
				const before = makeSearchParams(getFormValues(form, submitter));
				const after = new URLSearchParams(search)
				expect(before.toString()).to.equal(after.toString());
			})
	})
});
