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
<button id="autofill" type="button">
  Autofill login form
</button>

<form id="loginForm">
  <input type="text" name="username" />
  <input type="password" name="password" />
  <button type="submit" name="type" value="client">
    Log In As Client
  </button>
  <button type="submit" name="type" value="admin">
    Log In As Admin
  </button>
</form>

<label>
  <input type="checkbox" name="remember" form="loginForm" />
  Remember my login credentials
</label>
```

Use the library as follows (code is in TypeScript, but can work with JavaScript as well):

```typescript
import { getFormValues, setFormValues } from '@theoryofnekomata/formxtra';

// This is the only query we need. On libraries like React, we can easily get form elements when we
// attach submit event listeners.
const form: HTMLFormElement = document.getElementById('form');

const processResponse = async (response: Response) => {
  const result = await response.json();

  alert(`Welcome ${result.user}!`);
};

// Best use case is with event handlers
form.addEventListener('submit', async e => {
  const {
    currentTarget: thisForm,
    submitter,
  } = e;
  e.preventDefault();

  const values = getFormValues(thisForm, { submitter });

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
    processResponse(response);
  }
});

const autofillButton = document.getElementById('autofill');

autofillButton.addEventListener('click', e => {
  setFormValues(form, { username: 'admin', remember: true });
});
```

## Tests

The library has been tested on the static DOM using JSDOM, and the real dynamic DOM using Cypress.
