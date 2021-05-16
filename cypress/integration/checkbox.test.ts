import getFormValues from '../../src'
import * as utils from '../utils'

describe('checkbox', () => {
	describe('basic', () => {
		beforeEach(utils.setup(`
			<!DOCTYPE html>
			<html lang="en-PH">
				<head>
					<meta charset="UTF-8">
					<title>Checkbox/Basic</title>
				</head>
				<body>
					<form>
						<label>
							<span>Hello</span>
							<input type="checkbox" name="enabled" />
						</label>
						<button type="submit">Submit</button>
					</form>
				</body>
			</html>
		`))

		it('should have no form values', () => {
			utils.test(
				(cy: any) => cy.get('[type="submit"]'),
				(form: HTMLFormElement, submitter: any, search: any) => {
					const values = getFormValues(form, {submitter})
					const before = utils.makeSearchParams(values).toString();
					const after = utils.makeSearchParams(search).toString();
					expect(values['enabled']).toBeUndefined();
					expect(before).toEqual(after);
				},
				''
			);
		});

		it('should have false checked value', () => {
			utils.test(
				(cy: any) => cy.get('[type="submit"]'),
				(form: HTMLFormElement, submitter: any, search: any) => {
					const values = getFormValues(form, {submitter, booleanValuelessCheckbox: true })
					expect(values['enabled']).toBe(false);
				}
			);
		});
	})

	describe('checked', () => {
		beforeEach(utils.setup(`
			<!DOCTYPE html>
			<html lang="en-PH">
				<head>
					<meta charset="UTF-8">
					<title>Checkbox/Checked</title>
				</head>
				<body>
					<form>
						<label>
							<span>Hello</span>
							<input type="checkbox" name="enabled" checked />
						</label>
						<button type="submit">Submit</button>
					</form>
				</body>
			</html>
		`))

		it('should have single form value on a single field', () => {
			utils.test(
				(cy: any) => cy.get('[type="submit"]'),
				(form: HTMLFormElement, submitter: any, search: any) => {
					const before = utils.makeSearchParams(getFormValues(form, {submitter})).toString();
					const after = utils.makeSearchParams(search).toString();
					expect(before).toEqual(after);
				},
				'enabled=on'
			);
		});
	})
})
