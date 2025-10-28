
import React, { Component, useEffect } from 'react';
import { connect } from 'react-redux';
import './App.css';
import Layout from './components/Shared/Layout';
import Login from './components/Authentication/login';
import SignUp from './components/Authentication/signup';
import ForgotPassword from './components/Authentication/forgotpassword';
import NotFound from './components/Authentication/404';
import InternalServer from './components/Authentication/500';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

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

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      closeRightbarClass: "close_rightbar"
    };
  }

  componentDidMount() {
    // Your existing logic
    const ww = document.body.clientWidth;
    if (ww < 1530) {
      this.setState({ closeRightbarClass: "close_rightbar" });
    } else {
      this.setState({ closeRightbarClass: "" });
    }
    document.addEventListener("mousedown", this.hideLeftSidebarProxy, false);

    // Add ResizeObserver error listener here
    window.addEventListener("error", this.handleResizeObserverError);
  }

  componentWillUnmount() {
    document.removeEventListener("mousedown", this.hideLeftSidebarProxy, false);

    // Remove ResizeObserver error listener here
    window.removeEventListener("error", this.handleResizeObserverError);
  }

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

  render() {
    const { closeRightbarClass } = this.state;
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
      iconColor
    } = this.props;

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
            <Route path="/signup" element={<SignUp />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forgotpassword" element={<ForgotPassword />} />
            <Route path="/notfound" element={<NotFound />} />
            <Route path="/internalserver" element={<InternalServer />} />
            <Route path="*" element={<Layout />} /> {/* fallback route */}
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
  fontType: state.settings.isFont
});

const mapDispatchToProps = (dispatch) => ({
  toggle3DotMenuAction: (e) => dispatch(toggle3DotMenuAction(e)),
  authMenuAction: (e) => dispatch(authMenuAction(e)),
  notificationMenuAction: (e) => dispatch(notificationMenuAction(e)),
  languageMenuAction: (e) => dispatch(languageMenuAction(e)),
  mailMenuAction: (e) => dispatch(mailMenuAction(e)),
  profileMenuAction: (e) => dispatch(profileMenuAction(e)),
  dropDownMenuAction: (e) => dispatch(dropDownMenuAction(e)),
  pagesMenuAction: (e) => dispatch(pagesMenuAction(e))
});

export default connect(mapStateToProps, mapDispatchToProps)(App);