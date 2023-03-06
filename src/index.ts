/**
 * Line ending.
 */
export enum LineEnding {
  /**
   * Carriage return. Used for legacy Mac OS systems.
   */
  CR = '\r',
  /**
   * Line feed. Used for Linux/*NIX systems as well as newer macOS systems.
   */
  LF = '\n',
  /**
   * Carriage return/line feed combination. Used for Windows systems.
   */
  CRLF = '\r\n',
}

type PlaceholderObject = Record<string, unknown>

/**
 * Checks if an element can hold a field value.
 * @param el - The element.
 */
export const isFormFieldElement = (el: HTMLElement) => {
  const { tagName } = el;
  if (['SELECT', 'TEXTAREA'].includes(tagName)) {
    return true;
  }
  if (tagName !== 'INPUT') {
    return false;
  }
  const inputEl = el as HTMLInputElement;
  const { type } = inputEl;
  if (type === 'submit' || type === 'reset') {
    return false;
  }
  return Boolean(inputEl.name);
};

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
const getTextAreaFieldValue = (
  textareaEl: HTMLTextAreaElement,
  options = {} as GetTextAreaValueOptions,
) => {
  const { lineEndings = LineEnding.CRLF } = options;
  return textareaEl.value.replace(/\n/g, lineEndings);
};

/**
 * Sets the value of a `<textarea>` element.
 * @param textareaEl - The element.
 * @param value - Value of the textarea element.
 */
const setTextAreaFieldValue = (
  textareaEl: HTMLTextAreaElement,
  value: unknown,
) => {
  // eslint-disable-next-line no-param-reassign
  textareaEl.value = value as string;
};

/**
 * Options for getting a `<select>` element field value.
 */
type GetSelectValueOptions = PlaceholderObject

/**
 * Gets the value of a `<select>` element.
 * @param selectEl - The element.
 * @param options - The options.
 * @returns Value of the select element.
 */
const getSelectFieldValue = (
  selectEl: HTMLSelectElement,
  options = {} as GetSelectValueOptions,
) => {
  if (selectEl.multiple) {
    return Array.from(selectEl.options).filter((o) => o.selected).map((o) => o.value);
  }
  if (typeof options !== 'object' || options === null) {
    throw new Error('Invalid options.');
  }
  return selectEl.value;
};

/**
 * Sets the value of a `<select>` element.
 * @param selectEl - The element.
 * @param value - Value of the select element.
 */
const setSelectFieldValue = (selectEl: HTMLSelectElement, value: unknown) => {
  Array.from(selectEl.options)
    .filter((o) => {
      if (Array.isArray(value)) {
        return (value as string[]).includes(o.value);
      }
      return o.value === value;
    })
    .forEach((el) => {
      // eslint-disable-next-line no-param-reassign
      el.selected = true;
    });
};

/**
 * Type for an `<input type="radio">` element.
 */
export type HTMLInputRadioElement = HTMLInputElement & { type: 'radio' }

/**
 * Options for getting an `<input type="radio">` element field value.
 */
type GetInputRadioFieldValueOptions = PlaceholderObject

/**
 * Gets the value of an `<input type="radio">` element.
 * @param inputEl - The element.
 * @param options - The options.
 * @returns Value of the input element.
 */
const getInputRadioFieldValue = (
  inputEl: HTMLInputRadioElement,
  options = {} as GetInputRadioFieldValueOptions,
) => {
  if (inputEl.checked) {
    return inputEl.value;
  }
  if (typeof options !== 'object' || options === null) {
    throw new Error('Invalid options.');
  }
  return null;
};

/**
 * Sets the value of an `<input type="radio">` element.
 * @param inputEl - The element.
 * @param value - Value of the input element.
 */
const setInputRadioFieldValue = (
  inputEl: HTMLInputRadioElement,
  value: unknown,
) => {
  const checkedValue = inputEl.getAttribute('value');
  // eslint-disable-next-line no-param-reassign
  inputEl.checked = checkedValue === value;
};

/**
 * Type for an `<input type="checkbox">` element.
 */
export type HTMLInputCheckboxElement = HTMLInputElement & { type: 'checkbox' }

/**
 * Options for getting an `<input type="checkbox">` element field value.
 */
