import React from 'react';
import * as PropTypes from "prop-types";

import AppBarButton from "react-uwp/AppBarButton";
import Button from "react-uwp/Button";
import Dialog from "react-uwp/Dialog";
import Icon from "react-uwp/Icon";

import Head from './Head'

export class Scientific extends React.Component {
  static contextTypes = { theme: PropTypes.object };
  
  constructor(props) {
    super(props);
    this.state = {
      M: 0,
      showTirDialog: false,
      showFuncDialog: false,
      value: '0',
      historyStack: [],
      status: 0, // 状态机, 0: 数字未提交, 1 中途结果, 2 最终结果
    };
    this.initMath();
  }

  errorLog = () => {
    console.log('this: ', this);
    console.log('props: ', this.props);
    console.log('state: ', this.state);
  };

  getLeftParentheses = () => this.state.historyStack.reduce((o, k) => (o + (k === '(' ? 1 : 0)), 0);

  getRightParentheses = () => this.state.historyStack.reduce((o, k) => (o + (k === ')' ? 1 : 0)), 0);

  getNetLeftParentheses = () => this.state.historyStack.reduce((o, k) => (o + (k === '(' ? 1 : (k === ')' ? -1 : 0))), 0);

  getNetRightParentheses = () => this.state.historyStack.reduce((o, k) => (o + (k === ')' ? 1 : (k === '(' ? -1 : 0 ))), 0);

  pressLeftParentheses = () => {
    switch(this.state.status) {
      case 0:
      case 1:
        if (this.state.historyStack.length === 0 || this.isTwoExpr(this.state.historyStack[this.state.historyStack.length - 1])) {
          this.setState(s =>({ historyStack: [...s.historyStack, '('] }));
        } else {
          this.setState(s =>({ historyStack: [...s.historyStack, '+', '('] }));
        }
        break;
      case 2:
        this.setState(s =>({ historyStack: ['('] }));
        break;
      default:
        break;
    }
  };

  pressRightParentheses = () => {
    if (this.getNetLeftParentheses() <= 0) {
      return;
    }
    if (this.state.historyStack.length === 0 || this.isTwoExpr(this.state.historyStack[this.state.historyStack.length - 1]) || this.state.historyStack[this.state.historyStack.length - 1] === '(') {
      this.setState(s =>({ historyStack: [...s.historyStack, this.getNowValue(), ')'] }));
    } else {
      this.setState(s =>({ historyStack: [...s.historyStack, ')'] }));
    }
  };

  isTwoExpr = (e) => e === '+' || e === '-' || e === '*' || e === '/' || e === 'Mod' || e === '(';

  getNowValue = () => {
    let v = this.state.value;
    if (v.indexOf('.') === -1) {
      return parseInt(v);
    } else {
      return parseFloat(v);
    }
  };

  initMath = () => {
    Math.sqr = d => d ** 2;
    Math.cube = d => d ** 3;
    Math.fact = d => {
      let cache = [1];
      function factorial(n) {
          var result = cache[n - 1];
          if (result == null) {
              result = 1;
              for (var i = 1;i <= n;++ i) {
                  result *= i;
              }
              cache[n - 1] = result;
          }
          return result;
      }
      return factorial(d);
    };
    Math.sec = d => 1 / Math.cos(d);
    Math.csc = d => 1 / Math.sin(d);
    Math.cot = d => 1 / Math.tan(d);
    Math.sech = d => 1 / Math.cosh(d);
    Math.csch = d => 1 / Math.sinh(d);
    Math.coth = d => 1 / Math.tanh(d);
    // 其余的实现不动了, 搞不懂
    Math.dms = d => {
      let du = parseInt(d);
      d = 60 * (d - du);
      let ff = parseInt(d);
      d = 60 * (d - ff);
      let mc = d;
      return du + ff / 100 + mc / 10000;
    };
    Math.degress = d => {
      let r = parseInt(d);
      d = (d - parseInt(d)) * 100;
      r += parseInt(d) / 60;
      d = (d - parseInt(d)) * 100;
      r += d / 3600;
      return r;
    };
  };

