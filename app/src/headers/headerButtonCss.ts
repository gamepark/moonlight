import { css } from '@emotion/react'

/**
 * Inline buttons rendered inside a header `<Trans>` inherit the framework button
 * padding/border, which makes their box taller than the header text line and
 * overflows the header bar vertically. Keep them tight and aligned to the text.
 */
export const headerButtonCss = css`
  vertical-align: middle;
  font-size: 0.8em;
  padding: 0.1em 0.7em;
  line-height: 1.2;
  transform: translateY(-0.07em);
`
