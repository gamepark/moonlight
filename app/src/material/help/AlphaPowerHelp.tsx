/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { AlphaPowerCard, alphaPowerEffects } from '@gamepark/moonlight/material/AlphaPowerCard'
import { LocationType } from '@gamepark/moonlight/material/LocationType'
import { MaterialType } from '@gamepark/moonlight/material/MaterialType'
import { MaterialHelpProps, PlayMoveButton, useLegalMoves } from '@gamepark/react-game'
import { isMoveItemType, MoveItem } from '@gamepark/rules-api'
import { FC } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { helpHeaderCss, helpChooseBtnCss } from './helpStyles'

const alphaTitleDefaults: Record<number, string> = {
  1: 'Value Skip',
  2: 'Larger Hand',
  3: 'Value 1 Protection',
  4: 'Double Placement',
  5: 'Same Value Cover',
  6: 'Bonus Moons',
  7: 'Win All Ties',
  8: 'Move a Pile'
}

const alphaCardTextDefaults: Record<number, string> = {
  1: 'When covering an opponent\'s wolf you can jump one value',
  2: '5 cards in your hand',
  3: 'Your opponent can\'t cover any of your 1 value Wolves',
  4: 'Place 2 cards in one turn',
  5: 'Cover any of your opponent\'s Wolf with one having the same value',
  6: 'A bonus of 2 Moons when counting Moon\'s majority',
  7: 'Win all ties when facing one (Moons, sum of values, round points, etc.)',
  8: 'Move a pile of cards in an empty space before placing a 2 Valued Wolf'
}

const alphaExampleDefaults: Record<number, string> = {
  1: 'Example: cover a value 2 wolf with your value 4.',
  5: 'Example: cover a value 3 wolf with your value 3.'
}

const alphaDescDefaults: Record<number, string> = {
  1: 'When covering an opponent\'s wolf, you may <b>skip a value</b>: place value +2 instead of +1.',
  2: 'You start each round with <b>5 cards in hand</b> instead of 3. More cards = more choices each turn.',
  3: 'Your opponent <b>cannot cover your value 1 wolves</b>. Your positions with value 1 (and their moons or corner ×3 effect) are safe.',
  4: 'Place <b>2 cards in a single turn</b>. After your first placement, you may place a second card or pass.',
  5: 'Cover an opponent\'s wolf with a wolf of <b>the same value</b> (instead of value +1 normally).',
  6: 'You gain <b>2 extra moons</b> when counting moon majority. These are added to the moons visible on your panorama cards.',
  7: 'You <b>win all ties</b>: tied moons = you have majority. Tied row values = you win the row. Tied round score = you win the round.',
  8: '<b>Move a card pile</b> to an adjacent empty space, then place a value 2 wolf. Both the move and the placement must follow normal placement rules.'
}

export const AlphaPowerHelp: FC<MaterialHelpProps> = ({ item, itemIndex, closeDialog }) => {
  const { t } = useTranslation()
  const chooseMoves = useLegalMoves<MoveItem>(move =>
    isMoveItemType(MaterialType.AlphaPowerCard)(move) && move.itemIndex === itemIndex && move.location.type === LocationType.PlayerAlphaPower
  )

  const id = item.id as AlphaPowerCard
  if (id === undefined) return null

  const index = id - AlphaPowerCard.AlphaPower1 + 1
  const effect = alphaPowerEffects[id]
  const isAmbush = effect.type === 'ambush'

  const title = t(`help.alpha.title.${index}`, alphaTitleDefaults[index])
  const typeLabel = isAmbush
    ? t('help.alpha.type.ambush', 'Ambush — Usable once per round')
    : t('help.alpha.type.stamina', 'Stamina — Always active')

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
            {t('help.alpha.choose', 'Choose this power')}
          </PlayMoveButton>
        )}
      </div>

      <div css={cardTextBoxCss}>
        {t(`help.alpha.cardtext.${index}`, alphaCardTextDefaults[index])}
      </div>

      <p css={textCss}>
        <Trans i18nKey={`help.alpha.desc.${index}`} defaults={alphaDescDefaults[index]} components={{ b: <strong css={boldCss} /> }} />
      </p>

      {(index === 1 || index === 5) && (
        <div css={exampleBoxCss}>
          {t(`help.alpha.example.${index}`, alphaExampleDefaults[index])}
        </div>
      )}

      {isAmbush && (
        <div css={ruleBoxCss}>
          {t('help.alpha.ambush-note', 'The card is flipped after use. It becomes available again next round.')}
        </div>
      )}

      {effect.extraMoons && (
        <div css={ruleBoxCss}>
          {t('help.alpha.moon-reminder', 'Reminder: the player with the most visible moons scores 2 bonus points. In case of a tie, nobody scores.')}
        </div>
      )}

      <div css={howToGetCss}>
        <Trans
          i18nKey="help.alpha.how-to-get"
          defaults="<b>How to get:</b> The loser of each round chooses one of the two revealed Alpha Power cards."
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

const howToGetCss = css`
  margin-top: 0.8em;
  padding-top: 0.6em;
  border-top: 1px solid rgba(200, 152, 40, 0.12);
  font-size: 0.78em;
  line-height: 1.5;
  color: #a09878;
`

