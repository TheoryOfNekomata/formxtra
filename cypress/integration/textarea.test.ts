import { getFormValues, LineEnding, setFormValues } from '../../src';
import * as utils from '../utils'

describe('textarea', () => {
	describe('basic', () => {
		beforeEach(utils.setup(`
			<!DOCTYPE html>
			<html lang="en-PH">
				<head>
					<meta charset="UTF-8">
					<title>Textarea/Basic</title>
				</head>
				<body>
					<form>
						<label>
							<span>Hello</span>
							<textarea name="hello">Hi</textarea>
						</label>
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
	})

	describe('disabled', () => {
		beforeEach(utils.setup(`
			<!DOCTYPE html>
			<html lang="en-PH">
				<head>
					<meta charset="UTF-8">
					<title>Textarea/Disabled</title>
				</head>
				<body>
					<form>
						<label>
							<span>Hello</span>
							<textarea
								name="hello"
								disabled
							>Hi</textarea>
						</label>
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
					<title>Textarea/Outside</title>
				</head>
				<body>
					<form id="form">
						<button type="submit">Submit</button>
					</form>
					<label>
						<span>Hello</span>
						<textarea name="hello" form="form">Hi</textarea>
					</label>
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

	describe('readonly', () => {
		beforeEach(utils.setup(`
			<!DOCTYPE html>
			<html lang="en-PH">
				<head>
					<meta charset="UTF-8">
					<title>Textarea/Readonly</title>
				</head>
				<body>
					<form>
						<label>
							<span>Hello</span>
							<textarea
								name="hello"
								readonly
							>Hi</textarea>
						</label>
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

	describe('programmatic value setting', () => {
		beforeEach(utils.setup(`
			<!DOCTYPE html>
			<html lang="en-PH">
				<head>
					<meta charset="UTF-8">
					<title>Textarea/Programmatic Value Setting</title>
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

		it('should have form values set', () => {
			utils.test({
				querySubmitter: (cy: any) => cy.get('[type="submit"]'),
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

	describe('lines', () => {
		beforeEach(utils.setup(`
			<!DOCTYPE html>
			<html lang="en-PH">
				<head>
					<meta charset="UTF-8">
					<title>Textarea/Lines</title>
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
				querySubmitter: (cy: any) => {
					cy.get('[name="hello"]')
						.type('Hi\nHello', { parseSpecialCharSequences: false })
					return cy.get('[type="submit"]')
				},
				onSubmitted: (form: HTMLFormElement, submitter: any, search: any) => {
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
				querySubmitter: (cy: any) => {
					cy.get('[name="hello"]')
						.type('Hi\rHello', { parseSpecialCharSequences: false })
					return cy.get('[type="submit"]')
				},
				onSubmitted: (form: HTMLFormElement, submitter: any, search: any) => {
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
				querySubmitter: (cy: any) => {
					cy.get('[name="hello"]')
						.type('Hi\r\nHello', { parseSpecialCharSequences: false })
					return cy.get('[type="submit"]')
				},
				onSubmitted: (form: HTMLFormElement, submitter: any, search: any) => {
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
					<title>Textarea/Duplicate</title>
				</head>
				<body>
					<form>
						<label>
							<span>Hello 1</span>
							<textarea id="hello1" name="hello">value</textarea>
						</label>
						<label>
							<span>Hello 2</span>
							<textarea id="hello2" name="hello">another value</textarea>
						</label>
						<button type="submit">Submit</button>
					</form>
				</body>
			</html>
		`));

		it('should get both values', () => {
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
					hello: ['new value 1', 'another value 2'],
				},
			});
		});
	});
})
