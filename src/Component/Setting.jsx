import React from 'react';
import * as PropTypes from "prop-types";

import Head from './Head'

import getTheme from "react-uwp/styles/getTheme";
import Icon from "react-uwp/Icon";
import DropDownMenu from "react-uwp/DropDownMenu";
import ColorPicker from "react-uwp/ColorPicker";
import CheckBox from "react-uwp/CheckBox";
import TextBox from "react-uwp/TextBox";
import Button from "react-uwp/Button";


export class Setting extends React.Component {
  render() {
    return (
      <>
        <Head title="Setting"/>
        <div style={{height: 'calc(100% - 48px)', width: '100%', padding: '0 16px', lineHeight: '30px'}}>
          <ColorSet />
        </div>
      </>
    )
  }
}

export default Setting;

class ColorSet extends React.Component {
  static contextTypes = { theme: PropTypes.object };

  render() {
    const { theme } = this.context;
    const styles = getStyles(this);

    return (
      <div style={styles.root}>
        <div style={styles.content}>
          <div style={{ marginTop: 0 }}>
            <p style={{ fontSize: 18, lineHeight: 1.6 }}>
              Choose Theme
            </p>
            <DropDownMenu
              values={[
                "Dark",
                "Light"
              ]}
              style={{ background: theme.useFluentDesign ? theme.acrylicTexture80.background : theme.chromeLow }}
              defaultValue={theme.isDarkTheme ? "Dark" : "Light"}
              onChangeValue={value => {
                localStorage.setItem('theme-name', value.toLowerCase());
                window.location.reload();
                // theme.updateTheme(getTheme({
                //   themeName: value.toLowerCase(),
                //   accent: theme.accent,
                //   useFluentDesign: theme.useFluentDesign,
                //   desktopBackgroundImage: theme.desktopBackgroundImage
                // }));
              }}
            />
            <CheckBox
              style={{ marginLeft: 8 }}
              defaultChecked={theme.useFluentDesign}
              label="Use Fluent Design"
              onCheck={useFluentDesign => {
                console.log(useFluentDesign);
                localStorage.setItem('use-fluent', useFluentDesign ? 'true' : 'false');
                window.location.reload();
                // theme.updateTheme(getTheme({
                //   themeName: theme.themeName,
                //   accent: theme.accent,
                //   useFluentDesign,
                //   desktopBackgroundImage: theme.desktopBackgroundImage
                // }));
              }}
            />
            <TextBox
              background="none"
              defaultValue="Paste Image URL or Upload..."
              style={{ marginTop: 4 }}
              onChangeValue={desktopBackgroundImage => {
                const image = new Image();
                image.addEventListener("load", function(e) {
                  localStorage.setItem('theme-bg', desktopBackgroundImage);
                  window.location.reload();
                  // theme.updateTheme(getTheme({
                  //   themeName: theme.themeName,
                  //   accent: theme.accent,
                  //   useFluentDesign: theme.useFluentDesign,
                  //   desktopBackgroundImage
                  // }));
                });
                image.src = desktopBackgroundImage;
              }}
              rightNode={
                <Icon
                  style={{
                    fontSize: 12,
                    height: 32,
                    width: 32,
                    lineHeight: "32px",
                    cursor: "pointer"
                  }}
                  hoverStyle={{
                    background: theme.listLow
                  }}
                  onClick={() => {
                    this.fileInput.click();
                  }}
                >
                  UpLegacy
                </Icon>
              }
            />
            <input
              ref={fileInput => this.fileInput = fileInput}
              type="file"
              style={{ display: "none" }}
              onChange={e => {
                const file = e.currentTarget.files[0];
                const reader  = new FileReader();
                  reader.addEventListener("load", () => {
                    localStorage.setItem('theme-bg',reader.result.toString());
                    window.location.reload();
                    // theme.updateTheme(getTheme({
                    //   themeName: theme.themeName,
                    //   accent: theme.accent,
                    //   useFluentDesign: theme.useFluentDesign,
                    //   desktopBackgroundImage: reader.result.toString()
                    // }));
                  }, false);
                if (file) {
                  reader.readAsDataURL(file);
                }
              }}
            />
          <Button onClick={() => {localStorage.removeItem('theme-bg'); window.location.reload();}}>Default Background</Button>
          </div>
        </div>
        <ColorPicker
          style={{ margin: "10px 0" }}
          defaultColor={theme.accent}
          onChangedColor={accent => {
            localStorage.setItem('theme-accent', accent);
            theme.updateTheme(getTheme({
              themeName: theme.themeName,
              accent,
              useFluentDesign: theme.useFluentDesign,
              desktopBackgroundImage: theme.desktopBackgroundImage
            }));
          }}
        />
      </div>
    );
  }
}

function getStyles(customTheme) {
  const {
    context: { theme }
  } = customTheme;
  const { prefixStyle } = theme;

  return {
    content: prefixStyle({
      padding: 20,
      margin: "0 auto",
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      flexWrap: "wrap"
    })
  };
}
