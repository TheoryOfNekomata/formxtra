import { getFormValues, LineEnding, setFormValues } from '../../src';
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
	});

	describe('programmatic value setting', () => {
		beforeEach(utils.setup(`
			<!DOCTYPE html>
			<html lang="en-PH">
				<head>
					<meta charset="UTF-8">
					<title>Text/Programmatic Value Setting</title>
				</head>
				<body>
					<form>
						<label>
							<span>Hello</span>
							<input type="text" name="hello" />
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
					setFormValues(form, { hello: 'Hi', })
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
					hello: 'Hi',
				},
			});
		});
	});

	describe('textarea', () => {
		beforeEach(utils.setup(`
			<!DOCTYPE html>
			<html lang="en-PH">
				<head>
					<meta charset="UTF-8">
					<title>Text/Textarea</title>
				</head>
				<body>
					<form>
						<label>
							<span>Hello</span>
							<textarea name="hello"></textarea>
						</label>
						<button type="submit">Submit</button>
					</form>
				</body>
			</html>
		`));

		it('should read LF line breaks', () => {
			utils.test({
				action: (cy: any) => {
					cy.get('[name="hello"]')
						.type('Hi\nHello', { parseSpecialCharSequences: false })
					return cy.get('[type="submit"]')
				},
				test: (form: HTMLFormElement, submitter: any, search: any) => {
					const before = utils.makeSearchParams(getFormValues(form, { submitter, lineEndings: LineEnding.LF }))
						.toString();
					const after = utils.makeSearchParams(search)
						.toString();
					expect(before)
						.toEqual(after);
				},
				expectedStaticValue: {
					hello: 'Hi\nHello',
				},
			});
		});

		it('should read CR line breaks', () => {
			utils.test({
				action: (cy: any) => {
					cy.get('[name="hello"]')
						.type('Hi\rHello', { parseSpecialCharSequences: false })
					return cy.get('[type="submit"]')
				},
				test: (form: HTMLFormElement, submitter: any, search: any) => {
					const before = utils.makeSearchParams(getFormValues(form, { submitter, lineEndings: LineEnding.CR }))
						.toString();
					const after = utils.makeSearchParams(search)
						.toString();
					expect(before)
						.toEqual(after);
				},
				expectedStaticValue: {
					hello: 'Hi\rHello',
				},
			});
		});

		it('should read CRLF line breaks', () => {
			utils.test({
				action: (cy: any) => {
					cy.get('[name="hello"]')
						.type('Hi\r\nHello', { parseSpecialCharSequences: false })
					return cy.get('[type="submit"]')
				},
				test: (form: HTMLFormElement, submitter: any, search: any) => {
					const before = utils.makeSearchParams(getFormValues(form, { submitter, lineEndings: LineEnding.CRLF }))
						.toString();
					const after = utils.makeSearchParams(search)
						.toString();
					expect(before)
						.toEqual(after);
				},
				expectedStaticValue: {
					hello: 'Hi\r\nHello',
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
					<title>Text/Duplicate</title>
				</head>
				<body>
					<form>
						<label>
							<span>Hello 1</span>
							<input id="hello1" type="text" value="value" name="hello"/>
						</label>
						<label>
							<span>Hello 2</span>
							<input id="hello2" type="text" value="another value" name="hello"/>
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
					hello: ['value', 'another value'],
				},
			});
		});

		it('should set both values', () => {
			utils.test({
				preAction: (form: HTMLFormElement) => {
					setFormValues(form, {
						hello: ['new value 1', 'another value 2'],
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
					hello: ['new value 1', 'another value 2'],
				},
			});
		});
	});
})
