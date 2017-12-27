import './App.css'

import { AppHeader, Footer } from './components'
import React, { Component } from 'react'

import PropTypes from 'prop-types'
import enableHotReload from './enable-hot-reload'

const hot = enableHotReload(module)

class App extends Component {
  static childContextTypes = {
    packageName: PropTypes.string
  }
  getChildContext () {
    return {
      packageName: 'enable-hot-reload'
    }
  }
  render () {
    return (
      <div className='App'>
        <AppHeader />
        <p className='App-intro'>
          To get started, edit <code>src/App.js</code> and save to reload!
        </p>
        <Footer />
      </div>
    )
  }
}

export default hot(React, App)
