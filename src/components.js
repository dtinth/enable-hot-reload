import PropTypes from 'prop-types'
import React from 'react'
import enableHotReload from './enable-hot-reload'
import logo from './logo.svg'

const hot = enableHotReload(module)

export const AppHeader = hot(React, function AppHeader () {
  return (
    <header className='App-header'>
      <img src={logo} className='App-logo' alt='logo' />
      <h1 className='App-title'>Welcome to React~!!</h1>
    </header>
  )
}, 'AppHeader')

function _Footer (props, context) {
  return (
    <footer style={{ opacity: 0.5 }}>
      {context.packageName}
    </footer>
  )
}
_Footer.contextTypes = {
  packageName: PropTypes.string
}

export const Footer = hot(React, _Footer, 'Footer')
