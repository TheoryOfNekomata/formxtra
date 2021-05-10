/// <reference types="cypress" />

import getFormValues from '../../src'

describe('single input template', () => {
	beforeEach(() => {
		cy.intercept({ url: '/' }, { fixture: 'templates/default.html' });
		cy.intercept({ url: '/?*' }, { fixture: 'templates/default.html' }).as('submitted');
	})

	it('should have a single form value', () => {
		let beforeValues;
		cy
			.visit('/')
			.then(() => {
				cy.get('[name="first_name"]').type('John')
				cy.get('[name="middle_name"]').type('Marcelo')
				cy.get('[name="last_name"]').type('Dela Cruz')
				cy.get('[name="gender"][value="m"]').check()
				cy.get('[name="civil_status"]').select('Married')
				cy.get('[name="new_registration"]').check()
				cy.get('[name="nationality"][value="filipino"]').check()
				cy.get('[name="dependent"][value="Jun"]').check()
				// cy.get('button.dependents').click()
				// cy.get('.additional-dependent [name="dependent"][type="text"]').eq(0).type('Juana')
				// cy.get('button.dependents').click()
				// cy.get('.additional-dependent [name="dependent"][type="text"]').eq(1).type('Jane')
				// cy.get('button.dependents').click()
				// cy.get('.additional-dependent [name="dependent"][type="text"]').eq(2).type('Josh')
				cy.get('[name="notes"]').type('Test content\n\nNew line\n\nAnother line').as('filled')
			})
			.get('form')
			.then((theForm) => {
				cy
					.get('[name="submit"][value="Hi"]')
					.then((submitterEl) => {
						const [submitter] = Array.from(submitterEl) as HTMLButtonElement[];
						beforeValues = getFormValues(theForm[0], submitter);
						submitterEl.trigger('click');
						cy.wait('@submitted')
						cy.location('search').then(search => {
							const before = JSON.stringify(new URLSearchParams(beforeValues).toString().split('&'));
							const after = JSON.stringify(new URLSearchParams(search).toString().split('&'));
							expect(before).to.equal(after);
						})
					})
			})
	})
});
