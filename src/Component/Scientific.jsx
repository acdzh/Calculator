import React, { useState, useCallback } from 'react';
import AppBarButton from "react-uwp/AppBarButton";
import Button from "react-uwp/Button";
import Dialog from "react-uwp/Dialog";
import Icon from "react-uwp/Icon";
import * as math from 'mathjs';
import Head from './Head';

// Define custom functions for mathjs scope
const customScope = {
  dms: (d) => {
    let du = parseInt(d);
    d = 60 * (d - du);
    let ff = parseInt(d);
    d = 60 * (d - ff);
    let mc = d;
    return du + ff / 100 + mc / 10000;
  },
  degress: (d) => {
    let r = parseInt(d);
    d = (d - parseInt(d)) * 100;
    r += parseInt(d) / 60;
    d = (d - parseInt(d)) * 100;
    r += d / 3600;
    return r;
  },
  pow10: (d) => 10 ** d,
  sqr: (d) => d ** 2,
  cube: (d) => d ** 3,
  fact: math.factorial,
  ln: math.log,
  log: math.log10
};

const Scientific = () => {
  const [state, setState] = useState({
    M: 0,
    showTirDialog: false,
    showFuncDialog: false,
    value: '0',
    historyStack: [],
    status: 0, // 0: inputting, 1: intermediate result, 2: final result
  });

  const getLeftParentheses = useCallback(() => state.historyStack.reduce((o, k) => (o + (k === '(' ? 1 : 0)), 0), [state.historyStack]);
  const getRightParentheses = useCallback(() => state.historyStack.reduce((o, k) => (o + (k === ')' ? 1 : 0)), 0), [state.historyStack]);
  const getNetLeftParentheses = useCallback(() => state.historyStack.reduce((o, k) => (o + (k === '(' ? 1 : (k === ')' ? -1 : 0))), 0), [state.historyStack]);
  const getNetRightParentheses = useCallback(() => state.historyStack.reduce((o, k) => (o + (k === ')' ? 1 : (k === '(' ? -1 : 0 ))), 0), [state.historyStack]);

  const isTwoExpr = (e) => e === '+' || e === '-' || e === '*' || e === '/' || e === 'Mod' || e === '(';

  const getNowValue = () => {
    let v = state.value;
    if (v.indexOf('.') === -1) {
      return parseInt(v);
    } else {
      return parseFloat(v);
    }
  };

  const calc = (s) => {
    const calcDic = {
      'neg': '-',
      'ln': 'ln',
      'log': 'log',
      'pow10': 'pow10',
      '^': '^',
      'cube': 'cube',
      'sqrt': 'sqrt',
      'cbrt': 'cbrt',
      'sqr': 'sqr',
      'abs': 'abs',
      'Mod': '%',
      'fact': 'fact',
      'sin': 'sin',
      'sinh': 'sinh',
      'arcsin': 'asin',
      'arcsinh': 'asinh',
      'cos': 'cos',
      'cosh': 'cosh',
      'arccos': 'acos',
      'arccosh': 'acosh',
      'tan': 'tan',
      'tanh': 'tanh',
      'arctan': 'atan',
      'arctanh': 'atanh',
      'sec': 'sec',
      'sech': 'sech',
      'csc': 'csc',
      'csch': 'csch',
      'cot': 'cot',
      'coth': 'coth',
      'floor': 'floor',
      'ceil': 'ceil',
      'dms': 'dms',
      'degress': 'degress',
    };
    
    // Map tokens to mathjs compatible names
    const mappedS = s.map(d => calcDic[d] === undefined ? d : calcDic[d]);
    
    let result = '';
    try {
      // Use mathjs evaluate with custom scope
      const expr = mappedS.join('');
      // Note: mathjs might fail on empty string or weird syntax, so we wrap in try-catch
      result = math.evaluate(expr, customScope).toString();
    } catch (e) {
      console.error(e);
      result = 'error';
    }
    return isNaN(result) ? 'error' : result;
  };

  const pressLeftParentheses = () => {
    setState(s => {
      let newStack;
      switch(s.status) {
        case 0:
        case 1:
          if (s.historyStack.length === 0 || isTwoExpr(s.historyStack[s.historyStack.length - 1])) {
            newStack = [...s.historyStack, '('];
          } else {
            newStack = [...s.historyStack, '+', '('];
          }
          return { ...s, historyStack: newStack };
        case 2:
          return { ...s, historyStack: ['('] };
        default:
          return s;
      }
    });
  };

  const pressRightParentheses = () => {
    if (getNetLeftParentheses() <= 0) {
      return;
    }
    setState(s => {
      let newStack;
      if (s.historyStack.length === 0 || isTwoExpr(s.historyStack[s.historyStack.length - 1]) || s.historyStack[s.historyStack.length - 1] === '(') {
        newStack = [...s.historyStack, getNowValue(), ')'];
      } else {
        newStack = [...s.historyStack, ')'];
      }
      return { ...s, historyStack: newStack };
    });
  };

  const pressSpecNum = (num) => {
    const specNumDic = {
      'pi': '3.142',
      'e': '2.718',
      'rand': Math.random().toString(),
    }
    let trueNum = specNumDic[num] || '0';
    setState(s => {
      switch (s.status) {
        case 0:
          return { ...s, value: trueNum };
        case 1:
          return { ...s, value: trueNum, status: 0 };
        case 2:
          return { ...s, value: trueNum, status: 0, historyStack: [] };
        default:
          return s;
      }
    });
  };

  const pressNum = (num) => {
    setState(s => {
      switch (s.status) {
        case 0:
          if (s.value === '0') {
            if (num === '.') {
              return { ...s, value: '0.' };
            } else {
              return { ...s, value: num };
            }
          } else {
            if (!(s.value.indexOf('.') !== -1 && num === '.')) {
              if (s.value.length < 32) {
                return { ...s, value: s.value + num };
              }
            }
            return s;
          }
        case 1:
          if (num === '.') {
            return { ...s, value: '0.', status: 0 };
          } else {
            return { ...s, value: num, status: 0 };
          }
        case 2:
          if (num === '.') {
            return { ...s, value: '0.', status: 0, historyStack: [] };
          } else {
            return { ...s, value: num, status: 0, historyStack: [] };
          }
        default:
          return s;
      }
    });
  };

  const pressExp = () => {
    setState(s => {
      if (s.status === 0) {
        if (s.value === '0') {
          return { ...s, value: '0.e+0' };
        } else {
          if (s.value[s.value.length - 1] === '.') {
            return { ...s, value: s.value.slice(0, s.value.length - 1) + 'e+0' };
          } else {
            return { ...s, value: s.value + 'e+0' };
          }
        }
      }
      return s;
    });
  };

  const backspace = () => {
    setState(s => {
      switch (s.status) {
        case 0:
          if (s.value !== '0') {
            if (s.value.length === 1 || (s.value.length === 2 && s.value[0] === '-')) {
              return { ...s, value: '0' };
            } else {
              if (s.value.indexOf('e') !== -1 && s.value.length > 2 && (s.value.slice(s.value.length - 3) === 'e+0' || s.value.slice(s.value.length - 3) === 'e-0')) {
                return { ...s, value: s.value.substr(0, s.value.length - 3) };
              } else {
                return { ...s, value: s.value.substr(0, s.value.length - 1) };
              }
            }
          }
          return s;
        case 2:
          return { ...s, historyStack: [] };
        default:
          return s;
      }
    });
  };

  const CorCE = () => {
    setState(s => {
      if (s.value === '0') {
        return { ...s, status: 0, value: '0', historyStack: [] };
      } else {
        return { ...s, status: 0, value: '0' };
      }
    });
  };

  const twoNumOpre = type => {
    setState(s => {
      switch (s.status) {
        case 0:
          if (s.historyStack.length === 0 || isTwoExpr(s.historyStack[s.historyStack.length - 1])) {
            return { 
              ...s, 
              status: 1, 
              value: calc([...s.historyStack, getNowValue()]).toString(), 
              historyStack: [...s.historyStack, getNowValue(), type] 
            };
          } else {
            return { 
              ...s, 
              status: 1, 
              value: calc([...s.historyStack]).toString(), 
              historyStack: [...s.historyStack, type] 
            };
          }
        case 1:
          return { 
            ...s, 
            historyStack: [...s.historyStack.slice(0, s.historyStack.length - 1), type] 
          };
        case 2:
          return { 
            ...s, 
            status: 1, 
            historyStack: [getNowValue(), type] 
          };
        default:
          return s;
      }
    });
  };

  const oneNumOpre = type => {
    setState(s => {
      let newState = { ...s, showTirDialog: false, showFuncDialog: false };
      switch (s.status) {
        case 0:
        case 1:
          if (s.historyStack.length === 0 || isTwoExpr(s.historyStack[s.historyStack.length - 1])) {
            newState.status = 0;
            newState.historyStack = [...s.historyStack, type, '(', getNowValue(), ')'];
          } else {
            newState.status = 0;
            newState.historyStack = [...s.historyStack, '+', type, '(', getNowValue(), ')'];
          }
          break;
        case 2:
          newState.status = 2;
          newState.value = calc([type, '(', getNowValue(), ')']);
          newState.historyStack = [type, '(', getNowValue(), ')', '='];
          break;
        default:
          break;
      }
      return newState;
    });
  };

  const pressEqual = () => {
    setState(s => {
      switch (s.status) {
        case 0:
        case 1:
          if (s.historyStack.length === 0 || isTwoExpr(s.historyStack[s.historyStack.length - 1])) {
            return { 
              ...s, 
              status: 2, 
              value: calc([...s.historyStack, getNowValue()]), 
              historyStack: [...s.historyStack, getNowValue(), '='] 
            };
          } else {
            return { 
              ...s, 
              status: 2, 
              value: calc(s.historyStack), 
              historyStack: [...s.historyStack, '='] 
            };
          }
        case 2:
          return { 
            ...s, 
            status: 2, 
            historyStack: [getNowValue(), '='] 
          };
        default:
          return s;
      }
    });
  };

  const pressNeg = () => {
    setState(s => {
      switch (s.status) {
        case 0:
          if (s.value !== '0') {
            if (s.value.indexOf('e') === -1) {
              if (s.value[0] === '-') {
                return { ...s, status: 0, value: s.value.slice(1) };
              } else {
                return { ...s, status: 0, value: '-' + s.value };
              }
            } else {
              let index = s.value.indexOf('e') + 1;
              let newSign = s.value[index] === '+' ? '-' : '+';
              let newValueArr = s.value.split('');
              newValueArr[index] = newSign;
              return { ...s, status: 0, value: newValueArr.join('') };
            }
          }
          return s;
        case 1:
        case 2:
          // Call oneNumOpre logic directly or via a wrapper
          // But oneNumOpre calls setState, so we can't call it inside setState.
          // We need to return the state update that oneNumOpre would do.
          // Or simpler: handle this case in the handler wrapper.
          return s; 
        default:
          return s;
      }
    });
  };

  // Wrapper for pressNeg to handle the case 1 & 2 where it calls oneNumOpre
  const handlePressNeg = () => {
    if (state.status === 1 || state.status === 2) {
      oneNumOpre('neg');
    } else {
      pressNeg();
    }
  };

  return (
    <>
      <Head title="Scientific"/>
      <div style={{height: 'calc(100% - 48px)', width: '100%'}}>
        <div style={{height: '20%', textAlign: 'right', paddingRight: '20px'}}>
        <div style={{ fontSize: '16px', paddingRight: '10px', position: 'relative', top: '40%', transform: 'translateY(-50%)'}}>{state.historyStack.join(' ')}</div>
          <div style={{ fontSize: '46px', position: 'relative', top: '50%', transform: 'translateY(-50%)'}}>{state.value}</div>
        </div>
        <div style={{display: 'flex', height: '7%'}}>
          <AppBarButton label="RAD" />
          <AppBarButton label="F-E" />
          </div>
        <div style={{display: 'flex', height: '7%'}}>
          <AppBarButton label="MC" onClick={() => setState(s => ({ ...s, M: 0 }))}/>
          <AppBarButton label="MR" onClick={() => setState(s => ({ ...s, value: s.M }))}/>
          <AppBarButton label="MS" onClick={() => console.log(state.M)}/>
          <AppBarButton label="M+" onClick={() => setState(s => ({ ...s, M: s.M + s.value }))}/>
          <AppBarButton label="M-" onClick={() => setState(s => ({ ...s, M: s.M - s.value }))}/>
          <div style={{textAlign: 'right', width: 'calc(100% - 192px)'}}><div style={{fontSize: '20px', position: 'relative', top: '70%', transform: 'translateY(-50%)', textAlign: 'center'}}>{state.M === 0 ? '' : state.M}</div></div>
        </div>
        <div style={{display: 'flex', height: '5%'}}>
          <Button style={{margin: '0 1px', background: 'rgb(0, 0, 0, 0)'}} onClick={() => setState(s => ({ ...s, showTirDialog: true }))}>Trigonometry&nbsp;&nbsp;&nbsp;<Icon>ScrollChevronDownLegacy</Icon></Button>
          <Button style={{margin: '0 1px', background: 'rgb(0, 0, 0, 0)'}} onClick={() => setState(s => ({ ...s, showFuncDialog: true }))}>Function&nbsp;&nbsp;&nbsp;<Icon>ScrollChevronDownLegacy</Icon></Button>
        </div>
        <div style={{height: '61%', weight: '100%'}}>
          <Button className="sci-num-button" onClick={() => oneNumOpre('cube')}>x³</Button>
          <Button className="sci-num-button" onClick={() => pressSpecNum('pi')}>π</Button>
          <Button className="sci-num-button" onClick={() => pressSpecNum('e')}>e</Button>
          <Button className="sci-num-button" onClick={() => CorCE()}>{state.value === '0' ? 'C': 'CE'}</Button>
          <Button className="sci-num-button" onClick={() => backspace()}><Icon>BackSpaceQWERTYMd</Icon></Button>

          <Button className="sci-num-button" onClick={() => oneNumOpre('sqr')}>x²</Button>
          <Button className="sci-num-button" onClick={() => oneNumOpre('1/')}>1/x</Button>
          <Button className="sci-num-button" onClick={() => oneNumOpre('abs')}>|x|</Button>
          <Button className="sci-num-button" onClick={() => pressExp()}>exp</Button>
          <Button className="sci-num-button" onClick={() => oneNumOpre('%')}>mod</Button>

          <Button className="sci-num-button" onClick={() => oneNumOpre('sqrt')}>²√x</Button>
          <Button className="sci-num-button" onClick={() => pressLeftParentheses()}>
            (&nbsp;<span style={{ fontSize:'14px',  }}>{ getNetLeftParentheses() || '' }</span>
          </Button>
          <Button className="sci-num-button" onClick={() => pressRightParentheses()}>
            )&nbsp;<span style={{ fontSize:'14px',  }}>{ getNetRightParentheses() || '' }</span>
          </Button>
          <Button className="sci-num-button" onClick={() => oneNumOpre('fact')}>n!</Button>
          <Button className="sci-num-button" onClick={() => twoNumOpre('/')}>÷</Button>

          <Button className="sci-num-button" onClick={() => twoNumOpre('^')}>x^y</Button>
          <Button className="sci-num-button" onClick={() => pressNum('7')}>7</Button>
          <Button className="sci-num-button" onClick={() => pressNum('8')}>8</Button>
          <Button className="sci-num-button" onClick={() => pressNum('9')}>9</Button>
          <Button className="sci-num-button" onClick={() => twoNumOpre('*')}>×</Button>

          <Button className="sci-num-button" onClick={() => oneNumOpre('pow10')}>10^x</Button>
          <Button className="sci-num-button" onClick={() => pressNum('4')}>4</Button>
          <Button className="sci-num-button" onClick={() => pressNum('5')}>5</Button>
          <Button className="sci-num-button" onClick={() => pressNum('6')}>6</Button>
          <Button className="sci-num-button" onClick={() => twoNumOpre('-')}>-</Button>

          <Button className="sci-num-button" onClick={() => oneNumOpre('log')}>log</Button>
          <Button className="sci-num-button" onClick={() => pressNum('1')}>1</Button>
          <Button className="sci-num-button" onClick={() => pressNum('2')}>2</Button>
          <Button className="sci-num-button" onClick={() => pressNum('3')}>3</Button>
          <Button className="sci-num-button" onClick={() => twoNumOpre('+')}>+</Button>

          <Button className="sci-num-button" onClick={() => oneNumOpre('ln')}>ln</Button>
          <Button className="sci-num-button" onClick={() => handlePressNeg()}>+/-</Button>
          <Button className="sci-num-button" onClick={() => pressNum('0')}>0</Button>
          <Button className="sci-num-button" onClick={() => pressNum('.')}>.</Button>
          <Button className="sci-num-button" onClick={() => pressEqual()}>=</Button>
        </div>
          <Dialog
            defaultShow={state.showTirDialog}
            style={{ zIndex: 400, display: 'flex', alignItems: 'center'}}
            contentStyle={{width: '60%', minWidth: '400px', maxWidth: '800px', height: '60%'}}
            onCloseDialog={() => setState(s => ({ ...s, showTirDialog: false }))}
          >
              <Button className="sci-tir-dialog-button" onClick={() => oneNumOpre('sin')}>sin</Button>
              <Button className="sci-tir-dialog-button" onClick={() => oneNumOpre('arcsin')}>sin-1</Button>
              <Button className="sci-tir-dialog-button" onClick={() => oneNumOpre('sinh')}>sinh</Button>
              <Button className="sci-tir-dialog-button" onClick={() => oneNumOpre('arcsinh')}>sinh-1</Button>
              <Button className="sci-tir-dialog-button" onClick={() => oneNumOpre('cos')}>cos</Button>
              <Button className="sci-tir-dialog-button" onClick={() => oneNumOpre('cosh')}>cosh</Button>
              <Button className="sci-tir-dialog-button" onClick={() => oneNumOpre('arccos')}>cos-1</Button>
              <Button className="sci-tir-dialog-button" onClick={() => oneNumOpre('arccosh')}>cosh-1</Button>
              <Button className="sci-tir-dialog-button" onClick={() => oneNumOpre('tan')}>tan</Button>
              <Button className="sci-tir-dialog-button" onClick={() => oneNumOpre('tanh')}>tanh</Button>
              <Button className="sci-tir-dialog-button" onClick={() => oneNumOpre('arctan')}>tan-1</Button>
              <Button className="sci-tir-dialog-button" onClick={() => oneNumOpre('arctanh')}>tanh-1</Button>
              <Button className="sci-tir-dialog-button" onClick={() => oneNumOpre('sec')}>sec</Button>
              <Button className="sci-tir-dialog-button" onClick={() => oneNumOpre('sech')}>sech</Button>
              <Button className="sci-tir-dialog-button" >sec-1</Button>
              <Button className="sci-tir-dialog-button" >sech-1</Button>
              <Button className="sci-tir-dialog-button" onClick={() => oneNumOpre('csc')}>csc</Button>
              <Button className="sci-tir-dialog-button" onClick={() => oneNumOpre('csch')}>csch</Button>
              <Button className="sci-tir-dialog-button" >csc-1</Button>
              <Button className="sci-tir-dialog-button" >csch-1</Button>
              <Button className="sci-tir-dialog-button" onClick={() => oneNumOpre('cot')}>cot</Button>
              <Button className="sci-tir-dialog-button" onClick={() => oneNumOpre('coth')}>coth</Button>
              <Button className="sci-tir-dialog-button" >cot-1</Button>
              <Button className="sci-tir-dialog-button" >coth-1</Button>
          </Dialog>
          <Dialog
            defaultShow={state.showFuncDialog}
            style={{ zIndex: 400, display: 'flex', alignItems: 'center'}}
            contentStyle={{width: '60%', minWidth: '400px', maxWidth: '800px', maxHeight: '400px', height: '60%'}}
            onCloseDialog={() => setState(s => ({ ...s, showFuncDialog: false }))}
          >
              <Button className="sci-func-dialog-button" onClick={() => oneNumOpre('abs')}>|x|</Button>
              <Button className="sci-func-dialog-button" onClick={() => oneNumOpre('floor')}>⌊x⌋</Button>
              <Button className="sci-func-dialog-button" onClick={() => oneNumOpre('ceil')}>⌈x⌉</Button>
              <Button className="sci-func-dialog-button" onClick={() => pressSpecNum('rand')}>rand</Button>
              <Button className="sci-func-dialog-button" onClick={() => oneNumOpre('dms')}>→ dms</Button>
              <Button className="sci-func-dialog-button" onClick={() => oneNumOpre('degress')}>→ deg</Button>
          </Dialog>
      </div>
    </>
  );
}

export default Scientific;
