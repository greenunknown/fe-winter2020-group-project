import React, { Component }  from 'react';

// Stateless Higher Order Component for displaying the No user found message at the top of the screen
//
//https://codeburst.io/displaying-error-messages-in-react-with-a-higher-order-component-hoc-fe2de074bf64
const WithErrorHandling = WrappedComponent => ({ showError, children }) => {
    return (
      <WrappedComponent>
        {showError && <div className="errorMessage">No user found!</div>}
        {children}
      </WrappedComponent>
    );
  };

export const DivWithErrorHandling = WithErrorHandling(({children}) => <div>{children}</div>)

