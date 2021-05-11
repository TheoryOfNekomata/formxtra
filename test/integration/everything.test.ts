/// <reference types="cypress" />
/// <reference types="cypress-jest-adapter" />

import getFormValues from '../../src'
import * as utils from '../utils';

describe('blank template', () => {
	beforeEach(utils.setup('everything'))

	it('should have blank form value', () => {
		let submitter: HTMLButtonElement
		utils.test(
			(cy) => {
				cy.get('[name="first_name"]').type('John')
				cy.get('[name="middle_name"]').type('Marcelo')
				cy.get('[name="last_name"]').type('Dela Cruz')
				cy.get('[name="gender"][value="m"]').check()
				cy.get('[name="civil_status"]').select('Married')
				cy.get('[name="new_registration"]').check()
				cy.get('[name="nationality"][value="filipino"]').check()
				cy.get('[name="dependent"][value="Jun"]').check()
				cy.get('button.dependents').click()
				cy.get('.additional-dependent [name="dependent"][type="text"]').last().type('Juana')
				cy.get('button.dependents').click()
				cy.get('.additional-dependent [name="dependent"][type="text"]').last().type('Jane')
				cy.get('button.dependents').click()
				cy.get('.additional-dependent [name="dependent"][type="text"]').last().type('Josh')
				cy.get('[name="notes"]').type('Test content\n\nNew line\n\nAnother line')
				cy.get('[name="submit"][value="Hi"]').then((submitterEl: any) => {
					[submitter] = Array.from(submitterEl) as HTMLButtonElement[];
					submitterEl.trigger('click');
				})
			},
			(form: HTMLFormElement, search: any) => {
				const before = utils.makeSearchParams(getFormValues(form, submitter)).toString();
				const after = new URLSearchParams(search).toString();
				expect(before).toEqual(after);
			},
			{}
		);
	});
})
