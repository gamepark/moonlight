/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { LocationType } from '@gamepark/moonlight/material/LocationType'
import { MaterialType } from '@gamepark/moonlight/material/MaterialType'
import { isLoneWolf, WolfCard, wolfEffect, WolfEffect, wolfMoons, wolfValue } from '@gamepark/moonlight/material/WolfCard'
import { MaterialHelpProps, PlayMoveButton, useLegalMoves } from '@gamepark/react-game'
import { isMoveItemType, MoveItem } from '@gamepark/rules-api'
import { FC } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { helpHeaderCss, helpChooseBtnCss } from './helpStyles'

export const WolfCardHelp: FC<MaterialHelpProps> = ({ item, itemIndex, closeDialog }) => {
  const { t } = useTranslation()
  const chooseMoves = useLegalMoves<MoveItem>(move =>
    isMoveItemType(MaterialType.WolfCard)(move) && move.itemIndex === itemIndex && move.location.type === LocationType.WolfDeck
  )

  const compositeId = item.id as { front: WolfCard; back: number } | undefined
  if (compositeId == null) return null
  const id = compositeId.front

  const value = wolfValue(id)
  const moons = wolfMoons(id)
  const lone = isLoneWolf(id)
  const effect = wolfEffect(id)

  const title = lone
    ? t('help.wolf.lone', 'Lone Wolf')
    : t('help.wolf.name', 'Wolf')

  return (
    <div css={containerCss}>
      <div css={helpHeaderCss}>
        <div>
          <div css={titleCss}>{title}</div>
          <div css={tagRowCss}>
            <span css={tagCss('#c8982830', '#d4ac40')}>{t('help.wolf.value', 'Value {value}', { value })}</span>
            {moons > 0 && <span css={tagCss('#4060a030', '#8898c8')}>{t('help.wolf.moon', '{count, plural, one{# moon} other{# moons}}', { count: moons })}</span>}
            {lone && <span css={tagCss('#a0602020', '#d0a060')}>{t('help.wolf.lone', 'Lone Wolf')}</span>}
          </div>
        </div>
        {chooseMoves.length > 0 && (
          <PlayMoveButton move={chooseMoves[0]} onPlay={closeDialog} css={helpChooseBtnCss}>
            {t('help.wolf.choose', 'Add to my deck')}
          </PlayMoveButton>
        )}
      </div>

      {lone && (
        <p css={textCss}>
          <Trans i18nKey="help.wolf.lone.explain" defaults="Chosen by the round winner and added to their deck. Strengthens the pack for the next rounds." components={{ b: <strong css={boldCss} /> }} />
        </p>
      )}

      {moons > 0 && (
        <p css={textCss}>
          <Trans i18nKey="help.wolf.moon-explain" defaults="At the end of the round, the player with the most visible moons scores <b>2 bonus points</b>. In case of a tie, nobody scores the bonus." components={{ b: <strong css={boldCss} /> }} />
        </p>
      )}

      {effect === WolfEffect.CornerTriplesValue && (
        <div css={effectBoxCss}>
          <Trans
            i18nKey="help.wolf.corner-triple"
            defaults="If this card is in one of the 4 corners of the panorama at the end of the round, its value counts <b>triple</b> (= {tripled}) for the row battle."
            values={{ tripled: value * 3 }}
            components={{ b: <strong css={effectBoldCss} /> }}
          />
          {value <= 2 && (
            <p css={effectNoteCss}>
              {t('help.wolf.corner-triple.cover', 'It must still be covered by a value {coverValue}, even in a corner.', { coverValue: value + 1 })}
            </p>
          )}
        </div>
      )}

      {effect === WolfEffect.BonusPoint && (
        <div css={effectBoxCss}>
          <Trans i18nKey="help.wolf.bonus-point" defaults="If you win a row containing this card, it scores <b>2 points</b> instead of 1 (1 normal + 1 bonus)." components={{ b: <strong css={effectBoldCss} /> }} />
          <p css={effectNoteCss}>
            <Trans i18nKey="help.wolf.bonus-point.copies" defaults="Each player has <b>2 copies</b> of this card." components={{ b: <strong css={effectBoldCss} /> }} />
          </p>
        </div>
      )}

      {value === 5 && (
        <p css={textCss}>
          {t('help.wolf.uncoverable', 'Cannot be covered by the opponent (no card with value {next} exists{unless}).', {
            next: 6,
            unless: lone ? '' : t('help.wolf.uncoverable.unless', ', unless through the Lone Wolf value 6')
          })}
        </p>
      )}

      {value === 6 && (
        <p css={textCss}>
          {t('help.wolf.uncoverable', 'Cannot be covered by the opponent (no card with value {next} exists{unless}).', { next: 7, unless: '' })}
        </p>
      )}

      {!effect && moons === 0 && !lone && value !== 5 && (
        <p css={textCss}>{t('help.wolf.no-effect', 'No special effect. Its value counts toward the row battle.')}</p>
      )}

      <div css={rulesSectionCss}>
        <div css={rulesTitleCss}>{t('help.wolf.rules.title', 'Placement rules')}</div>
        <p css={rulesTextCss}>
          <Trans i18nKey="help.wolf.rules.cover" defaults="You can cover an opponent's wolf by placing a card with exactly <b>+1 value</b> on top. The covered card is hidden and no longer counts." components={{ b: <strong css={effectBoldCss} /> }} />
        </p>
        <p css={rulesTextCss}>
          <Trans i18nKey="help.wolf.rules.row" defaults="Each row is a battle: the player with the <b>highest total value</b> wins the row and recovers their visible cards." components={{ b: <strong css={effectBoldCss} /> }} />
        </p>
        <p css={rulesTextCss}>
          <Trans i18nKey="help.wolf.rules.scoring" defaults="Each recovered card = <b>1 point</b>. Value 3 cards with the +1 icon = <b>2 points</b>." components={{ b: <strong css={effectBoldCss} /> }} />
        </p>
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
  margin-bottom: 0.3em;
`

const tagRowCss = css`
  display: flex;
  gap: 0.4em;
  flex-wrap: wrap;
  margin-bottom: 0.6em;
`

const tagCss = (bg: string, color: string) => css`
  display: inline-block;
  font-size: 0.78em;
  font-weight: 700;
  padding: 0.15em 0.55em;
  border-radius: 0.25em;
  background: ${bg};
  color: ${color};
`

const textCss = css`
  font-size: 0.88em;
  line-height: 1.55;
  margin-bottom: 0.5em;
`

const boldCss = css`
  color: #d8d0b0;
`

const effectBoxCss = css`
  background: rgba(200, 152, 40, 0.06);
  border-left: 3px solid rgba(200, 152, 40, 0.27);
  padding: 0.5em 0.9em;
  margin: 0.5em 0;
  border-radius: 0 0.3em 0.3em 0;
  font-size: 0.85em;
  line-height: 1.5;
`

const effectBoldCss = css`
  color: #d4ac40;
`

const effectNoteCss = css`
  margin-top: 0.3em;
  font-size: 0.92em;
  opacity: 0.8;
`

const rulesSectionCss = css`
  margin-top: 0.8em;
  padding-top: 0.6em;
  border-top: 1px solid rgba(200, 152, 40, 0.15);
`

const rulesTitleCss = css`
  font-size: 0.78em;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #a09878;
  margin-bottom: 0.4em;
`

const rulesTextCss = css`
  font-size: 0.82em;
  line-height: 1.5;
  margin-bottom: 0.3em;
  color: #b0a890;
`

