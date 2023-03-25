import { getFormValues, setFormValues } from '../../src';
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
				expectedStaticValue: 'hello=Bar&hello=Quux'
			});
		});

		it('should set values correctly', () => {
			utils.test({
				onLoaded: (form: HTMLFormElement) => {
					setFormValues(form, { hello: ['Foo', 'Baz'] });
				},
				querySubmitter: (cy: any) => cy.get('[type="submit"]'),
				onSubmitted: (form: HTMLFormElement, submitter: any, search: any) => {
					const before = utils.makeSearchParams(getFormValues(form, { submitter }))
						.toString();
					const after = utils.makeSearchParams(search)
						.toString();
					expect(before)
						.toEqual(after);
				},
				expectedStaticValue: 'hello=Foo&hello=Baz'
			});
		});
	})

	describe('multiple duplicate', () => {
		beforeEach(utils.setup(`
			<!DOCTYPE html>
			<html lang="en-PH">
				<head>
					<meta charset="UTF-8">
					<title>Select/Multiple Duplicate</title>
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
							<select name="hello" multiple>
								<option>Chocolate</option>
								<option selected>Mango</option>
								<option>Vanilla</option>
								<option selected>Ube</option>
							</select>
						</label>
						<button type="submit">Submit</button>
					</form>
				</body>
			</html>
		`))

		it('should have multiple form values on a single field', () => {
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
				expectedStaticValue: 'hello=Bar&hello=Quux&hello=Mango&hello=Ube'
			});
		});

		it('should set multiple form values across all selects', () => {
			utils.test({
				onLoaded: (form: HTMLFormElement) => {
					setFormValues(form, { hello: ['Foo', 'Baz', 'Chocolate', 'Vanilla'] })
				},
				querySubmitter: (cy: any) => cy.get('[type="submit"]'),
				onSubmitted: (form: HTMLFormElement, submitter: any, search: any) => {
					const before = utils.makeSearchParams(getFormValues(form, { submitter }))
						.toString();
					const after = utils.makeSearchParams(search)
						.toString();
					expect(before)
						.toEqual(after);
				},
				expectedStaticValue: 'hello=Foo&hello=Baz&hello=Chocolate&hello=Vanilla'
			});
		});

		it('should set multiple form values on each corresponding select element', () => {
			utils.test({
				onLoaded: (form: HTMLFormElement) => {
					setFormValues(form, { hello: [['Foo', 'Baz', 'Chocolate'], ['Vanilla']] })
				},
				querySubmitter: (cy: any) => cy.get('[type="submit"]'),
				onSubmitted: (form: HTMLFormElement, submitter: any, search: any) => {
					const before = utils.makeSearchParams(getFormValues(form, { submitter }))
						.toString();
					const after = utils.makeSearchParams(search)
						.toString();
					expect(before)
						.toEqual(after);
				},
				expectedStaticValue: 'hello=Foo&hello=Baz&hello=Vanilla'
			});
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
					hello: 'Baz',
				}
			});
		});
	})

	describe('single duplicate', () => {
		beforeEach(utils.setup(`
			<!DOCTYPE html>
			<html lang="en-PH">
				<head>
					<meta charset="UTF-8">
					<title>Select/Single Duplicate</title>
				</head>
				<body>
					<form>
						<label>
							<span>Hello</span>
							<select name="hello">
								<option>Foo</option>
								<option selected>Bar</option>
								<option>Baz</option>
								<option>Quux</option>
							</select>
							<select name="hello">
								<option>Chocolate</option>
								<option>Mango</option>
								<option>Vanilla</option>
								<option selected>Ube</option>
								<option>Foo</option>
							</select>
						</label>
						<button type="submit">Submit</button>
					</form>
				</body>
			</html>
		`))

		it('should have multiple form values on a single field', () => {
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
				expectedStaticValue: 'hello=Bar&hello=Ube'
			});
		});

		it('should set multiple form values across all selects', () => {
			utils.test({
				onLoaded: (form: HTMLFormElement) => {
					setFormValues(form, { hello: ['Foo', 'Chocolate'] })
				},
				querySubmitter: (cy: any) => cy.get('[type="submit"]'),
				onSubmitted: (form: HTMLFormElement, submitter: any, search: any) => {
					const before = utils.makeSearchParams(getFormValues(form, { submitter }))
						.toString();
					const after = utils.makeSearchParams(search)
						.toString();
					expect(before)
						.toEqual(after);
				},
				expectedStaticValue: 'hello=Foo&hello=Chocolate'
			});
		});

		it('should set multiple form values on each corresponding select element', () => {
			utils.test({
				onLoaded: (form: HTMLFormElement) => {
					setFormValues(form, { hello: ['Foo', 'Ube'] })
				},
				querySubmitter: (cy: any) => cy.get('[type="submit"]'),
				onSubmitted: (form: HTMLFormElement, submitter: any, search: any) => {
					const before = utils.makeSearchParams(getFormValues(form, { submitter }))
						.toString();
					const after = utils.makeSearchParams(search)
						.toString();
					expect(before)
						.toEqual(after);
				},
				expectedStaticValue: 'hello=Foo&hello=Ube'
			});
		});
	})
})
