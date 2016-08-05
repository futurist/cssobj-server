var cssobj_plugin_post_stylize = (function () {
  'use strict';

  /**
   * @fileOverview cssobj plugin for apply style into browser head
   * @name cssobj-plugin-post-stylize.js • src
   * @author James Yang [jamesyang999@gmail.com]
   * @license MIT
   * @usage
   cssobj(obj, {
   post:[cssobj_plugin_post_stylize({name:'gaga', attrs: {media: 'screen'}})]
   })
  */

  function escapeHTML (str) {
    return str.replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;')
  }

  function stylize (element, sheet) {
    if (element['data-cachedCSS'] === sheet) return
    element['data-cachedCSS'] = sheet
    if (element.styleSheet) {
      element.styleSheet.cssText = sheet
    } else {
      // empty all style when re-apply new style
      while(element.firstChild) element.removeChild(element.firstChild)
      element.appendChild(document.createTextNode(sheet))
    }
    return element
  }

  function createDOM (id, option) {
    var el = document.createElement('style')
    document.getElementsByTagName('head')[0].appendChild(el)
    el.setAttribute('id', id)
    if (option && typeof option == 'object' && option.attrs)
      for (var i in option.attrs) {
        el.setAttribute(i, option.attrs[i])
      }
    return el
  }

  function addStyleToHead (option) {
    option = option || {}
    if (!option.name) option.name = +new Date() + ''
    var id = 'style_cssobj_' + escapeHTML(option.name)
    var updateID = id + '_update'
    var updateDom
    var styleDom = document.getElementById(id) || createDOM(id, option)
    return function (result) {
      result.on('update', function (css) {
        updateDom = document.getElementById(updateID) || createDOM(updateID, option)
        stylize(updateDom, css)
      })
      if(updateDom) stylize(updateDom, '')
      return stylize(styleDom, result.css)
    }
  }

  return addStyleToHead;

}());
var extend_exclude=function(){function n(n){return a("Object",n)||a("Array",n)||a("Map",n)}function r(n){return!/obj|func/.test(typeof n)||!n}function t(e,u,i,c){if(c=c||[],r(u))return e;for(var o in u)_(u,o)&&(i(e,u,o,c,o in e),n(u[o])&&n(e[o])&&t(e[o],u[o],i,c.concat(o)));return e}function e(r,t,e){for(var u=r,i=0,c=t.length;i<c;i++){if(!(n(u)&&t[i]in u))return e?new Error("NotFound"):void 0;u=u[t[i]]}return u}function u(){for(var n,e=arguments,u=e.length;u--;)n=t(e[u],n,function(n,t,e,u,i){i&&!r(t[e])||(n[e]=t[e])});return n}function i(n,e,u){return t(n,e,function(n,t,e){r(t[e])&&(u?e in n?n[e]=t[e]:"":t[e]?delete n[e]:"")})}function c(n,u){var i={};return t(i,u,function(t,u,i,c){var o=e(n,c.concat(i));u[i]&&(r(o)||(t[i]=a("Array",o)?[]:{}),r(u[i])&&(t[i]=o))})}function o(n,u){u=u||{};var i={};return t(i,n,function(n,t,i,c){var o=e(u,c.concat(i));o&&r(o)||(r(t[i])?n[i]=t[i]:n[i]=a("Array",t[i])?[]:{})})}function f(n,r){return t(n,r,function(n,r,t){t in n||(n[t]=r[t])})}var a=function(n,r){return{}.toString.call(r).slice(8,-1)===n},_=function(n,r){return{}.hasOwnProperty.call(n,r)},l={_is:a,_own:_,_isIter:n,_isPrim:r,_get:e,_deepIt:t,_extend:u,_pick:c,_pick2:o,_default:f,_exclude:i};return l}();
var pagecss = {
  'html,body': {
    height: '100%',
    margin:0,
    padding:0
  },
  'table,textarea': {
    width: '100%',
    height: '100%',
    'table-layout': 'fixed'
  },
  textarea: {
    $id: 'textarea',
    display: 'block',
    margin:0,
    padding:0
  },
  'h3[title="a,b"]': {
    color: 'green'
  },
  '@media (>800px)':{
    h3:{
      color:'red'
    },
    '@media (<1000px)':{
      h3:{
        color:'blue'
      }
    }
  },
  '@media (>1000px)':{
    h3:{
      $id:'h3',
      color:'grey'
    }
  }
}
/* global define, extend_exclude */

