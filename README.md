<header style="text-align: center; line-height: 1">
  <h1 style="margin: 0">
    <img src="./docs/assets/formxtra.svg" alt="formxtra"/>
  </h1>
  <h2 style="margin: 0">
    The companion for Web forms!
  </h2>
  <p style="font-size: 125%">
    Extract and set form values through the DOM&mdash;no frameworks required!
  </p>
  <p>
    Lightweight. Simple. It Just Works.
  </p>
</header>

## Installation

The package can be found on:

- [Modal Pack](https://js.pack.modal.sh)
- [npm](https://npmjs.com/package/@theoryofnekomata/formxtra)
- [GitHub Package Registry](https://github.com/TheoryOfNekomata/formxtra/packages/793279)

## Usage

1. Lay out your input elements (all valid input types supported including `<select>` and `<textarea>`) then bind them
   to a form:
   * Put them inside a `<form>`.
   * Alternatively, use the `form=""` attribute then specify the form `id` where they will be bound.
2. Add `name=""` attributes to your input elements.
3. Get your `<form>` element:
   * Query the form directly.
   * If you want to retrieve/set the form values through an individual input element (e.g. in the case of value change
     events like `onchange`), use the `inputElement.form` attribute.
4. Use `getFormValues()` to retrieve all bound input elements' values, or `setFormValues()` to set them (setting only
   some fields' values is supported).

### Example

For an example form:

```html
<form id="loginForm" aria-label="Login Form">
  <button id="autofill" type="button">
    Autofill login form (username: admin)
  </button>
  
  <hr />
  
  <fieldset>
    <legend>
      Login
    </legend>
    <div>
      <input type="text" name="username" placeholder="Username" />
    </div>
    <div>
      <input type="password" name="password" placeholder="Password" />
    </div>
    <div>
      <button type="submit" name="type" value="client">
        Log In As Client
      </button>
      <button type="submit" name="type" value="admin">
        Log In As Admin
      </button>
    </div>
  </fieldset>
</form>

<!-- Input elements can be placed outside the form element they are bound to. -->

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

// You can use fomrxtra directly with elements as long as they are bound to a form.
const autofillButton = document.getElementById('autofill');

autofillButton.addEventListener('click', e => {
  setFormValues(e.currentTarget.form, { username: 'admin', remember: true });
});
```

There are utility functions exported alongside `getFormValues()` and `setFormValues()`. You may want to use namespace
import with this library, i.e. `import * as formxtra from '@theoryofnekomata/formxtra'`.

See the [documentation folder](./docs) for more details.

## Tests

The library has been tested on the static DOM using JSDOM, and the real dynamic DOM using Cypress.

## License

[MIT](./LICENSE)
