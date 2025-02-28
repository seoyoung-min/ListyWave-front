import { style } from '@vanilla-extract/css';
import { vars } from '@/styles/theme.css';
import { Subtitle } from '@/styles/font.css';

// BottomSheet Input
export const contentInput = style({
  padding: '2rem 2.4rem',
  backgroundColor: '#F5F6FA',
  borderRadius: 18,

  color: vars.color.black,
  fontSize: '1.6rem',
  fontWeight: 400,
});

// BottomSheet Description
export const content = style([
  Subtitle,
  {
    paddingTop: 30,
    fontWeight: 600,
    color: vars.color.black,

    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    alignItems: 'center',
  },
]);

// Observer Ref
export const target = style({
  width: '100%',
  height: '2px',
});
