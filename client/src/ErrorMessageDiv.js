import React, { Component }  from 'react';


const WithErrorHandling = WrappedComponent => ({ showError, children }) => {
    return (
      <WrappedComponent>
        {showError && <div className="errorMessage">No user found!</div>}
        {children}
      </WrappedComponent>
    );
};

export const DivWithErrorHandling = WithErrorHandling(({children}) => <div>{children}</div>)

