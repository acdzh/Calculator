/* eslint-disable import/no-webpack-loader-syntax */
import React from 'react';
import text from "!raw-loader!../about.md";

import Head from './Head'
import MarkdownRender from "react-uwp/MarkdownRender";

export class About extends React.Component {
  render() {
    return (
      <>
        <Head title="About"/>
        <div style={{height: 'calc(100% - 48px)', width: '100%', padding: '0 16px', lineHeight: '30px'}}>
          <MarkdownRender style={{maxWidth: '800px'}} text={text} />
        </div>
      </>
    )
  }
}

export default About;