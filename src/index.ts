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

/**
 * Type for a placeholder object value.
 */
type PlaceholderObject = Record<string, unknown>

/**
 * Tag name for the `<input>` element.
 */
const TAG_NAME_INPUT = 'INPUT' as const;

/**
 * Tag name for the `<textarea>` element.
 */
const TAG_NAME_TEXTAREA = 'TEXTAREA' as const;

/**
 * Tag name for the `<select>` element.
 */
const TAG_NAME_SELECT = 'SELECT' as const;

/**
 * Tag names for valid form field elements of any configuration.
 */
const FORM_FIELD_ELEMENT_TAG_NAMES = [TAG_NAME_SELECT, TAG_NAME_TEXTAREA] as const;

/**
 * Types for button-like `<input>` elements that are not considered as a form field.
 */
const FORM_FIELD_INPUT_EXCLUDED_TYPES = ['submit', 'reset'] as const;

/**
 * Checks if an element can hold a custom (user-inputted) field value.
 * @param el - The element.
 */
export const isFormFieldElement = (el: HTMLElement) => {
  const { tagName } = el;
  if (FORM_FIELD_ELEMENT_TAG_NAMES.includes(tagName as typeof FORM_FIELD_ELEMENT_TAG_NAMES[0])) {
    return true;
  }
  if (tagName !== TAG_NAME_INPUT) {
    return false;
  }
  const inputEl = el as HTMLInputElement;
  const { type } = inputEl;
  if (FORM_FIELD_INPUT_EXCLUDED_TYPES.includes(
    type.toLowerCase() as typeof FORM_FIELD_INPUT_EXCLUDED_TYPES[0],
  )) {
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
    throw new TypeError('Invalid options for getSelectFieldValue().');
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
 * Attribute name for the element's value.
 */
const ATTRIBUTE_VALUE = 'value' as const;

/**
 * Value of the `type` attribute for `<input>` elements considered as radio buttons.
 */
const INPUT_TYPE_RADIO = 'radio' as const;

/**
 * Type for an `<input type="radio">` element.
 */
export type HTMLInputRadioElement = HTMLInputElement & { type: typeof INPUT_TYPE_RADIO }

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
    throw new TypeError('Invalid options for getInputRadioFieldValue().');
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
  const valueWhenChecked = inputEl.getAttribute(ATTRIBUTE_VALUE);
  // eslint-disable-next-line no-param-reassign
  inputEl.checked = valueWhenChecked === value;
};

/**
 * Value of the `type` attribute for `<input>` elements considered as checkboxes.
 */
const INPUT_TYPE_CHECKBOX = 'checkbox' as const;

/**
 * Type for an `<input type="checkbox">` element.
 */
export type HTMLInputCheckboxElement = HTMLInputElement & { type: typeof INPUT_TYPE_CHECKBOX }

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
 * String values resolvable to an unchecked checkbox state.
 */
const INPUT_CHECKBOX_FALSY_VALUES = ['false', 'off', 'no', '0', ''] as const;

/**
 * Default value of the `<input type="checkbox">` when it is checked.
 */
const INPUT_CHECKBOX_DEFAULT_CHECKED_VALUE = 'on' as const;

/**
 * String values resolvable to a checked checkbox state.
 */
const INPUT_CHECKBOX_TRUTHY_VALUES = ['true', INPUT_CHECKBOX_DEFAULT_CHECKED_VALUE, 'yes', '1'] as const;

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
  const checkedValue = inputEl.getAttribute(ATTRIBUTE_VALUE);
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
    return INPUT_CHECKBOX_DEFAULT_CHECKED_VALUE;
  }
  return null;
};

/**
 * Sets the value of an `<input type="checkbox">` element.
 * @param inputEl - The element.
 * @param value - Value of the input element.
 */
const setInputCheckboxFieldValue = (
  inputEl: HTMLInputCheckboxElement,
  value: unknown,
) => {
  const checkedValue = inputEl.getAttribute(ATTRIBUTE_VALUE);
  if (checkedValue !== null) {
    // eslint-disable-next-line no-param-reassign
    inputEl.checked = value === checkedValue;
    return;
  }

  if (
    INPUT_CHECKBOX_FALSY_VALUES.includes(
      (value as string).toLowerCase() as typeof INPUT_CHECKBOX_FALSY_VALUES[0],
    )
    || !value
  ) {
    // eslint-disable-next-line no-param-reassign
    inputEl.checked = false;
    return;
  }

  if (
    INPUT_CHECKBOX_TRUTHY_VALUES.includes(
      (value as string).toLowerCase() as typeof INPUT_CHECKBOX_TRUTHY_VALUES[0],
    )
    || value === true
    || value === 1
  ) {
    // eslint-disable-next-line no-param-reassign
    inputEl.checked = true;
  }
};

/**
 * Value of the `type` attribute for `<input>` elements considered as file upload components.
 */
const INPUT_TYPE_FILE = 'file' as const;

/**
 * Type for an `<input type="file">` element.
 */
