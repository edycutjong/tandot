const React = require('react');

module.exports = {
  ConnectButton: () => React.createElement('button', null, 'Connect Wallet'),
  getDefaultConfig: jest.fn(),
  RainbowKitProvider: ({ children }) => React.createElement(React.Fragment, null, children),
  darkTheme: jest.fn(),
};
