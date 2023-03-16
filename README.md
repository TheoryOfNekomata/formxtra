<p align="center" style="text-align: center !important; line-height: 1 !important; border: 0 !important;">
  <h1 align="center">
    <img src="https://raw.githubusercontent.com/TheoryOfNekomata/formxtra/master/docs/assets/formxtra.svg" alt="formxtra"/>
  </h1>
  <h2 align="center">
    The companion for Web forms!
  </h2>
  <div align="center">
    <big>
      Extract and set form values through the DOM&mdash;no frameworks required!
    </big>
  </div>
  <div align="center">
    Lightweight. Simple. It Just Works.
  </div>
</p>

## Installation and Sources

The package can be found on:

- [Modal Pack](https://js.pack.modal.sh)
- [npm](https://npmjs.com/package/@theoryofnekomata/formxtra)
- [GitHub Package Registry](https://github.com/TheoryOfNekomata/formxtra/packages/793279)

The package sources can be found on the [main Modal Code repository](https://code.modal.sh/TheoryOfNekomata/formxtra)
with an [active GitHub mirror](https://github.com/TheoryOfNekomata/formxtra).

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

Interactive code samples can be found on Codepen:

* [Vanilla JS usage](https://codepen.io/theoryofnekomata/pen/xxajmvJ)
* [React integration](https://codepen.io/theoryofnekomata/pen/RwYyvZN)
* [Vue integration](https://codepen.io/theoryofnekomata/pen/gOdzqzM)
* [Solid integration](https://codepen.io/theoryofnekomata/pen/QWVrYem)

For an example form:

```html
<form id="loginForm" aria-label="Login Form">
  <button id="autofill" type="button">
    Autofill login form (username: admin, remember: true)
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

const form: HTMLFormElement = document.getElementById('loginForm');

const processResponse = async (response: Response) => {
  const result = await response.json();

  alert(`Welcome ${result.user}!`);
};

// Use formxtra in event handlers
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
    return;
  }
  
  alert('Invalid login!');
});

// You can use fomrxtra directly with elements as long as they are bound to a form.
const autofillButton = document.getElementById('autofill');

autofillButton.addEventListener('click', e => {
  setFormValues(e.currentTarget.form, { username: 'admin', remember: true });
});
```

### API

These are all the exported methods in the library:

```typescript
import {
  getFormValues,
  setFormValues,
  getValue,
  isElementValueIncludedInFormSubmit,
  isFieldElement,
} from '@theoryofnekomata/formxtra';
```

One would usually need only the `getFormValues()` and `setFormValues()` functions, however if the utility functions are
needed, the proper usages are documented via TSDoc comments.

## Additional Information

The library has been tested on the static DOM using JSDOM, and the real dynamic DOM using Cypress. This is to guarantee
compatibility across environments.

See the [documentation folder](./docs) for more details on this library.

The sources are under the [MIT license](./LICENSE).