  calc = (s) => {
    const calcDic = {
      'neg': '-',
      'ln': 'Math.log',
      'log': 'Math.log10',
      '^': '**',
      'cube': 'Math.cube',
      'sqrt': 'Math.sqrt',
      'cbrt': 'Math.cbrt',
      'sqr': 'Math.sqr',
      'abs': 'Math.abs',
      'Mod': '%',
      'fact': 'Math.fact',
      'sin': 'Math.sin',
      'sinh': 'Math.sinh',
      'arcsin': 'Math.asin',
      'arcsinh': 'Math.asinh',
      'cos': 'Math.cos',
      'cosh': 'Math.cosh',
      'arccos': 'Math.acos',
      'arccosh': 'Math.acosh',
      'tan': 'Math.tan',
      'tanh': 'Math.tanh',
      'arctan': 'Math.atan',
      'arctanh': 'Math.atanh',
      'sec': 'Math.sec',
      'sech': 'Math.sech',
      'csc': 'Math.csc',
      'csch': 'Math.csch',
      'cot': 'Math.cot',
      'coth': 'Math.coth',
      'floor': 'Math.floor',
      'ceil': 'Math.ceil',
      'dms': 'Math.dms',
      'degress': 'Math.degress',

    };
    console.log(s);
    s = s.map(d => calcDic[d] === undefined ? d : calcDic[d]);
    console.log(s);
    let result = '';
    try {
      result = eval(s.join('')).toString();
    } catch {
      result = 'error';
    }
    return isNaN(result) ? 'error' : result;
  }

  pressSpecNum = (num) => {
    const specNumDic = {
      'pi': '3.142',
      'e': '2.718',
      'rand': Math.random().toString(),
    }
    let trueNum = specNumDic[num] || '0';
    switch (this.state.status) {
      case 0:
          this.setState(()=>({ value: trueNum }));
        break;
      case 1:
        this.setState(()=>({ value: trueNum, status: 0 }));
        break;
      case 2:
        this.setState(()=>({ value: trueNum, status: 0, historyStack: [] }));
        break;
      default: 
        this.errorLog();
        break;
    }
  };

  pressNum = (num) => {
    switch (this.state.status) {
      case 0:
        if (this.state.value === '0') {
          if (num === '.') {
            this.setState(()=>({ value: '0.' }));
          } else {
            this.setState(()=>({ value: num }));
          }
        } else {
          if (!(this.state.value.indexOf('.') !== -1 && num === '.')) {
            // 排除已有小数点还要输入小数点的情况
            if (this.state.value.length < 32) {
              this.setState(s=>({ value: s.value + num }));
            }
          }
        }
        break;
      case 1:
        if (num === '.') {
          this.setState(()=>({ value: '0.', status: 0 }));
        } else {
          this.setState(()=>({ value: num, status: 0 }));
        }
        break;
      case 2:
        if (num === '.') {
          this.setState(()=>({ value: '0.', status: 0, historyStack: [] }));
        } else {
          this.setState(()=>({ value: num, status: 0, historyStack: [] }));
        }
        break;
      default: 
        this.errorLog();
        break;
    }
  };

  pressExp = () => {
    switch (this.state.status) {
      case 0:
        if (this.state.value === '0') {
          this.setState(s=>({ value: '0.e+0' }));
        } else {
          if (this.state.value[this.state.value.length - 1] === '.') {
            this.setState(s=>({ value: s.value.slice(0, s.value.length - 1) + 'e+0' }));
          } else {
            this.setState(s=>({ value: s.value + 'e+0' }));
          }
        }
        break;
      case 1:
      case 2:
        break;
      default: 
        this.errorLog();
        break;
    }
  };

  backspace = () => {
    switch (this.state.status) {
      case 0:
        if (this.state.value !== '0') {
          if (this.state.value.length === 1 || (this.state.value.length === 2 && this.state.value[0] === '-')) {
            this.setState(s=>({ value: '0' }));
          } else {
            if (this.state.value.indexOf('e') !== -1 && this.state.value.length > 2 && (this.state.value.slice(this.state.value.length - 3) === 'e+0' || this.state.value.slice(this.state.value.length - 3) === 'e-0')) {
              this.setState(s=>({ value: s.value.substr(0, s.value.length - 3) }));
            } else {
              this.setState(s=>({ value: s.value.substr(0, s.value.length - 1) }));
            }
          }
        }
        break;
      case 1:
        break;
      case 2:
        this.setState(()=>({ historyStack: [] }));
        break;
      default: 
        this.errorLog();
        break;
    }
  };

  CorCE = () => {
    if (this.state.value === '0') {
      this.setState(s=>({ status: 0, value: '0', historyStack: [] }));
    } else {
      this.setState(s=>({ status: 0, value: '0' }));
    }
  };

