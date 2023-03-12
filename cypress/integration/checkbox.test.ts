import { getFormValues, setFormValues } from '../../src';
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
			utils.test({
				action: (cy: any) => cy.get('[type="submit"]'),
				test: (form: HTMLFormElement, submitter: any, search: any) => {
					const values = getFormValues(form, { submitter })
					const before = utils.makeSearchParams(values)
						.toString();
					const after = utils.makeSearchParams(search)
						.toString();
					expect(values['enabled'])
						.toBeUndefined();
					expect(before)
						.toEqual(after);
				},
				expectedStaticValue: '',
			});
		});

		it('should have false checked value', () => {
			utils.test({
				action: (cy: any) => cy.get('[type="submit"]'),
				test: (form: HTMLFormElement, submitter: any, search: any) => {
					const values = getFormValues(form,
						{
							submitter,
							booleanValuelessCheckbox: true
						}
					)
					expect(values['enabled'])
						.toBe(false);
				}
			});
		});
	});

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
				expectedStaticValue: 'enabled=on',
			});
		});
	});

	describe('duplicate', () => {
		beforeEach(utils.setup(`
			<!DOCTYPE html>
			<html lang="en-PH">
				<head>
					<meta charset="UTF-8">
					<title>Checkbox/Duplicate</title>
				</head>
				<body>
					<form>
						<label>
							<span>Hello 1</span>
							<input type="checkbox" name="enabled" value="hello 1" checked />
						</label>
						<label>
							<span>Hello 2</span>
							<input type="checkbox" name="enabled" value="hello 2" checked />
						</label>
						<label>
							<span>Hello 3</span>
							<input type="checkbox" name="enabled" value="hello 3" />
						</label>
						<label>
							<span>Hello 4</span>
							<input type="checkbox" name="enabled" value="hello 4" />
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
					enabled: ['hello 1', 'hello 2'],
				},
			});
		});

		it('should set both values', () => {
			utils.test({
				preAction: (form: HTMLFormElement) => {
					setFormValues(form, {
						enabled: ['hello 3', 'hello 4'],
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
					enabled: ['hello 3', 'hello 4'],
				},
			});
		});
	});

	describe('setting values', () => {
		beforeEach(utils.setup(`
			<!DOCTYPE html>
			<html lang="en-PH">
				<head>
					<meta charset="UTF-8">
					<title>Checkbox/Setting Values</title>
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

		it('should check for boolean "true"', () => {
			utils.test({
				preAction: (form: HTMLFormElement) => {
					setFormValues(form, { enabled: true, })
				},
				action: (cy: any) => cy.get('[type="submit"]'),
				test: (form: HTMLFormElement, submitter: any, search: any) => {
					const values = getFormValues(form, { submitter })
					expect(values['enabled']).toBe('on');
				},
				expectedStaticValue: 'enabled=on',
			});
		});

		it('should check for string "true"', () => {
			utils.test({
				preAction: (form: HTMLFormElement) => {
					setFormValues(form, { enabled: 'true', })
				},
				action: (cy: any) => cy.get('[type="submit"]'),
				test: (form: HTMLFormElement, submitter: any, search: any) => {
					const values = getFormValues(form, { submitter })
					expect(values['enabled']).toBe('on');
				},
				expectedStaticValue: 'enabled=on',
			});
		});

		it('should check for string "yes"', () => {
			utils.test({
				preAction: (form: HTMLFormElement) => {
					setFormValues(form, { enabled: 'yes', })
				},
				action: (cy: any) => cy.get('[type="submit"]'),
				test: (form: HTMLFormElement, submitter: any, search: any) => {
					const values = getFormValues(form, { submitter })
					expect(values['enabled']).toBe('on');
				},
				expectedStaticValue: 'enabled=on',
			});
		});

		it('should check for string "on"', () => {
			utils.test({
				preAction: (form: HTMLFormElement) => {
					setFormValues(form, { enabled: 'on', })
				},
				action: (cy: any) => cy.get('[type="submit"]'),
				test: (form: HTMLFormElement, submitter: any, search: any) => {
					const values = getFormValues(form, { submitter })
					expect(values['enabled']).toBe('on');
				},
				expectedStaticValue: 'enabled=on',
			});
		});

		it('should uncheck for boolean "false"', () => {
			utils.test({
				preAction: (form: HTMLFormElement) => {
					setFormValues(form, { enabled: false, })
				},
				action: (cy: any) => cy.get('[type="submit"]'),
				test: (form: HTMLFormElement, submitter: any, search: any) => {
					const values = getFormValues(form, { submitter })
					expect(values['enabled']).not.toBe('on');
				},
				expectedStaticValue: '',
			});
		});

		it('should uncheck for string "false"', () => {
			utils.test({
				preAction: (form: HTMLFormElement) => {
					setFormValues(form, { enabled: 'false', })
				},
				action: (cy: any) => cy.get('[type="submit"]'),
				test: (form: HTMLFormElement, submitter: any, search: any) => {
					const values = getFormValues(form, { submitter })
					expect(values['enabled']).not.toBe('on');
				},
				expectedStaticValue: '',
			});
		});

		it('should uncheck for string "no"', () => {
			utils.test({
				preAction: (form: HTMLFormElement) => {
					setFormValues(form, { enabled: 'no', })
				},
				action: (cy: any) => cy.get('[type="submit"]'),
				test: (form: HTMLFormElement, submitter: any, search: any) => {
					const values = getFormValues(form, { submitter })
					expect(values['enabled']).not.toBe('on');
				},
				expectedStaticValue: '',
			});
		});

		it('should uncheck for string "off"', () => {
			utils.test({
				preAction: (form: HTMLFormElement) => {
					setFormValues(form, { enabled: 'off', })
				},
				action: (cy: any) => cy.get('[type="submit"]'),
				test: (form: HTMLFormElement, submitter: any, search: any) => {
					const values = getFormValues(form, { submitter })
					expect(values['enabled']).not.toBe('on');
				},
				expectedStaticValue: '',
			});
		});

		it('should check for number "1"', () => {
			utils.test({
				preAction: (form: HTMLFormElement) => {
					setFormValues(form, { enabled: 1, })
				},
				action: (cy: any) => cy.get('[type="submit"]'),
				test: (form: HTMLFormElement, submitter: any, search: any) => {
					const values = getFormValues(form, { submitter })
					expect(values['enabled']).toBe('on');
				},
				expectedStaticValue: 'enabled=on',
			});
		});

		it('should check for string "1"', () => {
			utils.test({
				preAction: (form: HTMLFormElement) => {
					setFormValues(form, { enabled: '1', })
				},
				action: (cy: any) => cy.get('[type="submit"]'),
				test: (form: HTMLFormElement, submitter: any, search: any) => {
					const values = getFormValues(form, { submitter })
					expect(values['enabled']).toBe('on');
				},
				expectedStaticValue: 'enabled=on',
			});
		});

		it('should uncheck for number "0"', () => {
			utils.test({
				preAction: (form: HTMLFormElement) => {
					setFormValues(form, { enabled: 0, })
				},
				action: (cy: any) => cy.get('[type="submit"]'),
				test: (form: HTMLFormElement, submitter: any, search: any) => {
					const values = getFormValues(form, { submitter })
					expect(values['enabled']).not.toBe('on');
				},
				expectedStaticValue: '',
			});
		});

		it('should uncheck for string "0"', () => {
			utils.test({
				preAction: (form: HTMLFormElement) => {
					setFormValues(form, { enabled: '0', })
				},
				action: (cy: any) => cy.get('[type="submit"]'),
				test: (form: HTMLFormElement, submitter: any, search: any) => {
					const values = getFormValues(form, { submitter })
					expect(values['enabled']).not.toBe('on');
				},
				expectedStaticValue: '',
			});
		});

		it('should uncheck for object "null"', () => {
			utils.test({
				preAction: (form: HTMLFormElement) => {
					setFormValues(form, { enabled: null, })
				},
				action: (cy: any) => cy.get('[type="submit"]'),
				test: (form: HTMLFormElement, submitter: any, search: any) => {
					const values = getFormValues(form, { submitter })
					expect(values['enabled']).not.toBe('on');
				},
				expectedStaticValue: '',
			});
		});

		it('should uncheck for string "null"', () => {
			utils.test({
				preAction: (form: HTMLFormElement) => {
					setFormValues(form, { enabled: 'null', })
				},
				action: (cy: any) => cy.get('[type="submit"]'),
				test: (form: HTMLFormElement, submitter: any, search: any) => {
					const values = getFormValues(form, { submitter })
					expect(values['enabled']).not.toBe('on');
				},
				expectedStaticValue: '',
			});
		});
	});
});
