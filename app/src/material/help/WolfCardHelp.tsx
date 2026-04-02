/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { LocationType } from '@gamepark/moonlight/material/LocationType'
import { MaterialType } from '@gamepark/moonlight/material/MaterialType'
import { PlayerColor } from '@gamepark/moonlight/PlayerColor'
import { isLoneWolf, WolfCard, wolfColor, wolfEffect, WolfEffect, wolfMoons, wolfValue } from '@gamepark/moonlight/material/WolfCard'
import { MaterialHelpProps, PlayMoveButton, useLegalMoves, useRules } from '@gamepark/react-game'
import { isMoveItemType, MaterialRules, MoveItem } from '@gamepark/rules-api'
import { FC } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { helpHeaderCss, helpChooseBtnCss } from './helpStyles'
import moonLight from '../../images/icon/moon-light.jpg'
import moonDark from '../../images/icon/moon-dark.jpg'
import x3Light from '../../images/icon/x3-light.jpg'
import x3Dark from '../../images/icon/x3-dark.jpg'
import plus1Light from '../../images/icon/plus1-light.jpg'
import plus1Dark from '../../images/icon/plus1-moon.jpg'

export const WolfCardHelp: FC<MaterialHelpProps> = ({ item, itemIndex, closeDialog }) => {
  const { t } = useTranslation()
  const chooseMoves = useLegalMoves<MoveItem>(move =>
    isMoveItemType(MaterialType.WolfCard)(move) && move.itemIndex === itemIndex && move.location.type === LocationType.WolfDeck
  )

  const rules = useRules<MaterialRules>()
  const compositeId = item.id as { front: WolfCard; back: number } | undefined
  const id = compositeId?.front
  const isHidden = id == null

  const deckCount = isHidden && item.location && rules
    ? rules.material(MaterialType.WolfCard).location(item.location.type).player(item.location.player).length
    : undefined

  const value = id != null ? wolfValue(id) : undefined
  const moons = id != null ? wolfMoons(id) : 0
  const lone = id != null ? isLoneWolf(id) : false
  const effect = id != null ? wolfEffect(id) : undefined
  const color = id != null ? wolfColor(id) : undefined
  const isLight = color === PlayerColor.Light

  const title = lone
    ? t('help.wolf.lone')
    : t('help.wolf.name')

  return (
    <div css={containerCss}>
      <div css={helpHeaderCss}>
        <div>
          <div css={titleCss}>{title}</div>
          {!isHidden ? (
            <div css={tagRowCss}>
              <span css={tagCss('#c8982830', '#d4ac40')}>{t('help.wolf.value', { value })}</span>
              {moons > 0 && <span css={tagCss('#4060a030', '#8898c8')}>{t('help.wolf.moon', { count: moons })}</span>}
              {lone && <span css={tagCss('#a0602020', '#d0a060')}>{t('help.wolf.lone')}</span>}
            </div>
          ) : deckCount !== undefined && (
            <div css={tagRowCss}>
              <span css={tagCss('#40606030', '#8898a8')}>{t('help.deck.count', { count: deckCount })}</span>
            </div>
          )}
        </div>
        {chooseMoves.length > 0 && (
          <PlayMoveButton move={chooseMoves[0]} onPlay={closeDialog} css={helpChooseBtnCss}>
            {t('help.wolf.choose')}
          </PlayMoveButton>
        )}
      </div>

      {!isHidden && lone && (
        <p css={textCss}>
          <Trans i18nKey="help.wolf.lone.explain" components={{ b: <strong css={boldCss} /> }} />
        </p>
      )}

      {!isHidden && moons > 0 && (
        <div css={effectBoxWithIconCss}>
          <img src={isLight ? moonLight : moonDark} alt="" css={effectIconCss} />
          <div>
            <Trans i18nKey="help.wolf.moon-explain" components={{ b: <strong css={effectBoldCss} /> }} />
          </div>
        </div>
      )}

      {!isHidden && effect === WolfEffect.CornerTriplesValue && (
        <div css={effectBoxWithIconCss}>
          <img src={isLight ? x3Light : x3Dark} alt="" css={effectIconCss} />
          <div>
            <Trans
              i18nKey="help.wolf.corner-triple"
              values={{ tripled: value! * 3 }}
              components={{ b: <strong css={effectBoldCss} /> }}
            />
            {value! <= 2 && (
              <p css={effectNoteCss}>
                {t('help.wolf.corner-triple.cover', { coverValue: value! + 1 })}
              </p>
            )}
          </div>
        </div>
      )}

      {!isHidden && effect === WolfEffect.BonusPoint && (
        <div css={effectBoxWithIconCss}>
          <img src={isLight ? plus1Light : plus1Dark} alt="" css={effectIconCss} />
          <div>
            <Trans i18nKey="help.wolf.bonus-point" components={{ b: <strong css={effectBoldCss} /> }} />
            <p css={effectNoteCss}>
              <Trans i18nKey="help.wolf.bonus-point.copies" components={{ b: <strong css={effectBoldCss} /> }} />
            </p>
          </div>
        </div>
      )}

      {!isHidden && value === 5 && (
        <p css={textCss}>
          {t('help.wolf.uncoverable', {
            next: 6,
            unless: lone ? '' : t('help.wolf.uncoverable.unless')
          })}
        </p>
      )}

      {!isHidden && value === 6 && (
        <p css={textCss}>
          {t('help.wolf.uncoverable', { next: 7, unless: '' })}
        </p>
      )}

      {!isHidden && !effect && moons === 0 && !lone && value !== 5 && (
        <p css={textCss}>{t('help.wolf.no-effect')}</p>
      )}

      <div css={rulesSectionCss}>
        <div css={rulesTitleCss}>{t('help.wolf.rules.title')}</div>
        <p css={rulesTextCss}>
          <Trans i18nKey="help.wolf.rules.grid" components={{ b: <strong css={effectBoldCss} /> }} />
        </p>
        <p css={rulesTextCss}>
          <Trans i18nKey="help.wolf.rules.cover" components={{ b: <strong css={effectBoldCss} /> }} />
        </p>
        <p css={rulesTextCss}>
          <Trans i18nKey="help.wolf.rules.row" components={{ b: <strong css={effectBoldCss} /> }} />
        </p>
        <p css={rulesTextCss}>
          <Trans i18nKey="help.wolf.rules.scoring" components={{ b: <strong css={effectBoldCss} /> }} />
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

const effectBoxWithIconCss = css`
  display: flex;
  align-items: flex-start;
  gap: 0.7em;
  background: rgba(200, 152, 40, 0.06);
  border-left: 3px solid rgba(200, 152, 40, 0.27);
  padding: 0.5em 0.9em;
  margin: 0.5em 0;
  border-radius: 0 0.3em 0.3em 0;
  font-size: 0.85em;
  line-height: 1.5;
`

const effectIconCss = css`
  width: 2.5em;
  height: 2.5em;
  border-radius: 50%;
  flex-shrink: 0;
  object-fit: cover;
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

