/**
 * Line ending.
 */
export enum LineEnding {
	/**
	 * Carriage return.
	 */
	CR = '\r',
	/**
	 * Line feed.
	 */
	LF = '\n',
	/**
	 * Carriage return/line feed combination.
	 */
	CRLF = '\r\n',
}

/**
 * Checks if an element can hold a field value.
 * @param el - The element.
 */
export const isFormFieldElement = (el: HTMLElement) => {
	const { tagName } = el
	if (['SELECT', 'TEXTAREA'].includes(tagName)) {
		return true
	}
	if (tagName !== 'INPUT') {
		return false
	}
	const inputEl = el as HTMLInputElement
	const { type } = inputEl
	if (type === 'submit' || type === 'reset') {
		return false
	}
	return Boolean(inputEl.name)
}

/**
 * Options for getting a `<textarea>` element field value.
 */
type GetTextAreaValueOptions = {
	/**
	 * Line ending used for the element's value.
	 */
	lineEndings?: LineEnding,
}

/**
 * Gets the value of a `<textarea>` element.
 * @param textareaEl - The element.
 * @param options - The options.
 * @returns Value of the textarea element.
 */
const getTextAreaFieldValue = (textareaEl: HTMLTextAreaElement, options = {} as GetTextAreaValueOptions) => {
	const { lineEndings = LineEnding.CRLF, } = options
	return textareaEl.value.replace(/\n/g, lineEndings)
}

/**
 * Options for getting a `<select>` element field value.
 */
type GetSelectValueOptions = {}

/**
 * Gets the value of a `<select>` element.
 * @param selectEl - The element.
 * @param options - The options.
 * @returns Value of the select element.
 */
const getSelectFieldValue = (selectEl: HTMLSelectElement, options = {} as GetSelectValueOptions) => {
	if (selectEl.multiple) {
		return Array.from(selectEl.options).filter(o => o.selected).map(o => o.value)
	}
	if (typeof options !== 'object' || options === null) {
		throw new Error('Invalid options.')
	}
	return selectEl.value
}

/**
 * Type for an `<input type="radio">` element.
 */
export type HTMLInputRadioElement = HTMLInputElement & { type: 'radio' }

/**
 * Options for getting an `<input type="radio">` element field value.
 */
type GetInputRadioFieldValueOptions = {}

/**
 * Gets the value of an `<input type="radio">` element.
 * @param inputEl - The element.
 * @param options - The options.
 * @returns Value of the input element.
 */
const getInputRadioFieldValue = (inputEl: HTMLInputRadioElement, options = {} as GetInputRadioFieldValueOptions) => {
	if (inputEl.checked) {
		return inputEl.value
	}
	if (typeof options !== 'object' || options === null) {
		throw new Error('Invalid options.')
	}
	return null
}

/**
 * Type for an `<input type="checkbox">` element.
 */
export type HTMLInputCheckboxElement = HTMLInputElement & { type: 'checkbox' }

/**
 * Options for getting an `<input type="checkbox">` element field value.
 */
type GetInputCheckboxFieldValueOptions = {
	/**
	 * Should we consider the `checked` attribute of checkboxes with no `value` attributes instead of the default value
	 * "on" when checked?
	 *
	 * This forces the field to get the `false` value when unchecked.
	 */
	booleanValuelessCheckbox?: true,
}

/**
 * Gets the value of an `<input type="checkbox">` element.
 * @param inputEl - The element.
 * @param options - The options.
 * @returns Value of the input element.
 */
const getInputCheckboxFieldValue = (
	inputEl: HTMLInputCheckboxElement,
	options = {} as GetInputCheckboxFieldValueOptions
) => {
	const checkedValue = inputEl.getAttribute('value')
	if (checkedValue !== null) {
		if (inputEl.checked) {
			return inputEl.value
		}
		return null
	}
	if (options.booleanValuelessCheckbox) {
		return inputEl.checked
	}
	if (inputEl.checked) {
		return 'on'
	}
	return null
}

/**
 * Type for an `<input type="file">` element.
 */
export type HTMLInputFileElement = HTMLInputElement & { type: 'file' }

/**
 * Options for getting an `<input type="file">` element field value.
 */
type GetInputFileFieldValueOptions = {
	/**
	 * Should we retrieve the `files` attribute of file inputs instead of the currently selected file names?
	 */
	getFileObjects?: true,
}

