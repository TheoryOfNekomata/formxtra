# Notes

* In Safari, the `submitter` attribute in the form submit event object does not work. To fix this, install the [event-submitter-polyfill package](https://www.npmjs.com/package/event-submitter-polyfill).
* `formxtra` is not yet tested on older browsers. If you want to help, please create a PR.
* The `<input type="file">` element does not support setting of values by design. As such, the logic for
  `setFormValues()` with file uploads do nothing.
