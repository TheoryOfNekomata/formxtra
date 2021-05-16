# formxtr

Extract form values through the DOM.

## Motivation

There are many ways to lay out forms.

## Installation

The package can be found on:

- [Modal Pack](https://js.pack.modal.sh)
- [npm](https://npmjs.com/package/formxtr)
- [GitHub Package Registry](https://github.com/TheoryOfNekomata/formxtr/packages/784699)

## Usage

For an example form:

```html
<!-- ...  -->

<form id="form">
	<input type="text" name="username" />
	<input type="password" name="password" />
	<button type="submit" name="type" value="client">Log In As Client</button>
	<button type="submit" name="type" value="admin">Log In As Admin</button>
</form>

<!-- ... --->
```

Use the library as follows (code is in TypeScript, but can work with JavaScript as well):

```typescript
import getFormValues from '@theoryofnekomata/formxtr';

const form: HTMLFormElement = document.getElementById('form');

// optional, but just in case there are multiple submit buttons in the form,
// individual submitters can be considered
const submitter = form.querySelector('[type="submit"][name="type"][value="client"]');

const values = getFormValues(form, submitter);

const processResult = (result: Record<string, unknown>) => {
  throw new Error('Not yet implemented.');
};

// Best use case is with event handlers
form.addEventListener('submit', async e => {
	const { target: form, submitter } = e;
	e.preventDefault();

	const values = getFormValues(form, submitter);

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

The library has been tested on JSDOM through Jest, and the real DOM using Cypress.
