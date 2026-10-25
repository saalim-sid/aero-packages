import type {CmsPageData} from '@platform/core/types/cms'
export type TurnstileApi = {
  render: (el: HTMLElement, opts: Record<string, unknown>) => string
  reset: (id?: string) => void
  remove: (id: string) => void
}
export interface FormValidation {
  errors: Record<string, string>
  errorId: (name: string) => string
  validate: (form: HTMLFormElement) => boolean
  formProps: {
    noValidate: true
    onBlur: (e: import('react').FocusEvent<HTMLFormElement>) => void
    onChange: (e: import('react').ChangeEvent<HTMLFormElement>) => void
  }
  reset: () => void
}

export type Field = HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement

export interface AccountClientProps {
  page?: CmsPageData | null
  plugins: string[] | null
}
