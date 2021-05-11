/// <reference types="cypress" />

import getFormValues from '../../src'
import * as utils from '../utils';

describe('single input template', () => {
	beforeEach(utils.setup('single-input'))

	it('should have single form value', () => {
		utils.test(
			(cy: any) => {
				cy.get('[type="submit"]').click()
			},
			(form: HTMLFormElement, search: any) => {
				const before = utils.makeSearchParams(getFormValues(form)).toString();
				const after = utils.makeSearchParams(search).toString();
				expect(before).toEqual(after);
			},
			{
				hello: 'Hi',
			}
		);
	});
})

describe('single readonly template', () => {
	beforeEach(utils.setup('single-readonly-input'))

	it('should have single form value', () => {
		utils.test(
			(cy: any) => {
				cy.get('[type="submit"]').click()
			},
			(form: HTMLFormElement, search: any) => {
				const before = utils.makeSearchParams(getFormValues(form)).toString();
				const after = utils.makeSearchParams(search).toString();
				expect(before).toEqual(after);
			},
			{
				hello: 'Hi',
			}
		);
	});
})

describe('single disabled template', () => {
	beforeEach(utils.setup('single-disabled-input'))

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

describe('single input with double button submitters template', () => {
	beforeEach(utils.setup('single-input-with-double-button-submitters'))

	it('should have double form values', () => {
		let submitter: HTMLButtonElement
		utils.test(
			(cy: any) => {
				cy.get('[name="action"][value="Foo"]')
					.then((result: any) => {
						[submitter] = Array.from(result)
					})
					.click()
			},
			(form: HTMLFormElement, search: any) => {
				const before = utils.makeSearchParams(getFormValues(form, submitter)).toString();
				const after = utils.makeSearchParams(search).toString();
				expect(before).toEqual(after);
			},
			{
				hello: 'Hi',
				action: 'Foo',
			}
		);
	});
})

describe('single input with double input submitters template', () => {
	beforeEach(utils.setup('single-input-with-double-input-submitters'))

	it('should have double form values', () => {
		let submitter: HTMLInputElement
		utils.test(
			(cy: any) => {
				cy.get('[name="action"][value="Bar"]')
					.then((result: any) => {
						[submitter] = Array.from(result)
					})
					.click()
			},
			(form: HTMLFormElement, search: any) => {
				const before = utils.makeSearchParams(getFormValues(form, submitter)).toString();
				const after = utils.makeSearchParams(search).toString();
				expect(before).toEqual(after);
			},
			{
				hello: 'Hi',
				action: 'Bar',
			}
		);
	});
})