type GetInputCheckboxFieldValueOptions = {
  /**
   * Should we consider the `checked` attribute of checkboxes with no `value` attributes instead of
   * the default value "on" when checked?
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
  options = {} as GetInputCheckboxFieldValueOptions,
) => {
  const checkedValue = inputEl.getAttribute('value');
  if (checkedValue !== null) {
    if (inputEl.checked) {
      return inputEl.value;
    }
    return null;
  }
  if (options.booleanValuelessCheckbox) {
    return inputEl.checked;
  }
  if (inputEl.checked) {
    return 'on';
  }
  return null;
};

/**
 * String values resolvable to an unchecked checkbox state.
 */
const INPUT_CHECKBOX_FALSY_VALUES = ['false', 'off', 'no', '0', ''];

/**
 * String values resolvable to a checked checkbox state.
 */
const INPUT_CHECKBOX_TRUTHY_VALUES = ['true', 'on', 'yes', '1'];

/**
 * Sets the value of an `<input type="checkbox">` element.
 * @param inputEl - The element.
 * @param value - Value of the input element.
 */
const setInputCheckboxFieldValue = (
  inputEl: HTMLInputCheckboxElement,
  value: unknown,
) => {
  const checkedValue = inputEl.getAttribute('value');
  if (checkedValue !== null) {
    // eslint-disable-next-line no-param-reassign
    inputEl.checked = value === checkedValue;
    return;
  }

  if (INPUT_CHECKBOX_FALSY_VALUES.includes((value as string).toLowerCase()) || !value) {
    // eslint-disable-next-line no-param-reassign
    inputEl.checked = false;
    return;
  }

  if (INPUT_CHECKBOX_TRUTHY_VALUES.includes((value as string).toLowerCase())
    || value === true
    || value === 1
  ) {
    // eslint-disable-next-line no-param-reassign
    inputEl.checked = true;
  }
};

/**
 * Type for an `<input type="file">` element.
 */
export type HTMLInputFileElement = HTMLInputElement & { type: 'file' }

/**
 * Options for getting an `<input type="file">` element field value.
 */
type GetInputFileFieldValueOptions = {
  /**
   * Should we retrieve the `files` attribute of file inputs instead of the currently selected file
   * names?
   */
  getFileObjects?: true,
}

/**
 * Gets the value of an `<input type="file">` element.
 * @param inputEl - The element.
 * @param options - The options.
 * @returns Value of the input element.
 */
const getInputFileFieldValue = (
  inputEl: HTMLInputFileElement,
  options = {} as GetInputFileFieldValueOptions,
) => {
  const { files } = inputEl;
  if ((files as unknown) === null) {
    return null;
  }
  if (options.getFileObjects) {
    return files;
  }
  const filesArray = Array.from(files as FileList);
  if (filesArray.length > 1) {
    return filesArray.map((f) => f.name);
  }
  return filesArray[0]?.name || '';
};

/**
 * Type for an `<input type="number">` element.
 */
export type HTMLInputNumberElement = HTMLInputElement & { type: 'number' }

/**
 * Type for an `<input type="range">` element.
 */
export type HTMLInputRangeElement = HTMLInputElement & { type: 'range' }

/**
 * Type for an `<input` element that handles numeric values.
 */
export type HTMLInputNumericElement = HTMLInputNumberElement | HTMLInputRangeElement;

/**
 * Options for getting an `<input type="number">` element field value.
 */
type GetInputNumberFieldValueOptions = {
  /**
   * Should we force values to be numeric?
   * @note Form values are retrieved to be strings by default, hence this option.
   */
  forceNumberValues?: true,
}

/**
 * Gets the value of an `<input type="number">` element.
 * @param inputEl - The element.
 * @param options - The options.
 * @returns Value of the input element.
 */
const getInputNumericFieldValue = (
  inputEl: HTMLInputNumericElement,
  options = {} as GetInputNumberFieldValueOptions,
) => {
  if (options.forceNumberValues) {
    return inputEl.valueAsNumber;
  }
  return inputEl.value;
};

/**
 * Sets the value of an `<input type="number">` element.
 * @param inputEl - The element.
 * @param value - Value of the input element.
 */
const setInputNumericFieldValue = (
  inputEl: HTMLInputNumericElement,
  value: unknown,
) => {
  // eslint-disable-next-line no-param-reassign
  inputEl.valueAsNumber = Number(value);
};

/**
 * Type for an `<input type="date">` element.
 */
export type HTMLInputDateElement = HTMLInputElement & { type: 'date' }

/**
 * Type for an `<input type="datetime-local">` element.
 */
export type HTMLInputDateTimeLocalElement = HTMLInputElement & { type: 'datetime-local' }

/**
 * Type for an `<input>` element.that handles date values.
 */
export type HTMLInputDateLikeElement = HTMLInputDateTimeLocalElement | HTMLInputDateElement

/**
 * Options for getting a date-like `<input>` element field value.
 */
type GetInputDateFieldValueOptions = {
  /**
   * Should we force values to be dates?
   * @note Form values are retrieved to be strings by default, hence this option.
   */
  forceDateValues?: true,
};

/**
 * Gets the value of an `<input type="date">` element.
 * @param inputEl - The element.
 * @param options - The options.
 * @returns Value of the input element.
 */
const getInputDateLikeFieldValue = (
  inputEl: HTMLInputDateLikeElement,
  options = {} as GetInputDateFieldValueOptions,
) => {
  if (options.forceDateValues) {
    return inputEl.valueAsDate;
  }
  return inputEl.value;
};

/**
 * Sets the value of an `<input type="date">` element.
 * @param inputEl - The element.
 * @param value - Value of the input element.
 */
const setInputDateLikeFieldValue = (
  inputEl: HTMLInputDateLikeElement,
  value: unknown,
) => {
  if (inputEl.type.toLowerCase() === 'date') {
    // eslint-disable-next-line no-param-reassign
    inputEl.value = new Date(value as ConstructorParameters<typeof Date>[0])
      .toISOString()
      .slice(0, 'yyyy-MM-DD'.length);
    return;
  }

  if (inputEl.type.toLowerCase() === 'datetime-local') {
    // eslint-disable-next-line no-param-reassign
    inputEl.value = new Date(value as ConstructorParameters<typeof Date>[0])
      .toISOString()
      .slice(0, -1); // remove extra 'Z' suffix
  }
  // inputEl.valueAsDate = new Date(value as ConstructorParameters<typeof Date>[0]);
};

/**
 * Options for getting an `<input>` element field value.
 */
type GetInputFieldValueOptions
  = GetInputCheckboxFieldValueOptions
  & GetInputFileFieldValueOptions
  & GetInputRadioFieldValueOptions
  & GetInputNumberFieldValueOptions
  & GetInputDateFieldValueOptions

/**
 * Gets the value of an `<input>` element.
 * @param inputEl - The element.
 * @param options - The options.
 * @returns Value of the input element.
 */
const getInputFieldValue = (
  inputEl: HTMLInputElement,
  options = {} as GetInputFieldValueOptions,
) => {
  switch (inputEl.type.toLowerCase()) {
    case 'checkbox':
      return getInputCheckboxFieldValue(inputEl as HTMLInputCheckboxElement, options);
    case 'radio':
      return getInputRadioFieldValue(inputEl as HTMLInputRadioElement, options);
    case 'file':
      return getInputFileFieldValue(inputEl as HTMLInputFileElement, options);
    case 'number':
    case 'range':
      return getInputNumericFieldValue(inputEl as HTMLInputNumericElement, options);
    case 'date':
    case 'datetime-local':
      return getInputDateLikeFieldValue(inputEl as HTMLInputDateLikeElement, options);
      // TODO week and month
    default:
      break;
  }
  return inputEl.value;
};

/**
 * Sets the value of an `<input>` element.
 * @param inputEl - The element.
 * @param value - Value of the input element.
 * @note This function is a noop for `<input type="file">` because by design, file inputs are not
 * assignable programmatically.
 */
const setInputFieldValue = (
  inputEl: HTMLInputElement,
  value: unknown,
) => {
  switch (inputEl.type.toLowerCase()) {
    case 'checkbox':
      setInputCheckboxFieldValue(inputEl as HTMLInputCheckboxElement, value);
      return;
    case 'radio':
      setInputRadioFieldValue(inputEl as HTMLInputRadioElement, value);
      return;
    case 'file':
      // We shouldn't tamper with file inputs! This will not have any implementation.
      return;
    case 'number':
    case 'range':
      // eslint-disable-next-line no-param-reassign
      setInputNumericFieldValue(inputEl as HTMLInputNumericElement, value);
      return;
    case 'date':
    case 'datetime-local':
      setInputDateLikeFieldValue(inputEl as HTMLInputDateLikeElement, value);
      return;
    default:
      break;
  }
  // eslint-disable-next-line no-param-reassign
  inputEl.value = value as string;
};

/**
 * Options for getting a field value.
 */
type GetFieldValueOptions
  = GetTextAreaValueOptions
  & GetSelectValueOptions
  & GetInputFieldValueOptions

type HTMLElementWithName
  = (HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement | HTMLButtonElement);

/**
 * Gets the value of a field element.
 * @param el - The field element.
 * @param options - The options.
 * @returns Value of the field element.
 */
export const getFieldValue = (el: HTMLElement, options = {} as GetFieldValueOptions) => {
  switch (el.tagName.toLowerCase()) {
    case 'textarea':
      return getTextAreaFieldValue(el as HTMLTextAreaElement, options);
    case 'select':
      return getSelectFieldValue(el as HTMLSelectElement, options);
    case 'input':
      return getInputFieldValue(el as HTMLInputElement, options);
    default:
      break;
  }

  const fieldEl = el as HTMLElement & { value?: unknown };
  return fieldEl.value || null;
};

/**
 * Sets the value of a field element.
 * @param el - The field element.
 * @param value - Value of the field element.
 */
const setFieldValue = (el: HTMLElement, value: unknown) => {
  switch (el.tagName.toLowerCase()) {
    case 'textarea':
      setTextAreaFieldValue(el as HTMLTextAreaElement, value);
      return;
    case 'select':
      setSelectFieldValue(el as HTMLSelectElement, value);
      return;
    case 'input':
      setInputFieldValue(el as HTMLInputElement, value);
      return;
    default:
      break;
  }

  const fieldEl = el as HTMLElement & { value?: unknown };
  fieldEl.value = value;
};

/**
 * Determines if an element is a named and enabled form field.
 * @param el - The element.
 * @returns Value determining if the element is a named and enabled form field.
 */
export const isNamedEnabledFormFieldElement = (el: HTMLElement) => {
  if (!('name' in el)) {
    return false;
  }
  if (typeof el.name !== 'string') {
    return false;
  }
  const namedEl = el as unknown as HTMLElementWithName;
  return (
    el.name.length > 0
    && !('disabled' in namedEl && Boolean(namedEl.disabled))
    && isFormFieldElement(namedEl)
  );
};

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
export const getFormValues = (form: HTMLFormElement, options = {} as GetFormValuesOptions) => {
  if (!form) {
    throw new TypeError('Invalid form element.');
  }
  const formElements = form.elements as unknown as Record<string | number, HTMLElement>;
  const allFormFieldElements = Object.entries<HTMLElement>(formElements);
  const indexedNamedEnabledFormFieldElements = allFormFieldElements.filter(([k, el]) => (
    !Number.isNaN(Number(k))
    && isNamedEnabledFormFieldElement(el)
  )) as [string, HTMLElementWithName][];
  const fieldValues = indexedNamedEnabledFormFieldElements.reduce(
    (theFormValues, [, el]) => {
      const fieldValue = getFieldValue(el, options);
      if (fieldValue === null) {
        return theFormValues;
      }

      const { name: fieldName } = el;
      const { [fieldName]: oldFormValue = null } = theFormValues;

      if (oldFormValue === null) {
        return {
          ...theFormValues,
          [fieldName]: fieldValue,
        };
      }

      if (!Array.isArray(oldFormValue)) {
        return {
          ...theFormValues,
          [fieldName]: [oldFormValue, fieldValue],
        };
      }

      return {
        ...theFormValues,
        [fieldName]: [...oldFormValue, fieldValue],
      };
    },
    {} as Record<string, unknown>,
  );

  if (options.submitter as unknown as HTMLButtonElement) {
    const { submitter } = options as unknown as Pick<HTMLFormElement, 'submitter'>;
    if (submitter.name.length > 0) {
      return {
        ...fieldValues,
        [submitter.name]: submitter.value,
      };
    }
  }

  return fieldValues;
};

/**
 * Sets the values of all the fields within the form through accessing the DOM nodes.
 * @param form - The form.
 * @param values - The form values.
 */
export const setFormValues = (
  form: HTMLFormElement,
  values: ConstructorParameters<typeof URLSearchParams>[0] | Record<string, unknown>,
) => {
  if (!form) {
    throw new TypeError('Invalid form element.');
  }
  const objectValues = new URLSearchParams(values as unknown as string | Record<string, string>);
  const formElements = form.elements as unknown as Record<string | number, HTMLElement>;
  const allFormFieldElements = Object.entries<HTMLElement>(formElements);
  const indexedNamedEnabledFormFieldElements = allFormFieldElements.filter(([k, el]) => (
    !Number.isNaN(Number(k))
    && isNamedEnabledFormFieldElement(el)
  )) as [string, HTMLElementWithName][];
  indexedNamedEnabledFormFieldElements
    .filter(([, el]) => objectValues.has(el.name))
    .forEach(([, el]) => {
      // eslint-disable-next-line no-param-reassign
      setFieldValue(el, objectValues.get(el.name));
    });
};

// Default import is deprecated. Use named export instead. This default export is only for
// compatibility.
export default (...args: Parameters<typeof getFormValues>) => {
  console.warn('Default import is deprecated. Use named export instead. This default export is only for compatibility.');
  return getFormValues(...args);
};
