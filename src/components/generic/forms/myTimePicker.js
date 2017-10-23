import React from 'react';

import TimePicker from 'material-ui/TimePicker';
import areIntlLocalesSupported from 'intl-locales-supported';

let DateTimeFormat;

/**
 * Use the native Intl.DateTimeFormat if available, or a polyfill if not.
 */
if (areIntlLocalesSupported(['pt', 'pt-BR'])) {
  DateTimeFormat = global.Intl.DateTimeFormat;
} else {
  const IntlPolyfill = require('intl');
  DateTimeFormat = IntlPolyfill.DateTimeFormat;
  require('intl/locale-data/jsonp/pt');
  require('intl/locale-data/jsonp/pt-BR');
}

export const renderTimePicker = ({
  input,
  label,
  meta: { touched, error },
  children,
  ...custom
}) => (
  <TimePicker
    floatingLabelText={label}
    format={DateTimeFormat}
    // format="24hr"
    locale="pt-br"
    errorText={touched && error}
    {...input}
    onChange={(event, value) => {
      input.onChange(value);
    }}
    children={children}
    {...custom}
  />
);
