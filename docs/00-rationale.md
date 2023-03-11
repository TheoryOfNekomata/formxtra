# Rationale

**Why the need for another form library?**

Let us set some facts about existing form libraries:

* Form libraries, especially framework-specific ones have verbose syntax.
  * Please go to your form library of choice and compare the syntax yourself.
* Form libraries are dependent on the architecture of the framework (such as [React Hook Form](https://www.npmjs.com/package/react-hook-form) and [Formik](https://www.npmjs.com/package/formik)) and
  requires using their features.
* Form libraries have differing ways on how to manage state, usually piggybacking on the data flow of the framework they
  are dependent on.
* Form libraries are relatively complex to what they are supposed to be doing such as providing wrappers to custom
  components, in which compatibility should be in the hands of the component author.

**What does `formxtra` offer?**

* `formxtra` aims to simplify the syntax to just invoking two functions - `getFormValues()` and `setFormValues()`.
* `formxtra` is not dependent to any library and is highly interoperable.
* `formxtra` is dependent only to the DOM. Since accessing the DOM is fully synchronous, the same can be said for the
  entire operation of `formxtra`.
* There are no other paradigms introduced by `formxtra`. For the library to do its intentions, it only requires
  respecting the HTML DOM spec, such as providing names to inputs and binding them correctly to forms, which is what
  all (data-driven) websites should do anyway.
* `formxtra` is lightweight, even smaller than [React Hook Form](https://www.npmjs.com/package/react-hook-form) and [Formik](https://www.npmjs.com/package/formik).
* `formxtra` is already type-safe, being written in TypeScript and providing types, thanks to [pridepack](https://www.npmjs.com/package/pridepack) as a scaffold.

**What does `formxtra` not offer?**

* `formxtra` is not a validation library, nor does it provide utility functions for validation.
  * However, one could use `formxtra` in tandem with other validation libraries
    such as `ajv` or `yup` for instance, by validating the values returned by `getFormValues()`.
* `formxtra` does not provide compatibility to custom components.
  * Because custom components have different
    implementations that mostly favor user experience over compliance, `formxtra` does not guarantee it can work with them
    out of the box.
  * However, the solution for this is to provide a corresponding `<input type="hidden">` element for each custom\
    component, which should always get the latter's serializable value. In return, this can also simplify the submission
    of the form as the custom components' values are already in the form.
