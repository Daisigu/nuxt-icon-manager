export const debounce = (func: CallableFunction, delay: number) => {
  let timeout: NodeJS.Timeout
  return (...args: never[]) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), delay)
  }
}
