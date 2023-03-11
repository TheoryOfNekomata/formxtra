# formxtra

![formxtra logo](./docs/assets/formxtra.svg)

**The companion for Web forms!**

Extract and set form values through the DOM.

## Installation

The package can be found on:

- [Modal Pack](https://js.pack.modal.sh)
- [npm](https://npmjs.com/package/@theoryofnekomata/formxtra)
- [GitHub Package Registry](https://github.com/TheoryOfNekomata/formxtra/packages/793279)

## Usage

For an example form:

```html
<!-- ...  -->

<form id="loginForm">
	<input type="text" name="username" />
	<input type="password" name="password" />
	<button type="submit" name="type" value="client">Log In As Client</button>
	<button type="submit" name="type" value="admin">Log In As Admin</button>
</form>

<label>
	<input type="checkbox" name="remember" form="loginForm" />
	Remember my login credentials
</label>

<!-- ... --->
```

Use the library as follows (code is in TypeScript, but can work with JavaScript as well):

```typescript
// The default export is same with `getFormValues`, but it is recommended to use the named import for future-proofing!
import { getFormValues, setFormValues } from '@theoryofnekomata/formxtra';

// This is the only query we need. On libraries like React, we can easily get form elements when we attach submit event
// listeners.
const form: HTMLFormElement = document.getElementById('form');

// Optional, but just in case there are multiple submit buttons in the form,
// individual submitters can be considered
const submitter = form.querySelector('[type="submit"][name="type"][value="client"]');

const values = getFormValues(form, { submitter });

const processResult = (result: Record<string, unknown>) => {
    setFormValues(form, {
        username: 'Username',
        password: 'verylongsecret',
    });
  
	throw new Error('Not yet implemented.');
};

// Best use case is with event handlers
form.addEventListener('submit', async e => {
	const { currentTarget: form, submitter } = e;
	e.preventDefault();

	const values = getFormValues(form, { submitter });

	// Get the form values and send as request to some API
	const response = await fetch(
		'https://example.com/api/log-in',
		{
			method: 'POST',
			body: JSON.stringify(values),
			headers: {
				'Content-Type': 'application/json',
			},
		},
	);

	if (response.ok) {
		const result = await response.json();

		processResult(result);
	}
})
```

## Tests

The library has been tested on the static DOM using JSDOM, and the real dynamic DOM using Cypress.

## Motivation

Forms are used to package related data, typically sent to an external location or processed internally. In the browser,
the default behavior of submitting form data is not always preferred, as this is done through loading or reloading a
document as soon as the form is submitted. In addition, [applications have limited control over how the data are
formatted on submission](https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#dom-fs-enctype) with
this approach. This is why the new way of sending form data is done through AJAX/fetch requests, wherein the data are
serialized into formats like JSON. To turn form data into a specific format requires access to the elements holding the
values to each field in the form.

Libraries made for extracting form values query field elements in the DOM, which is inefficient since they need to
traverse the DOM tree in some way, using methods such as `document.getElementsByTagName()` and
`document.querySelector()`. This is the same case with setting each form values for, say, prefilling values to save
time. It might be a simple improvement to the user experience, but the logic behind can be unwieldy as there may be
inconsistencies in setting up each field value depending on the form library being used.

Upon retrieving the field values somehow, some libraries attempt to duplicate the values of the fields as they change,
for instance by attaching event listeners and storing the new values into some internal object or map. This is then
retrieved by some other exposed function or mechanism within that library. This is common with reactive frameworks,
where changes to the document are essential to establish functionality and improved user experience.

---

With `formxtra`, there is no need to traverse elements for individual fields to get and set their values, provided they are:

* Associated to the form (either as a descendant of the `<form>` element or [associated through the `form=""`
  attribute](https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#attr-fae-form))
* Has a valid `name`

The values of these fields can be easily extracted and set, using the `form.elements` attribute built-in to the DOM.
With this, only the reference to the form is needed. The current state of the field elements is already stored in the
DOM, waiting to be accessed.

Additional documentation can be found on the [`docs` directory](./docs).