  twoNumOpre = type => {
    // +, -, *, /
    switch (this.state.status) {
      case 0:
        if (this.state.historyStack.length === 0 || this.isTwoExpr(this.state.historyStack[this.state.historyStack.length - 1])) {
          this.setState(s=>({ status: 1, value: this.calc([...s.historyStack, this.getNowValue()]).toString(), historyStack: [...s.historyStack, this.getNowValue() , type] }));
        } else {
          this.setState(s=>({ status: 1, value: this.calc([...s.historyStack]).toString(), historyStack: [...s.historyStack, type] }));
        }
        break;
      case 1:
        this.setState(s=>({ historyStack: [...s.historyStack.slice(0, s.historyStack.length - 1), type] }));
        break;
      case 2:
        this.setState(s=>({ status: 1, historyStack: [this.getNowValue(), type] }));
        break;
      default: 
        this.errorLog();
        break;
    }
  };

  oneNumOpre = type => {
    switch (this.state.status) {
      case 0:
      case 1:
        if (this.state.historyStack.length === 0 || this.isTwoExpr(this.state.historyStack[this.state.historyStack.length - 1])) {
          this.setState(s=>({ status: 0, historyStack: [...s.historyStack, type , '(', this.getNowValue(), ')'] }));
        } else {
          this.setState(s=>({ status: 0, historyStack: [...s.historyStack, '+', type , '(', this.getNowValue(), ')'] }));
        }
        break;
      case 2:
        this.setState(s=>({ status: 2, value: this.calc([type, '(', this.getNowValue(), ')']),  historyStack: [type, '(', this.getNowValue(), ')', '='] }));
        break;
      default: 
        this.errorLog();
        break;
    }
    this.setState(s=>({ showTirDialog: false, showFuncDialog: false }));
  };

  pressEqual = () => {
    switch (this.state.status) {
      case 0:
      case 1:
        if (this.state.historyStack.length === 0 || this.isTwoExpr(this.state.historyStack[this.state.historyStack.length - 1])) {
          this.setState(s=>({ status: 2, value: this.calc([...s.historyStack, this.getNowValue()]), historyStack: [...s.historyStack, this.getNowValue(), '='] }));
        } else {
          this.setState(s=>({ status: 2, value: this.calc(s.historyStack), historyStack: [...s.historyStack, '='] }));
        }
        break;
      case 2:
        this.setState(s=>({ status: 2, historyStack: [this.getNowValue(), '='] }));
        break;
      default:
        this.errorLog();
        break;
    }
  };

  pressNeg = () => {
    switch (this.state.status) {
      case 0:
        if (this.state.value !== '0') {
          if (this.state.value.indexOf('e') === -1) {
            if (this.state.value[0] === '-') {
              this.setState(s=>({ status: 0, value: s.value.slice(1) }));
            } else {
              this.setState(s=>({ status: 0, value: '-' + s.value }));
            }
          } else {
            let index = this.state.value.indexOf('e') + 1;
            let newSign = this.state.value[index] === '+' ? '-' : '+';
            let newValueArr = this.state.value.split('');
            newValueArr[index] = newSign;
            this.setState(s=>({ status: 0, value: newValueArr.join('') }));
          }
        }
        break;
      case 1:
      case 2:
        this.oneNumOpre('neg');
        break;
      default:
        this.errorLog();
        break;
    }
  };