!(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['extend_exclude'], factory) // define(['jquery'], factory)
  } else if (typeof exports === 'object') {
    module.exports = factory(require('extend_exclude')) // factory(require('jquery'))
  } else {
    root.cssobj = factory(extend_exclude) // should return obj in factory
  }
}(this, function (util) {
  'use strict'

  /** IE ES3 need below polyfills:
   * Array.prototype.forEach
   * Array.prototype.indexOf
   * Array.prototype.map
   * Array.prototype.some
   * Array.prototype.reduce
   * Object.keys
   **/

  // using var as iteral to help optimize
  var newLine = '\n'
  var ARRAY = 'Array'

  // better type check
  var is = util._is
  var own = util._own
  var isIterable = util._isIter

  var reOneRule = /@(?:charset|import|namespace)/
  var reGroupRule = /^@(?:media|document|supports) /
  var reKeyFrame = /^@keyframes /
  var reClass = /:global\s*\(\s*((?:\.[A-Za-z0-9_-]+\s*)+)\s*\)|(\.)([!A-Za-z0-9_-]+)/g

  var random = (function () {
    var count = 0
    return function () {
      count++
      return '_' + Math.floor(Math.random() * Math.pow(2, 32)).toString(36) + count + '_'
    }
  })()

  var _util = {
    is: is,
    own: own,
    random: random,
    getSelector: getSelector,
    getParent: getParent,
    findObj: findObj,
    arrayKV: arrayKV,
    strSugar: strSugar,
    strRepeat: strRepeat,
    splitComma: splitComma
  }

  /**
   * convert simple Object into tree data
   *
   format:
   {"a":{"b":{"c":{"":["leaf 1"]}}},"abc":123, e:[2,3,4], f:null}
   *        1. every key is folder node
   *        2. "":[] is leaf node
   *        3. except leaf node, array value will return as is
   *        4. {abc:123} is shortcut for {abc:{"": [123]}}
   *
   * @param {object} d - simple object data
   * @param {object} opt - options {indent:String, prefix:String||Boolean, local:Boolean}
   * @param {function} [prop] - function(key,val){} to return {object} to merge into current
   * @param {array} [path] - array path represent root to parent
   * @returns {object} tree data object
   */
  function parseObj (d, opt, parent) {
    parent = parent || {}
    if (is(ARRAY, d)) {
      return d.map(function (v,i) {
        return parseObj(v, opt, {parent:parent, src:d, index:i, value:d[i]})
      })
    }
    if (is('Object', d)) {
      parent.lastVal= parent.lastVal||{}
      parent.prop={}
      parent.children={}
      for (var k in d) {
        if (!own(d, k)) continue
        if (!isIterable(d[k]) || is(ARRAY, d[k]) && !isIterable(d[k][0])) {
          ![].concat(d[k]).forEach(function(v){
            if(k=='$id') opt._ref[v] = d
            else arrayKV(parent.prop, getProp(k, opt), v)
          })
        } else {
          parent.children[k] = parseObj(d[k], opt, {parent:parent, src:d, key:k, value:d[k]})
        }
      }
      return parent
    }
    return parent
  }

  function getParent(node, test) {
    var p = node
    while(p && !test(p)) p=p.parent
    return p
  }

  function arrayKV(obj, k, v) {
    obj[k] = obj[k] || []
    obj[k].push(v)
  }

  function strSugar(str, sugar) {
    return sugar.reduce(
      function(pre, cur) {
        return pre.replace(
          new RegExp('^(_)|(.)(_)'.replace(/_/g, cur[0]), 'g'),
          function (m, z1, p, z2) {
            var z = z1 || z2
            return p == '\\' ? z : (p || '') + cur[1](z)
          }
        )
      },
      str
    )
  }

  function getProp (str, opt) {
    return !opt.propSugar
      ? str
      : strSugar(str, [
        ['_', function (z) { return '-' }],
        ['[A-Z]', function(z){ return '-' + z.toLowerCase() }]
      ])
  }

  function splitComma (str) {
    for (var c, i = 0, n = 0, prev = 0, d = []; c = str[i]; i++) {
      if (/[\(\[]/.test(c)) n++
      if (/[\)\]]/.test(c)) n--
      if (!n && c == ',') d.push(str.substring(prev, i)), prev = i + 1
    }
    return d.concat(str.substring(prev))
  }

  function strRepeat (str, n) {
    var s = ''
    while (n-- > 0) s += str
    return s
  }

  function getSelector (node, opt) {
    var NS = opt._localNames
    var replacer = function (match, global, dot, name) {
      if (global) {
        return global
      }
      if (name[0] === '!') {
        return dot + name.substr(1)
      }

      if (!opt.local) {
        NS[name] = name
      } else if (!NS[name]) {
        NS[name] = opt.prefix + name
      }

      return dot + NS[name]
    }

    var localize = function (name) {
      return name.replace(reClass, replacer)
    }

    var item
    var prev = ''
    var p = node
    var path = [p]
    while (p=p.parent) path.unshift(p)
    for (var i = 0, len = path.length; i < len; i++) {
      item = path[i]
      // only Object type has key, only Object can be parent
      if (!item.key || reGroupRule.test(item.key)) continue
      if(reKeyFrame.test(item.parent.key)) return item.key
      if(!reKeyFrame.test(item.key) && /^@/.test(item.key)) return item.key
      if (!item.selector) {
        item.selector = splitComma(item.key).map(function (v) {
          return !prev ? v : splitComma(prev).map(function (p) {
            return v.match(/^&|[^\\]&/)
              ? v.replace(/&/, p)
              : p + ' ' + v.replace(/\\&/g, '&')
          }).join(',')
        }).join(',')
      }
      prev = item.selector
    }
    return localize(prev)
  }

  function isValidCSSValue(val) {
    return val || val===0
  }

  function makeRule(node, opt, level) {
    var indent = strRepeat(opt.indent, level)
    var props = Object.keys(node.prop)
    var selector = getSelector(node, opt)
    var lastVal = node.lastVal
    var getVal = function(indent, key, sep, end){
      var propArr = [].concat(node.prop[key])
      return propArr.map(function(t){

        var val = is('Function', t)
            ? t(lastVal[key], node, opt)
            : t
        if(!isValidCSSValue(val)) return ''

        lastVal[key] = val

        var valAfter = applyPlugins(opt, 'value', val, key, node)
        return indent + key + sep + valAfter + end
      }).join('')
    }

    var str=''
    props.forEach(function(v){
      if(reOneRule.test(v)) str += getVal(indent, v, ' ', ';'+newLine)
    })

    return !selector
      ? str
      : str + [indent, selector , ' {' + newLine ,
         props.map(function (v) {
           return getVal(indent + opt.indent, v, ': ', ';' + newLine)
         }).join('') ,
         indent , '}' + newLine
        ].join('')
  }

  function makeCSS(node, opt, recursive) {
    var str = [], groupStr=[]

    var newGroup = function(node, cur){
      var p=node, path=[]
      while(p) {
        if( reGroupRule.test(p.key) ) path.unshift(p.key)
        p = p.parent
      }
      var rule = path[0].match(reGroupRule).pop()
      var selector = rule + path.reduce(function(pre, cur){
        return splitComma(cur.replace(reGroupRule,'')).map(function(v) {
          v = strSugar(v, [
            ['[><]', function(z){
              return z=='>'
                ?'min-width:'
                :'max-width:'
            }]
          ])
          return !pre ? v : splitComma(pre.replace(reGroupRule,'')).map(function(p){
            return p + ' and ' + v
          }).join(',')
        }).join(','+newLine)
      }, '')
      cur.push(selector + ' {'+newLine)
      groupStr.push(cur)
    }

    var walk = function (node, groupLevel) {
      if(!node) return ''
      if(is(ARRAY, node)) return node.map(function(v){walk(v,groupLevel)})

      var cur = groupStr[groupLevel-1] || str
      var isGroupRule = reGroupRule.test(node.key)
      var isKeyFrameNode = reKeyFrame.test(node.key)
      var isInKeyFrame = !!getParent(node.parent, function(v){
        return reKeyFrame.test(v.key)
      })
      if(isGroupRule) {
        groupLevel++
        cur = []
        newGroup(node, cur)
      }
      var indentLevel = !!groupLevel + isInKeyFrame
      var indent = strRepeat(opt.indent, indentLevel)
      if(isKeyFrameNode) {
        cur.push(indent + node.key+' {'+newLine)
      }

      if (Object.keys(node.prop).length)
        cur.push(
          makeRule(node, opt, indentLevel)
        )

      if(recursive)
        for(var k in node.children)
          walk(node.children[k], groupLevel)

      if(isKeyFrameNode){
        cur.push(indent + '}'+newLine)
      }
      if(isGroupRule) {
        cur.push('}'+newLine)
        groupLevel--
      }

      if(!groupLevel)
        while(groupStr.length)
          str.push(groupStr.shift().join(''))

    }
    walk(node,0)

    return str.join('')
  }

  function applyPlugins(opt, type) {
    var args = [].slice.call(arguments, 2)
    var plugin = opt.plugins[type]
    return !plugin ? args[0] : [].concat(plugin).reduce(
      function (pre, f) { return f.apply(null, [pre].concat(args)) },
      args.shift()
    )
  }

  function findObj(obj, root) {
    var found
    var walk = function(node) {
      if (is(ARRAY, node)) return node.some(walk)
      if (node.value==obj) return found = node
      for(var k in node.children){
        if (found) return
        walk(node.children[k])
      }
    }
    walk(root)
    return found
  }

  function cssobj (obj, options, localNames) {
    options = options || {}

    // set default options
    util._default(options, {
      local: true,
      propSugar: true,
      indent: '\t',
      plugins: {}
    })

    options._events = {}
    options._util = _util
    options.prefix = options.prefix || random()

    var ref = options._ref = {}
    var nameMap = options._localNames = localNames || {}

    var root = parseObj(obj, options)
    options._root = root

    // var d=testObj[1]['.p']
    // console.log(1111, d, findObj(d, root))

    var updater = function(updateObj, recursive) {
      if (updateObj === true) recursive = true, updateObj = 0

      var mapRef = function(k) { return isIterable(k) ? k : ref[k] }

      var args = !updateObj
          ? Object.keys(ref).map(mapRef)
          : [].concat(updateObj).map(mapRef)

      var css = args.map(function(k) {
        var target = findObj(k, root)
        return makeCSS(parseObj(k, options, target), options, recursive)
      }).join('')

      var cb = options._events['update']
      cb && css && cb.forEach(function (v) {v(css)})
      return css
    }

    var result = {
      css: makeCSS(root, options, true),
      map: nameMap,
      ref: ref,
      update: updater,
      options: options
    }

    result.on = function(eventName, cb) {
      arrayKV(options._events, eventName, cb)
    }

    result.off = function(eventName, cb) {
      var i, arr = options._events[eventName]
      if(!arr) return
      if(!cb) return arr = []
      if( (i = arr.indexOf(cb)) > -1) arr.splice(i, 1)
    }

    // root[0].children._p.prop._color= function(){return 'bluesdfsdf'}
    // console.log(root, makeCSS(root[0].children['_p'], options))
    applyPlugins(options, 'post', result)
    return result
  }

  // no optins
  // console.log(cssobj({p:{color:123}}).css)

  // // save options
  // window.a = cssobj(obj, window.a? window.a.options : {})
  // console.log(a.css)

  // module exports
  return cssobj
}))
