# cssobj-plugin-post-stylize

Apply css text into browser's style tag, can work with plugin-gencss.

## Usage

``` javascript
var cssobj_core = require('cssobj-core')
var pluginGenCSS = require('cssobj-plugin-post-gencss')
var pluginStylize = require('cssobj-plugin-post-stylize')
var cssobj = cssobj_core({plugins: {post: [pluginGenCSS(), pluginStylize(option)] }})
cssobj(obj)

// plugin-gencss generated css text will be applied into <head>
```

## Install

``` javascript
npm install cssobj/cssobj-plugin-post-stylize
```

## API

### `var plugin = pluginStylize(option)`

Get plugin function to apply, pass option.

The function read `result.css` as css text to insert into `<style>`.

### *PARAMS*

### `option`

 - `name` : {string} The id for `<style>` tag, if omit, will using random string.

 - `attrs` : {object} The key/val to apply to `<style>` tag as attributes.

### *RETURN*

A function can be as cssobj post plugin.


## Example

``` javascript
pluginStylize({name:'index-page-style'})

pluginStylize({name:'index-page-style', attrs:{type:'text/css', media:'screen'} })
```

## Difference between plugin-cssom

This plugin take simplicy first, just update all css text into `<style>` tag, may have performance issues.

[plugin-cssom](https://github.com/cssobj/cssobj-plugin-post-cssom) take effiency first, it create every css rule and patch rules with `result.diff`

If you want apply cssobj once, and don't update result frequently, use `plugin-gencss` + `plugin-stylize`

If you want update result frequently, use `plugin-cssom`, it optimized for this type of usage.



