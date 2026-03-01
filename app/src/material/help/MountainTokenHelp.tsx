/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { MaterialHelpProps } from '@gamepark/react-game'
import { FC } from 'react'
import { Trans, useTranslation } from 'react-i18next'

export const MountainTokenHelp: FC<MaterialHelpProps> = () => {
  const { t } = useTranslation()

  return (
    <div css={containerCss}>
      <div css={titleCss}>{t('help.mountain.title', 'Mountain Token')}</div>

      <p css={textCss}>
        <Trans i18nKey="help.mountain.desc" defaults="The round winner receives a piece of their mountain. The first player to get <b>2 pieces completes their mountain and wins the game</b>." components={{ b: <strong css={boldCss} /> }} />
      </p>

      <div css={separatorCss} />

      <div css={sectionTitleCss}>{t('help.mountain.round', 'Round overview:')}</div>
      <ul css={listCss}>
        <li>{t('help.mountain.round.1', 'Players take turns placing wolves on the panorama (4×3 or 3×4 rectangle).')}</li>
        <li>{t('help.mountain.round.2', 'A wolf can be placed adjacent to an existing card, or on top of an opponent\'s wolf with exactly +1 value.')}</li>
        <li>{t('help.mountain.round.3', 'The round ends when the rectangle is complete or a player places their last card.')}</li>
      </ul>

      <div css={sectionTitleCss}>{t('help.mountain.scoring', 'Scoring:')}</div>
      <ul css={listCss}>
        <li>{t('help.mountain.scoring.1', 'Moon majority → 2 bonus points (no bonus if tied)')}</li>
        <li>{t('help.mountain.scoring.2', 'Each row is a battle: highest total value wins (tie → both lose the row)')}</li>
        <li>{t('help.mountain.scoring.3', 'The row winner recovers their visible cards: each card = 1 point, value 3 cards = 2 points')}</li>
      </ul>

      <div css={ruleBoxCss}>
        {t('help.mountain.between', 'Between rounds: the winner chooses a Lone Wolf (added to their deck). The loser chooses an Alpha Power (kept for the rest of the game).')}
      </div>
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

const textCss = css`
  font-size: 0.88em;
  line-height: 1.55;
  margin-bottom: 0.5em;
`

const boldCss = css`
  color: #d8d0b0;
`

const separatorCss = css`
  border-top: 1px solid rgba(200, 152, 40, 0.1);
  margin: 0.6em 0;
`

const sectionTitleCss = css`
  font-size: 0.85em;
  font-weight: 700;
  margin-bottom: 0.3em;
`

const listCss = css`
  font-size: 0.83em;
  line-height: 1.65;
  padding-left: 1.2em;
  margin-bottom: 0.6em;
  li { margin-bottom: 0.15em; }
`

const ruleBoxCss = css`
  background: rgba(60, 100, 90, 0.1);
  border: 1px solid rgba(100, 160, 140, 0.12);
  border-radius: 0.35em;
  padding: 0.5em 0.9em;
  margin-top: 0.5em;
  font-size: 0.8em;
  line-height: 1.5;
  color: #a0b8a8;
`
