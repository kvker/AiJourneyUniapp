import { ref } from 'vue'

export function useConfig() {
  // @ts-ignore
  const isDevRef = ref(process.env.NODE_ENV === 'development')

  return {
    isDevRef
  }
}