import React from 'react';

const style = {
  fontSize: '20px',
  fontWeight: 'bold',
  height: '48px',
  lineHeight: '48px',
  paddingLeft: '16px'
  
};

export class Head extends React.Component {
  render() {
    return (
      <div style={style}>
        {this.props.title}
      </div>
    );
  }
}

export default Head;