  render() {
    return (
      <>
        <Head title="Scientific"/>
        <div style={{height: 'calc(100% - 48px)', width: '100%'}}>
          <div style={{height: '20%', textAlign: 'right', paddingRight: '20px'}}>
          <div style={{ fontSize: '16px', paddingRight: '10px', position: 'relative', top: '40%', transform: 'translateY(-50%)'}}>{this.state.historyStack.join(' ')}</div>
            <div style={{ fontSize: '46px', position: 'relative', top: '50%', transform: 'translateY(-50%)'}}>{this.state.value}</div>
          </div>
          <div style={{display: 'flex', height: '7%'}}>
            <AppBarButton label="RAD" />
            <AppBarButton label="F-E" />
            </div>
          <div style={{display: 'flex', height: '7%'}}>
            <AppBarButton label="MC" onClick={() => {this.setState((s) => ({ M: 0 }));}}/>
            <AppBarButton label="MR" onClick={() => {this.setState((s) => ({ value: s.M }));}}/>
            <AppBarButton label="MS" onClick={() => {console.log(this.state.M);}}/>
            <AppBarButton label="M+" onClick={() => {this.setState((s) => ({ M: s.M + s.value }));}}/>
            <AppBarButton label="M-" onClick={() => {this.setState((s) => ({ M: s.M - s.value }));}}/>
            <div style={{textAlign: 'right', width: 'calc(100% - 192px)'}}><div style={{fontSize: '20px', position: 'relative', top: '70%', transform: 'translateY(-50%)', textAlign: 'center'}}>{this.state.M === 0 ? '' : this.state.M}</div></div>
          </div>
          <div style={{display: 'flex', height: '5%'}}>
            <Button style={{margin: '0 1px', background: 'rgb(0, 0, 0, 0)'}} onClick={() => {this.setState((s) => ({ showTirDialog: true }));}}>Trigonometry&nbsp;&nbsp;&nbsp;<Icon>ScrollChevronDownLegacy</Icon></Button>
            <Button style={{margin: '0 1px', background: 'rgb(0, 0, 0, 0)'}} onClick={() => {this.setState((s) => ({ showFuncDialog: true }));}}>Function&nbsp;&nbsp;&nbsp;<Icon>ScrollChevronDownLegacy</Icon></Button>
          </div>
          <div style={{height: '61%', weight: '100%'}}>
            <Button className="sci-num-button" onClick={() => {this.oneNumOpre('cube');}}>x³</Button>
            <Button className="sci-num-button" onClick={() => {this.pressSpecNum('pi');}}>π</Button>
            <Button className="sci-num-button" onClick={() => {this.pressSpecNum('e');}}>e</Button>
            <Button className="sci-num-button" onClick={() => {this.CorCE();}}>{this.state.value === '0' ? 'C': 'CE'}</Button>
            <Button className="sci-num-button" onClick={() => {this.backspace();}}><Icon>BackSpaceQWERTYMd</Icon></Button>

            <Button className="sci-num-button" onClick={() => {this.oneNumOpre('sqr');}}>x²</Button>
            <Button className="sci-num-button" onClick={() => {this.oneNumOpre('1/');}}>1/x</Button>
            <Button className="sci-num-button" onClick={() => {this.oneNumOpre('abs');}}>|x|</Button>
            <Button className="sci-num-button" onClick={() => {this.pressExp();}}>exp</Button>
            <Button className="sci-num-button" onClick={() => {this.oneNumOpre('%');}}>mod</Button>

            <Button className="sci-num-button" onClick={() => {this.oneNumOpre('sqrt');}}>²√x</Button>
            <Button className="sci-num-button" onClick={() => {this.pressLeftParentheses();}}>
              (&nbsp;<span style={{ fontSize:'14px',  }}>{ this.getNetLeftParentheses() || '' }</span>
            </Button>
            <Button className="sci-num-button" onClick={() => {this.pressRightParentheses();}}>
              )&nbsp;<span style={{ fontSize:'14px',  }}>{ this.getNetRightParentheses() || '' }</span>
            </Button>
            <Button className="sci-num-button" onClick={() => {this.oneNumOpre('fact');}}>n!</Button>
            <Button className="sci-num-button" onClick={() => {this.twoNumOpre('/')}}>÷</Button>

            <Button className="sci-num-button" onClick={() => {this.twoNumOpre('^');}}>x^y</Button>
            <Button className="sci-num-button" onClick={() => {this.pressNum('7');}}>7</Button>
            <Button className="sci-num-button" onClick={() => {this.pressNum('8');}}>8</Button>
            <Button className="sci-num-button" onClick={() => {this.pressNum('9');}}>9</Button>
            <Button className="sci-num-button" onClick={() => {this.twoNumOpre('*')}}>×</Button>

            <Button className="sci-num-button" onClick={() => {this.neg();}}>10^x</Button>
            <Button className="sci-num-button" onClick={() => {this.pressNum('4');}}>4</Button>
            <Button className="sci-num-button" onClick={() => {this.pressNum('5');}}>5</Button>
            <Button className="sci-num-button" onClick={() => {this.pressNum('6');}}>6</Button>
            <Button className="sci-num-button" onClick={() => {this.twoNumOpre('-')}}>-</Button>

            <Button className="sci-num-button" onClick={() => {this.oneNumOpre('log');}}>log</Button>
            <Button className="sci-num-button" onClick={() => {this.pressNum('1');}}>1</Button>
            <Button className="sci-num-button" onClick={() => {this.pressNum('2');}}>2</Button>
            <Button className="sci-num-button" onClick={() => {this.pressNum('3');}}>3</Button>
            <Button className="sci-num-button" onClick={() => {this.twoNumOpre('+')}}>+</Button>

            <Button className="sci-num-button" onClick={() => {this.oneNumOpre('ln');}}>ln</Button>
            <Button className="sci-num-button" onClick={() => {this.pressNeg();}}>+/-</Button>
            <Button className="sci-num-button" onClick={() => {this.pressNum('0');}}>0</Button>
            <Button className="sci-num-button" onClick={() => {this.pressNum('.');}}>.</Button>
            <Button className="sci-num-button" onClick={() => {this.pressEqual();}}>=</Button>
          </div>
            <Dialog
              defaultShow={this.state.showTirDialog}
              style={{ zIndex: 400, display: 'flex', alignItems: 'center'}}
              contentStyle={{width: '60%', minWidth: '400px', maxWidth: '800px', height: '60%'}}
              onCloseDialog={() => this.setState({ showTirDialog: false })}
            >
                <Button className="sci-tir-dialog-button" onClick={() => {this.oneNumOpre('sin');}}>sin</Button>
                <Button className="sci-tir-dialog-button" onClick={() => {this.oneNumOpre('arcsin');}}>sin-1</Button>
                <Button className="sci-tir-dialog-button" onClick={() => {this.oneNumOpre('sinh');}}>sinh</Button>
                <Button className="sci-tir-dialog-button" onClick={() => {this.oneNumOpre('arcsinh');}}>sinh-1</Button>
                <Button className="sci-tir-dialog-button" onClick={() => {this.oneNumOpre('cos');}}>cos</Button>
                <Button className="sci-tir-dialog-button" onClick={() => {this.oneNumOpre('cosh');}}>cosh</Button>
                <Button className="sci-tir-dialog-button" onClick={() => {this.oneNumOpre('arccos');}}>cos-1</Button>
                <Button className="sci-tir-dialog-button" onClick={() => {this.oneNumOpre('arccosh');}}>cosh-1</Button>
                <Button className="sci-tir-dialog-button" onClick={() => {this.oneNumOpre('tan');}}>tan</Button>
                <Button className="sci-tir-dialog-button" onClick={() => {this.oneNumOpre('tanh');}}>tanh</Button>
                <Button className="sci-tir-dialog-button" onClick={() => {this.oneNumOpre('arctan');}}>tan-1</Button>
                <Button className="sci-tir-dialog-button" onClick={() => {this.oneNumOpre('arctanh');}}>tanh-1</Button>
                <Button className="sci-tir-dialog-button" onClick={() => {this.oneNumOpre('sec');}}>sec</Button>
                <Button className="sci-tir-dialog-button" onClick={() => {this.oneNumOpre('sech');}}>sech</Button>
                <Button className="sci-tir-dialog-button" >sec-1</Button>
                <Button className="sci-tir-dialog-button" >sech-1</Button>
                <Button className="sci-tir-dialog-button" onClick={() => {this.oneNumOpre('csc');}}>csc</Button>
                <Button className="sci-tir-dialog-button" onClick={() => {this.oneNumOpre('csch');}}>csch</Button>
                <Button className="sci-tir-dialog-button" >csc-1</Button>
                <Button className="sci-tir-dialog-button" >csch-1</Button>
                <Button className="sci-tir-dialog-button" onClick={() => {this.oneNumOpre('cot');}}>cot</Button>
                <Button className="sci-tir-dialog-button" onClick={() => {this.oneNumOpre('coth');}}>coth</Button>
                <Button className="sci-tir-dialog-button" >cot-1</Button>
                <Button className="sci-tir-dialog-button" >coth-1</Button>
            </Dialog>
            <Dialog
              defaultShow={this.state.showFuncDialog}
              style={{ zIndex: 400, display: 'flex', alignItems: 'center'}}
              contentStyle={{width: '60%', minWidth: '400px', maxWidth: '800px', maxHeight: '400px', height: '60%'}}
              onCloseDialog={() => this.setState({ showFuncDialog: false })}
            >
                <Button className="sci-func-dialog-button" onClick={() => {this.oneNumOpre('abs');}}>|x|</Button>
                <Button className="sci-func-dialog-button" onClick={() => {this.oneNumOpre('floor');}}>⌊x⌋</Button>
                <Button className="sci-func-dialog-button" onClick={() => {this.oneNumOpre('ceil');}}>⌈x⌉</Button>
                <Button className="sci-func-dialog-button" onClick={() => {this.pressSpecNum('rand');}}>rand</Button>
                <Button className="sci-func-dialog-button" onClick={() => {this.oneNumOpre('dms');}}>→ dms</Button>
                <Button className="sci-func-dialog-button" onClick={() => {this.oneNumOpre('degress');}}>→ deg</Button>
            </Dialog>
        </div>
      </>
    );
  }
}

export default Scientific;