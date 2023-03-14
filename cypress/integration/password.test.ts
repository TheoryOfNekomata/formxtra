import { getFormValues, setFormValues } from '../../src';
import * as utils from '../utils'

describe('password', () => {
	describe('basic', () => {
		beforeEach(utils.setup(`
			<!DOCTYPE html>
			<html lang="en-PH">
				<head>
					<meta charset="UTF-8">
					<title>Password/Basic</title>
				</head>
				<body>
					<form>
						<label>
							<span>Hello</span>
							<input type="password" name="hello" value="Hi" />
						</label>
						<button type="submit">Submit</button>
					</form>
				</body>
			</html>
		`))

		it('should have single form value', () => {
			utils.test({
				actionBeforeSubmit: (cy: any) => cy.get('[type="submit"]'),
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
					<title>Password/Disabled</title>
				</head>
				<body>
					<form>
						<label>
							<span>Hello</span>
							<input
								type="password" name="hello" value="Hi"
								disabled
							/>
						</label>
						<button type="submit">Submit</button>
					</form>
				</body>
			</html>
		`))

		it('should have blank form value', () => {
			utils.test({
				actionBeforeSubmit: (cy: any) => cy.get('[type="submit"]'),
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
					<title>Password/Outside</title>
				</head>
				<body>
					<form id="form">
						<button type="submit">Submit</button>
					</form>
					<label>
						<span>Hello</span>
						<input type="password" name="hello" value="Hi" form="form" />
					</label>
				</body>
			</html>
		`))

		it('should have single form value', () => {
			utils.test({
				actionBeforeSubmit: (cy: any) => cy.get('[type="submit"]'),
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

	describe('readonly', () => {
		beforeEach(utils.setup(`
			<!DOCTYPE html>
			<html lang="en-PH">
				<head>
					<meta charset="UTF-8">
					<title>Password/Readonly</title>
				</head>
				<body>
					<form>
						<label>
							<span>Hello</span>
							<input
								type="password" name="hello" value="Hi"
								readonly
							/>
						</label>
						<button type="submit">Submit</button>
					</form>
				</body>
			</html>
		`))

		it('should have single form value', () => {
			utils.test({
				actionBeforeSubmit: (cy: any) => cy.get('[type="submit"]'),
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

	describe('programmatic value setting', () => {
		beforeEach(utils.setup(`
			<!DOCTYPE html>
			<html lang="en-PH">
				<head>
					<meta charset="UTF-8">
					<title>Password/Programmatic Value Setting</title>
				</head>
				<body>
					<form>
						<label>
							<span>Hello</span>
							<input type="password" name="hello" />
						</label>
						<button type="submit">Submit</button>
					</form>
				</body>
			</html>
		`));

		it('should have form values set', () => {
			utils.test({
				actionBeforeSubmit: (cy: any) => cy.get('[type="submit"]'),
				onLoaded: (form: HTMLFormElement) => {
					setFormValues(form, { hello: 'Hi', })
				},
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

	describe('duplicate', () => {
		beforeEach(utils.setup(`
			<!DOCTYPE html>
			<html lang="en-PH">
				<head>
					<meta charset="UTF-8">
					<title>Password/Duplicate</title>
				</head>
				<body>
					<form>
						<label>
							<span>Hello 1</span>
							<input id="hello1" type="password" value="value" name="hello"/>
						</label>
						<label>
							<span>Hello 2</span>
							<input id="hello2" type="password" value="another value" name="hello"/>
						</label>
						<button type="submit">Submit</button>
					</form>
				</body>
			</html>
		`));

		it('should get both values', () => {
			utils.test({
				actionBeforeSubmit: (cy: any) => cy.get('[type="submit"]'),
				onSubmitted: (form: HTMLFormElement, submitter: any, search: any) => {
					const before = utils.makeSearchParams(getFormValues(form, { submitter }))
						.toString();
					const after = utils.makeSearchParams(search)
						.toString();
					expect(before)
						.toEqual(after);
				},
				expectedStaticValue: {
					hello: ['value', 'another value'],
				},
			});
		});

		it('should set both values', () => {
			utils.test({
				onLoaded: (form: HTMLFormElement) => {
					setFormValues(form, {
						hello: ['new value 1', 'another value 2'],
					})
				},
				actionBeforeSubmit: (cy: any) => cy.get('[type="submit"]'),
				onSubmitted: (form: HTMLFormElement, submitter: any, search: any) => {
					const before = utils.makeSearchParams(getFormValues(form, { submitter }))
						.toString();
					const after = utils.makeSearchParams(search)
						.toString();
					expect(before)
						.toEqual(after);
				},
				expectedStaticValue: {
					hello: ['new value 1', 'another value 2'],
				},
			});
		});
	});
})
