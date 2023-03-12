/**
 * Line ending.
 */
export enum LineEnding {
  /**
   * Carriage return. Used for legacy macOS systems.
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
 * @param nthOfName - What order is this field in with respect to fields of the same name?
 * @param totalOfName - How many fields with the same name are in the form?
 */
const setTextAreaFieldValue = (
  textareaEl: HTMLTextAreaElement,
  value: unknown,
  nthOfName: number,
  totalOfName: number,
) => {
  if (Array.isArray(value) && totalOfName > 1) {
    // eslint-disable-next-line no-param-reassign
    textareaEl.value = value[nthOfName];
    return;
  }

  // eslint-disable-next-line no-param-reassign
  textareaEl.value = value as string;
};

/**
 * Gets the value of a `<select>` element.
 * @param selectEl - The element.
 * @returns Value of the select element.
 */
const getSelectFieldValue = (
  selectEl: HTMLSelectElement,
) => {
  if (selectEl.multiple) {
    return Array.from(selectEl.options).filter((o) => o.selected).map((o) => o.value);
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
 * Gets the value of an `<input type="radio">` element.
 * @param inputEl - The element.
 * @returns Value of the input element.
 */
const getInputRadioFieldValue = (inputEl: HTMLInputRadioElement) => {
  if (inputEl.checked) {
    return inputEl.value;
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
  const valueWhenChecked = inputEl.getAttribute(ATTRIBUTE_VALUE);

  if (valueWhenChecked !== null) {
    // eslint-disable-next-line no-param-reassign
    inputEl.checked = (
      Array.isArray(value)
        ? value.includes(valueWhenChecked)
        : value === valueWhenChecked
    );
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
 * @param nthOfName - What order is this field in with respect to fields of the same name?
 * @param totalOfName - How many fields with the same name are in the form?
 */
const setInputNumericFieldValue = (
  inputEl: HTMLInputNumericElement,
  value: unknown,
  nthOfName: number,
  totalOfName: number,
) => {
  const valueArray = Array.isArray(value) ? value : [value];
  // eslint-disable-next-line no-param-reassign
  inputEl.valueAsNumber = Number(valueArray[totalOfName > 1 ? nthOfName : 0]);
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
 * @param nthOfName - What order is this field in with respect to fields of the same name?
 * @param totalOfName - How many fields with the same name are in the form?
 */
const setInputDateLikeFieldValue = (
  inputEl: HTMLInputDateLikeElement,
  value: unknown,
  nthOfName: number,
  totalOfName: number,
) => {
  const valueArray = Array.isArray(value) ? value : [value];

  if (inputEl.type.toLowerCase() === INPUT_TYPE_DATE) {
    // eslint-disable-next-line no-param-reassign
    inputEl.value = new Date(
      valueArray[totalOfName > 1 ? nthOfName : 0] as ConstructorParameters<typeof Date>[0],
    )
      .toISOString()
      .slice(0, DATE_FORMAT_ISO.length);
    return;
  }

  if (inputEl.type.toLowerCase() === INPUT_TYPE_DATETIME_LOCAL) {
    // eslint-disable-next-line no-param-reassign
    inputEl.value = new Date(
      valueArray[totalOfName > 1 ? nthOfName : 0] as ConstructorParameters<typeof Date>[0],
    )
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
  & GetInputNumberFieldValueOptions
  & GetInputDateFieldValueOptions

/**
 * Value of the `type` attribute for `<input>` elements considered as text fields.
 */
const INPUT_TYPE_TEXT = 'text' as const;

/**
 * Value of the `type` attribute for `<input>` elements considered as email fields.
 */
const INPUT_TYPE_EMAIL = 'email' as const;

/**
 * Value of the `type` attribute for `<input>` elements considered as telephone fields.
 */
const INPUT_TYPE_TEL = 'tel' as const;

/**
 * Value of the `type` attribute for `<input>` elements considered as URL fields.
 */
const INPUT_TYPE_URL = 'url' as const;

/**
 * Value of the `type` attribute for `<input>` elements considered as password fields.
 */
const INPUT_TYPE_PASSWORD = 'password' as const;

/**
 * Value of the `type` attribute for `<input>` elements considered as hidden fields.
 */
const INPUT_TYPE_HIDDEN = 'hidden' as const;

/**
 * Value of the `type` attribute for `<input>` elements considered as color pickers.
 */
const INPUT_TYPE_COLOR = 'color' as const;

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
      return getInputRadioFieldValue(inputEl as HTMLInputRadioElement);
    case INPUT_TYPE_FILE:
      return getInputFileFieldValue(inputEl as HTMLInputFileElement, options);
    case INPUT_TYPE_NUMBER:
    case INPUT_TYPE_RANGE:
      return getInputNumericFieldValue(inputEl as HTMLInputNumericElement, options);
    case INPUT_TYPE_DATE:
    case INPUT_TYPE_DATETIME_LOCAL:
      return getInputDateLikeFieldValue(inputEl as HTMLInputDateLikeElement, options);
    case INPUT_TYPE_TEXT:
    case INPUT_TYPE_EMAIL:
    case INPUT_TYPE_TEL:
    case INPUT_TYPE_URL:
    case INPUT_TYPE_PASSWORD:
    case INPUT_TYPE_HIDDEN:
    case INPUT_TYPE_COLOR:
    default:
      break;
  }

  // force return `null` for custom elements supporting setting values.
  return inputEl.value ?? null;
};

/**
 * Sets the value of an `<input>` element.
 * @param inputEl - The element.
 * @param value - Value of the input element.
 * @param nthOfName - What order is this field in with respect to fields of the same name?
 * @param totalOfName - How many fields with the same name are in the form?
 * @note This function is a noop for `<input type="file">` because by design, file inputs are not
 * assignable programmatically.
 */
const setInputFieldValue = (
  inputEl: HTMLInputElement,
  value: unknown,
  nthOfName: number,
  totalOfName: number,
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
      setInputNumericFieldValue(
        inputEl as HTMLInputNumericElement,
        value,
        nthOfName,
        totalOfName,
      );
      return;
    case INPUT_TYPE_DATE:
    case INPUT_TYPE_DATETIME_LOCAL:
      setInputDateLikeFieldValue(
        inputEl as HTMLInputDateLikeElement,
        value,
        nthOfName,
        totalOfName,
      );
      return;
    case INPUT_TYPE_TEXT:
    case INPUT_TYPE_EMAIL:
    case INPUT_TYPE_TEL:
    case INPUT_TYPE_URL:
    case INPUT_TYPE_PASSWORD:
    case INPUT_TYPE_HIDDEN:
    case INPUT_TYPE_COLOR:
    default:
      break;
  }

  if (Array.isArray(value) && totalOfName > 1) {
    // eslint-disable-next-line no-param-reassign
    inputEl.value = value[nthOfName];
    return;
  }

  // eslint-disable-next-line no-param-reassign
  inputEl.value = value as string;
};

/**
 * Options for getting a field value.
 */
type GetFieldValueOptions
  = GetTextAreaValueOptions
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
      return getSelectFieldValue(el as HTMLSelectElement);
    case TAG_NAME_INPUT:
    default:
      break;
  }

  return getInputFieldValue(el as HTMLInputElement, options);
};

/**
 * Sets the value of a field element.
 * @param el - The field element.
 * @param value - Value of the field element.
 * @param nthOfName - What order is this field in with respect to fields of the same name?
 * @param totalOfName - How many fields with the same name are in the form?
 */
const setFieldValue = (
  el: HTMLElement,
  value: unknown,
  nthOfName: number,
  totalOfName: number,
) => {
  switch (el.tagName) {
    case TAG_NAME_TEXTAREA:
      setTextAreaFieldValue(el as HTMLTextAreaElement, value, nthOfName, totalOfName);
      return;
    case TAG_NAME_SELECT:
      setSelectFieldValue(el as HTMLSelectElement, value);
      return;
    case TAG_NAME_INPUT:
    default:
      break;
  }

  setInputFieldValue(el as HTMLInputElement, value, nthOfName, totalOfName);
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
  const namedEl = el as unknown as Record<string, unknown>;
  return (
    typeof namedEl[ATTRIBUTE_NAME] === 'string'
    && namedEl[ATTRIBUTE_NAME].length > 0
    && !(ATTRIBUTE_DISABLED in namedEl && Boolean(namedEl[ATTRIBUTE_DISABLED]))
    && isFormFieldElement(namedEl as unknown as HTMLElement)
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

const normalizeValues = (values: unknown): Record<string, unknown | unknown[]> => {
  if (typeof values === 'string') {
    return Object.fromEntries(new URLSearchParams(values).entries());
  }

  if (values instanceof URLSearchParams) {
    return Object.fromEntries(values.entries());
  }

  if (Array.isArray(values)) {
    return Object.fromEntries(values);
  }

  return values as Record<string, unknown | unknown[]>;
};

/**
 * Sets the values of all the fields within the form through accessing the DOM nodes. Partial values
 * may be passed to set values only to certain form fields.
 * @param form - The form.
 * @param values - The form values.
 */
export const setFormValues = (
  form: HTMLFormElement,
  values: unknown,
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
  const objectValues = normalizeValues(values);

  const count = fieldElements
    .filter(([, el]) => el.name in objectValues)
    .reduce(
      (currentCount, [, el]) => {
        if (el.tagName === TAG_NAME_INPUT && el.type === INPUT_TYPE_RADIO) {
          return {
            ...currentCount,
            [el.name]: 1,
          };
        }

        return {
          ...currentCount,
          [el.name]: (
            typeof currentCount[el.name] === 'number'
              ? currentCount[el.name] + 1
              : 1
          ),
        };
      },
      {} as Record<string, number>,
    );

  const counter = {} as Record<string, number>;

  fieldElements
    .filter(([, el]) => el.name in objectValues)
    .forEach(([, el]) => {
      counter[el.name] = typeof counter[el.name] === 'number' ? counter[el.name] + 1 : 0;
      setFieldValue(el, objectValues[el.name], counter[el.name], count[el.name]);
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
