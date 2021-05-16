import getFormValues from '../../src'
import * as utils from '../utils'

describe('text', () => {
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
						<label>
							<span>Hello</span>
							<input type="text" name="hello" value="Hi" />
						</label>
						<button type="submit">Submit</button>
					</form>
				</body>
			</html>
		`))

		it('should have single form value', () => {
			utils.test(
				(cy: any) => cy.get('[type="submit"]'),
				(form: HTMLFormElement, submitter: any, search: any) => {
					const before = utils.makeSearchParams(getFormValues(form, {submitter})).toString();
					const after = utils.makeSearchParams(search).toString();
					expect(before).toEqual(after);
				},
				{
					hello: 'Hi',
				}
			);
		});
	})

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
						<label>
							<span>Hello</span>
							<input
								type="text" name="hello" value="Hi"
								disabled
							/>
						</label>
						<button type="submit">Submit</button>
					</form>
				</body>
			</html>
		`))

		it('should have blank form value', () => {
			utils.test(
				(cy: any) => cy.get('[type="submit"]'),
				(form: HTMLFormElement, submitter: any, search: any) => {
					const before = utils.makeSearchParams(getFormValues(form, {submitter})).toString();
					const after = utils.makeSearchParams(search).toString();
					expect(before).toEqual(after);
				},
				{}
			);
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
					<label>
						<span>Hello</span>
						<input type="text" name="hello" value="Hi" form="form" />
					</label>
				</body>
			</html>
		`))

		it('should have single form value', () => {
			utils.test(
				(cy: any) => cy.get('[type="submit"]'),
				(form: HTMLFormElement, submitter: any, search: any) => {
					const before = utils.makeSearchParams(getFormValues(form, {submitter})).toString();
					const after = utils.makeSearchParams(search).toString();
					expect(before).toEqual(after);
				},
				{
					hello: 'Hi',
				}
			);
		});
	})

	describe('readonly', () => {
		beforeEach(utils.setup(`
			<!DOCTYPE html>
			<html lang="en-PH">
				<head>
					<meta charset="UTF-8">
					<title>Text/Readonly</title>
				</head>
				<body>
					<form>
						<label>
							<span>Hello</span>
							<input
								type="text" name="hello" value="Hi"
								readonly
							/>
						</label>
						<button type="submit">Submit</button>
					</form>
				</body>
			</html>
		`))

		it('should have single form value', () => {
			utils.test(
				(cy: any) => cy.get('[type="submit"]'),
				(form: HTMLFormElement, submitter: any, search: any) => {
					const before = utils.makeSearchParams(getFormValues(form, {submitter})).toString();
					const after = utils.makeSearchParams(search).toString();
					expect(before).toEqual(after);
				},
				{
					hello: 'Hi',
				}
			);
		});
	})
})
