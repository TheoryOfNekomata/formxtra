/// <reference types="node" />

import { readFileSync, statSync } from 'fs'
import { join, basename } from 'path'

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
			if (el.type === 'datetime-local') {
				el.value = new Date(`${s}:00.000Z`).toISOString().slice(0, 'yyyy-MM-DDTHH:mm'.length)
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

	invoke(key: string, value: unknown) {
		if (key === 'val') {
			this.selectedElements.forEach((el) => (el as unknown as Record<string, unknown>).valueAsNumber = value);
		}

		return this
	}

	trigger(which: string) {
		return this
	}

	attachFile(filename: string | string[]) {
		const { File, FileList } = window;
		const theFilenames = Array.isArray(filename) ? filename : [filename];
		const theFiles = theFilenames.map((f) => {
			const filePath = join('cypress', 'fixtures', f);
			const { mtimeMs: lastModified } = statSync(filePath);
			const contents = readFileSync(filePath);
			return new File(
				[contents],
				basename(filePath),
				{
					lastModified,
					type: '',
				},
			);
		});
		(theFiles as unknown as Record<string, unknown>).__proto__ = Object.create(FileList.prototype);
		this.selectedElements.forEach((el) => {
			Object.defineProperty(el, 'files', {
				value: theFiles,
				writable: false,
			})
		});
		return this;
	}
}

export default class JSDOMDummyCypress {
	private currentElement = window.document;

	wait(time: number) {
		return this;
	}

	get(q: string) {
		return new JSDOMJQuery(this.currentElement.querySelectorAll(q));
	}
}
