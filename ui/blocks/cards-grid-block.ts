import type {BlockComponent} from '@platform/core/types/platform'
import {Shell} from '@platform/ui/primitives'
import {CardsGridSection} from '@platform/ui/Sections'
import {createElement} from 'react'

export const cardsGridBlock = (field: string): BlockComponent =>
  function CardsGridBlock({component}) {
    return createElement(
      Shell,
      null,
      createElement(CardsGridSection, {
        eyebrow: component.eyebrow,
        title: component.titleText,
        lede: component.lede,
        items: component[field]
      })
    )
  }
