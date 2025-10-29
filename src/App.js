import React, { Component } from 'react';
import { connect } from 'react-redux';
import './App.css';
import Layout from './components/Shared/Layout';
import Login from './components/Authentication/login';
import SignUp from './components/Authentication/signup';
import ForgotPassword from './components/Authentication/forgotpassword';
import NotFound from './components/Authentication/404';
import InternalServer from './components/Authentication/500';

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import {
  notificationMenuAction,
  languageMenuAction,
  authMenuAction,
  toggle3DotMenuAction,
  pagesMenuAction,
  mailMenuAction,
  profileMenuAction,
  dropDownMenuAction
} from './actions/settingsAction';
import { getCurrentUser } from './slices/authSlice';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      closeRightbarClass: "close_rightbar",
      loading: true
    };
  }

  async componentDidMount() {
    const ww = document.body.clientWidth;
    if (ww < 1530) {
      this.setState({ closeRightbarClass: "close_rightbar" });
    } else {
      this.setState({ closeRightbarClass: "" });
    }
    
    document.addEventListener("mousedown", this.hideLeftSidebarProxy, false);
    window.addEventListener("error", this.handleResizeObserverError);

    // Check authentication on app load
    await this.checkAuthentication();
  }

  componentDidUpdate(prevProps) {
    // Agar authentication state change hua hai to loading stop karo
    if (prevProps.isAuthenticated !== this.props.isAuthenticated) {
      this.setState({ loading: false });
    }
  }

  componentWillUnmount() {
    document.removeEventListener("mousedown", this.hideLeftSidebarProxy, false);
    window.removeEventListener("error", this.handleResizeObserverError);
  }

  checkAuthentication = async () => {
    const token = localStorage.getItem('token'); 
    console.log("Token found:", !!token);
    
    if (token) {
      try {
        const { dispatch } = this.props;
        await dispatch(getCurrentUser()).unwrap();
      } catch (error) {
        console.error("Authentication failed:", error);
        // Token invalid hai, remove kar do
        localStorage.removeItem('token');
      }
    }
    this.setState({ loading: false });
  };

  handleResizeObserverError = (event) => {
    if (
      event.message &&
      event.message.includes("ResizeObserver loop completed with undelivered notifications")
    ) {
      event.stopImmediatePropagation();
    }
  };

  hideLeftSidebarProxy = (e) => {
    const {
      authMenuAction,
      pagesMenuAction,
      languageMenuAction,
      mailMenuAction,
      notificationMenuAction,
      dropDownMenuAction,
      toggle3DotMenuAction
    } = this.props;

    if (this.leftSidebar && this.leftSidebar.contains(e.target)) {
      authMenuAction(false);
      pagesMenuAction(false);
      languageMenuAction(false);
      mailMenuAction(false);
      notificationMenuAction(false);
      dropDownMenuAction(false);
      toggle3DotMenuAction(false);
    }
  };

  // Protected Route Component
  ProtectedRoute = ({ children }) => {
    const { loading } = this.state;
    const { isAuthenticated } = this.props;
    
    if (loading) {
      return <div className="loading-spinner">Loading...</div>;
    }
    return isAuthenticated ? children : <Navigate to="/login" replace />;
  };

  // Public Route Component
  PublicRoute = ({ children }) => {
    const { loading } = this.state;
    const { isAuthenticated } = this.props;
    
    if (loading) {
      return <div className="loading-spinner">Loading...</div>;
    }
    return !isAuthenticated ? children : <Navigate to="/" replace />;
  };

  render() {
    const { closeRightbarClass, loading } = this.state;
    const {
      isBoxLayout,
      gradientColor,
      darkMode,
      darkSidebar,
      rtl,
      toggleRightBar,
      toggleLeftBar,
      themeColor,
      fontType,
      iconColor,
      isAuthenticated
    } = this.props;

    console.log("Auth status:", isAuthenticated, "Loading:", loading);

    if (loading) {
      return (
        <div className="loading-container">
          <div className="loading-spinner">Loading...</div>
        </div>
      );
    }

    return (
      <div
        ref={(ref) => (this.leftSidebar = ref)}
        className={`
          ${isBoxLayout ? "boxlayout" : ""}
          ${darkSidebar ? "sidebar_dark" : ""}
          ${gradientColor ? "gradient" : ""}
          ${iconColor ? "iconcolor" : ""}
          ${darkMode ? "dark-mode" : ""}
          ${toggleLeftBar ? "offcanvas-active" : ""}
          ${toggleRightBar ? "right_tb_toggle" : ""}
          ${rtl ? "rtl" : ""}
          ${fontType}
          ${closeRightbarClass}
          theme-${themeColor}
        `}
      >
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route 
              path="/login" 
              element={
                <this.PublicRoute>
                  <Login />
                </this.PublicRoute>
              } 
            />
            <Route 
              path="/signup" 
              element={
                <this.PublicRoute>
                  <SignUp />
                </this.PublicRoute>
              } 
            />
            <Route 
              path="/forgotpassword" 
              element={
                <this.PublicRoute>
                  <ForgotPassword />
                </this.PublicRoute>
              } 
            />
            
            {/* Error Pages */}
            <Route path="/notfound" element={<NotFound />} />
            <Route path="/internalserver" element={<InternalServer />} />
            
            {/* Protected Routes */}
            <Route 
              path="*" 
              element={
                <this.ProtectedRoute>
                  <Layout />
                </this.ProtectedRoute>
              } 
            />
          </Routes>
        </Router>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  toggleRightBar: state.settings.isToggleRightBar,
  toggleLeftBar: state.settings.isToggleLeftBar,
  themeColor: state.settings.themeColor,
  darkMode: state.settings.isDarkMode,
  darkSidebar: state.settings.isDarkSidebar,
  iconColor: state.settings.isIconColor,
  gradientColor: state.settings.isGradientColor,
  isBoxLayout: state.settings.isBoxLayout,
  rtl: state.settings.isRtl,
  fontType: state.settings.isFont,
  isAuthenticated: state.auth.isAuthenticated, // Redux state se le rahe hain
  user: state.auth.user
});

const mapDispatchToProps = (dispatch) => ({
  toggle3DotMenuAction: (e) => dispatch(toggle3DotMenuAction(e)),
  authMenuAction: (e) => dispatch(authMenuAction(e)),
  notificationMenuAction: (e) => dispatch(notificationMenuAction(e)),
  languageMenuAction: (e) => dispatch(languageMenuAction(e)),
  mailMenuAction: (e) => dispatch(mailMenuAction(e)),
  profileMenuAction: (e) => dispatch(profileMenuAction(e)),
  dropDownMenuAction: (e) => dispatch(dropDownMenuAction(e)),
  pagesMenuAction: (e) => dispatch(pagesMenuAction(e)),
  dispatch
});

export default connect(mapStateToProps, mapDispatchToProps)(App);