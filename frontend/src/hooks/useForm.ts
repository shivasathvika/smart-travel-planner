import { useState, useCallback, useEffect } from 'react';
import { useFormik, FormikConfig, FormikValues } from 'formik';
import useError from './useError';
import useLoading from './useLoading';
import analyticsService from '../services/analytics/analyticsService';
import offlineService from '../services/offline/offlineService';
import { useSnackbar } from 'notistack';

interface UseFormOptions<T extends FormikValues> extends Omit<FormikConfig<T>, 'onSubmit'> {
  onSubmit: (values: T) => Promise<any>;
  analyticsAction?: string;
  offlineKey?: string;
  successMessage?: string;
}

interface UseFormReturn<T extends FormikValues> {
  formik: ReturnType<typeof useFormik<T>>;
  isSubmitting: boolean;
  submitError: Error | null;
  resetForm: () => void;
}

export function useForm<T extends FormikValues>({
  initialValues,
  validationSchema,
  onSubmit,
  analyticsAction,
  offlineKey,
  successMessage = 'Changes saved successfully',
  ...formikConfig
}: UseFormOptions<T>): UseFormReturn<T> {
  const [submitError, setSubmitError] = useState<Error | null>(null);
  const { handleError } = useError();
  const { isLoading, withLoading } = useLoading();
  const { enqueueSnackbar } = useSnackbar();

  // Load saved form data from offline storage if available
  useEffect(() => {
    if (offlineKey) {
      offlineService.getOfflineData(offlineKey).then((savedData) => {
        if (savedData) {
          formik.setValues(savedData.data);
        }
      });
    }
  }, [offlineKey]);

  const handleSubmit = useCallback(
    async (values: T) => {
      try {
        setSubmitError(null);

        // Save form data to offline storage before submission
        if (offlineKey) {
          await offlineService.saveOfflineData(offlineKey, values);
        }

        // Submit the form
        const result = await withLoading(onSubmit(values));

        // Track the action in analytics
        if (analyticsAction) {
          analyticsService.trackEvent('form', analyticsAction, undefined, undefined);
        }

        // Show success message
        enqueueSnackbar(successMessage, {
          variant: 'success',
          autoHideDuration: 3000,
        });

        // Clear offline data after successful submission
        if (offlineKey) {
          await offlineService.saveOfflineData(offlineKey, null);
        }

        return result;
      } catch (error) {
        const errorObject = error instanceof Error ? error : new Error(String(error));
        setSubmitError(errorObject);
        handleError(error, 'Form submission failed');
        throw error;
      }
    },
    [onSubmit, withLoading, analyticsAction, offlineKey, successMessage, enqueueSnackbar, handleError]
  );

  const formik = useFormik<T>({
    initialValues,
    validationSchema,
    onSubmit: handleSubmit,
    ...formikConfig,
  });

  const resetForm = useCallback(() => {
    formik.resetForm();
    setSubmitError(null);
  }, [formik]);

  // Save form data to offline storage when values change
  useEffect(() => {
    if (offlineKey && formik.dirty) {
      const debounceTimer = setTimeout(() => {
        offlineService.saveOfflineData(offlineKey, formik.values);
      }, 1000);

      return () => clearTimeout(debounceTimer);
    }
  }, [offlineKey, formik.values, formik.dirty]);

  return {
    formik,
    isSubmitting: isLoading,
    submitError,
    resetForm,
  };
}

export default useForm;
