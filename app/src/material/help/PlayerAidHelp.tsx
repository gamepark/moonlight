/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { MaterialHelpProps } from '@gamepark/react-game'
import { FC } from 'react'
import { Trans, useTranslation } from 'react-i18next'

export const PlayerAidHelp: FC<MaterialHelpProps> = () => {
  const { t } = useTranslation()

  return (
    <div css={containerCss}>
      <div css={titleCss}>{t('help.aid.title', 'Player Aid')}</div>

      <div css={sectionTitleCss}>{t('help.aid.moons', 'Moon majority')}</div>
      <p css={textCss}>
        <Trans i18nKey="help.aid.moons.desc" defaults="At the end of the round, the player with <b>the most visible moons</b> scores 2 bonus points. In case of a tie, nobody scores the bonus." components={{ b: <strong css={boldCss} /> }} />
      </p>

      <div css={separatorCss} />

      <div css={sectionTitleCss}>{t('help.aid.distrib', 'Wolves distribution')}</div>
      <p css={textCss}>
        {t('help.aid.distrib.desc', 'Each player starts with 11 wolves in their deck:')}
      </p>
      <div css={distribGridCss}>
        <span css={distribCellCss}>1 ×2</span>
        <span css={distribCellCss}>2 ×2</span>
        <span css={distribCellCss}>3 ×4</span>
        <span css={distribCellCss}>4 ×2</span>
        <span css={distribCellCss}>5 ×1</span>
      </div>
      <p css={noteTextCss}>
        {t('help.aid.distrib.note', 'Value 3 wolves come in 4 copies (2 normal + 2 with the +1 bonus icon).')}
      </p>
    </div>
  )
}

const containerCss = css`
  padding: 0.5em 0;
`

const titleCss = css`
  font-size: 1.1em;
  font-weight: 700;
  color: #d4ac40;
  margin-bottom: 0.5em;
`

const sectionTitleCss = css`
  font-size: 0.85em;
  font-weight: 700;
  margin-bottom: 0.3em;
`

const textCss = css`
  font-size: 0.88em;
  line-height: 1.55;
  margin-bottom: 0.5em;
`

const boldCss = css`
  color: #d4ac40;
`

const separatorCss = css`
  border-top: 1px solid rgba(200, 152, 40, 0.1);
  margin: 0.6em 0;
`

const distribGridCss = css`
  display: flex;
  gap: 0.5em;
  flex-wrap: wrap;
  margin-bottom: 0.5em;
`

const distribCellCss = css`
  display: inline-block;
  font-size: 0.85em;
  font-weight: 700;
  padding: 0.2em 0.6em;
  border-radius: 0.3em;
  background: rgba(200, 152, 40, 0.08);
  border: 1px solid rgba(200, 152, 40, 0.15);
  color: #d4ac40;
`

const noteTextCss = css`
  font-size: 0.78em;
  line-height: 1.5;
  color: #a09878;
  font-style: italic;
`
