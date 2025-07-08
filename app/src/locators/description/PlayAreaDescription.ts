import { css } from '@emotion/react'
import { DropAreaDescription } from '@gamepark/react-game'
import { wolfCardDescription } from '../../material/WolfCardDescription'

export class PlayAreaDescription extends DropAreaDescription {
  constructor() {
    super(wolfCardDescription)
  }

  extraCss = css`
    background-color: rgba(255, 255, 255, 0.4);
  `

  placeOnShortClick = true
}
