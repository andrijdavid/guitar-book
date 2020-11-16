import PropTypes from 'prop-types';
import React, { useEffect, useMemo, useRef } from 'react';
import styled from '@emotion/styled';
import useKey from 'react-use/lib/useKey';
import useWindowSize from 'react-use/lib/useWindowSize';
import { IconTwitter } from '@apollo/space-kit/icons/IconTwitter';
import { IconYoutube } from '@apollo/space-kit/icons/IconYoutube';

import { size, transparentize } from 'polished';

import { Link } from 'gatsby';

import { ReactComponent as SpotifyLogoIcon } from '../assets/icons/spotify.svg';
import { ReactComponent as InstagramLogoIcon } from '../assets/icons/instagram.svg';
import { ReactComponent as SoundcloudLogoIcon } from '../assets/icons/soundcloud.svg';
import { ReactComponent as MailIcon } from '../assets/icons/mail.svg';

import { boxShadow } from './search';
import { colors } from '../utils/colors';
import { smallCaps } from '../utils/typography';
import breakpoints from '../utils/breakpoints';

const Wrapper = styled.div({
  width: '100%',
  height: '100%',
  backgroundColor: transparentize(0.5, colors.text2),
  overflow: 'auto',
  position: 'fixed',
  top: 0,
  left: 0,
  zIndex: 3,
  perspective: '1000px',
  transitionProperty: 'opacity, visibility',
  transitionDuration: '150ms',
  transitionTimingFunction: 'ease-in-out',
});

const transitionDuration = 150; // in ms
const Menu = styled.div({
  width: 700,
  marginBottom: 24,
  borderRadius: 4,
  boxShadow,
  backgroundColor: 'white',
  overflow: 'hidden',
  position: 'absolute',
  transformOrigin: '25% 25%',
  transition: `transform ${transitionDuration}ms ease-in-out`,
  outline: 'none',
  [breakpoints.md]: {
    width: 450,
  },
  [breakpoints.sm]: {
    width: 'calc(100vw - 48px)',
  },
});

const MenuTitle = styled.h6(smallCaps, {
  margin: 24,
  marginBottom: 0,
  fontSize: 13,
  fontWeight: 600,
  color: colors.text3,
});

const StyledNav = styled.nav({
  display: 'flex',
  flexWrap: 'wrap',
  margin: 12,
});

const NavItem = styled(Link)({
  display: 'block',
  width: '50%',
  [breakpoints.md]: {
    width: '100%',
  },
  height: '100%',
  padding: 12,
  borderRadius: 4,
  color: colors.text1,
  textDecoration: 'none',
  backgroundColor: 'transparent',
  transitionProperty: 'color, background-color',
  transitionDuration: '150ms',
  transitionTimingFunction: 'ease-in-out',
  '@media (hover: hover)': {
    ':hover': {
      color: 'white',
      backgroundColor: colors.primary,
      p: {
        color: colors.primaryLight,
      },
    },
  },
});

export const NavItemTitle = styled.h4({
  marginBottom: 8,
  fontWeight: 600,
  color: 'inherit',
});

export const NavItemDescription = styled.p({
  marginBottom: 0,
  fontSize: 14,
  lineHeight: 1.5,
  color: colors.text3,
  transition: 'color 150ms ease-in-out',
});

const FooterNav = styled.nav({
  display: 'flex',
  alignItems: 'center',
  padding: '16px 24px',
  backgroundColor: colors.background,
  [breakpoints.md]: {
    display: 'block',
  },
});

const FooterNavItem = styled.a({
  color: colors.text2,
  textDecoration: 'none',
  ':hover': {
    color: colors.text3,
  },
  ':not(:last-child)': {
    marginRight: 24,
  },
});

const SocialLinks = styled.div({
  display: 'flex',
  marginLeft: 'auto',
  [breakpoints.md]: {
    marginTop: 8,
  },
});

const SocialLink = styled.a({
  color: colors.text2,
  ':hover': {
    color: colors.text3,
  },
  ':not(:last-child)': {
    marginRight: 24,
  },
  svg: {
    ...size(24),
    display: 'block',
    fill: 'currentColor',
  },
});

