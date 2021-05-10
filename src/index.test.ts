import * as fixtures from '../test/utils'
import getFormValues from '.'
import {DOMWindow, JSDOM} from 'jsdom';

describe('blank template', () => {
	let window: DOMWindow
	beforeEach(async () => {
		window = new JSDOM(await fixtures.loadTemplate('blank')).window
	})
	it('should have blank form value', () => {
		const [form] = Array.from(window.document.getElementsByTagName('form'))
		const values = getFormValues(form)
		expect(values).toEqual({})
	})
})

describe('single input template', () => {
	let window: DOMWindow
	beforeEach(async () => {
		window = new JSDOM(await fixtures.loadTemplate('single-input')).window
	})
	it('should have a single form value', () => {
		const [form] = Array.from(window.document.getElementsByTagName('form'))
		const values = getFormValues(form)
		expect(values).toEqual({ hello: 'Hi' })
	})
})

describe('single disabled input template', () => {
	let window: DOMWindow
	beforeEach(async () => {
		window = new JSDOM(await fixtures.loadTemplate('single-disabled-input')).window
	})
	it('should have blank form value', () => {
		const [form] = Array.from(window.document.getElementsByTagName('form'))
		const values = getFormValues(form)
		expect(values).toEqual({})
	})
})

describe('single readonly input template', () => {
	let window: DOMWindow
	beforeEach(async () => {
		window = new JSDOM(await fixtures.loadTemplate('single-readonly-input')).window
	})
	it('should have a single form value', () => {
		const [form] = Array.from(window.document.getElementsByTagName('form'))
		const values = getFormValues(form)
		expect(values).toEqual({ hello: 'Hi' })
	})
})

describe('single input with double button submitters template', () => {
	let window: DOMWindow
	beforeEach(async () => {
		window = new JSDOM(await fixtures.loadTemplate('single-input-with-double-button-submitters')).window
	})
	it('should have a single form value', () => {
		const [form] = Array.from(window.document.getElementsByTagName('form'))
		const values = getFormValues(form)
		expect(values).toEqual({ hello: 'Hi' })
	})

	it('should include the submitter\'s value when provided', () => {
		const [form] = Array.from(window.document.getElementsByTagName('form'))
		const [submitter] = Array.from(window.document.getElementsByTagName('button'))
		const values = getFormValues(form, submitter)
		expect(values).toEqual({ hello: 'Hi', [submitter.name]: submitter.value })
	})
})

describe('single input with double input submitters template', () => {
	let window: DOMWindow
	beforeEach(async () => {
		window = new JSDOM(await fixtures.loadTemplate('single-input-with-double-input-submitters')).window
	})

	it('should have a single form value', () => {
		const [form] = Array.from(window.document.getElementsByTagName('form'))
		const values = getFormValues(form)
		expect(values).toEqual({ hello: 'Hi' })
	})

	it('should include the submitter\'s value when provided', () => {
		const [form] = Array.from(window.document.getElementsByTagName('form'))
		const [,submitter] = Array.from(window.document.getElementsByTagName('input')).filter(i => i.type === 'submit')
		const values = getFormValues(form, submitter)
		expect(values).toEqual({ hello: 'Hi', [submitter.name]: submitter.value })
	})
})
