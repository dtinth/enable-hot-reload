/* eslint no-proto: off */

// I am writing this in plain ES5 because I don’t want to fiddle with build tools. :)
var ReactIs = require('react-is')
var modulePotRegistry = { }

module.exports = function enableHotReload (module) {
  var pot = modulePotRegistry[module.id] || (
    modulePotRegistry[module.id] = createPot()
  )
  return pot.getInstance(module)
}

function createPot () {
  var componentWrappers = { }
  var replaceKey = '⤵️'

  // Stolen from Babel
  function inherits (subClass, superClass) {
    subClass.prototype = Object.create(superClass.prototype, {
      constructor: {
        value: subClass,
        enumerable: false,
        writable: true,
        configurable: true
      }
    })
    Object.setPrototypeOf
      ? Object.setPrototypeOf(subClass, superClass)
      : subClass.__proto__ = superClass
  }

  function createComponentWrapper (React, Component) {
    assertComponent(Component)
    var instances = new Set()
    var render
    function ComponentWrapper (props) {
      return React.Component.call(this, props)
    }
    inherits(ComponentWrapper, React.Component)
    ComponentWrapper.prototype.render = function () {
      return render(this.props)
    }
    ComponentWrapper.prototype.componentDidMount = function () {
      instances.add(this)
    }
    ComponentWrapper.prototype.componentWillUnmount = function () {
      instances.delete(this)
    }
    ComponentWrapper[replaceKey] = function (NewComponent) {
      if (NewComponent === Component) return
      assertComponent(NewComponent)
      Component = NewComponent
      setup()
      instances.forEach(function (instance) {
        instance.forceUpdate()
      })
    }
    function setup () {
      var displayName = Component.displayName || Component.name
      ComponentWrapper.WrappedComponent = Component
      ComponentWrapper.displayName = '☕️(' + displayName + ')'
      if (typeof Component.prototype.render === 'function' || Component.contextTypes) {
        render = function (props) {
          return React.createElement(Component, props)
        }
      } else {
        render = function (props) {
          return Component(props)
        }
      }
    }
    setup()
    return ComponentWrapper
  }

  function getInstance (module) {
    if (module.hot) {
      module.hot.accept()
    }
    var registered = { }
    function hot (React, Component, name) {
      if (typeof React.createElement !== 'function') {
        throw new Error('hot(React, Component[, name]): Expected the first argument to be the React library.')
      }
      name = name || 'default'
      if (typeof name !== 'string') {
        throw new Error('hot(React, Component, name): Expected name to be a string.')
      }
      if (registered[name]) {
        var componentName = String(Component.displayName || Component.name || 'name')
        if (name === 'default') {
          throw new Error(
            'hot(React, Component) can only be used once per hot-reloadable module. ' +
            'If you wish to export multiple hot-reloadable components from a single module, ' +
            'you must supply the component’s name as the third argument. e.g. ' +
            'hot(React, Component, \'' + componentName + '\')'
          )
        }
        throw new Error(
          'hot(React, Component, name): Duplicate name "' + name + '" detected. ' +
          'Please make sure each call to `hot(React, Component, name)` has a unique name.' +
          (
            componentName !== 'name' && componentName.length > 2
              ? ' Did you mean "' + componentName + '"?'
              : ''
          )
        )
      }
      registered[name] = true
      if (!componentWrappers[name]) {
        componentWrappers[name] = createComponentWrapper(React, Component)
      } else {
        componentWrappers[name][replaceKey](Component)
      }
      return componentWrappers[name]
    }
    return hot
  }

  return {
    getInstance: getInstance
  }
}

function assertComponent (component, where) {
  if (!ReactIs.isValidElementType(component)) {
    throw new Error('Expected a React component to be passed to hot(React, Component).')
  }
}
