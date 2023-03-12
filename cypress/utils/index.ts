/// <reference types="cypress" />

import JSDOMDummyCypress from './jsdom-compat'

type ExpectedSearchValue = any

type RetrieveSubmitterFn = (wrapper: typeof cy | JSDOMDummyCypress) => any

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
		// @ts-ignore
		window.document.open(undefined, undefined, undefined, true)
		window.document.write(template)
		window.document.close()
	}
}

type TestOptions = {
	action: RetrieveSubmitterFn,
	test: TestFn,
	expectedStaticValue?: ExpectedSearchValue,
	preAction?: Function,
}

export const test = (options: TestOptions) => {
	const {
		action: retrieveSubmitterFn,
		test: testFn,
		expectedStaticValue,
		preAction,
	} = options;
	let form: HTMLFormElement
	let submitter: HTMLButtonElement | HTMLInputElement
	let r: any
	if (typeof cy !== 'undefined') {
		cy
			.visit('/')
			.get('form')
			.then((formResult: any) => {
				[form] = Array.from(formResult);

				if (typeof preAction === 'function') {
					preAction(form);
				}
			})

		r = retrieveSubmitterFn(cy)
			.then((submitterQueryEl: any) => {
				[submitter] = Array.from(submitterQueryEl as any[])
			})

		if (typeof expectedStaticValue !== 'undefined') {
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

				if (typeof preAction === 'function') {
					preAction(form);
				}

				testFn(form, submitter, expectedStaticValue)
			})

		if (typeof expectedStaticValue !== 'undefined') {
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
						let processedLineBreaks = v
						if (typeof cy !== 'undefined' && typeof v === 'string') {
							let forceLineBreaks: string;

							// TODO make this foolproof
							if (navigator.platform.indexOf("Mac") === 0 ||
								navigator.platform === "iPhone") {
								forceLineBreaks = '\n';
							} else if (navigator.platform === 'Win32') {
								forceLineBreaks = '\r\n';
							}
							processedLineBreaks = processedLineBreaks
								.replace(/(\r\n|\r|\n)/g, forceLineBreaks)
						}
						beforeSearchParams.append(key, processedLineBreaks)
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
