/// <reference types="cypress" />
/// <reference types="cypress-jest-adapter" />
/// <reference types="node" />

import * as fs from 'fs'
import * as path from 'path'

type TestFn = (form: HTMLFormElement, submitter: HTMLButtonElement | HTMLInputElement, after: Record<string, string> | string) => unknown

class JSDOMJQuery {
	private selectedElements: Node[]
	constructor(elements: NodeList) {
		this.selectedElements = Array.from(elements)
	}

	type(s: string) {
		this.selectedElements.forEach((el: any) => {
			if (el.tagName === 'TEXTAREA') {
				el.innerText = s
				el.value = s
				return
			}
			el.setAttribute('value', s)
			el.value = s
		})
		return this
	}

	check() {
		this.selectedElements.forEach((el: any) => {
			el.setAttribute('checked', '')
			el.checked = true
		})
		return this
	}

	select(v: string) {
		this.selectedElements.forEach((el: any) => {
			const option: any = Array.from(el.querySelectorAll('option')).find((o: any) => o.textContent === v)
			option.setAttribute('selected', '')
			el.value = option.value
		})
		return this
	}

	last() {
		this.selectedElements = this.selectedElements.slice(-1)
		return this
	}

	then(fn: (...args: unknown[]) => unknown) {
		fn(this.selectedElements)
		return this
	}

	click() {
		return this
	}

	submit() {
		return this
	}
}

class JSDOMDummyCypress {
	private currentElement = window.document;

	get(q: string) {
		return new JSDOMJQuery(this.currentElement.querySelectorAll(q));
	}
}

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
		window.document.open(undefined, undefined, undefined, true)
		window.document.write(templateRaw.toString('utf-8'))
		window.document.close()
	}
}

export const test = (retrieveSubmitterFn: (wrapper: any) => any, testFn: TestFn, expectedValue: Record<string, string> | string) => {
	let form: HTMLFormElement
	let submitter: HTMLButtonElement | HTMLInputElement
	if (typeof cy !== 'undefined') {
		cy
			.visit('/')
			.get('form')
			.then((formResult: any) => {
				[form] = Array.from(formResult);
			})

		retrieveSubmitterFn(cy)
			.then((submitterQueryEl: any) => {
				[submitter] = Array.from(submitterQueryEl as any[])
			})
			.click()

		cy
			.wait('@submitted')
			.location('search')
			.then(search => {
				testFn(form, submitter, search)
			})
	} else {
		retrieveSubmitterFn(new JSDOMDummyCypress())
			.then((submitterQueryEl: any) => {
				[submitter] = Array.from(submitterQueryEl as any[]);
				[form] = Array.from(window.document.getElementsByTagName('form'))
				testFn(form, submitter, expectedValue)
			})
			.click();
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
