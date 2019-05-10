import React from 'react';
import Layout from '../components/Layout';

const main = {
  border: 0,
  padding: 0,
  margin: 0,
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  zIndex: 1,
};
const frameStyle = {
  border: 0,
  padding: 0,
  margin: 0,
  width: '100%',
  height: '100%',
  backgroundColor: '#000',
};

const scriptText = `
(adsbygoogle = window.adsbygoogle || []).push({
  google_ad_client: "ca-pub-6361564278528956",
  enable_page_level_ads: true
});
`;

class Calc extends React.Component {
  render() {
    return (
      <main style={main}>
        <iframe
          src="https://wsdb.xyz/calc/en"
          style={frameStyle}
          frameBorder="0"
        />
      </main>
    );
  }
  addScripts() {
    const script1 = document.createElement('script');
    (script1.src = '//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js'),
      (script1.async = true);
    const script2 = document.createElement('script');
    script2.innerHTML = scriptText;
    const body = document.querySelector('body');
    body.appendChild(script1);
    body.appendChild(script2);
  }
  componentDidMount() {
    this.addScripts()
  }
}

export default Calc;
