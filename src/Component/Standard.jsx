import React from 'react';
import * as PropTypes from "prop-types";

import AppBarButton from "react-uwp/AppBarButton";
import Button from "react-uwp/Button";
import Icon from "react-uwp/Icon";

import Head from './Head'

class Standard extends React.Component {
  static contextTypes = { theme: PropTypes.object };
  
  constructor(props) {
    super(props);
    this.state = {
      lastValue: 0,
      lastOpe: '',
      value: 0,
      pre: '',
      result: -3309,
      isDec: 0,
      M: 0,
    };
  }

  pressNum = (num) => {
    let newPre = '';
    let newValue = 0;
    let newResult = 0;
    let newIsDec = 0;
    newResult = -3309;
    if (this.state.pre === '') {
      newPre = this.state.pre;
    } else {
      newPre = this.state.pre;
    }
    if (this.state.result === -3309) {
      if (this.state.isDec === 0) {
        newValue = 10 * this.state.value + num;
      } else if (this.state.isDec === 1) {
        newIsDec = 2;
        newValue = this.state.value + num / 10;
      } else if (this.state.isDec === 2) {
        newIsDec = 2;
        newValue = parseFloat(this.state.value.toString() + num.toString());
      }
    } else {
      newPre = '';
      newValue = num;
    }
    this.setState((state) => ({ pre: newPre, value: newValue, result: newResult, isDec: newIsDec }));
  }

  oneNumOpre = (ope, name) => {
    if (this.state.pre === '') {
      this.setState((state) => ({ pre: name.replace('%d', state.value), value: ope(state.value), result: ope(state.value)}));
    } else {
      this.setState((state) => ({ pre: name.replace('%d', state.pre), value: ope(state.value), result: ope(state.value) }));
    }
  }

  twoNumOpre = (name) => {
    this.setState((state) => ({ lastValue: state.value, value: 0, result: -3309, pre: `${state.value} ${name} `, lastOpe: name }));
  }

  eqal = () => {
    const opers = {
      '+': (a, b) => a + b,
      '-': (a, b) => a - b,
      '/': (a, b) => a / b,
      '*': (a, b) => a * b,
    };
    if (this.state.lastOpe === '') {
      this.setState((state) => ({ result: -3309, pre: `${state.pre === '' ? state.value : state.pre} =` }));
    } else {
      this.setState((state) => ({ lastValue: 0, value: opers[state.lastOpe](state.lastValue, state.value), result: -3309, pre: `${state.pre}${state.value}`, lastOpe: '' }));
    }
  }

  backspace = () => {
    if (this.state.value !== 0 && this.state.result === -3309 ) {
      if (this.state.isDec === 0) {
        this.setState((state) => ({ value: parseInt(state.value / 10) }));
      } else if (this.state.isDec === 1) {
        this.setState((state) => ({ isDec: 0}));
      } else if (this.state.isDec === 2) {
        let s = this.state.value.toString();
        s = s.substring(0, s.length - 1);
        console.log(s, this.state);
        if (s[s.length - 1] === '.') {
          s = s.substring(0, s.length - 1);
          this.setState((state) => ({ isDec: 1, value: parseInt(s)}));
        } else {
          this.setState((state) => ({ isDec: 2, value: parseFloat(s)}));
        }
      }
    }
  }

  opreC = () => {
    this.setState(() => ({ value: 0, isDec: 0  }));
  }

  opreCE = () => {
    this.setState(() => ({ pre: '', result: -3309, value: 0, isDec: 0 }));
  }

  point = () => {
    const isDec = this.state.isDec;
    if (isDec === 0 ) {
      this.setState((state) => ({ isDec: 1 }));
    }
  }

  neg = () => {
    if (this.state.result === -3309) {
      this.setState((state) => ({ value: -1 * state.value}));
    } else {
      this.setState((state) => ({ pre: `-( ${state.value} )`, value: -1 * state.value, result: -1 * state.value}));
    }
  }