export type HTMLInputFileElement = HTMLInputElement & { type: typeof INPUT_TYPE_FILE }

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
 * Value of the `type` attribute for `<input>` elements considered as discrete number selectors.
 */
const INPUT_TYPE_NUMBER = 'number' as const;

/**
 * Type for an `<input type="number">` element.
 */
export type HTMLInputNumberElement = HTMLInputElement & { type: typeof INPUT_TYPE_NUMBER }

/**
 * Value of the `type` attribute for `<input>` elements considered as continuous number selectors.
 */
const INPUT_TYPE_RANGE = 'range' as const;

/**
 * Type for an `<input type="range">` element.
 */
export type HTMLInputRangeElement = HTMLInputElement & { type: typeof INPUT_TYPE_RANGE }

/**
 * Type for an `<input>` element that handles numeric values.
 */
export type HTMLInputNumericElement = HTMLInputNumberElement | HTMLInputRangeElement;

/**
 * Options for getting an `<input type="number">` element field value.
 */
type GetInputNumberFieldValueOptions = {
  /**
   * Should we force values to be numeric?
   *
   * **Note:** Form values are retrieved to be strings by default, hence this option.
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
 * Value of the `type` attribute for `<input>` elements considered as date pickers.
 */
const INPUT_TYPE_DATE = 'date' as const;

/**
 * Type for an `<input type="date">` element.
 */
export type HTMLInputDateElement = HTMLInputElement & { type: typeof INPUT_TYPE_DATE }

/**
 * Value of the `type` attribute for `<input>` elements considered as date and time pickers.
 */
const INPUT_TYPE_DATETIME_LOCAL = 'datetime-local' as const;

/**
 * Type for an `<input type="datetime-local">` element.
 */
export type HTMLInputDateTimeLocalElement = HTMLInputElement & {
  type: typeof INPUT_TYPE_DATETIME_LOCAL,
}

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
 * ISO format for dates.
 */
const DATE_FORMAT_ISO = 'yyyy-MM-DD' as const;

/**
 * Sets the value of an `<input type="date">` element.
 * @param inputEl - The element.
 * @param value - Value of the input element.
 */
const setInputDateLikeFieldValue = (
  inputEl: HTMLInputDateLikeElement,
  value: unknown,
) => {
  if (inputEl.type.toLowerCase() === INPUT_TYPE_DATE) {
    // eslint-disable-next-line no-param-reassign
    inputEl.value = new Date(value as ConstructorParameters<typeof Date>[0])
      .toISOString()
      .slice(0, DATE_FORMAT_ISO.length);
    return;
  }

  if (inputEl.type.toLowerCase() === INPUT_TYPE_DATETIME_LOCAL) {
    // eslint-disable-next-line no-param-reassign
    inputEl.value = new Date(value as ConstructorParameters<typeof Date>[0])
      .toISOString()
      .slice(0, -1); // remove extra 'Z' suffix
  }
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
    case INPUT_TYPE_CHECKBOX:
      return getInputCheckboxFieldValue(inputEl as HTMLInputCheckboxElement, options);
    case INPUT_TYPE_RADIO:
      return getInputRadioFieldValue(inputEl as HTMLInputRadioElement, options);
    case INPUT_TYPE_FILE:
      return getInputFileFieldValue(inputEl as HTMLInputFileElement, options);
    case INPUT_TYPE_NUMBER:
    case INPUT_TYPE_RANGE:
      return getInputNumericFieldValue(inputEl as HTMLInputNumericElement, options);
    case INPUT_TYPE_DATE:
    case INPUT_TYPE_DATETIME_LOCAL:
      return getInputDateLikeFieldValue(inputEl as HTMLInputDateLikeElement, options);
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
    case INPUT_TYPE_CHECKBOX:
      setInputCheckboxFieldValue(inputEl as HTMLInputCheckboxElement, value);
      return;
    case INPUT_TYPE_RADIO:
      setInputRadioFieldValue(inputEl as HTMLInputRadioElement, value);
      return;
    case INPUT_TYPE_FILE:
      // We shouldn't tamper with file inputs! This will not have any implementation.
      return;
    case INPUT_TYPE_NUMBER:
    case INPUT_TYPE_RANGE:
      setInputNumericFieldValue(inputEl as HTMLInputNumericElement, value);
      return;
    case INPUT_TYPE_DATE:
    case INPUT_TYPE_DATETIME_LOCAL:
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

/**
 * Types for elements with names (i.e. can be assigned the `name` attribute).
 */
type HTMLElementWithName
  = (HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement | HTMLButtonElement);

/**
 * Gets the value of a field element.
 * @param el - The field element.
 * @param options - The options.
 * @returns Value of the field element.
 */
export const getFieldValue = (el: HTMLElement, options = {} as GetFieldValueOptions) => {
  switch (el.tagName) {
    case TAG_NAME_TEXTAREA:
      return getTextAreaFieldValue(el as HTMLTextAreaElement, options);
    case TAG_NAME_SELECT:
      return getSelectFieldValue(el as HTMLSelectElement, options);
    case TAG_NAME_INPUT:
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
  switch (el.tagName) {
    case TAG_NAME_TEXTAREA:
      setTextAreaFieldValue(el as HTMLTextAreaElement, value);
      return;
    case TAG_NAME_SELECT:
      setSelectFieldValue(el as HTMLSelectElement, value);
      return;
    case TAG_NAME_INPUT:
      setInputFieldValue(el as HTMLInputElement, value);
      return;
    default:
      break;
  }

  const fieldEl = el as HTMLElement & { value?: unknown };
  fieldEl.value = value;
};

/**
 * Attribute name for the element's field name.
 */
const ATTRIBUTE_NAME = 'name' as const;

/**
 * Attribute name for the element's disabled status.
 */
const ATTRIBUTE_DISABLED = 'disabled' as const;

/**
 * Determines if an element is a named and enabled form field.
 * @param el - The element.
 * @returns Value determining if the element is a named and enabled form field.
 */
export const isNamedEnabledFormFieldElement = (el: HTMLElement) => {
  if (!(ATTRIBUTE_NAME in el)) {
    return false;
  }
  if (typeof el[ATTRIBUTE_NAME] !== 'string') {
    return false;
  }
  const namedEl = el as unknown as HTMLElementWithName;
  return (
    el[ATTRIBUTE_NAME].length > 0
    && !(ATTRIBUTE_DISABLED in namedEl && Boolean(namedEl[ATTRIBUTE_DISABLED]))
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
 * Tag name for the `<form>` element.
 */
const TAG_NAME_FORM = 'FORM' as const;

/**
 * Checks if the provided value is a valid form.
 * @param maybeForm - The value to check.
 * @param context - Context where this function is run, which are used for error messages.
 */
const assertIsFormElement = (maybeForm: unknown, context: string) => {
  const formType = typeof maybeForm;
  if (formType !== 'object') {
    throw new TypeError(
      `Invalid form argument provided for ${context}(). The argument value ${String(maybeForm)} is of type "${formType}". Expected an HTML element.`,
    );
  }

  if (!maybeForm) {
    // Don't accept `null`.
    throw new TypeError(`No <form> element was provided for ${context}().`);
  }

  const element = maybeForm as HTMLElement;
  // We're not so strict when it comes to checking if the passed value for `maybeForm` is a
  // legitimate HTML element.

  if (element.tagName !== TAG_NAME_FORM) {
    throw new TypeError(
      `Invalid form argument provided for ${context}(). Expected <form>, got <${element.tagName.toLowerCase()}>.`,
    );
  }
};

/**
 * Filters the form elements that can be processed.
 * @param form - The form element.
 * @returns Array of key-value pairs for the field names and field elements.
 */
const filterFieldElements = (form: HTMLFormElement) => {
  const formElements = form.elements as unknown as Record<string | number, HTMLElement>;
  const allFormFieldElements = Object.entries<HTMLElement>(formElements);
  return allFormFieldElements.filter(([k, el]) => (
    // We use the number-indexed elements because they are consistent to enumerate.
    !Number.isNaN(Number(k))

    // Only the enabled/read-only elements can be enumerated.
    && isNamedEnabledFormFieldElement(el)
  )) as [string, HTMLElementWithName][];
};

/**
 * Gets the values of all the fields within the form through accessing the DOM nodes.
 * @param form - The form.
 * @param options - The options.
 * @returns The form values.
 */
export const getFormValues = (form: HTMLFormElement, options = {} as GetFormValuesOptions) => {
  assertIsFormElement(form, 'getFormValues');

  const fieldElements = filterFieldElements(form);
  const fieldValues = fieldElements.reduce(
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
 * Sets the values of all the fields within the form through accessing the DOM nodes. Partial values
 * may be passed to set values only to certain form fields.
 * @param form - The form.
 * @param values - The form values.
 */
export const setFormValues = (
  form: HTMLFormElement,
  values: ConstructorParameters<typeof URLSearchParams>[0] | Record<string, unknown>,
) => {
  assertIsFormElement(form, 'getFormValues');

  const valuesType = typeof values;
  if (!['string', 'object'].includes(valuesType)) {
    throw new TypeError(`Invalid values argument provided for setFormValues(). Expected "object" or "string", got ${valuesType}`);
  }

  if (!values) {
    return;
  }

  const fieldElements = filterFieldElements(form);
  const objectValues = new URLSearchParams(values as unknown as string | Record<string, string>);
  fieldElements
    .filter(([, el]) => objectValues.has(el.name))
    .forEach(([, el]) => {
      setFieldValue(el, objectValues.get(el.name));
    });
};

/**
 * Gets the values of all the fields within the form through accessing the DOM nodes.
 * @deprecated Default import is deprecated. Use named export `getFormValues()` instead. This
 * default export is only for backwards compatibility.
 * @param args - The arguments.
 * @see getFormValues
 */
export default (...args: Parameters<typeof getFormValues>) => {
  // eslint-disable-next-line no-console
  console.warn('Default import is deprecated. Use named export `getFormValues()` instead. This default export is only for backwards compatibility.');
  return getFormValues(...args);
};
