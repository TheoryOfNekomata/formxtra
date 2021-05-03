type HTMLFieldElement
	= HTMLInputElement
	| HTMLButtonElement
	| HTMLSelectElement
	| HTMLTextAreaElement

type FieldNode
	= RadioNodeList
	| HTMLFieldElement

type HTMLSubmitterElement
	= HTMLButtonElement
	| HTMLInputElement

const isFormFieldElement = (el: FieldNode) => {
	if ((el as unknown) instanceof RadioNodeList) {
		return true
	}
	const htmlEl = el as HTMLElement
	const tagName = htmlEl.tagName.toLowerCase()
	if (['SELECT', 'TEXTAREA', 'BUTTON'].includes(tagName)) {
		return true
	}
	if (tagName !== 'INPUT') {
		return false
	}
	const inputEl = htmlEl as HTMLInputElement
	const type = inputEl.type.toLowerCase()
	const checkedValue = inputEl.getAttribute('value')
	if (type === 'checkbox' && checkedValue !== null) {
		return inputEl.checked
	}
	return Boolean(inputEl.name)
}

const isValidFieldNode = (submitter?: HTMLSubmitterElement) => (fieldNode: Node) => {
	const fieldEl = fieldNode as HTMLElement
	const fieldElTagName = fieldEl.tagName

	if (fieldElTagName === 'BUTTON' && Boolean(submitter as HTMLSubmitterElement)) {
		const buttonEl = fieldEl as HTMLButtonElement
		if (buttonEl.type === 'reset' || buttonEl.type === 'button') {
			return false
		}

		return (
			buttonEl.name === submitter!.name
			&& buttonEl.value === submitter!.value
		)
	}

	if (fieldElTagName === 'INPUT') {
		const inputEl = fieldEl as HTMLInputElement
		if (inputEl.type === 'radio') {
			return inputEl.checked
		}

		if (inputEl.type === 'submit' && Boolean(submitter as HTMLSubmitterElement)) {
			return (
				inputEl.name === submitter!.name
				&& inputEl.value === submitter!.value
			)
		}

		if (inputEl.type === 'reset' || inputEl.type === 'button') {
			return false
		}
	}

	return true
}

const getRadioNodeListResolvedValue = (radioNodeList: RadioNodeList, submitter?: HTMLSubmitterElement) => {
	const isValid = isValidFieldNode(submitter)
	const validFieldElements: Node[] = Array.from(radioNodeList).filter(isValid)

	if (validFieldElements.length > 1) {
		return validFieldElements.map((fieldNode: Node) => (fieldNode as HTMLFieldElement).value)
	}

	if (validFieldElements.length > 0) {
		const [validFieldElement] = (validFieldElements as HTMLFieldElement[])
		if (validFieldElement) {
			return validFieldElement.value
		}
	}

	return null
}

/**
 * Gets the value of a field element.
 * @param el - The field element node.
 * @param submitter - The element which triggered the enclosing form's submit event, if said form is submitted.
 */
const getFieldValue = (el: FieldNode, submitter?: HTMLSubmitterElement) => {
	if ((el as unknown) instanceof RadioNodeList) {
		return getRadioNodeListResolvedValue(el as RadioNodeList, submitter)
	}

	const fieldEl = el as HTMLFieldElement
	const tagName = fieldEl.tagName
	const type = fieldEl.type.toLowerCase()
	if (tagName === 'SELECT' && fieldEl.value === '') {
		return null
	}

	if (tagName === 'INPUT' && type === 'CHECKBOX') {
		const inputFieldEl = fieldEl as HTMLInputElement
		const checkedValue = inputFieldEl.getAttribute('value')
		if (checkedValue !== null) {
			if (inputFieldEl.checked) {
				return inputFieldEl.value
			}
			return null
		}
		return inputFieldEl.checked
	}

	return fieldEl.value
}

/**
 * Returns only named form field elements.
 * @param key - The key from the `form.elements` object.
 * @param el - The element
 */
const isValidFormField = (key: string, el: FieldNode) => {
	return (
		isNaN(Number(key))
		&& isFormFieldElement(el)
	)
}

// TODO handle disabled/readonly fields
/**
 * Gets the values of all the fields within the form through accessing the DOM nodes.
 * @param form - The form element.
 * @param submitter - The element which triggered the form's submit event.
 */
const getFormValues = (form: HTMLFormElement, submitter?: HTMLSubmitterElement) => {
	const formElements = form.elements as unknown as Record<string | number, FieldNode>
	const allFormFieldElements = Object.entries<FieldNode>(formElements)
	const formFieldElements = allFormFieldElements.filter(([key, el]) => isValidFormField(key, el))
	return formFieldElements.reduce(
		(theFormValues, [name, el]) => {
			const fieldValue = getFieldValue(el, submitter)
			if (fieldValue === null) {
				return theFormValues
			}
			return {
				[name]: fieldValue,
			}
		},
		{}
	)
}

export default getFormValues
