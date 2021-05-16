/// <reference types="cypress" />

import JSDOMDummyCypress from './jsdom-compat'

type ExpectedSearchValue = Record<string, string> | string

type RetrieveSubmitterFn = (wrapper: any) => any

type HTMLSubmitterElement = HTMLButtonElement | HTMLInputElement

type TestFn = (form: HTMLFormElement, submitter: HTMLSubmitterElement, after: ExpectedSearchValue) => unknown

export const setup = (template: string) => {
	if (typeof cy !== 'undefined') {
		return () => {
			cy.intercept({ url: '/' }, { body: template });
			cy.intercept({ url: '/?*' }, { body: template }).as('submitted');
		}
	}
	return () => {
		window.document.open(undefined, undefined, undefined, true)
		window.document.write(template)
		window.document.close()
	}
}

export const test = (retrieveSubmitterFn: RetrieveSubmitterFn, testFn: TestFn, expectedValue?: ExpectedSearchValue) => {
	let form: HTMLFormElement
	let submitter: HTMLButtonElement | HTMLInputElement
	let r: any
	if (typeof cy !== 'undefined') {
		cy
			.visit('/')
			.get('form')
			.then((formResult: any) => {
				[form] = Array.from(formResult);
			})

		r = retrieveSubmitterFn(cy)
			.then((submitterQueryEl: any) => {
				[submitter] = Array.from(submitterQueryEl as any[])
			})

		if (typeof expectedValue !== 'undefined') {
			r.click()
			cy
				.wait('@submitted')
				.location('search')
				.then((search: any) => {
					testFn(form, submitter, search)
				})
		} else {
			cy
				.location('search')
				.then((search: any) => {
					testFn(form, submitter, search)
				})
		}
	} else {
		r = retrieveSubmitterFn(new JSDOMDummyCypress())
			.then((submitterQueryEl: any) => {
				[submitter] = Array.from(submitterQueryEl as any[]);
				[form] = Array.from(window.document.getElementsByTagName('form'))
				testFn(form, submitter, expectedValue)
			})

		if (typeof expectedValue !== 'undefined') {
			r.click()
		}
	}
}

export const makeSearchParams = (beforeValues: Record<string, unknown> | string) => {
	switch (typeof (beforeValues as unknown)) {
	case 'string':
		return new URLSearchParams(beforeValues as string)
	case 'object':
		return Object
			.entries(beforeValues)
			.filter(([k]) => k.trim().length > 0)
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
