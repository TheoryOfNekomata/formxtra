/// <reference types="node" />

import { readFileSync } from 'fs'
import { join } from 'path'

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

	attachFile(filename: string) {
		const contents = readFileSync(join('cypress', 'fixtures', filename))
		// TODO
		contents.toString('binary')
		return this
	}
}

export default class JSDOMDummyCypress {
	private currentElement = window.document;

	get(q: string) {
		return new JSDOMJQuery(this.currentElement.querySelectorAll(q));
	}
}
