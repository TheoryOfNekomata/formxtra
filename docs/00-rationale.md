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
