# get-form-values

Get the value of a form using `HTMLFormElement.elements`.

## Installation

The library is not yet out on any package manager. Installing through the URL is the preferred way.

## Usage

```typescript
import getFormValues from '@theoryofnekomata/get-form-values';

const form = document.getElementById('form')

// optional, but just in case there are multiple submit buttons in the form,
// individual submitters can be considered
const submitter = form.querySelector('[type="submit"]')

const values = getFormValues(form, submitter)
```

## Tests

The library has been tested on JSDOM through Jest, and the real DOM using
Cypress.
