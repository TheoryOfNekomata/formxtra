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
 * @returns Value determining if an element can hold a custom (user-inputted) field value.
 */
export const isFieldElement = (el: HTMLElement) => {
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
 * @param elementsOfSameName - How many fields with the same name are in the form?
 */
const setTextAreaFieldValue = (
  textareaEl: HTMLTextAreaElement,
  value: unknown,
  nthOfName: number,
  elementsOfSameName: HTMLTextAreaElement[],
) => {
  if (Array.isArray(value) && elementsOfSameName.length > 1) {
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
 * @param nthOfName - What order is this field in with respect to fields of the same name?
 * @param elementsOfSameName - How many fields with the same name are in the form?
 */
const setSelectFieldValue = (
  selectEl: HTMLSelectElement,
  value: unknown,
  nthOfName: number,
  elementsOfSameName: HTMLSelectElement[],
) => {
  if (elementsOfSameName.length > 1) {
    const valueArray = value as unknown[];
    const valueArrayDepth = valueArray.every((v) => Array.isArray(v)) ? 2 : 1;
    if (valueArrayDepth > 1) {
      // We check if values are [['foo', 'bar'], ['baz', 'quick'], 'single value]
      // If this happens, all values must correspond to a <select multiple> element.
      const currentValue = valueArray[nthOfName] as string[];
      Array.from(selectEl.options).forEach((el) => {
        // eslint-disable-next-line no-param-reassign
        el.selected = currentValue.includes(el.value);
      });
      return;
    }

    // Else we're just checking if these values are in the value array provided.
    // They will apply across all select elements.

    if (elementsOfSameName.some((el) => el.multiple)) {
      Array.from(selectEl.options).forEach((el) => {
        // eslint-disable-next-line no-param-reassign
        el.selected = (value as string[]).includes(el.value);
      });
      return;
    }

    Array.from(selectEl.options).forEach((el) => {
      // eslint-disable-next-line no-param-reassign
      el.selected = el.value === (value as string[])[nthOfName];
    });

    return;
  }

  Array.from(selectEl.options).forEach((el) => {
    // eslint-disable-next-line no-param-reassign
    el.selected = Array.isArray(value)
      ? (value as string[]).includes(el.value)
      : el.value === value;
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

  if (valueWhenChecked !== null) {
    // eslint-disable-next-line no-param-reassign
    inputEl.checked = (
      Array.isArray(value) ? valueWhenChecked === value.slice(-1)[0] : valueWhenChecked === value
    );
    return;
  }

  // eslint-disable-next-line no-param-reassign
  inputEl.checked = (
    Array.isArray(value) ? value.includes('on') : value === 'on'
  );
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

const parseBooleanValues = (value: unknown) => {
  if (typeof value === 'boolean') {
    return value;
  }

  if (typeof value === 'string') {
    const normalizedValue = value.toLowerCase();
    if (INPUT_CHECKBOX_FALSY_VALUES.includes(
      normalizedValue as typeof INPUT_CHECKBOX_FALSY_VALUES[0],
    )) {
      return false;
    }

    if (INPUT_CHECKBOX_TRUTHY_VALUES.includes(
      normalizedValue as typeof INPUT_CHECKBOX_TRUTHY_VALUES[0],
    )) {
      return true;
    }
  }

  if (typeof value === 'number') {
    if (value === 0) {
      return false;
    }

    if (value === 1) {
      return true;
    }
  }

  if (typeof value === 'object') {
    if (value === null) {
      return false;
    }
  }

  return undefined;
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

  const newValue = parseBooleanValues(value);
  if (typeof newValue === 'boolean') {
    // eslint-disable-next-line no-param-reassign
    inputEl.checked = newValue;
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
 * @param elementsWithSameName - How many fields with the same name are in the form?
 */
const setInputNumericFieldValue = (
  inputEl: HTMLInputNumericElement,
  value: unknown,
  nthOfName: number,
  elementsWithSameName: HTMLInputNumericElement[],
) => {
  const valueArray = Array.isArray(value) ? value : [value];
  // eslint-disable-next-line no-param-reassign
  inputEl.valueAsNumber = Number(valueArray[elementsWithSameName.length > 1 ? nthOfName : 0]);
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
 * Value of the `type` attribute for `<input>` elements considered as month pickers.
 */
const INPUT_TYPE_MONTH = 'month' as const;

/**
 * Type for an `<input type="month">` element.
 */
export type HTMLInputMonthElement = HTMLInputElement & {
  type: typeof INPUT_TYPE_MONTH,
}

/**
 * Type for an `<input>` element.that handles date values.
 */
export type HTMLInputDateLikeElement
  = HTMLInputDateTimeLocalElement
  | HTMLInputDateElement
  | HTMLInputMonthElement

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
 * Gets the value of an `<input>` element for date-like data.
 * @param inputEl - The element.
 * @param options - The options.
 * @returns Value of the input element.
 */
const getInputDateLikeFieldValue = (
  inputEl: HTMLInputDateLikeElement,
  options = {} as GetInputDateFieldValueOptions,
) => {
  if (options.forceDateValues) {
    return (
      // somehow datetime-local does not return us the current `valueAsDate` when the string
      // representation in `value` is incomplete.
      inputEl.type === INPUT_TYPE_DATETIME_LOCAL ? new Date(inputEl.value) : inputEl.valueAsDate
    );
  }
  return inputEl.value;
};

/**
 * ISO format for dates.
 */
const DATE_FORMAT_ISO_DATE = 'yyyy-MM-DD' as const;

/**
 * ISO format for months.
 */
const DATE_FORMAT_ISO_MONTH = 'yyyy-MM' as const;

/**
 * Sets the value of an `<input>` element for date-like data.
 * @param inputEl - The element.
 * @param value - Value of the input element.
 * @param nthOfName - What order is this field in with respect to fields of the same name?
 * @param elementsOfSameName - How many fields with the same name are in the form?
 */
const setInputDateLikeFieldValue = (
  inputEl: HTMLInputDateLikeElement,
  value: unknown,
  nthOfName: number,
  elementsOfSameName: HTMLInputDateLikeElement[],
) => {
  const valueArray = Array.isArray(value) ? value : [value];
  const hasMultipleElementsOfSameName = elementsOfSameName.length > 1;
  const elementIndex = hasMultipleElementsOfSameName ? nthOfName : 0;

  if (inputEl.type.toLowerCase() === INPUT_TYPE_DATE) {
    // eslint-disable-next-line no-param-reassign
    inputEl.value = new Date(
      valueArray[elementIndex] as ConstructorParameters<typeof Date>[0],
    )
      .toISOString()
      .slice(0, DATE_FORMAT_ISO_DATE.length);
    return;
  }

  if (inputEl.type.toLowerCase() === INPUT_TYPE_DATETIME_LOCAL) {
    // eslint-disable-next-line no-param-reassign
    inputEl.value = new Date(
      valueArray[elementIndex] as ConstructorParameters<typeof Date>[0],
    )
      .toISOString()
      .slice(0, -1); // remove extra 'Z' suffix
  }

  if (inputEl.type.toLowerCase() === INPUT_TYPE_MONTH) {
    // eslint-disable-next-line no-param-reassign
    inputEl.value = new Date(
      valueArray[elementIndex] as ConstructorParameters<typeof Date>[0],
    )
      .toISOString()
      .slice(0, DATE_FORMAT_ISO_MONTH.length); // remove extra 'Z' suffix
  }
};
/**
 * Value of the `type` attribute for `<input>` elements considered as text fields.
 */
const INPUT_TYPE_TEXT = 'text' as const;

/**
 * Type for an `<input type="text">` element.
 */
export type HTMLInputTextElement = HTMLInputElement & { type: typeof INPUT_TYPE_TEXT };

/**
 * Value of the `type` attribute for `<input>` elements considered as search fields.
 */
const INPUT_TYPE_SEARCH = 'search' as const;

/**
 * Type for an `<input type="search">` element.
 */
export type HTMLInputSearchElement = HTMLInputElement & { type: typeof INPUT_TYPE_SEARCH };

/**
 * Type for an `<input>` element that handles textual data.
 */
export type HTMLInputTextualElement
  = HTMLInputTextElement
  | HTMLInputSearchElement

/**
 * Options for getting a textual `<input>` element field value.
 */
type GetInputTextualFieldValueOptions = {
  /**
   * Should we include the directionality of the value for
   * `<input type="search">` and `<input type="text">`?
   */
  includeDirectionality?: true;
}

class TextualValueString extends String {
  readonly dirName: string;

  readonly dir: string;

  constructor(value: unknown, dirName: string, dir: string) {
    super(value);
    this.dirName = dirName;
    this.dir = dir;
  }
}

/**
 * Gets the value of an `<input>` element for textual data.
 * @param inputEl - The element.
 * @param options - The options.
 * @returns Value of the input element.
 */
const getInputTextualFieldValue = (
  inputEl: HTMLInputTextualElement,
  options = {} as GetInputTextualFieldValueOptions,
) => {
  if (
    options.includeDirectionality
    && typeof window !== 'undefined'
    && typeof window.getComputedStyle === 'function'
    && typeof (inputEl.dirName as unknown) === 'string'
  ) {
    return new TextualValueString(
      inputEl.value,
      inputEl.dirName,
      window.getComputedStyle(inputEl).direction || 'ltr',
    );
  }

  return inputEl.value;
};

/**
 * Value of the `type` attribute for `<input>` elements considered as hidden fields.
 */
const INPUT_TYPE_HIDDEN = 'hidden' as const;

/**
 * Attribute value for the `name` attribute for `<input type="hidden">` elements, which should
 * contain character set encoding.
 */
const NAME_ATTRIBUTE_VALUE_CHARSET = '_charset_' as const;

/**
 * Type for an `<input type="hidden">` element.
 */
export type HTMLInputHiddenElement = HTMLInputElement & { type: typeof INPUT_TYPE_HIDDEN }

/**
 * Gets the value of an `<input>` element for hidden data.
 * @param inputEl - The element.
 * @param options - The options.
 * @returns Value of the input element.
 */
type GetInputHiddenFieldValueOptions = {
  /**
   * Should we fill in the character set for the `<input type="hidden">`
 *   elements with name equal to `_charset_`?
   */
  includeCharset?: true;
}

/**
 * Gets the value of an `<input>` element for hidden data.
 * @param inputEl - The element.
 * @param options - The options.
 * @returns Value of the input element.
 */
const getInputHiddenFieldValue = (
  inputEl: HTMLInputHiddenElement,
  options = {} as GetInputHiddenFieldValueOptions,
) => {
  if (
    options.includeCharset
    && typeof window !== 'undefined'
    && typeof window.document !== 'undefined'
    && typeof (window.document.characterSet as unknown) === 'string'
    && inputEl.name === NAME_ATTRIBUTE_VALUE_CHARSET
    && inputEl.getAttribute(ATTRIBUTE_VALUE) === null
  ) {
    return window.document.characterSet;
  }

  return inputEl.value;
};

/**
 * Options for getting an `<input>` element field value.
 */
type GetInputFieldValueOptions
  = GetInputCheckboxFieldValueOptions
  & GetInputFileFieldValueOptions
  & GetInputNumberFieldValueOptions
  & GetInputDateFieldValueOptions
  & GetInputTextualFieldValueOptions
  & GetInputHiddenFieldValueOptions

/**
 * Sets the value of an `<input type="hidden">` element.
 * @param inputEl - The element.
 * @param value - Value of the input element.
 * @param nthOfName - What order is this field in with respect to fields of the same name?
 * @param elementsWithSameName - How many fields with the same name are in the form?
 */
const setInputHiddenFieldValue = (
  inputEl: HTMLInputHiddenElement,
  value: unknown,
  nthOfName: number,
  elementsWithSameName: HTMLInputHiddenElement[],
) => {
  if (inputEl.name === NAME_ATTRIBUTE_VALUE_CHARSET) {
    return;
  }

  if (Array.isArray(value) && elementsWithSameName.length > 1) {
    // eslint-disable-next-line no-param-reassign
    inputEl.value = value[nthOfName];
    return;
  }

  // eslint-disable-next-line no-param-reassign
  inputEl.value = value as string;
};

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
 * Value of the `type` attribute for `<input>` elements considered as color pickers.
 */
const INPUT_TYPE_COLOR = 'color' as const;

/**
 * Value of the `type` attribute for `<input>` elements considered as time pickers.
 */
const INPUT_TYPE_TIME = 'time' as const;

/**
 * Value of the `type` attribute for `<input>` elements considered as week pickers.
 */
const INPUT_TYPE_WEEK = 'week' as const;

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
    case INPUT_TYPE_MONTH:
      return getInputDateLikeFieldValue(inputEl as HTMLInputDateLikeElement, options);
    case INPUT_TYPE_TEXT:
    case INPUT_TYPE_SEARCH:
      return getInputTextualFieldValue(inputEl as HTMLInputTextualElement, options);
    case INPUT_TYPE_HIDDEN:
      return getInputHiddenFieldValue(inputEl as HTMLInputHiddenElement, options);
    case INPUT_TYPE_EMAIL:
    case INPUT_TYPE_TEL:
    case INPUT_TYPE_URL:
    case INPUT_TYPE_PASSWORD:
    case INPUT_TYPE_COLOR:
    case INPUT_TYPE_TIME:
    case INPUT_TYPE_WEEK:
    default:
      break;
  }

  return inputEl.value;
};

/**
 * Sets the value of a generic `<input>` element.
 * @param inputEl - The element.
 * @param value - Value of the input element.
 * @param nthOfName - What order is this field in with respect to fields of the same name?
 * @param elementsWithSameName - How many fields with the same name are in the form?
 */
const setInputGenericFieldValue = (
  inputEl: HTMLInputElement,
  value: unknown,
  nthOfName: number,
  elementsWithSameName: HTMLInputElement[],
) => {
  if (Array.isArray(value) && elementsWithSameName.length > 1) {
    // eslint-disable-next-line no-param-reassign
    inputEl.value = value[nthOfName];
    return;
  }

  // eslint-disable-next-line no-param-reassign
  inputEl.value = value as string;
};

/**
 * Sets the value of an `<input>` element.
 *
 * **Note:** This function is a noop for `<input type="file">` because by design, file inputs are
 * not assignable programmatically.
 * @param inputEl - The element.
 * @param value - Value of the input element.
 * @param nthOfName - What order is this field in with respect to fields of the same name?
 * @param elementsWithSameName - How many fields with the same name are in the form?
 */
const setInputFieldValue = (
  inputEl: HTMLInputElement,
  value: unknown,
  nthOfName: number,
  elementsWithSameName: HTMLInputElement[],
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
        elementsWithSameName as HTMLInputNumericElement[],
      );
      return;
    case INPUT_TYPE_DATE:
    case INPUT_TYPE_DATETIME_LOCAL:
    case INPUT_TYPE_MONTH:
      setInputDateLikeFieldValue(
        inputEl as HTMLInputDateLikeElement,
        value,
        nthOfName,
        elementsWithSameName as HTMLInputDateLikeElement[],
      );
      return;
    case INPUT_TYPE_HIDDEN:
      setInputHiddenFieldValue(
        inputEl as HTMLInputHiddenElement,
        value,
        nthOfName,
        elementsWithSameName as HTMLInputHiddenElement[],
      );
      return;
    case INPUT_TYPE_TEXT:
    case INPUT_TYPE_SEARCH:
    case INPUT_TYPE_EMAIL:
    case INPUT_TYPE_TEL:
    case INPUT_TYPE_URL:
    case INPUT_TYPE_PASSWORD:
    case INPUT_TYPE_COLOR:
    case INPUT_TYPE_TIME:
    case INPUT_TYPE_WEEK:
    default:
      break;
  }

  setInputGenericFieldValue(inputEl, value, nthOfName, elementsWithSameName);
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
 * Gets the value of an element regardless if it's a field element or not.
 * @param el - The field element.
 * @param options - The options.
 * @returns Value of the element.
 */
export const getValue = (el: HTMLElement, options = {} as GetFieldValueOptions) => {
  switch (el.tagName) {
    case TAG_NAME_TEXTAREA:
      return getTextAreaFieldValue(el as HTMLTextAreaElement, options);
    case TAG_NAME_SELECT:
      return getSelectFieldValue(el as HTMLSelectElement);
    case TAG_NAME_INPUT:
      return getInputFieldValue(el as HTMLInputElement, options);
    default:
      break;
  }

  return 'value' in el ? el.value : null;
};

/**
 * Sets the value of a field element.
 * @param el - The field element.
 * @param value - Value of the field element.
 * @param nthOfName - What order is this field in with respect to fields of the same name?
 * @param elementsWithSameName - How many fields with the same name are in the form?
 */
const setFieldValue = (
  el: HTMLElement,
  value: unknown,
  nthOfName: number,
  elementsWithSameName: HTMLElement[],
) => {
  switch (el.tagName) {
    case TAG_NAME_TEXTAREA:
      setTextAreaFieldValue(
        el as HTMLTextAreaElement,
        value,
        nthOfName,
        elementsWithSameName as HTMLTextAreaElement[],
      );
      return;
    case TAG_NAME_SELECT:
      setSelectFieldValue(
        el as HTMLSelectElement,
        value,
        nthOfName,
        elementsWithSameName as HTMLSelectElement[],
      );
      return;
    case TAG_NAME_INPUT:
    default:
      break;
  }

  setInputFieldValue(
    el as HTMLInputElement,
    value,
    nthOfName,
    elementsWithSameName as HTMLInputElement[],
  );
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
 * Value for the name attribute of the reserved name `isindex`.
 */
const NAME_ATTRIBUTE_VALUE_ISINDEX = 'isindex' as const;

/**
 * Determines if an element's value is included when its form is submitted.
 * @param el - The element.
 * @returns Value determining if the element's value is included when its form is submitted.
 */
export const isElementValueIncludedInFormSubmit = (el: HTMLElement) => {
  const namedEl = el as unknown as Record<string, unknown>;
  return (
    typeof namedEl[ATTRIBUTE_NAME] === 'string'
    && namedEl[ATTRIBUTE_NAME].length > 0
    && namedEl[ATTRIBUTE_NAME] !== NAME_ATTRIBUTE_VALUE_ISINDEX
    && !(ATTRIBUTE_DISABLED in namedEl && Boolean(namedEl[ATTRIBUTE_DISABLED]))
    && isFieldElement(namedEl as unknown as HTMLElement)
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
    && isElementValueIncludedInFormSubmit(el)
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
      const fieldValue = getValue(el, options);
      if (fieldValue === null) {
        return theFormValues;
      }

      const { name: fieldName } = el;
      const { [fieldName]: oldFormValue = null } = theFormValues;

      if (oldFormValue !== null && !Array.isArray(oldFormValue)) {
        return {
          ...theFormValues,
          [fieldName]: [oldFormValue, fieldValue],
        };
      }

      if (Array.isArray(oldFormValue)) {
        if (Array.isArray(fieldValue)) {
          return {
            ...theFormValues,
            [fieldName]: [...oldFormValue, ...fieldValue],
          };
        }
        return {
          ...theFormValues,
          [fieldName]: [...oldFormValue, fieldValue],
        };
      }

      return {
        ...theFormValues,
        [fieldName]: fieldValue,
      };

      // return {
      //   ...theFormValues,
      //   [fieldName]: [...oldFormValue, fieldValue],
      // };
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
 * Normalizes input for setting form values.
 * @param values - The values as they are provided to set.
 * @returns The normalized values.
 * @see setFormValues
 */
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

  const elementsWithSameName = fieldElements
    .filter(([, el]) => el.name in objectValues)
    .reduce(
      (currentCount, [, el]) => {
        if (el.tagName === TAG_NAME_INPUT && el.type === INPUT_TYPE_RADIO) {
          return {
            ...currentCount,
            [el.name]: [el],
          };
        }

        return {
          ...currentCount,
          [el.name]: (
            Array.isArray(currentCount[el.name])
              ? [...currentCount[el.name], el]
              : [el]
          ),
        };
      },
      {} as Record<string, HTMLElement[]>,
    );

  const nthElementOfName = {} as Record<string, number>;

  fieldElements
    .filter(([, el]) => el.name in objectValues)
    .forEach(([, el]) => {
      nthElementOfName[el.name] = (
        typeof nthElementOfName[el.name] === 'number'
          ? nthElementOfName[el.name] + 1
          : 0
      );

      setFieldValue(
        el,
        objectValues[el.name],
        nthElementOfName[el.name],
        elementsWithSameName[el.name],
      );
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
