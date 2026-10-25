'use client'

import type {Field, FormValidation} from '@platform/core/types/forms'
import {type ChangeEvent, type FocusEvent, useCallback, useId, useMemo, useState} from 'react'

export const PATTERNS = {
  personName: "[\\p{L}][\\p{L}\\p{M} '’.\\-]{0,79}",
  phone: '\\+?[0-9 \\(\\)\\-]{7,20}',
  username: '[A-Za-z0-9_.\\-]{3,30}',
  password: '(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9\\s]).{8,}',
  orderReference: '[A-Za-z0-9 _\\-#\\/.]{3,100}'
} as const

export const MESSAGES = {
  personName: 'Use letters only (spaces, hyphens and apostrophes are fine).',
  phone: 'Enter a phone number with 7 to 20 digits, e.g. 07700 900123 or +44 7700 900123.',
  username: 'Use 3-30 letters, numbers, dots, dashes or underscores.',
  password:
    'Use at least 8 characters with an upper-case letter, a lower-case letter, a number and a symbol.',
  orderReference: 'Use 3-100 letters, numbers, spaces or - _ # / .'
} as const

const isField = (el: unknown): el is Field =>
  el instanceof HTMLInputElement ||
  el instanceof HTMLTextAreaElement ||
  el instanceof HTMLSelectElement

function checkable(el: Field): boolean {
  if (!el.name || el.disabled || el.name === '_hp') return false
  return !(
    el instanceof HTMLInputElement && ['hidden', 'submit', 'button', 'reset'].includes(el.type)
  )
}

function labelOf(el: Field): string {
  const text =
    el.labels?.[0]?.textContent ||
    el.getAttribute('aria-label') ||
    el.getAttribute('placeholder') ||
    ''
  const clean = text.replace(/\(optional\)|\*/gi, '').trim()
  if (!clean) return 'this field'
  const lower = clean.charAt(0).toLowerCase() + clean.slice(1)
  return /^(your|the|a|an|option|who|why)\b/i.test(lower) ? lower : `your ${lower}`
}

export function messageFor(el: Field, form?: HTMLFormElement | null): string {
  if (!checkable(el)) return ''
  const v = el.validity
  const text = el instanceof HTMLSelectElement ? el.value : el.value.trim()
  const isChoice = el instanceof HTMLInputElement && (el.type === 'checkbox' || el.type === 'radio')

  if (v.valueMissing || (el.required && !isChoice && !text)) {
    if (el instanceof HTMLSelectElement) return 'Please choose an option.'
    if (el instanceof HTMLInputElement && el.type === 'checkbox')
      return 'Please tick this box to continue.'
    if (el instanceof HTMLInputElement && el.type === 'radio') return 'Please choose one.'
    return `Please enter ${labelOf(el)}.`
  }
  if (!text) return '' // optional and empty
  if (v.typeMismatch) {
    if (el.type === 'email') return 'Enter a valid email address, like name@example.com.'
    if (el.type === 'url') return 'Enter a full web address, starting with https://'
    return 'Please check the format.'
  }
  if (v.badInput) return el.type === 'number' ? 'Enter a number.' : 'Please check this value.'
  if (!(el instanceof HTMLSelectElement)) {
    const min = el.minLength
    const max = el.maxLength
    if (min > 0 && text.length < min)
      return `Use at least ${min} characters (you have ${text.length}).`
    if (max > 0 && el.value.length > max) return `Use ${max} characters or fewer.`
  }
  if (v.patternMismatch) return el.dataset.message || el.title || 'Please check the format.'
  if (v.rangeUnderflow)
    return el.type === 'date'
      ? `Choose a date on or after ${(el as HTMLInputElement).min}.`
      : `Enter ${(el as HTMLInputElement).min} or more.`
  if (v.rangeOverflow)
    return el.type === 'date'
      ? `Choose a date on or before ${(el as HTMLInputElement).max}.`
      : `Enter ${(el as HTMLInputElement).max} or less.`
  if (v.stepMismatch) return 'Use at most 2 decimal places.'
  const match = el.dataset.match
  if (match && form) {
    const other = form.elements.namedItem(match)
    if (isField(other) && other.value !== el.value)
      return el.dataset.matchMessage || 'This doesn’t match.'
  }
  return ''
}

export function useFormValidation(): FormValidation {
  const prefix = useId()
  const [errors, setErrors] = useState<Record<string, string>>({})
  const errorId = useCallback((name: string) => `${prefix}-${name}-error`, [prefix])

  const mark = useCallback(
    (el: Field, msg: string) => {
      el.setAttribute('aria-invalid', msg ? 'true' : 'false')
      if (msg) el.setAttribute('aria-describedby', errorId(el.name))
      else if (el.getAttribute('aria-describedby') === errorId(el.name))
        el.removeAttribute('aria-describedby')
    },
    [errorId]
  )

  const checkOne = useCallback(
    (el: Field) => {
      const msg = messageFor(el, el.form)
      mark(el, msg)
      setErrors((cur) => {
        if ((cur[el.name] || '') === msg) return cur
        const next = {...cur}
        if (msg) next[el.name] = msg
        else delete next[el.name]
        return next
      })
    },
    [mark]
  )

  const validate = useCallback(
    (form: HTMLFormElement) => {
      const next: Record<string, string> = {}
      let first: Field | null = null
      for (const el of Array.from(form.elements)) {
        if (!isField(el) || !checkable(el)) continue
        const msg = next[el.name] ? '' : messageFor(el, form)
        mark(el, msg || (next[el.name] ? 'x' : ''))
        if (msg) {
          next[el.name] = msg
          first ||= el
        }
      }
      setErrors(next)
      first?.focus()
      return !first
    },
    [mark]
  )

  const formProps = useMemo(
    () => ({
      noValidate: true as const,
      onBlur: (e: FocusEvent<HTMLFormElement>) => {
        if (
          isField(e.target) &&
          (e.target.value || e.target.getAttribute('aria-invalid') === 'true')
        )
          checkOne(e.target)
      },
      onChange: (e: ChangeEvent<HTMLFormElement>) => {
        if (isField(e.target) && e.target.getAttribute('aria-invalid') === 'true')
          checkOne(e.target)
      }
    }),
    [checkOne]
  )

  return {errors, errorId, validate, formProps, reset: () => setErrors({})}
}
