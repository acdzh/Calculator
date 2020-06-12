/* eslint-disable no-extend-native */
import React from 'react';
import * as PropTypes from "prop-types";

import DropDownMenu from "react-uwp/DropDownMenu";
import CalendarDatePicker from "react-uwp/CalendarDatePicker";

import Head from './Head'

class DateCom extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      value: 'Difference between dates',
    };
  }
  render() {
    return(
      <>
        <Head title="Date Calculation"/>
        <div style={{height: 'calc(100% - 48px)', width: '100%', padding: '0 16px', lineHeight: '30px'}}>
        <DropDownMenu
          style={{border: 'none', background: 'rgba(0,0,0,0)', padding: 0, fontWeight: '600'}}
          values={["Difference between dates", "Add or subtract days"]}
          defaultValue="Difference between dates"
          onChangeValue={v => {this.setState(s => ({value: v}));}}
        />
          <br />
          {this.state.value === 'Difference between dates' ? <DateBetween /> : <DateCalc />}
        </div>
      </>
    );
  }
}

class DateBetween extends React.Component {
  static contextTypes = { theme: PropTypes.object };
  
  constructor(props) {
    super(props);
    this.state = {
      day1: parseInt(new Date().getTime() / 1000 / 3600 / 24),
      day2: parseInt(new Date().getTime() / 1000 / 3600 / 24),
    };
    this.initDate();
    let today = new Date();
    this.p = today.Format('MM/dd/yyyy');
  }

  initDate = () => {
    Date.prototype.Format = function (fmt) {
      var o = {
        "y+": this.getFullYear(),
        "M+": this.getMonth() + 1,                 //月份
        "d+": this.getDate(),                    //日
        "h+": this.getHours(),                   //小时
        "m+": this.getMinutes(),                 //分
        "s+": this.getSeconds(),                 //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S+": this.getMilliseconds()             //毫秒
      };
      for (var k in o) {
        if (new RegExp("(" + k + ")").test(fmt)){
          if(k === "y+"){
            fmt = fmt.replace(RegExp.$1, ("" + o[k]).substr(4 - RegExp.$1.length));
          }
          else if(k === "S+"){
            var lens = RegExp.$1.length;
            lens = lens === 1 ? 3 : lens;
            fmt = fmt.replace(RegExp.$1, ("00" + o[k]).substr(("" + o[k]).length - 1,lens));
          }
          else{
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
          }
        }
      }
      return fmt;
    }
  };

  calcResult = () => {
    if (this.state.day2 === this.state.day1) {
      return <p style={{fontSize: '24px', fontWeight: '600'}}>Same Dates</p>;
    } else {
      let alldays =  Math.abs(this.state.day2 - this.state.day1);
      let weeks = parseInt(alldays / 7);
      let remaindays = alldays - 7 * weeks;
    return <><p style={{fontSize: '28px', fontWeight: '600'}}>{weeks === 0 ? '' : `${weeks} weeks`}{(weeks !== 0 && remaindays !== 0) ? ', ' : ''}{remaindays === 0 ? '' : `${remaindays} days`}</p><p style={{color: 'gray'}}>{weeks === 0 ? '' : `${alldays} days` }</p></>
    }
  };


  render() {
    return (
      <>
          <p>From</p>
          <CalendarDatePicker placeholder={this.p} onChangeDate={d => {this.setState(s => ({day1: parseInt(d.getTime() / 1000 / 3600 / 24)}));}}/>
          <br /><br />
          <p>To</p>
          <CalendarDatePicker placeholder={this.p} onChangeDate={d => {console.log(d); this.setState(s => ({day2: parseInt(d.getTime() / 1000 / 3600 / 24)}));}}/>
          <br /><br />
          <p>Difference</p>
          <div>{this.calcResult()}</div>
      </>
    );
  }
}

class DateCalc extends React.Component {
  static contextTypes = { theme: PropTypes.object };
  
  constructor(props) {
    super(props);
    this.state = {
      daybegin: new Date(),
      oper: 'Add',
      years: 0,
      months: 0,
      days: 0,
    };
    this.initDate();
    let today = new Date();
    this.p = today.Format('MM/dd/yyyy');
  }

