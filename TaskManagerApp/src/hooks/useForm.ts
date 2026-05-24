import { useCallback, useState, Dispatch, SetStateAction } from 'react';

type Errors<T> = Partial<Record<keyof T, string>>;
type Touched<T> = Partial<Record<keyof T, boolean>>;

interface UseFormResult<T> {
  values: T;
  errors: Errors<T>;
  touched: Touched<T>;
  handleChange: <K extends keyof T>(field: K, value: T[K]) => void;
  handleBlur: (field: keyof T) => void;
  validateAll: () => boolean;
  reset: () => void;
  setValues: Dispatch<SetStateAction<T>>;
}

/**
 * Lightweight, generic form hook: manages values, touched fields, and validation.
 *
 * @param initialValues  object of field -> initial value
 * @param validate       (values) => errors map
 */
export function useForm<T extends object>(
  initialValues: T,
  validate?: (values: T) => Errors<T>
): UseFormResult<T> {
  const [values, setValues] = useState<T>(initialValues);
  const [touched, setTouched] = useState<Touched<T>>({});
  const [errors, setErrors] = useState<Errors<T>>({});

  const handleChange = useCallback(
    <K extends keyof T>(field: K, value: T[K]) => {
      setValues((prev) => {
        const next = { ...prev, [field]: value };
        // Re-validate live so errors clear as the user fixes them.
        if (validate) setErrors(validate(next));
        return next;
      });
    },
    [validate]
  );

  const handleBlur = useCallback((field: keyof T) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  }, []);

  /** Validate every field at once (call on submit). Returns true if valid. */
  const validateAll = useCallback((): boolean => {
    if (!validate) return true;
    const nextErrors = validate(values);
    setErrors(nextErrors);
    // Mark all fields touched so messages become visible.
    const allTouched = Object.keys(values).reduce<Touched<T>>((acc, k) => {
      acc[k as keyof T] = true;
      return acc;
    }, {});
    setTouched(allTouched);
    return Object.keys(nextErrors).length === 0;
  }, [validate, values]);

  const reset = useCallback(() => {
    setValues(initialValues);
    setTouched({});
    setErrors({});
  }, [initialValues]);

  return { values, errors, touched, handleChange, handleBlur, validateAll, reset, setValues };
}
