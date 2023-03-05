import { getFormValues } from '../../src'
import * as utils from '../utils'

describe('submitter', () => {
	describe('button', () => {
		beforeEach(utils.setup(`
			<!DOCTYPE html>
			<html lang="en-PH">
				<head>
					<meta charset="UTF-8">
					<title>Submitter/Button</title>
				</head>
				<body>
					<form>
						<label>
							<span>Hello</span>
							<input type="text" name="hello" value="Hi" />
						</label>
						<button name="action" value="Foo" type="submit">Foo</button>
						<button name="action" value="Bar" type="submit">Bar</button>
					</form>
				</body>
			</html>
		`))

		it('should have double form values', () => {
			utils.test({
				action: (cy: any) => cy.get('[name="action"][value="Foo"]'),
				test: (form: HTMLFormElement, submitter: any, search: any) => {
					const before = utils.makeSearchParams(getFormValues(form, { submitter }))
						.toString();
					const after = utils.makeSearchParams(search)
						.toString();
					expect(before)
						.toEqual(after);
				},
				expectedStaticValue: {
					hello: 'Hi',
					action: 'Foo',
				},
			});
		});
	})

	describe('input', () => {
		beforeEach(utils.setup(`
			<!DOCTYPE html>
			<html lang="en-PH">
				<head>
					<meta charset="UTF-8">
					<title>Submitter/Input</title>
				</head>
				<body>
					<form>
						<label>
							<span>Hello</span>
							<input type="text" name="hello" value="Hi" />
						</label>
						<input name="action" value="Foo" type="submit" />
						<input name="action" value="Bar" type="submit" />
					</form>
				</body>
			</html>
		`))

		it('should have double form values', () => {
			utils.test({
				action: (cy: any) => cy.get('[name="action"][value="Bar"]'),
				test: (form: HTMLFormElement, submitter: any, search: any) => {
					const before = utils.makeSearchParams(getFormValues(form, { submitter }))
						.toString();
					const after = utils.makeSearchParams(search)
						.toString();
					expect(before)
						.toEqual(after);
				},
				expectedStaticValue: {
					hello: 'Hi',
					action: 'Bar',
				},
			});
		});
	})

	describe('outside', () => {
		beforeEach(utils.setup(`
			<!DOCTYPE html>
			<html lang="en-PH">
				<head>
					<meta charset="UTF-8">
					<title>Submitter/Outside</title>
				</head>
				<body>
					<form id="form"></form>
					<label>
						<span>Hello</span>
						<input type="text" name="hello" value="Hi" form="form" />
					</label>
					<button type="submit" form="form">Submit</button>
				</body>
			</html>
		`))

		it('should have single form value', () => {
			utils.test({
				action: (cy: any) => cy.get('[type="submit"]'),
				test: (form: HTMLFormElement, submitter: any, search: any) => {
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
	})
})