export default function DocsetSwitcher(props) {
  const menuRef = useRef(null);
  const { width } = useWindowSize();
  useKey('Escape', props.onClose);

  useEffect(() => {
    if (props.open) {
      // focus the menu after it has been transitioned in
      setTimeout(() => {
        menuRef.current.focus();
      }, transitionDuration);
    }
  }, [props.open]);

  const { current } = props.buttonRef;
  const menuStyles = useMemo(() => {
    if (!current) {
      return null;
    }

    const { top, left, height } = current.getBoundingClientRect();
    return {
      top: top + height + 2,
      left,
    };
  }, [current, width, props.open]);

  function handleWrapperClick(event) {
    if (event.target === event.currentTarget) {
      props.onClose();
    }
  }

  const hasSocialUrls = Boolean(
    props.twitterUrl ||
      props.youtubeUrl ||
      props.contactMail ||
      props.instagramUrl ||
      props.soundcloudUrl ||
      props.spotifyUrl,
  );
  return (
    <Wrapper
      style={{
        opacity: props.open ? 1 : 0,
        visibility: props.open ? 'visible' : 'hidden',
      }}
      onClick={handleWrapperClick}
    >
      <Menu
        ref={menuRef}
        tabIndex={-1}
        style={{
          ...menuStyles,
          transform: !props.open && 'translate3d(0,-24px,-16px) rotate3d(1,0,0.1,8deg)',
        }}
      >
        <MenuTitle>{props.siteName}</MenuTitle>
        <StyledNav>
          <NavItem to="/favourites">
            <NavItemTitle>
              Favourites{' '}
              <span role="img" aria-label="favourites">
                ⭐️
              </span>
            </NavItemTitle>
            <NavItemDescription>Check all songs marks as favourites.</NavItemDescription>
          </NavItem>
          <NavItem to="/newest">
            <NavItemTitle>
              20 newest songs{' '}
              <span role="img" aria-label="new songs">
                🆕
              </span>
            </NavItemTitle>
            <NavItemDescription>Checkout last added 20 songs.</NavItemDescription>
          </NavItem>
          <NavItem to="/songs">
            <NavItemTitle>
              All songs{' '}
              <span role="img" aria-label="songs">
                🎶
              </span>
            </NavItemTitle>
            <NavItemDescription>Navigate to the list of all songs.</NavItemDescription>
          </NavItem>
          <NavItem to="/authors">
            <NavItemTitle>
              All authors{' '}
              <span role="img" aria-label="author">
                👨🏻‍🎤
              </span>
            </NavItemTitle>
            <NavItemDescription>Navigate to the list of all authors.</NavItemDescription>
          </NavItem>
          <NavItem to="">
            <NavItemTitle>Random song</NavItemTitle>
            <NavItemDescription>Pick and play random song.</NavItemDescription>
          </NavItem>
          <NavItem to="">
            <NavItemTitle>Random author</NavItemTitle>
            <NavItemDescription>Pick and check random author page.</NavItemDescription>
          </NavItem>
        </StyledNav>
        {(props.footerNavConfig || hasSocialUrls) && (
          <FooterNav>
            <>
              {props.footerNavConfig &&
                Object.entries(props.footerNavConfig).map(([text, props]) => (
                  <FooterNavItem key={text} {...props}>
                    {text}
                  </FooterNavItem>
                ))}
              {hasSocialUrls && (
                <SocialLinks>
                  {props.contactMail && (
                    <SocialLink
                      href={`mailto:${props.contactMail}`}
                      title="Contact mail"
                      target="_blank"
                    >
                      <MailIcon />
                    </SocialLink>
                  )}
                  {props.instagramUrl && (
                    <SocialLink href={props.instagramUrl} title="Instagram" target="_blank">
                      <InstagramLogoIcon />
                    </SocialLink>
                  )}
                  {props.soundcloudUrl && (
                    <SocialLink href={props.soundcloudUrl} title="Soundcloud" target="_blank">
                      <SoundcloudLogoIcon />
                    </SocialLink>
                  )}
                  {props.twitterUrl && (
                    <SocialLink href={props.twitterUrl} title="Twitter" target="_blank">
                      <IconTwitter />
                    </SocialLink>
                  )}
                  {props.youtubeUrl && (
                    <SocialLink href={props.youtubeUrl} title="YouTube" target="_blank">
                      <IconYoutube />
                    </SocialLink>
                  )}
                  {props.spotifyUrl && (
                    <SocialLink href={props.spotifyUrl} title="Spotify" target="_blank">
                      <SpotifyLogoIcon />
                    </SocialLink>
                  )}
                </SocialLinks>
              )}
            </>
          </FooterNav>
        )}
      </Menu>
    </Wrapper>
  );
}

DocsetSwitcher.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  buttonRef: PropTypes.object.isRequired,
  siteName: PropTypes.string.isRequired,
  navItems: PropTypes.array.isRequired,
  footerNavConfig: PropTypes.object.isRequired,
  twitterUrl: PropTypes.string,
  youtubeUrl: PropTypes.string,
};