  initDate = () => {
    Date.prototype.Format = function (fmt) {
      var o = {
        "y+": this.getFullYear(),
        "M+": this.getMonth() + 1,                 //月份
        "d+": this.getDate(),                    //日
        "h+": this.getHours(),                   //小时
        "m+": this.getMinutes(),                 //分
        "s+": this.getSeconds(),                 //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S+": this.getMilliseconds()             //毫秒
      };
      for (var k in o) {
        if (new RegExp("(" + k + ")").test(fmt)){
          if(k === "y+"){
            fmt = fmt.replace(RegExp.$1, ("" + o[k]).substr(4 - RegExp.$1.length));
          }
          else if(k === "S+"){
            var lens = RegExp.$1.length;
            lens = lens === 1 ? 3 : lens;
            fmt = fmt.replace(RegExp.$1, ("00" + o[k]).substr(("" + o[k]).length - 1,lens));
          }
          else{
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
          }
        }
      }
      return fmt;
    }
  };

  dateAdd = (interval, number, date) => {
    switch (interval) {
    case "y ": {
        date.setFullYear(date.getFullYear() + number);
        return date;
    }
    case "q ": {
        date.setMonth(date.getMonth() + number * 3);
        return date;
    }
    case "M ": {
        date.setMonth(date.getMonth() + number);
        return date;
    }
    case "w ": {
        date.setDate(date.getDate() + number * 7);
        return date;
    }
    case "d ": {
        date.setDate(date.getDate() + number);
        return date;
    }
    case "h ": {
        date.setHours(date.getHours() + number);
        return date;
    }
    case "m ": {
        date.setMinutes(date.getMinutes() + number);
        return date;
    }
    case "s ": {
        date.setSeconds(date.getSeconds() + number);
        return date;
    }
    default: {
        date.setDate(date.getDate() + number);
        return date;
    }
    }
  }

  calcResult =() => {
    console.log(this.state);
    let d = new Date(this.state.daybegin);
    let t = this.state.oper === 'Add' ? 1 : -1;
    d.setDate(d.getDate() + t * this.state.days);
    d.setMonth(d.getMonth() + t * this.state.months);
    d.setFullYear(d.getFullYear() + t * this.state.years);
    return d.toDateString();

  };

  render() {
    return (
      <>
          <p>From</p>
          <CalendarDatePicker placeholder={this.p} onChangeDate={d => {this.setState(s => ({daybegin:  d}));}}/>
          <br /><br />
          <div >
            <p>Operation</p>
            <DropDownMenu
                style={{width: '296px', maxHeight: '300px', background: 'rgba(0,0,0,0)'}}
                values={['Add', 'Subtract']}
                defaultValue="Add"
                onChangeValue={v => {this.setState(s => ({oper: v}));}}
              />
          </div>
          <div style={{marginTop: '16px', display: 'flex'}}>
            <div>
              <p style={{color: 'gray', fontSize: '14px'}}>Years</p>
              <DropDownMenu
                style={{width: '80px', maxHeight: '300px', background: 'rgba(0,0,0,0)'}}
                values={[...new Array(100)].map((d, i) => i.toString())}
                defaultValue="0"
                onChangeValue={v => {this.setState(s => ({years: parseInt(v)}));}}
              />
            </div>
            <div style={{marginLeft: '10px', }}>
              <p style={{color: 'gray', fontSize: '14px'}}>Months</p>
              <DropDownMenu
                style={{width: '80px', maxHeight: '300px', background: 'rgba(0,0,0,0)'}}
                wrapperStyle={{ }}
                values={[...new Array(100)].map((d, i) => i.toString())}
                defaultValue="0"
                onChangeValue={v => {this.setState(s => ({months: parseInt(v)}));}}
              />
            </div>
            <div style={{marginLeft: '10px'}}>
              <p style={{color: 'gray', fontSize: '14px'}}>Days</p>
              <DropDownMenu
                style={{width: '80px', maxHeight: '300px', background: 'rgba(0,0,0,0)'}}
                values={[...new Array(100)].map((d, i) => i.toString())}
                defaultValue="0"
                onChangeValue={v => {this.setState(s => ({days: parseInt(v)}));}}
              />
            </div>
          </div>
          <br />
          <p style={{color: 'gray', fontSize: '14px'}}>Date</p>
          <p style={{fontSize: '22px', fontWeight: '600'}}>{this.calcResult()}</p>
      </>
    );
  }
}

export default DateCom;