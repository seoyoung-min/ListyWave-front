import { style } from '@vanilla-extract/css';
import { vars } from '@/styles/__theme.css';
import * as fonts from '@/styles/__font.css';

export const background = style({
  width: '100%',
  height: '750px',
  padding: '81px 0 20px',

  background: vars.color.white,
});

export const wrapper = style({
  display: 'flex',
  flexDirection: 'column',
});

export const contentsWrapper = style({
  padding: '0 30px',

  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-end',
});

export const sectionNameWrapper = style({
  marginBottom: '55px',

  display: 'flex',
  gap: '4px',
  alignItems: 'center',

  fontSize: '2.2rem',
  fontWeight: 600,
  letterSpacing: '0.088px',
});

export const titleWrapper = style([
  fonts.headlineLarge,
  {
    marginBottom: '18px',

    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: '5px',
  },
]);

export const titleLine1 = style({
  display: 'flex',
  gap: '4px',
});

export const subTitleWrapper = style([
  fonts.bodyRegular,
  {
    marginBottom: '32px',

    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: '7px',

    color: '#828282',
  },
]);

export const imageWrapper = style({
  position: 'relative',
});

export const linkWrapper = style([
  {
    padding: '12px 25px',

    position: 'absolute',
    top: 150,
    left: -40,

    backgroundColor: vars.color.white,
    borderRadius: '50px',
    boxShadow: 'rgba(0, 0, 0, 0.1) 0px 4px 12px',
    fontSize: '1.4rem',
    fontWeight: 700,
  },
]);

export const searchBarWrapper = style({
  padding: '0 30px',
  marginBottom: '80px',

  display: 'flex',
  justifyContent: 'flex-end',
});
