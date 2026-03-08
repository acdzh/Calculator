import React from 'react';
import { render, waitForElement } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';
import * as PropTypes from 'prop-types';

// Mock react-uwp components
jest.mock("react-uwp/NavigationView", () => ({ children }) => <div>{children}</div>);
jest.mock("react-uwp/SplitViewCommand", () => () => <div />);
jest.mock("react-uwp/AppBarButton", () => () => <div />);
jest.mock("react-uwp/Button", () => ({ children, onClick, ...props }) => <button onClick={onClick} {...props}>{children}</button>);
jest.mock("react-uwp/Dialog", () => ({ children }) => <div>{children}</div>);
jest.mock("react-uwp/Icon", () => () => <div />);

// Create a MockTheme provider for legacy context
class MockTheme extends React.Component {
  getChildContext() {
    return {
      theme: {
        acrylicTexture40: { style: {} },
        typographyStyles: { header: {} },
      }
    };
  }
  render() {
    return <div>{this.props.children}</div>;
  }
}
MockTheme.childContextTypes = {
  theme: PropTypes.object
};

test('renders app and navigates', async () => {
  const { getByText } = render(
    <MockTheme>
      <MemoryRouter>
        <App />
      </MemoryRouter>
    </MockTheme>
  );
  
  // Wait for Standard component to load (it might be immediate or async)
  await waitForElement(() => getByText("Standard"));
});
