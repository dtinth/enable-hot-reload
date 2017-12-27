# enable-hot-reload

**Reliable opt-in hot module replacement for React components. Compatible with `create-react-app`.**

This library is a simple wrapper around webpack’s HMR API to make it easier to create
hot-reloadable React components.


## Installation

```
yarn add enable-hot-reload
```


## Usage

First, put this into the module you want to opt in to hot module replacement:

```js
import enableHotReload from 'enable-hot-reload'
const hot = enableHotReload(module)
```

Use `hot(React, Component[, name])` to generate a hot-reloadable wrapper.

  - If your module exports a single component:

    ```js
    class App extends React.Component { /* ... */ }
    export default hot(React, App)
    ```

  - If your module exports multiple components:

    ```js
    function _Button () { /* ... */ }
    export const Button = hot(React, _Button, 'Button')

    function _Icon () { /* ... */ }
    export const Icon = hot(React, _Icon, 'Icon')

    class _Layout extends React.Component { /* ... */ }
    export const Layout = hot(React, _Layout, 'Layout')
    ```

`hot(React, Component[, name])` returns a **wrapper component.**
To access the wrapped component class, use `App.WrappedComponent`.

**refs are intentionally not supported** so that you don’t go overboard with
this library and make everything hot-reloadable.

Instead, you should enable hot reloading *strategically*,
where you would greatly benefit from having the component hot-reloadable.


## API

### hot = enableHotReload(module)

**Sets the module up for hot-reloading** and returns the `hot()` API.


### hot(React, Component[, name = 'default']) &rarr; ComponentWrapper

**Generates a hot-reloadable wrapper for a React component.**

- `React` The React library.
- `Component` The component to wrap.
- `name` The unique name of the component. This allows `enable-hot-reload` to keep track of which components to update

Returns a `ComponentWrapper`, a React component that wraps your component with the ability to hot-reload.

When the module is updated and this function is called with a the new component,
the wrapper will replace all instances of the old component with the new one.

Notes:

  - **Component state is not preserved.**
    The old component will be unmounted, and the new component will be mounted in its place.

      - Workaround:
        If you wish to do state-preserving hot-reloads,
        extract the rendering logic into a stateless presentational component,
        and make that component hot-reloadable instead.

  - **refs are not supported.**
    You shouldn’t have to hot-reload a component that you need to `ref` it.

      - Workaround:
        If you insist of having a ref-able hot-reloadable component,
        create a hot-reloadable wrapper that passes `innerRef` props instead:

        ```js
        class TheComponentYouNeedToRef extends React.Component { /* ... */ }

        export default hot(React, ({ innerRef, ...props }) => {
          return <TheComponentYouNeedToRef {...props} ref={innerRef} />
        })
        ```

  - **Optimization: Stateless components will be updated in-place** without remounting. Exception: if the stateless component makes use of React context, it will be remounted.


### ComponentWrapper.WrappedComponent

**Use this to access the wrapped component class.**
