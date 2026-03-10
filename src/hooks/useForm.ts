'use client';

import { useCallback, useState } from 'react';

interface FormField {
    value: string;
    error: string;
    touched: boolean;
}

type FormFields<T extends string> = Record<T, FormField>;

/**
 * Hook for managing form state, validation, and submission
 */
export function useForm<T extends string>(
    fieldNames: T[],
    initialValues?: Partial<Record<T, string>>
) {
    const [fields, setFields] = useState<FormFields<T>>(() => {
        const initial = {} as FormFields<T>;
        for (const name of fieldNames) {
            initial[name] = {
                value: initialValues?.[name] || '',
                error: '',
                touched: false,
            };
        }
        return initial;
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    const setValue = useCallback((name: T, value: string) => {
        setFields((prev) => ({
            ...prev,
            [name]: { ...prev[name], value, touched: true, error: '' },
        }));
    }, []);

    const setError = useCallback((name: T, error: string) => {
        setFields((prev) => ({
            ...prev,
            [name]: { ...prev[name], error },
        }));
    }, []);

    const setErrors = useCallback((errors: Partial<Record<T, string>>) => {
        setFields((prev) => {
            const next = { ...prev };
            for (const [name, error] of Object.entries(errors)) {
                if (next[name as T]) {
                    next[name as T] = { ...next[name as T], error: error as string };
                }
            }
            return next;
        });
    }, []);

    const reset = useCallback(() => {
        setFields((prev) => {
            const next = { ...prev };
            for (const name of fieldNames) {
                next[name] = {
                    value: initialValues?.[name] || '',
                    error: '',
                    touched: false,
                };
            }
            return next;
        });
        setIsSubmitting(false);
    }, [fieldNames, initialValues]);

    const getValues = useCallback((): Record<T, string> => {
        const values = {} as Record<T, string>;
        for (const name of fieldNames) {
            values[name] = fields[name].value;
        }
        return values;
    }, [fields, fieldNames]);

    const isValid = Object.values(fields).every((f) => !(f as FormField).error);

    return {
        fields,
        setValue,
        setError,
        setErrors,
        reset,
        getValues,
        isSubmitting,
        setIsSubmitting,
        isValid,
    };
}