/**
 * Gets the value of an `<input type="file">` element.
 * @param inputEl - The element.
 * @param options - The options.
 * @returns Value of the input element.
 */
const getInputFileFieldValue = (inputEl: HTMLInputFileElement, options = {} as GetInputFileFieldValueOptions) => {
	const { files } = inputEl
	if ((files as unknown) === null) {
		return null
	}
	if (options.getFileObjects) {
		return files
	}
	const filesArray = Array.from(files as FileList)
	if (filesArray.length > 1) {
		return filesArray.map(f => f.name)
	}
	return filesArray[0]?.name || ''
}

/**
 * Options for getting an `<input>` element field value.
 */
type GetInputFieldValueOptions
	= GetInputCheckboxFieldValueOptions
	& GetInputFileFieldValueOptions
	& GetInputRadioFieldValueOptions

/**
 * Gets the value of an `<input>` element.
 * @param inputEl - The element.
 * @param options - The options.
 * @returns Value of the input element.
 */
const getInputFieldValue = (inputEl: HTMLInputElement, options = {} as GetInputFieldValueOptions) => {
	switch (inputEl.type.toLowerCase()) {
	case 'checkbox':
		return getInputCheckboxFieldValue(inputEl as HTMLInputCheckboxElement, options)
	case 'radio':
		return getInputRadioFieldValue(inputEl as HTMLInputRadioElement, options)
	case 'file':
		return getInputFileFieldValue(inputEl as HTMLInputFileElement, options)
	default:
		break
	}
	return inputEl.value
}

/**
 * Options for getting a field value.
 */
type GetFieldValueOptions
	= GetTextAreaValueOptions
	& GetSelectValueOptions
	& GetInputFieldValueOptions

/**
 * Gets the value of a field element.
 * @param el - The field element.
 * @param options - The options.
 * @returns Value of the field element.
 */
export const getFieldValue = (el: HTMLElement, options = {} as GetFieldValueOptions) => {
	switch (el.tagName.toUpperCase()) {
	case 'TEXTAREA':
		return getTextAreaFieldValue(el as HTMLTextAreaElement, options)
	case 'SELECT':
		return getSelectFieldValue(el as HTMLSelectElement, options)
	case 'INPUT':
		return getInputFieldValue(el as HTMLInputElement, options)
	default:
		break
	}

	const fieldEl = el as HTMLElement & { value?: unknown }
	return fieldEl.value || null
}

/**
 * Determines if an element is a named and enabled form field.
 * @param el - The element.
 * @returns Value determining if the element is a named and enabled form field.
 */
export const isNamedEnabledFormFieldElement = (el: HTMLElement) => {
	if (typeof el['name'] !== 'string') {
		return false
	}
	const namedEl = el as HTMLElement & { name: string, disabled: unknown }
	return (
		namedEl.name.length > 0
		&& !('disabled' in namedEl && Boolean(namedEl.disabled))
		&& isFormFieldElement(namedEl)
	)
}

/**
 * Options for getting form values.
 */
type GetFormValuesOptions = GetFieldValueOptions & {
	/**
	 * The element that triggered the submission of the form.
	 */
	submitter?: HTMLElement,
}

/**
 * Gets the values of all the fields within the form through accessing the DOM nodes.
 * @param form - The form.
 * @param options - The options.
 * @returns The form values.
 */
const getFormValues = (form: HTMLFormElement, options = {} as GetFormValuesOptions) => {
	if (!form) {
		throw new TypeError('Invalid form element.')
	}
	const formElements = form.elements as unknown as Record<string | number, HTMLElement>
	const allFormFieldElements = Object.entries<HTMLElement>(formElements)
	const indexedNamedEnabledFormFieldElements = allFormFieldElements.filter(([k, el]) => (
		!isNaN(Number(k))
		&& isNamedEnabledFormFieldElement(el)
	))
	const fieldValues = indexedNamedEnabledFormFieldElements.reduce(
		(theFormValues, [,el]) => {
			const fieldValue = getFieldValue(el, options)
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

	if (Boolean(options.submitter as unknown)) {
		const submitter = options.submitter as HTMLElement & { name: string, value: unknown }
		if (submitter.name.length > 0) {
			return {
				...fieldValues,
				[submitter.name]: submitter.value,
			}
		}
	}

	return fieldValues
}

export default getFormValues
