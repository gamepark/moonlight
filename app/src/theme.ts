import { css } from '@emotion/react'

const containerCss = css`
  background:
    radial-gradient(ellipse at 30% 20%, rgba(30, 80, 70, 0.25) 0%, transparent 60%),
    linear-gradient(170deg, #122c2c 0%, #1a4040 50%, #122c2c 100%);
  border: 1.5px solid rgba(200, 152, 40, 0.2);
  box-shadow:
    0 0 0 1px #1f4f4f,
    0 1.5em 5em rgba(0, 0, 0, 0.5);
`

const closeIconCss = css`
  top: -0.4em;
  right: -0.4em;
  width: 0.8em;
  height: 0.8em;
  padding: 0.2em;
  background: linear-gradient(145deg, #1f4f4f, #1a4040);
  color: #e0dcc0;
  border-radius: 50%;
  border: 2px solid rgba(200, 152, 40, 0.3);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
  transition: transform 0.15s ease, box-shadow 0.15s ease;
  &:hover {
    transform: scale(1.1);
    box-shadow: 0 3px 8px rgba(0, 0, 0, 0.4);
    background: linear-gradient(145deg, #255555, #1f4f4f);
    border-color: rgba(200, 152, 40, 0.5);
  }
`

export const theme = {
  root: {
    fontFamily: 'Raleway'
  },
  dialog: {
    backgroundColor: '#152e2e',
    color: '#e0dcc0',
    container: containerCss,
    closeIcon: closeIconCss
  },
  buttons: css`
    background: rgba(200, 152, 40, 0.15);
    color: #e0dcc0;
    border: 1px solid rgba(200, 152, 40, 0.4);
    border-radius: 0.4em;
    padding: 0.3em 0.8em;
    &:hover {
      background: rgba(200, 152, 40, 0.3);
    }
  `,
  palette: {
    primary: '#c89828',
    primaryHover: '#b88820',
    primaryActive: '#a07818',
    primaryLight: 'rgba(200, 152, 40, 0.12)',
    primaryLighter: 'rgba(200, 152, 40, 0.06)',
    surface: '#122c2c',
    onSurface: '#e0dcc0',
    onSurfaceFocus: 'rgba(200, 152, 40, 0.1)',
    onSurfaceActive: 'rgba(200, 152, 40, 0.18)'
  },
  menu: {
    panel: css`
      border: 1px solid rgba(200, 152, 40, 0.1);
      box-shadow: 4px 0 16px rgba(0, 0, 0, 0.4);
    `,
    mainButton: css`
      background: linear-gradient(145deg, #1a4040, #122c2c);
      border: 1.5px solid rgba(200, 152, 40, 0.3);
      color: #d4ac40;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
      &:hover, &:focus {
        background: linear-gradient(145deg, #1f4f4f, #1a4040);
        border-color: rgba(200, 152, 40, 0.45);
      }
      &:active {
        background: linear-gradient(145deg, #153535, #122c2c);
      }
    `,
    button: css`
      border-color: rgba(200, 152, 40, 0.25);
      color: #e0dcc0;
      &:hover, &:focus {
        background: rgba(200, 152, 40, 0.1);
      }
      &:active {
        background: rgba(200, 152, 40, 0.18);
      }
    `,
    popButton: css`
      color: #d4ac40;
      background: linear-gradient(145deg, #1a4040, #122c2c);
      border: 1px solid rgba(200, 152, 40, 0.2);
      &:hover, &:focus {
        background: rgba(200, 152, 40, 0.12);
      }
      &:active {
        background: rgba(200, 152, 40, 0.2);
      }
    `
  },
  journal: {
    tab: css`
      background: transparent;
      border: 1px solid transparent;
      border-radius: 2em;
      color: #a09878;
      font-weight: 600;
      letter-spacing: 0.08em;
      &:hover, &:focus {
        background: rgba(200, 152, 40, 0.06);
        color: #e0dcc0;
      }
    `,
    tabSelected: css`
      background: rgba(200, 152, 40, 0.12);
      border-color: rgba(200, 152, 40, 0.25);
      color: #d4ac40;
    `,
    chatBar: css`
      background: rgba(0, 0, 0, 0.15);
      border-top: 1px solid rgba(200, 152, 40, 0.08);
    `,
    historyEntry: css`
      background: transparent;
      border-radius: 0 0.35em 0.35em 0;
      padding: 0.3em 0.6em 0.3em 0.8em;
      margin-bottom: 0.12em;
      font-size: 2.4em;
      color: #a09878;
    `
  },
  header: {
    bar: css`
      background: linear-gradient(180deg, rgba(18, 44, 44, 0.95) 0%, rgba(18, 44, 44, 0.85) 100%);
      color: #e0dcc0;
      border-bottom: 1px solid rgba(200, 152, 40, 0.1);
    `
  },
  result: {
    border: 'rgba(200, 152, 40, 0.3)',
    icon: '#d4ac40',
    container: containerCss,
    closeIcon: closeIconCss
  },
  tutorial: {
    container: css`
      ${containerCss};
      color: #e0dcc0;
    `,
    content: css`
      color: #e0dcc0;
    `
  },
  timeStats: {
    container: css`
      ${containerCss};
      color: #e0dcc0;
    `,
    thinkBackground: 'rgba(200, 152, 40, 0.2)',
    waitBackground: 'rgba(74, 154, 138, 0.2)'
  }
}
