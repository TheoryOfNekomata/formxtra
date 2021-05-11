/// <reference types="cypress" />
/// <reference types="cypress-jest-adapter" />

import fs from 'fs'
import path from 'path'

type TestFn = (form: HTMLFormElement, after: Record<string, string> | string) => unknown

export const setup = (template: string) => {
	if (typeof cy !== 'undefined') {
		return () => {
			cy.intercept({ url: '/' }, { fixture: `templates/${template}.html` });
			cy.intercept({ url: '/?*' }, { fixture: `templates/${template}.html` }).as('submitted');
		}
	}
	return async () => {
		const templatePath = path.join('test', 'fixtures', 'templates', `${template}.html`)
		const templateRaw = await fs.promises.readFile(templatePath)
		window.document.open()
		window.document.write(templateRaw.toString('utf-8'))
		window.document.close()
	}
}

export const test = (opFn: (wrapper: any) => unknown, testFn: TestFn, expectedValue: Record<string, string> | string) => {
	let form: HTMLFormElement
	if (typeof cy !== 'undefined') {
		cy
			.visit('/')
			.get('form')
			.then((formResult) => {
				[form] = Array.from(formResult);
			})

		opFn(cy)

		cy
			.wait('@submitted')
			.location('search')
			.then(search => {
				testFn(form, search)
			})
	} else {
		[form] = Array.from(window.document.getElementsByTagName('form'))
		testFn(form, expectedValue)
	}
}

export const makeSearchParams = (beforeValues: Record<string, unknown> | string) => {
	switch (typeof (beforeValues as unknown)) {
	case 'string':
		return new URLSearchParams(beforeValues as string)
	case 'object':
		return Object
			.entries(beforeValues)
			.reduce(
				(beforeSearchParams, [key, value]) => {
					const theValue = !Array.isArray(value) ? [value] : value
					theValue.forEach(v => {
						beforeSearchParams.append(key, v)
					})
					return beforeSearchParams
				},
				new URLSearchParams()
			)
	default:
		break
	}
	throw new TypeError('Invalid parameter.')
}
