/// <reference types="cypress" />
/// <reference types="cypress-jest-adapter" />

import getFormValues from '../../src'
import * as utils from '../utils'

describe('blank template', () => {
	beforeEach(utils.setup('blank'))

	it('should have blank form value', () => {
		utils.test(
			(cy: any) => {
				cy.get('[type="submit"]').click()
			},
			(form: HTMLFormElement, search: any) => {
				const before = utils.makeSearchParams(getFormValues(form)).toString();
				const after = utils.makeSearchParams(search).toString();
				expect(before).toEqual(after);
			},
			{}
		);
	});
})