  render() {
    return (
      <>
        <Head title="Standard"/>
        <div style={{height: 'calc(100% - 48px)', width: '100%'}}>
          <div style={{height: '20%', textAlign: 'right', paddingRight: '20px'}}>
            <div style={{ fontSize: '16px', paddingRight: '10px', position: 'relative', top: '40%', transform: 'translateY(-50%)'}}>{this.state.pre}</div>
            <div style={{ fontSize: '46px', position: 'relative', top: '50%', transform: 'translateY(-50%)'}}>{this.state.value}{this.state.isDec === 1 ? '.' : ''}</div>
          </div>
          <div style={{display: 'flex', height: '7%'}}>
            <AppBarButton label="MC" onClick={() => {this.setState((s) => ({ M: 0 }));}}/>
            <AppBarButton label="MR" onClick={() => {this.setState((s) => ({ value: s.M }));}}/>
            <AppBarButton label="MS" onClick={() => {console.log(this.state.M);}}/>
            <AppBarButton label="M+" onClick={() => {this.setState((s) => ({ M: s.M + s.value }));}}/>
            <AppBarButton label="M-" onClick={() => {this.setState((s) => ({ M: s.M - s.value }));}}/>
            <div style={{textAlign: 'right', width: 'calc(100% - 192px)'}}><div style={{fontSize: '20px', position: 'relative', top: '70%', transform: 'translateY(-50%)', textAlign: 'center'}}>{this.state.M === 0 ? '' : this.state.M}</div></div>
          </div>
          <div style={{height: '73%', weight: '100%'}}>
            <Button className="std-num-button" onClick={() => {this.oneNumOpre((d)=>d/100, '%d%');}}>% </Button>
            <Button className="std-num-button" onClick={() => {this.opreCE();}}>CE </Button>
            <Button className="std-num-button" onClick={() => {this.opreC();}}>C </Button>
            <Button className="std-num-button" onClick={() => {this.backspace();}}><Icon>BackSpaceQWERTYMd</Icon></Button>

            <Button className="std-num-button" onClick={() => {this.oneNumOpre((d)=>1/d, '1/( %d )');}}>1/x</Button>
            <Button className="std-num-button" onClick={() => {this.oneNumOpre((d)=>d*d, '( %d )²');}}>x²</Button>
            <Button className="std-num-button" onClick={() => {this.oneNumOpre((d)=>Math.sqrt(d), '√( %d )');}}>√x</Button>
            <Button className="std-num-button" onClick={() => {this.twoNumOpre('/');}}>÷</Button>

            <Button className="std-num-button" onClick={() => {this.pressNum(7);}}>7</Button>
            <Button className="std-num-button" onClick={() => {this.pressNum(8);}}>8</Button>
            <Button className="std-num-button" onClick={() => {this.pressNum(9);}}>9</Button>
            <Button className="std-num-button" onClick={() => {this.twoNumOpre('*');}}>×</Button>

            <Button className="std-num-button" onClick={() => {this.pressNum(4);}}>4</Button>
            <Button className="std-num-button" onClick={() => {this.pressNum(5);}}>5</Button>
            <Button className="std-num-button" onClick={() => {this.pressNum(6);}}>6</Button>
            <Button className="std-num-button" onClick={() => {this.twoNumOpre('-');}}>-</Button>

            <Button className="std-num-button" onClick={() => {this.pressNum(1);}}>1</Button>
            <Button className="std-num-button" onClick={() => {this.pressNum(2);}}>2</Button>
            <Button className="std-num-button" onClick={() => {this.pressNum(3);}}>3</Button>
            <Button className="std-num-button" onClick={() => {this.twoNumOpre('+');}}>+</Button>

            <Button className="std-num-button" onClick={() => {this.neg();}}>+/-</Button>
            <Button className="std-num-button" onClick={() => {this.pressNum(0);}}>0</Button>
            <Button className="std-num-button" onClick={() => {this.point();}}>.</Button>
            <Button className="std-num-button" onClick={() => {this.eqal();}}>=</Button>
          </div>
        </div>
      </>
    );
  }
}

export default Standard;