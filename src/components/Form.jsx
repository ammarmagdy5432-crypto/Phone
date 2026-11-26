import { useId } from 'react';
import { Icon } from './Icons';

/** Labelled form control with hint + inline error support. */
export function Field({ label, error, hint, optional, children, className = '', id: idProp, counter }) {
  const autoId = useId();
  const id = idProp || autoId;
  const describedBy = [error && `${id}-error`, hint && `${id}-hint`].filter(Boolean).join(' ') || undefined;

  return (
    <div className={`field ${error ? 'has-error' : ''} ${className}`}>
      <div className="field-label-row">
        <label className="field-label" htmlFor={id}>
          {label}
          {optional && <span className="field-optional"> (optional)</span>}
        </label>
        {counter}
      </div>
      {children({ id, 'aria-invalid': error ? true : undefined, 'aria-describedby': describedBy })}
      {error ? (
        <p className="field-error" id={`${id}-error`}>
          <Icon name="alert" size={14} /> {error}
        </p>
      ) : (
        hint && (
          <p className="field-hint" id={`${id}-hint`}>
            {hint}
          </p>
        )
      )}
    </div>
  );
}

export const validators = {
  required: (msg = 'This field is required.') => (v) => (String(v ?? '').trim() ? null : msg),
  email: (v) => (/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(v).trim()) ? null : 'Enter a valid email address.'),
  minLength: (n, label = 'This field') => (v) =>
    String(v).trim().length >= n ? null : `${label} must be at least ${n} characters.`,
  pattern: (re, msg) => (v) => (re.test(String(v).trim()) ? null : msg),
};

/** Runs a { field: [validators] } schema and returns an { field: message } map. */
export function validate(values, schema) {
  const errors = {};
  Object.entries(schema).forEach(([key, rules]) => {
    for (const rule of rules) {
      const message = rule(values[key], values);
      if (message) {
        errors[key] = message;
        break;
      }
    }
  });
  return errors;
}

/** Focus + scroll the first invalid control inside a form. */
export function focusFirstError(form) {
  const el = form?.querySelector('[aria-invalid="true"]');
  if (el) {
    el.focus({ preventScroll: true });
    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}
