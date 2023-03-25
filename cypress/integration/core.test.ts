import getFormValuesDeprecated, {
	getFormValues,
	setFormValues,
	isFieldElement,
	isElementValueIncludedInFormSubmit,
	getValue, clearFormValues,
} from '../../src';
import * as utils from '../utils'

describe('misc', () => {
	describe('core', () => {
		beforeEach(utils.setup(`
			<!DOCTYPE html>
			<html lang="en-PH">
				<head>
					<meta charset="UTF-8">
					<title>Misc/Core</title>
				</head>
				<body>
					<form>
						<button type="submit">Submit</button>
					</form>
				</body>
			</html>
		`))

		it('should call console.warn for deprecated default import usage', () => {
			utils.test({
				querySubmitter: (cy: any) => cy.get('[type="submit"]'),
				onSubmitted: (form: HTMLFormElement, submitter: any, search: any) => {
					let consoleWarnCalled = false
					const defaultConsoleWarn = console.warn
					console.warn = (...args: unknown[]) => {
						consoleWarnCalled = true
					};
					getFormValuesDeprecated(form, { submitter });
					expect(consoleWarnCalled).toBe(true);
					console.warn = defaultConsoleWarn;
				},
			});
		});

		it('should call noop for deprecated default import usage when console is not found', () => {
			utils.test({
				querySubmitter: (cy: any) => cy.get('[type="submit"]'),
				onSubmitted: (form: HTMLFormElement, submitter: any, search: any) => {
					let consoleWarnCalled = false
					const defaultConsoleWarn = console.warn
					console.warn = (...args: unknown[]) => {
						consoleWarnCalled = true
					};
					const globalConsole = global.console;
					global.console = undefined;
					getFormValuesDeprecated(form, { submitter });
					expect(consoleWarnCalled).toBe(false);
					global.console = globalConsole;
					console.warn = defaultConsoleWarn;
				},
			});
		});

		it('should throw an error when providing invalid argument type as form to getFormValues', () => {
			utils.test({
				querySubmitter: (cy: any) => cy.get('[type="submit"]'),
				onSubmitted: (form: HTMLFormElement, submitter: any, search: any) => {
					let isThrown = false;
					try {
						getFormValues(0 as unknown as HTMLFormElement, {});
					} catch {
						isThrown = true;
					}

					expect(isThrown).toBe(true);
				},
			});
		});

		it('should throw an error when providing null as form to getFormValues', () => {
			utils.test({
				querySubmitter: (cy: any) => cy.get('[type="submit"]'),
				onSubmitted: (form: HTMLFormElement, submitter: any, search: any) => {
					let isThrown = false;
					try {
						getFormValues(null as unknown as HTMLFormElement, {});
					} catch {
						isThrown = true;
					}

					expect(isThrown).toBe(true);
				},
			});
		});

		it('should throw an error when providing a different element type as form to getFormValues', () => {
			utils.test({
				querySubmitter: (cy: any) => cy.get('[type="submit"]'),
				onSubmitted: (form: HTMLFormElement, submitter: any, search: any) => {
					let isThrown = false;
					try {
						getFormValues(document.body as unknown as HTMLFormElement, {});
					} catch {
						isThrown = true;
					}

					expect(isThrown).toBe(true);
				},
			});
		});

		it('should throw an error when providing invalid argument type as form to setFormValues', () => {
			utils.test({
				querySubmitter: (cy: any) => cy.get('[type="submit"]'),
				onSubmitted: (form: HTMLFormElement, submitter: any, search: any) => {
					let isThrown = false;
					try {
						setFormValues(0 as unknown as HTMLFormElement, {});
					} catch {
						isThrown = true;
					}

					expect(isThrown).toBe(true);
				},
			});
		});

		it('should throw an error when providing null as form to setFormValues', () => {
			utils.test({
				querySubmitter: (cy: any) => cy.get('[type="submit"]'),
				onSubmitted: (form: HTMLFormElement, submitter: any, search: any) => {
					let isThrown = false;
					try {
						setFormValues(null as unknown as HTMLFormElement, {});
					} catch {
						isThrown = true;
					}

					expect(isThrown).toBe(true);
				},
			});
		});

		it('should throw an error when providing a different element type as form to setFormValues', () => {
			utils.test({
				querySubmitter: (cy: any) => cy.get('[type="submit"]'),
				onSubmitted: (form: HTMLFormElement, submitter: any, search: any) => {
					let isThrown = false;
					try {
						setFormValues(document.body as unknown as HTMLFormElement, {});
					} catch {
						isThrown = true;
					}

					expect(isThrown).toBe(true);
				},
			});
		});

		it('should throw an error when providing invalid argument type as values to setFormValues', () => {
			utils.test({
				querySubmitter: (cy: any) => cy.get('[type="submit"]'),
				onSubmitted: (form: HTMLFormElement, submitter: any, search: any) => {
					let isThrown = false;
					try {
						setFormValues(form, 0);
					} catch {
						isThrown = true;
					}

					expect(isThrown).toBe(true);
				},
			});
		});

		it('should not throw an error when providing null as form to setFormValues', () => {
			utils.test({
				querySubmitter: (cy: any) => cy.get('[type="submit"]'),
				onSubmitted: (form: HTMLFormElement, submitter: any, search: any) => {
					let isThrown = false;
					try {
						setFormValues(form, null);
					} catch (e) {
						isThrown = true;
					}

					expect(isThrown).toBe(false);
				},
			});
		});

		it('should throw an error when providing undefined as form to setFormValues', () => {
			utils.test({
				querySubmitter: (cy: any) => cy.get('[type="submit"]'),
				onSubmitted: (form: HTMLFormElement, submitter: any, search: any) => {
					let isThrown = false;
					try {
						setFormValues(form, undefined);
					} catch (e) {
						isThrown = true;
					}

					expect(isThrown).toBe(true);
				},
			});
		});
	});

	describe('isindex', () => {
		beforeEach(utils.setup(`
			<!DOCTYPE html>
			<html lang="en-PH">
				<head>
					<meta charset="UTF-8">
					<title>Misc/Isindex</title>
				</head>
				<body>
					<form>
						<input name="isindex" type="text" value="value" />
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

	describe('utilities', () => {
		beforeEach(utils.setup(`
			<!DOCTYPE html>
			<html lang="en-PH">
				<head>
					<meta charset="UTF-8">
					<title>Misc/Utilities</title>
				</head>
				<body>
					<form>
						<input id="input" type="text" name="foobar" />
						<input id="notField" type="text" />
						<input id="disabled" disabled type="text" name="disabled" />
						<meter id="meter" min="1" max="10" value="5" />
						<button type="submit">Submit</button>
					</form>
				</body>
			</html>
		`));

		it('should check for valid field elements value', () => {
			utils.test({
				querySubmitter: (cy: any) => cy.get('[type="submit"]'),
				onSubmitted: (form: HTMLFormElement, submitter: any, search: any) => {
					const meter = document.getElementById('meter');
					expect(getValue(meter)).toBe(5);
				},
			});
		});

		it('should check for invalid field elements value', () => {
			utils.test({
				querySubmitter: (cy: any) => cy.get('[type="submit"]'),
				onSubmitted: (form: HTMLFormElement, submitter: any, search: any) => {
					expect(getValue(document.body)).toBe(null);
				},
			});
		});

		it('should check for elements as included fields', () => {
			utils.test({
				querySubmitter: (cy: any) => cy.get('[type="submit"]'),
				onSubmitted: (form: HTMLFormElement, submitter: any, search: any) => {
					const input = document.getElementById('input');
					expect(isElementValueIncludedInFormSubmit(input)).toBe(true);
				},
			});
		});

		it('should check for elements as excluded fields', () => {
			utils.test({
				querySubmitter: (cy: any) => cy.get('[type="submit"]'),
				onSubmitted: (form: HTMLFormElement, submitter: any, search: any) => {
					const notField = document.getElementById('notField');
					expect(isElementValueIncludedInFormSubmit(notField)).toBe(false);
					const disabled = document.getElementById('disabled');
					expect(isElementValueIncludedInFormSubmit(disabled)).toBe(false);
					const meter = document.getElementById('meter');
					expect(isElementValueIncludedInFormSubmit(meter)).toBe(false);
				},
			});
		});

		it('should check for elements as valid for fields', () => {
			utils.test({
				querySubmitter: (cy: any) => cy.get('[type="submit"]'),
				onSubmitted: (form: HTMLFormElement, submitter: any, search: any) => {
					const input = document.getElementById('input');
					expect(isFieldElement(input)).toBe(true);
					const disabled = document.getElementById('disabled');
					expect(isFieldElement(disabled)).toBe(true);
				},
			});
		});

		it('should check for elements as invalid for fields', () => {
			utils.test({
				querySubmitter: (cy: any) => cy.get('[type="submit"]'),
				onSubmitted: (form: HTMLFormElement, submitter: any, search: any) => {
					const meter = document.getElementById('meter');
					expect(isFieldElement(meter)).toBe(false);
					const notField = document.getElementById('notField');
					expect(isFieldElement(notField)).toBe(false);
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
					<title>Misc/Blank</title>
				</head>
				<body>
					<form>
						<input type="text" name="foobar" />
						<input type="text" name="disabled" disabled />
						<button type="submit">Submit</button>
					</form>
				</body>
			</html>
		`))

		it('should parse string values for setFormValues', () => {
			utils.test({
				querySubmitter: (cy: any) => cy.get('[type="submit"]'),
				onSubmitted: (form: HTMLFormElement, submitter: any, search: any) => {
					let isThrown = false;
					try {
						setFormValues(form, 'foobar=baz');
					} catch (e) {
						isThrown = true;
					}

					expect(isThrown).toBe(false);
					expect(getFormValues(form)).toEqual({ foobar: 'baz', });
				},
			})
		});

		it('should parse entries values for setFormValues', () => {
			utils.test({
				querySubmitter: (cy: any) => cy.get('[type="submit"]'),
				onSubmitted: (form: HTMLFormElement, submitter: any, search: any) => {
					let isThrown = false;
					try {
						setFormValues(form, [['foobar', 'baz']]);
					} catch (e) {
						isThrown = true;
					}

					expect(isThrown).toBe(false);
					expect(getFormValues(form)).toEqual({ foobar: 'baz', });
				},
			})
		});

		it('should parse URLSearchParams values for setFormValues', () => {
			utils.test({
				querySubmitter: (cy: any) => cy.get('[type="submit"]'),
				onSubmitted: (form: HTMLFormElement, submitter: any, search: any) => {
					let isThrown = false;
					try {
						setFormValues(form, new URLSearchParams('foobar=baz'));
					} catch (e) {
						isThrown = true;
					}

					expect(isThrown).toBe(false);
					expect(getFormValues(form)).toEqual({ foobar: 'baz', });
				},
			})
		});

		it('should parse object values for setFormValues', () => {
			utils.test({
				querySubmitter: (cy: any) => cy.get('[type="submit"]'),
				onSubmitted: (form: HTMLFormElement, submitter: any, search: any) => {
					let isThrown = false;
					try {
						setFormValues(form, { foobar: 'baz', });
					} catch (e) {
						isThrown = true;
					}

					expect(isThrown).toBe(false);
					expect(getFormValues(form)).toEqual({ foobar: 'baz', });
				},
			})
		});

		it('should allow setting values for disabled elements', () => {
			utils.test({
				querySubmitter: (cy: any) => cy.get('[type="submit"]'),
				onSubmitted: (form: HTMLFormElement, submitter: any, search: any) => {
					let isThrown = false;
					try {
						setFormValues(form, { foobar: 'baz', disabled: 'new value' }, { includeDisabled: true });
					} catch (e) {
						isThrown = true;
					}

					expect(isThrown).toBe(false);
					expect(getFormValues(form, { includeDisabled: true })).toEqual({ foobar: 'baz', disabled: 'new value', });
				},
			})
		});
	});


	describe('clearing values', () => {
		beforeEach(utils.setup(`
			<!DOCTYPE html>
			<html lang="en-PH">
				<head>
					<meta charset="UTF-8">
					<title>Misc/Blank</title>
				</head>
				<body>
					<form>
						<input type="text" name="foobar" value="value1" />
						<input type="text" name="foobar" value="value2" />
						<input type="text" name="baz" value="value3" />
						<input type="text" name="bar" value="value1" />
						<input type="text" name="bar" value="value2" />
						<input type="radio" name="foo" value="value1" checked />
						<input type="radio" name="foo" value="value2" />
						<input type="radio" name="foo" value="value3" />
						<input type="text" name="disabled" value="disabled" disabled />
						<button type="submit">Submit</button>
					</form>
				</body>
			</html>
		`));

		it('should clear all values given a single key', () => {
			utils.test({
				querySubmitter: (cy: any) => cy.get('[type="submit"]'),
				onSubmitted: (form: HTMLFormElement, submitter: any, search: any) => {
					clearFormValues(form, 'foobar');
					expect(getFormValues(form)).toEqual({ foobar: ['', ''], baz: 'value3', bar: ['value1', 'value2'], foo: 'value1', });
				},
			});
		});

		it('should clear all values given multiple keys', () => {
			utils.test({
				querySubmitter: (cy: any) => cy.get('[type="submit"]'),
				onSubmitted: (form: HTMLFormElement, submitter: any, search: any) => {
					clearFormValues(form, ['foobar', 'bar', 'foo']);
					expect(getFormValues(form)).toEqual({ foobar: ['', ''], baz: 'value3', bar: ['', ''], });
				},
			});
		});

		it('should clear all values given disabled option', () => {
			utils.test({
				querySubmitter: (cy: any) => cy.get('[type="submit"]'),
				onSubmitted: (form: HTMLFormElement, submitter: any, search: any) => {
					clearFormValues(form, ['foobar', 'bar', 'foo', 'disabled'], { includeDisabled: true });
					expect(getFormValues(form, { includeDisabled: true })).toEqual({
						foobar: ['', ''], baz: 'value3', bar: ['', ''],
						disabled: '',
					});
				},
			});
		});
	});

	describe('duplicates', () => {
		beforeEach(utils.setup(`
			<!DOCTYPE html>
			<html lang="en-PH">
				<head>
					<meta charset="UTF-8">
					<title>Misc/Blank</title>
				</head>
				<body>
					<form>
						<input type="text" name="foobar" />
						<input type="text" name="foobar" />
						<input type="text" name="foobar" />
						<button type="submit">Submit</button>
					</form>
				</body>
			</html>
		`));

		it('should parse duplicates correctly', () => {
			utils.test({
				onLoaded: (form: HTMLFormElement) => {
					setFormValues(form, { foobar: ['foo', 'bar', 'baz']})
				},
				querySubmitter: (cy: any) => cy.get('[type="submit"]'),
				onSubmitted: (form: HTMLFormElement, submitter: any, search: any) => {
					expect(getFormValues(form)).toEqual({ foobar: ['foo', 'bar', 'baz'], });
				},
			})
		});
	});
});
