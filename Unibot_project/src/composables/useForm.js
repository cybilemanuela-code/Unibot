/**
 * useForm — reusable form state + validation composable
 *
 * WHY A COMPOSABLE?
 * Every form (register, login, settings) needs the same patterns:
 * field values, error messages, loading state, and a submit handler.
 * Instead of duplicating this in every component, we extract it here.
 *
 * Usage:
 *   const { fields, errors, loading, validate, handleSubmit } = useForm(schema, onSubmit)
 */
import { reactive, ref } from 'vue'
import { getFirebaseErrorMessage } from '@/utils/firebaseErrors'

export function useForm(initialFields, validators = {}) {
  const fields  = reactive({ ...initialFields })
  const errors  = reactive({})
  const loading = ref(false)
  const serverError = ref('')

  // Run all validators for a single field
  function validateField(name) {
    const rule = validators[name]
    if (!rule) { errors[name] = ''; return true }
    const result = rule(fields[name], fields)
    errors[name] = result === true ? '' : result
    return result === true
  }

  // Validate all fields at once — returns true if all pass
  function validate() {
    let valid = true
    for (const name of Object.keys(validators)) {
      if (!validateField(name)) valid = false
    }
    return valid
  }

  // Wraps the submit callback with loading state + error reset
  async function handleSubmit(submitFn) {
    serverError.value = ''
    if (!validate()) return
    loading.value = true
    try {
      await submitFn(fields)
    } catch (err) {
      serverError.value =
        err?.response?.data?.error ||
        getFirebaseErrorMessage(err) ||
        err.message ||
        'Something went wrong.'
    } finally {
      loading.value = false
    }
  }

  return { fields, errors, loading, serverError, validate, validateField, handleSubmit }
}