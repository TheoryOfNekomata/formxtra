import { getFormValues, setFormValues } from '../../src';
import * as utils from '../utils'

describe('radio', () => {
	describe('basic', () => {
		beforeEach(utils.setup(`
			<!DOCTYPE html>
			<html lang="en-PH">
				<head>
					<meta charset="UTF-8">
					<title>Radio/Basic</title>
				</head>
				<body>
					<form>
						<label>
							<span>Hello</span>
							<input type="radio" name="enabled" />
						</label>
						<button type="submit">Submit</button>
					</form>
				</body>
			</html>
		`))

		it('should have no form values', () => {
			utils.test({
				querySubmitter: (cy: any) => cy.get('[type="submit"]'),
				onSubmitted: (form: HTMLFormElement, submitter: any, search: any) => {
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
	});

	describe('checked', () => {
		beforeEach(utils.setup(`
			<!DOCTYPE html>
			<html lang="en-PH">
				<head>
					<meta charset="UTF-8">
					<title>Radio/Checked</title>
				</head>
				<body>
					<form>
						<label>
							<span>Hello</span>
							<input type="radio" name="enabled" checked />
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
					<title>Radio/Duplicate</title>
				</head>
				<body>
					<form>
						<label>
							<span>Hello 1</span>
							<input type="radio" name="enabled" value="hello 1" checked />
						</label>
						<label>
							<span>Hello 2</span>
							<input type="radio" name="enabled" value="hello 2" checked />
						</label>
						<label>
							<span>Hello 3</span>
							<input type="radio" name="enabled" value="hello 3" />
						</label>
						<label>
							<span>Hello 4</span>
							<input type="radio" name="enabled" value="hello 4" />
						</label>
						<button type="submit">Submit</button>
					</form>
				</body>
			</html>
		`));

		it('should get last value as checked', () => {
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
					enabled: 'hello 2',
				},
			});
		});

		it('should set to last value', () => {
			utils.test({
				onLoaded: (form: HTMLFormElement) => {
					setFormValues(form, {
						enabled: ['hello 3', 'hello 4'],
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
					enabled: 'hello 4',
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
					<title>Radio/Setting Values</title>
				</head>
				<body>
					<form>
						<label>
							<span>Hello</span>
							<input type="radio" name="enabled" value="default" checked />
							<input type="radio" name="enabled" />
							<input type="radio" name="enabled" value="true" />
							<input type="radio" name="enabled" value="yes" />
							<input type="radio" name="enabled" value="1" />
							<input type="radio" name="enabled" value="false" />
							<input type="radio" name="enabled" value="no" />
							<input type="radio" name="enabled" value="off" />
							<input type="radio" name="enabled" value="0" />
							<input type="radio" name="enabled" value="null" />
						</label>
						<button type="submit">Submit</button>
					</form>
				</body>
			</html>
		`))

		it('should uncheck for boolean "true"', () => {
			utils.test({
				onLoaded: (form: HTMLFormElement) => {
					setFormValues(form, { enabled: true, })
				},
				querySubmitter: (cy: any) => cy.get('[type="submit"]'),
				onSubmitted: (form: HTMLFormElement, submitter: any, search: any) => {
					const values = getFormValues(form, { submitter })
					expect(values['enabled']).toBeUndefined()
				},
				expectedStaticValue: '',
			});
		});

		it('should check for string "true"', () => {
			utils.test({
				onLoaded: (form: HTMLFormElement) => {
					setFormValues(form, { enabled: 'true', })
				},
				querySubmitter: (cy: any) => cy.get('[type="submit"]'),
				onSubmitted: (form: HTMLFormElement, submitter: any, search: any) => {
					const values = getFormValues(form, { submitter })
					expect(values['enabled']).toBe('true');
				},
				expectedStaticValue: 'enabled=true',
			});
		});

		it('should check for string "yes"', () => {
			utils.test({
				onLoaded: (form: HTMLFormElement) => {
					setFormValues(form, { enabled: 'yes', })
				},
				querySubmitter: (cy: any) => cy.get('[type="submit"]'),
				onSubmitted: (form: HTMLFormElement, submitter: any, search: any) => {
					const values = getFormValues(form, { submitter })
					expect(values['enabled']).toBe('yes');
				},
				expectedStaticValue: 'enabled=yes',
			});
		});

		it('should check for string "on"', () => {
			utils.test({
				onLoaded: (form: HTMLFormElement) => {
					setFormValues(form, { enabled: 'on', })
				},
				querySubmitter: (cy: any) => cy.get('[type="submit"]'),
				onSubmitted: (form: HTMLFormElement, submitter: any, search: any) => {
					const values = getFormValues(form, { submitter })
					expect(values['enabled']).toBe('on');
				},
				expectedStaticValue: 'enabled=on',
			});
		});

		it('should uncheck for boolean "false"', () => {
			utils.test({
				onLoaded: (form: HTMLFormElement) => {
					setFormValues(form, { enabled: false, })
				},
				querySubmitter: (cy: any) => cy.get('[type="submit"]'),
				onSubmitted: (form: HTMLFormElement, submitter: any, search: any) => {
					const values = getFormValues(form, { submitter })
					expect(values['enabled']).toBeUndefined()
				},
				expectedStaticValue: '',
			});
		});

		it('should check for string "false"', () => {
			utils.test({
				onLoaded: (form: HTMLFormElement) => {
					setFormValues(form, { enabled: 'false', })
				},
				querySubmitter: (cy: any) => cy.get('[type="submit"]'),
				onSubmitted: (form: HTMLFormElement, submitter: any, search: any) => {
					const values = getFormValues(form, { submitter })
					expect(values['enabled']).toBe('false');
				},
				expectedStaticValue: 'enabled=false',
			});
		});

		it('should check for string "no"', () => {
			utils.test({
				onLoaded: (form: HTMLFormElement) => {
					setFormValues(form, { enabled: 'no', })
				},
				querySubmitter: (cy: any) => cy.get('[type="submit"]'),
				onSubmitted: (form: HTMLFormElement, submitter: any, search: any) => {
					const values = getFormValues(form, { submitter })
					expect(values['enabled']).toBe('no')
				},
				expectedStaticValue: 'enabled=no',
			});
		});

		it('should check for string "off"', () => {
			utils.test({
				onLoaded: (form: HTMLFormElement) => {
					setFormValues(form, { enabled: 'off', })
				},
				querySubmitter: (cy: any) => cy.get('[type="submit"]'),
				onSubmitted: (form: HTMLFormElement, submitter: any, search: any) => {
					const values = getFormValues(form, { submitter })
					expect(values['enabled']).toBe('off');
				},
				expectedStaticValue: 'enabled=off',
			});
		});

		it('should uncheck for number "1"', () => {
			utils.test({
				onLoaded: (form: HTMLFormElement) => {
					setFormValues(form, { enabled: 1, })
				},
				querySubmitter: (cy: any) => cy.get('[type="submit"]'),
				onSubmitted: (form: HTMLFormElement, submitter: any, search: any) => {
					const values = getFormValues(form, { submitter })
					expect(values['enabled']).toBeUndefined();
				},
				expectedStaticValue: '',
			});
		});

		it('should check for string "1"', () => {
			utils.test({
				onLoaded: (form: HTMLFormElement) => {
					setFormValues(form, { enabled: '1', })
				},
				querySubmitter: (cy: any) => cy.get('[type="submit"]'),
				onSubmitted: (form: HTMLFormElement, submitter: any, search: any) => {
					const values = getFormValues(form, { submitter })
					expect(values['enabled']).toBe('1');
				},
				expectedStaticValue: 'enabled=1',
			});
		});

		it('should uncheck for number "0"', () => {
			utils.test({
				onLoaded: (form: HTMLFormElement) => {
					setFormValues(form, { enabled: 0, })
				},
				querySubmitter: (cy: any) => cy.get('[type="submit"]'),
				onSubmitted: (form: HTMLFormElement, submitter: any, search: any) => {
					const values = getFormValues(form, { submitter })
					expect(values['enabled']).toBeUndefined()
				},
				expectedStaticValue: '',
			});
		});

		it('should check for string "0"', () => {
			utils.test({
				onLoaded: (form: HTMLFormElement) => {
					setFormValues(form, { enabled: '0', })
				},
				querySubmitter: (cy: any) => cy.get('[type="submit"]'),
				onSubmitted: (form: HTMLFormElement, submitter: any, search: any) => {
					const values = getFormValues(form, { submitter })
					expect(values['enabled']).toBe('0')
				},
				expectedStaticValue: 'enabled=0',
			});
		});

		it('should uncheck for object "null"', () => {
			utils.test({
				onLoaded: (form: HTMLFormElement) => {
					setFormValues(form, { enabled: null, })
				},
				querySubmitter: (cy: any) => cy.get('[type="submit"]'),
				onSubmitted: (form: HTMLFormElement, submitter: any, search: any) => {
					const values = getFormValues(form, { submitter })
					expect(values['enabled']).toBeUndefined()
				},
				expectedStaticValue: '',
			});
		});

		it('should check for string "null"', () => {
			utils.test({
				onLoaded: (form: HTMLFormElement) => {
					setFormValues(form, { enabled: 'null', })
				},
				querySubmitter: (cy: any) => cy.get('[type="submit"]'),
				onSubmitted: (form: HTMLFormElement, submitter: any, search: any) => {
					const values = getFormValues(form, { submitter })
					expect(values['enabled']).toBe('null');
				},
				expectedStaticValue: 'null',
			});
		});

		it('should check for boolean "true"', () => {
			utils.test({
				onLoaded: (form: HTMLFormElement) => {
					setFormValues(form, { enabled: true, })
				},
				querySubmitter: (cy: any) => cy.get('[type="submit"]'),
				onSubmitted: (form: HTMLFormElement, submitter: any, search: any) => {
					const values = getFormValues(form, { submitter })
					expect(values['enabled']).toBeUndefined()
				},
				expectedStaticValue: '',
			});
		});

		it('should check valueless radio for last value on', () => {
			utils.test({
				onLoaded: (form: HTMLFormElement) => {
					setFormValues(form, { enabled: ['foo', 'bar', 'baz', 'on'], })
				},
				querySubmitter: (cy: any) => cy.get('[type="submit"]'),
				onSubmitted: (form: HTMLFormElement, submitter: any, search: any) => {
					const values = getFormValues(form, { submitter })
					expect(values['enabled']).toBe('on')
				},
				expectedStaticValue: 'enabled=on',
			});
		});

		it('should check radio with value for last value', () => {
			utils.test({
				onLoaded: (form: HTMLFormElement) => {
					setFormValues(form, { enabled: ['foo', 'bar', 'baz', 'on', 'default', 'true'], })
				},
				querySubmitter: (cy: any) => cy.get('[type="submit"]'),
				onSubmitted: (form: HTMLFormElement, submitter: any, search: any) => {
					const values = getFormValues(form, { submitter })
					expect(values['enabled']).toBe('true')
				},
				expectedStaticValue: 'enabled=true',
			});
		});
	});
});
