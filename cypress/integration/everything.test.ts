import getFormValues from '../../src'
import * as utils from '../../test/utils';

describe('blank template', () => {
	beforeEach(utils.setup('everything'))

	it('should have blank form value', () => {
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

				// Note: JSDOM is static for now
				cy.get('button.dependents').click()
				cy.get('.additional-dependent [name="dependent"][type="text"]').last().type('Juana')
				cy.get('button.dependents').click()
				cy.get('.additional-dependent [name="dependent"][type="text"]').last().type('Jane')
				cy.get('button.dependents').click()
				cy.get('.additional-dependent [name="dependent"][type="text"]').last().type('Josh')

				cy.get('[name="notes"]').type('Test content\n\nNew line\n\nAnother line')
				return cy.get('[name="submit"][value="Hi"]')
			},
			(form: HTMLFormElement, submitter: any, search: any) => {
				const before = utils.makeSearchParams(getFormValues(form, {submitter})).toString();
				const after = utils.makeSearchParams(search).toString();
				expect(before).toEqual(after);
			},
			'first_name=John&middle_name=Marcelo&last_name=Dela+Cruz&gender=m&civil_status=married&new_registration=on&nationality=filipino&dependent=Jun&notes=Test+content%0D%0A%0D%0ANew+line%0D%0A%0D%0AAnother+line&submit=Hi',
		);
	});
})
