import React from 'react';
import profilePic from '../assets/avatar.jpg';
import { rhythm } from '../utils/typography';

class Bio extends React.Component {
  render() {
    return (
      <div
        style={{
          display: 'flex',
          marginBottom: rhythm(2),
        }}
      >
        <img
          src={profilePic}
          alt={`Isaac Young`}
          style={{
            marginRight: rhythm(1 / 2),
            marginBottom: 0,
            width: rhythm(2),
            height: rhythm(2),
            borderRadius: '50%',
          }}
        />
        <p style={{ maxWidth: 310 }}>
          Blog by{' '}
          <a href="https://mobile.twitter.com/WhiteAlbumIO">Isaac Young</a>.
          <br />
          Coding and Life.
        </p>
      </div>
    );
  }
}

export default Bio;
