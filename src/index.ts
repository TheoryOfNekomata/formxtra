type HTMLFieldElement
	= HTMLInputElement
	| HTMLButtonElement
	| HTMLSelectElement
	| HTMLTextAreaElement

type HTMLSubmitterElement
	= HTMLButtonElement
	| HTMLInputElement

const isFormFieldElement = (el: HTMLFieldElement) => {
	const htmlEl = el as HTMLElement
	const tagName = htmlEl.tagName
	if (['SELECT', 'TEXTAREA'].includes(tagName)) {
		return true
	}
	if (tagName !== 'INPUT') {
		return false
	}
	const inputEl = htmlEl as HTMLInputElement
	const type = inputEl.type
	const checkedValue = inputEl.getAttribute('value')
	if (type === 'checkbox' && checkedValue !== null) {
		return inputEl.checked
	}
	if (type === 'submit' || type === 'reset') {
		return false
	}
	return Boolean(inputEl.name)
}

/**
 * Gets the value of a field element.
 * @param el - The field element node.
 */
const getFieldValue = (el: HTMLFieldElement) => {
	const fieldEl = el as HTMLFieldElement
	const tagName = fieldEl.tagName
	const type = fieldEl.type

	if (tagName === 'TEXTAREA') {
		return fieldEl.value.replace(/\n/g, '\r\n')
	}

	if (tagName === 'SELECT' && fieldEl.value === '') {
		return null
	}

	if (tagName === 'INPUT') {
		switch (type) {
		case 'checkbox':
			const checkboxEl = fieldEl as HTMLInputElement
			const checkedValue = checkboxEl.getAttribute('value')
			if (checkedValue !== null) {
				if (checkboxEl.checked) {
					return checkboxEl.value
				}
				return null
			}
			return 'on' // default value
		case 'radio':
			const radioEl = fieldEl as HTMLInputElement
			if (radioEl.checked) {
				return radioEl.value
			}
			return null
		default:
			break
		}

	}

	return fieldEl.value
}

/**
 * Returns only named form field elements.
 * @param el - The element
 */
const isValidFormField = (el: HTMLFieldElement) => {
	return (
		'name' in el
		&& typeof el['name'] === 'string'
		&& el['name'].length > 0
		&& !('disabled' in el && Boolean(el['disabled']))
		&& isFormFieldElement(el)
	)
}

/**
 * Gets the values of all the fields within the form through accessing the DOM nodes.
 */
const getFormValues = (form: HTMLFormElement, submitter?: HTMLSubmitterElement) => {
	if (!form) {
		throw new TypeError('Invalid form element.')
	}
	const formElements = form.elements as unknown as Record<string | number, HTMLFieldElement>
	const allFormFieldElements = Object.entries<HTMLFieldElement>(formElements)
	const formFieldElements = allFormFieldElements.filter(([k, el]) => {
		return (
			// get only indexed forms
			!isNaN(Number(k))
			&& isValidFormField(el)
		)
	})
	const fieldValues = formFieldElements.reduce(
		(theFormValues, [,el]) => {
			const fieldValue = getFieldValue(el)
			if (fieldValue === null) {
				return theFormValues
			}

			const fieldName = el['name'] as string;
			const { [fieldName]: oldFormValue = null } = theFormValues;

			if (oldFormValue === null) {
				return {
					...theFormValues,
					[fieldName]: fieldValue,
				}
			}

			if (!Array.isArray(oldFormValue)) {
				return {
					...theFormValues,
					[fieldName]: [oldFormValue, fieldValue],
				}
			}

			return {
				...theFormValues,
				[fieldName]: [...oldFormValue, fieldValue],
			}
		},
		{} as any
	)
	if (Boolean(submitter as unknown)) {
		return {
			...fieldValues,
			[(submitter as HTMLSubmitterElement).name]: (submitter as HTMLSubmitterElement).value,
		}
	}
	return fieldValues
}

export default getFormValues
