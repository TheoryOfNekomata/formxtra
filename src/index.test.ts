import * as fixtures from '../test/fixtures'
import getFormValues from '.'

describe('blank template', () => {
	let window: fixtures.Window
	beforeEach(async () => {
		window = await fixtures.loadTemplate('blank')
	})
	it('should have blank form value', () => {
		const [form] = Array.from(window.document.getElementsByTagName('form'))
		const values = getFormValues(form)
		expect(values).toEqual({})
	})
})

describe('single input template', () => {
	let window: fixtures.Window
	beforeEach(async () => {
		window = await fixtures.loadTemplate('single-input')
	})
	it('should have a single form value', () => {
		const [form] = Array.from(window.document.getElementsByTagName('form'))
		const values = getFormValues(form)
		expect(values).toEqual({ hello: 'Hi' })
	})
})

describe('single disabled input template', () => {
	let window: fixtures.Window
	beforeEach(async () => {
		window = await fixtures.loadTemplate('single-disabled-input')
	})
	it('should have blank form value', () => {
		const [form] = Array.from(window.document.getElementsByTagName('form'))
		const values = getFormValues(form)
		expect(values).toEqual({})
	})
})

describe('single readonly input template', () => {
	let window: fixtures.Window
	beforeEach(async () => {
		window = await fixtures.loadTemplate('single-readonly-input')
	})
	it('should have a single form value', () => {
		const [form] = Array.from(window.document.getElementsByTagName('form'))
		const values = getFormValues(form)
		expect(values).toEqual({ hello: 'Hi' })
	})
})

describe('single input with double submitters template', () => {
	let window: fixtures.Window
	beforeEach(async () => {
		window = await fixtures.loadTemplate('single-input-with-double-submitters')
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
	let window: fixtures.Window
	beforeEach(async () => {
		window = await fixtures.loadTemplate('single-input-with-double-input-submitters')
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
