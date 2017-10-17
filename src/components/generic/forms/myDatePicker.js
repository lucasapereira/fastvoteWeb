import React from 'react';

import DatePicker from 'material-ui/DatePicker';
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

export const renderDatePicker = ({
  input,
  label,
  meta: { touched, error },
  children,
  ...custom
}) => (
  <DatePicker
    floatingLabelText={label}
    DateTimeFormat={DateTimeFormat}
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
