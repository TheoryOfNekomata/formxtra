import getFormValues from '../../src'
import * as utils from '../utils'

describe('select', () => {
	describe('multiple', () => {
		beforeEach(utils.setup(`
			<!DOCTYPE html>
			<html lang="en-PH">
				<head>
					<meta charset="UTF-8">
					<title>Select/Multiple</title>
				</head>
				<body>
					<form>
						<label>
							<span>Hello</span>
							<select name="hello" multiple>
								<option>Foo</option>
								<option selected>Bar</option>
								<option>Baz</option>
								<option selected>Quux</option>
							</select>
						</label>
						<button type="submit">Submit</button>
					</form>
				</body>
			</html>
		`))

		it('should have multiple form values on a single field', () => {
			utils.test(
				(cy: any) => cy.get('[type="submit"]'),
				(form: HTMLFormElement, submitter: any, search: any) => {
					const before = utils.makeSearchParams(getFormValues(form, {submitter})).toString();
					const after = utils.makeSearchParams(search).toString();
					expect(before).toEqual(after);
				},
				'hello=Bar&hello=Quux'
			);
		});
	})

	describe('single', () => {
		beforeEach(utils.setup(`
			<!DOCTYPE html>
			<html lang="en-PH">
				<head>
					<meta charset="UTF-8">
					<title>Select/Single</title>
				</head>
				<body>
					<form>
						<label>
							<span>Hello</span>
							<select name="hello">
								<option>Foo</option>
								<option>Bar</option>
								<option selected>Baz</option>
							</select>
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
				{
					hello: 'Baz',
				}
			);
		});
	})
})
