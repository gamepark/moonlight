import { css } from '@emotion/react'

export const helpHeaderCss = css`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 0.6em;
  margin-bottom: 0.6em;
`

export const helpChooseBtnCss = css`
  flex-shrink: 0;
  padding: 0.35em 0.8em;
  font-size: 0.78em;
  font-weight: 700;
  border-radius: 0.35em;
  border: 1px solid rgba(200, 152, 40, 0.4);
  background: rgba(200, 152, 40, 0.12);
  color: #d4ac40;
  cursor: pointer;
  letter-spacing: 0.03em;
  white-space: nowrap;
  transition: background 0.15s;
  &:hover {
    background: rgba(200, 152, 40, 0.22);
  }
`
