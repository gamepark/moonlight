/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { AlphaPowerCard, alphaPowerEffects } from '@gamepark/moonlight/material/AlphaPowerCard'
import { LocationType } from '@gamepark/moonlight/material/LocationType'
import { MaterialType } from '@gamepark/moonlight/material/MaterialType'
import { MaterialHelpProps, PlayMoveButton, useLegalMoves, useRules } from '@gamepark/react-game'
import { isMoveItemType, MaterialRules, MoveItem } from '@gamepark/rules-api'
import { FC } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { helpHeaderCss, helpChooseBtnCss } from './helpStyles'

export const AlphaPowerHelp: FC<MaterialHelpProps> = ({ item, itemIndex, closeDialog }) => {
  const { t } = useTranslation()
  const chooseMoves = useLegalMoves<MoveItem>(move =>
    isMoveItemType(MaterialType.AlphaPowerCard)(move) && move.itemIndex === itemIndex && move.location.type === LocationType.PlayerAlphaPower
  )

  const rules = useRules<MaterialRules>()
  const id = item.id as AlphaPowerCard
  if (id === undefined) {
    const deckCount = item.location && rules
      ? rules.material(MaterialType.AlphaPowerCard).location(item.location.type).length
      : undefined
    return (
      <div css={containerCss}>
        <div css={titleCss}>{t('help.deck.alpha.title')}</div>
        {deckCount !== undefined && (
          <div css={countTagCss}>
            {t('help.deck.count', { count: deckCount })}
          </div>
        )}
        <div css={howToGetCss}>
          <Trans
            i18nKey="help.alpha.how-to-get"
           
            components={{ b: <strong css={boldCss} /> }}
          />
        </div>
      </div>
    )
  }

  const index = id - AlphaPowerCard.AlphaPower1 + 1
  const effect = alphaPowerEffects[id]
  const isAmbush = effect.type === 'ambush'

  const title = t(`help.alpha.title.${index}`)
  const typeLabel = isAmbush
    ? t('help.alpha.type.ambush')
    : t('help.alpha.type.stamina')

  return (
    <div css={containerCss}>
      <div css={helpHeaderCss}>
        <div>
          <div css={titleCss}>{title}</div>
          <div css={typeCss}>
            <span css={tagCss(isAmbush)}>{typeLabel}</span>
          </div>
        </div>
        {chooseMoves.length > 0 && (
          <PlayMoveButton move={chooseMoves[0]} onPlay={closeDialog} css={helpChooseBtnCss}>
            {t('help.alpha.choose')}
          </PlayMoveButton>
        )}
      </div>

      <div css={cardTextBoxCss}>
        {t(`help.alpha.cardtext.${index}`)}
      </div>

      <p css={textCss}>
        <Trans i18nKey={`help.alpha.desc.${index}`} components={{ b: <strong css={boldCss} /> }} />
      </p>

      {(index === 1 || index === 5) && (
        <div css={exampleBoxCss}>
          {t(`help.alpha.example.${index}`)}
        </div>
      )}

      {isAmbush && (
        <div css={ruleBoxCss}>
          {t('help.alpha.ambush-note')}
        </div>
      )}

      {effect.extraMoons && (
        <div css={ruleBoxCss}>
          {t('help.alpha.moon-reminder')}
        </div>
      )}

      <div css={howToGetCss}>
        <Trans
          i18nKey="help.alpha.how-to-get"
          components={{ b: <strong css={boldCss} /> }}
        />
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
  margin-bottom: 0.15em;
`

const typeCss = css`
  margin-bottom: 0.6em;
`

const tagCss = (isAmbush: boolean) => css`
  display: inline-block;
  font-size: 0.75em;
  font-weight: 700;
  padding: 0.15em 0.55em;
  border-radius: 0.25em;
  background: ${isAmbush ? '#a0402030' : '#40806030'};
  color: ${isAmbush ? '#d08060' : '#80b890'};
`

const cardTextBoxCss = css`
  background: rgba(200, 152, 40, 0.08);
  border: 1px solid rgba(200, 152, 40, 0.2);
  border-radius: 0.35em;
  padding: 0.45em 0.8em;
  margin-bottom: 0.6em;
  font-size: 0.82em;
  line-height: 1.45;
  color: #d4ac40;
  font-style: italic;
  text-align: center;
`

const textCss = css`
  font-size: 0.88em;
  line-height: 1.55;
  margin-bottom: 0.5em;
`

const boldCss = css`
  color: #d4ac40;
`

const exampleBoxCss = css`
  background: rgba(200, 152, 40, 0.06);
  border-left: 3px solid rgba(200, 152, 40, 0.27);
  padding: 0.5em 0.9em;
  margin: 0.5em 0;
  border-radius: 0 0.3em 0.3em 0;
  font-size: 0.82em;
  line-height: 1.5;
  color: #c0b898;
`

const ruleBoxCss = css`
  background: rgba(60, 100, 90, 0.1);
  border: 1px solid rgba(100, 160, 140, 0.12);
  border-radius: 0.35em;
  padding: 0.5em 0.9em;
  margin: 0.5em 0;
  font-size: 0.8em;
  line-height: 1.5;
  color: #a0b8a8;
`

const countTagCss = css`
  display: inline-block;
  font-size: 0.75em;
  font-weight: 700;
  padding: 0.15em 0.55em;
  border-radius: 0.25em;
  background: #40606030;
  color: #8898a8;
  margin-bottom: 0.6em;
`

const howToGetCss = css`
  margin-top: 0.8em;
  padding-top: 0.6em;
  border-top: 1px solid rgba(200, 152, 40, 0.12);
  font-size: 0.78em;
  line-height: 1.5;
  color: #a09878;
`

