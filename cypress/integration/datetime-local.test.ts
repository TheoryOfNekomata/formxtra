import { getFormValues, setFormValues } from '../../src';
import * as utils from '../utils'

describe('date', () => {
	describe('basic', () => {
		beforeEach(utils.setup(`
			<!DOCTYPE html>
			<html lang="en-PH">
				<head>
					<meta charset="UTF-8">
					<title>Datetime-Local/Basic</title>
				</head>
				<body>
					<form>
						<label>
							<span>Hello</span>
							<input type="datetime-local" name="hello" value="2003-04-06T13:37" />
						</label>
						<button type="submit">Submit</button>
					</form>
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
					hello: '2003-04-06T13:37',
				},
			});
		});
	})

	describe('disabled', () => {
		beforeEach(utils.setup(`
			<!DOCTYPE html>
			<html lang="en-PH">
				<head>
					<meta charset="UTF-8">
					<title>Datetime-Local/Disabled</title>
				</head>
				<body>
					<form>
						<label>
							<span>Hello</span>
							<input
								type="datetime-local" name="hello" value="2003-06-09T13:37"
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
				action: (cy: any) => cy.get('[type="submit"]'),
				test: (form: HTMLFormElement, submitter: any, search: any) => {
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
					<title>Datetime-Local/Outside</title>
				</head>
				<body>
					<form id="form">
						<button type="submit">Submit</button>
					</form>
					<label>
						<span>Hello</span>
						<input type="datetime-local" name="hello" value="2003-04-20T13:37" form="form" />
					</label>
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
					hello: '2003-04-20T13:37',
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
					<title>Text/Readonly</title>
				</head>
				<body>
					<form>
						<label>
							<span>Hello</span>
							<input
								type="text" name="hello" value="2003-11-11T13:37"
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
					hello: '2003-11-11T13:37',
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
					<title>Text/Basic</title>
				</head>
				<body>
					<form>
						<label>
							<span>Hello</span>
							<input type="datetime-local" name="hello" />
						</label>
						<button type="submit">Submit</button>
					</form>
				</body>
			</html>
		`));

		it('should have form values set', () => {
			utils.test({
				action: (cy: any) => cy.get('[type="submit"]'),
				preAction: (form: HTMLFormElement) => {
					setFormValues(form, { hello: new Date('2000-01-01T13:37'), })
				},
				test: (form: HTMLFormElement, submitter: any, search: any) => {
					const before = utils.makeSearchParams(getFormValues(form, { submitter }))
						.toString();
					const after = utils.makeSearchParams(search)
						.toString();
					expect(before)
						.toEqual(after);
				},
				expectedStaticValue: {
					hello: '2000-01-01T13:37',
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
					<title>Datetime-Local/Duplicate</title>
				</head>
				<body>
					<form>
						<label>
							<span>Hello 1</span>
							<input id="hello1" type="datetime-local" name="hello" value="2007-07-07T13:37"/>
						</label>
						<label>
							<span>Hello 2</span>
							<input id="hello2" type="datetime-local" name="hello" value="2008-08-08T13:37"/>
						</label>
						<button type="submit">Submit</button>
					</form>
				</body>
			</html>
		`));

		it('should get both values', () => {
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
					hello: ['2007-07-07T13:37', '2008-08-08T13:37'],
				},
			});
		});

		it('should set both values', () => {
			utils.test({
				preAction: (form: HTMLFormElement) => {
					setFormValues(form, {
						hello: ['2006-06-06T13:37', '2005-05-05T13:37'],
					})
				},
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
					hello: ['2006-06-06T13:37', '2005-05-05T13:37'],
				},
			});
		});
	});
})
