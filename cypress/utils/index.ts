/// <reference types="cypress" />

import JSDOMDummyCypress from './jsdom-compat'

type ExpectedSearchValue = any

type RetrieveSubmitterFn = (wrapper: typeof cy | JSDOMDummyCypress) => any

type HTMLSubmitterElement = HTMLButtonElement | HTMLInputElement

type TestFn = (form: HTMLFormElement, submitter?: HTMLSubmitterElement, after?: ExpectedSearchValue) => unknown

export const setup = (template: string) => {
	if (typeof cy !== 'undefined') {
		return () => {
			cy.intercept({ url: '/' }, { body: template }).as('loaded');
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
	querySubmitter: RetrieveSubmitterFn,
	onSubmitted?: TestFn,
	expectedStaticValue?: ExpectedSearchValue,
	onLoaded?: TestFn,
	onBeforeSubmit?: RetrieveSubmitterFn,
}

export const test = (options: TestOptions) => {
	const {
		querySubmitter,
		onSubmitted,
		expectedStaticValue,
		onLoaded,
		onBeforeSubmit,
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

				onLoaded?.(form);
			})

		onBeforeSubmit?.(cy);
		r = querySubmitter(cy).then((submitterQueryEl: any) => {
			[submitter] = Array.from(submitterQueryEl as any[])
		})

		if (typeof expectedStaticValue !== 'undefined') {
			r.click()
			cy
				.wait('@submitted')
				.location('search')
				.then((search: any) => {
					setTimeout(() => {
						onSubmitted?.(form, submitter, search)
					}, 0)
				})
		} else {
			cy
				.location('search')
				.then((search: any) => {
					setTimeout(() => {
						onSubmitted?.(form, submitter, search)
					}, 0);
				})
		}
	} else {
		const jsdomCy = new JSDOMDummyCypress()
		onBeforeSubmit?.(jsdomCy);
		r = querySubmitter(jsdomCy)
			.then((submitterQueryEl: any) => {
				[submitter] = Array.from(submitterQueryEl as any[]);
				[form] = Array.from(window.document.getElementsByTagName('form'))

				onLoaded?.(form);
				onSubmitted?.(form, submitter, expectedStaticValue)
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
						if (typeof v === 'object' && v.__proto__.constructor.name === 'TextualValueString') {
							beforeSearchParams.append(key, v);
							const vStr = v as Record<string, string>;
							beforeSearchParams.append(vStr.dirName, vStr.dir);
							return;
						}

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
