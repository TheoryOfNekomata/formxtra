import { getFormValues, setFormValues } from '../../src';
import * as utils from '../utils'

describe('file', () => {
	describe('single', () => {
		beforeEach(utils.setup(`
			<!DOCTYPE html>
			<html lang="en-PH">
				<head>
					<meta charset="UTF-8">
					<title>File/Single</title>
				</head>
				<body>
					<form>
						<label>
							<span>Hello</span>
							<input type="file" name="hello" />
						</label>
						<button type="submit">Submit</button>
					</form>
				</body>
			</html>
		`))

		it('should have no form values when no file is selected', () => {
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
					hello: ''
				},
			});
		})

		it('should have single form value when a file is selected', () => {
			utils.test({
				onBeforeSubmit: (cy) => {
					cy
						.get('[name="hello"]')
						.attachFile('uploads/data.json')
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
					hello: 'data.json',
				},
			});
		})

		it('should retrieve the file list upon setting appropriate option', () => {
			utils.test({
				onBeforeSubmit: (cy: any) => {
					cy
						.get('[name="hello"]')
						.attachFile('uploads/data.json')
				},
				querySubmitter: (cy: any) => cy.get('[type="submit"]'),
				onSubmitted: (form: HTMLFormElement, submitter: any) => {
					const formValues = getFormValues(form,
						{
							submitter,
							getFileObjects: true
						}
					)
					expect(formValues.hello[0].name)
						.toBe('data.json')
				},
			});
		})

		it('should do nothing when attempting to set the value of the file', () => {
			utils.test({
				onLoaded: (form: HTMLFormElement) => {
					setFormValues(form, { hello: 'data.json' });
				},
				querySubmitter: (cy: any) => cy.get('[type="submit"]'),
				onSubmitted: (form: HTMLFormElement, submitter: any) => {
					const formValues = getFormValues(
						form,
						{
							submitter,
							getFileObjects: true
						}
					)
					expect(formValues.hello).toBeDefined()
				},
				expectedStaticValue: {},
			});
		});
	})

	describe('multiple', () => {
		beforeEach(utils.setup(`
			<!DOCTYPE html>
			<html lang="en-PH">
				<head>
					<meta charset="UTF-8">
					<title>File/Multiple</title>
				</head>
				<body>
					<form>
						<label>
							<span>Hello</span>
							<input type="file" name="hello" multiple />
						</label>
						<button type="submit">Submit</button>
					</form>
				</body>
			</html>
		`))

		it('should have no form values when no file is selected', () => {
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
					hello: '',
				},
			});
		})

		it('should have single form value when a file is selected', () => {
			utils.test({
				onBeforeSubmit: (cy: any) => {
					cy
						.get('[name="hello"]')
						.attachFile(['uploads/data.json', 'uploads/data2.json'])
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
				expectedStaticValue: 'hello=data.json&hello=data2.json',
			});
		})

		it('should retrieve the file list upon setting appropriate option', () => {
			utils.test({
				onBeforeSubmit: (cy: any) => {
					cy
						.get('[name="hello"]')
						.attachFile(['uploads/data.json', 'uploads/data2.json'])
				},
				querySubmitter: (cy: any) => cy.get('[type="submit"]'),
				onSubmitted: (form: HTMLFormElement, submitter: any) => {
					const formValues = getFormValues(form,
						{
							submitter,
							getFileObjects: true
						}
					)
					expect(formValues.hello[0].name)
						.toBe('data.json')
					expect(formValues.hello[1].name)
						.toBe('data2.json')
				},
			});
		})
	})
})
