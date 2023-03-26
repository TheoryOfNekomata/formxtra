import { getFormValues, setFormValues } from '../../src';
import * as utils from '../utils'

describe('fieldset', () => {
	describe('basic', () => {
		beforeEach(utils.setup(`
			<!DOCTYPE html>
			<html lang="en-PH">
				<head>
					<meta charset="UTF-8">
					<title>Text/Basic</title>
				</head>
				<body>
					<form>
						<fieldset>
							<legend>Fieldset</legend>
							<label>
								<span>Hello</span>
								<input type="text" name="hello" value="Hi" />
							</label>
						</fieldset>
						<button type="submit">Submit</button>
					</form>
				</body>
			</html>
		`))

		it('should have single form value', () => {
			utils.test({
				querySubmitter: (cy: any) => cy.get('[type="submit"]'),
				onSubmitted: (form: HTMLFormElement, submitter: any, search: any) => {
					const before = utils.makeSearchParams(getFormValues(form, { submitter }))
						.toString();
					const after = utils.makeSearchParams(search)
						.toString();
					expect(before)
						.toEqual(after);
				},
				expectedStaticValue: {
					hello: 'Hi',
				},
			});
		});
	});

	describe('disabled', () => {
		beforeEach(utils.setup(`
			<!DOCTYPE html>
			<html lang="en-PH">
				<head>
					<meta charset="UTF-8">
					<title>Text/Disabled</title>
				</head>
				<body>
					<form>
						<fieldset disabled>
							<legend>Fieldset</legend>
							<label>
								<span>Hello</span>
								<input type="text" name="hello" value="Hi"/>
							</label>
						</fieldset>
						<button type="submit">Submit</button>		
					</form>
				</body>
			</html>
		`))

		it('should have blank form value', () => {
			utils.test({
				querySubmitter: (cy: any) => cy.get('[type="submit"]'),
				onSubmitted: (form: HTMLFormElement, submitter: any, search: any) => {
					const before = utils.makeSearchParams(getFormValues(form, { submitter }))
						.toString();
					const after = utils.makeSearchParams(search)
						.toString();
					expect(before)
						.toEqual(after);
				},
				expectedStaticValue: {},
			});
		});
	})

	describe('outside', () => {
		beforeEach(utils.setup(`
			<!DOCTYPE html>
			<html lang="en-PH">
				<head>
					<meta charset="UTF-8">
					<title>Text/Outside</title>
				</head>
				<body>
					<form id="form">
						<button type="submit">Submit</button>
					</form>
					<fieldset form="form">
						<legend>Fieldset</legend>
						<label>
							<span>Hello</span>
							<input type="text" name="hello" value="Hi" form="form" />
						</label>
					</fieldset>
				</body>
			</html>
		`))

		it('should have single form value', () => {
			utils.test({
				querySubmitter: (cy: any) => cy.get('[type="submit"]'),
				onSubmitted: (form: HTMLFormElement, submitter: any, search: any) => {
					const before = utils.makeSearchParams(getFormValues(form, { submitter }))
						.toString();
					const after = utils.makeSearchParams(search)
						.toString();
					expect(before)
						.toEqual(after);
				},
				expectedStaticValue: {
					hello: 'Hi',
				},
			});
		});
	});

	describe('outside disabled', () => {
		beforeEach(utils.setup(`
			<!DOCTYPE html>
			<html lang="en-PH">
				<head>
					<meta charset="UTF-8">
					<title>Text/Outside</title>
				</head>
				<body>
					<form id="form">
						<button type="submit">Submit</button>
					</form>
					<fieldset form="form" disabled>
						<legend>Fieldset</legend>
						<label>
							<span>Hello</span>
							<input type="text" name="hello" value="Hi" form="form" />
						</label>
					</fieldset>
				</body>
			</html>
		`))

		it('should have blank form value', () => {
			utils.test({
				querySubmitter: (cy: any) => cy.get('[type="submit"]'),
				onSubmitted: (form: HTMLFormElement, submitter: any, search: any) => {
					const before = utils.makeSearchParams(getFormValues(form, { submitter }))
						.toString();
					const after = utils.makeSearchParams(search)
						.toString();
					expect(before)
						.toEqual(after);
				},
				expectedStaticValue: {},
			});
		});
	});
});
