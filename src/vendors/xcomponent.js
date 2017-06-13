!(function(root, factory) {
  typeof exports === 'object' && typeof module === 'object'
    ? (module.exports = factory())
    : typeof define === 'function' && define.amd
        ? define('xcomponent', [], factory)
        : typeof exports === 'object'
            ? (exports.xcomponent = factory())
            : (root.xcomponent = factory())
})(this, function() {
  return (function(modules) {
    function __webpack_require__(moduleId) {
      if (installedModules[moduleId]) return installedModules[moduleId].exports
      var module = (installedModules[moduleId] = {
        i: moduleId,
        l: !1,
        exports: {}
      })
      modules[moduleId].call(
        module.exports,
        module,
        module.exports,
        __webpack_require__
      )
      module.l = !0
      return module.exports
    }
    var installedModules = {}
    __webpack_require__.m = modules
    __webpack_require__.c = installedModules
    __webpack_require__.i = function(value) {
      return value
    }
    __webpack_require__.d = function(exports, name, getter) {
      __webpack_require__.o(exports, name) ||
        Object.defineProperty(exports, name, {
          configurable: !1,
          enumerable: !0,
          get: getter
        })
    }
    __webpack_require__.n = function(module) {
      var getter = module && module.__esModule
        ? function() {
            return module.default
          }
        : function() {
            return module
          }
      __webpack_require__.d(getter, 'a', getter)
      return getter
    }
    __webpack_require__.o = function(object, property) {
      return Object.prototype.hasOwnProperty.call(object, property)
    }
    __webpack_require__.p = ''
    return __webpack_require__((__webpack_require__.s = 78))
  })([
    function(module, exports, __webpack_require__) {
      'use strict'
      function setWindowMatch(win, match) {
        global.domainMatches = global.domainMatches || new _src.WeakMap()
        global.domainMatches.set(win, match)
        domainMatchTimeout ||
          (domainMatchTimeout = setTimeout(function() {
            global.domainMatches = new _src.WeakMap()
            domainMatchTimeout = null
          }, 1))
      }
      function getActualDomain(win) {
        var location = win.location
        if (!location) throw new Error('Can not read window location')
        var protocol = location.protocol
        if (!protocol) throw new Error('Can not read window protocol')
        if (protocol === CONSTANTS.FILE_PROTOCOL) return 'file://'
        var host = location.host
        if (!host) throw new Error('Can not read window host')
        return protocol + '//' + host
      }
      function getDomain(win) {
        win = win || window
        var domain = getActualDomain(win)
        return domain &&
          win.mockDomain &&
          win.mockDomain.indexOf(CONSTANTS.MOCK_PROTOCOL) === 0
          ? win.mockDomain
          : domain
      }
      function isActuallySameDomain(win) {
        if (global.domainMatches.has(win)) {
          if (global.domainMatches.get(win)) return !0
        }
        var match = !1
        try {
          getActualDomain(win) === getActualDomain(window) && (match = !0)
        } catch (err) {}
        match || setWindowMatch(win, match)
        return match
      }
      function isSameDomain(win) {
        if (global.domainMatches.has(win)) return global.domainMatches.get(win)
        var match = !1
        try {
          getDomain(window) === getDomain(win) && (match = !0)
        } catch (err) {}
        setWindowMatch(win, match)
        return match
      }
      function getParent(win) {
        if (win) {
          try {
            if (win.parent && win.parent !== win) return win.parent
          } catch (err) {
            return
          }
        }
      }
      function getOpener(win) {
        if (win && !getParent(win)) {
          try {
            return win.opener
          } catch (err) {
            return
          }
        }
      }
      function getParents(win) {
        var result = []
        try {
          for (; win.parent !== win; ) {
            result.push(win.parent)
            win = win.parent
          }
        } catch (err) {}
        return result
      }
      function isAncestorParent(parent, child) {
        if (!parent || !child) return !1
        var childParent = getParent(child)
        return childParent
          ? childParent === parent
          : getParents(child).indexOf(parent) !== -1
      }
      function getFrames(win) {
        var result = [], frames = void 0
        try {
          frames = win.frames
        } catch (err) {
          frames = win
        }
        var len = void 0
        try {
          len = frames.length
        } catch (err) {}
        if (len === 0) return result
        if (len) {
          for (var i = 0; i < len; i++) {
            var frame = void 0
            try {
              frame = frames[i]
            } catch (err) {
              continue
            }
            result.push(frame)
          }
          return result
        }
        for (var _i = 0; _i < 100; _i++) {
          var _frame = void 0
          try {
            _frame = frames[_i]
          } catch (err) {
            return result
          }
          if (!_frame) return result
          result.push(_frame)
        }
        return result
      }
      function getAllChildFrames(win) {
        for (
          var result = [],
            _iterator = getFrames(win),
            _isArray = Array.isArray(_iterator),
            _i2 = 0,
            _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();
          ;

        ) {
          var _ref
          if (_isArray) {
            if (_i2 >= _iterator.length) break
            _ref = _iterator[_i2++]
          } else {
            _i2 = _iterator.next()
            if (_i2.done) break
            _ref = _i2.value
          }
          var frame = _ref
          result.push(frame)
          for (
            var _iterator2 = getAllChildFrames(frame),
              _isArray2 = Array.isArray(_iterator2),
              _i3 = 0,
              _iterator2 = _isArray2
                ? _iterator2
                : _iterator2[Symbol.iterator]();
            ;

          ) {
            var _ref2
            if (_isArray2) {
              if (_i3 >= _iterator2.length) break
              _ref2 = _iterator2[_i3++]
            } else {
              _i3 = _iterator2.next()
              if (_i3.done) break
              _ref2 = _i3.value
            }
            var childFrame = _ref2
            result.push(childFrame)
          }
        }
        return result
      }
      function getAllFramesInWindow(win) {
        var result = getAllChildFrames(win)
        result.push(win)
        for (
          var _iterator3 = getParents(win),
            _isArray3 = Array.isArray(_iterator3),
            _i4 = 0,
            _iterator3 = _isArray3 ? _iterator3 : _iterator3[Symbol.iterator]();
          ;

        ) {
          var _ref3
          if (_isArray3) {
            if (_i4 >= _iterator3.length) break
            _ref3 = _iterator3[_i4++]
          } else {
            _i4 = _iterator3.next()
            if (_i4.done) break
            _ref3 = _i4.value
          }
          var parent = _ref3
          result.push(parent)
          for (
            var _iterator4 = getFrames(parent),
              _isArray4 = Array.isArray(_iterator4),
              _i5 = 0,
              _iterator4 = _isArray4
                ? _iterator4
                : _iterator4[Symbol.iterator]();
            ;

          ) {
            var _ref4
            if (_isArray4) {
              if (_i5 >= _iterator4.length) break
              _ref4 = _iterator4[_i5++]
            } else {
              _i5 = _iterator4.next()
              if (_i5.done) break
              _ref4 = _i5.value
            }
            var frame = _ref4
            result.indexOf(frame) === -1 && result.push(frame)
          }
        }
        return result
      }
      function getTop(win) {
        if (win) {
          try {
            if (win.top) return win.top
          } catch (err) {}
          if (getParent(win) === win) return win
          try {
            if (isAncestorParent(window, win)) return window.top
          } catch (err) {}
          try {
            if (isAncestorParent(win, window)) return window.top
          } catch (err) {}
          for (
            var _iterator5 = getAllChildFrames(win),
              _isArray5 = Array.isArray(_iterator5),
              _i6 = 0,
              _iterator5 = _isArray5
                ? _iterator5
                : _iterator5[Symbol.iterator]();
            ;

          ) {
            var _ref5
            if (_isArray5) {
              if (_i6 >= _iterator5.length) break
              _ref5 = _iterator5[_i6++]
            } else {
              _i6 = _iterator5.next()
              if (_i6.done) break
              _ref5 = _i6.value
            }
            var frame = _ref5
            try {
              if (frame.top) return frame.top
            } catch (err) {}
            if (getParent(frame) === frame) return frame
          }
        }
      }
      function isWindowClosed(win) {
        var allowMock =
          !(arguments.length > 1 && void 0 !== arguments[1]) || arguments[1]
        try {
          if (win === window) return !1
        } catch (err) {
          return !0
        }
        try {
          if (!win) return !0
        } catch (err) {
          return !0
        }
        try {
          if (win.closed) return !0
        } catch (err) {
          return !err || err.message !== 'Call was rejected by callee.\r\n'
        }
        if (allowMock && isSameDomain(win)) {
          try {
            if (win.mockclosed) return !0
          } catch (err) {}
        }
        try {
          if (!win.parent || !win.top) return !0
        } catch (err) {}
        return !1
      }
      function getUserAgent(win) {
        win = win || window
        return win.navigator.mockUserAgent || win.navigator.userAgent
      }
      function getFrameByName(win, name) {
        for (
          var winFrames = getFrames(win),
            _iterator6 = winFrames,
            _isArray6 = Array.isArray(_iterator6),
            _i7 = 0,
            _iterator6 = _isArray6 ? _iterator6 : _iterator6[Symbol.iterator]();
          ;

        ) {
          var _ref6
          if (_isArray6) {
            if (_i7 >= _iterator6.length) break
            _ref6 = _iterator6[_i7++]
          } else {
            _i7 = _iterator6.next()
            if (_i7.done) break
            _ref6 = _i7.value
          }
          var childFrame = _ref6
          try {
            if (
              isSameDomain(childFrame) &&
              childFrame.name === name &&
              winFrames.indexOf(childFrame) !== -1
            )
              return childFrame
          } catch (err) {}
        }
        try {
          if (winFrames.indexOf(win.frames[name]) !== -1)
            return win.frames[name]
        } catch (err) {}
        try {
          if (winFrames.indexOf(win[name]) !== -1) return win[name]
        } catch (err) {}
      }
      function findChildFrameByName(win, name) {
        var frame = getFrameByName(win, name)
        if (frame) return frame
        for (
          var _iterator7 = getFrames(win),
            _isArray7 = Array.isArray(_iterator7),
            _i8 = 0,
            _iterator7 = _isArray7 ? _iterator7 : _iterator7[Symbol.iterator]();
          ;

        ) {
          var _ref7
          if (_isArray7) {
            if (_i8 >= _iterator7.length) break
            _ref7 = _iterator7[_i8++]
          } else {
            _i8 = _iterator7.next()
            if (_i8.done) break
            _ref7 = _i8.value
          }
          var childFrame = _ref7,
            namedFrame = findChildFrameByName(childFrame, name)
          if (namedFrame) return namedFrame
        }
      }
      function findFrameByName(win, name) {
        var frame = void 0
        frame = getFrameByName(win, name)
        return frame || findChildFrameByName(getTop(win), name)
      }
      function isParent(win, frame) {
        var frameParent = getParent(frame)
        if (frameParent) return frameParent === win
        for (
          var _iterator8 = getFrames(win),
            _isArray8 = Array.isArray(_iterator8),
            _i9 = 0,
            _iterator8 = _isArray8 ? _iterator8 : _iterator8[Symbol.iterator]();
          ;

        ) {
          var _ref8
          if (_isArray8) {
            if (_i9 >= _iterator8.length) break
            _ref8 = _iterator8[_i9++]
          } else {
            _i9 = _iterator8.next()
            if (_i9.done) break
            _ref8 = _i9.value
          }
          if (_ref8 === frame) return !0
        }
        return !1
      }
      function isOpener(parent, child) {
        return parent === getOpener(child)
      }
      function getAncestor(win) {
        win = win || window
        var opener = getOpener(win)
        if (opener) return opener
        var parent = getParent(win)
        return parent || void 0
      }
      function getAncestors(win) {
        for (var results = [], ancestor = win; ancestor; ) {
          ancestor = getAncestor(ancestor)
          ancestor && results.push(ancestor)
        }
        return results
      }
      function isAncestor(parent, child) {
        var actualParent = getAncestor(child)
        if (actualParent) return actualParent === parent
        if (child === parent) return !1
        if (getTop(child) === child) return !1
        for (
          var _iterator9 = getFrames(parent),
            _isArray9 = Array.isArray(_iterator9),
            _i10 = 0,
            _iterator9 = _isArray9 ? _iterator9 : _iterator9[Symbol.iterator]();
          ;

        ) {
          var _ref9
          if (_isArray9) {
            if (_i10 >= _iterator9.length) break
            _ref9 = _iterator9[_i10++]
          } else {
            _i10 = _iterator9.next()
            if (_i10.done) break
            _ref9 = _i10.value
          }
          if (_ref9 === child) return !0
        }
        return !1
      }
      function isPopup() {
        return Boolean(getOpener(window))
      }
      function isIframe() {
        return Boolean(getParent(window))
      }
      function isFullpage() {
        return Boolean(!isIframe() && !isPopup())
      }
      function anyMatch(collection1, collection2) {
        for (
          var _iterator10 = collection1,
            _isArray10 = Array.isArray(_iterator10),
            _i11 = 0,
            _iterator10 = _isArray10
              ? _iterator10
              : _iterator10[Symbol.iterator]();
          ;

        ) {
          var _ref10
          if (_isArray10) {
            if (_i11 >= _iterator10.length) break
            _ref10 = _iterator10[_i11++]
          } else {
            _i11 = _iterator10.next()
            if (_i11.done) break
            _ref10 = _i11.value
          }
          for (
            var item1 = _ref10,
              _iterator11 = collection2,
              _isArray11 = Array.isArray(_iterator11),
              _i12 = 0,
              _iterator11 = _isArray11
                ? _iterator11
                : _iterator11[Symbol.iterator]();
            ;

          ) {
            var _ref11
            if (_isArray11) {
              if (_i12 >= _iterator11.length) break
              _ref11 = _iterator11[_i12++]
            } else {
              _i12 = _iterator11.next()
              if (_i12.done) break
              _ref11 = _i12.value
            }
            if (item1 === _ref11) return !0
          }
        }
      }
      function isSameTopWindow(win1, win2) {
        var top1 = getTop(win1), top2 = getTop(win2)
        try {
          if (top1 && top2) return top1 === top2
        } catch (err) {}
        var allFrames1 = getAllFramesInWindow(win1),
          allFrames2 = getAllFramesInWindow(win2)
        if (anyMatch(allFrames1, allFrames2)) return !0
        var opener1 = getOpener(top1), opener2 = getOpener(top2)
        return (
          (!opener1 || !anyMatch(getAllFramesInWindow(opener1), allFrames2)) &&
          ((!opener2 || !anyMatch(getAllFramesInWindow(opener2), allFrames1)) &&
            void 0)
        )
      }
      function matchDomain(pattern, origin) {
        if (typeof pattern === 'string') {
          if (typeof origin === 'string')
            return pattern === CONSTANTS.WILDCARD || origin === pattern
          if ((0, _util.isRegex)(origin)) return !1
          if (Array.isArray(origin)) return !1
        }
        return (0, _util.isRegex)(pattern)
          ? (0, _util.isRegex)(origin)
              ? pattern.toString() === origin.toString()
              : !Array.isArray(origin) && Boolean(origin.match(pattern))
          : !!Array.isArray(pattern) &&
              (Array.isArray(origin)
                ? JSON.stringify(pattern) === JSON.stringify(origin)
                : !(0, _util.isRegex)(origin) &&
                    pattern.some(function(subpattern) {
                      return matchDomain(subpattern, origin)
                    }))
      }
      Object.defineProperty(exports, '__esModule', {
        value: !0
      })
      exports.getActualDomain = getActualDomain
      exports.getDomain = getDomain
      exports.isActuallySameDomain = isActuallySameDomain
      exports.isSameDomain = isSameDomain
      exports.getParent = getParent
      exports.getOpener = getOpener
      exports.getParents = getParents
      exports.isAncestorParent = isAncestorParent
      exports.getFrames = getFrames
      exports.getAllChildFrames = getAllChildFrames
      exports.getAllFramesInWindow = getAllFramesInWindow
      exports.getTop = getTop
      exports.isWindowClosed = isWindowClosed
      exports.getUserAgent = getUserAgent
      exports.getFrameByName = getFrameByName
      exports.findChildFrameByName = findChildFrameByName
      exports.findFrameByName = findFrameByName
      exports.isParent = isParent
      exports.isOpener = isOpener
      exports.getAncestor = getAncestor
      exports.getAncestors = getAncestors
      exports.isAncestor = isAncestor
      exports.isPopup = isPopup
      exports.isIframe = isIframe
      exports.isFullpage = isFullpage
      exports.isSameTopWindow = isSameTopWindow
      exports.matchDomain = matchDomain
      var _src = __webpack_require__(6),
        _util = __webpack_require__(46),
        global = (window.__crossDomainUtils__ = window.__crossDomainUtils__ || {
        })
      global.domainMatches = global.domainMatches || new _src.WeakMap()
      var domainMatchTimeout = void 0,
        CONSTANTS = {
          MOCK_PROTOCOL: 'mock:',
          FILE_PROTOCOL: 'file:',
          WILDCARD: '*'
        }
    },
    function(module, __webpack_exports__, __webpack_require__) {
      'use strict'
      var __WEBPACK_IMPORTED_MODULE_0__config__ = __webpack_require__(54)
      __webpack_require__.d(__webpack_exports__, 'b', function() {
        return __WEBPACK_IMPORTED_MODULE_0__config__.a
      })
      var __WEBPACK_IMPORTED_MODULE_1__constants__ = __webpack_require__(30)
      __webpack_require__.d(__webpack_exports__, 'a', function() {
        return __WEBPACK_IMPORTED_MODULE_1__constants__.a
      })
      __webpack_require__.d(__webpack_exports__, 'c', function() {
        return __WEBPACK_IMPORTED_MODULE_1__constants__.b
      })
    },
    function(module, __webpack_exports__, __webpack_require__) {
      'use strict'
      var __WEBPACK_IMPORTED_MODULE_0__dom__ = __webpack_require__(81)
      __webpack_require__.d(__webpack_exports__, 'a', function() {
        return __WEBPACK_IMPORTED_MODULE_0__dom__.a
      })
      __webpack_require__.d(__webpack_exports__, 'd', function() {
        return __WEBPACK_IMPORTED_MODULE_0__dom__.b
      })
      __webpack_require__.d(__webpack_exports__, 'i', function() {
        return __WEBPACK_IMPORTED_MODULE_0__dom__.c
      })
      __webpack_require__.d(__webpack_exports__, 'j', function() {
        return __WEBPACK_IMPORTED_MODULE_0__dom__.d
      })
      __webpack_require__.d(__webpack_exports__, 'k', function() {
        return __WEBPACK_IMPORTED_MODULE_0__dom__.e
      })
      __webpack_require__.d(__webpack_exports__, 'l', function() {
        return __WEBPACK_IMPORTED_MODULE_0__dom__.f
      })
      __webpack_require__.d(__webpack_exports__, 'n', function() {
        return __WEBPACK_IMPORTED_MODULE_0__dom__.g
      })
      __webpack_require__.d(__webpack_exports__, 'o', function() {
        return __WEBPACK_IMPORTED_MODULE_0__dom__.h
      })
      __webpack_require__.d(__webpack_exports__, 'v', function() {
        return __WEBPACK_IMPORTED_MODULE_0__dom__.i
      })
      __webpack_require__.d(__webpack_exports__, 'w', function() {
        return __WEBPACK_IMPORTED_MODULE_0__dom__.j
      })
      __webpack_require__.d(__webpack_exports__, 'x', function() {
        return __WEBPACK_IMPORTED_MODULE_0__dom__.k
      })
      __webpack_require__.d(__webpack_exports__, 'z', function() {
        return __WEBPACK_IMPORTED_MODULE_0__dom__.l
      })
      __webpack_require__.d(__webpack_exports__, 'A', function() {
        return __WEBPACK_IMPORTED_MODULE_0__dom__.m
      })
      __webpack_require__.d(__webpack_exports__, 'B', function() {
        return __WEBPACK_IMPORTED_MODULE_0__dom__.n
      })
      __webpack_require__.d(__webpack_exports__, 'C', function() {
        return __WEBPACK_IMPORTED_MODULE_0__dom__.o
      })
      __webpack_require__.d(__webpack_exports__, 'D', function() {
        return __WEBPACK_IMPORTED_MODULE_0__dom__.p
      })
      __webpack_require__.d(__webpack_exports__, 'E', function() {
        return __WEBPACK_IMPORTED_MODULE_0__dom__.q
      })
      __webpack_require__.d(__webpack_exports__, 'G', function() {
        return __WEBPACK_IMPORTED_MODULE_0__dom__.r
      })
      __webpack_require__.d(__webpack_exports__, 'H', function() {
        return __WEBPACK_IMPORTED_MODULE_0__dom__.s
      })
      __webpack_require__.d(__webpack_exports__, 'I', function() {
        return __WEBPACK_IMPORTED_MODULE_0__dom__.t
      })
      __webpack_require__.d(__webpack_exports__, 'J', function() {
        return __WEBPACK_IMPORTED_MODULE_0__dom__.u
      })
      __webpack_require__.d(__webpack_exports__, 'K', function() {
        return __WEBPACK_IMPORTED_MODULE_0__dom__.v
      })
      __webpack_require__.d(__webpack_exports__, 'L', function() {
        return __WEBPACK_IMPORTED_MODULE_0__dom__.w
      })
      __webpack_require__.d(__webpack_exports__, 'O', function() {
        return __WEBPACK_IMPORTED_MODULE_0__dom__.x
      })
      __webpack_require__.d(__webpack_exports__, 'P', function() {
        return __WEBPACK_IMPORTED_MODULE_0__dom__.y
      })
      __webpack_require__.d(__webpack_exports__, 'S', function() {
        return __WEBPACK_IMPORTED_MODULE_0__dom__.z
      })
      __webpack_require__.d(__webpack_exports__, 'X', function() {
        return __WEBPACK_IMPORTED_MODULE_0__dom__.A
      })
      var __WEBPACK_IMPORTED_MODULE_1__fn__ = __webpack_require__(40)
      __webpack_require__.d(__webpack_exports__, 'f', function() {
        return __WEBPACK_IMPORTED_MODULE_1__fn__.e
      })
      __webpack_require__.d(__webpack_exports__, 'q', function() {
        return __WEBPACK_IMPORTED_MODULE_1__fn__.a
      })
      __webpack_require__.d(__webpack_exports__, 's', function() {
        return __WEBPACK_IMPORTED_MODULE_1__fn__.c
      })
      __webpack_require__.d(__webpack_exports__, 'u', function() {
        return __WEBPACK_IMPORTED_MODULE_1__fn__.f
      })
      __webpack_require__.d(__webpack_exports__, 'y', function() {
        return __WEBPACK_IMPORTED_MODULE_1__fn__.b
      })
      var __WEBPACK_IMPORTED_MODULE_2__promise__ = __webpack_require__(84)
      __webpack_require__.d(__webpack_exports__, 'm', function() {
        return __WEBPACK_IMPORTED_MODULE_2__promise__.a
      })
      __webpack_require__.d(__webpack_exports__, 'F', function() {
        return __WEBPACK_IMPORTED_MODULE_2__promise__.b
      })
      __webpack_require__.d(__webpack_exports__, 'T', function() {
        return __WEBPACK_IMPORTED_MODULE_2__promise__.c
      })
      __webpack_require__.d(__webpack_exports__, 'U', function() {
        return __WEBPACK_IMPORTED_MODULE_2__promise__.d
      })
      __webpack_require__.d(__webpack_exports__, 'V', function() {
        return __WEBPACK_IMPORTED_MODULE_2__promise__.e
      })
      var __WEBPACK_IMPORTED_MODULE_3__util__ = __webpack_require__(25)
      __webpack_require__.d(__webpack_exports__, 'b', function() {
        return __WEBPACK_IMPORTED_MODULE_3__util__.a
      })
      __webpack_require__.d(__webpack_exports__, 'g', function() {
        return __WEBPACK_IMPORTED_MODULE_3__util__.h
      })
      __webpack_require__.d(__webpack_exports__, 'h', function() {
        return __WEBPACK_IMPORTED_MODULE_3__util__.e
      })
      __webpack_require__.d(__webpack_exports__, 'p', function() {
        return __WEBPACK_IMPORTED_MODULE_3__util__.i
      })
      __webpack_require__.d(__webpack_exports__, 'r', function() {
        return __WEBPACK_IMPORTED_MODULE_3__util__.j
      })
      __webpack_require__.d(__webpack_exports__, 'W', function() {
        return __WEBPACK_IMPORTED_MODULE_3__util__.k
      })
      __webpack_require__.d(__webpack_exports__, '_3', function() {
        return __WEBPACK_IMPORTED_MODULE_3__util__.l
      })
      __webpack_require__.d(__webpack_exports__, '_4', function() {
        return __WEBPACK_IMPORTED_MODULE_3__util__.c
      })
      var __WEBPACK_IMPORTED_MODULE_4__css__ = __webpack_require__(79)
      __webpack_require__.d(__webpack_exports__, 'Q', function() {
        return __WEBPACK_IMPORTED_MODULE_4__css__.a
      })
      __webpack_require__.d(__webpack_exports__, 'R', function() {
        return __WEBPACK_IMPORTED_MODULE_4__css__.b
      })
      __webpack_require__.d(__webpack_exports__, '_1', function() {
        return __WEBPACK_IMPORTED_MODULE_4__css__.c
      })
      __webpack_require__.d(__webpack_exports__, '_2', function() {
        return __WEBPACK_IMPORTED_MODULE_4__css__.d
      })
      var __WEBPACK_IMPORTED_MODULE_5__decorators__ = __webpack_require__(80)
      __webpack_require__.d(__webpack_exports__, 'M', function() {
        return __WEBPACK_IMPORTED_MODULE_5__decorators__.a
      })
      __webpack_require__.d(__webpack_exports__, 'N', function() {
        return __WEBPACK_IMPORTED_MODULE_5__decorators__.b
      })
      var __WEBPACK_IMPORTED_MODULE_6__global__ = __webpack_require__(82)
      __webpack_require__.d(__webpack_exports__, 'e', function() {
        return __WEBPACK_IMPORTED_MODULE_6__global__.a
      })
      __webpack_require__.d(__webpack_exports__, 't', function() {
        return __WEBPACK_IMPORTED_MODULE_6__global__.b
      })
      var __WEBPACK_IMPORTED_MODULE_7__logger__ = __webpack_require__(83)
      __webpack_require__.d(__webpack_exports__, 'c', function() {
        return __WEBPACK_IMPORTED_MODULE_7__logger__.a
      })
      __webpack_require__.d(__webpack_exports__, 'Y', function() {
        return __WEBPACK_IMPORTED_MODULE_7__logger__.b
      })
      __webpack_require__.d(__webpack_exports__, 'Z', function() {
        return __WEBPACK_IMPORTED_MODULE_7__logger__.c
      })
      __webpack_require__.d(__webpack_exports__, '_0', function() {
        return __WEBPACK_IMPORTED_MODULE_7__logger__.d
      })
    },
    function(module, __webpack_exports__, __webpack_require__) {
      'use strict'
      var __WEBPACK_IMPORTED_MODULE_0__promise__ = __webpack_require__(33)
      __webpack_require__.d(__webpack_exports__, 'c', function() {
        return __WEBPACK_IMPORTED_MODULE_0__promise__.a
      })
      __webpack_require__.d(__webpack_exports__, 'g', function() {
        return __WEBPACK_IMPORTED_MODULE_0__promise__.b
      })
      var __WEBPACK_IMPORTED_MODULE_1__util__ = __webpack_require__(12)
      __webpack_require__.d(__webpack_exports__, 'd', function() {
        return __WEBPACK_IMPORTED_MODULE_1__util__.h
      })
      __webpack_require__.d(__webpack_exports__, 'e', function() {
        return __WEBPACK_IMPORTED_MODULE_1__util__.d
      })
      __webpack_require__.d(__webpack_exports__, 'f', function() {
        return __WEBPACK_IMPORTED_MODULE_1__util__.c
      })
      __webpack_require__.d(__webpack_exports__, 'j', function() {
        return __WEBPACK_IMPORTED_MODULE_1__util__.b
      })
      __webpack_require__.d(__webpack_exports__, 'k', function() {
        return __WEBPACK_IMPORTED_MODULE_1__util__.i
      })
      __webpack_require__.d(__webpack_exports__, 'l', function() {
        return __WEBPACK_IMPORTED_MODULE_1__util__.j
      })
      __webpack_require__.d(__webpack_exports__, 'n', function() {
        return __WEBPACK_IMPORTED_MODULE_1__util__.k
      })
      __webpack_require__.d(__webpack_exports__, 'o', function() {
        return __WEBPACK_IMPORTED_MODULE_1__util__.l
      })
      __webpack_require__.d(__webpack_exports__, 'p', function() {
        return __WEBPACK_IMPORTED_MODULE_1__util__.e
      })
      __webpack_require__.d(__webpack_exports__, 'q', function() {
        return __WEBPACK_IMPORTED_MODULE_1__util__.m
      })
      __webpack_require__.d(__webpack_exports__, 'r', function() {
        return __WEBPACK_IMPORTED_MODULE_1__util__.n
      })
      __webpack_require__.d(__webpack_exports__, 't', function() {
        return __WEBPACK_IMPORTED_MODULE_1__util__.o
      })
      __webpack_require__.d(__webpack_exports__, 'u', function() {
        return __WEBPACK_IMPORTED_MODULE_1__util__.p
      })
      var __WEBPACK_IMPORTED_MODULE_2__log__ = __webpack_require__(23)
      __webpack_require__.d(__webpack_exports__, 'i', function() {
        return __WEBPACK_IMPORTED_MODULE_2__log__.a
      })
      var __WEBPACK_IMPORTED_MODULE_3__methods__ = __webpack_require__(58)
      __webpack_require__.d(__webpack_exports__, 'b', function() {
        return __WEBPACK_IMPORTED_MODULE_3__methods__.a
      })
      __webpack_require__.d(__webpack_exports__, 'h', function() {
        return __WEBPACK_IMPORTED_MODULE_3__methods__.b
      })
      __webpack_require__.d(__webpack_exports__, 'm', function() {
        return __WEBPACK_IMPORTED_MODULE_3__methods__.c
      })
      var __WEBPACK_IMPORTED_MODULE_5__ready__ = (__webpack_require__(
        34
      ), __webpack_require__(59))
      __webpack_require__.d(__webpack_exports__, 'a', function() {
        return __WEBPACK_IMPORTED_MODULE_5__ready__.a
      })
      __webpack_require__.d(__webpack_exports__, 's', function() {
        return __WEBPACK_IMPORTED_MODULE_5__ready__.b
      })
    },
    function(module, __webpack_exports__, __webpack_require__) {
      'use strict'
      function trycatch(method, successHandler, errorHandler) {
        function flush() {
          if (isCalled) {
            if (isError) return errorHandler(err)
            if (isSuccess) return successHandler(res)
          }
        }
        var isCalled = !1,
          isSuccess = !1,
          isError = !1,
          err = void 0,
          res = void 0
        try {
          method(
            function(result) {
              res = result
              isSuccess = !0
              flush()
            },
            function(error) {
              err = error
              isError = !0
              flush()
            }
          )
        } catch (error) {
          return errorHandler(error)
        }
        isCalled = !0
        flush()
      }
      function addPossiblyUnhandledPromise(promise) {
        possiblyUnhandledPromises.push(promise)
        possiblyUnhandledPromiseTimeout =
          possiblyUnhandledPromiseTimeout ||
          setTimeout(flushPossiblyUnhandledPromises, 1)
      }
      function flushPossiblyUnhandledPromises() {
        possiblyUnhandledPromiseTimeout = null
        var promises = possiblyUnhandledPromises
        possiblyUnhandledPromises = []
        for (var i = 0; i < promises.length; i++) {
          ;(function(i) {
            var promise = promises[i]
            if (promise.silentReject) return 'continue'
            promise.handlers.push({
              onError: function(err) {
                promise.silentReject || dispatchError(err)
              }
            })
            promise.dispatch()
          })(i)
        }
      }
      function dispatchError(err) {
        if (dispatchedErrors.indexOf(err) === -1) {
          dispatchedErrors.push(err)
          setTimeout(function() {
            throw err
          }, 1)
          for (var j = 0; j < possiblyUnhandledPromiseHandlers.length; j++)
            possiblyUnhandledPromiseHandlers[j](err)
        }
      }
      function isPromise(item) {
        try {
          if (!item) return !1
          if (window.Window && item instanceof window.Window) return !1
          if (window.constructor && item instanceof window.constructor)
            return !1
          if (toString) {
            var name = toString.call(item)
            if (
              name === '[object Window]' ||
              name === '[object global]' ||
              name === '[object DOMWindow]'
            )
              return !1
          }
          if (item && item.then instanceof Function) return !0
        } catch (err) {
          return !1
        }
        return !1
      }
      __webpack_require__.d(__webpack_exports__, 'a', function() {
        return SyncPromise
      })
      var possiblyUnhandledPromiseHandlers = [],
        possiblyUnhandledPromises = [],
        possiblyUnhandledPromiseTimeout = void 0,
        dispatchedErrors = [],
        toString = {}.toString,
        SyncPromise = function(handler) {
          this.resolved = !1
          this.rejected = !1
          this.silentReject = !1
          this.handlers = []
          addPossiblyUnhandledPromise(this)
          if (handler) {
            var self = this
            trycatch(
              handler,
              function(res) {
                return self.resolve(res)
              },
              function(err) {
                return self.reject(err)
              }
            )
          }
        }
      SyncPromise.resolve = function(value) {
        return isPromise(value) ? value : new SyncPromise().resolve(value)
      }
      SyncPromise.reject = function(error) {
        return new SyncPromise().reject(error)
      }
      SyncPromise.prototype.resolve = function(result) {
        if (this.resolved || this.rejected) return this
        if (isPromise(result))
          throw new Error('Can not resolve promise with another promise')
        this.resolved = !0
        this.value = result
        this.dispatch()
        return this
      }
      SyncPromise.prototype.reject = function(error) {
        if (this.resolved || this.rejected) return this
        if (isPromise(error))
          throw new Error('Can not reject promise with another promise')
        error ||
          (error = new Error(
            'Expected reject to be called with Error, got ' + error
          ))
        this.rejected = !0
        this.value = error
        this.dispatch()
        return this
      }
      SyncPromise.prototype.asyncReject = function(error) {
        this.silentReject = !0
        this.reject(error)
      }
      SyncPromise.prototype.dispatch = function() {
        var _this = this
        if (this.resolved || this.rejected) {
          for (; this.handlers.length; ) {
            ;(function() {
              var handler = _this.handlers.shift(),
                isError = !1,
                result = void 0,
                error = void 0
              try {
                if (_this.resolved)
                  result = handler.onSuccess
                    ? handler.onSuccess(_this.value)
                    : _this.value
                else if (_this.rejected) {
                  if (handler.onError) result = handler.onError(_this.value)
                  else {
                    isError = !0
                    error = _this.value
                  }
                }
              } catch (err) {
                isError = !0
                error = err
              }
              if (result === _this)
                throw new Error(
                  'Can not return a promise from the the then handler of the same promise'
                )
              if (!handler.promise) return 'continue'
              isError
                ? handler.promise.reject(error)
                : isPromise(result)
                    ? result.then(
                        function(res) {
                          handler.promise.resolve(res)
                        },
                        function(err) {
                          handler.promise.reject(err)
                        }
                      )
                    : handler.promise.resolve(result)
            })()
          }
        }
      }
      SyncPromise.prototype.then = function(onSuccess, onError) {
        if (onSuccess && typeof onSuccess !== 'function' && !onSuccess.call)
          throw new Error(
            'Promise.then expected a function for success handler'
          )
        if (onError && typeof onError !== 'function' && !onError.call)
          throw new Error('Promise.then expected a function for error handler')
        var promise = new SyncPromise(null, this)
        this.handlers.push({
          promise: promise,
          onSuccess: onSuccess,
          onError: onError
        })
        this.silentReject = !0
        this.dispatch()
        return promise
      }
      SyncPromise.prototype.catch = function(onError) {
        return this.then(null, onError)
      }
      SyncPromise.prototype.finally = function(handler) {
        return this.then(
          function(result) {
            return SyncPromise.try(handler).then(function() {
              return result
            })
          },
          function(err) {
            return SyncPromise.try(handler).then(function() {
              throw err
            })
          }
        )
      }
      SyncPromise.all = function(promises) {
        for (
          var promise = new SyncPromise(),
            count = promises.length,
            results = [],
            i = 0;
          i < promises.length;
          i++
        ) {
          !(function(i) {
            ;(isPromise(promises[i])
              ? promises[i]
              : SyncPromise.resolve(promises[i])).then(
              function(result) {
                results[i] = result
                count -= 1
                count === 0 && promise.resolve(results)
              },
              function(err) {
                promise.reject(err)
              }
            )
          })(i)
        }
        count || promise.resolve(results)
        return promise
      }
      SyncPromise.onPossiblyUnhandledException = function(handler) {
        possiblyUnhandledPromiseHandlers.push(handler)
      }
      SyncPromise.try = function(method) {
        return SyncPromise.resolve().then(method)
      }
      SyncPromise.delay = function(delay) {
        return new SyncPromise(function(resolve) {
          setTimeout(resolve, delay)
        })
      }
      SyncPromise.hash = function(obj) {
        var results = {}, promises = []
        for (var key in obj) {
          !(function(key) {
            obj.hasOwnProperty(key) &&
              promises.push(
                SyncPromise.resolve(obj[key]).then(function(result) {
                  results[key] = result
                })
              )
          })(key)
        }
        return SyncPromise.all(promises).then(function() {
          return results
        })
      }
      SyncPromise.promisifyCall = function() {
        var args = Array.prototype.slice.call(arguments), method = args.shift()
        if (typeof method !== 'function')
          throw new Error('Expected promisifyCall to be called with a function')
        return new SyncPromise(function(resolve, reject) {
          args.push(function(err, result) {
            return err ? reject(err) : resolve(result)
          })
          return method.apply(null, args)
        })
      }
    },
    function(module, __webpack_exports__, __webpack_require__) {
      'use strict'
      var __WEBPACK_IMPORTED_MODULE_0__conf__ = __webpack_require__(1)
      __webpack_require__.d(__webpack_exports__, 'a', function() {
        return global
      })
      var global = (window[
        __WEBPACK_IMPORTED_MODULE_0__conf__.a.WINDOW_PROPS.POSTROBOT
      ] = window[
        __WEBPACK_IMPORTED_MODULE_0__conf__.a.WINDOW_PROPS.POSTROBOT
      ] || {})
      global.registerSelf = function() {}
    },
    function(module, __webpack_exports__, __webpack_require__) {
      'use strict'
      Object.defineProperty(__webpack_exports__, '__esModule', {
        value: !0
      })
      var __WEBPACK_IMPORTED_MODULE_0__interface__ = __webpack_require__(28)
      __webpack_require__.d(__webpack_exports__, 'WeakMap', function() {
        return __WEBPACK_IMPORTED_MODULE_0__interface__.WeakMap
      })
      __webpack_exports__.default = __WEBPACK_IMPORTED_MODULE_0__interface__
    },
    function(module, __webpack_exports__, __webpack_require__) {
      'use strict'
      Object.defineProperty(__webpack_exports__, '__esModule', {
        value: !0
      })
      var __WEBPACK_IMPORTED_MODULE_0__lib__ = __webpack_require__(2)
      __webpack_require__.d(__webpack_exports__, 'XCOMPONENT', function() {
        return XCOMPONENT
      })
      __webpack_require__.d(__webpack_exports__, '__XCOMPONENT__', function() {
        return __XCOMPONENT__
      })
      __webpack_require__.d(__webpack_exports__, 'POST_MESSAGE', function() {
        return POST_MESSAGE
      })
      __webpack_require__.d(__webpack_exports__, 'PROP_TYPES', function() {
        return PROP_TYPES
      })
      __webpack_require__.d(__webpack_exports__, 'INITIAL_PROPS', function() {
        return INITIAL_PROPS
      })
      __webpack_require__.d(
        __webpack_exports__,
        'WINDOW_REFERENCES',
        function() {
          return WINDOW_REFERENCES
        }
      )
      __webpack_require__.d(__webpack_exports__, 'PROP_TYPES_LIST', function() {
        return PROP_TYPES_LIST
      })
      __webpack_require__.d(__webpack_exports__, 'CONTEXT_TYPES', function() {
        return CONTEXT_TYPES
      })
      __webpack_require__.d(__webpack_exports__, 'CLASS_NAMES', function() {
        return CLASS_NAMES
      })
      __webpack_require__.d(__webpack_exports__, 'ANIMATION_NAMES', function() {
        return ANIMATION_NAMES
      })
      __webpack_require__.d(__webpack_exports__, 'EVENT_NAMES', function() {
        return EVENT_NAMES
      })
      __webpack_require__.d(__webpack_exports__, 'CLOSE_REASONS', function() {
        return CLOSE_REASONS
      })
      __webpack_require__.d(
        __webpack_exports__,
        'CONTEXT_TYPES_LIST',
        function() {
          return CONTEXT_TYPES_LIST
        }
      )
      __webpack_require__.d(__webpack_exports__, 'DELEGATE', function() {
        return DELEGATE
      })
      __webpack_require__.d(__webpack_exports__, 'WILDCARD', function() {
        return WILDCARD
      })
      var XCOMPONENT = 'xcomponent',
        __XCOMPONENT__ = '__' + XCOMPONENT + '__',
        POST_MESSAGE = {
          INIT: XCOMPONENT + '_init',
          PROPS: XCOMPONENT + '_props',
          PROP_CALLBACK: XCOMPONENT + '_prop_callback',
          CLOSE: XCOMPONENT + '_close',
          REDIRECT: XCOMPONENT + '_redirect',
          RESIZE: XCOMPONENT + '_resize',
          DELEGATE: XCOMPONENT + '_delegate',
          ERROR: XCOMPONENT + '_error',
          HIDE: XCOMPONENT + '_hide',
          SHOW: XCOMPONENT + '_show'
        },
        PROP_TYPES = {
          STRING: 'string',
          OBJECT: 'object',
          FUNCTION: 'function',
          BOOLEAN: 'boolean',
          NUMBER: 'number'
        },
        INITIAL_PROPS = {
          RAW: 'raw',
          UID: 'uid'
        },
        WINDOW_REFERENCES = {
          DIRECT_PARENT: '__direct_parent__',
          PARENT_PARENT: '__parent_parent__',
          PARENT_UID: '__parent_uid__'
        },
        PROP_TYPES_LIST = __webpack_require__.i(
          __WEBPACK_IMPORTED_MODULE_0__lib__.b
        )(PROP_TYPES),
        CONTEXT_TYPES = {
          IFRAME: 'iframe',
          POPUP: 'popup'
        },
        CLASS_NAMES = {
          XCOMPONENT: '' + XCOMPONENT,
          COMPONENT: XCOMPONENT + '-component',
          CLOSE: XCOMPONENT + '-close',
          FOCUS: XCOMPONENT + '-focus',
          ELEMENT: XCOMPONENT + '-element',
          IFRAME: XCOMPONENT + '-iframe',
          POPUP: XCOMPONENT + '-popup',
          LOADING: XCOMPONENT + '-loading',
          SHOW_CONTAINER: XCOMPONENT + '-show-container',
          SHOW_COMPONENT: XCOMPONENT + '-show-component',
          HIDE_CONTAINER: XCOMPONENT + '-hide-container',
          HIDE_COMPONENT: XCOMPONENT + '-hide-component'
        },
        ANIMATION_NAMES = {
          SHOW_CONTAINER: XCOMPONENT + '-show-container',
          SHOW_COMPONENT: XCOMPONENT + '-show-component',
          HIDE_CONTAINER: XCOMPONENT + '-hide-container',
          HIDE_COMPONENT: XCOMPONENT + '-hide-component'
        },
        EVENT_NAMES = {
          CLICK: 'click'
        },
        CLOSE_REASONS = {
          PARENT_CALL: 'parent_call',
          CHILD_CALL: 'child_call',
          CLOSE_DETECTED: 'close_detected',
          USER_CLOSED: 'user_closed',
          PARENT_CLOSE_DETECTED: 'parent_close_detected'
        },
        CONTEXT_TYPES_LIST = __webpack_require__.i(
          __WEBPACK_IMPORTED_MODULE_0__lib__.b
        )(CONTEXT_TYPES),
        DELEGATE = {
          CALL_ORIGINAL: 'call_original',
          CALL_DELEGATE: 'call_delegate'
        },
        WILDCARD = '*'
    },
    function(module, __webpack_exports__, __webpack_require__) {
      'use strict'
      var __WEBPACK_IMPORTED_MODULE_0__receive__ = __webpack_require__(55)
      __webpack_require__.d(__webpack_exports__, 'a', function() {
        return __WEBPACK_IMPORTED_MODULE_0__receive__.a
      })
      __webpack_require__.d(__webpack_exports__, 'b', function() {
        return __WEBPACK_IMPORTED_MODULE_0__receive__.b
      })
      __webpack_require__.d(__webpack_exports__, 'g', function() {
        return __WEBPACK_IMPORTED_MODULE_0__receive__.c
      })
      var __WEBPACK_IMPORTED_MODULE_1__send__ = __webpack_require__(32)
      __webpack_require__.d(__webpack_exports__, 'e', function() {
        return __WEBPACK_IMPORTED_MODULE_1__send__.a
      })
      var __WEBPACK_IMPORTED_MODULE_2__listeners__ = __webpack_require__(31)
      __webpack_require__.d(__webpack_exports__, 'c', function() {
        return __WEBPACK_IMPORTED_MODULE_2__listeners__.d
      })
      __webpack_require__.d(__webpack_exports__, 'd', function() {
        return __WEBPACK_IMPORTED_MODULE_2__listeners__.e
      })
      __webpack_require__.d(__webpack_exports__, 'f', function() {
        return __WEBPACK_IMPORTED_MODULE_2__listeners__.c
      })
    },
    function(module, __webpack_exports__, __webpack_require__) {
      'use strict'
      var __WEBPACK_IMPORTED_MODULE_0__interface__ = __webpack_require__(10)
      __webpack_require__.d(__webpack_exports__, 'a', function() {
        return __WEBPACK_IMPORTED_MODULE_0__interface__.CONFIG
      })
      __webpack_require__.d(__webpack_exports__, 'b', function() {
        return __WEBPACK_IMPORTED_MODULE_0__interface__.send
      })
      __webpack_require__.d(__webpack_exports__, 'c', function() {
        return __WEBPACK_IMPORTED_MODULE_0__interface__.on
      })
      __webpack_require__.d(__webpack_exports__, 'd', function() {
        return __WEBPACK_IMPORTED_MODULE_0__interface__.bridge
      })
      __webpack_require__.d(__webpack_exports__, 'e', function() {
        return __WEBPACK_IMPORTED_MODULE_0__interface__.cleanUpWindow
      })
    },
    function(module, __webpack_exports__, __webpack_require__) {
      'use strict'
      function init() {
        if (!__WEBPACK_IMPORTED_MODULE_2__global__.a.initialized) {
          __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__drivers__.a)()
          __webpack_require__(22).openTunnelToOpener()
          __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__lib__.a)()
          __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__lib__.b)()
        }
        __WEBPACK_IMPORTED_MODULE_2__global__.a.initialized = !0
      }
      Object.defineProperty(__webpack_exports__, '__esModule', {
        value: !0
      })
      var __WEBPACK_IMPORTED_MODULE_0__lib__ = __webpack_require__(3),
        __WEBPACK_IMPORTED_MODULE_1__drivers__ = __webpack_require__(8),
        __WEBPACK_IMPORTED_MODULE_2__global__ = __webpack_require__(5),
        __WEBPACK_IMPORTED_MODULE_3__clean__ = __webpack_require__(52)
      __webpack_require__.d(__webpack_exports__, 'cleanUpWindow', function() {
        return __WEBPACK_IMPORTED_MODULE_3__clean__.a
      })
      var __WEBPACK_IMPORTED_MODULE_4__public__ = __webpack_require__(62)
      __webpack_require__.d(__webpack_exports__, 'parent', function() {
        return __WEBPACK_IMPORTED_MODULE_4__public__.a
      })
      __webpack_require__.d(__webpack_exports__, 'bridge', function() {
        return __WEBPACK_IMPORTED_MODULE_4__public__.b
      })
      __webpack_require__.d(__webpack_exports__, 'util', function() {
        return __WEBPACK_IMPORTED_MODULE_4__public__.c
      })
      __webpack_require__.d(__webpack_exports__, 'send', function() {
        return __WEBPACK_IMPORTED_MODULE_4__public__.d
      })
      __webpack_require__.d(__webpack_exports__, 'request', function() {
        return __WEBPACK_IMPORTED_MODULE_4__public__.e
      })
      __webpack_require__.d(__webpack_exports__, 'sendToParent', function() {
        return __WEBPACK_IMPORTED_MODULE_4__public__.f
      })
      __webpack_require__.d(__webpack_exports__, 'client', function() {
        return __WEBPACK_IMPORTED_MODULE_4__public__.g
      })
      __webpack_require__.d(__webpack_exports__, 'on', function() {
        return __WEBPACK_IMPORTED_MODULE_4__public__.h
      })
      __webpack_require__.d(__webpack_exports__, 'listen', function() {
        return __WEBPACK_IMPORTED_MODULE_4__public__.i
      })
      __webpack_require__.d(__webpack_exports__, 'once', function() {
        return __WEBPACK_IMPORTED_MODULE_4__public__.j
      })
      __webpack_require__.d(__webpack_exports__, 'listener', function() {
        return __WEBPACK_IMPORTED_MODULE_4__public__.k
      })
      __webpack_require__.d(__webpack_exports__, 'enableMockMode', function() {
        return __WEBPACK_IMPORTED_MODULE_4__public__.l
      })
      __webpack_require__.d(__webpack_exports__, 'disableMockMode', function() {
        return __WEBPACK_IMPORTED_MODULE_4__public__.m
      })
      __webpack_require__.d(__webpack_exports__, 'CONFIG', function() {
        return __WEBPACK_IMPORTED_MODULE_4__public__.n
      })
      __webpack_require__.d(__webpack_exports__, 'CONSTANTS', function() {
        return __WEBPACK_IMPORTED_MODULE_4__public__.o
      })
      __webpack_require__.d(__webpack_exports__, 'disable', function() {
        return __WEBPACK_IMPORTED_MODULE_4__public__.p
      })
      __webpack_require__.d(__webpack_exports__, 'Promise', function() {
        return __WEBPACK_IMPORTED_MODULE_0__lib__.c
      })
      __webpack_exports__.init = init
      init()
    },
    function(module, __webpack_exports__, __webpack_require__) {
      'use strict'
      __webpack_require__.d(__webpack_exports__, 'a', function() {
        return config
      })
      __webpack_require__.d(__webpack_exports__, 'b', function() {
        return logLevels
      })
      var config = {
        uri: '',
        prefix: '',
        initial_state_name: 'init',
        flushInterval: 6e5,
        debounceInterval: 10,
        sizeLimit: 300,
        silent: !1,
        heartbeat: !0,
        heartbeatConsoleLog: !0,
        heartbeatInterval: 5e3,
        heartbeatTooBusy: !1,
        heartbeatTooBusyThreshold: 1e4,
        logLevel: 'debug',
        autoLog: ['warn', 'error'],
        logUnload: !0,
        logUnloadSync: !1,
        logPerformance: !0
      },
        logLevels = ['error', 'warn', 'info', 'debug']
    },
    function(module, __webpack_exports__, __webpack_require__) {
      'use strict'
      function once(method) {
        if (!method) return method
        var called = !1
        return function() {
          if (!called) {
            called = !0
            return method.apply(this, arguments)
          }
        }
      }
      function noop() {}
      function listen(win, event, handler) {
        win.addEventListener
          ? win.addEventListener(event, handler)
          : win.attachEvent('on' + event, handler)
        return {
          cancel: function() {
            win.removeEventListener
              ? win.removeEventListener(event, handler)
              : win.detachEvent('on' + event, handler)
          }
        }
      }
      function map(collection, method) {
        for (var results = [], i = 0; i < collection.length; i++)
          results.push(method(collection[i]))
        return results
      }
      function some(collection, method) {
        method = method || Boolean
        for (var i = 0; i < collection.length; i++)
          if (method(collection[i])) return !0
        return !1
      }
      function uniqueID() {
        var chars = '0123456789abcdef'
        return 'xxxxxxxxxx'.replace(/./g, function() {
          return chars.charAt(Math.floor(Math.random() * chars.length))
        })
      }
      function extend(obj, source) {
        if (!source) return obj
        for (var key in source)
          source.hasOwnProperty(key) && (obj[key] = source[key])
        return obj
      }
      function each(obj, callback) {
        if (Array.isArray(obj))
          for (var i = 0; i < obj.length; i++)
            callback(obj[i], i)
        else if (
          (void 0 === obj ? 'undefined' : _typeof(obj)) === 'object' &&
          obj !== null
        )
          for (var key in obj)
            obj.hasOwnProperty(key) && callback(obj[key], key)
      }
      function replaceObject(obj, callback) {
        var depth = arguments.length > 2 && void 0 !== arguments[2]
          ? arguments[2]
          : 1
        if (depth >= 100)
          throw new Error(
            'Self-referential object passed, or object contained too many layers'
          )
        var newobj = Array.isArray(obj) ? [] : {}
        each(obj, function(item, key) {
          var result = callback(item, key)
          void 0 !== result
            ? (newobj[key] = result)
            : (void 0 === item ? 'undefined' : _typeof(item)) === 'object' &&
                item !== null
                ? (newobj[key] = replaceObject(item, callback, depth + 1))
                : (newobj[key] = item)
        })
        return newobj
      }
      function safeInterval(method, time) {
        function runInterval() {
          timeout = setTimeout(runInterval, time)
          method.call()
        }
        var timeout = void 0
        timeout = setTimeout(runInterval, time)
        return {
          cancel: function() {
            clearTimeout(timeout)
          }
        }
      }
      function getDomainFromUrl(url) {
        var domain = void 0
        if (!url.match(/^(https?|mock|file):\/\//))
          return __webpack_require__.i(
            __WEBPACK_IMPORTED_MODULE_1_cross_domain_utils_src__.getDomain
          )()
        domain = url
        domain = domain.split('/').slice(0, 3).join('/')
        return domain
      }
      function isRegex(item) {
        return Object.prototype.toString.call(item) === '[object RegExp]'
      }
      function weakMapMemoize(method) {
        var weakmap = new __WEBPACK_IMPORTED_MODULE_0_cross_domain_safe_weakmap_src__.WeakMap()
        return function(arg) {
          var result = weakmap.get(arg)
          if (void 0 !== result) return result
          result = method.call(this, arg)
          void 0 !== result && weakmap.set(arg, result)
          return result
        }
      }
      function getWindowType() {
        return __webpack_require__.i(
          __WEBPACK_IMPORTED_MODULE_1_cross_domain_utils_src__.isPopup
        )()
          ? __WEBPACK_IMPORTED_MODULE_2__conf__.a.WINDOW_TYPES.POPUP
          : __webpack_require__.i(
              __WEBPACK_IMPORTED_MODULE_1_cross_domain_utils_src__.isIframe
            )()
              ? __WEBPACK_IMPORTED_MODULE_2__conf__.a.WINDOW_TYPES.IFRAME
              : __WEBPACK_IMPORTED_MODULE_2__conf__.a.WINDOW_TYPES.FULLPAGE
      }
      function jsonStringify() {
        var objectToJSON = void 0, arrayToJSON = void 0
        try {
          if (JSON.stringify({}) !== '{}') {
            objectToJSON = Object.prototype.toJSON
            delete Object.prototype.toJSON
          }
          if (JSON.stringify({}) !== '{}')
            throw new Error('Can not correctly serialize JSON objects')
          if (JSON.stringify([]) !== '[]') {
            arrayToJSON = Array.prototype.toJSON
            delete Array.prototype.toJSON
          }
          if (JSON.stringify([]) !== '[]')
            throw new Error('Can not correctly serialize JSON objects')
        } catch (err) {
          throw new Error('Can not repair JSON.stringify: ' + err.message)
        }
        var result = JSON.stringify.apply(this, arguments)
        try {
          objectToJSON && (Object.prototype.toJSON = objectToJSON)
          arrayToJSON && (Array.prototype.toJSON = arrayToJSON)
        } catch (err) {
          throw new Error('Can not repair JSON.stringify: ' + err.message)
        }
        return result
      }
      function jsonParse() {
        return JSON.parse.apply(this, arguments)
      }
      var __WEBPACK_IMPORTED_MODULE_0_cross_domain_safe_weakmap_src__ = __webpack_require__(
        6
      ),
        __WEBPACK_IMPORTED_MODULE_1_cross_domain_utils_src__ = __webpack_require__(
          0
        ),
        __WEBPACK_IMPORTED_MODULE_2__conf__ = (__webpack_require__.n(
          __WEBPACK_IMPORTED_MODULE_1_cross_domain_utils_src__
        ), __webpack_require__(1))
      __webpack_exports__.e = once
      __webpack_exports__.l = noop
      __webpack_exports__.k = listen
      __webpack_exports__.a = map
      __webpack_exports__.i = some
      __webpack_exports__.d = uniqueID
      __webpack_exports__.n = extend
      __webpack_exports__.f = replaceObject
      __webpack_exports__.m = safeInterval
      __webpack_exports__.o = getDomainFromUrl
      __webpack_exports__.h = isRegex
      __webpack_exports__.p = weakMapMemoize
      __webpack_exports__.c = getWindowType
      __webpack_exports__.b = jsonStringify
      __webpack_exports__.j = jsonParse
      var _typeof = typeof Symbol === 'function' &&
        typeof Symbol.iterator === 'symbol'
        ? function(obj) {
            return typeof obj
          }
        : function(obj) {
            return obj &&
              typeof Symbol === 'function' &&
              obj.constructor === Symbol &&
              obj !== Symbol.prototype
              ? 'symbol'
              : typeof obj
          }
    },
    function(module, __webpack_exports__, __webpack_require__) {
      'use strict'
      function addPayloadBuilder(builder) {
        payloadBuilders.push(builder)
      }
      function addMetaBuilder(builder) {
        metaBuilders.push(builder)
      }
      function addTrackingBuilder(builder) {
        trackingBuilders.push(builder)
      }
      function addHeaderBuilder(builder) {
        headerBuilders.push(builder)
      }
      __webpack_require__.d(__webpack_exports__, 'a', function() {
        return payloadBuilders
      })
      __webpack_require__.d(__webpack_exports__, 'b', function() {
        return metaBuilders
      })
      __webpack_require__.d(__webpack_exports__, 'c', function() {
        return trackingBuilders
      })
      __webpack_require__.d(__webpack_exports__, 'd', function() {
        return headerBuilders
      })
      __webpack_exports__.e = addPayloadBuilder
      __webpack_exports__.f = addMetaBuilder
      __webpack_exports__.g = addTrackingBuilder
      __webpack_exports__.h = addHeaderBuilder
      var payloadBuilders = [],
        metaBuilders = [],
        trackingBuilders = [],
        headerBuilders = []
    },
    function(module, __webpack_exports__, __webpack_require__) {
      'use strict'
      function print(level, event, payload) {
        if (!loaded) {
          return setTimeout(function() {
            return print(level, event, payload)
          }, 1)
        }
        if (window.console && window.console.log) {
          var logLevel =
            window.LOG_LEVEL || __WEBPACK_IMPORTED_MODULE_2__config__.a.logLevel
          if (
            !(__WEBPACK_IMPORTED_MODULE_2__config__.b.indexOf(level) >
              __WEBPACK_IMPORTED_MODULE_2__config__.b.indexOf(logLevel))
          ) {
            payload = payload || {}
            var args = [event]
            __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__util__.e)() &&
              (payload = JSON.stringify(payload))
            args.push(payload)
            ;(payload.error || payload.warning) &&
              args.push('\n\n', payload.error || payload.warning)
            try {
              window.console[level] && window.console[level].apply
                ? window.console[level].apply(window.console, args)
                : window.console.log &&
                    window.console.log.apply &&
                    window.console.log.apply(window.console, args)
            } catch (err) {}
          }
        }
      }
      function immediateFlush() {
        var async =
          !(arguments.length > 0 && void 0 !== arguments[0]) || arguments[0]
        if (__WEBPACK_IMPORTED_MODULE_2__config__.a.uri) {
          var hasBuffer = buffer.length, hasTracking = tracking.length
          if (hasBuffer || hasTracking) {
            for (
              var meta = {},
                _iterator = __WEBPACK_IMPORTED_MODULE_1__builders__.b,
                _isArray = Array.isArray(_iterator),
                _i = 0,
                _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();
              ;

            ) {
              var _ref
              if (_isArray) {
                if (_i >= _iterator.length) break
                _ref = _iterator[_i++]
              } else {
                _i = _iterator.next()
                if (_i.done) break
                _ref = _i.value
              }
              var builder = _ref
              try {
                __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__util__.d)(
                  meta,
                  builder(),
                  !1
                )
              } catch (err) {
                console.error(
                  'Error in custom meta builder:',
                  err.stack || err.toString()
                )
              }
            }
            for (
              var headers = {},
                _iterator2 = __WEBPACK_IMPORTED_MODULE_1__builders__.d,
                _isArray2 = Array.isArray(_iterator2),
                _i2 = 0,
                _iterator2 = _isArray2
                  ? _iterator2
                  : _iterator2[Symbol.iterator]();
              ;

            ) {
              var _ref2
              if (_isArray2) {
                if (_i2 >= _iterator2.length) break
                _ref2 = _iterator2[_i2++]
              } else {
                _i2 = _iterator2.next()
                if (_i2.done) break
                _ref2 = _i2.value
              }
              var _builder = _ref2
              try {
                __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__util__.d)(
                  headers,
                  _builder(),
                  !1
                )
              } catch (err) {
                console.error(
                  'Error in custom header builder:',
                  err.stack || err.toString()
                )
              }
            }
            var events = buffer,
              req = __webpack_require__.i(
                __WEBPACK_IMPORTED_MODULE_0__util__.f
              )(
                'post',
                __WEBPACK_IMPORTED_MODULE_2__config__.a.uri,
                headers,
                {
                  events: events,
                  meta: meta,
                  tracking: tracking
                },
                async
              )
            buffer = []
            tracking = []
            return req
          }
        }
      }
      function enqueue(level, event, payload) {
        buffer.push({
          level: level,
          event: event,
          payload: payload
        })
        __WEBPACK_IMPORTED_MODULE_2__config__.a.autoLog.indexOf(level) > -1 &&
          _flush()
      }
      function log(level, event, payload) {
        __WEBPACK_IMPORTED_MODULE_2__config__.a.prefix &&
          (event = __WEBPACK_IMPORTED_MODULE_2__config__.a.prefix + '_' + event)
        payload = payload || {}
        typeof payload === 'string'
          ? (payload = {
              message: payload
            })
          : payload instanceof Error &&
              (payload = {
                error: payload.stack || payload.toString()
              })
        try {
          JSON.stringify(payload)
        } catch (err) {
          return
        }
        payload.timestamp = Date.now()
        for (
          var _iterator3 = __WEBPACK_IMPORTED_MODULE_1__builders__.a,
            _isArray3 = Array.isArray(_iterator3),
            _i3 = 0,
            _iterator3 = _isArray3 ? _iterator3 : _iterator3[Symbol.iterator]();
          ;

        ) {
          var _ref3
          if (_isArray3) {
            if (_i3 >= _iterator3.length) break
            _ref3 = _iterator3[_i3++]
          } else {
            _i3 = _iterator3.next()
            if (_i3.done) break
            _ref3 = _i3.value
          }
          var builder = _ref3
          try {
            __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__util__.d)(
              payload,
              builder(),
              !1
            )
          } catch (err) {
            console.error(
              'Error in custom payload builder:',
              err.stack || err.toString()
            )
          }
        }
        __WEBPACK_IMPORTED_MODULE_2__config__.a.silent ||
          print(level, event, payload)
        buffer.length === __WEBPACK_IMPORTED_MODULE_2__config__.a.sizeLimit
          ? enqueue('info', 'logger_max_buffer_length')
          : buffer.length < __WEBPACK_IMPORTED_MODULE_2__config__.a.sizeLimit &&
              enqueue(level, event, payload)
      }
      function prefix(name) {
        return {
          debug: function(event, payload) {
            return log('debug', name + '_' + event, payload)
          },
          info: function(event, payload) {
            return log('info', name + '_' + event, payload)
          },
          warn: function(event, payload) {
            return log('warn', name + '_' + event, payload)
          },
          error: function(event, payload) {
            return log('error', name + '_' + event, payload)
          },
          track: function(payload) {
            return _track(payload)
          },
          flush: function() {
            return _flush()
          }
        }
      }
      function debug(event, payload) {
        return log('debug', event, payload)
      }
      function info(event, payload) {
        return log('info', event, payload)
      }
      function warn(event, payload) {
        return log('warn', event, payload)
      }
      function error(event, payload) {
        return log('error', event, payload)
      }
      function _track(payload) {
        if (payload) {
          try {
            JSON.stringify(payload)
          } catch (err) {
            return
          }
          for (
            var _iterator4 = __WEBPACK_IMPORTED_MODULE_1__builders__.c,
              _isArray4 = Array.isArray(_iterator4),
              _i4 = 0,
              _iterator4 = _isArray4
                ? _iterator4
                : _iterator4[Symbol.iterator]();
            ;

          ) {
            var _ref4
            if (_isArray4) {
              if (_i4 >= _iterator4.length) break
              _ref4 = _iterator4[_i4++]
            } else {
              _i4 = _iterator4.next()
              if (_i4.done) break
              _ref4 = _i4.value
            }
            var builder = _ref4
            try {
              __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__util__.d)(
                payload,
                builder(),
                !1
              )
            } catch (err) {
              console.error(
                'Error in custom tracking builder:',
                err.stack || err.toString()
              )
            }
          }
          print('debug', 'tracking', payload)
          tracking.push(payload)
        }
      }
      var __WEBPACK_IMPORTED_MODULE_0__util__ = __webpack_require__(15),
        __WEBPACK_IMPORTED_MODULE_1__builders__ = __webpack_require__(13),
        __WEBPACK_IMPORTED_MODULE_2__config__ = __webpack_require__(11)
      __webpack_require__.d(__webpack_exports__, 'a', function() {
        return _track
      })
      __webpack_require__.d(__webpack_exports__, 'b', function() {
        return buffer
      })
      __webpack_require__.d(__webpack_exports__, 'c', function() {
        return tracking
      })
      __webpack_exports__.d = print
      __webpack_exports__.e = immediateFlush
      __webpack_require__.d(__webpack_exports__, 'f', function() {
        return _flush
      })
      __webpack_exports__.g = log
      __webpack_exports__.h = prefix
      __webpack_exports__.i = debug
      __webpack_exports__.j = info
      __webpack_exports__.k = warn
      __webpack_exports__.l = error
      var _typeof = typeof Symbol === 'function' &&
        typeof Symbol.iterator === 'symbol'
        ? function(obj) {
            return typeof obj
          }
        : function(obj) {
            return obj &&
              typeof Symbol === 'function' &&
              obj.constructor === Symbol &&
              obj !== Symbol.prototype
              ? 'symbol'
              : typeof obj
          },
        buffer = [],
        tracking = []
      Function.prototype.bind &&
        window.console &&
        _typeof(console.log) === 'object' &&
        ['log', 'info', 'warn', 'error'].forEach(function(method) {
          console[method] = this.bind(console[method], console)
        }, Function.prototype.call)
      var loaded = !1
      setTimeout(function() {
        loaded = !0
      }, 1)
      var _flush = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__util__.g)(
        immediateFlush,
        __WEBPACK_IMPORTED_MODULE_2__config__.a.debounceInterval
      )
    },
    function(module, __webpack_exports__, __webpack_require__) {
      'use strict'
      function extend(dest, src) {
        var over =
          !(arguments.length > 2 && void 0 !== arguments[2]) || arguments[2]
        dest = dest || {}
        src = src || {}
        for (var i in src)
          src.hasOwnProperty(i) &&
            ((!over && dest.hasOwnProperty(i)) || (dest[i] = src[i]))
        return dest
      }
      function isSameProtocol(url) {
        return window.location.protocol === url.split('/')[0]
      }
      function isSameDomain(url) {
        var match = url.match(/https?:\/\/[^\/]+/)
        return (
          !match ||
          match[0] === window.location.protocol + '//' + window.location.host
        )
      }
      function ajax(method, url) {
        var headers = arguments.length > 2 && void 0 !== arguments[2]
          ? arguments[2]
          : {},
          data = arguments.length > 3 && void 0 !== arguments[3]
            ? arguments[3]
            : {},
          async =
            !(arguments.length > 4 && void 0 !== arguments[4]) || arguments[4]
        return new __WEBPACK_IMPORTED_MODULE_0_sync_browser_mocks_src_promise__.a(
          function(resolve) {
            var XRequest = window.XMLHttpRequest || window.ActiveXObject
            if (window.XDomainRequest && !isSameDomain(url)) {
              if (!isSameProtocol(url)) return resolve()
              XRequest = window.XDomainRequest
            }
            var req = new XRequest('MSXML2.XMLHTTP.3.0')
            req.open(method.toUpperCase(), url, async)
            req.setRequestHeader('X-Requested-With', 'XMLHttpRequest')
            req.setRequestHeader('Content-type', 'application/json')
            for (var headerName in headers)
              headers.hasOwnProperty(headerName) &&
                req.setRequestHeader(headerName, headers[headerName])
            req.onreadystatechange = function() {
              req.readyState > 3 && resolve()
            }
            req.send(JSON.stringify(data).replace(/&/g, '%26'))
          }
        )
      }
      function promiseDebounce(method, interval) {
        var debounce = {}
        return function() {
          var args = arguments
          if (debounce.timeout) {
            clearTimeout(debounce.timeout)
            delete debounce.timeout
          }
          debounce.timeout = setTimeout(function() {
            var resolver = debounce.resolver, rejector = debounce.rejector
            delete debounce.promise
            delete debounce.resolver
            delete debounce.rejector
            delete debounce.timeout
            return __WEBPACK_IMPORTED_MODULE_0_sync_browser_mocks_src_promise__.a
              .resolve()
              .then(function() {
                return method.apply(null, args)
              })
              .then(resolver, rejector)
          }, interval)
          debounce.promise =
            debounce.promise ||
            new __WEBPACK_IMPORTED_MODULE_0_sync_browser_mocks_src_promise__.a(
              function(resolver, rejector) {
                debounce.resolver = resolver
                debounce.rejector = rejector
              }
            )
          return debounce.promise
        }
      }
      function safeInterval(method, time) {
        function loop() {
          timeout = setTimeout(function() {
            method()
            loop()
          }, time)
        }
        var timeout = void 0
        loop()
        return {
          cancel: function() {
            clearTimeout(timeout)
          }
        }
      }
      function uniqueID() {
        var chars = '0123456789abcdef'
        return 'xxxxxxxxxx'.replace(/./g, function() {
          return chars.charAt(Math.floor(Math.random() * chars.length))
        })
      }
      function isIE() {
        return Boolean(window.document.documentMode)
      }
      var __WEBPACK_IMPORTED_MODULE_0_sync_browser_mocks_src_promise__ = __webpack_require__(
        4
      )
      __webpack_exports__.d = extend
      __webpack_exports__.f = ajax
      __webpack_exports__.g = promiseDebounce
      __webpack_require__.d(__webpack_exports__, 'c', function() {
        return windowReady
      })
      __webpack_exports__.b = safeInterval
      __webpack_exports__.a = uniqueID
      __webpack_exports__.e = isIE
      var windowReady = new __WEBPACK_IMPORTED_MODULE_0_sync_browser_mocks_src_promise__.a(
        function(resolve) {
          document.readyState === 'complete' && resolve()
          window.addEventListener('load', resolve)
        }
      )
    },
    function(module, __webpack_exports__, __webpack_require__) {
      'use strict'
      function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor))
          throw new TypeError('Cannot call a class as a function')
      }
      function cleanup(obj) {
        var tasks = [], cleaned = !1
        return {
          set: function(name, item) {
            if (!cleaned) {
              obj[name] = item
              this.register(function() {
                delete obj[name]
              })
              return item
            }
          },
          register: function(name, method) {
            if (cleaned) return method()
            if (!method) {
              method = name
              name = void 0
            }
            tasks.push({
              complete: !1,
              name: name,
              run: function() {
                if (!this.complete) {
                  this.complete = !0
                  return method()
                }
              }
            })
          },
          hasTasks: function() {
            return Boolean(
              tasks.filter(function(item) {
                return !item.complete
              }).length
            )
          },
          all: function() {
            var results = []
            cleaned = !0
            for (; tasks.length; )
              results.push(tasks.pop().run())
            return __WEBPACK_IMPORTED_MODULE_0_sync_browser_mocks_src_promise__.a
              .all(results)
              .then(function() {})
          },
          run: function(name) {
            for (
              var results = [],
                _iterator = tasks,
                _isArray = Array.isArray(_iterator),
                _i = 0,
                _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();
              ;

            ) {
              var _ref
              if (_isArray) {
                if (_i >= _iterator.length) break
                _ref = _iterator[_i++]
              } else {
                _i = _iterator.next()
                if (_i.done) break
                _ref = _i.value
              }
              var item = _ref
              item.name === name && results.push(item.run())
            }
            return __WEBPACK_IMPORTED_MODULE_0_sync_browser_mocks_src_promise__.a
              .all(results)
              .then(function() {})
          }
        }
      }
      var __WEBPACK_IMPORTED_MODULE_0_sync_browser_mocks_src_promise__ = __webpack_require__(
        4
      ),
        __WEBPACK_IMPORTED_MODULE_1_post_robot_src__ = __webpack_require__(9),
        __WEBPACK_IMPORTED_MODULE_2__lib__ = __webpack_require__(2)
      __webpack_require__.d(__webpack_exports__, 'a', function() {
        return BaseComponent
      })
      var _createClass = (function() {
        function defineProperties(target, props) {
          for (var i = 0; i < props.length; i++) {
            var descriptor = props[i]
            descriptor.enumerable = descriptor.enumerable || !1
            descriptor.configurable = !0
            'value' in descriptor && (descriptor.writable = !0)
            Object.defineProperty(target, descriptor.key, descriptor)
          }
        }
        return function(Constructor, protoProps, staticProps) {
          protoProps && defineProperties(Constructor.prototype, protoProps)
          staticProps && defineProperties(Constructor, staticProps)
          return Constructor
        }
      })(),
        BaseComponent = (function() {
          function BaseComponent() {
            _classCallCheck(this, BaseComponent)
            this.clean = cleanup(this)
          }
          _createClass(BaseComponent, [
            {
              key: 'addProp',
              value: function(options, name, def) {
                __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__lib__.p)(
                  options,
                  this,
                  name,
                  def
                )
              }
            },
            {
              key: 'tryCatch',
              value: function(method, doOnce) {
                var self = this,
                  errored = !1,
                  wrapper = function() {
                    if (!errored) {
                      try {
                        return method.apply(this, arguments)
                      } catch (err) {
                        errored = !0
                        return self.error(err)
                      }
                    }
                  }
                doOnce !== !1 &&
                  (wrapper = __webpack_require__.i(
                    __WEBPACK_IMPORTED_MODULE_2__lib__.q
                  )(wrapper))
                return wrapper
              }
            },
            {
              key: 'listen',
              value: function(win, domain) {
                var _this = this
                if (!win)
                  throw this.component.error('window to listen to not set')
                if (!domain) throw new Error('Must pass domain to listen to')
                if (this.listeners) {
                  for (
                    var listeners = this.listeners(),
                      _iterator2 = Object.keys(listeners),
                      _isArray2 = Array.isArray(_iterator2),
                      _i2 = 0,
                      _iterator2 = _isArray2
                        ? _iterator2
                        : _iterator2[Symbol.iterator]();
                    ;

                  ) {
                    var _ref2,
                      _ret = (function() {
                        if (_isArray2) {
                          if (_i2 >= _iterator2.length) return 'break'
                          _ref2 = _iterator2[_i2++]
                        } else {
                          _i2 = _iterator2.next()
                          if (_i2.done) return 'break'
                          _ref2 = _i2.value
                        }
                        var listenerName = _ref2,
                          name = listenerName.replace(/^xcomponent_/, ''),
                          listener = __webpack_require__.i(
                            __WEBPACK_IMPORTED_MODULE_1_post_robot_src__.c
                          )(
                            listenerName,
                            {
                              window: win,
                              domain: domain,
                              errorHandler: function(err) {
                                return _this.error(err)
                              }
                            },
                            function(_ref3) {
                              var source = _ref3.source, data = _ref3.data
                              _this.component.log('listener_' + name)
                              return listeners[listenerName].call(
                                _this,
                                source,
                                data
                              )
                            }
                          ),
                          errorListener = __webpack_require__.i(
                            __WEBPACK_IMPORTED_MODULE_1_post_robot_src__.c
                          )(
                            listenerName,
                            {
                              window: win,
                              errorHandler: function(err) {
                                return _this.error(err)
                              }
                            },
                            function(_ref4) {
                              var origin = _ref4.origin
                              _ref4.data
                              _this.component.logError(
                                'unexpected_listener_' + name,
                                {
                                  origin: origin,
                                  domain: domain
                                }
                              )
                              _this.error(
                                new Error(
                                  'Unexpected ' +
                                    name +
                                    ' message from domain ' +
                                    origin +
                                    ' -- expected message from ' +
                                    domain
                                )
                              )
                            }
                          )
                        _this.clean.register(function() {
                          listener.cancel()
                          errorListener.cancel()
                        })
                      })()
                    if (_ret === 'break') break
                  }
                }
              }
            }
          ])
          return BaseComponent
        })()
    },
    function(module, __webpack_exports__, __webpack_require__) {
      'use strict'
      function normalize(str) {
        return (
          str &&
          str
            .replace(/^[^a-z0-9A-Z]+|[^a-z0-9A-Z]+$/g, '')
            .replace(/[^a-z0-9A-Z]+/g, '_')
        )
      }
      function buildChildWindowName(name, version) {
        var options = arguments.length > 2 && void 0 !== arguments[2]
          ? arguments[2]
          : {}
        options.id = __webpack_require__.i(
          __WEBPACK_IMPORTED_MODULE_2__lib__.r
        )()
        options.domain = __webpack_require__.i(
          __WEBPACK_IMPORTED_MODULE_2__lib__.d
        )(window)
        var encodedName = normalize(name),
          encodedVersion = normalize(version),
          encodedOptions = __WEBPACK_IMPORTED_MODULE_1_hi_base32___default.a
            .encode(JSON.stringify(options))
            .replace(/\=/g, '')
            .toLowerCase()
        if (!encodedName)
          throw new Error(
            'Invalid name: ' + name + ' - must contain alphanumeric characters'
          )
        if (!encodedVersion)
          throw new Error(
            'Invalid version: ' +
              version +
              ' - must contain alphanumeric characters'
          )
        return [
          __WEBPACK_IMPORTED_MODULE_3__constants__.XCOMPONENT,
          encodedName,
          encodedVersion,
          encodedOptions
        ].join('__')
      }
      function getParentDomain() {
        return getComponentMeta().domain
      }
      function getPosition(options) {
        var width = options.width,
          height = options.height,
          left = void 0,
          top = void 0
        width &&
          (window.outerWidth
            ? (left =
                Math.round((window.outerWidth - width) / 2) + window.screenX)
            : window.screen.width &&
                (left = Math.round((window.screen.width - width) / 2)))
        height &&
          (window.outerHeight
            ? (top =
                Math.round((window.outerHeight - height) / 2) + window.screenY)
            : window.screen.height &&
                (top = Math.round((window.screen.height - height) / 2)))
        return {
          x: left,
          y: top
        }
      }
      var __WEBPACK_IMPORTED_MODULE_0_cross_domain_utils_src__ = __webpack_require__(
        0
      ),
        __WEBPACK_IMPORTED_MODULE_1_hi_base32__ = (__webpack_require__.n(
          __WEBPACK_IMPORTED_MODULE_0_cross_domain_utils_src__
        ), __webpack_require__(47)),
        __WEBPACK_IMPORTED_MODULE_1_hi_base32___default = __webpack_require__.n(
          __WEBPACK_IMPORTED_MODULE_1_hi_base32__
        ),
        __WEBPACK_IMPORTED_MODULE_2__lib__ = __webpack_require__(2),
        __WEBPACK_IMPORTED_MODULE_3__constants__ = __webpack_require__(7)
      __webpack_exports__.e = buildChildWindowName
      __webpack_require__.d(__webpack_exports__, 'd', function() {
        return getComponentMeta
      })
      __webpack_exports__.a = getParentDomain
      __webpack_require__.d(__webpack_exports__, 'g', function() {
        return isXComponentWindow
      })
      __webpack_require__.d(__webpack_exports__, 'b', function() {
        return getParentComponentWindow
      })
      __webpack_require__.d(__webpack_exports__, 'c', function() {
        return getParentRenderWindow
      })
      __webpack_exports__.f = getPosition
      var _slicedToArray = (function() {
        function sliceIterator(arr, i) {
          var _arr = [], _n = !0, _d = !1, _e = void 0
          try {
            for (
              var _s, _i = arr[Symbol.iterator]();
              !(_n = (_s = _i.next()).done);
              _n = !0
            ) {
              _arr.push(_s.value)
              if (i && _arr.length === i) break
            }
          } catch (err) {
            _d = !0
            _e = err
          } finally {
            try {
              !_n && _i.return && _i.return()
            } finally {
              if (_d) throw _e
            }
          }
          return _arr
        }
        return function(arr, i) {
          if (Array.isArray(arr)) return arr
          if (Symbol.iterator in Object(arr)) return sliceIterator(arr, i)
          throw new TypeError(
            'Invalid attempt to destructure non-iterable instance'
          )
        }
      })(),
        getComponentMeta = __webpack_require__.i(
          __WEBPACK_IMPORTED_MODULE_2__lib__.s
        )(function() {
          if (window.name) {
            var _window$name$split = window.name.split('__'),
              _window$name$split2 = _slicedToArray(_window$name$split, 4),
              xcomp = _window$name$split2[0],
              name = _window$name$split2[1],
              version = _window$name$split2[2],
              encodedOptions = _window$name$split2[3]
            if (xcomp === __WEBPACK_IMPORTED_MODULE_3__constants__.XCOMPONENT) {
              var componentMeta = void 0
              try {
                componentMeta = JSON.parse(
                  __WEBPACK_IMPORTED_MODULE_1_hi_base32___default.a.decode(
                    encodedOptions.toUpperCase()
                  )
                )
              } catch (err) {
                return
              }
              componentMeta.name = name
              componentMeta.version = version.replace(/_/g, '.')
              return componentMeta
            }
          }
        }),
        isXComponentWindow = __webpack_require__.i(
          __WEBPACK_IMPORTED_MODULE_2__lib__.s
        )(function() {
          return Boolean(getComponentMeta())
        }),
        getParentComponentWindow = __webpack_require__.i(
          __WEBPACK_IMPORTED_MODULE_2__lib__.s
        )(function() {
          var componentMeta = getComponentMeta()
          if (!componentMeta)
            throw new Error(
              'Can not get parent component window - window not rendered by xcomponent'
            )
          var parentWindow = __webpack_require__.i(
            __WEBPACK_IMPORTED_MODULE_0_cross_domain_utils_src__.getAncestor
          )(window)
          if (!parentWindow) throw new Error('Can not find parent window')
          if (
            componentMeta.parent ===
            __WEBPACK_IMPORTED_MODULE_3__constants__.WINDOW_REFERENCES
              .DIRECT_PARENT
          )
            return parentWindow
          if (
            componentMeta.parent ===
            __WEBPACK_IMPORTED_MODULE_3__constants__.WINDOW_REFERENCES
              .PARENT_PARENT
          ) {
            parentWindow = __webpack_require__.i(
              __WEBPACK_IMPORTED_MODULE_0_cross_domain_utils_src__.getAncestor
            )(parentWindow)
            if (!parentWindow)
              throw new Error('Can not find parent component window')
            return parentWindow
          }
          var parentFrame = __webpack_require__.i(
            __WEBPACK_IMPORTED_MODULE_0_cross_domain_utils_src__.findFrameByName
          )(parentWindow, componentMeta.parent)
          if (!parentFrame)
            throw new Error(
              'Can not find frame with name: ' + componentMeta.parent
            )
          return parentFrame
        }),
        getParentRenderWindow = __webpack_require__.i(
          __WEBPACK_IMPORTED_MODULE_2__lib__.s
        )(function() {
          var componentMeta = getComponentMeta()
          if (!componentMeta)
            throw new Error(
              'Can not get parent component window - window not rendered by xcomponent'
            )
          var parentWindow = __webpack_require__.i(
            __WEBPACK_IMPORTED_MODULE_0_cross_domain_utils_src__.getAncestor
          )(window)
          if (!parentWindow) throw new Error('Can not find parent window')
          if (
            componentMeta.renderParent ===
            __WEBPACK_IMPORTED_MODULE_3__constants__.WINDOW_REFERENCES
              .DIRECT_PARENT
          )
            return parentWindow
          if (
            componentMeta.renderParent ===
            __WEBPACK_IMPORTED_MODULE_3__constants__.WINDOW_REFERENCES
              .PARENT_PARENT
          ) {
            parentWindow = __webpack_require__.i(
              __WEBPACK_IMPORTED_MODULE_0_cross_domain_utils_src__.getAncestor
            )(parentWindow)
            if (!parentWindow)
              throw new Error('Can not find parent render window')
            return parentWindow
          }
          if (
            componentMeta.renderParent ===
            __WEBPACK_IMPORTED_MODULE_3__constants__.WINDOW_REFERENCES
              .PARENT_UID
          ) {
            parentWindow = getParentComponentWindow()[
              __WEBPACK_IMPORTED_MODULE_3__constants__.__XCOMPONENT__
            ].windows[componentMeta.uid]
            if (!parentWindow)
              throw new Error('Can not find parent render window')
            return parentWindow
          }
          throw new Error(
            'Unrecognized renderParent reference: ' + componentMeta.renderParent
          )
        })
    },
    function(module, __webpack_exports__, __webpack_require__) {
      'use strict'
      function PopupOpenError(message) {
        this.message = message
      }
      function IntegrationError(message) {
        this.message = message
      }
      function RenderError(message) {
        this.message = message
      }
      __webpack_exports__.a = PopupOpenError
      __webpack_exports__.b = IntegrationError
      __webpack_exports__.c = RenderError
      PopupOpenError.prototype = Object.create(Error.prototype)
      IntegrationError.prototype = Object.create(Error.prototype)
      RenderError.prototype = Object.create(Error.prototype)
    },
    function(module, __webpack_exports__, __webpack_require__) {
      'use strict'
      function create(options) {
        return new __WEBPACK_IMPORTED_MODULE_0__component__.a(options)
      }
      Object.defineProperty(__webpack_exports__, '__esModule', {
        value: !0
      })
      var __WEBPACK_IMPORTED_MODULE_0__component__ = __webpack_require__(36),
        __WEBPACK_IMPORTED_MODULE_1__lib__ = __webpack_require__(2)
      __webpack_require__.d(
        __webpack_exports__,
        'getCurrentScriptDir',
        function() {
          return __WEBPACK_IMPORTED_MODULE_1__lib__.a
        }
      )
      __webpack_require__.d(__webpack_exports__, 'getByTag', function() {
        return __WEBPACK_IMPORTED_MODULE_0__component__.b
      })
      __webpack_require__.d(__webpack_exports__, 'destroyAll', function() {
        return __WEBPACK_IMPORTED_MODULE_0__component__.c
      })
      __webpack_require__.d(
        __webpack_exports__,
        'componentTemplate',
        function() {
          return __WEBPACK_IMPORTED_MODULE_0__component__.d
        }
      )
      __webpack_require__.d(
        __webpack_exports__,
        'containerTemplate',
        function() {
          return __WEBPACK_IMPORTED_MODULE_0__component__.e
        }
      )
      var __WEBPACK_IMPORTED_MODULE_2__error__ = __webpack_require__(18)
      __webpack_require__.d(__webpack_exports__, 'PopupOpenError', function() {
        return __WEBPACK_IMPORTED_MODULE_2__error__.a
      })
      __webpack_require__.d(
        __webpack_exports__,
        'IntegrationError',
        function() {
          return __WEBPACK_IMPORTED_MODULE_2__error__.b
        }
      )
      __webpack_require__.d(__webpack_exports__, 'RenderError', function() {
        return __WEBPACK_IMPORTED_MODULE_2__error__.c
      })
      var __WEBPACK_IMPORTED_MODULE_3__constants__ = __webpack_require__(7)
      __webpack_exports__.create = create
      __webpack_require__.d(__webpack_exports__, 'CONSTANTS', function() {
        return CONSTANTS
      })
      var CONSTANTS = __WEBPACK_IMPORTED_MODULE_3__constants__
    },
    function(module, __webpack_exports__, __webpack_require__) {
      'use strict'
      var __WEBPACK_IMPORTED_MODULE_0__interface__ = __webpack_require__(26)
      __webpack_require__.d(__webpack_exports__, 'a', function() {
        return __WEBPACK_IMPORTED_MODULE_0__interface__.logLevels
      })
      __webpack_require__.d(__webpack_exports__, 'b', function() {
        return __WEBPACK_IMPORTED_MODULE_0__interface__.config
      })
      __webpack_require__.d(__webpack_exports__, 'c', function() {
        return __WEBPACK_IMPORTED_MODULE_0__interface__.info
      })
      __webpack_require__.d(__webpack_exports__, 'd', function() {
        return __WEBPACK_IMPORTED_MODULE_0__interface__.warn
      })
      __webpack_require__.d(__webpack_exports__, 'e', function() {
        return __WEBPACK_IMPORTED_MODULE_0__interface__.error
      })
      __webpack_require__.d(__webpack_exports__, 'f', function() {
        return __WEBPACK_IMPORTED_MODULE_0__interface__.flush
      })
    },
    function(module, __webpack_exports__, __webpack_require__) {
      'use strict'
      function needsBridgeForBrowser() {
        return (
          !!__webpack_require__
            .i(
              __WEBPACK_IMPORTED_MODULE_1_cross_domain_utils_src__.getUserAgent
            )(window)
            .match(/MSIE|trident|edge/i) ||
          !__WEBPACK_IMPORTED_MODULE_2__conf__.b.ALLOW_POSTMESSAGE_POPUP
        )
      }
      function needsBridgeForWin(win) {
        return (
          (!win ||
            !__webpack_require__.i(
              __WEBPACK_IMPORTED_MODULE_1_cross_domain_utils_src__.isSameTopWindow
            )(window, win)) &&
          (!win ||
            !__webpack_require__.i(
              __WEBPACK_IMPORTED_MODULE_1_cross_domain_utils_src__.isSameDomain
            )(win))
        )
      }
      function needsBridgeForDomain(domain) {
        return (
          !domain ||
          __webpack_require__.i(
            __WEBPACK_IMPORTED_MODULE_1_cross_domain_utils_src__.getDomain
          )() !==
            __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__lib__.t)(domain)
        )
      }
      function needsBridge(_ref) {
        var win = _ref.win, domain = _ref.domain
        return (
          needsBridgeForBrowser() &&
          needsBridgeForWin(win) &&
          needsBridgeForDomain(domain)
        )
      }
      function getBridgeName(domain) {
        domain =
          domain ||
          __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__lib__.t)(domain)
        var sanitizedDomain = domain.replace(/[^a-zA-Z0-9]+/g, '_')
        return (
          __WEBPACK_IMPORTED_MODULE_2__conf__.a.BRIDGE_NAME_PREFIX +
          '_' +
          sanitizedDomain
        )
      }
      function isBridge() {
        return (
          window.name &&
          window.name ===
            getBridgeName(
              __webpack_require__.i(
                __WEBPACK_IMPORTED_MODULE_1_cross_domain_utils_src__.getDomain
              )()
            )
        )
      }
      function registerRemoteWindow(win) {
        arguments.length > 1 && void 0 !== arguments[1]
          ? arguments[1]
          : __WEBPACK_IMPORTED_MODULE_2__conf__.b.BRIDGE_TIMEOUT
        __WEBPACK_IMPORTED_MODULE_4__global__.a.remoteWindows.set(win, {
          sendMessagePromise: new __WEBPACK_IMPORTED_MODULE_3__lib__.g.Promise()
        })
      }
      function findRemoteWindow(win) {
        return __WEBPACK_IMPORTED_MODULE_4__global__.a.remoteWindows.get(win)
      }
      function registerRemoteSendMessage(win, domain, sendMessage) {
        var remoteWindow = findRemoteWindow(win)
        if (!remoteWindow)
          throw new Error('Window not found to register sendMessage to')
        var sendMessageWrapper = function(remoteWin, message, remoteDomain) {
          if (remoteWin !== win)
            throw new Error('Remote window does not match window')
          if (
            !__webpack_require__.i(
              __WEBPACK_IMPORTED_MODULE_1_cross_domain_utils_src__.matchDomain
            )(remoteDomain, domain)
          )
            throw new Error(
              'Remote domain ' +
                remoteDomain +
                ' does not match domain ' +
                domain
            )
          sendMessage(message)
        }
        remoteWindow.sendMessagePromise.resolve(sendMessageWrapper)
        remoteWindow.sendMessagePromise = __WEBPACK_IMPORTED_MODULE_3__lib__.g.Promise.resolve(
          sendMessageWrapper
        )
      }
      function rejectRemoteSendMessage(win, err) {
        var remoteWindow = findRemoteWindow(win)
        if (!remoteWindow)
          throw new Error('Window not found on which to reject sendMessage')
        remoteWindow.sendMessagePromise.asyncReject(err)
      }
      function sendBridgeMessage(win, message, domain) {
        var messagingChild = __webpack_require__.i(
          __WEBPACK_IMPORTED_MODULE_1_cross_domain_utils_src__.isOpener
        )(window, win),
          messagingParent = __webpack_require__.i(
            __WEBPACK_IMPORTED_MODULE_1_cross_domain_utils_src__.isOpener
          )(win, window)
        if (!messagingChild && !messagingParent)
          throw new Error(
            'Can only send messages to and from parent and popup windows'
          )
        var remoteWindow = findRemoteWindow(win)
        if (!remoteWindow)
          throw new Error('Window not found to send message to')
        return remoteWindow.sendMessagePromise.then(function(sendMessage) {
          return sendMessage(win, message, domain)
        })
      }
      var __WEBPACK_IMPORTED_MODULE_0_cross_domain_safe_weakmap_src__ = __webpack_require__(
        6
      ),
        __WEBPACK_IMPORTED_MODULE_1_cross_domain_utils_src__ = __webpack_require__(
          0
        ),
        __WEBPACK_IMPORTED_MODULE_2__conf__ = (__webpack_require__.n(
          __WEBPACK_IMPORTED_MODULE_1_cross_domain_utils_src__
        ), __webpack_require__(1)),
        __WEBPACK_IMPORTED_MODULE_3__lib__ = __webpack_require__(3),
        __WEBPACK_IMPORTED_MODULE_4__global__ = __webpack_require__(5),
        __WEBPACK_IMPORTED_MODULE_5__drivers__ = __webpack_require__(8)
      __webpack_exports__.a = needsBridgeForBrowser
      __webpack_exports__.b = needsBridgeForWin
      __webpack_exports__.c = needsBridgeForDomain
      __webpack_exports__.d = needsBridge
      __webpack_exports__.e = getBridgeName
      __webpack_exports__.f = isBridge
      __webpack_require__.d(__webpack_exports__, 'g', function() {
        return documentBodyReady
      })
      __webpack_exports__.h = registerRemoteWindow
      __webpack_exports__.i = findRemoteWindow
      __webpack_exports__.j = registerRemoteSendMessage
      __webpack_exports__.k = rejectRemoteSendMessage
      __webpack_exports__.l = sendBridgeMessage
      var documentBodyReady = new __WEBPACK_IMPORTED_MODULE_3__lib__.g
        .Promise(function(resolve) {
        if (window.document && window.document.body)
          return resolve(window.document.body)
        var interval = setInterval(function() {
          if (window.document && window.document.body) {
            clearInterval(interval)
            return resolve(window.document.body)
          }
        }, 10)
      })
      __WEBPACK_IMPORTED_MODULE_4__global__.a.remoteWindows =
        __WEBPACK_IMPORTED_MODULE_4__global__.a.remoteWindows ||
        new __WEBPACK_IMPORTED_MODULE_0_cross_domain_safe_weakmap_src__.WeakMap()
      __WEBPACK_IMPORTED_MODULE_4__global__.a.receiveMessage = function(event) {
        return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_5__drivers__.g)(
          event
        )
      }
    },
    function(module, __webpack_exports__, __webpack_require__) {
      'use strict'
      Object.defineProperty(__webpack_exports__, '__esModule', {
        value: !0
      })
      var __WEBPACK_IMPORTED_MODULE_0__bridge__ = __webpack_require__(48)
      for (var __WEBPACK_IMPORT_KEY__ in __WEBPACK_IMPORTED_MODULE_0__bridge__) {
        __WEBPACK_IMPORT_KEY__ !== 'default' &&
          (function(key) {
            __webpack_require__.d(__webpack_exports__, key, function() {
              return __WEBPACK_IMPORTED_MODULE_0__bridge__[key]
            })
          })(__WEBPACK_IMPORT_KEY__)
      }
      var __WEBPACK_IMPORTED_MODULE_1__child__ = __webpack_require__(49)
      __webpack_require__.d(
        __webpack_exports__,
        'openTunnelToOpener',
        function() {
          return __WEBPACK_IMPORTED_MODULE_1__child__.a
        }
      )
      var __WEBPACK_IMPORTED_MODULE_2__common__ = __webpack_require__(21)
      __webpack_require__.d(
        __webpack_exports__,
        'needsBridgeForBrowser',
        function() {
          return __WEBPACK_IMPORTED_MODULE_2__common__.a
        }
      )
      __webpack_require__.d(
        __webpack_exports__,
        'needsBridgeForWin',
        function() {
          return __WEBPACK_IMPORTED_MODULE_2__common__.b
        }
      )
      __webpack_require__.d(
        __webpack_exports__,
        'needsBridgeForDomain',
        function() {
          return __WEBPACK_IMPORTED_MODULE_2__common__.c
        }
      )
      __webpack_require__.d(__webpack_exports__, 'needsBridge', function() {
        return __WEBPACK_IMPORTED_MODULE_2__common__.d
      })
      __webpack_require__.d(__webpack_exports__, 'getBridgeName', function() {
        return __WEBPACK_IMPORTED_MODULE_2__common__.e
      })
      __webpack_require__.d(__webpack_exports__, 'isBridge', function() {
        return __WEBPACK_IMPORTED_MODULE_2__common__.f
      })
      __webpack_require__.d(
        __webpack_exports__,
        'documentBodyReady',
        function() {
          return __WEBPACK_IMPORTED_MODULE_2__common__.g
        }
      )
      __webpack_require__.d(
        __webpack_exports__,
        'registerRemoteWindow',
        function() {
          return __WEBPACK_IMPORTED_MODULE_2__common__.h
        }
      )
      __webpack_require__.d(
        __webpack_exports__,
        'findRemoteWindow',
        function() {
          return __WEBPACK_IMPORTED_MODULE_2__common__.i
        }
      )
      __webpack_require__.d(
        __webpack_exports__,
        'registerRemoteSendMessage',
        function() {
          return __WEBPACK_IMPORTED_MODULE_2__common__.j
        }
      )
      __webpack_require__.d(
        __webpack_exports__,
        'rejectRemoteSendMessage',
        function() {
          return __WEBPACK_IMPORTED_MODULE_2__common__.k
        }
      )
      __webpack_require__.d(
        __webpack_exports__,
        'sendBridgeMessage',
        function() {
          return __WEBPACK_IMPORTED_MODULE_2__common__.l
        }
      )
      var __WEBPACK_IMPORTED_MODULE_3__parent__ = __webpack_require__(51)
      __webpack_require__.d(__webpack_exports__, 'openBridge', function() {
        return __WEBPACK_IMPORTED_MODULE_3__parent__.a
      })
      __webpack_require__.d(__webpack_exports__, 'linkUrl', function() {
        return __WEBPACK_IMPORTED_MODULE_3__parent__.b
      })
    },
    function(module, __webpack_exports__, __webpack_require__) {
      'use strict'
      var __WEBPACK_IMPORTED_MODULE_0__util__ = __webpack_require__(12),
        __WEBPACK_IMPORTED_MODULE_1__conf__ = __webpack_require__(1)
      __webpack_require__.d(__webpack_exports__, 'a', function() {
        return log
      })
      var _typeof = typeof Symbol === 'function' &&
        typeof Symbol.iterator === 'symbol'
        ? function(obj) {
            return typeof obj
          }
        : function(obj) {
            return obj &&
              typeof Symbol === 'function' &&
              obj.constructor === Symbol &&
              obj !== Symbol.prototype
              ? 'symbol'
              : typeof obj
          },
        LOG_LEVELS = ['debug', 'info', 'warn', 'error']
      Function.prototype.bind &&
        window.console &&
        _typeof(console.log) === 'object' &&
        ['log', 'info', 'warn', 'error'].forEach(function(method) {
          console[method] = this.bind(console[method], console)
        }, Function.prototype.call)
      var log = {
        clearLogs: function() {
          window.console && window.console.clear && window.console.clear()
          if (__WEBPACK_IMPORTED_MODULE_1__conf__.b.LOG_TO_PAGE) {
            var container = document.getElementById('postRobotLogs')
            container && container.parentNode.removeChild(container)
          }
        },
        writeToPage: function(level, args) {
          setTimeout(function() {
            var container = document.getElementById('postRobotLogs')
            if (!container) {
              container = document.createElement('div')
              container.id = 'postRobotLogs'
              container.style.cssText =
                'width: 800px; font-family: monospace; white-space: pre-wrap;'
              document.body.appendChild(container)
            }
            var el = document.createElement('div'),
              date = new Date().toString().split(' ')[4],
              payload = __webpack_require__
                .i(__WEBPACK_IMPORTED_MODULE_0__util__.a)(args, function(item) {
                  if (typeof item === 'string') return item
                  if (!item) return Object.prototype.toString.call(item)
                  var json = void 0
                  try {
                    json = __webpack_require__.i(
                      __WEBPACK_IMPORTED_MODULE_0__util__.b
                    )(item, 0, 2)
                  } catch (e) {
                    json = '[object]'
                  }
                  return '\n\n' + json + '\n\n'
                })
                .join(' '),
              msg = date + ' ' + level + ' ' + payload
            el.innerHTML = msg
            var color = {
              log: '#ddd',
              warn: 'orange',
              error: 'red',
              info: 'blue',
              debug: '#aaa'
            }[level]
            el.style.cssText = 'margin-top: 10px; color: ' + color + ';'
            container.childNodes.length
              ? container.insertBefore(el, container.childNodes[0])
              : container.appendChild(el)
          })
        },
        logLevel: function(level, args) {
          setTimeout(function() {
            try {
              var logLevel =
                window.LOG_LEVEL ||
                __WEBPACK_IMPORTED_MODULE_1__conf__.b.LOG_LEVEL
              if (LOG_LEVELS.indexOf(level) < LOG_LEVELS.indexOf(logLevel))
                return
              args = Array.prototype.slice.call(args)
              args.unshift('' + window.location.host + window.location.pathname)
              args.unshift('::')
              args.unshift(
                '' +
                  __webpack_require__
                    .i(__WEBPACK_IMPORTED_MODULE_0__util__.c)()
                    .toLowerCase()
              )
              args.unshift('[post-robot]')
              __WEBPACK_IMPORTED_MODULE_1__conf__.b.LOG_TO_PAGE &&
                log.writeToPage(level, args)
              if (!window.console) return
              window.console[level] || (level = 'log')
              if (!window.console[level]) return
              window.console[level].apply(window.console, args)
            } catch (err) {}
          }, 1)
        },
        debug: function() {
          log.logLevel('debug', arguments)
        },
        info: function() {
          log.logLevel('info', arguments)
        },
        warn: function() {
          log.logLevel('warn', arguments)
        },
        error: function() {
          log.logLevel('error', arguments)
        }
      }
    },
    function(module, __webpack_exports__, __webpack_require__) {
      'use strict'
      function _defineProperty(obj, key, value) {
        key in obj
          ? Object.defineProperty(obj, key, {
              value: value,
              enumerable: !0,
              configurable: !0,
              writable: !0
            })
          : (obj[key] = value)
        return obj
      }
      function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor))
          throw new TypeError('Cannot call a class as a function')
      }
      function _possibleConstructorReturn(self, call) {
        if (!self)
          throw new ReferenceError(
            "this hasn't been initialised - super() hasn't been called"
          )
        return !call || (typeof call !== 'object' && typeof call !== 'function')
          ? self
          : call
      }
      function _inherits(subClass, superClass) {
        if (typeof superClass !== 'function' && superClass !== null)
          throw new TypeError(
            'Super expression must either be null or a function, not ' +
              typeof superClass
          )
        subClass.prototype = Object.create(superClass && superClass.prototype, {
          constructor: {
            value: subClass,
            enumerable: !1,
            writable: !0,
            configurable: !0
          }
        })
        superClass &&
          (Object.setPrototypeOf
            ? Object.setPrototypeOf(subClass, superClass)
            : (subClass.__proto__ = superClass))
      }
      function _applyDecoratedDescriptor(
        target,
        property,
        decorators,
        descriptor,
        context
      ) {
        var desc = {}
        Object.keys(descriptor).forEach(function(key) {
          desc[key] = descriptor[key]
        })
        desc.enumerable = !!desc.enumerable
        desc.configurable = !!desc.configurable
        ;('value' in desc || desc.initializer) && (desc.writable = !0)
        desc = decorators.slice().reverse().reduce(function(desc, decorator) {
          return decorator(target, property, desc) || desc
        }, desc)
        if (context && void 0 !== desc.initializer) {
          desc.value = desc.initializer
            ? desc.initializer.call(context)
            : void 0
          desc.initializer = void 0
        }
        if (void 0 === desc.initializer) {
          Object.defineProperty(target, property, desc)
          desc = null
        }
        return desc
      }
      function destroyAll() {
        for (var results = []; activeComponents.length; )
          results.push(activeComponents[0].destroy())
        return __WEBPACK_IMPORTED_MODULE_3_sync_browser_mocks_src_promise__.a.all(
          results
        )
      }
      var __WEBPACK_IMPORTED_MODULE_0_beaver_logger_client__ = __webpack_require__(
        20
      ),
        __WEBPACK_IMPORTED_MODULE_1_post_robot_src__ = __webpack_require__(9),
        __WEBPACK_IMPORTED_MODULE_2_cross_domain_utils_src__ = __webpack_require__(
          0
        ),
        __WEBPACK_IMPORTED_MODULE_3_sync_browser_mocks_src_promise__ = (__webpack_require__.n(
          __WEBPACK_IMPORTED_MODULE_2_cross_domain_utils_src__
        ), __webpack_require__(4)),
        __WEBPACK_IMPORTED_MODULE_4__base__ = __webpack_require__(16),
        __WEBPACK_IMPORTED_MODULE_5__window__ = __webpack_require__(17),
        __WEBPACK_IMPORTED_MODULE_6__lib__ = __webpack_require__(2),
        __WEBPACK_IMPORTED_MODULE_7__constants__ = __webpack_require__(7),
        __WEBPACK_IMPORTED_MODULE_8__drivers__ = __webpack_require__(37),
        __WEBPACK_IMPORTED_MODULE_9__validate__ = __webpack_require__(39),
        __WEBPACK_IMPORTED_MODULE_10__props__ = __webpack_require__(38),
        __WEBPACK_IMPORTED_MODULE_11__error__ = __webpack_require__(18)
      __webpack_require__.d(__webpack_exports__, 'b', function() {
        return ParentComponent
      })
      __webpack_exports__.a = destroyAll
      var _class,
        _extends =
          Object.assign ||
          function(target) {
            for (var i = 1; i < arguments.length; i++) {
              var source = arguments[i]
              for (var key in source)
                Object.prototype.hasOwnProperty.call(source, key) &&
                  (target[key] = source[key])
            }
            return target
          },
        _typeof = typeof Symbol === 'function' &&
          typeof Symbol.iterator === 'symbol'
          ? function(obj) {
              return typeof obj
            }
          : function(obj) {
              return obj &&
                typeof Symbol === 'function' &&
                obj.constructor === Symbol &&
                obj !== Symbol.prototype
                ? 'symbol'
                : typeof obj
            },
        _slicedToArray = (function() {
          function sliceIterator(arr, i) {
            var _arr = [], _n = !0, _d = !1, _e = void 0
            try {
              for (
                var _s, _i = arr[Symbol.iterator]();
                !(_n = (_s = _i.next()).done);
                _n = !0
              ) {
                _arr.push(_s.value)
                if (i && _arr.length === i) break
              }
            } catch (err) {
              _d = !0
              _e = err
            } finally {
              try {
                !_n && _i.return && _i.return()
              } finally {
                if (_d) throw _e
              }
            }
            return _arr
          }
          return function(arr, i) {
            if (Array.isArray(arr)) return arr
            if (Symbol.iterator in Object(arr)) return sliceIterator(arr, i)
            throw new TypeError(
              'Invalid attempt to destructure non-iterable instance'
            )
          }
        })(),
        _createClass = (function() {
          function defineProperties(target, props) {
            for (var i = 0; i < props.length; i++) {
              var descriptor = props[i]
              descriptor.enumerable = descriptor.enumerable || !1
              descriptor.configurable = !0
              'value' in descriptor && (descriptor.writable = !0)
              Object.defineProperty(target, descriptor.key, descriptor)
            }
          }
          return function(Constructor, protoProps, staticProps) {
            protoProps && defineProperties(Constructor.prototype, protoProps)
            staticProps && defineProperties(Constructor, staticProps)
            return Constructor
          }
        })(),
        activeComponents = []
      __WEBPACK_IMPORTED_MODULE_6__lib__.t.props = __WEBPACK_IMPORTED_MODULE_6__lib__
        .t.props || {}
      __WEBPACK_IMPORTED_MODULE_6__lib__.t.windows = __WEBPACK_IMPORTED_MODULE_6__lib__
        .t.windows || {}
      var ParentComponent = ((_class = (function(_BaseComponent) {
        function ParentComponent(component, context) {
          var options = arguments.length > 2 && void 0 !== arguments[2]
            ? arguments[2]
            : {}
          _classCallCheck(this, ParentComponent)
          var _this = _possibleConstructorReturn(
            this,
            (ParentComponent.__proto__ ||
              Object.getPrototypeOf(ParentComponent))
              .call(this, component, options)
          )
          __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_9__validate__.a)(
            component,
            options
          )
          _this.component = component
          _this.context = context
          _this.setProps(options.props || {})
          __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_6__lib__.c)(
            _this.props.logLevel
          )
          _this.childWindowName = _this.buildChildWindowName({
            renderTo: window
          })
          _this.registerActiveComponent()
          _this.component.log('construct_parent')
          _this.onInit = new __WEBPACK_IMPORTED_MODULE_3_sync_browser_mocks_src_promise__.a()
          _this.clean.register(function() {
            _this.onInit = new __WEBPACK_IMPORTED_MODULE_3_sync_browser_mocks_src_promise__.a()
          })
          _this.onInit.catch(function(err) {
            return _this.error(err)
          })
          return _this
        }
        _inherits(ParentComponent, _BaseComponent)
        _createClass(ParentComponent, [
          {
            key: 'render',
            value: function(element) {
              var _this2 = this,
                loadUrl =
                  !(arguments.length > 1 && void 0 !== arguments[1]) ||
                  arguments[1]
              return this.tryInit(function() {
                _this2.component.log('render_' + _this2.context, {
                  context: _this2.context,
                  element: element,
                  loadUrl: loadUrl
                })
                var tasks = {
                  onRender: _this2.props.onRender(),
                  getDomain: _this2.getDomain()
                }
                tasks.validateRenderAllowed = tasks.getDomain.then(function(
                  domain
                ) {
                  if (
                    !__webpack_require__.i(
                      __WEBPACK_IMPORTED_MODULE_2_cross_domain_utils_src__.matchDomain
                    )(_this2.component.allowedParentDomains, domain)
                  ) {
                    var error = new __WEBPACK_IMPORTED_MODULE_11__error__.c(
                      'Can not be rendered by domain: ' + domain
                    )
                    _this2.error(error)
                    return __WEBPACK_IMPORTED_MODULE_3_sync_browser_mocks_src_promise__.a.reject(
                      error
                    )
                  }
                })
                tasks.elementReady = __WEBPACK_IMPORTED_MODULE_3_sync_browser_mocks_src_promise__.a.try(
                  function() {
                    if (element) return _this2.elementReady(element)
                  }
                )
                tasks.openContainer = tasks.elementReady.then(function() {
                  return _this2.openContainer(element)
                })
                tasks.open = tasks.validateRenderAllowed.then(function() {
                  return _this2.driver.openOnClick
                    ? _this2.open(element, _this2.context)
                    : tasks.openContainer.then(function() {
                        return _this2.open(element, _this2.context)
                      })
                })
                tasks.openBridge = tasks.open.then(function() {
                  return _this2.openBridge(_this2.context)
                })
                tasks.showContainer = tasks.openContainer.then(function() {
                  return _this2.showContainer()
                })
                tasks.createComponentTemplate = tasks.open.then(function() {
                  return _this2.createComponentTemplate()
                })
                tasks.showComponent = tasks.createComponentTemplate.then(
                  function() {
                    return _this2.showComponent()
                  }
                )
                tasks.linkDomain = __WEBPACK_IMPORTED_MODULE_3_sync_browser_mocks_src_promise__.a
                  .all([tasks.getDomain, tasks.open])
                  .then(function(_ref) {
                    var _ref2 = _slicedToArray(_ref, 1), domain = _ref2[0]
                    if (__WEBPACK_IMPORTED_MODULE_1_post_robot_src__.d)
                      return __WEBPACK_IMPORTED_MODULE_1_post_robot_src__.d.linkUrl(
                        _this2.window,
                        domain
                      )
                  })
                tasks.listen = __WEBPACK_IMPORTED_MODULE_3_sync_browser_mocks_src_promise__.a
                  .all([tasks.getDomain, tasks.open])
                  .then(function(_ref3) {
                    var _ref4 = _slicedToArray(_ref3, 1), domain = _ref4[0]
                    _this2.listen(_this2.window, domain)
                  })
                tasks.watchForClose = tasks.open.then(function() {
                  return _this2.watchForClose()
                })
                if (loadUrl) {
                  tasks.buildUrl = _this2.buildUrl()
                  tasks.loadUrl = __WEBPACK_IMPORTED_MODULE_3_sync_browser_mocks_src_promise__.a
                    .all([
                      tasks.buildUrl,
                      tasks.linkDomain,
                      tasks.listen,
                      tasks.openBridge,
                      tasks.createComponentTemplate
                    ])
                    .then(function(_ref5) {
                      var _ref6 = _slicedToArray(_ref5, 1), url = _ref6[0]
                      return _this2.loadUrl(url)
                    })
                  tasks.runTimeout = tasks.loadUrl.then(function() {
                    return _this2.runTimeout()
                  })
                }
                return __WEBPACK_IMPORTED_MODULE_3_sync_browser_mocks_src_promise__.a.hash(
                  tasks
                )
              }).then(function() {
                return _this2.props.onEnter()
              })
            }
          },
          {
            key: 'renderTo',
            value: function(win, element) {
              var _this3 = this
              return this.tryInit(function() {
                if (win === window) return _this3.render(element)
                if (element && typeof element !== 'string')
                  throw new Error(
                    'Element passed to renderTo must be a string selector, got ' +
                      (void 0 === element ? 'undefined' : _typeof(element)) +
                      ' ' +
                      element
                  )
                _this3.checkAllowRenderTo(win)
                _this3.component.log('render_' + _this3.context + '_to_win', {
                  element: element,
                  context: _this3.context
                })
                _this3.childWindowName = _this3.buildChildWindowName({
                  renderTo: win
                })
                _this3.delegate(win, _this3.context)
                return _this3.render(element, _this3.context)
              })
            }
          },
          {
            key: 'checkAllowRenderTo',
            value: function(win) {
              if (!win)
                throw this.component.error('Must pass window to renderTo')
              if (
                !__webpack_require__.i(
                  __WEBPACK_IMPORTED_MODULE_2_cross_domain_utils_src__.isSameDomain
                )(win)
              ) {
                var origin = __webpack_require__.i(
                  __WEBPACK_IMPORTED_MODULE_6__lib__.d
                )(),
                  domain = this.component.getDomain(null, this.props)
                if (!domain)
                  throw new Error(
                    'Could not determine domain to allow remote render'
                  )
                if (domain !== origin)
                  throw new Error(
                    'Can not render remotely to ' +
                      domain +
                      ' - can only render to ' +
                      origin
                  )
              }
            }
          },
          {
            key: 'registerActiveComponent',
            value: function() {
              var _this4 = this
              activeComponents.push(this)
              this.clean.register(function() {
                activeComponents.splice(activeComponents.indexOf(_this4), 1)
              })
            }
          },
          {
            key: 'renderedIntoSandboxFrame',
            value: function() {
              return (
                !!this.driver.renderedIntoContainerTemplate &&
                (!!this.component.sandboxContainer &&
                  !!this.component.containerTemplate)
              )
            }
          },
          {
            key: 'buildChildWindowName',
            value: function() {
              var _ref7 = arguments.length > 0 && void 0 !== arguments[0]
                ? arguments[0]
                : {},
                _ref7$renderTo = _ref7.renderTo,
                renderTo = void 0 === _ref7$renderTo ? window : _ref7$renderTo,
                sameWindow = renderTo === window,
                sameDomain = __webpack_require__.i(
                  __WEBPACK_IMPORTED_MODULE_2_cross_domain_utils_src__.isSameDomain
                )(renderTo),
                uid = __webpack_require__.i(
                  __WEBPACK_IMPORTED_MODULE_6__lib__.r
                )(),
                tag = this.component.tag,
                sProps = __webpack_require__.i(
                  __WEBPACK_IMPORTED_MODULE_6__lib__.u
                )(this.getPropsForChild()),
                defaultParent = this.renderedIntoSandboxFrame()
                  ? __WEBPACK_IMPORTED_MODULE_7__constants__.WINDOW_REFERENCES
                      .PARENT_PARENT
                  : __WEBPACK_IMPORTED_MODULE_7__constants__.WINDOW_REFERENCES
                      .DIRECT_PARENT,
                parent = sameWindow ? defaultParent : window.name,
                renderParent = sameWindow
                  ? defaultParent
                  : __WEBPACK_IMPORTED_MODULE_7__constants__.WINDOW_REFERENCES
                      .PARENT_UID,
                secureProps = !sameDomain,
                props = secureProps
                  ? {
                      type: __WEBPACK_IMPORTED_MODULE_7__constants__
                        .INITIAL_PROPS.UID
                    }
                  : {
                      type: __WEBPACK_IMPORTED_MODULE_7__constants__
                        .INITIAL_PROPS.RAW,
                      value: sProps
                    }
              props.type ===
                __WEBPACK_IMPORTED_MODULE_7__constants__.INITIAL_PROPS.UID &&
                (__WEBPACK_IMPORTED_MODULE_6__lib__.t.props[uid] = sProps)
              renderParent ===
                __WEBPACK_IMPORTED_MODULE_7__constants__.WINDOW_REFERENCES
                  .PARENT_UID &&
                (__WEBPACK_IMPORTED_MODULE_6__lib__.t.windows[uid] = renderTo)
              return __webpack_require__.i(
                __WEBPACK_IMPORTED_MODULE_5__window__.e
              )(this.component.name, this.component.version, {
                uid: uid,
                tag: tag,
                parent: parent,
                renderParent: renderParent,
                props: props
              })
            }
          },
          {
            key: 'sendToParent',
            value: function(name, data) {
              if (
                !__webpack_require__.i(
                  __WEBPACK_IMPORTED_MODULE_5__window__.b
                )()
              )
                throw new Error(
                  'Can not find parent component window to message'
                )
              this.component.log('send_to_parent_' + name)
              return __webpack_require__.i(
                __WEBPACK_IMPORTED_MODULE_1_post_robot_src__.b
              )(
                __webpack_require__.i(
                  __WEBPACK_IMPORTED_MODULE_5__window__.b
                )(),
                name,
                data,
                {
                  domain: __webpack_require__.i(
                    __WEBPACK_IMPORTED_MODULE_5__window__.a
                  )()
                }
              )
            }
          },
          {
            key: 'setProps',
            value: function() {
              var props = arguments.length > 0 && void 0 !== arguments[0]
                ? arguments[0]
                : {},
                required =
                  !(arguments.length > 1 && void 0 !== arguments[1]) ||
                  arguments[1]
              this.props = this.props || {}
              props.version = this.component.version
              __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_9__validate__.b)(
                this.component,
                props,
                required
              )
              __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_6__lib__.h)(
                this.props,
                __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_10__props__.a)(
                  this.component,
                  this,
                  props
                )
              )
            }
          },
          {
            key: 'buildUrl',
            value: function() {
              var _this5 = this
              return __WEBPACK_IMPORTED_MODULE_3_sync_browser_mocks_src_promise__.a
                .hash({
                  url: this.props.url,
                  query: __webpack_require__.i(
                    __WEBPACK_IMPORTED_MODULE_10__props__.b
                  )(this.component.props, this.props)
                })
                .then(function(_ref8) {
                  var url = _ref8.url, query = _ref8.query
                  return url && !_this5.component.getValidDomain(url)
                    ? url
                    : __WEBPACK_IMPORTED_MODULE_3_sync_browser_mocks_src_promise__.a
                        .try(function() {
                          return (
                            url ||
                            _this5.component.getUrl(
                              _this5.props.env,
                              _this5.props
                            )
                          )
                        })
                        .then(function(finalUrl) {
                          query[
                            __WEBPACK_IMPORTED_MODULE_7__constants__.XCOMPONENT
                          ] =
                            '1'
                          return __webpack_require__.i(
                            __WEBPACK_IMPORTED_MODULE_6__lib__.v
                          )(finalUrl, {
                            query: query
                          })
                        })
                })
            }
          },
          {
            key: 'getDomain',
            value: function() {
              var _this6 = this
              return __WEBPACK_IMPORTED_MODULE_3_sync_browser_mocks_src_promise__.a
                .try(function() {
                  return _this6.props.url
                })
                .then(function(url) {
                  var domain = _this6.component.getDomain(url, _this6.props)
                  return (
                    domain ||
                    (_this6.component.buildUrl
                      ? __WEBPACK_IMPORTED_MODULE_3_sync_browser_mocks_src_promise__.a
                          .try(function() {
                            return _this6.component.buildUrl(_this6.props)
                          })
                          .then(function(builtUrl) {
                            return _this6.component.getDomain(
                              builtUrl,
                              _this6.props
                            )
                          })
                      : void 0)
                  )
                })
                .then(function(domain) {
                  if (!domain) throw new Error('Could not determine domain')
                  return domain
                })
            }
          },
          {
            key: 'getPropsForChild',
            value: function() {
              for (
                var result = {},
                  _iterator = Object.keys(this.props),
                  _isArray = Array.isArray(_iterator),
                  _i = 0,
                  _iterator = _isArray
                    ? _iterator
                    : _iterator[Symbol.iterator]();
                ;

              ) {
                var _ref9
                if (_isArray) {
                  if (_i >= _iterator.length) break
                  _ref9 = _iterator[_i++]
                } else {
                  _i = _iterator.next()
                  if (_i.done) break
                  _ref9 = _i.value
                }
                var key = _ref9, prop = this.component.props[key]
                ;(prop && prop.sendToChild === !1) ||
                  (result[key] = this.props[key])
              }
              return result
            }
          },
          {
            key: 'updateProps',
            value: function() {
              var _this7 = this,
                props = arguments.length > 0 && void 0 !== arguments[0]
                  ? arguments[0]
                  : {}
              this.setProps(props, !1)
              return this.onInit.then(function() {
                return _this7.childExports.updateProps(
                  _this7.getPropsForChild()
                )
              })
            }
          },
          {
            key: 'openBridge',
            value: function() {
              if (__WEBPACK_IMPORTED_MODULE_1_post_robot_src__.d) {
                var bridgeUrl = this.component.getBridgeUrl(this.props.env)
                if (bridgeUrl) {
                  var bridgeDomain = this.component.getBridgeDomain(
                    this.props.env
                  )
                  if (!bridgeDomain)
                    throw new Error('Can not determine domain for bridge')
                  return __WEBPACK_IMPORTED_MODULE_1_post_robot_src__.d.needsBridge(
                    {
                      win: this.window,
                      domain: bridgeDomain
                    }
                  )
                    ? __WEBPACK_IMPORTED_MODULE_1_post_robot_src__.d.openBridge(
                        bridgeUrl,
                        bridgeDomain
                      )
                    : void 0
                }
              }
            }
          },
          {
            key: 'open',
            value: function(element) {
              this.component.log('open_' + this.context, {
                element: __webpack_require__.i(
                  __WEBPACK_IMPORTED_MODULE_6__lib__.w
                )(element),
                windowName: this.childWindowName
              })
              this.driver.open.call(this, element)
            }
          },
          {
            key: 'elementReady',
            value: function(element) {
              return __webpack_require__
                .i(__WEBPACK_IMPORTED_MODULE_6__lib__.x)(element)
                .then(__WEBPACK_IMPORTED_MODULE_6__lib__.y)
            }
          },
          {
            key: 'delegate',
            value: function(win) {
              var _this8 = this
              this.component.log('delegate_' + this.context)
              var delegate = __webpack_require__
                .i(
                  __WEBPACK_IMPORTED_MODULE_1_post_robot_src__.b
                )(
                  win,
                  __WEBPACK_IMPORTED_MODULE_7__constants__.POST_MESSAGE
                    .DELEGATE +
                    '_' +
                    this.component.name,
                  {
                    context: this.context,
                    env: this.props.env,
                    options: {
                      context: this.context,
                      childWindowName: this.childWindowName,
                      props: {
                        uid: this.props.uid,
                        dimensions: this.props.dimensions,
                        onClose: this.props.onClose,
                        onDisplay: this.props.onDisplay
                      },
                      overrides: {
                        focus: function() {
                          return _this8.focus()
                        },
                        userClose: function() {
                          return _this8.userClose()
                        },
                        getDomain: function() {
                          return _this8.getDomain()
                        },
                        getContainerTemplate: function() {
                          return _this8.getContainerTemplate()
                        },
                        getComponentTemplate: function() {
                          return _this8.getComponentTemplate()
                        }
                      }
                    }
                  }
                )
                .then(function(_ref10) {
                  var data = _ref10.data
                  _this8.clean.register(data.destroy)
                  return data
                })
                .catch(function(err) {
                  throw new Error(
                    'Unable to delegate rendering. Possibly the component is not loaded in the target window.\n\n' +
                      err.stack
                  )
                }),
                overrides = this.driver.delegateOverrides
              _loop2: for (
                var _iterator2 = Object.keys(overrides),
                  _isArray2 = Array.isArray(_iterator2),
                  _i2 = 0,
                  _iterator2 = _isArray2
                    ? _iterator2
                    : _iterator2[Symbol.iterator]();
                ;

              ) {
                var _ref11,
                  _ret = (function() {
                    if (_isArray2) {
                      if (_i2 >= _iterator2.length) return 'break'
                      _ref11 = _iterator2[_i2++]
                    } else {
                      _i2 = _iterator2.next()
                      if (_i2.done) return 'break'
                      _ref11 = _i2.value
                    }
                    var key = _ref11, val = overrides[key]
                    if (
                      val ===
                      __WEBPACK_IMPORTED_MODULE_7__constants__.DELEGATE
                        .CALL_ORIGINAL
                    )
                      return 'continue'
                    var original = _this8[key]
                    _this8[key] = function() {
                      var _this9 = this, _arguments = arguments
                      return delegate.then(function(data) {
                        var override = data.overrides[key]
                        if (
                          val ===
                          __WEBPACK_IMPORTED_MODULE_7__constants__.DELEGATE
                            .CALL_DELEGATE
                        )
                          return override.apply(_this9, _arguments)
                        if (val instanceof Function)
                          return val(original, override).apply(
                            _this9,
                            _arguments
                          )
                        throw new Error(
                          'Expected delgate to be CALL_ORIGINAL, CALL_DELEGATE, or factory method'
                        )
                      })
                    }
                  })()
                switch (_ret) {
                  case 'break':
                    break _loop2

                  case 'continue':
                    continue
                }
              }
            }
          },
          {
            key: 'getInitialDimensions',
            value: function(el) {
              return this.component.getInitialDimensions
                ? this.component.getInitialDimensions(this.props, el)
                : this.component.dimensions ? this.component.dimensions : {}
            }
          },
          {
            key: 'watchForClose',
            value: function() {
              var _this10 = this,
                closeWindowListener = __webpack_require__.i(
                  __WEBPACK_IMPORTED_MODULE_6__lib__.i
                )(this.window, function() {
                  _this10.component.log('detect_close_child')
                  _this10.driver.errorOnCloseDuringInit &&
                    _this10.onInit.reject(
                      new Error('Detected close during init')
                    )
                  return __WEBPACK_IMPORTED_MODULE_3_sync_browser_mocks_src_promise__.a
                    .try(function() {
                      return _this10.props.onClose(
                        __WEBPACK_IMPORTED_MODULE_7__constants__.CLOSE_REASONS
                          .CLOSE_DETECTED
                      )
                    })
                    .finally(function() {
                      return _this10.destroy()
                    })
                })
              this.clean.register(
                'destroyCloseWindowListener',
                closeWindowListener.cancel
              )
              var onunload = __webpack_require__.i(
                __WEBPACK_IMPORTED_MODULE_6__lib__.q
              )(function() {
                _this10.component.log('navigate_away')
                __WEBPACK_IMPORTED_MODULE_0_beaver_logger_client__.f()
                closeWindowListener.cancel()
                _this10.destroyComponent()
              }),
                unloadWindowListener = __webpack_require__.i(
                  __WEBPACK_IMPORTED_MODULE_6__lib__.z
                )(window, 'unload', onunload)
              this.clean.register(
                'destroyUnloadWindowListener',
                unloadWindowListener.cancel
              )
            }
          },
          {
            key: 'loadUrl',
            value: function(url) {
              this.component.log('load_url')
              window.location.href.split('#')[0] === url.split('#')[0] &&
                (url = __webpack_require__.i(
                  __WEBPACK_IMPORTED_MODULE_6__lib__.v
                )(url, {
                  query: _defineProperty(
                    {},
                    __webpack_require__.i(
                      __WEBPACK_IMPORTED_MODULE_6__lib__.r
                    )(),
                    '1'
                  )
                }))
              return this.driver.loadUrl.call(this, url)
            }
          },
          {
            key: 'hijack',
            value: function(targetElement) {
              targetElement.target = this.childWindowName
            }
          },
          {
            key: 'runTimeout',
            value: function() {
              var _this11 = this
              if (this.props.timeout) {
                this.timeout = setTimeout(function() {
                  _this11.component.log('timed_out', {
                    timeout: _this11.props.timeout
                  })
                  var error = _this11.component.error(
                    'Loading component timed out after ' +
                      _this11.props.timeout +
                      ' milliseconds'
                  )
                  _this11.onInit.reject(error)
                  _this11.props.onTimeout(error)
                }, this.props.timeout)
                this.clean.register(function() {
                  clearTimeout(_this11.timeout)
                  delete _this11.timeout
                })
              }
            }
          },
          {
            key: 'listeners',
            value: function() {
              var _ref12
              return (_ref12 = {
              }), _defineProperty(
                _ref12,
                __WEBPACK_IMPORTED_MODULE_7__constants__.POST_MESSAGE.INIT,
                function(source, data) {
                  this.childExports = data.exports
                  this.onInit.resolve(this)
                  this.timeout && clearTimeout(this.timeout)
                  return {
                    props: this.getPropsForChild(),
                    context: this.context
                  }
                }
              ), _defineProperty(
                _ref12,
                __WEBPACK_IMPORTED_MODULE_7__constants__.POST_MESSAGE.CLOSE,
                function(source, data) {
                  this.close(data.reason)
                }
              ), _defineProperty(
                _ref12,
                __WEBPACK_IMPORTED_MODULE_7__constants__.POST_MESSAGE.RESIZE,
                function(source, data) {
                  if (this.driver.allowResize)
                    return this.resize(data.width, data.height)
                }
              ), _defineProperty(
                _ref12,
                __WEBPACK_IMPORTED_MODULE_7__constants__.POST_MESSAGE.HIDE,
                function(source, data) {
                  this.hide()
                }
              ), _defineProperty(
                _ref12,
                __WEBPACK_IMPORTED_MODULE_7__constants__.POST_MESSAGE.SHOW,
                function(source, data) {
                  this.show()
                }
              ), _defineProperty(
                _ref12,
                __WEBPACK_IMPORTED_MODULE_7__constants__.POST_MESSAGE.ERROR,
                function(source, data) {
                  this.error(new Error(data.error))
                }
              ), _ref12
            }
          },
          {
            key: 'resize',
            value: function(width, height) {
              var _ref13 = arguments.length > 2 && void 0 !== arguments[2]
                ? arguments[2]
                : {},
                _ref13$waitForTransit = _ref13.waitForTransition,
                waitForTransition =
                  void 0 === _ref13$waitForTransit || _ref13$waitForTransit
              this.component.log('resize', {
                height: height,
                width: width
              })
              this.driver.resize.call(this, width, height)
              if (waitForTransition && (this.element || this.iframe)) {
                var overflow = void 0
                this.element &&
                  (overflow = __webpack_require__.i(
                    __WEBPACK_IMPORTED_MODULE_6__lib__.A
                  )(this.element, 'hidden'))
                return __webpack_require__
                  .i(__WEBPACK_IMPORTED_MODULE_6__lib__.B)(
                    this.element || this.iframe
                  )
                  .then(function() {
                    overflow && overflow.reset()
                  })
              }
            }
          },
          {
            key: 'hide',
            value: function() {
              this.container &&
                __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_6__lib__.C)(
                  this.container
                )
              this.containerFrame &&
                __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_6__lib__.C)(
                  this.containerFrame
                )
              return this.driver.hide.call(this)
            }
          },
          {
            key: 'show',
            value: function() {
              this.container &&
                __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_6__lib__.D)(
                  this.container
                )
              this.containerFrame &&
                __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_6__lib__.D)(
                  this.containerFrame
                )
              return this.driver.show.call(this)
            }
          },
          {
            key: 'userClose',
            value: function() {
              return this.close(
                __WEBPACK_IMPORTED_MODULE_7__constants__.CLOSE_REASONS
                  .USER_CLOSED
              )
            }
          },
          {
            key: 'close',
            value: function() {
              var _this12 = this,
                reason = arguments.length > 0 && void 0 !== arguments[0]
                  ? arguments[0]
                  : __WEBPACK_IMPORTED_MODULE_7__constants__.CLOSE_REASONS
                      .PARENT_CALL
              return __WEBPACK_IMPORTED_MODULE_3_sync_browser_mocks_src_promise__.a
                .try(function() {
                  _this12.component.log('close', {
                    reason: reason
                  })
                  return _this12.props.onClose(reason)
                })
                .then(function() {
                  return __WEBPACK_IMPORTED_MODULE_3_sync_browser_mocks_src_promise__.a.all(
                    [_this12.closeComponent(), _this12.closeContainer()]
                  )
                })
                .then(function() {
                  return _this12.destroy()
                })
            }
          },
          {
            key: 'closeContainer',
            value: function() {
              var _this13 = this,
                reason = arguments.length > 0 && void 0 !== arguments[0]
                  ? arguments[0]
                  : __WEBPACK_IMPORTED_MODULE_7__constants__.CLOSE_REASONS
                      .PARENT_CALL
              return __WEBPACK_IMPORTED_MODULE_3_sync_browser_mocks_src_promise__.a
                .try(function() {
                  return _this13.props.onClose(reason)
                })
                .then(function() {
                  return __WEBPACK_IMPORTED_MODULE_3_sync_browser_mocks_src_promise__.a.all(
                    [_this13.closeComponent(reason), _this13.hideContainer()]
                  )
                })
                .then(function() {
                  return _this13.destroyContainer()
                })
            }
          },
          {
            key: 'destroyContainer',
            value: function() {
              this.clean.run('destroyContainerEvents')
              this.clean.run('destroyContainerTemplate')
            }
          },
          {
            key: 'closeComponent',
            value: function() {
              var _this14 = this,
                reason = arguments.length > 0 && void 0 !== arguments[0]
                  ? arguments[0]
                  : __WEBPACK_IMPORTED_MODULE_7__constants__.CLOSE_REASONS
                      .PARENT_CALL
              this.clean.run('destroyCloseWindowListener')
              this.clean.run('destroyUnloadWindowListener')
              var win = this.window
              return __WEBPACK_IMPORTED_MODULE_3_sync_browser_mocks_src_promise__.a
                .try(function() {
                  return _this14.cancelContainerEvents()
                })
                .then(function() {
                  return _this14.props.onClose(reason)
                })
                .then(function() {
                  return _this14.hideComponent()
                })
                .then(function() {
                  return _this14.destroyComponent()
                })
                .then(function() {
                  _this14.childExports &&
                    _this14.context ===
                      __WEBPACK_IMPORTED_MODULE_7__constants__.CONTEXT_TYPES
                        .POPUP &&
                    !__webpack_require__.i(
                      __WEBPACK_IMPORTED_MODULE_2_cross_domain_utils_src__.isWindowClosed
                    )(win) &&
                    _this14.childExports
                      .close()
                      .catch(__WEBPACK_IMPORTED_MODULE_6__lib__.y)
                })
            }
          },
          {
            key: 'destroyComponent',
            value: function() {
              this.clean.run('destroyCloseWindowListener')
              this.clean.run('destroyContainerEvents')
              this.clean.run('destroyWindow')
            }
          },
          {
            key: 'showContainer',
            value: function() {
              var _this15 = this
              if (this.container) {
                __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_6__lib__.E)(
                  this.container,
                  __WEBPACK_IMPORTED_MODULE_7__constants__.CLASS_NAMES
                    .SHOW_CONTAINER
                )
                return __webpack_require__
                  .i(__WEBPACK_IMPORTED_MODULE_6__lib__.F)()
                  .then(function() {
                    return __webpack_require__.i(
                      __WEBPACK_IMPORTED_MODULE_6__lib__.G
                    )(_this15.container, __WEBPACK_IMPORTED_MODULE_7__constants__.ANIMATION_NAMES.SHOW_CONTAINER, _this15.clean.register)
                  })
              }
            }
          },
          {
            key: 'showComponent',
            value: function() {
              var _this16 = this
              return __WEBPACK_IMPORTED_MODULE_3_sync_browser_mocks_src_promise__.a
                .try(function() {
                  if (_this16.props.onDisplay) return _this16.props.onDisplay()
                })
                .then(function() {
                  if (_this16.element) {
                    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_6__lib__.E)(
                      _this16.element,
                      __WEBPACK_IMPORTED_MODULE_7__constants__.CLASS_NAMES
                        .SHOW_COMPONENT
                    )
                    return __webpack_require__
                      .i(__WEBPACK_IMPORTED_MODULE_6__lib__.F)()
                      .then(function() {
                        return __webpack_require__.i(
                          __WEBPACK_IMPORTED_MODULE_6__lib__.G
                        )(_this16.element, __WEBPACK_IMPORTED_MODULE_7__constants__.ANIMATION_NAMES.SHOW_COMPONENT, _this16.clean.register)
                      })
                  }
                })
            }
          },
          {
            key: 'hideContainer',
            value: function() {
              if (this.container) {
                __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_6__lib__.E)(
                  this.container,
                  __WEBPACK_IMPORTED_MODULE_7__constants__.CLASS_NAMES
                    .HIDE_CONTAINER
                )
                __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_6__lib__.E)(
                  this.container,
                  __WEBPACK_IMPORTED_MODULE_7__constants__.CLASS_NAMES.LOADING
                )
                return __webpack_require__.i(
                  __WEBPACK_IMPORTED_MODULE_6__lib__.H
                )(
                  this.container,
                  __WEBPACK_IMPORTED_MODULE_7__constants__.ANIMATION_NAMES
                    .HIDE_CONTAINER,
                  this.clean.register
                )
              }
            }
          },
          {
            key: 'hideComponent',
            value: function() {
              this.container &&
                __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_6__lib__.E)(
                  this.container,
                  __WEBPACK_IMPORTED_MODULE_7__constants__.CLASS_NAMES.LOADING
                )
              if (this.element) {
                __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_6__lib__.E)(
                  this.element,
                  __WEBPACK_IMPORTED_MODULE_7__constants__.CLASS_NAMES
                    .HIDE_COMPONENT
                )
                return __webpack_require__.i(
                  __WEBPACK_IMPORTED_MODULE_6__lib__.H
                )(
                  this.element,
                  __WEBPACK_IMPORTED_MODULE_7__constants__.ANIMATION_NAMES
                    .HIDE_COMPONENT,
                  this.clean.register
                )
              }
            }
          },
          {
            key: 'focus',
            value: function() {
              if (!this.window) throw new Error('No window to focus')
              this.component.log('focus')
              this.window.focus()
            }
          },
          {
            key: 'getComponentTemplate',
            value: function() {
              return this.component.componentTemplate
            }
          },
          {
            key: 'createComponentTemplate',
            value: function() {
              var _this17 = this
              return __WEBPACK_IMPORTED_MODULE_3_sync_browser_mocks_src_promise__.a
                .try(function() {
                  return _this17.getComponentTemplate()
                })
                .then(function(componentTemplate) {
                  if (componentTemplate) {
                    return __WEBPACK_IMPORTED_MODULE_3_sync_browser_mocks_src_promise__.a
                      .try(function() {
                        return _this17.renderTemplate(componentTemplate)
                      })
                      .then(function(html) {
                        var win =
                          _this17.componentTemplateWindow || _this17.window
                        __webpack_require__.i(
                          __WEBPACK_IMPORTED_MODULE_6__lib__.I
                        )(win, html)
                      })
                  }
                })
            }
          },
          {
            key: 'getContainerTemplate',
            value: function() {
              return this.component.containerTemplate
            }
          },
          {
            key: 'renderTemplate',
            value: function(renderer) {
              var options = arguments.length > 1 && void 0 !== arguments[1]
                ? arguments[1]
                : {}
              return renderer(
                _extends(
                  {
                    id: __WEBPACK_IMPORTED_MODULE_7__constants__.CLASS_NAMES
                      .XCOMPONENT +
                      '-' +
                      this.props.uid,
                    props: renderer.__xdomain__ ? null : this.props,
                    CLASS: __WEBPACK_IMPORTED_MODULE_7__constants__.CLASS_NAMES,
                    ANIMATION: __WEBPACK_IMPORTED_MODULE_7__constants__.ANIMATION_NAMES
                  },
                  options
                )
              )
            }
          },
          {
            key: 'openContainerFrame',
            value: function(el) {
              var frame = __webpack_require__.i(
                __WEBPACK_IMPORTED_MODULE_6__lib__.J
              )(
                null,
                {
                  name: '__xcomponent_container_' +
                    __webpack_require__.i(
                      __WEBPACK_IMPORTED_MODULE_6__lib__.r
                    )() +
                    '__',
                  scrolling: 'yes'
                },
                el
              )
              frame.style.display = 'block'
              frame.style.position = 'fixed'
              frame.style.top = '0'
              frame.style.left = '0'
              frame.style.width = '100%'
              frame.style.height = '100%'
              frame.style.zIndex = '2147483647'
              frame.contentWindow.document.open()
              frame.contentWindow.document.write('<body></body>')
              frame.contentWindow.document.close()
              return frame
            }
          },
          {
            key: 'openContainer',
            value: function(element) {
              var _this18 = this, el = void 0
              if (element) {
                el = __webpack_require__.i(
                  __WEBPACK_IMPORTED_MODULE_6__lib__.j
                )(element)
                if (!el) throw new Error('Could not find element: ' + element)
              } else el = document.body
              return this.getContainerTemplate().then(function(
                containerTemplate
              ) {
                if (containerTemplate) {
                  var containerWidth = el.offsetWidth,
                    containerHeight = el.offsetHeight
                  return _this18
                    .renderTemplate(containerTemplate, {
                      dimensions: {
                        width: containerWidth,
                        height: containerHeight
                      }
                    })
                    .then(function(html) {
                      if (_this18.component.sandboxContainer) {
                        _this18.containerFrame = _this18.openContainerFrame(el)
                        el = _this18.containerFrame.contentWindow.document.body
                      }
                      _this18.container = __webpack_require__.i(
                        __WEBPACK_IMPORTED_MODULE_6__lib__.K
                      )('div', {
                        html: html,
                        attributes: {
                          id: __WEBPACK_IMPORTED_MODULE_7__constants__
                            .CLASS_NAMES.XCOMPONENT +
                            '-' +
                            _this18.props.uid
                        },
                        class: [
                          __WEBPACK_IMPORTED_MODULE_7__constants__.CLASS_NAMES
                            .XCOMPONENT,
                          __WEBPACK_IMPORTED_MODULE_7__constants__.CLASS_NAMES
                            .XCOMPONENT +
                            '-' +
                            _this18.component.tag,
                          __WEBPACK_IMPORTED_MODULE_7__constants__.CLASS_NAMES
                            .XCOMPONENT +
                            '-' +
                            _this18.context
                        ]
                      })
                      __webpack_require__.i(
                        __WEBPACK_IMPORTED_MODULE_6__lib__.C
                      )(_this18.container)
                      el.appendChild(_this18.container)
                      if (_this18.driver.renderedIntoContainerTemplate) {
                        _this18.element = _this18.container.getElementsByClassName(
                          __WEBPACK_IMPORTED_MODULE_7__constants__.CLASS_NAMES
                            .ELEMENT
                        )[0]
                        var _ref14 = _this18.getInitialDimensions(el) || {},
                          width = _ref14.width,
                          height = _ref14.height
                        ;(width || height) &&
                          _this18.resize(width, height, {
                            waitForTransition: !1
                          })
                        if (!_this18.element)
                          throw new Error(
                            'Could not find element to render component into'
                          )
                        __webpack_require__.i(
                          __WEBPACK_IMPORTED_MODULE_6__lib__.C
                        )(_this18.element)
                      }
                      var eventHandlers = []
                      _this18.driver.focusable &&
                        eventHandlers.push(
                          __webpack_require__.i(
                            __WEBPACK_IMPORTED_MODULE_6__lib__.L
                          )(
                            _this18.container,
                            __WEBPACK_IMPORTED_MODULE_7__constants__.CLASS_NAMES
                              .FOCUS,
                            __WEBPACK_IMPORTED_MODULE_7__constants__.EVENT_NAMES
                              .CLICK,
                            function(event) {
                              return _this18.focus()
                            }
                          )
                        )
                      eventHandlers.push(
                        __webpack_require__.i(
                          __WEBPACK_IMPORTED_MODULE_6__lib__.L
                        )(
                          _this18.container,
                          __WEBPACK_IMPORTED_MODULE_7__constants__.CLASS_NAMES
                            .CLOSE,
                          __WEBPACK_IMPORTED_MODULE_7__constants__.EVENT_NAMES
                            .CLICK,
                          function(event) {
                            return _this18.userClose()
                          }
                        )
                      )
                      _this18.clean.register(
                        'destroyContainerEvents',
                        function() {
                          for (
                            var _iterator3 = eventHandlers,
                              _isArray3 = Array.isArray(_iterator3),
                              _i3 = 0,
                              _iterator3 = _isArray3
                                ? _iterator3
                                : _iterator3[Symbol.iterator]();
                            ;

                          ) {
                            var _ref15
                            if (_isArray3) {
                              if (_i3 >= _iterator3.length) break
                              _ref15 = _iterator3[_i3++]
                            } else {
                              _i3 = _iterator3.next()
                              if (_i3.done) break
                              _ref15 = _i3.value
                            }
                            _ref15.cancel()
                          }
                        }
                      )
                      _this18.clean.register(
                        'destroyContainerTemplate',
                        function() {
                          _this18.containerFrame &&
                            _this18.containerFrame.parentNode &&
                            _this18.containerFrame.parentNode.removeChild(
                              _this18.containerFrame
                            )
                          _this18.container &&
                            _this18.container.parentNode &&
                            _this18.container.parentNode.removeChild(
                              _this18.container
                            )
                          delete _this18.containerFrame
                          delete _this18.container
                        }
                      )
                    })
                }
                if (_this18.driver.renderedIntoContainerTemplate)
                  throw new Error(
                    'containerTemplate needed to render ' + _this18.context
                  )
              })
            }
          },
          {
            key: 'cancelContainerEvents',
            value: function() {
              this.clean.run('destroyContainerEvents')
            }
          },
          {
            key: 'destroy',
            value: function() {
              var _this19 = this
              return __WEBPACK_IMPORTED_MODULE_3_sync_browser_mocks_src_promise__.a.try(
                function() {
                  if (_this19.clean.hasTasks()) {
                    _this19.component.log('destroy')
                    __WEBPACK_IMPORTED_MODULE_0_beaver_logger_client__.f()
                    return _this19.clean.all()
                  }
                }
              )
            }
          },
          {
            key: 'tryInit',
            value: function(method) {
              var _this20 = this
              return __WEBPACK_IMPORTED_MODULE_3_sync_browser_mocks_src_promise__.a
                .try(method)
                .catch(function(err) {
                  _this20.onInit.reject(err)
                  throw err
                })
                .then(function() {
                  return _this20.onInit
                })
            }
          },
          {
            key: 'error',
            value: function(err) {
              var _this21 = this
              this.handledErrors = this.handledErrors || []
              if (this.handledErrors.indexOf(err) === -1) {
                this.handledErrors.push(err)
                return __WEBPACK_IMPORTED_MODULE_3_sync_browser_mocks_src_promise__.a
                  .try(function() {
                    _this21.onInit.reject(err)
                    return _this21.destroy()
                  })
                  .then(function() {
                    if (_this21.props.onError) return _this21.props.onError(err)
                  })
                  .catch(function(errErr) {
                    throw new Error(
                      'An error was encountered while handling error:\n\n ' +
                        err.stack +
                        '\n\n' +
                        errErr.stack
                    )
                  })
                  .then(function() {
                    if (!_this21.props.onError) throw err
                  })
              }
            }
          },
          {
            key: 'driver',
            get: function() {
              if (!this.context) throw new Error('Context not set')
              return __WEBPACK_IMPORTED_MODULE_8__drivers__.a[this.context]
            }
          }
        ])
        return ParentComponent
      })(__WEBPACK_IMPORTED_MODULE_4__base__.a)), _applyDecoratedDescriptor(
        _class.prototype,
        'render',
        [__WEBPACK_IMPORTED_MODULE_6__lib__.M],
        Object.getOwnPropertyDescriptor(_class.prototype, 'render'),
        _class.prototype
      ), _applyDecoratedDescriptor(
        _class.prototype,
        'getDomain',
        [__WEBPACK_IMPORTED_MODULE_6__lib__.M],
        Object.getOwnPropertyDescriptor(_class.prototype, 'getDomain'),
        _class.prototype
      ), _applyDecoratedDescriptor(
        _class.prototype,
        'updateProps',
        [__WEBPACK_IMPORTED_MODULE_6__lib__.M],
        Object.getOwnPropertyDescriptor(_class.prototype, 'updateProps'),
        _class.prototype
      ), _applyDecoratedDescriptor(
        _class.prototype,
        'openBridge',
        [__WEBPACK_IMPORTED_MODULE_6__lib__.M],
        Object.getOwnPropertyDescriptor(_class.prototype, 'openBridge'),
        _class.prototype
      ), _applyDecoratedDescriptor(
        _class.prototype,
        'open',
        [
          __WEBPACK_IMPORTED_MODULE_6__lib__.N,
          __WEBPACK_IMPORTED_MODULE_6__lib__.M
        ],
        Object.getOwnPropertyDescriptor(_class.prototype, 'open'),
        _class.prototype
      ), _applyDecoratedDescriptor(
        _class.prototype,
        'loadUrl',
        [__WEBPACK_IMPORTED_MODULE_6__lib__.M],
        Object.getOwnPropertyDescriptor(_class.prototype, 'loadUrl'),
        _class.prototype
      ), _applyDecoratedDescriptor(
        _class.prototype,
        'resize',
        [__WEBPACK_IMPORTED_MODULE_6__lib__.M],
        Object.getOwnPropertyDescriptor(_class.prototype, 'resize'),
        _class.prototype
      ), _applyDecoratedDescriptor(
        _class.prototype,
        'close',
        [__WEBPACK_IMPORTED_MODULE_6__lib__.N],
        Object.getOwnPropertyDescriptor(_class.prototype, 'close'),
        _class.prototype
      ), _applyDecoratedDescriptor(
        _class.prototype,
        'closeContainer',
        [__WEBPACK_IMPORTED_MODULE_6__lib__.N],
        Object.getOwnPropertyDescriptor(_class.prototype, 'closeContainer'),
        _class.prototype
      ), _applyDecoratedDescriptor(
        _class.prototype,
        'destroyContainer',
        [
          __WEBPACK_IMPORTED_MODULE_6__lib__.N,
          __WEBPACK_IMPORTED_MODULE_6__lib__.M
        ],
        Object.getOwnPropertyDescriptor(_class.prototype, 'destroyContainer'),
        _class.prototype
      ), _applyDecoratedDescriptor(
        _class.prototype,
        'closeComponent',
        [__WEBPACK_IMPORTED_MODULE_6__lib__.N],
        Object.getOwnPropertyDescriptor(_class.prototype, 'closeComponent'),
        _class.prototype
      ), _applyDecoratedDescriptor(
        _class.prototype,
        'showContainer',
        [
          __WEBPACK_IMPORTED_MODULE_6__lib__.N,
          __WEBPACK_IMPORTED_MODULE_6__lib__.M
        ],
        Object.getOwnPropertyDescriptor(_class.prototype, 'showContainer'),
        _class.prototype
      ), _applyDecoratedDescriptor(
        _class.prototype,
        'showComponent',
        [
          __WEBPACK_IMPORTED_MODULE_6__lib__.N,
          __WEBPACK_IMPORTED_MODULE_6__lib__.M
        ],
        Object.getOwnPropertyDescriptor(_class.prototype, 'showComponent'),
        _class.prototype
      ), _applyDecoratedDescriptor(
        _class.prototype,
        'hideContainer',
        [
          __WEBPACK_IMPORTED_MODULE_6__lib__.N,
          __WEBPACK_IMPORTED_MODULE_6__lib__.M
        ],
        Object.getOwnPropertyDescriptor(_class.prototype, 'hideContainer'),
        _class.prototype
      ), _applyDecoratedDescriptor(
        _class.prototype,
        'hideComponent',
        [
          __WEBPACK_IMPORTED_MODULE_6__lib__.N,
          __WEBPACK_IMPORTED_MODULE_6__lib__.M
        ],
        Object.getOwnPropertyDescriptor(_class.prototype, 'hideComponent'),
        _class.prototype
      ), _applyDecoratedDescriptor(
        _class.prototype,
        'getComponentTemplate',
        [__WEBPACK_IMPORTED_MODULE_6__lib__.M],
        Object.getOwnPropertyDescriptor(
          _class.prototype,
          'getComponentTemplate'
        ),
        _class.prototype
      ), _applyDecoratedDescriptor(
        _class.prototype,
        'createComponentTemplate',
        [
          __WEBPACK_IMPORTED_MODULE_6__lib__.N,
          __WEBPACK_IMPORTED_MODULE_6__lib__.M
        ],
        Object.getOwnPropertyDescriptor(
          _class.prototype,
          'createComponentTemplate'
        ),
        _class.prototype
      ), _applyDecoratedDescriptor(
        _class.prototype,
        'getContainerTemplate',
        [__WEBPACK_IMPORTED_MODULE_6__lib__.M],
        Object.getOwnPropertyDescriptor(
          _class.prototype,
          'getContainerTemplate'
        ),
        _class.prototype
      ), _applyDecoratedDescriptor(
        _class.prototype,
        'renderTemplate',
        [__WEBPACK_IMPORTED_MODULE_6__lib__.M],
        Object.getOwnPropertyDescriptor(_class.prototype, 'renderTemplate'),
        _class.prototype
      ), _applyDecoratedDescriptor(
        _class.prototype,
        'openContainer',
        [
          __WEBPACK_IMPORTED_MODULE_6__lib__.N,
          __WEBPACK_IMPORTED_MODULE_6__lib__.M
        ],
        Object.getOwnPropertyDescriptor(_class.prototype, 'openContainer'),
        _class.prototype
      ), _applyDecoratedDescriptor(
        _class.prototype,
        'error',
        [__WEBPACK_IMPORTED_MODULE_6__lib__.M],
        Object.getOwnPropertyDescriptor(_class.prototype, 'error'),
        _class.prototype
      ), _class)
    },
    function(module, __webpack_exports__, __webpack_require__) {
      'use strict'
      function urlEncode(str) {
        return str
          .replace(/\?/g, '%3F')
          .replace(/\&/g, '%26')
          .replace(/#/g, '%23')
      }
      function dasherizeToCamel(string) {
        return string.replace(/-([a-z])/g, function(g) {
          return g[1].toUpperCase()
        })
      }
      function extend(obj, source) {
        if (!source) return obj
        for (var key in source)
          source.hasOwnProperty(key) && (obj[key] = source[key])
        return obj
      }
      function values(obj) {
        var results = []
        for (var key in obj)
          obj.hasOwnProperty(key) && results.push(obj[key])
        return results
      }
      function uniqueID() {
        var chars = '0123456789abcdef'
        return 'xxxxxxxxxx'.replace(/./g, function() {
          return chars.charAt(Math.floor(Math.random() * chars.length))
        })
      }
      function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase()
      }
      function get(item, path, def) {
        if (!path) return def
        path = path.split('.')
        for (var i = 0; i < path.length; i++) {
          if (
            (void 0 === item ? 'undefined' : _typeof(item)) !== 'object' ||
            item === null
          )
            return def
          item = item[path[i]]
        }
        return void 0 === item ? def : item
      }
      function safeInterval(method, time) {
        function runInterval() {
          timeout = setTimeout(runInterval, time)
          method.call()
        }
        var timeout = void 0
        timeout = setTimeout(runInterval, time)
        return {
          cancel: function() {
            clearTimeout(timeout)
          }
        }
      }
      function each(item, callback) {
        if (item) {
          if (item instanceof Array)
            for (var len = item.length, i = 0; i < len; i++)
              callback(item[i], i)
          else if (
            (void 0 === item ? 'undefined' : _typeof(item)) === 'object'
          ) {
            for (
              var keys = Object.keys(item), _len = keys.length, _i = 0;
              _i < _len;
              _i++
            ) {
              var key = keys[_i]
              callback(item[key], key)
            }
          }
        }
      }
      function replaceObject(obj, callback) {
        var parentKey = arguments.length > 2 && void 0 !== arguments[2]
          ? arguments[2]
          : '',
          newobj = obj instanceof Array ? [] : {}
        each(obj, function(item, key) {
          var fullKey = parentKey ? parentKey + '.' + key : key,
            result = callback(item, key, fullKey)
          void 0 !== result
            ? (newobj[key] = result)
            : (void 0 === item ? 'undefined' : _typeof(item)) === 'object' &&
                item !== null
                ? (newobj[key] = replaceObject(item, callback, fullKey))
                : (newobj[key] = item)
        })
        return newobj
      }
      function copyProp(source, target, name, def) {
        if (source.hasOwnProperty(name)) {
          var descriptor = Object.getOwnPropertyDescriptor(source, name)
          Object.defineProperty(target, name, descriptor)
        } else target[name] = def
      }
      function dotify(obj) {
        var prefix = arguments.length > 1 && void 0 !== arguments[1]
          ? arguments[1]
          : '',
          newobj = arguments.length > 2 && void 0 !== arguments[2]
            ? arguments[2]
            : {}
        prefix = prefix ? prefix + '.' : prefix
        for (var key in obj)
          void 0 !== obj[key] &&
            obj[key] !== null &&
            (obj[key] && _typeof(obj[key]) === 'object'
              ? (newobj = dotify(obj[key], '' + prefix + key, newobj))
              : (newobj['' + prefix + key] = obj[key].toString()))
        return newobj
      }
      function getObjectID(obj) {
        if (
          obj === null ||
          void 0 === obj ||
          ((void 0 === obj ? 'undefined' : _typeof(obj)) !== 'object' &&
            typeof obj !== 'function')
        )
          throw new Error('Invalid object')
        var uid = objectIDs.get(obj)
        if (!uid) {
          uid = (void 0 === obj ? 'undefined' : _typeof(obj)) + ':' + uniqueID()
          objectIDs.set(obj, uid)
        }
        return uid
      }
      var __WEBPACK_IMPORTED_MODULE_0_cross_domain_safe_weakmap_src__ = __webpack_require__(
        6
      )
      __webpack_exports__.f = urlEncode
      __webpack_exports__.l = dasherizeToCamel
      __webpack_exports__.e = extend
      __webpack_exports__.a = values
      __webpack_exports__.j = uniqueID
      __webpack_exports__.g = capitalizeFirstLetter
      __webpack_exports__.h = get
      __webpack_exports__.d = safeInterval
      __webpack_exports__.c = replaceObject
      __webpack_exports__.i = copyProp
      __webpack_exports__.k = dotify
      __webpack_exports__.b = getObjectID
      var _typeof = typeof Symbol === 'function' &&
        typeof Symbol.iterator === 'symbol'
        ? function(obj) {
            return typeof obj
          }
        : function(obj) {
            return obj &&
              typeof Symbol === 'function' &&
              obj.constructor === Symbol &&
              obj !== Symbol.prototype
              ? 'symbol'
              : typeof obj
          },
        objectIDs = new __WEBPACK_IMPORTED_MODULE_0_cross_domain_safe_weakmap_src__.WeakMap()
    },
    function(module, __webpack_exports__, __webpack_require__) {
      'use strict'
      Object.defineProperty(__webpack_exports__, '__esModule', {
        value: !0
      })
      var __WEBPACK_IMPORTED_MODULE_0__logger__ = __webpack_require__(14)
      __webpack_require__.d(__webpack_exports__, 'track', function() {
        return __WEBPACK_IMPORTED_MODULE_0__logger__.a
      })
      __webpack_require__.d(__webpack_exports__, 'buffer', function() {
        return __WEBPACK_IMPORTED_MODULE_0__logger__.b
      })
      __webpack_require__.d(__webpack_exports__, 'tracking', function() {
        return __WEBPACK_IMPORTED_MODULE_0__logger__.c
      })
      __webpack_require__.d(__webpack_exports__, 'print', function() {
        return __WEBPACK_IMPORTED_MODULE_0__logger__.d
      })
      __webpack_require__.d(__webpack_exports__, 'immediateFlush', function() {
        return __WEBPACK_IMPORTED_MODULE_0__logger__.e
      })
      __webpack_require__.d(__webpack_exports__, 'flush', function() {
        return __WEBPACK_IMPORTED_MODULE_0__logger__.f
      })
      __webpack_require__.d(__webpack_exports__, 'log', function() {
        return __WEBPACK_IMPORTED_MODULE_0__logger__.g
      })
      __webpack_require__.d(__webpack_exports__, 'prefix', function() {
        return __WEBPACK_IMPORTED_MODULE_0__logger__.h
      })
      __webpack_require__.d(__webpack_exports__, 'debug', function() {
        return __WEBPACK_IMPORTED_MODULE_0__logger__.i
      })
      __webpack_require__.d(__webpack_exports__, 'info', function() {
        return __WEBPACK_IMPORTED_MODULE_0__logger__.j
      })
      __webpack_require__.d(__webpack_exports__, 'warn', function() {
        return __WEBPACK_IMPORTED_MODULE_0__logger__.k
      })
      __webpack_require__.d(__webpack_exports__, 'error', function() {
        return __WEBPACK_IMPORTED_MODULE_0__logger__.l
      })
      var __WEBPACK_IMPORTED_MODULE_1__init__ = __webpack_require__(41)
      __webpack_require__.d(__webpack_exports__, 'init', function() {
        return __WEBPACK_IMPORTED_MODULE_1__init__.a
      })
      var __WEBPACK_IMPORTED_MODULE_2__transitions__ = __webpack_require__(42)
      __webpack_require__.d(__webpack_exports__, 'startTransition', function() {
        return __WEBPACK_IMPORTED_MODULE_2__transitions__.a
      })
      __webpack_require__.d(__webpack_exports__, 'endTransition', function() {
        return __WEBPACK_IMPORTED_MODULE_2__transitions__.b
      })
      __webpack_require__.d(__webpack_exports__, 'transition', function() {
        return __WEBPACK_IMPORTED_MODULE_2__transitions__.c
      })
      var __WEBPACK_IMPORTED_MODULE_3__builders__ = __webpack_require__(13)
      __webpack_require__.d(__webpack_exports__, 'payloadBuilders', function() {
        return __WEBPACK_IMPORTED_MODULE_3__builders__.a
      })
      __webpack_require__.d(__webpack_exports__, 'metaBuilders', function() {
        return __WEBPACK_IMPORTED_MODULE_3__builders__.b
      })
      __webpack_require__.d(
        __webpack_exports__,
        'trackingBuilders',
        function() {
          return __WEBPACK_IMPORTED_MODULE_3__builders__.c
        }
      )
      __webpack_require__.d(__webpack_exports__, 'headerBuilders', function() {
        return __WEBPACK_IMPORTED_MODULE_3__builders__.d
      })
      __webpack_require__.d(
        __webpack_exports__,
        'addPayloadBuilder',
        function() {
          return __WEBPACK_IMPORTED_MODULE_3__builders__.e
        }
      )
      __webpack_require__.d(__webpack_exports__, 'addMetaBuilder', function() {
        return __WEBPACK_IMPORTED_MODULE_3__builders__.f
      })
      __webpack_require__.d(
        __webpack_exports__,
        'addTrackingBuilder',
        function() {
          return __WEBPACK_IMPORTED_MODULE_3__builders__.g
        }
      )
      __webpack_require__.d(
        __webpack_exports__,
        'addHeaderBuilder',
        function() {
          return __WEBPACK_IMPORTED_MODULE_3__builders__.h
        }
      )
      var __WEBPACK_IMPORTED_MODULE_4__config__ = __webpack_require__(11)
      __webpack_require__.d(__webpack_exports__, 'config', function() {
        return __WEBPACK_IMPORTED_MODULE_4__config__.a
      })
      __webpack_require__.d(__webpack_exports__, 'logLevels', function() {
        return __WEBPACK_IMPORTED_MODULE_4__config__.b
      })
    },
    function(module, __webpack_exports__, __webpack_require__) {
      'use strict'
      function now() {
        return enablePerformance ? performance.now() : Date.now()
      }
      function timer(startTime) {
        startTime = void 0 !== startTime ? startTime : now()
        return {
          startTime: startTime,
          elapsed: function() {
            return parseInt(now() - startTime, 10)
          },
          reset: function() {
            startTime = now()
          }
        }
      }
      function reqStartElapsed() {
        if (enablePerformance) {
          var timing = window.performance.timing
          return parseInt(timing.connectEnd - timing.navigationStart, 10)
        }
      }
      function initHeartBeat() {
        var heartBeatTimer = timer(), heartbeatCount = 0
        __webpack_require__.i(
          __WEBPACK_IMPORTED_MODULE_3__util__.b
        )(function() {
          if (
            !(__WEBPACK_IMPORTED_MODULE_0__config__.a.heartbeatMaxThreshold &&
              heartbeatCount >
                __WEBPACK_IMPORTED_MODULE_0__config__.a.heartbeatMaxThreshold)
          ) {
            heartbeatCount += 1
            var elapsed = heartBeatTimer.elapsed(),
              lag =
                elapsed -
                __WEBPACK_IMPORTED_MODULE_0__config__.a.heartbeatInterval,
              heartbeatPayload = {
                count: heartbeatCount,
                elapsed: elapsed
              }
            if (__WEBPACK_IMPORTED_MODULE_0__config__.a.heartbeatTooBusy) {
              heartbeatPayload.lag = lag
              lag >=
                __WEBPACK_IMPORTED_MODULE_0__config__.a
                  .heartbeatTooBusyThreshold &&
                __webpack_require__.i(
                  __WEBPACK_IMPORTED_MODULE_1__logger__.j
                )('toobusy', heartbeatPayload, {
                  noConsole: !__WEBPACK_IMPORTED_MODULE_0__config__.a
                    .heartbeatConsoleLog
                })
            }
            __webpack_require__.i(
              __WEBPACK_IMPORTED_MODULE_1__logger__.j
            )('heartbeat', heartbeatPayload, {
              noConsole: !__WEBPACK_IMPORTED_MODULE_0__config__.a
                .heartbeatConsoleLog
            })
          }
        }, __WEBPACK_IMPORTED_MODULE_0__config__.a.heartbeatInterval)
      }
      function initPerformance() {
        if (!enablePerformance)
          return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__logger__.j)(
            'no_performance_data'
          )
        __webpack_require__.i(
          __WEBPACK_IMPORTED_MODULE_2__builders__.e
        )(function() {
          var payload = {}
          payload.client_elapsed = clientTimer.elapsed()
          enablePerformance && (payload.req_elapsed = reqTimer.elapsed())
          return payload
        })
        __WEBPACK_IMPORTED_MODULE_3__util__.c.then(function() {
          var keys = [
            'connectEnd',
            'connectStart',
            'domComplete',
            'domContentLoadedEventEnd',
            'domContentLoadedEventStart',
            'domInteractive',
            'domLoading',
            'domainLookupEnd',
            'domainLookupStart',
            'fetchStart',
            'loadEventEnd',
            'loadEventStart',
            'navigationStart',
            'redirectEnd',
            'redirectStart',
            'requestStart',
            'responseEnd',
            'responseStart',
            'secureConnectionStart',
            'unloadEventEnd',
            'unloadEventStart'
          ],
            timing = {}
          keys.forEach(function(key) {
            timing[key] = parseInt(window.performance.timing[key], 10) || 0
          })
          var offset = timing.connectEnd - timing.navigationStart
          timing.connectEnd &&
            Object.keys(timing).forEach(function(name) {
              var time = timing[name]
              time &&
                __webpack_require__.i(
                  __WEBPACK_IMPORTED_MODULE_1__logger__.j
                )('timing_' + name, {
                  client_elapsed: parseInt(
                    time - timing.connectEnd - (clientTimer.startTime - offset),
                    10
                  ),
                  req_elapsed: parseInt(time - timing.connectEnd, 10)
                })
            })
          __webpack_require__.i(
            __WEBPACK_IMPORTED_MODULE_1__logger__.j
          )('timing', timing)
          __webpack_require__.i(
            __WEBPACK_IMPORTED_MODULE_1__logger__.j
          )('memory', window.performance.memory)
          __webpack_require__.i(
            __WEBPACK_IMPORTED_MODULE_1__logger__.j
          )('navigation', window.performance.navigation)
          window.performance.getEntries &&
            window.performance.getEntries().forEach(function(resource) {
              ;['link', 'script', 'img', 'css'].indexOf(
                resource.initiatorType
              ) > -1 &&
                __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__logger__.j)(
                  resource.initiatorType,
                  resource
                )
            })
        })
      }
      var __WEBPACK_IMPORTED_MODULE_0__config__ = __webpack_require__(11),
        __WEBPACK_IMPORTED_MODULE_1__logger__ = __webpack_require__(14),
        __WEBPACK_IMPORTED_MODULE_2__builders__ = __webpack_require__(13),
        __WEBPACK_IMPORTED_MODULE_3__util__ = __webpack_require__(15)
      __webpack_exports__.a = now
      __webpack_exports__.b = reqStartElapsed
      __webpack_exports__.d = initHeartBeat
      __webpack_exports__.c = initPerformance
      var enablePerformance =
        window &&
        window.performance &&
        performance.now &&
        performance.timing &&
        performance.timing.connectEnd &&
        performance.timing.navigationStart &&
        Math.abs(performance.now() - Date.now()) > 1e3 &&
        performance.now() -
          (performance.timing.connectEnd - performance.timing.navigationStart) >
          0,
        clientTimer = timer(),
        reqTimer = timer(reqStartElapsed())
    },
    function(module, __webpack_exports__, __webpack_require__) {
      'use strict'
      Object.defineProperty(__webpack_exports__, '__esModule', {
        value: !0
      })
      var __WEBPACK_IMPORTED_MODULE_0__weakmap__ = __webpack_require__(45)
      __webpack_require__.d(__webpack_exports__, 'WeakMap', function() {
        return __WEBPACK_IMPORTED_MODULE_0__weakmap__.a
      })
    },
    function(module, __webpack_exports__, __webpack_require__) {
      'use strict'
      Object.defineProperty(__webpack_exports__, '__esModule', {
        value: !0
      })
      var __WEBPACK_IMPORTED_MODULE_0__ie__ = __webpack_require__(53)
      __webpack_require__.d(
        __webpack_exports__,
        'emulateIERestrictions',
        function() {
          return __WEBPACK_IMPORTED_MODULE_0__ie__.a
        }
      )
    },
    function(module, __webpack_exports__, __webpack_require__) {
      'use strict'
      __webpack_require__.d(__webpack_exports__, 'a', function() {
        return CONSTANTS
      })
      __webpack_require__.d(__webpack_exports__, 'b', function() {
        return POST_MESSAGE_NAMES_LIST
      })
      var CONSTANTS = {
        POST_MESSAGE_TYPE: {
          REQUEST: 'postrobot_message_request',
          RESPONSE: 'postrobot_message_response',
          ACK: 'postrobot_message_ack'
        },
        POST_MESSAGE_ACK: {
          SUCCESS: 'success',
          ERROR: 'error'
        },
        POST_MESSAGE_NAMES: {
          METHOD: 'postrobot_method',
          READY: 'postrobot_ready',
          OPEN_TUNNEL: 'postrobot_open_tunnel'
        },
        WINDOW_TYPES: {
          FULLPAGE: 'fullpage',
          POPUP: 'popup',
          IFRAME: 'iframe'
        },
        WINDOW_PROPS: {
          POSTROBOT: '__postRobot__'
        },
        SERIALIZATION_TYPES: {
          METHOD: 'postrobot_method',
          ERROR: 'postrobot_error'
        },
        SEND_STRATEGIES: {
          POST_MESSAGE: 'postrobot_post_message',
          BRIDGE: 'postrobot_bridge',
          GLOBAL: 'postrobot_global'
        },
        MOCK_PROTOCOL: 'mock:',
        FILE_PROTOCOL: 'file:',
        BRIDGE_NAME_PREFIX: '__postrobot_bridge__',
        POSTROBOT_PROXY: '__postrobot_proxy__',
        WILDCARD: '*'
      },
        POST_MESSAGE_NAMES_LIST = Object.keys(
          CONSTANTS.POST_MESSAGE_NAMES
        ).map(function(key) {
          return CONSTANTS.POST_MESSAGE_NAMES[key]
        })
    },
    function(module, __webpack_exports__, __webpack_require__) {
      'use strict'
      function addResponseListener(hash, listener) {
        __WEBPACK_IMPORTED_MODULE_2__global__.a.responseListeners[
          hash
        ] = listener
      }
      function getResponseListener(hash) {
        return __WEBPACK_IMPORTED_MODULE_2__global__.a.responseListeners[hash]
      }
      function deleteResponseListener(hash) {
        delete __WEBPACK_IMPORTED_MODULE_2__global__.a.responseListeners[hash]
      }
      function getRequestListener(qualifiers) {
        var name = qualifiers.name,
          win = qualifiers.win,
          domain = qualifiers.domain
        win === __WEBPACK_IMPORTED_MODULE_4__conf__.a.WILDCARD && (win = null)
        domain === __WEBPACK_IMPORTED_MODULE_4__conf__.a.WILDCARD &&
          (domain = null)
        if (!name) throw new Error('Name required to get request listener')
        var nameListeners =
          __WEBPACK_IMPORTED_MODULE_2__global__.a.requestListeners[name]
        if (nameListeners) {
          for (
            var _arr = [
              win,
              __WEBPACK_IMPORTED_MODULE_2__global__.a.WINDOW_WILDCARD
            ],
              _i = 0;
            _i < _arr.length;
            _i++
          ) {
            var winQualifier = _arr[_i],
              winListeners = winQualifier && nameListeners.get(winQualifier)
            if (winListeners) {
              for (
                var _arr2 = [
                  domain,
                  __WEBPACK_IMPORTED_MODULE_4__conf__.a.WILDCARD
                ],
                  _i2 = 0;
                _i2 < _arr2.length;
                _i2++
              ) {
                var domainQualifier = _arr2[_i2]
                if (domainQualifier) {
                  domainQualifier = domainQualifier.toString()
                  if (winListeners[domainQualifier])
                    return winListeners[domainQualifier]
                }
              }
              if (winListeners[__DOMAIN_REGEX__]) {
                for (
                  var _iterator = winListeners[__DOMAIN_REGEX__],
                    _isArray = Array.isArray(_iterator),
                    _i3 = 0,
                    _iterator = _isArray
                      ? _iterator
                      : _iterator[Symbol.iterator]();
                  ;

                ) {
                  var _ref2
                  if (_isArray) {
                    if (_i3 >= _iterator.length) break
                    _ref2 = _iterator[_i3++]
                  } else {
                    _i3 = _iterator.next()
                    if (_i3.done) break
                    _ref2 = _i3.value
                  }
                  var _ref3 = _ref2,
                    regex = _ref3.regex,
                    listener = _ref3.listener
                  if (
                    __webpack_require__.i(
                      __WEBPACK_IMPORTED_MODULE_1_cross_domain_utils_src__.matchDomain
                    )(regex, domain)
                  )
                    return listener
                }
              }
            }
          }
        }
      }
      function addRequestListener(qualifiers, listener) {
        var name = qualifiers.name,
          win = qualifiers.win,
          domain = qualifiers.domain
        if (!name || typeof name !== 'string')
          throw new Error('Name required to add request listener')
        if (Array.isArray(win)) {
          for (
            var _iterator2 = win,
              _isArray2 = Array.isArray(_iterator2),
              _i4 = 0,
              _iterator2 = _isArray2
                ? _iterator2
                : _iterator2[Symbol.iterator]();
            ;

          ) {
            var _ref4
            if (_isArray2) {
              if (_i4 >= _iterator2.length) break
              _ref4 = _iterator2[_i4++]
            } else {
              _i4 = _iterator2.next()
              if (_i4.done) break
              _ref4 = _i4.value
            }
            var item = _ref4
            addRequestListener(
              {
                name: name,
                domain: domain,
                win: item
              },
              listener
            )
          }
        } else {
          if (!Array.isArray(domain)) {
            var existingListener = getRequestListener(qualifiers)
            ;(win && win !== __WEBPACK_IMPORTED_MODULE_4__conf__.a.WILDCARD) ||
              (win = __WEBPACK_IMPORTED_MODULE_2__global__.a.WINDOW_WILDCARD)
            domain = domain || __WEBPACK_IMPORTED_MODULE_4__conf__.a.WILDCARD
            if (existingListener)
              throw win && domain
                ? new Error(
                    'Request listener already exists for ' +
                      name +
                      ' on domain ' +
                      domain +
                      ' for specified window'
                  )
                : win
                    ? new Error(
                        'Request listener already exists for ' +
                          name +
                          ' for specified window'
                      )
                    : domain
                        ? new Error(
                            'Request listener already exists for ' +
                              name +
                              ' on domain ' +
                              domain
                          )
                        : new Error(
                            'Request listener already exists for ' + name
                          )
            var requestListeners =
              __WEBPACK_IMPORTED_MODULE_2__global__.a.requestListeners,
              nameListeners = requestListeners[name]
            if (!nameListeners) {
              nameListeners = new __WEBPACK_IMPORTED_MODULE_0_cross_domain_safe_weakmap_src__.WeakMap()
              requestListeners[name] = nameListeners
            }
            var winListeners = nameListeners.get(win)
            if (!winListeners) {
              winListeners = {}
              nameListeners.set(win, winListeners)
            }
            var strDomain = domain.toString()
            winListeners[strDomain] = listener
            var regexListeners = winListeners[__DOMAIN_REGEX__],
              regexListener = void 0
            if (
              __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__lib__.d)(
                domain
              )
            ) {
              if (!regexListeners) {
                regexListeners = []
                winListeners[__DOMAIN_REGEX__] = regexListeners
              }
              regexListener = {
                regex: domain,
                listener: listener
              }
              regexListeners.push(regexListener)
            }
            return {
              cancel: function() {
                delete winListeners[strDomain]
                Object.keys(winListeners).length === 0 &&
                  nameListeners.delete(win)
                regexListener &&
                  regexListeners.splice(
                    regexListeners.indexOf(regexListener, 1)
                  )
              }
            }
          }
          for (
            var _iterator3 = domain,
              _isArray3 = Array.isArray(_iterator3),
              _i5 = 0,
              _iterator3 = _isArray3
                ? _iterator3
                : _iterator3[Symbol.iterator]();
            ;

          ) {
            var _ref5
            if (_isArray3) {
              if (_i5 >= _iterator3.length) break
              _ref5 = _iterator3[_i5++]
            } else {
              _i5 = _iterator3.next()
              if (_i5.done) break
              _ref5 = _i5.value
            }
            addRequestListener(
              {
                name: name,
                win: win,
                domain: _ref5
              },
              listener
            )
          }
        }
      }
      var __WEBPACK_IMPORTED_MODULE_0_cross_domain_safe_weakmap_src__ = __webpack_require__(
        6
      ),
        __WEBPACK_IMPORTED_MODULE_1_cross_domain_utils_src__ = __webpack_require__(
          0
        ),
        __WEBPACK_IMPORTED_MODULE_2__global__ = (__webpack_require__.n(
          __WEBPACK_IMPORTED_MODULE_1_cross_domain_utils_src__
        ), __webpack_require__(5)),
        __WEBPACK_IMPORTED_MODULE_3__lib__ = __webpack_require__(3),
        __WEBPACK_IMPORTED_MODULE_4__conf__ = __webpack_require__(1)
      __webpack_exports__.e = addResponseListener
      __webpack_exports__.a = getResponseListener
      __webpack_exports__.c = deleteResponseListener
      __webpack_exports__.b = getRequestListener
      __webpack_exports__.d = addRequestListener
      __WEBPACK_IMPORTED_MODULE_2__global__.a.responseListeners = __WEBPACK_IMPORTED_MODULE_2__global__
        .a.responseListeners || {}
      __WEBPACK_IMPORTED_MODULE_2__global__.a.requestListeners = __WEBPACK_IMPORTED_MODULE_2__global__
        .a.requestListeners || {}
      __WEBPACK_IMPORTED_MODULE_2__global__.a.WINDOW_WILDCARD =
        __WEBPACK_IMPORTED_MODULE_2__global__.a.WINDOW_WILDCARD ||
        new function() {}()
      var __DOMAIN_REGEX__ = '__domain_regex__'
    },
    function(module, __webpack_exports__, __webpack_require__) {
      'use strict'
      function _defineProperty(obj, key, value) {
        key in obj
          ? Object.defineProperty(obj, key, {
              value: value,
              enumerable: !0,
              configurable: !0,
              writable: !0
            })
          : (obj[key] = value)
        return obj
      }
      function buildMessage(win, message) {
        var options = arguments.length > 2 && void 0 !== arguments[2]
          ? arguments[2]
          : {},
          id = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__lib__.e)(),
          type = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__lib__.f)(),
          sourceDomain = __webpack_require__.i(
            __WEBPACK_IMPORTED_MODULE_0_cross_domain_utils_src__.getDomain
          )(window)
        return _extends({}, message, options, {
          sourceDomain: sourceDomain,
          id: message.id || id,
          windowType: type
        })
      }
      function sendMessage(win, message, domain) {
        return __WEBPACK_IMPORTED_MODULE_2__lib__.g.run(function() {
          message = buildMessage(win, message, {
            data: __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__lib__.h)(
              win,
              domain,
              message.data
            ),
            domain: domain
          })
          var level = void 0
          level = __WEBPACK_IMPORTED_MODULE_1__conf__.c.indexOf(
            message.name
          ) !== -1 ||
            message.type ===
              __WEBPACK_IMPORTED_MODULE_1__conf__.a.POST_MESSAGE_TYPE.ACK
            ? 'debug'
            : message.ack === 'error' ? 'error' : 'info'
          __WEBPACK_IMPORTED_MODULE_2__lib__.i.logLevel(level, [
            '\n\n\t',
            '#send',
            message.type.replace(/^postrobot_message_/, ''),
            '::',
            message.name,
            '::',
            domain || __WEBPACK_IMPORTED_MODULE_1__conf__.a.WILDCARD,
            '\n\n',
            message
          ])
          if (__WEBPACK_IMPORTED_MODULE_1__conf__.b.MOCK_MODE) {
            delete message.target
            return window[
              __WEBPACK_IMPORTED_MODULE_1__conf__.a.WINDOW_PROPS.POSTROBOT
            ].postMessage({
              origin: __webpack_require__.i(
                __WEBPACK_IMPORTED_MODULE_0_cross_domain_utils_src__.getDomain
              )(window),
              source: window,
              data: __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__lib__.j)(
                message,
                0,
                2
              )
            })
          }
          if (win === window)
            throw new Error('Attemping to send message to self')
          if (
            __webpack_require__.i(
              __WEBPACK_IMPORTED_MODULE_0_cross_domain_utils_src__.isWindowClosed
            )(win)
          )
            throw new Error('Window is closed')
          __WEBPACK_IMPORTED_MODULE_2__lib__.i.debug(
            'Running send message strategies',
            message
          )
          var messages = [],
            serializedMessage = __webpack_require__.i(
              __WEBPACK_IMPORTED_MODULE_2__lib__.j
            )(
              _defineProperty(
                {},
                __WEBPACK_IMPORTED_MODULE_1__conf__.a.WINDOW_PROPS.POSTROBOT,
                message
              ),
              0,
              2
            )
          return __WEBPACK_IMPORTED_MODULE_2__lib__.g
            .map(
              Object.keys(__WEBPACK_IMPORTED_MODULE_3__strategies__.a),
              function(strategyName) {
                return __WEBPACK_IMPORTED_MODULE_2__lib__.g
                  .run(function() {
                    if (
                      !__WEBPACK_IMPORTED_MODULE_1__conf__.b
                        .ALLOWED_POST_MESSAGE_METHODS[strategyName]
                    )
                      throw new Error('Strategy disallowed: ' + strategyName)
                    return __WEBPACK_IMPORTED_MODULE_3__strategies__.a[
                      strategyName
                    ](win, serializedMessage, domain)
                  })
                  .then(
                    function() {
                      messages.push(strategyName + ': success')
                      return !0
                    },
                    function(err) {
                      messages.push(
                        strategyName +
                          ': ' +
                          (err.stack || err.toString()) +
                          '\n'
                      )
                      return !1
                    }
                  )
              }
            )
            .then(function(results) {
              var success = __webpack_require__.i(
                __WEBPACK_IMPORTED_MODULE_2__lib__.k
              )(results),
                status =
                  message.type +
                  ' ' +
                  message.name +
                  ' ' +
                  (success ? 'success' : 'error') +
                  ':\n  - ' +
                  messages.join('\n  - ') +
                  '\n'
              __WEBPACK_IMPORTED_MODULE_2__lib__.i.debug(status)
              if (!success) throw new Error(status)
            })
        })
      }
      var __WEBPACK_IMPORTED_MODULE_0_cross_domain_utils_src__ = __webpack_require__(
        0
      ),
        __WEBPACK_IMPORTED_MODULE_1__conf__ = (__webpack_require__.n(
          __WEBPACK_IMPORTED_MODULE_0_cross_domain_utils_src__
        ), __webpack_require__(1)),
        __WEBPACK_IMPORTED_MODULE_2__lib__ = __webpack_require__(3),
        __WEBPACK_IMPORTED_MODULE_3__strategies__ = __webpack_require__(57)
      __webpack_exports__.a = sendMessage
      var _extends =
        Object.assign ||
        function(target) {
          for (var i = 1; i < arguments.length; i++) {
            var source = arguments[i]
            for (var key in source)
              Object.prototype.hasOwnProperty.call(source, key) &&
                (target[key] = source[key])
          }
          return target
        }
    },
    function(module, __webpack_exports__, __webpack_require__) {
      'use strict'
      var __WEBPACK_IMPORTED_MODULE_0_sync_browser_mocks_src_promise__ = __webpack_require__(
        4
      ),
        __WEBPACK_IMPORTED_MODULE_1__tick__ = __webpack_require__(34)
      __webpack_require__.d(__webpack_exports__, 'a', function() {
        return Promise
      })
      __webpack_require__.d(__webpack_exports__, 'b', function() {
        return promise
      })
      var Promise =
        __WEBPACK_IMPORTED_MODULE_0_sync_browser_mocks_src_promise__.a,
        promise = {
          Promise: Promise,
          run: function(method) {
            return Promise.resolve().then(method)
          },
          nextTick: function(method) {
            return new Promise(function(resolve, reject) {
              __webpack_require__.i(
                __WEBPACK_IMPORTED_MODULE_1__tick__.a
              )(function() {
                return promise.run(method).then(resolve, reject)
              })
            })
          },
          method: function(_method) {
            return function() {
              var _this = this, _arguments = arguments
              return Promise.resolve().then(function() {
                return _method.apply(_this, _arguments)
              })
            }
          },
          nodeify: function(prom, callback) {
            if (!callback) return prom
            prom.then(
              function(result) {
                callback(null, result)
              },
              function(err) {
                callback(err)
              }
            )
          },
          map: function(items, method) {
            for (var results = [], i = 0; i < items.length; i++) {
              !(function(i) {
                results.push(
                  promise.run(function() {
                    return method(items[i])
                  })
                )
              })(i)
            }
            return Promise.all(results)
          }
        }
    },
    function(module, __webpack_exports__, __webpack_require__) {
      'use strict'
      function nextTick(method) {
        queue.push(method)
        window.postMessage(
          tickMessageName,
          __WEBPACK_IMPORTED_MODULE_1__conf__.a.WILDCARD
        )
      }
      var __WEBPACK_IMPORTED_MODULE_0__util__ = __webpack_require__(12),
        __WEBPACK_IMPORTED_MODULE_1__conf__ = __webpack_require__(1)
      __webpack_exports__.a = nextTick
      var tickMessageName =
        '__nextTick__postRobot__' +
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__util__.d)(),
        queue = []
      window.addEventListener('message', function(event) {
        if (event.data === tickMessageName) {
          queue.shift().call()
        }
      })
    },
    function(module, __webpack_exports__, __webpack_require__) {
      'use strict'
      function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor))
          throw new TypeError('Cannot call a class as a function')
      }
      function _possibleConstructorReturn(self, call) {
        if (!self)
          throw new ReferenceError(
            "this hasn't been initialised - super() hasn't been called"
          )
        return !call || (typeof call !== 'object' && typeof call !== 'function')
          ? self
          : call
      }
      function _inherits(subClass, superClass) {
        if (typeof superClass !== 'function' && superClass !== null)
          throw new TypeError(
            'Super expression must either be null or a function, not ' +
              typeof superClass
          )
        subClass.prototype = Object.create(superClass && superClass.prototype, {
          constructor: {
            value: subClass,
            enumerable: !1,
            writable: !0,
            configurable: !0
          }
        })
        superClass &&
          (Object.setPrototypeOf
            ? Object.setPrototypeOf(subClass, superClass)
            : (subClass.__proto__ = superClass))
      }
      var __WEBPACK_IMPORTED_MODULE_0_beaver_logger_client__ = __webpack_require__(
        20
      ),
        __WEBPACK_IMPORTED_MODULE_1_cross_domain_utils_src__ = __webpack_require__(
          0
        ),
        __WEBPACK_IMPORTED_MODULE_2_post_robot_src__ = (__webpack_require__.n(
          __WEBPACK_IMPORTED_MODULE_1_cross_domain_utils_src__
        ), __webpack_require__(9)),
        __WEBPACK_IMPORTED_MODULE_3_sync_browser_mocks_src_promise__ = __webpack_require__(
          4
        ),
        __WEBPACK_IMPORTED_MODULE_4__base__ = __webpack_require__(16),
        __WEBPACK_IMPORTED_MODULE_5__window__ = __webpack_require__(17),
        __WEBPACK_IMPORTED_MODULE_6__lib__ = __webpack_require__(2),
        __WEBPACK_IMPORTED_MODULE_7__constants__ = __webpack_require__(7),
        __WEBPACK_IMPORTED_MODULE_8__props__ = __webpack_require__(65),
        __WEBPACK_IMPORTED_MODULE_9__error__ = __webpack_require__(18)
      __webpack_require__.d(__webpack_exports__, 'a', function() {
        return ChildComponent
      })
      var _typeof = typeof Symbol === 'function' &&
        typeof Symbol.iterator === 'symbol'
        ? function(obj) {
            return typeof obj
          }
        : function(obj) {
            return obj &&
              typeof Symbol === 'function' &&
              obj.constructor === Symbol &&
              obj !== Symbol.prototype
              ? 'symbol'
              : typeof obj
          },
        _createClass = (function() {
          function defineProperties(target, props) {
            for (var i = 0; i < props.length; i++) {
              var descriptor = props[i]
              descriptor.enumerable = descriptor.enumerable || !1
              descriptor.configurable = !0
              'value' in descriptor && (descriptor.writable = !0)
              Object.defineProperty(target, descriptor.key, descriptor)
            }
          }
          return function(Constructor, protoProps, staticProps) {
            protoProps && defineProperties(Constructor.prototype, protoProps)
            staticProps && defineProperties(Constructor, staticProps)
            return Constructor
          }
        })(),
        ChildComponent = (function(_BaseComponent) {
          function ChildComponent(component) {
            _classCallCheck(this, ChildComponent)
            var _this = _possibleConstructorReturn(
              this,
              (ChildComponent.__proto__ ||
                Object.getPrototypeOf(ChildComponent))
                .call(this, component)
            )
            _this.component = component
            if (!_this.hasValidParentDomain()) {
              var _ret
              return (_ret = _this.error(
                new __WEBPACK_IMPORTED_MODULE_9__error__.c(
                  'Can not be rendered by domain: ' + _this.getParentDomain()
                )
              )), _possibleConstructorReturn(_this, _ret)
            }
            _this.sendLogsToOpener()
            _this.component.log('construct_child')
            _this.onPropHandlers = []
            _this.setProps(
              _this.getInitialProps(),
              __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_5__window__.a)()
            )
            __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_6__lib__.c)(
              _this.props.logLevel
            )
            _this.component.log('init_child')
            _this.setWindows()
            _this.onInit = _this
              .sendToParent(
                __WEBPACK_IMPORTED_MODULE_7__constants__.POST_MESSAGE.INIT,
                {
                  exports: _this.exports()
                }
              )
              .then(function(_ref) {
                var origin = _ref.origin, data = _ref.data
                _this.context = data.context
                window.xprops = _this.props = {}
                _this.setProps(data.props, origin)
                _this.watchForResize()
                return _this
              })
              .catch(function(err) {
                _this.error(err)
                throw err
              })
            return _this
          }
          _inherits(ChildComponent, _BaseComponent)
          _createClass(ChildComponent, [
            {
              key: 'hasValidParentDomain',
              value: function() {
                return __webpack_require__.i(
                  __WEBPACK_IMPORTED_MODULE_1_cross_domain_utils_src__.matchDomain
                )(this.component.allowedParentDomains, this.getParentDomain())
              }
            },
            {
              key: 'init',
              value: function() {
                return this.onInit
              }
            },
            {
              key: 'getParentDomain',
              value: function() {
                return __webpack_require__.i(
                  __WEBPACK_IMPORTED_MODULE_5__window__.a
                )()
              }
            },
            {
              key: 'onProps',
              value: function(handler) {
                this.onPropHandlers.push(handler)
              }
            },
            {
              key: 'getParentComponentWindow',
              value: function() {
                return __webpack_require__.i(
                  __WEBPACK_IMPORTED_MODULE_5__window__.b
                )()
              }
            },
            {
              key: 'getParentRenderWindow',
              value: function() {
                return __webpack_require__.i(
                  __WEBPACK_IMPORTED_MODULE_5__window__.c
                )()
              }
            },
            {
              key: 'getInitialProps',
              value: function() {
                var _this2 = this,
                  componentMeta = __webpack_require__.i(
                    __WEBPACK_IMPORTED_MODULE_5__window__.d
                  )()
                if (componentMeta) {
                  var props = componentMeta.props
                  if (
                    props.type ===
                    __WEBPACK_IMPORTED_MODULE_7__constants__.INITIAL_PROPS.RAW
                  )
                    props = props.value
                  else {
                    if (
                      props.type !==
                      __WEBPACK_IMPORTED_MODULE_7__constants__.INITIAL_PROPS.UID
                    )
                      throw new Error('Unrecognized props type: ' + props.type)
                    var parentComponentWindow = __webpack_require__.i(
                      __WEBPACK_IMPORTED_MODULE_5__window__.b
                    )()
                    if (
                      !__webpack_require__.i(
                        __WEBPACK_IMPORTED_MODULE_1_cross_domain_utils_src__.isSameDomain
                      )(parentComponentWindow)
                    ) {
                      if (window.location.protocol === 'file:')
                        throw new Error('Can not get props from file:// domain')
                      throw new Error(
                        'Parent component window is on a different domain - expected ' +
                          __webpack_require__.i(
                            __WEBPACK_IMPORTED_MODULE_6__lib__.d
                          )() +
                          ' - can not retrieve props'
                      )
                    }
                    props = __webpack_require__.i(
                      __WEBPACK_IMPORTED_MODULE_6__lib__.e
                    )(parentComponentWindow).props[componentMeta.uid]
                  }
                  if (!props) throw new Error('Initial props not found')
                  return __webpack_require__.i(
                    __WEBPACK_IMPORTED_MODULE_6__lib__.f
                  )(props, function(_ref2) {
                    var fullKey = _ref2.fullKey,
                      self = _ref2.self,
                      args = _ref2.args
                    return _this2.onInit.then(function() {
                      return __webpack_require__
                        .i(__WEBPACK_IMPORTED_MODULE_6__lib__.g)(
                          _this2.props,
                          fullKey
                        )
                        .apply(self, args)
                    })
                  })
                }
              }
            },
            {
              key: 'setProps',
              value: function() {
                var props = arguments.length > 0 && void 0 !== arguments[0]
                  ? arguments[0]
                  : {},
                  origin = arguments[1],
                  required =
                    !(arguments.length > 2 && void 0 !== arguments[2]) ||
                    arguments[2]
                window.xprops = this.props = this.props || {}
                __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_6__lib__.h)(
                  this.props,
                  __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_8__props__.a)(
                    this.component,
                    props,
                    origin,
                    required
                  )
                )
                for (
                  var _iterator = this.onPropHandlers,
                    _isArray = Array.isArray(_iterator),
                    _i = 0,
                    _iterator = _isArray
                      ? _iterator
                      : _iterator[Symbol.iterator]();
                  ;

                ) {
                  var _ref3
                  if (_isArray) {
                    if (_i >= _iterator.length) break
                    _ref3 = _iterator[_i++]
                  } else {
                    _i = _iterator.next()
                    if (_i.done) break
                    _ref3 = _i.value
                  }
                  _ref3.call(this, this.props)
                }
              }
            },
            {
              key: 'sendToParent',
              value: function(name, data) {
                if (
                  !__webpack_require__.i(
                    __WEBPACK_IMPORTED_MODULE_5__window__.b
                  )()
                )
                  throw new Error(
                    'Can not find parent component window to message'
                  )
                this.component.log('send_to_parent_' + name)
                return __webpack_require__.i(
                  __WEBPACK_IMPORTED_MODULE_2_post_robot_src__.b
                )(
                  __webpack_require__.i(
                    __WEBPACK_IMPORTED_MODULE_5__window__.b
                  )(),
                  name,
                  data,
                  {
                    domain: __webpack_require__.i(
                      __WEBPACK_IMPORTED_MODULE_5__window__.a
                    )()
                  }
                )
              }
            },
            {
              key: 'setWindows',
              value: function() {
                if (window.__activeXComponent__)
                  throw this.component.error(
                    'Can not attach multiple components to the same window'
                  )
                window.__activeXComponent__ = this
                if (
                  !__webpack_require__.i(
                    __WEBPACK_IMPORTED_MODULE_5__window__.b
                  )()
                )
                  throw this.component.error('Can not find parent window')
                var componentMeta = __webpack_require__.i(
                  __WEBPACK_IMPORTED_MODULE_5__window__.d
                )()
                if (componentMeta.tag !== this.component.tag)
                  throw this.component.error(
                    'Parent is ' +
                      componentMeta.tag +
                      ' - can not attach ' +
                      this.component.tag
                  )
                this.watchForClose()
              }
            },
            {
              key: 'sendLogsToOpener',
              value: function() {}
            },
            {
              key: 'watchForClose',
              value: function() {
                var _this3 = this
                __webpack_require__.i(
                  __WEBPACK_IMPORTED_MODULE_6__lib__.i
                )(
                  __webpack_require__.i(
                    __WEBPACK_IMPORTED_MODULE_5__window__.b
                  )(),
                  function() {
                    _this3.component.log('parent_window_closed')
                    if (
                      _this3.context ===
                      __WEBPACK_IMPORTED_MODULE_7__constants__.CONTEXT_TYPES
                        .POPUP
                    )
                      return _this3.destroy()
                  }
                )
              }
            },
            {
              key: 'enableAutoResize',
              value: function() {
                var _ref5 = arguments.length > 0 && void 0 !== arguments[0]
                  ? arguments[0]
                  : {},
                  _ref5$width = _ref5.width,
                  width = void 0 === _ref5$width || _ref5$width,
                  _ref5$height = _ref5.height,
                  height = void 0 === _ref5$height || _ref5$height
                this.autoResize = {
                  width: width,
                  height: height
                }
                this.watchForResize()
              }
            },
            {
              key: 'getAutoResize',
              value: function() {
                var width = !1,
                  height = !1,
                  autoResize = this.autoResize || this.component.autoResize
                if (
                  (void 0 === autoResize
                    ? 'undefined'
                    : _typeof(autoResize)) === 'object'
                ) {
                  width = Boolean(autoResize.width)
                  height = Boolean(autoResize.height)
                } else if (autoResize) {
                  width = !0
                  height = !0
                }
                var element = void 0
                autoResize.element &&
                  (element = __webpack_require__.i(
                    __WEBPACK_IMPORTED_MODULE_6__lib__.j
                  )(autoResize.element))
                element ||
                  (element = window.navigator.userAgent.match(/MSIE (9|10)\./)
                    ? document.body
                    : document.documentElement)
                return {
                  width: width,
                  height: height,
                  element: element
                }
              }
            },
            {
              key: 'watchForResize',
              value: function() {
                var _this4 = this,
                  _getAutoResize = this.getAutoResize(),
                  width = _getAutoResize.width,
                  height = _getAutoResize.height,
                  element = _getAutoResize.element
                if (
                  (width || height) &&
                  this.context !==
                    __WEBPACK_IMPORTED_MODULE_7__constants__.CONTEXT_TYPES
                      .POPUP &&
                  !this.watchingForResize
                ) {
                  this.watchingForResize = !0
                  return __WEBPACK_IMPORTED_MODULE_3_sync_browser_mocks_src_promise__.a
                    .try(function() {
                      return __WEBPACK_IMPORTED_MODULE_6__lib__.k
                    })
                    .then(function() {
                      if (
                        !__webpack_require__.i(
                          __WEBPACK_IMPORTED_MODULE_6__lib__.l
                        )(element, {
                          width: width,
                          height: height
                        })
                      ) {
                        return _this4.resizeToElement(element, {
                          width: width,
                          height: height
                        })
                      }
                    })
                    .then(function() {
                      return __webpack_require__.i(
                        __WEBPACK_IMPORTED_MODULE_6__lib__.m
                      )(function() {
                        return __webpack_require__
                          .i(__WEBPACK_IMPORTED_MODULE_6__lib__.n)(element, {
                            width: width,
                            height: height
                          })
                          .then(function(dimensions) {
                            return _this4.resizeToElement(element, {
                              width: width,
                              height: height
                            })
                          })
                      })
                    })
                }
              }
            },
            {
              key: 'exports',
              value: function() {
                var self = this
                return {
                  updateProps: function(props) {
                    return self.setProps(props, this.origin, !1)
                  },
                  close: function() {
                    return self.destroy()
                  }
                }
              }
            },
            {
              key: 'resize',
              value: function(width, height) {
                var _this5 = this
                return __WEBPACK_IMPORTED_MODULE_3_sync_browser_mocks_src_promise__.a
                  .resolve()
                  .then(function() {
                    _this5.component.log('resize', {
                      width: width,
                      height: height
                    })
                    if (
                      _this5.context !==
                      __WEBPACK_IMPORTED_MODULE_7__constants__.CONTEXT_TYPES
                        .POPUP
                    ) {
                      return _this5.sendToParent(
                        __WEBPACK_IMPORTED_MODULE_7__constants__.POST_MESSAGE
                          .RESIZE,
                        {
                          width: width,
                          height: height
                        }
                      )
                    }
                  })
              }
            },
            {
              key: 'resizeToElement',
              value: function(el, _ref6) {
                var _this6 = this,
                  width = _ref6.width,
                  height = _ref6.height,
                  history = []
                return (function resize() {
                  return __WEBPACK_IMPORTED_MODULE_3_sync_browser_mocks_src_promise__.a.try(
                    function() {
                      for (
                        var tracker = __webpack_require__.i(
                          __WEBPACK_IMPORTED_MODULE_6__lib__.o
                        )(el, {
                          width: width,
                          height: height
                        }),
                          _tracker$check = tracker.check(),
                          dimensions = _tracker$check.dimensions,
                          _iterator3 = history,
                          _isArray3 = Array.isArray(_iterator3),
                          _i4 = 0,
                          _iterator3 = _isArray3
                            ? _iterator3
                            : _iterator3[Symbol.iterator]();
                        ;

                      ) {
                        var _ref7
                        if (_isArray3) {
                          if (_i4 >= _iterator3.length) break
                          _ref7 = _iterator3[_i4++]
                        } else {
                          _i4 = _iterator3.next()
                          if (_i4.done) break
                          _ref7 = _i4.value
                        }
                        var size = _ref7,
                          widthMatch =
                            !width || size.width === dimensions.width,
                          heightMatch =
                            !height || size.height === dimensions.height
                        if (widthMatch && heightMatch) return
                      }
                      history.push({
                        width: dimensions.width,
                        height: dimensions.height
                      })
                      return _this6
                        .resize(
                          width ? dimensions.width : null,
                          height ? dimensions.height : null
                        )
                        .then(function() {
                          if (tracker.check().changed) return resize()
                        })
                    }
                  )
                })()
              }
            },
            {
              key: 'hide',
              value: function() {
                return this.sendToParent(
                  __WEBPACK_IMPORTED_MODULE_7__constants__.POST_MESSAGE.HIDE
                )
              }
            },
            {
              key: 'show',
              value: function() {
                return this.sendToParent(
                  __WEBPACK_IMPORTED_MODULE_7__constants__.POST_MESSAGE.SHOW
                )
              }
            },
            {
              key: 'userClose',
              value: function() {
                return this.close(
                  __WEBPACK_IMPORTED_MODULE_7__constants__.CLOSE_REASONS
                    .USER_CLOSED
                )
              }
            },
            {
              key: 'close',
              value: function() {
                var reason = arguments.length > 0 && void 0 !== arguments[0]
                  ? arguments[0]
                  : __WEBPACK_IMPORTED_MODULE_7__constants__.CLOSE_REASONS
                      .CHILD_CALL
                this.component.log('close_child')
                this.sendToParent(
                  __WEBPACK_IMPORTED_MODULE_7__constants__.POST_MESSAGE.CLOSE,
                  {
                    reason: reason
                  },
                  {
                    fireAndForget: !0
                  }
                )
              }
            },
            {
              key: 'destroy',
              value: function() {
                __WEBPACK_IMPORTED_MODULE_0_beaver_logger_client__
                  .f()
                  .then(function() {
                    window.close()
                  })
              }
            },
            {
              key: 'focus',
              value: function() {
                this.component.log('focus')
                window.focus()
              }
            },
            {
              key: 'error',
              value: function(err) {
                this.component.logError('error', {
                  error: err.stack || err.toString()
                })
                return this.sendToParent(
                  __WEBPACK_IMPORTED_MODULE_7__constants__.POST_MESSAGE.ERROR,
                  {
                    error: err.stack || err.toString()
                  }
                )
              }
            }
          ])
          return ChildComponent
        })(__WEBPACK_IMPORTED_MODULE_4__base__.a)
    },
    function(module, __webpack_exports__, __webpack_require__) {
      'use strict'
      var __WEBPACK_IMPORTED_MODULE_0__component__ = __webpack_require__(66)
      __webpack_require__.d(__webpack_exports__, 'a', function() {
        return __WEBPACK_IMPORTED_MODULE_0__component__.a
      })
      __webpack_require__.d(__webpack_exports__, 'b', function() {
        return __WEBPACK_IMPORTED_MODULE_0__component__.b
      })
      __webpack_require__.d(__webpack_exports__, 'd', function() {
        return __WEBPACK_IMPORTED_MODULE_0__component__.c
      })
      __webpack_require__.d(__webpack_exports__, 'e', function() {
        return __WEBPACK_IMPORTED_MODULE_0__component__.d
      })
      var __WEBPACK_IMPORTED_MODULE_1__parent__ = __webpack_require__(24)
      __webpack_require__.d(__webpack_exports__, 'c', function() {
        return __WEBPACK_IMPORTED_MODULE_1__parent__.a
      })
      __webpack_require__(35)
    },
    function(module, __webpack_exports__, __webpack_require__) {
      'use strict'
      var __WEBPACK_IMPORTED_MODULE_0_sync_browser_mocks_src_promise__ = __webpack_require__(
        4
      ),
        __WEBPACK_IMPORTED_MODULE_1_post_robot_src__ = __webpack_require__(9),
        __WEBPACK_IMPORTED_MODULE_2_cross_domain_utils_src__ = __webpack_require__(
          0
        ),
        __WEBPACK_IMPORTED_MODULE_3__lib__ = (__webpack_require__.n(
          __WEBPACK_IMPORTED_MODULE_2_cross_domain_utils_src__
        ), __webpack_require__(2)),
        __WEBPACK_IMPORTED_MODULE_4__constants__ = __webpack_require__(7),
        __WEBPACK_IMPORTED_MODULE_5__window__ = __webpack_require__(17)
      __webpack_require__.d(__webpack_exports__, 'a', function() {
        return RENDER_DRIVERS
      })
      var RENDER_DRIVERS = {}
      RENDER_DRIVERS[
        __WEBPACK_IMPORTED_MODULE_4__constants__.CONTEXT_TYPES.IFRAME
      ] = {
        renderedIntoContainerTemplate: !0,
        allowResize: !0,
        openOnClick: !1,
        errorOnCloseDuringInit: !0,
        open: function(element) {
          var _this = this
          if (
            element &&
            !__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__lib__.j)(
              element
            )
          )
            throw this.component.error('Can not find element ' + element)
          var options = {
            attributes: {
              name: this.childWindowName,
              scrolling: this.component.scrolling ? 'yes' : 'no'
            }
          },
            frame = (this.iframe = __webpack_require__.i(
              __WEBPACK_IMPORTED_MODULE_3__lib__.J
            )(null, options, this.element))
          this.window = frame.contentWindow
          var detectClose = function() {
            return __WEBPACK_IMPORTED_MODULE_0_sync_browser_mocks_src_promise__.a
              .try(function() {
                return _this.props.onClose(
                  __WEBPACK_IMPORTED_MODULE_4__constants__.CLOSE_REASONS
                    .CLOSE_DETECTED
                )
              })
              .finally(function() {
                return _this.destroy()
              })
          },
            iframeWatcher = __webpack_require__.i(
              __WEBPACK_IMPORTED_MODULE_3__lib__.O
            )(this.iframe, detectClose),
            elementWatcher = __webpack_require__.i(
              __WEBPACK_IMPORTED_MODULE_3__lib__.O
            )(this.element, detectClose)
          frame.addEventListener('error', function(err) {
            return _this.error(err)
          })
          __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__lib__.C)(
            this.element
          )
          var sacrificialIframe = void 0
          if (this.component.sacrificialComponentTemplate) {
            sacrificialIframe = __webpack_require__.i(
              __WEBPACK_IMPORTED_MODULE_3__lib__.J
            )(null, options, this.element)
            this.componentTemplateWindow = sacrificialIframe.contentWindow
            __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__lib__.C)(frame)
            frame.addEventListener('load', function() {
              setTimeout(function() {
                __webpack_require__.i(
                  __WEBPACK_IMPORTED_MODULE_3__lib__.C
                )(sacrificialIframe)
                __webpack_require__.i(
                  __WEBPACK_IMPORTED_MODULE_3__lib__.P
                )(sacrificialIframe)
                __webpack_require__.i(
                  __WEBPACK_IMPORTED_MODULE_3__lib__.D
                )(frame)
              }, 50)
            })
          }
          this.clean.register('destroyWindow', function() {
            iframeWatcher.cancel()
            elementWatcher.cancel()
            __webpack_require__.i(
              __WEBPACK_IMPORTED_MODULE_1_post_robot_src__.e
            )(_this.window)
            delete _this.window
            sacrificialIframe &&
              __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__lib__.P)(
                sacrificialIframe
              )
            if (_this.iframe) {
              __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__lib__.P)(
                _this.iframe
              )
              delete _this.iframe
            }
          })
        },
        delegateOverrides: {
          openContainer: __WEBPACK_IMPORTED_MODULE_4__constants__.DELEGATE
            .CALL_DELEGATE,
          destroyComponent: __WEBPACK_IMPORTED_MODULE_4__constants__.DELEGATE
            .CALL_DELEGATE,
          destroyContainer: __WEBPACK_IMPORTED_MODULE_4__constants__.DELEGATE
            .CALL_DELEGATE,
          cancelContainerEvents: __WEBPACK_IMPORTED_MODULE_4__constants__
            .DELEGATE.CALL_DELEGATE,
          createComponentTemplate: __WEBPACK_IMPORTED_MODULE_4__constants__
            .DELEGATE.CALL_DELEGATE,
          elementReady: __WEBPACK_IMPORTED_MODULE_4__constants__.DELEGATE
            .CALL_DELEGATE,
          showContainer: __WEBPACK_IMPORTED_MODULE_4__constants__.DELEGATE
            .CALL_DELEGATE,
          showComponent: __WEBPACK_IMPORTED_MODULE_4__constants__.DELEGATE
            .CALL_DELEGATE,
          hideContainer: __WEBPACK_IMPORTED_MODULE_4__constants__.DELEGATE
            .CALL_DELEGATE,
          hideComponent: __WEBPACK_IMPORTED_MODULE_4__constants__.DELEGATE
            .CALL_DELEGATE,
          hide: __WEBPACK_IMPORTED_MODULE_4__constants__.DELEGATE.CALL_DELEGATE,
          show: __WEBPACK_IMPORTED_MODULE_4__constants__.DELEGATE.CALL_DELEGATE,
          resize: __WEBPACK_IMPORTED_MODULE_4__constants__.DELEGATE
            .CALL_DELEGATE,
          loadUrl: __WEBPACK_IMPORTED_MODULE_4__constants__.DELEGATE
            .CALL_DELEGATE,
          hijackSubmit: __WEBPACK_IMPORTED_MODULE_4__constants__.DELEGATE
            .CALL_DELEGATE,
          getInitialDimensions: __WEBPACK_IMPORTED_MODULE_4__constants__
            .DELEGATE.CALL_ORIGINAL,
          renderTemplate: __WEBPACK_IMPORTED_MODULE_4__constants__.DELEGATE
            .CALL_ORIGINAL,
          openContainerFrame: __WEBPACK_IMPORTED_MODULE_4__constants__.DELEGATE
            .CALL_ORIGINAL,
          open: function(original, override) {
            return function() {
              var _this2 = this
              return override.apply(this, arguments).then(function() {
                _this2.clean.set(
                  'window',
                  __webpack_require__.i(
                    __WEBPACK_IMPORTED_MODULE_2_cross_domain_utils_src__.findFrameByName
                  )(
                    __webpack_require__.i(
                      __WEBPACK_IMPORTED_MODULE_5__window__.b
                    )(),
                    _this2.childWindowName
                  )
                )
                if (!_this2.window)
                  throw new Error(
                    'Unable to find parent component iframe window'
                  )
              })
            }
          }
        },
        resize: function(width, height) {
          width &&
            (this.element.style.width = __webpack_require__.i(
              __WEBPACK_IMPORTED_MODULE_3__lib__.Q
            )(width))
          height &&
            (this.element.style.height = __webpack_require__.i(
              __WEBPACK_IMPORTED_MODULE_3__lib__.Q
            )(height))
        },
        show: function() {
          __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__lib__.D)(
            this.element
          )
        },
        hide: function() {
          __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__lib__.C)(
            this.element
          )
        },
        loadUrl: function(url) {
          this.iframe.src = url
        }
      }
      RENDER_DRIVERS[
        __WEBPACK_IMPORTED_MODULE_4__constants__.CONTEXT_TYPES.POPUP
      ] = {
        focusable: !0,
        renderedIntoContainerTemplate: !1,
        allowResize: !1,
        openOnClick: !0,
        errorOnCloseDuringInit: !1,
        open: function() {
          var _this3 = this,
            _getInitialDimensions = this.getInitialDimensions(),
            width = _getInitialDimensions.width,
            height = _getInitialDimensions.height,
            x = _getInitialDimensions.x,
            y = _getInitialDimensions.y
          width = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__lib__.R)(
            width,
            window.outerWidth
          )
          height = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__lib__.R)(
            height,
            window.outerWidth
          )
          var pos = __webpack_require__.i(
            __WEBPACK_IMPORTED_MODULE_5__window__.f
          )({
            width: width,
            height: height,
            x: x,
            y: y
          })
          this.window = __webpack_require__.i(
            __WEBPACK_IMPORTED_MODULE_3__lib__.S
          )('', {
            name: this.childWindowName,
            width: width,
            height: height,
            top: pos.y,
            left: pos.x,
            status: 1,
            toolbar: 0,
            menubar: 0,
            resizable: 1,
            scrollbars: 1
          })
          this.clean.register('destroyWindow', function() {
            if (_this3.window) {
              _this3.window.close()
              __webpack_require__.i(
                __WEBPACK_IMPORTED_MODULE_1_post_robot_src__.e
              )(_this3.window)
              delete _this3.window
            }
          })
          this.resize(width, height)
        },
        resize: function(width, height) {},
        hide: function() {
          throw new Error('Can not hide popup')
        },
        show: function() {
          throw new Error('Can not show popup')
        },
        delegateOverrides: {
          openContainer: __WEBPACK_IMPORTED_MODULE_4__constants__.DELEGATE
            .CALL_DELEGATE,
          destroyContainer: __WEBPACK_IMPORTED_MODULE_4__constants__.DELEGATE
            .CALL_DELEGATE,
          elementReady: __WEBPACK_IMPORTED_MODULE_4__constants__.DELEGATE
            .CALL_DELEGATE,
          showContainer: __WEBPACK_IMPORTED_MODULE_4__constants__.DELEGATE
            .CALL_DELEGATE,
          showComponent: __WEBPACK_IMPORTED_MODULE_4__constants__.DELEGATE
            .CALL_DELEGATE,
          hideContainer: __WEBPACK_IMPORTED_MODULE_4__constants__.DELEGATE
            .CALL_DELEGATE,
          hideComponent: __WEBPACK_IMPORTED_MODULE_4__constants__.DELEGATE
            .CALL_DELEGATE,
          hide: __WEBPACK_IMPORTED_MODULE_4__constants__.DELEGATE.CALL_DELEGATE,
          show: __WEBPACK_IMPORTED_MODULE_4__constants__.DELEGATE.CALL_DELEGATE,
          cancelContainerEvents: __WEBPACK_IMPORTED_MODULE_4__constants__
            .DELEGATE.CALL_DELEGATE,
          open: __WEBPACK_IMPORTED_MODULE_4__constants__.DELEGATE.CALL_ORIGINAL,
          loadUrl: __WEBPACK_IMPORTED_MODULE_4__constants__.DELEGATE
            .CALL_ORIGINAL,
          createComponentTemplate: __WEBPACK_IMPORTED_MODULE_4__constants__
            .DELEGATE.CALL_ORIGINAL,
          destroyComponent: __WEBPACK_IMPORTED_MODULE_4__constants__.DELEGATE
            .CALL_ORIGINAL,
          resize: __WEBPACK_IMPORTED_MODULE_4__constants__.DELEGATE
            .CALL_ORIGINAL,
          getInitialDimensions: __WEBPACK_IMPORTED_MODULE_4__constants__
            .DELEGATE.CALL_ORIGINAL,
          renderTemplate: __WEBPACK_IMPORTED_MODULE_4__constants__.DELEGATE
            .CALL_ORIGINAL,
          openContainerFrame: __WEBPACK_IMPORTED_MODULE_4__constants__.DELEGATE
            .CALL_ORIGINAL
        },
        loadUrl: function(url) {
          this.window.location = url
        }
      }
    },
    function(module, __webpack_exports__, __webpack_require__) {
      'use strict'
      function isDefined(value) {
        return value !== null && void 0 !== value && value !== ''
      }
      function getDefault(component, prop, props) {
        if (prop.def)
          return prop.def instanceof Function
            ? prop.def.call(component, props)
            : prop.def
      }
      function normalizeProp(component, instance, props, key, value) {
        var prop = component.props[key]
        prop.value
          ? (value = prop.value)
          : (props.hasOwnProperty(key) && isDefined(value)) ||
              (value = getDefault(component, prop, props))
        !value && prop.alias && props[prop.alias] && (value = props[prop.alias])
        prop.decorate &&
          ((!isDefined(value) && prop.required) ||
            (value = prop.decorate(value, props)))
        if (prop.getter) {
          if (!value) return
          if (value instanceof Function) value = value.bind(instance)
          else {
            var val = value
            value = function() {
              return (
                val ||
                __WEBPACK_IMPORTED_MODULE_0_sync_browser_mocks_src_promise__.a.resolve(
                  val
                )
              )
            }
          }
          value = __webpack_require__.i(
            __WEBPACK_IMPORTED_MODULE_2__lib__.T
          )(value, {
            name: key,
            timeout: prop.timeout
          })
          var _value = value
          value = function() {
            component.log('call_getter_' + key)
            return _value.apply(this, arguments).then(function(result) {
              component.log('return_getter_' + key)
              __webpack_require__.i(
                __WEBPACK_IMPORTED_MODULE_1__validate__.c
              )(prop, key, result, props)
              return result
            })
          }
          if (prop.memoize) {
            var _val = __webpack_require__.i(
              __WEBPACK_IMPORTED_MODULE_2__lib__.s
            )(value)
            value = function() {
              return _val()
            }
          }
          return value
        }
        if (prop.type === 'boolean') value = Boolean(value)
        else if (prop.type === 'function') {
          if (value) {
            value = value.bind(instance)
            prop.denodeify &&
              (value = __webpack_require__.i(
                __WEBPACK_IMPORTED_MODULE_2__lib__.U
              )(value))
            prop.promisify &&
              (value = __webpack_require__.i(
                __WEBPACK_IMPORTED_MODULE_2__lib__.V
              )(value))
            var original = value
            value = function() {
              component.log('call_prop_' + key)
              return original.apply(this, arguments)
            }
            prop.once &&
              (value = __webpack_require__.i(
                __WEBPACK_IMPORTED_MODULE_2__lib__.q
              )(value))
            prop.memoize &&
              (value = __webpack_require__.i(
                __WEBPACK_IMPORTED_MODULE_2__lib__.s
              )(value))
          } else if (!value && prop.noop) {
            value = __WEBPACK_IMPORTED_MODULE_2__lib__.y
            prop.denodeify &&
              (value = __webpack_require__.i(
                __WEBPACK_IMPORTED_MODULE_2__lib__.U
              )(value))
            prop.promisify &&
              (value = __webpack_require__.i(
                __WEBPACK_IMPORTED_MODULE_2__lib__.V
              )(value))
          }
        } else
          prop.type === 'string' ||
            prop.type === 'object' ||
            (prop.type === 'number' &&
              void 0 !== value &&
              (value = parseInt(value, 10)))
        return value
      }
      function normalizeProps(component, instance, props) {
        !(arguments.length > 3 && void 0 !== arguments[3]) || arguments[3]
        props = props || {}
        for (
          var result = {},
            _iterator = Object.keys(props),
            _isArray = Array.isArray(_iterator),
            _i = 0,
            _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();
          ;

        ) {
          var _ref
          if (_isArray) {
            if (_i >= _iterator.length) break
            _ref = _iterator[_i++]
          } else {
            _i = _iterator.next()
            if (_i.done) break
            _ref = _i.value
          }
          var key = _ref
          component.props.hasOwnProperty(key)
            ? (result[key] = normalizeProp(
                component,
                instance,
                props,
                key,
                props[key]
              ))
            : (result[key] = props[key])
        }
        for (
          var _iterator2 = Object.keys(component.props),
            _isArray2 = Array.isArray(_iterator2),
            _i2 = 0,
            _iterator2 = _isArray2 ? _iterator2 : _iterator2[Symbol.iterator]();
          ;

        ) {
          var _ref2
          if (_isArray2) {
            if (_i2 >= _iterator2.length) break
            _ref2 = _iterator2[_i2++]
          } else {
            _i2 = _iterator2.next()
            if (_i2.done) break
            _ref2 = _i2.value
          }
          var _key = _ref2
          if (!props.hasOwnProperty(_key)) {
            var normalizedProp = normalizeProp(
              component,
              instance,
              props,
              _key,
              props[_key]
            )
            void 0 !== normalizedProp && (result[_key] = normalizedProp)
          }
        }
        return result
      }
      function propsToQuery(propsDef, props) {
        var params = {}
        return __WEBPACK_IMPORTED_MODULE_0_sync_browser_mocks_src_promise__.a
          .all(
            Object.keys(props).map(function(key) {
              var prop = propsDef[key]
              if (prop) {
                var queryParam = key
                typeof prop.queryParam === 'string' &&
                  (queryParam = prop.queryParam)
                return __WEBPACK_IMPORTED_MODULE_0_sync_browser_mocks_src_promise__.a
                  .resolve()
                  .then(function() {
                    var value = props[key]
                    if (value && prop.queryParam) {
                      return prop.getter
                        ? value.call().then(function(result) {
                            return result
                          })
                        : value
                    }
                  })
                  .then(function(value) {
                    if (value) {
                      typeof prop.queryParam === 'function' &&
                        (queryParam = prop.queryParam(value))
                      var result = void 0
                      if (typeof value === 'boolean') result = '1'
                      else if (typeof value === 'string')
                        result = value.toString()
                      else {
                        if (typeof value === 'function') return
                        if (
                          (void 0 === value ? 'undefined' : _typeof(value)) ===
                          'object'
                        ) {
                          if (prop.serialization !== 'json') {
                            result = __webpack_require__.i(
                              __WEBPACK_IMPORTED_MODULE_2__lib__.W
                            )(value, key)
                            for (var dotkey in result)
                              params[dotkey] = result[dotkey]
                            return
                          }
                          result = JSON.stringify(value)
                        } else
                          typeof value === 'number' &&
                            (result = value.toString())
                      }
                      params[queryParam] = result
                    }
                  })
              }
            })
          )
          .then(function() {
            return params
          })
      }
      var __WEBPACK_IMPORTED_MODULE_0_sync_browser_mocks_src_promise__ = __webpack_require__(
        4
      ),
        __WEBPACK_IMPORTED_MODULE_1__validate__ = __webpack_require__(39),
        __WEBPACK_IMPORTED_MODULE_2__lib__ = __webpack_require__(2)
      __webpack_exports__.a = normalizeProps
      __webpack_exports__.b = propsToQuery
      var _typeof = typeof Symbol === 'function' &&
        typeof Symbol.iterator === 'symbol'
        ? function(obj) {
            return typeof obj
          }
        : function(obj) {
            return obj &&
              typeof Symbol === 'function' &&
              obj.constructor === Symbol &&
              obj !== Symbol.prototype
              ? 'symbol'
              : typeof obj
          }
    },
    function(module, __webpack_exports__, __webpack_require__) {
      'use strict'
      function validateProp(prop, key, value, props) {
        var required =
          !(arguments.length > 4 && void 0 !== arguments[4]) || arguments[4]
        if (value !== null && void 0 !== value && value !== '') {
          if (!value.then || !prop.promise) {
            if (prop.type === 'function') {
              if (!(value instanceof Function))
                throw new Error('Prop is not of type function: ' + key)
            } else if (prop.type === 'string') {
              if (
                !(typeof value === 'string' ||
                  (prop.getter &&
                    (value instanceof Function || (value && value.then))))
              )
                throw new Error('Prop is not of type string: ' + key)
            } else if (prop.type === 'object') {
              try {
                JSON.stringify(value)
              } catch (err) {
                throw new Error('Unable to serialize prop: ' + key)
              }
            } else if (prop.type === 'number' && isNaN(parseInt(value, 10)))
              throw new Error('Prop is not a number: ' + key)
            typeof prop.validate === 'function' && prop.validate(value, props)
          }
        } else if (
          required &&
          prop.required !== !1 &&
          !prop.hasOwnProperty('def')
        )
          throw new Error('Prop is required: ' + key)
      }
      function validateProps(component, props) {
        var required =
          !(arguments.length > 2 && void 0 !== arguments[2]) || arguments[2]
        props = props || {}
        for (
          var _iterator = Object.keys(component.props),
            _isArray = Array.isArray(_iterator),
            _i = 0,
            _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();
          ;

        ) {
          var _ref
          if (_isArray) {
            if (_i >= _iterator.length) break
            _ref = _iterator[_i++]
          } else {
            _i = _iterator.next()
            if (_i.done) break
            _ref = _i.value
          }
          var _key = _ref, prop = component.props[_key]
          if (prop.alias && props.hasOwnProperty(prop.alias)) {
            var value = props[prop.alias]
            delete props[prop.alias]
            props[_key] || (props[_key] = value)
          }
        }
        if (!component.looseProps) {
          for (
            var _iterator2 = Object.keys(props),
              _isArray2 = Array.isArray(_iterator2),
              _i2 = 0,
              _iterator2 = _isArray2
                ? _iterator2
                : _iterator2[Symbol.iterator]();
            ;

          ) {
            var _ref2
            if (_isArray2) {
              if (_i2 >= _iterator2.length) break
              _ref2 = _iterator2[_i2++]
            } else {
              _i2 = _iterator2.next()
              if (_i2.done) break
              _ref2 = _i2.value
            }
            var key = _ref2
            if (!component.props.hasOwnProperty(key))
              throw component.error('Invalid prop: ' + key)
          }
        }
        for (
          var _iterator3 = Object.keys(props),
            _isArray3 = Array.isArray(_iterator3),
            _i3 = 0,
            _iterator3 = _isArray3 ? _iterator3 : _iterator3[Symbol.iterator]();
          ;

        ) {
          var _ref3
          if (_isArray3) {
            if (_i3 >= _iterator3.length) break
            _ref3 = _iterator3[_i3++]
          } else {
            _i3 = _iterator3.next()
            if (_i3.done) break
            _ref3 = _i3.value
          }
          var _key2 = _ref3,
            _prop = component.props[_key2],
            _value = props[_key2]
          _prop && validateProp(_prop, _key2, _value, props, required)
        }
        for (
          var _iterator4 = Object.keys(component.props),
            _isArray4 = Array.isArray(_iterator4),
            _i4 = 0,
            _iterator4 = _isArray4 ? _iterator4 : _iterator4[Symbol.iterator]();
          ;

        ) {
          var _ref4
          if (_isArray4) {
            if (_i4 >= _iterator4.length) break
            _ref4 = _iterator4[_i4++]
          } else {
            _i4 = _iterator4.next()
            if (_i4.done) break
            _ref4 = _i4.value
          }
          var _key3 = _ref4,
            _prop2 = component.props[_key3],
            _value2 = props[_key3]
          props.hasOwnProperty(_key3) ||
            validateProp(_prop2, _key3, _value2, props, required)
        }
      }
      function validate(component, options) {
        var props = options.props || {}
        if (
          props.env &&
          _typeof(component.url) === 'object' &&
          !component.url[props.env]
        )
          throw new Error('Invalid env: ' + props.env)
      }
      __webpack_exports__.c = validateProp
      __webpack_exports__.b = validateProps
      __webpack_exports__.a = validate
      var _typeof = typeof Symbol === 'function' &&
        typeof Symbol.iterator === 'symbol'
        ? function(obj) {
            return typeof obj
          }
        : function(obj) {
            return obj &&
              typeof Symbol === 'function' &&
              obj.constructor === Symbol &&
              obj !== Symbol.prototype
              ? 'symbol'
              : typeof obj
          }
    },
    function(module, __webpack_exports__, __webpack_require__) {
      'use strict'
      function noop() {}
      function once(method) {
        var called = !1
        return function() {
          if (!called) {
            called = !0
            return method.apply(this, arguments)
          }
        }
      }
      function memoize(method) {
        var results = {}
        return function() {
          var cacheKey = void 0
          try {
            cacheKey = JSON.stringify(
              Array.prototype.slice.call(arguments),
              function(key, val) {
                return typeof val === 'function'
                  ? 'xcomponent:memoize[' +
                      __webpack_require__.i(
                        __WEBPACK_IMPORTED_MODULE_0__util__.b
                      )(val) +
                      ']'
                  : val
              }
            )
          } catch (err) {
            throw new Error(
              'Arguments not serializable -- can not be used to memoize'
            )
          }
          results.hasOwnProperty(cacheKey) ||
            (results[cacheKey] = method.apply(this, arguments))
          return results[cacheKey]
        }
      }
      function debounce(method) {
        var time = arguments.length > 1 && void 0 !== arguments[1]
          ? arguments[1]
          : 100,
          timeout = void 0
        return function() {
          var _this = this, _arguments = arguments
          clearTimeout(timeout)
          timeout = setTimeout(function() {
            return method.apply(_this, _arguments)
          }, time)
        }
      }
      function serializeFunctions(obj) {
        return __webpack_require__.i(
          __WEBPACK_IMPORTED_MODULE_0__util__.c
        )(obj, function(value, key, fullKey) {
          if (value instanceof Function) {
            return {
              __type__: '__function__'
            }
          }
        })
      }
      function deserializeFunctions(obj, handler) {
        return __webpack_require__.i(
          __WEBPACK_IMPORTED_MODULE_0__util__.c
        )(obj, function(value, key, fullKey) {
          if (value && value.__type__ === '__function__') {
            return function() {
              return handler({
                key: key,
                fullKey: fullKey,
                self: this,
                args: arguments
              })
            }
          }
        })
      }
      var __WEBPACK_IMPORTED_MODULE_0__util__ = __webpack_require__(25)
      __webpack_exports__.b = noop
      __webpack_exports__.a = once
      __webpack_exports__.c = memoize
      __webpack_exports__.d = debounce
      __webpack_exports__.f = serializeFunctions
      __webpack_exports__.e = deserializeFunctions
    },
    function(module, __webpack_exports__, __webpack_require__) {
      'use strict'
      function init(conf) {
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__util__.d)(
          __WEBPACK_IMPORTED_MODULE_0__config__.a,
          conf || {}
        )
        if (!initiated) {
          initiated = !0
          __WEBPACK_IMPORTED_MODULE_0__config__.a.logPerformance &&
            __webpack_require__.i(
              __WEBPACK_IMPORTED_MODULE_2__performance__.c
            )()
          __WEBPACK_IMPORTED_MODULE_0__config__.a.heartbeat &&
            __webpack_require__.i(
              __WEBPACK_IMPORTED_MODULE_2__performance__.d
            )()
          if (__WEBPACK_IMPORTED_MODULE_0__config__.a.logUnload) {
            var async = !__WEBPACK_IMPORTED_MODULE_0__config__.a.logUnloadSync
            window.addEventListener('beforeunload', function() {
              __webpack_require__.i(
                __WEBPACK_IMPORTED_MODULE_3__logger__.j
              )('window_beforeunload')
              __webpack_require__.i(
                __WEBPACK_IMPORTED_MODULE_3__logger__.e
              )(async)
            })
            window.addEventListener('unload', function() {
              __webpack_require__.i(
                __WEBPACK_IMPORTED_MODULE_3__logger__.j
              )('window_unload')
              __webpack_require__.i(
                __WEBPACK_IMPORTED_MODULE_3__logger__.e
              )(async)
            })
          }
          __WEBPACK_IMPORTED_MODULE_0__config__.a.flushInterval &&
            setInterval(
              __WEBPACK_IMPORTED_MODULE_3__logger__.f,
              __WEBPACK_IMPORTED_MODULE_0__config__.a.flushInterval
            )
          if (window.beaverLogQueue) {
            window.beaverLogQueue.forEach(function(payload) {
              __webpack_require__.i(
                __WEBPACK_IMPORTED_MODULE_3__logger__.g
              )(payload.level, payload.event, payload)
            })
            delete window.beaverLogQueue
          }
        }
      }
      var __WEBPACK_IMPORTED_MODULE_0__config__ = __webpack_require__(11),
        __WEBPACK_IMPORTED_MODULE_1__util__ = __webpack_require__(15),
        __WEBPACK_IMPORTED_MODULE_2__performance__ = __webpack_require__(27),
        __WEBPACK_IMPORTED_MODULE_3__logger__ = __webpack_require__(14)
      __webpack_exports__.a = init
      var initiated = !1
    },
    function(module, __webpack_exports__, __webpack_require__) {
      'use strict'
      function startTransition() {
        startTime = __webpack_require__.i(
          __WEBPACK_IMPORTED_MODULE_0__performance__.a
        )()
      }
      function endTransition(toState) {
        startTime =
          startTime ||
          __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__performance__.b)()
        var currentTime = __webpack_require__.i(
          __WEBPACK_IMPORTED_MODULE_0__performance__.a
        )(),
          elapsedTime = void 0
        void 0 !== startTime &&
          (elapsedTime = parseInt(currentTime - startTime, 0))
        var transitionName = 'transition_' + currentState + '_to_' + toState
        __webpack_require__.i(
          __WEBPACK_IMPORTED_MODULE_1__logger__.j
        )(transitionName, {
          duration: elapsedTime
        })
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__logger__.a)({
          transition: transitionName,
          transition_time: elapsedTime
        })
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__logger__.e)()
        startTime = currentTime
        currentState = toState
        pageID = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__util__.a)()
      }
      function transition(toState) {
        startTransition()
        endTransition(toState)
      }
      var __WEBPACK_IMPORTED_MODULE_0__performance__ = __webpack_require__(27),
        __WEBPACK_IMPORTED_MODULE_1__logger__ = __webpack_require__(14),
        __WEBPACK_IMPORTED_MODULE_2__builders__ = __webpack_require__(13),
        __WEBPACK_IMPORTED_MODULE_3__util__ = __webpack_require__(15),
        __WEBPACK_IMPORTED_MODULE_4__config__ = __webpack_require__(11)
      __webpack_exports__.a = startTransition
      __webpack_exports__.b = endTransition
      __webpack_exports__.c = transition
      var windowID = __webpack_require__.i(
        __WEBPACK_IMPORTED_MODULE_3__util__.a
      )(),
        pageID = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__util__.a)(),
        currentState =
          __WEBPACK_IMPORTED_MODULE_4__config__.a.initial_state_name,
        startTime = void 0
      __webpack_require__.i(
        __WEBPACK_IMPORTED_MODULE_2__builders__.e
      )(function() {
        return {
          windowID: windowID,
          pageID: pageID
        }
      })
      __webpack_require__.i(
        __WEBPACK_IMPORTED_MODULE_2__builders__.f
      )(function() {
        return {
          state: 'ui_' + currentState
        }
      })
    },
    function(module, __webpack_exports__, __webpack_require__) {
      'use strict'
      function hasNativeWeakMap() {
        if (!window.WeakMap) return !1
        if (!window.Object.freeze) return !1
        try {
          var testWeakMap = new window.WeakMap(), testKey = {}
          window.Object.freeze(testKey)
          testWeakMap.set(testKey, '__testvalue__')
          return testWeakMap.get(testKey) === '__testvalue__'
        } catch (err) {
          return !1
        }
      }
      __webpack_exports__.a = hasNativeWeakMap
    },
    function(module, __webpack_exports__, __webpack_require__) {
      'use strict'
      function isWindow(obj) {
        try {
          if (obj && obj.self === obj) return !0
        } catch (err) {}
        return !1
      }
      function isClosedWindow(obj) {
        try {
          if (obj && obj !== window && obj.closed) return !0
        } catch (err) {
          return !err || err.message !== 'Call was rejected by callee.\r\n'
        }
        return !1
      }
      __webpack_exports__.b = isWindow
      __webpack_exports__.a = isClosedWindow
    },
    function(module, __webpack_exports__, __webpack_require__) {
      'use strict'
      function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor))
          throw new TypeError('Cannot call a class as a function')
      }
      var __WEBPACK_IMPORTED_MODULE_0__util__ = __webpack_require__(44),
        __WEBPACK_IMPORTED_MODULE_1__native__ = __webpack_require__(43)
      __webpack_require__.d(__webpack_exports__, 'a', function() {
        return WeakMap
      })
      var _createClass = (function() {
        function defineProperties(target, props) {
          for (var i = 0; i < props.length; i++) {
            var descriptor = props[i]
            descriptor.enumerable = descriptor.enumerable || !1
            descriptor.configurable = !0
            'value' in descriptor && (descriptor.writable = !0)
            Object.defineProperty(target, descriptor.key, descriptor)
          }
        }
        return function(Constructor, protoProps, staticProps) {
          protoProps && defineProperties(Constructor.prototype, protoProps)
          staticProps && defineProperties(Constructor, staticProps)
          return Constructor
        }
      })(),
        defineProperty = Object.defineProperty,
        counter = Date.now() % 1e9,
        WeakMap = (function() {
          function WeakMap() {
            _classCallCheck(this, WeakMap)
            counter += 1
            this.name =
              '__weakmap_' + ((1e9 * Math.random()) >>> 0) + '__' + counter
            if (
              __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__native__.a)()
            ) {
              try {
                this.weakmap = new window.WeakMap()
              } catch (err) {}
            }
            this.keys = []
            this.values = []
          }
          _createClass(WeakMap, [
            {
              key: '_cleanupClosedWindows',
              value: function() {
                for (
                  var weakmap = this.weakmap, keys = this.keys, i = 0;
                  i < keys.length;
                  i++
                ) {
                  var value = keys[i]
                  if (
                    __webpack_require__.i(
                      __WEBPACK_IMPORTED_MODULE_0__util__.a
                    )(value)
                  ) {
                    if (weakmap) {
                      try {
                        weakmap.delete(value)
                      } catch (err) {}
                    }
                    keys.splice(i, 1)
                    this.values.splice(i, 1)
                    i -= 1
                  }
                }
              }
            },
            {
              key: 'set',
              value: function(key, value) {
                if (!key) throw new Error('WeakMap expected key')
                var weakmap = this.weakmap
                if (weakmap) {
                  try {
                    weakmap.set(key, value)
                  } catch (err) {
                    delete this.weakmap
                  }
                }
                if (
                  __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__util__.b)(
                    key
                  )
                ) {
                  this._cleanupClosedWindows()
                  var keys = this.keys,
                    values = this.values,
                    index = keys.indexOf(key)
                  if (index === -1) {
                    keys.push(key)
                    values.push(value)
                  } else values[index] = value
                } else {
                  var name = this.name, entry = key[name]
                  entry && entry[0] === key
                    ? (entry[1] = value)
                    : defineProperty(key, name, {
                        value: [key, value],
                        writable: !0
                      })
                }
              }
            },
            {
              key: 'get',
              value: function(key) {
                if (!key) throw new Error('WeakMap expected key')
                var weakmap = this.weakmap
                if (weakmap) {
                  try {
                    if (weakmap.has(key)) return weakmap.get(key)
                  } catch (err) {
                    delete this.weakmap
                  }
                }
                if (
                  __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__util__.b)(
                    key
                  )
                ) {
                  var keys = this.keys, index = keys.indexOf(key)
                  if (index === -1) return
                  return this.values[index]
                }
                var entry = key[this.name]
                if (entry && entry[0] === key) return entry[1]
              }
            },
            {
              key: 'delete',
              value: function(key) {
                if (!key) throw new Error('WeakMap expected key')
                var weakmap = this.weakmap
                if (weakmap) {
                  try {
                    weakmap.delete(key)
                  } catch (err) {
                    delete this.weakmap
                  }
                }
                if (
                  __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__util__.b)(
                    key
                  )
                ) {
                  this._cleanupClosedWindows()
                  var keys = this.keys, index = keys.indexOf(key)
                  if (index !== -1) {
                    keys.splice(index, 1)
                    this.values.splice(index, 1)
                  }
                } else {
                  var entry = key[this.name]
                  entry && entry[0] === key && (entry[0] = entry[1] = void 0)
                }
              }
            },
            {
              key: 'has',
              value: function(key) {
                if (!key) throw new Error('WeakMap expected key')
                var weakmap = this.weakmap
                if (weakmap) {
                  try {
                    return weakmap.has(key)
                  } catch (err) {
                    delete this.weakmap
                  }
                }
                if (
                  __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__util__.b)(
                    key
                  )
                ) {
                  this._cleanupClosedWindows()
                  return this.keys.indexOf(key) !== -1
                }
                var entry = key[this.name]
                return !(!entry || entry[0] !== key)
              }
            }
          ])
          return WeakMap
        })()
    },
    function(module, exports, __webpack_require__) {
      'use strict'
      function isRegex(item) {
        return Object.prototype.toString.call(item) === '[object RegExp]'
      }
      Object.defineProperty(exports, '__esModule', {
        value: !0
      })
      exports.isRegex = isRegex
    },
    function(module, exports, __webpack_require__) {
      ;(function(global) {
        !(function(root, undefined) {
          'use strict'
          var NODE_JS = void 0 !== module
          NODE_JS && (root = global)
          var BASE32_ENCODE_CHAR = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'.split(''),
            BASE32_DECODE_CHAR = {
              A: 0,
              B: 1,
              C: 2,
              D: 3,
              E: 4,
              F: 5,
              G: 6,
              H: 7,
              I: 8,
              J: 9,
              K: 10,
              L: 11,
              M: 12,
              N: 13,
              O: 14,
              P: 15,
              Q: 16,
              R: 17,
              S: 18,
              T: 19,
              U: 20,
              V: 21,
              W: 22,
              X: 23,
              Y: 24,
              Z: 25,
              '2': 26,
              '3': 27,
              '4': 28,
              '5': 29,
              '6': 30,
              '7': 31
            },
            blocks = [0, 0, 0, 0, 0, 0, 0, 0],
            toUtf8String = function(bytes) {
              for (
                var b,
                  c,
                  str = '',
                  length = bytes.length,
                  i = 0,
                  followingChars = 0;
                i < length;

              ) {
                b = bytes[i++]
                if (b <= 127) str += String.fromCharCode(b)
                else {
                  if (b > 191 && b <= 223) {
                    c = 31 & b
                    followingChars = 1
                  } else if (b <= 239) {
                    c = 15 & b
                    followingChars = 2
                  } else {
                    if (!(b <= 247)) throw 'not a UTF-8 string'
                    c = 7 & b
                    followingChars = 3
                  }
                  for (var j = 0; j < followingChars; ++j) {
                    b = bytes[i++]
                    if (b < 128 || b > 191) throw 'not a UTF-8 string'
                    c <<= 6
                    c += 63 & b
                  }
                  if (c >= 55296 && c <= 57343) throw 'not a UTF-8 string'
                  if (c > 1114111) throw 'not a UTF-8 string'
                  if (c <= 65535) str += String.fromCharCode(c)
                  else {
                    c -= 65536
                    str += String.fromCharCode(55296 + (c >> 10))
                    str += String.fromCharCode(56320 + (1023 & c))
                  }
                }
              }
              return str
            },
            decodeAsBytes = function(base32Str) {
              base32Str = base32Str.replace(/=/g, '')
              for (
                var v1,
                  v2,
                  v3,
                  v4,
                  v5,
                  v6,
                  v7,
                  v8,
                  bytes = [],
                  index = 0,
                  length = base32Str.length,
                  i = 0,
                  count = length >> 3 << 3;
                i < count;

              ) {
                v1 = BASE32_DECODE_CHAR[base32Str.charAt(i++)]
                v2 = BASE32_DECODE_CHAR[base32Str.charAt(i++)]
                v3 = BASE32_DECODE_CHAR[base32Str.charAt(i++)]
                v4 = BASE32_DECODE_CHAR[base32Str.charAt(i++)]
                v5 = BASE32_DECODE_CHAR[base32Str.charAt(i++)]
                v6 = BASE32_DECODE_CHAR[base32Str.charAt(i++)]
                v7 = BASE32_DECODE_CHAR[base32Str.charAt(i++)]
                v8 = BASE32_DECODE_CHAR[base32Str.charAt(i++)]
                bytes[index++] = 255 & ((v1 << 3) | (v2 >>> 2))
                bytes[index++] = 255 & ((v2 << 6) | (v3 << 1) | (v4 >>> 4))
                bytes[index++] = 255 & ((v4 << 4) | (v5 >>> 1))
                bytes[index++] = 255 & ((v5 << 7) | (v6 << 2) | (v7 >>> 3))
                bytes[index++] = 255 & ((v7 << 5) | v8)
              }
              var remain = length - count
              if (remain == 2) {
                v1 = BASE32_DECODE_CHAR[base32Str.charAt(i++)]
                v2 = BASE32_DECODE_CHAR[base32Str.charAt(i++)]
                bytes[index++] = 255 & ((v1 << 3) | (v2 >>> 2))
              } else if (remain == 4) {
                v1 = BASE32_DECODE_CHAR[base32Str.charAt(i++)]
                v2 = BASE32_DECODE_CHAR[base32Str.charAt(i++)]
                v3 = BASE32_DECODE_CHAR[base32Str.charAt(i++)]
                v4 = BASE32_DECODE_CHAR[base32Str.charAt(i++)]
                bytes[index++] = 255 & ((v1 << 3) | (v2 >>> 2))
                bytes[index++] = 255 & ((v2 << 6) | (v3 << 1) | (v4 >>> 4))
              } else if (remain == 5) {
                v1 = BASE32_DECODE_CHAR[base32Str.charAt(i++)]
                v2 = BASE32_DECODE_CHAR[base32Str.charAt(i++)]
                v3 = BASE32_DECODE_CHAR[base32Str.charAt(i++)]
                v4 = BASE32_DECODE_CHAR[base32Str.charAt(i++)]
                v5 = BASE32_DECODE_CHAR[base32Str.charAt(i++)]
                bytes[index++] = 255 & ((v1 << 3) | (v2 >>> 2))
                bytes[index++] = 255 & ((v2 << 6) | (v3 << 1) | (v4 >>> 4))
                bytes[index++] = 255 & ((v4 << 4) | (v5 >>> 1))
              } else if (remain == 7) {
                v1 = BASE32_DECODE_CHAR[base32Str.charAt(i++)]
                v2 = BASE32_DECODE_CHAR[base32Str.charAt(i++)]
                v3 = BASE32_DECODE_CHAR[base32Str.charAt(i++)]
                v4 = BASE32_DECODE_CHAR[base32Str.charAt(i++)]
                v5 = BASE32_DECODE_CHAR[base32Str.charAt(i++)]
                v6 = BASE32_DECODE_CHAR[base32Str.charAt(i++)]
                v7 = BASE32_DECODE_CHAR[base32Str.charAt(i++)]
                bytes[index++] = 255 & ((v1 << 3) | (v2 >>> 2))
                bytes[index++] = 255 & ((v2 << 6) | (v3 << 1) | (v4 >>> 4))
                bytes[index++] = 255 & ((v4 << 4) | (v5 >>> 1))
                bytes[index++] = 255 & ((v5 << 7) | (v6 << 2) | (v7 >>> 3))
              }
              return bytes
            },
            encodeAscii = function(str) {
              for (
                var v1,
                  v2,
                  v3,
                  v4,
                  v5,
                  base32Str = '',
                  length = str.length,
                  i = 0,
                  count = 5 * parseInt(length / 5);
                i < count;

              ) {
                v1 = str.charCodeAt(i++)
                v2 = str.charCodeAt(i++)
                v3 = str.charCodeAt(i++)
                v4 = str.charCodeAt(i++)
                v5 = str.charCodeAt(i++)
                base32Str +=
                  BASE32_ENCODE_CHAR[v1 >>> 3] +
                  BASE32_ENCODE_CHAR[31 & ((v1 << 2) | (v2 >>> 6))] +
                  BASE32_ENCODE_CHAR[(v2 >>> 1) & 31] +
                  BASE32_ENCODE_CHAR[31 & ((v2 << 4) | (v3 >>> 4))] +
                  BASE32_ENCODE_CHAR[31 & ((v3 << 1) | (v4 >>> 7))] +
                  BASE32_ENCODE_CHAR[(v4 >>> 2) & 31] +
                  BASE32_ENCODE_CHAR[31 & ((v4 << 3) | (v5 >>> 5))] +
                  BASE32_ENCODE_CHAR[31 & v5]
              }
              var remain = length - count
              if (remain == 1) {
                v1 = str.charCodeAt(i)
                base32Str +=
                  BASE32_ENCODE_CHAR[v1 >>> 3] +
                  BASE32_ENCODE_CHAR[(v1 << 2) & 31] +
                  '======'
              } else if (remain == 2) {
                v1 = str.charCodeAt(i++)
                v2 = str.charCodeAt(i)
                base32Str +=
                  BASE32_ENCODE_CHAR[v1 >>> 3] +
                  BASE32_ENCODE_CHAR[31 & ((v1 << 2) | (v2 >>> 6))] +
                  BASE32_ENCODE_CHAR[(v2 >>> 1) & 31] +
                  BASE32_ENCODE_CHAR[(v2 << 4) & 31] +
                  '===='
              } else if (remain == 3) {
                v1 = str.charCodeAt(i++)
                v2 = str.charCodeAt(i++)
                v3 = str.charCodeAt(i)
                base32Str +=
                  BASE32_ENCODE_CHAR[v1 >>> 3] +
                  BASE32_ENCODE_CHAR[31 & ((v1 << 2) | (v2 >>> 6))] +
                  BASE32_ENCODE_CHAR[(v2 >>> 1) & 31] +
                  BASE32_ENCODE_CHAR[31 & ((v2 << 4) | (v3 >>> 4))] +
                  BASE32_ENCODE_CHAR[(v3 << 1) & 31] +
                  '==='
              } else if (remain == 4) {
                v1 = str.charCodeAt(i++)
                v2 = str.charCodeAt(i++)
                v3 = str.charCodeAt(i++)
                v4 = str.charCodeAt(i)
                base32Str +=
                  BASE32_ENCODE_CHAR[v1 >>> 3] +
                  BASE32_ENCODE_CHAR[31 & ((v1 << 2) | (v2 >>> 6))] +
                  BASE32_ENCODE_CHAR[(v2 >>> 1) & 31] +
                  BASE32_ENCODE_CHAR[31 & ((v2 << 4) | (v3 >>> 4))] +
                  BASE32_ENCODE_CHAR[31 & ((v3 << 1) | (v4 >>> 7))] +
                  BASE32_ENCODE_CHAR[(v4 >>> 2) & 31] +
                  BASE32_ENCODE_CHAR[(v4 << 3) & 31] +
                  '='
              }
              return base32Str
            },
            encodeUtf8 = function(str) {
              var v1,
                v2,
                v3,
                v4,
                v5,
                code,
                i,
                end = !1,
                base32Str = '',
                index = 0,
                start = 0,
                bytes = 0,
                length = str.length
              do {
                blocks[0] = blocks[5]
                blocks[1] = blocks[6]
                blocks[2] = blocks[7]
                for (i = start; index < length && i < 5; ++index) {
                  code = str.charCodeAt(index)
                  if (code < 128) blocks[i++] = code
                  else if (code < 2048) {
                    blocks[i++] = 192 | (code >> 6)
                    blocks[i++] = 128 | (63 & code)
                  } else if (code < 55296 || code >= 57344) {
                    blocks[i++] = 224 | (code >> 12)
                    blocks[i++] = 128 | ((code >> 6) & 63)
                    blocks[i++] = 128 | (63 & code)
                  } else {
                    code =
                      65536 +
                      (((1023 & code) << 10) | (1023 & str.charCodeAt(++index)))
                    blocks[i++] = 240 | (code >> 18)
                    blocks[i++] = 128 | ((code >> 12) & 63)
                    blocks[i++] = 128 | ((code >> 6) & 63)
                    blocks[i++] = 128 | (63 & code)
                  }
                }
                bytes += i - start
                start = i - 5
                index == length && ++index
                index > length && i < 6 && (end = !0)
                v1 = blocks[0]
                if (i > 4) {
                  v2 = blocks[1]
                  v3 = blocks[2]
                  v4 = blocks[3]
                  v5 = blocks[4]
                  base32Str +=
                    BASE32_ENCODE_CHAR[v1 >>> 3] +
                    BASE32_ENCODE_CHAR[31 & ((v1 << 2) | (v2 >>> 6))] +
                    BASE32_ENCODE_CHAR[(v2 >>> 1) & 31] +
                    BASE32_ENCODE_CHAR[31 & ((v2 << 4) | (v3 >>> 4))] +
                    BASE32_ENCODE_CHAR[31 & ((v3 << 1) | (v4 >>> 7))] +
                    BASE32_ENCODE_CHAR[(v4 >>> 2) & 31] +
                    BASE32_ENCODE_CHAR[31 & ((v4 << 3) | (v5 >>> 5))] +
                    BASE32_ENCODE_CHAR[31 & v5]
                } else if (i == 1)
                  base32Str +=
                    BASE32_ENCODE_CHAR[v1 >>> 3] +
                    BASE32_ENCODE_CHAR[(v1 << 2) & 31] +
                    '======'
                else if (i == 2) {
                  v2 = blocks[1]
                  base32Str +=
                    BASE32_ENCODE_CHAR[v1 >>> 3] +
                    BASE32_ENCODE_CHAR[31 & ((v1 << 2) | (v2 >>> 6))] +
                    BASE32_ENCODE_CHAR[(v2 >>> 1) & 31] +
                    BASE32_ENCODE_CHAR[(v2 << 4) & 31] +
                    '===='
                } else if (i == 3) {
                  v2 = blocks[1]
                  v3 = blocks[2]
                  base32Str +=
                    BASE32_ENCODE_CHAR[v1 >>> 3] +
                    BASE32_ENCODE_CHAR[31 & ((v1 << 2) | (v2 >>> 6))] +
                    BASE32_ENCODE_CHAR[(v2 >>> 1) & 31] +
                    BASE32_ENCODE_CHAR[31 & ((v2 << 4) | (v3 >>> 4))] +
                    BASE32_ENCODE_CHAR[(v3 << 1) & 31] +
                    '==='
                } else if (i == 4) {
                  v2 = blocks[1]
                  v3 = blocks[2]
                  v4 = blocks[3]
                  base32Str +=
                    BASE32_ENCODE_CHAR[v1 >>> 3] +
                    BASE32_ENCODE_CHAR[31 & ((v1 << 2) | (v2 >>> 6))] +
                    BASE32_ENCODE_CHAR[(v2 >>> 1) & 31] +
                    BASE32_ENCODE_CHAR[31 & ((v2 << 4) | (v3 >>> 4))] +
                    BASE32_ENCODE_CHAR[31 & ((v3 << 1) | (v4 >>> 7))] +
                    BASE32_ENCODE_CHAR[(v4 >>> 2) & 31] +
                    BASE32_ENCODE_CHAR[(v4 << 3) & 31] +
                    '='
                }
              } while (!end)
              return base32Str
            },
            encodeBytes = function(bytes) {
              for (
                var v1,
                  v2,
                  v3,
                  v4,
                  v5,
                  base32Str = '',
                  length = bytes.length,
                  i = 0,
                  count = 5 * parseInt(length / 5);
                i < count;

              ) {
                v1 = bytes[i++]
                v2 = bytes[i++]
                v3 = bytes[i++]
                v4 = bytes[i++]
                v5 = bytes[i++]
                base32Str +=
                  BASE32_ENCODE_CHAR[v1 >>> 3] +
                  BASE32_ENCODE_CHAR[31 & ((v1 << 2) | (v2 >>> 6))] +
                  BASE32_ENCODE_CHAR[(v2 >>> 1) & 31] +
                  BASE32_ENCODE_CHAR[31 & ((v2 << 4) | (v3 >>> 4))] +
                  BASE32_ENCODE_CHAR[31 & ((v3 << 1) | (v4 >>> 7))] +
                  BASE32_ENCODE_CHAR[(v4 >>> 2) & 31] +
                  BASE32_ENCODE_CHAR[31 & ((v4 << 3) | (v5 >>> 5))] +
                  BASE32_ENCODE_CHAR[31 & v5]
              }
              var remain = length - count
              if (remain == 1) {
                v1 = bytes[i]
                base32Str +=
                  BASE32_ENCODE_CHAR[v1 >>> 3] +
                  BASE32_ENCODE_CHAR[(v1 << 2) & 31] +
                  '======'
              } else if (remain == 2) {
                v1 = bytes[i++]
                v2 = bytes[i]
                base32Str +=
                  BASE32_ENCODE_CHAR[v1 >>> 3] +
                  BASE32_ENCODE_CHAR[31 & ((v1 << 2) | (v2 >>> 6))] +
                  BASE32_ENCODE_CHAR[(v2 >>> 1) & 31] +
                  BASE32_ENCODE_CHAR[(v2 << 4) & 31] +
                  '===='
              } else if (remain == 3) {
                v1 = bytes[i++]
                v2 = bytes[i++]
                v3 = bytes[i]
                base32Str +=
                  BASE32_ENCODE_CHAR[v1 >>> 3] +
                  BASE32_ENCODE_CHAR[31 & ((v1 << 2) | (v2 >>> 6))] +
                  BASE32_ENCODE_CHAR[(v2 >>> 1) & 31] +
                  BASE32_ENCODE_CHAR[31 & ((v2 << 4) | (v3 >>> 4))] +
                  BASE32_ENCODE_CHAR[(v3 << 1) & 31] +
                  '==='
              } else if (remain == 4) {
                v1 = bytes[i++]
                v2 = bytes[i++]
                v3 = bytes[i++]
                v4 = bytes[i]
                base32Str +=
                  BASE32_ENCODE_CHAR[v1 >>> 3] +
                  BASE32_ENCODE_CHAR[31 & ((v1 << 2) | (v2 >>> 6))] +
                  BASE32_ENCODE_CHAR[(v2 >>> 1) & 31] +
                  BASE32_ENCODE_CHAR[31 & ((v2 << 4) | (v3 >>> 4))] +
                  BASE32_ENCODE_CHAR[31 & ((v3 << 1) | (v4 >>> 7))] +
                  BASE32_ENCODE_CHAR[(v4 >>> 2) & 31] +
                  BASE32_ENCODE_CHAR[(v4 << 3) & 31] +
                  '='
              }
              return base32Str
            },
            encode = function(input, asciiOnly) {
              var notString = typeof input !== 'string'
              notString &&
                input.constructor == ArrayBuffer &&
                (input = new Uint8Array(input))
              return notString
                ? encodeBytes(input)
                : asciiOnly ? encodeAscii(input) : encodeUtf8(input)
            },
            decode = function(base32Str, asciiOnly) {
              if (!asciiOnly) return toUtf8String(decodeAsBytes(base32Str))
              var v1,
                v2,
                v3,
                v4,
                v5,
                v6,
                v7,
                v8,
                str = '',
                length = base32Str.indexOf('=')
              length == -1 && (length = base32Str.length)
              for (var i = 0, count = length >> 3 << 3; i < count; ) {
                v1 = BASE32_DECODE_CHAR[base32Str.charAt(i++)]
                v2 = BASE32_DECODE_CHAR[base32Str.charAt(i++)]
                v3 = BASE32_DECODE_CHAR[base32Str.charAt(i++)]
                v4 = BASE32_DECODE_CHAR[base32Str.charAt(i++)]
                v5 = BASE32_DECODE_CHAR[base32Str.charAt(i++)]
                v6 = BASE32_DECODE_CHAR[base32Str.charAt(i++)]
                v7 = BASE32_DECODE_CHAR[base32Str.charAt(i++)]
                v8 = BASE32_DECODE_CHAR[base32Str.charAt(i++)]
                str +=
                  String.fromCharCode(255 & ((v1 << 3) | (v2 >>> 2))) +
                  String.fromCharCode(
                    255 & ((v2 << 6) | (v3 << 1) | (v4 >>> 4))
                  ) +
                  String.fromCharCode(255 & ((v4 << 4) | (v5 >>> 1))) +
                  String.fromCharCode(
                    255 & ((v5 << 7) | (v6 << 2) | (v7 >>> 3))
                  ) +
                  String.fromCharCode(255 & ((v7 << 5) | v8))
              }
              var remain = length - count
              if (remain == 2) {
                v1 = BASE32_DECODE_CHAR[base32Str.charAt(i++)]
                v2 = BASE32_DECODE_CHAR[base32Str.charAt(i++)]
                str += String.fromCharCode(255 & ((v1 << 3) | (v2 >>> 2)))
              } else if (remain == 4) {
                v1 = BASE32_DECODE_CHAR[base32Str.charAt(i++)]
                v2 = BASE32_DECODE_CHAR[base32Str.charAt(i++)]
                v3 = BASE32_DECODE_CHAR[base32Str.charAt(i++)]
                v4 = BASE32_DECODE_CHAR[base32Str.charAt(i++)]
                str +=
                  String.fromCharCode(255 & ((v1 << 3) | (v2 >>> 2))) +
                  String.fromCharCode(
                    255 & ((v2 << 6) | (v3 << 1) | (v4 >>> 4))
                  )
              } else if (remain == 5) {
                v1 = BASE32_DECODE_CHAR[base32Str.charAt(i++)]
                v2 = BASE32_DECODE_CHAR[base32Str.charAt(i++)]
                v3 = BASE32_DECODE_CHAR[base32Str.charAt(i++)]
                v4 = BASE32_DECODE_CHAR[base32Str.charAt(i++)]
                v5 = BASE32_DECODE_CHAR[base32Str.charAt(i++)]
                str +=
                  String.fromCharCode(255 & ((v1 << 3) | (v2 >>> 2))) +
                  String.fromCharCode(
                    255 & ((v2 << 6) | (v3 << 1) | (v4 >>> 4))
                  ) +
                  String.fromCharCode(255 & ((v4 << 4) | (v5 >>> 1)))
              } else if (remain == 7) {
                v1 = BASE32_DECODE_CHAR[base32Str.charAt(i++)]
                v2 = BASE32_DECODE_CHAR[base32Str.charAt(i++)]
                v3 = BASE32_DECODE_CHAR[base32Str.charAt(i++)]
                v4 = BASE32_DECODE_CHAR[base32Str.charAt(i++)]
                v5 = BASE32_DECODE_CHAR[base32Str.charAt(i++)]
                v6 = BASE32_DECODE_CHAR[base32Str.charAt(i++)]
                v7 = BASE32_DECODE_CHAR[base32Str.charAt(i++)]
                str +=
                  String.fromCharCode(255 & ((v1 << 3) | (v2 >>> 2))) +
                  String.fromCharCode(
                    255 & ((v2 << 6) | (v3 << 1) | (v4 >>> 4))
                  ) +
                  String.fromCharCode(255 & ((v4 << 4) | (v5 >>> 1))) +
                  String.fromCharCode(
                    255 & ((v5 << 7) | (v6 << 2) | (v7 >>> 3))
                  )
              }
              return str
            }
          decode.asBytes = decodeAsBytes
          var exports = {
            encode: encode,
            decode: decode
          }
          root.HI_BASE32_TEST && (exports.toUtf8String = toUtf8String)
          !root.HI_BASE32_TEST && NODE_JS
            ? (module.exports = exports)
            : root && (root.base32 = exports)
        })(this)
      }.call(exports, __webpack_require__(64)))
    },
    function(module, __webpack_exports__, __webpack_require__) {
      'use strict'
      function deleteTunnelWindow(id) {
        try {
          __WEBPACK_IMPORTED_MODULE_3__global__.a.tunnelWindows[id] &&
            delete __WEBPACK_IMPORTED_MODULE_3__global__.a.tunnelWindows[id]
              .source
        } catch (err) {}
        delete __WEBPACK_IMPORTED_MODULE_3__global__.a.tunnelWindows[id]
      }
      function cleanTunnelWindows() {
        for (
          var tunnelWindows =
            __WEBPACK_IMPORTED_MODULE_3__global__.a.tunnelWindows,
            _iterator = Object.keys(tunnelWindows),
            _isArray = Array.isArray(_iterator),
            _i = 0,
            _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();
          ;

        ) {
          var _ref
          if (_isArray) {
            if (_i >= _iterator.length) break
            _ref = _iterator[_i++]
          } else {
            _i = _iterator.next()
            if (_i.done) break
            _ref = _i.value
          }
          var key = _ref, tunnelWindow = tunnelWindows[key]
          try {
            __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__lib__.o)(
              tunnelWindow.source
            )
          } catch (err) {
            deleteTunnelWindow(key)
            continue
          }
          __webpack_require__.i(
            __WEBPACK_IMPORTED_MODULE_1_cross_domain_utils_src__.isWindowClosed
          )(tunnelWindow.source) && deleteTunnelWindow(key)
        }
      }
      function addTunnelWindow(data) {
        cleanTunnelWindows()
        __WEBPACK_IMPORTED_MODULE_3__global__.a.tunnelWindowId += 1
        __WEBPACK_IMPORTED_MODULE_3__global__.a.tunnelWindows[
          __WEBPACK_IMPORTED_MODULE_3__global__.a.tunnelWindowId
        ] = data
        return __WEBPACK_IMPORTED_MODULE_3__global__.a.tunnelWindowId
      }
      function getTunnelWindow(id) {
        return __WEBPACK_IMPORTED_MODULE_3__global__.a.tunnelWindows[id]
      }
      Object.defineProperty(__webpack_exports__, '__esModule', {
        value: !0
      })
      var __WEBPACK_IMPORTED_MODULE_0__conf__ = __webpack_require__(1),
        __WEBPACK_IMPORTED_MODULE_1_cross_domain_utils_src__ = __webpack_require__(
          0
        ),
        __WEBPACK_IMPORTED_MODULE_2__lib__ = (__webpack_require__.n(
          __WEBPACK_IMPORTED_MODULE_1_cross_domain_utils_src__
        ), __webpack_require__(3)),
        __WEBPACK_IMPORTED_MODULE_3__global__ = __webpack_require__(5),
        __WEBPACK_IMPORTED_MODULE_4__interface__ = __webpack_require__(10)
      __WEBPACK_IMPORTED_MODULE_3__global__.a.tunnelWindows = __WEBPACK_IMPORTED_MODULE_3__global__
        .a.tunnelWindows || {}
      __WEBPACK_IMPORTED_MODULE_3__global__.a.tunnelWindowId = 0
      __WEBPACK_IMPORTED_MODULE_3__global__.a.openTunnelToParent = function(
        data
      ) {
        var parentWindow = __webpack_require__.i(
          __WEBPACK_IMPORTED_MODULE_1_cross_domain_utils_src__.getParent
        )(window)
        if (!parentWindow)
          throw new Error('No parent window found to open tunnel to')
        var id = addTunnelWindow(data)
        return __webpack_require__.i(
          __WEBPACK_IMPORTED_MODULE_4__interface__.send
        )(
          parentWindow,
          __WEBPACK_IMPORTED_MODULE_0__conf__.a.POST_MESSAGE_NAMES.OPEN_TUNNEL,
          {
            name: data.name,
            sendMessage: function() {
              var tunnelWindow = getTunnelWindow(id)
              try {
                __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__lib__.o)(
                  tunnelWindow && tunnelWindow.source
                )
              } catch (err) {
                deleteTunnelWindow(id)
                return
              }
              if (
                tunnelWindow &&
                tunnelWindow.source &&
                !__webpack_require__.i(
                  __WEBPACK_IMPORTED_MODULE_1_cross_domain_utils_src__.isWindowClosed
                )(tunnelWindow.source)
              ) {
                try {
                  tunnelWindow.canary()
                } catch (err) {
                  return
                }
                tunnelWindow.sendMessage.apply(this, arguments)
              }
            }
          },
          {
            domain: __WEBPACK_IMPORTED_MODULE_0__conf__.a.WILDCARD
          }
        )
      }
    },
    function(module, __webpack_exports__, __webpack_require__) {
      'use strict'
      function openTunnelToOpener() {
        return __WEBPACK_IMPORTED_MODULE_0_sync_browser_mocks_src_promise__.a.try(
          function() {
            var opener = __webpack_require__.i(
              __WEBPACK_IMPORTED_MODULE_1_cross_domain_utils_src__.getOpener
            )(window)
            if (
              opener &&
              __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_5__common__.d)({
                win: opener
              })
            ) {
              __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_5__common__.h)(
                opener
              )
              return awaitRemoteBridgeForWindow(opener).then(function(bridge) {
                return bridge
                  ? window.name
                      ? bridge[
                          __WEBPACK_IMPORTED_MODULE_2__conf__.a.WINDOW_PROPS
                            .POSTROBOT
                        ]
                          .openTunnelToParent({
                            name: window.name,
                            source: window,
                            canary: function() {},
                            sendMessage: function(message) {
                              try {
                                __webpack_require__.i(
                                  __WEBPACK_IMPORTED_MODULE_3__lib__.o
                                )(window)
                              } catch (err) {
                                return
                              }
                              window &&
                                !window.closed &&
                                __webpack_require__.i(
                                  __WEBPACK_IMPORTED_MODULE_4__drivers__.g
                                )({
                                  data: message,
                                  origin: this.origin,
                                  source: this.source
                                })
                            }
                          })
                          .then(function(_ref2) {
                            var source = _ref2.source,
                              origin = _ref2.origin,
                              data = _ref2.data
                            if (source !== opener)
                              throw new Error('Source does not match opener')
                            __webpack_require__.i(
                              __WEBPACK_IMPORTED_MODULE_5__common__.j
                            )(source, origin, data.sendMessage)
                          })
                          .catch(function(err) {
                            __webpack_require__.i(
                              __WEBPACK_IMPORTED_MODULE_5__common__.k
                            )(opener, err)
                            throw err
                          })
                      : __webpack_require__.i(
                          __WEBPACK_IMPORTED_MODULE_5__common__.k
                        )(
                          opener,
                          new Error(
                            'Can not register with opener: window does not have a name'
                          )
                        )
                  : __webpack_require__.i(
                      __WEBPACK_IMPORTED_MODULE_5__common__.k
                    )(
                      opener,
                      new Error(
                        'Can not register with opener: no bridge found in opener'
                      )
                    )
              })
            }
          }
        )
      }
      var __WEBPACK_IMPORTED_MODULE_0_sync_browser_mocks_src_promise__ = __webpack_require__(
        4
      ),
        __WEBPACK_IMPORTED_MODULE_1_cross_domain_utils_src__ = __webpack_require__(
          0
        ),
        __WEBPACK_IMPORTED_MODULE_2__conf__ = (__webpack_require__.n(
          __WEBPACK_IMPORTED_MODULE_1_cross_domain_utils_src__
        ), __webpack_require__(1)),
        __WEBPACK_IMPORTED_MODULE_3__lib__ = __webpack_require__(3),
        __WEBPACK_IMPORTED_MODULE_4__drivers__ = __webpack_require__(8),
        __WEBPACK_IMPORTED_MODULE_5__common__ = __webpack_require__(21)
      __webpack_exports__.a = openTunnelToOpener
      var awaitRemoteBridgeForWindow = __webpack_require__.i(
        __WEBPACK_IMPORTED_MODULE_3__lib__.u
      )(function(win) {
        return __WEBPACK_IMPORTED_MODULE_0_sync_browser_mocks_src_promise__.a.try(
          function() {
            for (
              var _iterator = __webpack_require__.i(
                __WEBPACK_IMPORTED_MODULE_1_cross_domain_utils_src__.getFrames
              )(win),
                _isArray = Array.isArray(_iterator),
                _i = 0,
                _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();
              ;

            ) {
              var _ref
              if (_isArray) {
                if (_i >= _iterator.length) break
                _ref = _iterator[_i++]
              } else {
                _i = _iterator.next()
                if (_i.done) break
                _ref = _i.value
              }
              var _frame = _ref
              try {
                if (
                  _frame &&
                  _frame !== window &&
                  __webpack_require__.i(
                    __WEBPACK_IMPORTED_MODULE_1_cross_domain_utils_src__.isSameDomain
                  )(_frame) &&
                  _frame[
                    __WEBPACK_IMPORTED_MODULE_2__conf__.a.WINDOW_PROPS.POSTROBOT
                  ]
                )
                  return _frame
              } catch (err) {
                continue
              }
            }
            try {
              var frame = __webpack_require__.i(
                __WEBPACK_IMPORTED_MODULE_1_cross_domain_utils_src__.getFrameByName
              )(
                win,
                __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_5__common__.e)(
                  __webpack_require__.i(
                    __WEBPACK_IMPORTED_MODULE_1_cross_domain_utils_src__.getDomain
                  )()
                )
              )
              if (!frame) return
              return __webpack_require__.i(
                __WEBPACK_IMPORTED_MODULE_1_cross_domain_utils_src__.isSameDomain
              )(frame) &&
                frame[
                  __WEBPACK_IMPORTED_MODULE_2__conf__.a.WINDOW_PROPS.POSTROBOT
                ]
                ? frame
                : new __WEBPACK_IMPORTED_MODULE_0_sync_browser_mocks_src_promise__.a(
                    function(resolve) {
                      var interval = void 0
                      interval = setInterval(function() {
                        if (
                          __webpack_require__.i(
                            __WEBPACK_IMPORTED_MODULE_1_cross_domain_utils_src__.isSameDomain
                          )(frame) &&
                          frame[
                            __WEBPACK_IMPORTED_MODULE_2__conf__.a.WINDOW_PROPS
                              .POSTROBOT
                          ]
                        ) {
                          clearInterval(interval)
                          clearTimeout(void 0)
                          return resolve(frame)
                        }
                        setTimeout(function() {
                          clearInterval(interval)
                          return resolve()
                        }, 2e3)
                      }, 100)
                    }
                  )
            } catch (err) {
              return
            }
          }
        )
      })
    },
    function(module, __webpack_exports__, __webpack_require__) {
      'use strict'
      Object.defineProperty(__webpack_exports__, '__esModule', {
        value: !0
      })
      __webpack_require__.d(__webpack_exports__, 'openBridge', function() {
        return openBridge
      })
      __webpack_require__.d(__webpack_exports__, 'linkUrl', function() {
        return linkUrl
      })
      __webpack_require__.d(__webpack_exports__, 'isBridge', function() {
        return isBridge
      })
      __webpack_require__.d(__webpack_exports__, 'needsBridge', function() {
        return needsBridge
      })
      __webpack_require__.d(
        __webpack_exports__,
        'needsBridgeForBrowser',
        function() {
          return needsBridgeForBrowser
        }
      )
      __webpack_require__.d(
        __webpack_exports__,
        'needsBridgeForWin',
        function() {
          return needsBridgeForWin
        }
      )
      __webpack_require__.d(
        __webpack_exports__,
        'needsBridgeForDomain',
        function() {
          return needsBridgeForDomain
        }
      )
      __webpack_require__.d(
        __webpack_exports__,
        'openTunnelToOpener',
        function() {
          return openTunnelToOpener
        }
      )
      __webpack_require__.d(__webpack_exports__, 'destroyBridges', function() {
        return destroyBridges
      })
      var openBridge = void 0,
        linkUrl = void 0,
        isBridge = void 0,
        needsBridge = void 0,
        needsBridgeForBrowser = void 0,
        needsBridgeForWin = void 0,
        needsBridgeForDomain = void 0,
        openTunnelToOpener = void 0,
        destroyBridges = void 0,
        bridge = __webpack_require__(22)
      openBridge = bridge.openBridge
      linkUrl = bridge.linkUrl
      isBridge = bridge.isBridge
      needsBridge = bridge.needsBridge
      needsBridgeForBrowser = bridge.needsBridgeForBrowser
      needsBridgeForWin = bridge.needsBridgeForWin
      needsBridgeForDomain = bridge.needsBridgeForDomain
      openTunnelToOpener = bridge.openTunnelToOpener
      destroyBridges = bridge.destroyBridges
    },
    function(module, __webpack_exports__, __webpack_require__) {
      'use strict'
      function listenForRegister(source, domain) {
        __webpack_require__.i(
          __WEBPACK_IMPORTED_MODULE_5__interface__.on
        )(
          __WEBPACK_IMPORTED_MODULE_2__conf__.a.POST_MESSAGE_NAMES.OPEN_TUNNEL,
          {
            source: source,
            domain: domain
          },
          function(_ref) {
            var origin = _ref.origin, data = _ref.data
            if (origin !== domain)
              throw new Error(
                'Domain ' + domain + ' does not match origin ' + origin
              )
            if (!data.name)
              throw new Error(
                'Register window expected to be passed window name'
              )
            if (!data.sendMessage)
              throw new Error(
                'Register window expected to be passed sendMessage method'
              )
            if (
              !__WEBPACK_IMPORTED_MODULE_4__global__.a.popupWindowsByName[
                data.name
              ]
            )
              throw new Error(
                'Window with name ' +
                  data.name +
                  ' does not exist, or was not opened by this window'
              )
            if (
              !__WEBPACK_IMPORTED_MODULE_4__global__.a.popupWindowsByName[
                data.name
              ].domain
            )
              throw new Error(
                'We do not have a registered domain for window ' + data.name
              )
            if (
              __WEBPACK_IMPORTED_MODULE_4__global__.a.popupWindowsByName[
                data.name
              ].domain !== origin
            )
              throw new Error(
                'Message origin ' +
                  origin +
                  ' does not matched registered window origin ' +
                  __WEBPACK_IMPORTED_MODULE_4__global__.a.popupWindowsByName[
                    data.name
                  ].domain
              )
            __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_7__common__.j)(
              __WEBPACK_IMPORTED_MODULE_4__global__.a.popupWindowsByName[
                data.name
              ].win,
              domain,
              data.sendMessage
            )
            return {
              sendMessage: function(message) {
                if (window && !window.closed) {
                  var winDetails =
                    __WEBPACK_IMPORTED_MODULE_4__global__.a.popupWindowsByName[
                      data.name
                    ]
                  winDetails &&
                    __webpack_require__.i(
                      __WEBPACK_IMPORTED_MODULE_6__drivers__.g
                    )({
                      data: message,
                      origin: winDetails.domain,
                      source: winDetails.win
                    })
                }
              }
            }
          }
        )
      }
      function openBridgeFrame(name, url) {
        __WEBPACK_IMPORTED_MODULE_3__lib__.i.debug('Opening bridge:', name, url)
        var iframe = document.createElement('iframe')
        iframe.setAttribute('name', name)
        iframe.setAttribute('id', name)
        iframe.setAttribute(
          'style',
          'display: none; margin: 0; padding: 0; border: 0px none; overflow: hidden;'
        )
        iframe.setAttribute('frameborder', '0')
        iframe.setAttribute('border', '0')
        iframe.setAttribute('scrolling', 'yes')
        iframe.setAttribute('allowTransparency', 'true')
        iframe.setAttribute('tabindex', '-1')
        iframe.setAttribute('hidden', 'true')
        iframe.setAttribute('title', '')
        iframe.setAttribute('role', 'presentation')
        iframe.src = url
        return iframe
      }
      function openBridge(url, domain) {
        domain =
          domain ||
          __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__lib__.t)(url)
        if (__WEBPACK_IMPORTED_MODULE_4__global__.a.bridges[domain])
          return __WEBPACK_IMPORTED_MODULE_4__global__.a.bridges[domain]
        __WEBPACK_IMPORTED_MODULE_4__global__.a.bridges[
          domain
        ] = __WEBPACK_IMPORTED_MODULE_3__lib__.g.run(function() {
          if (
            __webpack_require__.i(
              __WEBPACK_IMPORTED_MODULE_1_cross_domain_utils_src__.getDomain
            )() === domain
          )
            throw new Error(
              'Can not open bridge on the same domain as current domain: ' +
                domain
            )
          var name = __webpack_require__.i(
            __WEBPACK_IMPORTED_MODULE_7__common__.e
          )(domain)
          if (
            __webpack_require__.i(
              __WEBPACK_IMPORTED_MODULE_1_cross_domain_utils_src__.getFrameByName
            )(window, name)
          )
            throw new Error(
              'Frame with name ' + name + ' already exists on page'
            )
          var iframe = openBridgeFrame(name, url)
          return __WEBPACK_IMPORTED_MODULE_7__common__.g.then(function(body) {
            return new __WEBPACK_IMPORTED_MODULE_3__lib__.g.Promise(function(
              resolve,
              reject
            ) {
              setTimeout(resolve, 1)
            }).then(function() {
              body.appendChild(iframe)
              var bridge = iframe.contentWindow
              listenForRegister(bridge, domain)
              return new __WEBPACK_IMPORTED_MODULE_3__lib__.g.Promise(function(
                resolve,
                reject
              ) {
                iframe.onload = resolve
                iframe.onerror = reject
              })
                .then(function() {
                  return __webpack_require__.i(
                    __WEBPACK_IMPORTED_MODULE_3__lib__.s
                  )(bridge, __WEBPACK_IMPORTED_MODULE_2__conf__.b.BRIDGE_TIMEOUT, 'Bridge ' + url)
                })
                .then(function() {
                  return bridge
                })
            })
          })
        })
        return __WEBPACK_IMPORTED_MODULE_4__global__.a.bridges[domain]
      }
      function linkUrl(win, url) {
        var winOptions = __WEBPACK_IMPORTED_MODULE_4__global__.a.popupWindowsByWin.get(
          win
        )
        if (winOptions) {
          winOptions.domain = __webpack_require__.i(
            __WEBPACK_IMPORTED_MODULE_3__lib__.t
          )(url)
          __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_7__common__.h)(win)
        }
      }
      var __WEBPACK_IMPORTED_MODULE_0_cross_domain_safe_weakmap_src__ = __webpack_require__(
        6
      ),
        __WEBPACK_IMPORTED_MODULE_1_cross_domain_utils_src__ = __webpack_require__(
          0
        ),
        __WEBPACK_IMPORTED_MODULE_2__conf__ = (__webpack_require__.n(
          __WEBPACK_IMPORTED_MODULE_1_cross_domain_utils_src__
        ), __webpack_require__(1)),
        __WEBPACK_IMPORTED_MODULE_3__lib__ = __webpack_require__(3),
        __WEBPACK_IMPORTED_MODULE_4__global__ = __webpack_require__(5),
        __WEBPACK_IMPORTED_MODULE_5__interface__ = __webpack_require__(10),
        __WEBPACK_IMPORTED_MODULE_6__drivers__ = __webpack_require__(8),
        __WEBPACK_IMPORTED_MODULE_7__common__ = __webpack_require__(21)
      __webpack_exports__.a = openBridge
      __webpack_exports__.b = linkUrl
      var _slicedToArray = (function() {
        function sliceIterator(arr, i) {
          var _arr = [], _n = !0, _d = !1, _e = void 0
          try {
            for (
              var _s, _i = arr[Symbol.iterator]();
              !(_n = (_s = _i.next()).done);
              _n = !0
            ) {
              _arr.push(_s.value)
              if (i && _arr.length === i) break
            }
          } catch (err) {
            _d = !0
            _e = err
          } finally {
            try {
              !_n && _i.return && _i.return()
            } finally {
              if (_d) throw _e
            }
          }
          return _arr
        }
        return function(arr, i) {
          if (Array.isArray(arr)) return arr
          if (Symbol.iterator in Object(arr)) return sliceIterator(arr, i)
          throw new TypeError(
            'Invalid attempt to destructure non-iterable instance'
          )
        }
      })()
      __WEBPACK_IMPORTED_MODULE_4__global__.a.bridges = __WEBPACK_IMPORTED_MODULE_4__global__
        .a.bridges || {}
      __WEBPACK_IMPORTED_MODULE_4__global__.a.popupWindowsByWin =
        __WEBPACK_IMPORTED_MODULE_4__global__.a.popupWindowsByWin ||
        new __WEBPACK_IMPORTED_MODULE_0_cross_domain_safe_weakmap_src__.WeakMap()
      __WEBPACK_IMPORTED_MODULE_4__global__.a.popupWindowsByName = __WEBPACK_IMPORTED_MODULE_4__global__
        .a.popupWindowsByName || {}
      var windowOpen = window.open
      window.open = function(url, name, options, last) {
        var domain = url
        if (
          url &&
          url.indexOf(__WEBPACK_IMPORTED_MODULE_2__conf__.a.MOCK_PROTOCOL) === 0
        ) {
          var _url$split = url.split('|'),
            _url$split2 = _slicedToArray(_url$split, 2)
          domain = _url$split2[0]
          url = _url$split2[1]
        }
        domain &&
          (domain = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__lib__.t)(
            domain
          ))
        var win = windowOpen.call(this, url, name, options, last)
        if (!win) return win
        url &&
          __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_7__common__.h)(win)
        for (
          var _iterator = Object.keys(
            __WEBPACK_IMPORTED_MODULE_4__global__.a.popupWindowsByName
          ),
            _isArray = Array.isArray(_iterator),
            _i = 0,
            _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();
          ;

        ) {
          var _ref2
          if (_isArray) {
            if (_i >= _iterator.length) break
            _ref2 = _iterator[_i++]
          } else {
            _i = _iterator.next()
            if (_i.done) break
            _ref2 = _i.value
          }
          var winName = _ref2
          __webpack_require__.i(
            __WEBPACK_IMPORTED_MODULE_1_cross_domain_utils_src__.isWindowClosed
          )(
            __WEBPACK_IMPORTED_MODULE_4__global__.a.popupWindowsByName[winName]
              .win
          ) &&
            delete __WEBPACK_IMPORTED_MODULE_4__global__.a.popupWindowsByName[
              winName
            ]
        }
        if (name && win) {
          var winOptions = __WEBPACK_IMPORTED_MODULE_4__global__.a.popupWindowsByWin.get(
            win
          ) ||
          __WEBPACK_IMPORTED_MODULE_4__global__.a.popupWindowsByName[name] || {}
          winOptions.name = winOptions.name || name
          winOptions.win = winOptions.win || win
          winOptions.domain = winOptions.domain || domain
          __WEBPACK_IMPORTED_MODULE_4__global__.a.popupWindowsByWin.set(
            win,
            winOptions
          )
          __WEBPACK_IMPORTED_MODULE_4__global__.a.popupWindowsByName[
            name
          ] = winOptions
        }
        return win
      }
    },
    function(module, __webpack_exports__, __webpack_require__) {
      'use strict'
      function cleanUpWindow(win) {
        var requestPromises = __WEBPACK_IMPORTED_MODULE_0__global__.a.requestPromises.get(
          win
        )
        if (requestPromises) {
          for (
            var _iterator = requestPromises,
              _isArray = Array.isArray(_iterator),
              _i = 0,
              _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();
            ;

          ) {
            var _ref
            if (_isArray) {
              if (_i >= _iterator.length) break
              _ref = _iterator[_i++]
            } else {
              _i = _iterator.next()
              if (_i.done) break
              _ref = _i.value
            }
            var promise = _ref
            promise.reject(new Error('No response from window - cleaned up'))
          }
        }
        __WEBPACK_IMPORTED_MODULE_0__global__.a.popupWindowsByWin &&
          __WEBPACK_IMPORTED_MODULE_0__global__.a.popupWindowsByWin.delete(win)
        __WEBPACK_IMPORTED_MODULE_0__global__.a.remoteWindows &&
          __WEBPACK_IMPORTED_MODULE_0__global__.a.remoteWindows.delete(win)
        __WEBPACK_IMPORTED_MODULE_0__global__.a.requestPromises.delete(win)
        __WEBPACK_IMPORTED_MODULE_0__global__.a.methods.delete(win)
        __WEBPACK_IMPORTED_MODULE_0__global__.a.readyPromises.delete(win)
      }
      var __WEBPACK_IMPORTED_MODULE_0__global__ = __webpack_require__(5)
      __webpack_exports__.a = cleanUpWindow
    },
    function(module, __webpack_exports__, __webpack_require__) {
      'use strict'
      function emulateIERestrictions(sourceWindow, targetWindow) {
        if (
          !__WEBPACK_IMPORTED_MODULE_1__conf__.b.ALLOW_POSTMESSAGE_POPUP &&
          __webpack_require__.i(
            __WEBPACK_IMPORTED_MODULE_0_cross_domain_utils_src__.isSameTopWindow
          )(sourceWindow, targetWindow) === !1
        )
          throw new Error(
            'Can not send and receive post messages between two different windows (disabled to emulate IE)'
          )
      }
      var __WEBPACK_IMPORTED_MODULE_0_cross_domain_utils_src__ = __webpack_require__(
        0
      ),
        __WEBPACK_IMPORTED_MODULE_1__conf__ = (__webpack_require__.n(
          __WEBPACK_IMPORTED_MODULE_0_cross_domain_utils_src__
        ), __webpack_require__(1))
      __webpack_exports__.a = emulateIERestrictions
    },
    function(module, __webpack_exports__, __webpack_require__) {
      'use strict'
      function _defineProperty(obj, key, value) {
        key in obj
          ? Object.defineProperty(obj, key, {
              value: value,
              enumerable: !0,
              configurable: !0,
              writable: !0
            })
          : (obj[key] = value)
        return obj
      }
      var __WEBPACK_IMPORTED_MODULE_0__constants__ = __webpack_require__(30)
      __webpack_require__.d(__webpack_exports__, 'a', function() {
        return CONFIG
      })
      var _ALLOWED_POST_MESSAGE,
        CONFIG = {
          ALLOW_POSTMESSAGE_POPUP: !0,
          LOG_LEVEL: 'info',
          BRIDGE_TIMEOUT: 5e3,
          ACK_TIMEOUT: 1e3,
          RES_TIMEOUT: 1e4,
          LOG_TO_PAGE: !1,
          MOCK_MODE: !1,
          ALLOWED_POST_MESSAGE_METHODS: ((_ALLOWED_POST_MESSAGE = {
          }), _defineProperty(
            _ALLOWED_POST_MESSAGE,
            __WEBPACK_IMPORTED_MODULE_0__constants__.a.SEND_STRATEGIES
              .POST_MESSAGE,
            !0
          ), _defineProperty(
            _ALLOWED_POST_MESSAGE,
            __WEBPACK_IMPORTED_MODULE_0__constants__.a.SEND_STRATEGIES.BRIDGE,
            !0
          ), _defineProperty(
            _ALLOWED_POST_MESSAGE,
            __WEBPACK_IMPORTED_MODULE_0__constants__.a.SEND_STRATEGIES.GLOBAL,
            !0
          ), _ALLOWED_POST_MESSAGE)
        }
      window.location.href.indexOf(
        __WEBPACK_IMPORTED_MODULE_0__constants__.a.FILE_PROTOCOL
      ) === 0 && (CONFIG.ALLOW_POSTMESSAGE_POPUP = !0)
    },
    function(module, __webpack_exports__, __webpack_require__) {
      'use strict'
      function parseMessage(message) {
        try {
          message = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__lib__.l)(
            message
          )
        } catch (err) {
          return
        }
        if (message) {
          message =
            message[
              __WEBPACK_IMPORTED_MODULE_1__conf__.a.WINDOW_PROPS.POSTROBOT
            ]
          if (
            message &&
            message.type &&
            __WEBPACK_IMPORTED_MODULE_4__types__.a[message.type]
          )
            return message
        }
      }
      function receiveMessage(event) {
        if (!window || window.closed)
          throw new Error('Message recieved in closed window')
        try {
          if (!event.source) return
        } catch (err) {
          return
        }
        var source = event.source,
          origin = event.origin,
          data = event.data,
          message = parseMessage(data)
        if (message) {
          ;(message.sourceDomain.indexOf(
            __WEBPACK_IMPORTED_MODULE_1__conf__.a.MOCK_PROTOCOL
          ) !== 0 &&
            message.sourceDomain.indexOf(
              __WEBPACK_IMPORTED_MODULE_1__conf__.a.FILE_PROTOCOL
            ) !== 0) ||
            (origin = message.sourceDomain)
          if (
            __WEBPACK_IMPORTED_MODULE_3__global__.a.receivedMessages.indexOf(
              message.id
            ) === -1
          ) {
            __WEBPACK_IMPORTED_MODULE_3__global__.a.receivedMessages.push(
              message.id
            )
            var level = void 0
            level = __WEBPACK_IMPORTED_MODULE_1__conf__.c.indexOf(
              message.name
            ) !== -1 ||
              message.type ===
                __WEBPACK_IMPORTED_MODULE_1__conf__.a.POST_MESSAGE_TYPE.ACK
              ? 'debug'
              : message.ack === 'error' ? 'error' : 'info'
            __WEBPACK_IMPORTED_MODULE_2__lib__.i.logLevel(level, [
              '\n\n\t',
              '#receive',
              message.type.replace(/^postrobot_message_/, ''),
              '::',
              message.name,
              '::',
              origin,
              '\n\n',
              message
            ])
            if (
              __webpack_require__.i(
                __WEBPACK_IMPORTED_MODULE_0_cross_domain_utils_src__.isWindowClosed
              )(source)
            )
              return __WEBPACK_IMPORTED_MODULE_2__lib__.i.debug(
                'Source window is closed - can not send ' +
                  message.type +
                  ' ' +
                  message.name
              )
            message.data &&
              (message.data = __webpack_require__.i(
                __WEBPACK_IMPORTED_MODULE_2__lib__.m
              )(source, origin, message.data))
            __WEBPACK_IMPORTED_MODULE_4__types__.a[message.type](
              source,
              origin,
              message
            )
          }
        }
      }
      function messageListener(event) {
        try {
          event.source
        } catch (err) {
          return
        }
        event = {
          source: event.source || event.sourceElement,
          origin: event.origin || event.originalEvent.origin,
          data: event.data
        }
        try {
          __webpack_require__(29).emulateIERestrictions(event.source, window)
        } catch (err) {
          return
        }
        receiveMessage(event)
      }
      function listenForMessages() {
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__lib__.n)(
          window,
          'message',
          messageListener
        )
      }
      var __WEBPACK_IMPORTED_MODULE_0_cross_domain_utils_src__ = __webpack_require__(
        0
      ),
        __WEBPACK_IMPORTED_MODULE_1__conf__ = (__webpack_require__.n(
          __WEBPACK_IMPORTED_MODULE_0_cross_domain_utils_src__
        ), __webpack_require__(1)),
        __WEBPACK_IMPORTED_MODULE_2__lib__ = __webpack_require__(3),
        __WEBPACK_IMPORTED_MODULE_3__global__ = __webpack_require__(5),
        __WEBPACK_IMPORTED_MODULE_4__types__ = __webpack_require__(56)
      __webpack_exports__.c = receiveMessage
      __webpack_exports__.b = messageListener
      __webpack_exports__.a = listenForMessages
      __WEBPACK_IMPORTED_MODULE_3__global__.a.receivedMessages = __WEBPACK_IMPORTED_MODULE_3__global__
        .a.receivedMessages || []
    },
    function(module, __webpack_exports__, __webpack_require__) {
      'use strict'
      function _defineProperty(obj, key, value) {
        key in obj
          ? Object.defineProperty(obj, key, {
              value: value,
              enumerable: !0,
              configurable: !0,
              writable: !0
            })
          : (obj[key] = value)
        return obj
      }
      var __WEBPACK_IMPORTED_MODULE_0_cross_domain_utils_src__ = __webpack_require__(
        0
      ),
        __WEBPACK_IMPORTED_MODULE_1__conf__ = (__webpack_require__.n(
          __WEBPACK_IMPORTED_MODULE_0_cross_domain_utils_src__
        ), __webpack_require__(1)),
        __WEBPACK_IMPORTED_MODULE_2__lib__ = __webpack_require__(3),
        __WEBPACK_IMPORTED_MODULE_3__send__ = __webpack_require__(32),
        __WEBPACK_IMPORTED_MODULE_4__listeners__ = __webpack_require__(31)
      __webpack_require__.d(__webpack_exports__, 'a', function() {
        return RECEIVE_MESSAGE_TYPES
      })
      var _RECEIVE_MESSAGE_TYPE,
        _extends =
          Object.assign ||
          function(target) {
            for (var i = 1; i < arguments.length; i++) {
              var source = arguments[i]
              for (var key in source)
                Object.prototype.hasOwnProperty.call(source, key) &&
                  (target[key] = source[key])
            }
            return target
          },
        RECEIVE_MESSAGE_TYPES = ((_RECEIVE_MESSAGE_TYPE = {
        }), _defineProperty(
          _RECEIVE_MESSAGE_TYPE,
          __WEBPACK_IMPORTED_MODULE_1__conf__.a.POST_MESSAGE_TYPE.ACK,
          function(source, origin, message) {
            var options = __webpack_require__.i(
              __WEBPACK_IMPORTED_MODULE_4__listeners__.a
            )(message.hash)
            if (!options)
              throw new Error(
                'No handler found for post message ack for message: ' +
                  message.name +
                  ' from ' +
                  origin +
                  ' in ' +
                  window.location.protocol +
                  '//' +
                  window.location.host +
                  window.location.pathname
              )
            if (
              !__webpack_require__.i(
                __WEBPACK_IMPORTED_MODULE_0_cross_domain_utils_src__.matchDomain
              )(options.domain, origin)
            )
              throw new Error(
                'Ack origin ' +
                  origin +
                  ' does not match domain ' +
                  options.domain
              )
            options.ack = !0
          }
        ), _defineProperty(
          _RECEIVE_MESSAGE_TYPE,
          __WEBPACK_IMPORTED_MODULE_1__conf__.a.POST_MESSAGE_TYPE.REQUEST,
          function(source, origin, message) {
            function respond(data) {
              return message.fireAndForget ||
                __webpack_require__.i(
                  __WEBPACK_IMPORTED_MODULE_0_cross_domain_utils_src__.isWindowClosed
                )(source)
                ? __WEBPACK_IMPORTED_MODULE_2__lib__.g.Promise.resolve()
                : __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__send__.a)(
                    source,
                    _extends(
                      {
                        target: message.originalSource,
                        hash: message.hash,
                        name: message.name
                      },
                      data
                    ),
                    origin
                  )
            }
            var options = __webpack_require__.i(
              __WEBPACK_IMPORTED_MODULE_4__listeners__.b
            )({
              name: message.name,
              win: source,
              domain: origin
            })
            return __WEBPACK_IMPORTED_MODULE_2__lib__.g.Promise
              .all([
                respond({
                  type: __WEBPACK_IMPORTED_MODULE_1__conf__.a.POST_MESSAGE_TYPE
                    .ACK
                }),
                __WEBPACK_IMPORTED_MODULE_2__lib__.g
                  .run(function() {
                    if (!options)
                      throw new Error(
                        'No handler found for post message: ' +
                          message.name +
                          ' from ' +
                          origin +
                          ' in ' +
                          window.location.protocol +
                          '//' +
                          window.location.host +
                          window.location.pathname
                      )
                    if (
                      !__webpack_require__.i(
                        __WEBPACK_IMPORTED_MODULE_0_cross_domain_utils_src__.matchDomain
                      )(options.domain, origin)
                    )
                      throw new Error(
                        'Request origin ' +
                          origin +
                          ' does not match domain ' +
                          options.domain
                      )
                    var data = message.data
                    return options.handler({
                      source: source,
                      origin: origin,
                      data: data
                    })
                  })
                  .then(
                    function(data) {
                      return respond({
                        type: __WEBPACK_IMPORTED_MODULE_1__conf__.a
                          .POST_MESSAGE_TYPE.RESPONSE,
                        ack: __WEBPACK_IMPORTED_MODULE_1__conf__.a
                          .POST_MESSAGE_ACK.SUCCESS,
                        data: data
                      })
                    },
                    function(err) {
                      var stack = err.stack,
                        errmessage = err.message,
                        error = void 0
                      error = stack
                        ? errmessage && stack.indexOf(errmessage) === -1
                            ? errmessage + '\n' + stack
                            : stack
                        : errmessage
                      return respond({
                        type: __WEBPACK_IMPORTED_MODULE_1__conf__.a
                          .POST_MESSAGE_TYPE.RESPONSE,
                        ack: __WEBPACK_IMPORTED_MODULE_1__conf__.a
                          .POST_MESSAGE_ACK.ERROR,
                        error: error
                      })
                    }
                  )
              ])
              .catch(function(err) {
                if (options && options.handleError)
                  return options.handleError(err)
                __WEBPACK_IMPORTED_MODULE_2__lib__.i.error(
                  err.stack || err.toString()
                )
              })
          }
        ), _defineProperty(
          _RECEIVE_MESSAGE_TYPE,
          __WEBPACK_IMPORTED_MODULE_1__conf__.a.POST_MESSAGE_TYPE.RESPONSE,
          function(source, origin, message) {
            var options = __webpack_require__.i(
              __WEBPACK_IMPORTED_MODULE_4__listeners__.a
            )(message.hash)
            if (!options)
              throw new Error(
                'No handler found for post message response for message: ' +
                  message.name +
                  ' from ' +
                  origin +
                  ' in ' +
                  window.location.protocol +
                  '//' +
                  window.location.host +
                  window.location.pathname
              )
            if (
              !__webpack_require__.i(
                __WEBPACK_IMPORTED_MODULE_0_cross_domain_utils_src__.matchDomain
              )(options.domain, origin)
            )
              throw new Error(
                'Response origin ' +
                  origin +
                  ' does not match domain ' +
                  options.domain
              )
            __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4__listeners__.c)(
              message.hash
            )
            if (
              message.ack ===
              __WEBPACK_IMPORTED_MODULE_1__conf__.a.POST_MESSAGE_ACK.ERROR
            )
              return options.respond(new Error(message.error))
            if (
              message.ack ===
              __WEBPACK_IMPORTED_MODULE_1__conf__.a.POST_MESSAGE_ACK.SUCCESS
            ) {
              var data = message.data || message.response
              return options.respond(null, {
                source: source,
                origin: origin,
                data: data
              })
            }
          }
        ), _RECEIVE_MESSAGE_TYPE)
    },
    function(module, __webpack_exports__, __webpack_require__) {
      'use strict'
      var __WEBPACK_IMPORTED_MODULE_0_cross_domain_utils_src__ = __webpack_require__(
        0
      ),
        __WEBPACK_IMPORTED_MODULE_1__conf__ = (__webpack_require__.n(
          __WEBPACK_IMPORTED_MODULE_0_cross_domain_utils_src__
        ), __webpack_require__(1))
      __webpack_require__.d(__webpack_exports__, 'a', function() {
        return SEND_MESSAGE_STRATEGIES
      })
      var SEND_MESSAGE_STRATEGIES = {}
      SEND_MESSAGE_STRATEGIES[
        __WEBPACK_IMPORTED_MODULE_1__conf__.a.SEND_STRATEGIES.POST_MESSAGE
      ] = function(win, serializedMessage, domain) {
        try {
          __webpack_require__(29).emulateIERestrictions(window, win)
        } catch (err) {
          return
        }
        var domains = void 0
        domains = Array.isArray(domain)
          ? domain
          : domain ? [domain] : [__WEBPACK_IMPORTED_MODULE_1__conf__.a.WILDCARD]
        domains = domains.map(function(dom) {
          if (
            dom.indexOf(__WEBPACK_IMPORTED_MODULE_1__conf__.a.MOCK_PROTOCOL) ===
            0
          ) {
            if (
              window.location.protocol ===
              __WEBPACK_IMPORTED_MODULE_1__conf__.a.FILE_PROTOCOL
            )
              return __WEBPACK_IMPORTED_MODULE_1__conf__.a.WILDCARD
            if (
              !__webpack_require__.i(
                __WEBPACK_IMPORTED_MODULE_0_cross_domain_utils_src__.isActuallySameDomain
              )(win)
            )
              throw new Error(
                'Attempting to send messsage to mock domain ' +
                  dom +
                  ', but window is actually cross-domain'
              )
            return __webpack_require__.i(
              __WEBPACK_IMPORTED_MODULE_0_cross_domain_utils_src__.getActualDomain
            )(win)
          }
          return dom.indexOf(
            __WEBPACK_IMPORTED_MODULE_1__conf__.a.FILE_PROTOCOL
          ) === 0
            ? __WEBPACK_IMPORTED_MODULE_1__conf__.a.WILDCARD
            : dom
        })
        domains.forEach(function(dom) {
          return win.postMessage(serializedMessage, dom)
        })
      }
      var sendBridgeMessage = __webpack_require__(22).sendBridgeMessage
      SEND_MESSAGE_STRATEGIES[
        __WEBPACK_IMPORTED_MODULE_1__conf__.a.SEND_STRATEGIES.BRIDGE
      ] = function(win, serializedMessage, domain) {
        if (
          __webpack_require__.i(
            __WEBPACK_IMPORTED_MODULE_0_cross_domain_utils_src__.isSameDomain
          )(win)
        )
          throw new Error(
            'Post message through bridge disabled between same domain windows'
          )
        if (
          __webpack_require__.i(
            __WEBPACK_IMPORTED_MODULE_0_cross_domain_utils_src__.isSameTopWindow
          )(window, win) !== !1
        )
          throw new Error(
            'Can only use bridge to communicate between two different windows, not between frames'
          )
        return sendBridgeMessage(win, serializedMessage, domain)
      }
      SEND_MESSAGE_STRATEGIES[
        __WEBPACK_IMPORTED_MODULE_1__conf__.a.SEND_STRATEGIES.GLOBAL
      ] = function(win, serializedMessage, domain) {
        if (
          !__webpack_require__.i(
            __WEBPACK_IMPORTED_MODULE_0_cross_domain_utils_src__.isSameDomain
          )(win)
        )
          throw new Error(
            'Post message through global disabled between different domain windows'
          )
        if (
          __webpack_require__.i(
            __WEBPACK_IMPORTED_MODULE_0_cross_domain_utils_src__.isSameTopWindow
          )(window, win) !== !1
        )
          throw new Error(
            'Can only use global to communicate between two different windows, not between frames'
          )
        var foreignGlobal =
          win[__WEBPACK_IMPORTED_MODULE_1__conf__.a.WINDOW_PROPS.POSTROBOT]
        if (!foreignGlobal)
          throw new Error('Can not find postRobot global on foreign window')
        return foreignGlobal.receiveMessage({
          source: window,
          origin: __webpack_require__.i(
            __WEBPACK_IMPORTED_MODULE_0_cross_domain_utils_src__.getDomain
          )(),
          data: serializedMessage
        })
      }
    },
    function(module, __webpack_exports__, __webpack_require__) {
      'use strict'
      function isSerialized(item, type) {
        return (
          (void 0 === item ? 'undefined' : _typeof(item)) === 'object' &&
          item !== null &&
          item.__type__ === type
        )
      }
      function serializeMethod(destination, domain, method, name) {
        var id = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__util__.d)(),
          methods = __WEBPACK_IMPORTED_MODULE_7__global__.a.methods.get(
            destination
          )
        if (!methods) {
          methods = {}
          __WEBPACK_IMPORTED_MODULE_7__global__.a.methods.set(
            destination,
            methods
          )
        }
        methods[id] = {
          domain: domain,
          method: method
        }
        return {
          __type__: __WEBPACK_IMPORTED_MODULE_2__conf__.a.SERIALIZATION_TYPES
            .METHOD,
          __id__: id,
          __name__: name
        }
      }
      function serializeError(err) {
        return {
          __type__: __WEBPACK_IMPORTED_MODULE_2__conf__.a.SERIALIZATION_TYPES
            .ERROR,
          __message__: err.stack || err.message || err.toString()
        }
      }
      function serializeMethods(destination, domain, obj) {
        return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__util__.f)(
          {
            obj: obj
          },
          function(item, key) {
            return typeof item === 'function'
              ? serializeMethod(destination, domain, item, key)
              : item instanceof Error ? serializeError(item) : void 0
          }
        ).obj
      }
      function deserializeMethod(source, origin, obj) {
        function wrapper() {
          var args = Array.prototype.slice.call(arguments)
          __WEBPACK_IMPORTED_MODULE_5__log__.a.debug(
            'Call foreign method',
            obj.__name__,
            args
          )
          return __webpack_require__
            .i(__WEBPACK_IMPORTED_MODULE_4__interface__.send)(
              source,
              __WEBPACK_IMPORTED_MODULE_2__conf__.a.POST_MESSAGE_NAMES.METHOD,
              {
                id: obj.__id__,
                name: obj.__name__,
                args: args
              },
              {
                domain: origin,
                timeout: 1 / 0
              }
            )
            .then(
              function(_ref2) {
                var data = _ref2.data
                __WEBPACK_IMPORTED_MODULE_5__log__.a.debug(
                  'Got foreign method result',
                  obj.__name__,
                  data.result
                )
                return data.result
              },
              function(err) {
                __WEBPACK_IMPORTED_MODULE_5__log__.a.debug(
                  'Got foreign method error',
                  err.stack || err.toString()
                )
                throw err
              }
            )
        }
        wrapper.__name__ = obj.__name__
        wrapper.__xdomain__ = !0
        wrapper.source = source
        wrapper.origin = origin
        return wrapper
      }
      function deserializeError(source, origin, obj) {
        return new Error(obj.__message__)
      }
      function deserializeMethods(source, origin, obj) {
        return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__util__.f)(
          {
            obj: obj
          },
          function(item, key) {
            return isSerialized(
              item,
              __WEBPACK_IMPORTED_MODULE_2__conf__.a.SERIALIZATION_TYPES.METHOD
            )
              ? deserializeMethod(source, origin, item)
              : isSerialized(
                  item,
                  __WEBPACK_IMPORTED_MODULE_2__conf__.a.SERIALIZATION_TYPES
                    .ERROR
                )
                  ? deserializeError(source, origin, item)
                  : void 0
          }
        ).obj
      }
      var __WEBPACK_IMPORTED_MODULE_0_cross_domain_safe_weakmap_src__ = __webpack_require__(
        6
      ),
        __WEBPACK_IMPORTED_MODULE_1_cross_domain_utils_src__ = __webpack_require__(
          0
        ),
        __WEBPACK_IMPORTED_MODULE_2__conf__ = (__webpack_require__.n(
          __WEBPACK_IMPORTED_MODULE_1_cross_domain_utils_src__
        ), __webpack_require__(1)),
        __WEBPACK_IMPORTED_MODULE_3__util__ = __webpack_require__(12),
        __WEBPACK_IMPORTED_MODULE_4__interface__ = __webpack_require__(10),
        __WEBPACK_IMPORTED_MODULE_5__log__ = __webpack_require__(23),
        __WEBPACK_IMPORTED_MODULE_6__promise__ = __webpack_require__(33),
        __WEBPACK_IMPORTED_MODULE_7__global__ = __webpack_require__(5)
      __webpack_require__.d(__webpack_exports__, 'a', function() {
        return listenForMethods
      })
      __webpack_exports__.b = serializeMethods
      __webpack_exports__.c = deserializeMethods
      var _typeof = typeof Symbol === 'function' &&
        typeof Symbol.iterator === 'symbol'
        ? function(obj) {
            return typeof obj
          }
        : function(obj) {
            return obj &&
              typeof Symbol === 'function' &&
              obj.constructor === Symbol &&
              obj !== Symbol.prototype
              ? 'symbol'
              : typeof obj
          }
      __WEBPACK_IMPORTED_MODULE_7__global__.a.methods =
        __WEBPACK_IMPORTED_MODULE_7__global__.a.methods ||
        new __WEBPACK_IMPORTED_MODULE_0_cross_domain_safe_weakmap_src__.WeakMap()
      var listenForMethods = __webpack_require__.i(
        __WEBPACK_IMPORTED_MODULE_3__util__.e
      )(function() {
        __webpack_require__.i(
          __WEBPACK_IMPORTED_MODULE_4__interface__.on
        )(__WEBPACK_IMPORTED_MODULE_2__conf__.a.POST_MESSAGE_NAMES.METHOD, {
          window: __WEBPACK_IMPORTED_MODULE_2__conf__.a.WILDCARD,
          origin: __WEBPACK_IMPORTED_MODULE_2__conf__.a.WILDCARD
        }, function(_ref) {
          var source = _ref.source,
            origin = _ref.origin,
            data = _ref.data,
            methods = __WEBPACK_IMPORTED_MODULE_7__global__.a.methods.get(
              source
            )
          if (!methods)
            throw new Error(
              'Could not find any methods this window has privileges to call'
            )
          var meth = methods[data.id]
          if (!meth)
            throw new Error('Could not find method with id: ' + data.id)
          if (
            !__webpack_require__.i(
              __WEBPACK_IMPORTED_MODULE_1_cross_domain_utils_src__.matchDomain
            )(meth.domain, origin)
          )
            throw new Error(
              'Method domain ' +
                meth.domain +
                ' does not match origin ' +
                origin
            )
          __WEBPACK_IMPORTED_MODULE_5__log__.a.debug(
            'Call local method',
            data.name,
            data.args
          )
          return __WEBPACK_IMPORTED_MODULE_6__promise__.b
            .run(function() {
              return meth.method.apply(
                {
                  source: source,
                  origin: origin,
                  data: data
                },
                data.args
              )
            })
            .then(function(result) {
              return {
                result: result,
                id: data.id,
                name: data.name
              }
            })
        })
      })
    },
    function(module, __webpack_exports__, __webpack_require__) {
      'use strict'
      function initOnReady() {
        __webpack_require__.i(
          __WEBPACK_IMPORTED_MODULE_3__interface__.on
        )(
          __WEBPACK_IMPORTED_MODULE_2__conf__.a.POST_MESSAGE_NAMES.READY,
          {
            window: __WEBPACK_IMPORTED_MODULE_2__conf__.a.WILDCARD,
            domain: __WEBPACK_IMPORTED_MODULE_2__conf__.a.WILDCARD
          },
          function(event) {
            var win = event.source,
              promise = __WEBPACK_IMPORTED_MODULE_6__global__.a.readyPromises.get(
                win
              )
            if (promise) promise.resolve(event)
            else {
              promise = new __WEBPACK_IMPORTED_MODULE_5_sync_browser_mocks_src_promise__.a().resolve(
                event
              )
              __WEBPACK_IMPORTED_MODULE_6__global__.a.readyPromises.set(
                win,
                promise
              )
            }
          }
        )
        var parent = __webpack_require__.i(
          __WEBPACK_IMPORTED_MODULE_1_cross_domain_utils_src__.getAncestor
        )()
        parent &&
          __webpack_require__
            .i(__WEBPACK_IMPORTED_MODULE_3__interface__.send)(
              parent,
              __WEBPACK_IMPORTED_MODULE_2__conf__.a.POST_MESSAGE_NAMES.READY,
              {},
              {
                domain: __WEBPACK_IMPORTED_MODULE_2__conf__.a.WILDCARD,
                timeout: 1 / 0
              }
            )
            .catch(function(err) {
              __WEBPACK_IMPORTED_MODULE_4__log__.a.debug(
                err.stack || err.toString()
              )
            })
      }
      function onWindowReady(win) {
        var timeout = arguments.length > 1 && void 0 !== arguments[1]
          ? arguments[1]
          : 5e3,
          name = arguments.length > 2 && void 0 !== arguments[2]
            ? arguments[2]
            : 'Window',
          promise = __WEBPACK_IMPORTED_MODULE_6__global__.a.readyPromises.get(
            win
          )
        if (promise) return promise
        promise = new __WEBPACK_IMPORTED_MODULE_5_sync_browser_mocks_src_promise__.a()
        __WEBPACK_IMPORTED_MODULE_6__global__.a.readyPromises.set(win, promise)
        setTimeout(function() {
          return promise.reject(
            new Error(name + ' did not load after ' + timeout + 'ms')
          )
        }, timeout)
        return promise
      }
      var __WEBPACK_IMPORTED_MODULE_0_cross_domain_safe_weakmap_src__ = __webpack_require__(
        6
      ),
        __WEBPACK_IMPORTED_MODULE_1_cross_domain_utils_src__ = __webpack_require__(
          0
        ),
        __WEBPACK_IMPORTED_MODULE_2__conf__ = (__webpack_require__.n(
          __WEBPACK_IMPORTED_MODULE_1_cross_domain_utils_src__
        ), __webpack_require__(1)),
        __WEBPACK_IMPORTED_MODULE_3__interface__ = __webpack_require__(10),
        __WEBPACK_IMPORTED_MODULE_4__log__ = __webpack_require__(23),
        __WEBPACK_IMPORTED_MODULE_5_sync_browser_mocks_src_promise__ = __webpack_require__(
          4
        ),
        __WEBPACK_IMPORTED_MODULE_6__global__ = __webpack_require__(5)
      __webpack_exports__.a = initOnReady
      __webpack_exports__.b = onWindowReady
      __WEBPACK_IMPORTED_MODULE_6__global__.a.readyPromises =
        __WEBPACK_IMPORTED_MODULE_6__global__.a.readyPromises ||
        new __WEBPACK_IMPORTED_MODULE_0_cross_domain_safe_weakmap_src__.WeakMap()
    },
    function(module, __webpack_exports__, __webpack_require__) {
      'use strict'
      function request(options) {
        return __WEBPACK_IMPORTED_MODULE_4__lib__.g.run(function() {
          if (!options.name) throw new Error('Expected options.name')
          if (__WEBPACK_IMPORTED_MODULE_2__conf__.b.MOCK_MODE)
            options.window = window
          else if (typeof options.window === 'string') {
            var el = document.getElementById(options.window)
            if (!el)
              throw new Error(
                'Expected options.window ' +
                  options.window +
                  ' to be a valid element id'
              )
            if (el.tagName.toLowerCase() !== 'iframe')
              throw new Error(
                'Expected options.window ' + options.window + ' to be an iframe'
              )
            if (!el.contentWindow)
              throw new Error(
                'Iframe must have contentWindow.  Make sure it has a src attribute and is in the DOM.'
              )
            options.window = el.contentWindow
          } else if (options.window instanceof HTMLElement) {
            if (options.window.tagName.toLowerCase() !== 'iframe')
              throw new Error(
                'Expected options.window ' + options.window + ' to be an iframe'
              )
            if (!options.window.contentWindow)
              throw new Error(
                'Iframe must have contentWindow.  Make sure it has a src attribute and is in the DOM.'
              )
            options.window = options.window.contentWindow
          }
          if (!options.window)
            throw new Error(
              'Expected options.window to be a window object, iframe, or iframe element id.'
            )
          options.domain =
            options.domain || __WEBPACK_IMPORTED_MODULE_2__conf__.a.WILDCARD
          var hash =
            options.name +
            '_' +
            __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4__lib__.e)()
          __webpack_require__.i(
            __WEBPACK_IMPORTED_MODULE_3__drivers__.d
          )(hash, options)
          if (
            __webpack_require__.i(
              __WEBPACK_IMPORTED_MODULE_1_cross_domain_utils_src__.isWindowClosed
            )(options.window)
          )
            throw new Error('Target window is closed')
          var hasResult = !1,
            requestPromises = __WEBPACK_IMPORTED_MODULE_5__global__.a.requestPromises.get(
              options.window
            )
          if (!requestPromises) {
            requestPromises = []
            __WEBPACK_IMPORTED_MODULE_5__global__.a.requestPromises.set(
              options.window,
              requestPromises
            )
          }
          var requestPromise = __WEBPACK_IMPORTED_MODULE_4__lib__.g
            .run(function() {
              if (
                __webpack_require__.i(
                  __WEBPACK_IMPORTED_MODULE_1_cross_domain_utils_src__.isAncestor
                )(window, options.window)
              )
                return __webpack_require__.i(
                  __WEBPACK_IMPORTED_MODULE_4__lib__.s
                )(options.window)
            })
            .then(function() {
              return new __WEBPACK_IMPORTED_MODULE_4__lib__
                .g.Promise(function(resolve, reject) {
                options.respond = function(err, result) {
                  if (!err) {
                    hasResult = !0
                    requestPromises.splice(
                      requestPromises.indexOf(requestPromise, 1)
                    )
                  }
                  return err ? reject(err) : resolve(result)
                }
                __webpack_require__
                  .i(__WEBPACK_IMPORTED_MODULE_3__drivers__.e)(
                    options.window,
                    {
                      hash: hash,
                      type: __WEBPACK_IMPORTED_MODULE_2__conf__.a
                        .POST_MESSAGE_TYPE.REQUEST,
                      name: options.name,
                      data: options.data,
                      fireAndForget: options.fireAndForget
                    },
                    options.domain
                  )
                  .catch(reject)
                if (options.fireAndForget) return resolve()
                var ackTimeout =
                  __WEBPACK_IMPORTED_MODULE_2__conf__.b.ACK_TIMEOUT,
                  resTimeout =
                    options.timeout ||
                    __WEBPACK_IMPORTED_MODULE_2__conf__.b.RES_TIMEOUT,
                  interval = __webpack_require__.i(
                    __WEBPACK_IMPORTED_MODULE_4__lib__.q
                  )(function() {
                    if (options.ack && hasResult) return interval.cancel()
                    if (
                      __webpack_require__.i(
                        __WEBPACK_IMPORTED_MODULE_1_cross_domain_utils_src__.isWindowClosed
                      )(options.window)
                    ) {
                      interval.cancel()
                      return reject(
                        options.ack
                          ? new Error(
                              'Window closed for ' +
                                options.name +
                                ' before response'
                            )
                          : new Error(
                              'Window closed for ' +
                                options.name +
                                ' before ack'
                            )
                      )
                    }
                    ackTimeout -= 100
                    resTimeout -= 100
                    if (ackTimeout <= 0 && !options.ack) {
                      interval.cancel()
                      return reject(
                        new Error(
                          'No ack for postMessage ' +
                            options.name +
                            ' in ' +
                            __WEBPACK_IMPORTED_MODULE_2__conf__.b.ACK_TIMEOUT +
                            'ms'
                        )
                      )
                    }
                    if (resTimeout <= 0 && !hasResult) {
                      interval.cancel()
                      return reject(
                        new Error(
                          'No response for postMessage ' +
                            options.name +
                            ' in ' +
                            (options.timeout ||
                              __WEBPACK_IMPORTED_MODULE_2__conf__.b
                                .RES_TIMEOUT) +
                            'ms'
                        )
                      )
                    }
                  }, 100)
              })
            })
          requestPromise.catch(function() {
            __webpack_require__.i(
              __WEBPACK_IMPORTED_MODULE_3__drivers__.f
            )(hash)
          })
          requestPromises.push(requestPromise)
          return requestPromise
        })
      }
      function _send(window, name, data, options) {
        options = options || {}
        options.window = window
        options.name = name
        options.data = data
        return request(options)
      }
      function sendToParent(name, data, options) {
        var win = __webpack_require__.i(
          __WEBPACK_IMPORTED_MODULE_1_cross_domain_utils_src__.getAncestor
        )()
        return win
          ? _send(win, name, data, options)
          : new __WEBPACK_IMPORTED_MODULE_4__lib__.g.Promise(function(
              resolve,
              reject
            ) {
              return reject(new Error('Window does not have a parent'))
            })
      }
      function client() {
        var options = arguments.length > 0 && void 0 !== arguments[0]
          ? arguments[0]
          : {}
        if (!options.window) throw new Error('Expected options.window')
        return {
          send: function(name, data) {
            return _send(options.window, name, data, options)
          }
        }
      }
      var __WEBPACK_IMPORTED_MODULE_0_cross_domain_safe_weakmap_src__ = __webpack_require__(
        6
      ),
        __WEBPACK_IMPORTED_MODULE_1_cross_domain_utils_src__ = __webpack_require__(
          0
        ),
        __WEBPACK_IMPORTED_MODULE_2__conf__ = (__webpack_require__.n(
          __WEBPACK_IMPORTED_MODULE_1_cross_domain_utils_src__
        ), __webpack_require__(1)),
        __WEBPACK_IMPORTED_MODULE_3__drivers__ = __webpack_require__(8),
        __WEBPACK_IMPORTED_MODULE_4__lib__ = __webpack_require__(3),
        __WEBPACK_IMPORTED_MODULE_5__global__ = __webpack_require__(5)
      __webpack_require__.d(__webpack_exports__, 'a', function() {
        return _send
      })
      __webpack_exports__.b = request
      __webpack_exports__.c = sendToParent
      __webpack_exports__.d = client
      __WEBPACK_IMPORTED_MODULE_5__global__.a.requestPromises =
        __WEBPACK_IMPORTED_MODULE_5__global__.a.requestPromises ||
        new __WEBPACK_IMPORTED_MODULE_0_cross_domain_safe_weakmap_src__.WeakMap()
    },
    function(module, __webpack_exports__, __webpack_require__) {
      'use strict'
      function enableMockMode() {
        __WEBPACK_IMPORTED_MODULE_0__conf__.b.MOCK_MODE = !0
      }
      function disableMockMode() {
        __WEBPACK_IMPORTED_MODULE_0__conf__.b.MOCK_MODE = !1
      }
      function disable() {
        delete window[
          __WEBPACK_IMPORTED_MODULE_0__conf__.a.WINDOW_PROPS.POSTROBOT
        ]
        window.removeEventListener(
          'message',
          __WEBPACK_IMPORTED_MODULE_1__drivers__.b
        )
      }
      var __WEBPACK_IMPORTED_MODULE_0__conf__ = __webpack_require__(1),
        __WEBPACK_IMPORTED_MODULE_1__drivers__ = __webpack_require__(8)
      __webpack_require__.d(__webpack_exports__, 'c', function() {
        return __WEBPACK_IMPORTED_MODULE_0__conf__.b
      })
      __webpack_require__.d(__webpack_exports__, 'd', function() {
        return __WEBPACK_IMPORTED_MODULE_0__conf__.a
      })
      __webpack_exports__.a = enableMockMode
      __webpack_exports__.b = disableMockMode
      __webpack_exports__.e = disable
    },
    function(module, __webpack_exports__, __webpack_require__) {
      'use strict'
      var __WEBPACK_IMPORTED_MODULE_0_cross_domain_utils_src__ = __webpack_require__(
        0
      ),
        __WEBPACK_IMPORTED_MODULE_1__client__ = (__webpack_require__.n(
          __WEBPACK_IMPORTED_MODULE_0_cross_domain_utils_src__
        ), __webpack_require__(60))
      __webpack_require__.d(__webpack_exports__, 'd', function() {
        return __WEBPACK_IMPORTED_MODULE_1__client__.a
      })
      __webpack_require__.d(__webpack_exports__, 'e', function() {
        return __WEBPACK_IMPORTED_MODULE_1__client__.b
      })
      __webpack_require__.d(__webpack_exports__, 'f', function() {
        return __WEBPACK_IMPORTED_MODULE_1__client__.c
      })
      __webpack_require__.d(__webpack_exports__, 'g', function() {
        return __WEBPACK_IMPORTED_MODULE_1__client__.d
      })
      var __WEBPACK_IMPORTED_MODULE_2__server__ = __webpack_require__(63)
      __webpack_require__.d(__webpack_exports__, 'h', function() {
        return __WEBPACK_IMPORTED_MODULE_2__server__.a
      })
      __webpack_require__.d(__webpack_exports__, 'i', function() {
        return __WEBPACK_IMPORTED_MODULE_2__server__.b
      })
      __webpack_require__.d(__webpack_exports__, 'j', function() {
        return __WEBPACK_IMPORTED_MODULE_2__server__.c
      })
      __webpack_require__.d(__webpack_exports__, 'k', function() {
        return __WEBPACK_IMPORTED_MODULE_2__server__.d
      })
      var __WEBPACK_IMPORTED_MODULE_3__config__ = __webpack_require__(61)
      __webpack_require__.d(__webpack_exports__, 'l', function() {
        return __WEBPACK_IMPORTED_MODULE_3__config__.a
      })
      __webpack_require__.d(__webpack_exports__, 'm', function() {
        return __WEBPACK_IMPORTED_MODULE_3__config__.b
      })
      __webpack_require__.d(__webpack_exports__, 'n', function() {
        return __WEBPACK_IMPORTED_MODULE_3__config__.c
      })
      __webpack_require__.d(__webpack_exports__, 'o', function() {
        return __WEBPACK_IMPORTED_MODULE_3__config__.d
      })
      __webpack_require__.d(__webpack_exports__, 'p', function() {
        return __WEBPACK_IMPORTED_MODULE_3__config__.e
      })
      var __WEBPACK_IMPORTED_MODULE_4__lib_util__ = __webpack_require__(12)
      __webpack_require__.d(__webpack_exports__, 'c', function() {
        return __WEBPACK_IMPORTED_MODULE_4__lib_util__.util
      })
      __webpack_require__.d(__webpack_exports__, 'a', function() {
        return parent
      })
      __webpack_require__.d(__webpack_exports__, 'b', function() {
        return bridge
      })
      var parent = __webpack_require__.i(
        __WEBPACK_IMPORTED_MODULE_0_cross_domain_utils_src__.getAncestor
      )(),
        bridge = void 0
      bridge = __webpack_require__(50)
    },
    function(module, __webpack_exports__, __webpack_require__) {
      'use strict'
      function listen(options) {
        if (!options.name) throw new Error('Expected options.name')
        options.handler =
          options.handler || __WEBPACK_IMPORTED_MODULE_1__lib__.o
        options.errorHandler =
          options.errorHandler ||
          function(err) {
            throw err
          }
        options.source && (options.window = options.source)
        options.domain =
          options.domain || __WEBPACK_IMPORTED_MODULE_3__conf__.a.WILDCARD
        var requestListener = __webpack_require__.i(
          __WEBPACK_IMPORTED_MODULE_2__drivers__.c
        )(
          {
            name: options.name,
            win: options.window,
            domain: options.domain
          },
          options
        )
        if (options.once) {
          var handler = options.handler
          options.handler = __webpack_require__.i(
            __WEBPACK_IMPORTED_MODULE_1__lib__.p
          )(function() {
            requestListener.cancel()
            return handler.apply(this, arguments)
          })
        }
        options.handleError = function(err) {
          options.errorHandler(err)
        }
        if (options.window && options.errorOnClose) {
          var interval = __webpack_require__.i(
            __WEBPACK_IMPORTED_MODULE_1__lib__.q
          )(function() {
            if (
              __webpack_require__.i(
                __WEBPACK_IMPORTED_MODULE_0_cross_domain_utils_src__.isWindowClosed
              )(options.window)
            ) {
              interval.cancel()
              options.handleError(
                new Error('Post message target window is closed')
              )
            }
          }, 50)
        }
        return {
          cancel: function() {
            requestListener.cancel()
          }
        }
      }
      function _on(name, options, handler, errorHandler) {
        if (typeof options === 'function') {
          errorHandler = handler
          handler = options
          options = {}
        }
        options = options || {}
        options.name = name
        options.handler = handler || options.handler
        options.errorHandler = errorHandler || options.errorHandler
        return listen(options)
      }
      function once(name, options, handler, errorHandler) {
        if (typeof options === 'function') {
          errorHandler = handler
          handler = options
          options = {}
        }
        options = options || {}
        options.name = name
        options.handler = handler || options.handler
        options.errorHandler = errorHandler || options.errorHandler
        options.once = !0
        var prom = new __WEBPACK_IMPORTED_MODULE_1__lib__.g.Promise(function(
          resolve,
          reject
        ) {
          options.handler =
            options.handler ||
            function(event) {
              return resolve(event)
            }
          options.errorHandler = options.errorHandler || reject
        }),
          myListener = listen(options)
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__lib__.r)(
          prom,
          myListener
        )
        return prom
      }
      function listener() {
        var options = arguments.length > 0 && void 0 !== arguments[0]
          ? arguments[0]
          : {}
        return {
          on: function(name, handler, errorHandler) {
            return _on(name, options, handler, errorHandler)
          }
        }
      }
      var __WEBPACK_IMPORTED_MODULE_0_cross_domain_utils_src__ = __webpack_require__(
        0
      ),
        __WEBPACK_IMPORTED_MODULE_1__lib__ = (__webpack_require__.n(
          __WEBPACK_IMPORTED_MODULE_0_cross_domain_utils_src__
        ), __webpack_require__(3)),
        __WEBPACK_IMPORTED_MODULE_2__drivers__ = __webpack_require__(8),
        __WEBPACK_IMPORTED_MODULE_3__conf__ = __webpack_require__(1)
      __webpack_require__.d(__webpack_exports__, 'a', function() {
        return _on
      })
      __webpack_exports__.b = listen
      __webpack_exports__.c = once
      __webpack_exports__.d = listener
    },
    function(module, exports) {
      var g,
        _typeof = typeof Symbol === 'function' &&
          typeof Symbol.iterator === 'symbol'
          ? function(obj) {
              return typeof obj
            }
          : function(obj) {
              return obj &&
                typeof Symbol === 'function' &&
                obj.constructor === Symbol &&
                obj !== Symbol.prototype
                ? 'symbol'
                : typeof obj
            }
      g = (function() {
        return this
      })()
      try {
        g = g || Function('return this')() || (0, eval)('this')
      } catch (e) {
        ;(typeof window === 'undefined' ? 'undefined' : _typeof(window)) ===
          'object' && (g = window)
      }
      module.exports = g
    },
    function(module, __webpack_exports__, __webpack_require__) {
      'use strict'
      function normalizeChildProp(component, props, key, value) {
        var prop = component.props[key]
        if (prop) {
          if (typeof prop.childDef === 'function') {
            if (!value) {
              return prop.getter
                ? function() {
                    return Promise.resolve(prop.childDef.call())
                  }
                : prop.childDef.call()
            }
            if (prop.getter) {
              var val = value
              return function() {
                return val.apply(this, arguments).then(function(res) {
                  return res || prop.childDef.call()
                })
              }
            }
          }
          return value
        }
        if (component.looseProps) return value
      }
      function normalizeChildProps(component, props, origin) {
        for (
          var required =
            !(arguments.length > 3 && void 0 !== arguments[3]) || arguments[3],
            result = {},
            _iterator = Object.keys(props),
            _isArray = Array.isArray(_iterator),
            _i = 0,
            _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();
          ;

        ) {
          var _ref
          if (_isArray) {
            if (_i >= _iterator.length) break
            _ref = _iterator[_i++]
          } else {
            _i = _iterator.next()
            if (_i.done) break
            _ref = _i.value
          }
          var _key = _ref, prop = component.props[_key], value = props[_key]
          if (
            prop &&
            prop.sameDomain &&
            origin !==
              __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__lib__.d)(
                window
              )
          )
            return
          result[_key] = normalizeChildProp(component, props, _key, value)
          prop &&
            prop.alias &&
            !result[prop.alias] &&
            (result[prop.alias] = value)
        }
        if (required) {
          for (
            var _iterator2 = Object.keys(component.props),
              _isArray2 = Array.isArray(_iterator2),
              _i2 = 0,
              _iterator2 = _isArray2
                ? _iterator2
                : _iterator2[Symbol.iterator]();
            ;

          ) {
            var _ref2
            if (_isArray2) {
              if (_i2 >= _iterator2.length) break
              _ref2 = _iterator2[_i2++]
            } else {
              _i2 = _iterator2.next()
              if (_i2.done) break
              _ref2 = _i2.value
            }
            var key = _ref2
            props.hasOwnProperty(key) ||
              (result[key] = normalizeChildProp(
                component,
                props,
                key,
                props[key]
              ))
          }
        }
        return result
      }
      var __WEBPACK_IMPORTED_MODULE_0__lib__ = __webpack_require__(2)
      __webpack_exports__.a = normalizeChildProps
    },
    function(module, __webpack_exports__, __webpack_require__) {
      'use strict'
      function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor))
          throw new TypeError('Cannot call a class as a function')
      }
      function _possibleConstructorReturn(self, call) {
        if (!self)
          throw new ReferenceError(
            "this hasn't been initialised - super() hasn't been called"
          )
        return !call || (typeof call !== 'object' && typeof call !== 'function')
          ? self
          : call
      }
      function _inherits(subClass, superClass) {
        if (typeof superClass !== 'function' && superClass !== null)
          throw new TypeError(
            'Super expression must either be null or a function, not ' +
              typeof superClass
          )
        subClass.prototype = Object.create(superClass && superClass.prototype, {
          constructor: {
            value: subClass,
            enumerable: !1,
            writable: !0,
            configurable: !0
          }
        })
        superClass &&
          (Object.setPrototypeOf
            ? Object.setPrototypeOf(subClass, superClass)
            : (subClass.__proto__ = superClass))
      }
      function _applyDecoratedDescriptor(
        target,
        property,
        decorators,
        descriptor,
        context
      ) {
        var desc = {}
        Object.keys(descriptor).forEach(function(key) {
          desc[key] = descriptor[key]
        })
        desc.enumerable = !!desc.enumerable
        desc.configurable = !!desc.configurable
        ;('value' in desc || desc.initializer) && (desc.writable = !0)
        desc = decorators.slice().reverse().reduce(function(desc, decorator) {
          return decorator(target, property, desc) || desc
        }, desc)
        if (context && void 0 !== desc.initializer) {
          desc.value = desc.initializer
            ? desc.initializer.call(context)
            : void 0
          desc.initializer = void 0
        }
        if (void 0 === desc.initializer) {
          Object.defineProperty(target, property, desc)
          desc = null
        }
        return desc
      }
      function getByTag(tag) {
        return components[tag]
      }
      var __WEBPACK_IMPORTED_MODULE_0_post_robot_src__ = __webpack_require__(9),
        __WEBPACK_IMPORTED_MODULE_1__base__ = __webpack_require__(16),
        __WEBPACK_IMPORTED_MODULE_2__child__ = __webpack_require__(35),
        __WEBPACK_IMPORTED_MODULE_3__parent__ = __webpack_require__(24),
        __WEBPACK_IMPORTED_MODULE_4__delegate__ = __webpack_require__(71),
        __WEBPACK_IMPORTED_MODULE_5__props__ = __webpack_require__(67),
        __WEBPACK_IMPORTED_MODULE_6__window__ = __webpack_require__(17),
        __WEBPACK_IMPORTED_MODULE_7__constants__ = __webpack_require__(7),
        __WEBPACK_IMPORTED_MODULE_8__validate__ = __webpack_require__(70),
        __WEBPACK_IMPORTED_MODULE_9__templates_container__ = __webpack_require__(
          69
        )
      __webpack_require__.d(__webpack_exports__, 'd', function() {
        return __WEBPACK_IMPORTED_MODULE_9__templates_container__.a
      })
      var __WEBPACK_IMPORTED_MODULE_10__templates_component__ = __webpack_require__(
        68
      )
      __webpack_require__.d(__webpack_exports__, 'c', function() {
        return __WEBPACK_IMPORTED_MODULE_10__templates_component__.a
      })
      var __WEBPACK_IMPORTED_MODULE_11__drivers__ = __webpack_require__(75),
        __WEBPACK_IMPORTED_MODULE_12__lib__ = __webpack_require__(2)
      __webpack_require__.d(__webpack_exports__, 'a', function() {
        return Component
      })
      __webpack_exports__.b = getByTag
      var _class,
        _typeof = typeof Symbol === 'function' &&
          typeof Symbol.iterator === 'symbol'
          ? function(obj) {
              return typeof obj
            }
          : function(obj) {
              return obj &&
                typeof Symbol === 'function' &&
                obj.constructor === Symbol &&
                obj !== Symbol.prototype
                ? 'symbol'
                : typeof obj
            },
        _extends =
          Object.assign ||
          function(target) {
            for (var i = 1; i < arguments.length; i++) {
              var source = arguments[i]
              for (var key in source)
                Object.prototype.hasOwnProperty.call(source, key) &&
                  (target[key] = source[key])
            }
            return target
          },
        _createClass = (function() {
          function defineProperties(target, props) {
            for (var i = 0; i < props.length; i++) {
              var descriptor = props[i]
              descriptor.enumerable = descriptor.enumerable || !1
              descriptor.configurable = !0
              'value' in descriptor && (descriptor.writable = !0)
              Object.defineProperty(target, descriptor.key, descriptor)
            }
          }
          return function(Constructor, protoProps, staticProps) {
            protoProps && defineProperties(Constructor.prototype, protoProps)
            staticProps && defineProperties(Constructor, staticProps)
            return Constructor
          }
        })(),
        components = {},
        Component = ((_class = (function(_BaseComponent) {
          function Component() {
            var options = arguments.length > 0 && void 0 !== arguments[0]
              ? arguments[0]
              : {}
            _classCallCheck(this, Component)
            var _this = _possibleConstructorReturn(
              this,
              (Component.__proto__ || Object.getPrototypeOf(Component))
                .call(this, options)
            )
            _this.addProp(options, 'tag')
            _this.addProp(options, 'defaultLogLevel', 'info')
            _this.addProp(
              options,
              'allowedParentDomains',
              __WEBPACK_IMPORTED_MODULE_7__constants__.WILDCARD
            )
            __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_12__lib__.c)(
              _this.defaultLogLevel
            )
            if (components[_this.tag])
              throw new Error(
                'Can not register multiple components with the same tag'
              )
            _this.validate(options)
            _this.addProp(options, 'name', _this.tag.replace(/-/g, '_'))
            _this.props = _extends(
              {},
              __WEBPACK_IMPORTED_MODULE_5__props__.a,
              options.props || {}
            )
            options.props || (_this.looseProps = !0)
            _this.addProp(options, 'dimensions')
            _this.addProp(options, 'scrolling')
            _this.addProp(options, 'version', 'latest')
            _this.addProp(options, 'defaultEnv')
            _this.addProp(options, 'buildUrl')
            _this.addProp(options, 'sandboxContainer', !1)
            _this.addProp(options, 'url')
            _this.addProp(options, 'domain')
            _this.addProp(options, 'bridgeUrl')
            _this.addProp(options, 'bridgeDomain')
            _this.addProp(options, 'contexts', {
              iframe: !0,
              popup: !1
            })
            _this.addProp(options, 'defaultContext')
            _this.addProp(options, 'getInitialDimensions')
            _this.addProp(options, 'autoResize', !1)
            _this.addProp(options, 'containerTemplate', function(_ref) {
              var id = _ref.id, CLASS = _ref.CLASS
              return (
                '\n            <style>\n                #' +
                id +
                ' .' +
                CLASS.ELEMENT +
                ' {\n                    height: 150px;\n                    width: 300px;\n                }\n\n                #' +
                id +
                ' .' +
                CLASS.ELEMENT +
                ' iframe {\n                    height: 100%;\n                    width: 100%;\n                }\n            </style>\n\n            <div class="' +
                CLASS.ELEMENT +
                '"></div>\n        '
              )
            })
            _this.addProp(options, 'componentTemplate')
            _this.addProp(options, 'sacrificialComponentTemplate', !1)
            components[_this.tag] = _this
            _this.registerDrivers()
            _this.registerChild()
            _this.listenDelegate()
            return _this
          }
          _inherits(Component, _BaseComponent)
          _createClass(Component, [
            {
              key: 'registerDrivers',
              value: function() {
                this.driverCache = {}
                for (
                  var _iterator = Object.keys(
                    __WEBPACK_IMPORTED_MODULE_11__drivers__
                  ),
                    _isArray = Array.isArray(_iterator),
                    _i = 0,
                    _iterator = _isArray
                      ? _iterator
                      : _iterator[Symbol.iterator]();
                  ;

                ) {
                  var _ref2
                  if (_isArray) {
                    if (_i >= _iterator.length) break
                    _ref2 = _iterator[_i++]
                  } else {
                    _i = _iterator.next()
                    if (_i.done) break
                    _ref2 = _i.value
                  }
                  var driverName = _ref2,
                    driver =
                      __WEBPACK_IMPORTED_MODULE_11__drivers__[driverName],
                    glob = driver.global()
                  glob && this.driver(driverName, glob)
                }
              }
            },
            {
              key: 'driver',
              value: function(name, glob) {
                if (!__WEBPACK_IMPORTED_MODULE_11__drivers__[name])
                  throw new Error(
                    'Could not find driver for framework: ' + name
                  )
                this.driverCache[name] ||
                  (this.driverCache[
                    name
                  ] = __WEBPACK_IMPORTED_MODULE_11__drivers__[name].register(
                    this,
                    glob
                  ))
                return this.driverCache[name]
              }
            },
            {
              key: 'registerChild',
              value: function() {
                if (
                  __webpack_require__.i(
                    __WEBPACK_IMPORTED_MODULE_6__window__.g
                  )()
                ) {
                  if (
                    __webpack_require__.i(
                      __WEBPACK_IMPORTED_MODULE_6__window__.d
                    )().tag === this.tag
                  ) {
                    window.xchild = new __WEBPACK_IMPORTED_MODULE_2__child__.a(
                      this
                    )
                    window.xprops = window.xchild.props
                  }
                }
              }
            },
            {
              key: 'listenDelegate',
              value: function() {
                var _this2 = this
                __webpack_require__.i(
                  __WEBPACK_IMPORTED_MODULE_0_post_robot_src__.c
                )(
                  __WEBPACK_IMPORTED_MODULE_7__constants__.POST_MESSAGE
                    .DELEGATE +
                    '_' +
                    this.name,
                  function(_ref3) {
                    var source = _ref3.source,
                      origin = _ref3.origin,
                      data = _ref3.data,
                      domain = _this2.getDomain(null, {
                        env: data.env || _this2.defaultEnv
                      })
                    if (!domain)
                      throw new Error(
                        'Could not determine domain to allow remote render'
                      )
                    if (domain !== origin)
                      throw new Error(
                        'Can not render from ' +
                          origin +
                          ' - expected ' +
                          domain
                      )
                    var delegate = _this2.delegate(source, data.options)
                    return {
                      overrides: delegate.getOverrides(data.context),
                      destroy: function() {
                        return delegate.destroy()
                      }
                    }
                  }
                )
              }
            },
            {
              key: 'getValidDomain',
              value: function(url) {
                if (url) {
                  var domain = __webpack_require__.i(
                    __WEBPACK_IMPORTED_MODULE_12__lib__.X
                  )(url)
                  if (typeof this.domain === 'string' && domain === this.domain)
                    return domain
                  if (this.domain && _typeof(this.domain) === 'object') {
                    for (
                      var _iterator2 = Object.keys(this.domain),
                        _isArray2 = Array.isArray(_iterator2),
                        _i2 = 0,
                        _iterator2 = _isArray2
                          ? _iterator2
                          : _iterator2[Symbol.iterator]();
                      ;

                    ) {
                      var _ref4
                      if (_isArray2) {
                        if (_i2 >= _iterator2.length) break
                        _ref4 = _iterator2[_i2++]
                      } else {
                        _i2 = _iterator2.next()
                        if (_i2.done) break
                        _ref4 = _i2.value
                      }
                      var env = _ref4
                      if (env !== 'test' && domain === this.domain[env])
                        return domain
                    }
                  }
                }
              }
            },
            {
              key: 'getDomain',
              value: function(url) {
                var props = arguments.length > 1 && void 0 !== arguments[1]
                  ? arguments[1]
                  : {},
                  domain = this.getValidDomain(url)
                if (domain) return domain
                domain = this.getForEnv(this.domain, props.env)
                if (domain) return domain
                var envUrl = this.getForEnv(this.url, props.env)
                return envUrl
                  ? __webpack_require__.i(
                      __WEBPACK_IMPORTED_MODULE_12__lib__.X
                    )(envUrl)
                  : url
                      ? __webpack_require__.i(
                          __WEBPACK_IMPORTED_MODULE_12__lib__.X
                        )(url)
                      : void 0
              }
            },
            {
              key: 'getBridgeUrl',
              value: function(env) {
                return this.getForEnv(this.bridgeUrl, env)
              }
            },
            {
              key: 'getForEnv',
              value: function(item, env) {
                if (item) {
                  if (typeof item === 'string') return item
                  env || (env = this.defaultEnv)
                  if (env)
                    return env &&
                      (void 0 === item ? 'undefined' : _typeof(item)) ===
                        'object' &&
                      item[env]
                      ? item[env]
                      : void 0
                }
              }
            },
            {
              key: 'getBridgeDomain',
              value: function(env) {
                var bridgeDomain = this.getForEnv(this.bridgeDomain, env)
                if (bridgeDomain) return bridgeDomain
                var bridgeUrl = this.getBridgeUrl(env)
                return bridgeUrl
                  ? __webpack_require__.i(
                      __WEBPACK_IMPORTED_MODULE_12__lib__.X
                    )(bridgeUrl)
                  : void 0
              }
            },
            {
              key: 'getUrl',
              value: function(env, props) {
                var url = this.getForEnv(this.url, env)
                return url || (this.buildUrl ? this.buildUrl(props) : void 0)
              }
            },
            {
              key: 'isXComponent',
              value: function() {
                return __webpack_require__.i(
                  __WEBPACK_IMPORTED_MODULE_6__window__.g
                )()
              }
            },
            {
              key: 'isChild',
              value: function() {
                return (
                  __webpack_require__.i(
                    __WEBPACK_IMPORTED_MODULE_6__window__.g
                  )() &&
                  __webpack_require__.i(
                    __WEBPACK_IMPORTED_MODULE_6__window__.d
                  )().tag === this.tag
                )
              }
            },
            {
              key: 'parent',
              value: function(options) {
                return new __WEBPACK_IMPORTED_MODULE_3__parent__.b(
                  this,
                  null,
                  options
                )
              }
            },
            {
              key: 'child',
              value: function(options) {
                if (!window.xchild) throw new Error('Child not instantiated')
                window.xchild.component
                return window.xchild
              }
            },
            {
              key: 'attach',
              value: function(options) {
                return this.child(options)
              }
            },
            {
              key: 'error',
              value: function(message, tag) {
                return new Error('[' + (this.tag || tag) + '] ' + message)
              }
            },
            {
              key: 'init',
              value: function(props, context, element) {
                context = this.getRenderContext(element)
                return new __WEBPACK_IMPORTED_MODULE_3__parent__.b(
                  this,
                  context,
                  {
                    props: props
                  }
                )
              }
            },
            {
              key: 'delegate',
              value: function(source) {
                var options = arguments.length > 1 && void 0 !== arguments[1]
                  ? arguments[1]
                  : {}
                return new __WEBPACK_IMPORTED_MODULE_4__delegate__.a(
                  this,
                  source,
                  options
                )
              }
            },
            {
              key: 'validateRenderContext',
              value: function(context) {
                if (!this.contexts[context])
                  throw new Error(
                    '[' + this.tag + '] Can not render to ' + context
                  )
              }
            },
            {
              key: 'getRenderContext',
              value: function(element) {
                if (element) {
                  this.validateRenderContext(
                    __WEBPACK_IMPORTED_MODULE_7__constants__.CONTEXT_TYPES
                      .IFRAME
                  )
                  return __WEBPACK_IMPORTED_MODULE_7__constants__.CONTEXT_TYPES
                    .IFRAME
                }
                if (this.defaultContext) return this.defaultContext
                if (
                  this.contexts[
                    __WEBPACK_IMPORTED_MODULE_7__constants__.CONTEXT_TYPES
                      .IFRAME
                  ]
                )
                  return __WEBPACK_IMPORTED_MODULE_7__constants__.CONTEXT_TYPES
                    .IFRAME
                if (
                  this.contexts[
                    __WEBPACK_IMPORTED_MODULE_7__constants__.CONTEXT_TYPES.POPUP
                  ]
                )
                  return __WEBPACK_IMPORTED_MODULE_7__constants__.CONTEXT_TYPES
                    .POPUP
                throw new Error(
                  '[' + this.tag + '] No context options available for render'
                )
              }
            },
            {
              key: 'render',
              value: function(props, element) {
                return new __WEBPACK_IMPORTED_MODULE_3__parent__.b(
                  this,
                  this.getRenderContext(element),
                  {
                    props: props
                  }
                ).render(element || document.body)
              }
            },
            {
              key: 'renderIframe',
              value: function(props) {
                var element = arguments.length > 1 && void 0 !== arguments[1]
                  ? arguments[1]
                  : document.body
                this.validateRenderContext(
                  __WEBPACK_IMPORTED_MODULE_7__constants__.CONTEXT_TYPES.IFRAME
                )
                return new __WEBPACK_IMPORTED_MODULE_3__parent__.b(
                  this,
                  __WEBPACK_IMPORTED_MODULE_7__constants__.CONTEXT_TYPES.IFRAME,
                  {
                    props: props
                  }
                ).render(element)
              }
            },
            {
              key: 'renderPopup',
              value: function(props) {
                this.validateRenderContext(
                  __WEBPACK_IMPORTED_MODULE_7__constants__.CONTEXT_TYPES.POPUP
                )
                return new __WEBPACK_IMPORTED_MODULE_3__parent__.b(
                  this,
                  __WEBPACK_IMPORTED_MODULE_7__constants__.CONTEXT_TYPES.POPUP,
                  {
                    props: props
                  }
                ).render()
              }
            },
            {
              key: 'renderTo',
              value: function(win, props, element) {
                return new __WEBPACK_IMPORTED_MODULE_3__parent__.b(
                  this,
                  this.getRenderContext(element),
                  {
                    props: props
                  }
                ).renderTo(win, element)
              }
            },
            {
              key: 'renderIframeTo',
              value: function(win, props, element) {
                this.validateRenderContext(
                  __WEBPACK_IMPORTED_MODULE_7__constants__.CONTEXT_TYPES.IFRAME
                )
                return new __WEBPACK_IMPORTED_MODULE_3__parent__.b(
                  this,
                  __WEBPACK_IMPORTED_MODULE_7__constants__.CONTEXT_TYPES.IFRAME,
                  {
                    props: props
                  }
                ).renderTo(win, element)
              }
            },
            {
              key: 'renderPopupTo',
              value: function(win, props) {
                this.validateRenderContext(
                  __WEBPACK_IMPORTED_MODULE_7__constants__.CONTEXT_TYPES.POPUP
                )
                return new __WEBPACK_IMPORTED_MODULE_3__parent__.b(
                  this,
                  __WEBPACK_IMPORTED_MODULE_7__constants__.CONTEXT_TYPES.POPUP,
                  {
                    props: props
                  }
                ).renderTo(win)
              }
            },
            {
              key: 'getByTag',
              value: function(tag) {
                return components[tag]
              }
            },
            {
              key: 'validate',
              value: function(options) {
                return __webpack_require__.i(
                  __WEBPACK_IMPORTED_MODULE_8__validate__.a
                )(this, options)
              }
            },
            {
              key: 'log',
              value: function(event) {
                var payload = arguments.length > 1 && void 0 !== arguments[1]
                  ? arguments[1]
                  : {}
                __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_12__lib__.Y)(
                  this.name,
                  event,
                  payload
                )
              }
            },
            {
              key: 'logWarning',
              value: function(event, payload) {
                __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_12__lib__.Z)(
                  this.name,
                  event,
                  payload
                )
              }
            },
            {
              key: 'logError',
              value: function(event, payload) {
                __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_12__lib__._0)(
                  this.name,
                  event,
                  payload
                )
              }
            }
          ])
          return Component
        })(__WEBPACK_IMPORTED_MODULE_1__base__.a)), _applyDecoratedDescriptor(
          _class.prototype,
          'render',
          [__WEBPACK_IMPORTED_MODULE_12__lib__.M],
          Object.getOwnPropertyDescriptor(_class.prototype, 'render'),
          _class.prototype
        ), _applyDecoratedDescriptor(
          _class.prototype,
          'renderIframe',
          [__WEBPACK_IMPORTED_MODULE_12__lib__.M],
          Object.getOwnPropertyDescriptor(_class.prototype, 'renderIframe'),
          _class.prototype
        ), _applyDecoratedDescriptor(
          _class.prototype,
          'renderPopup',
          [__WEBPACK_IMPORTED_MODULE_12__lib__.M],
          Object.getOwnPropertyDescriptor(_class.prototype, 'renderPopup'),
          _class.prototype
        ), _applyDecoratedDescriptor(
          _class.prototype,
          'renderTo',
          [__WEBPACK_IMPORTED_MODULE_12__lib__.M],
          Object.getOwnPropertyDescriptor(_class.prototype, 'renderTo'),
          _class.prototype
        ), _applyDecoratedDescriptor(
          _class.prototype,
          'renderIframeTo',
          [__WEBPACK_IMPORTED_MODULE_12__lib__.M],
          Object.getOwnPropertyDescriptor(_class.prototype, 'renderIframeTo'),
          _class.prototype
        ), _applyDecoratedDescriptor(
          _class.prototype,
          'renderPopupTo',
          [__WEBPACK_IMPORTED_MODULE_12__lib__.M],
          Object.getOwnPropertyDescriptor(_class.prototype, 'renderPopupTo'),
          _class.prototype
        ), _class)
    },
    function(module, __webpack_exports__, __webpack_require__) {
      'use strict'
      var __WEBPACK_IMPORTED_MODULE_0__lib__ = __webpack_require__(2)
      __webpack_require__.d(__webpack_exports__, 'a', function() {
        return internalProps
      })
      var internalProps = {
        env: {
          type: 'string',
          required: !1,
          queryParam: !0,
          def: function() {
            return this.defaultEnv
          }
        },
        uid: {
          type: 'string',
          def: function() {
            return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__lib__.r)()
          },
          queryParam: !0
        },
        url: {
          type: 'string',
          required: !1,
          promise: !0,
          sendToChild: !1
        },
        version: {
          type: 'string',
          required: !1,
          queryParam: !0
        },
        timeout: {
          type: 'number',
          required: !1,
          sendToChild: !1
        },
        onDisplay: {
          type: 'function',
          required: !1,
          noop: !0,
          promisify: !0,
          sendToChild: !1
        },
        onEnter: {
          type: 'function',
          required: !1,
          noop: !0,
          promisify: !0,
          sendToChild: !1
        },
        onRender: {
          type: 'function',
          required: !1,
          noop: !0,
          promisify: !0,
          sendToChild: !1
        },
        onClose: {
          type: 'function',
          required: !1,
          noop: !0,
          once: !0,
          promisify: !0,
          sendToChild: !1
        },
        onTimeout: {
          type: 'function',
          required: !1,
          memoize: !0,
          promisify: !0,
          sendToChild: !1,
          def: function() {
            return function(err) {
              if (this.props.onError) return this.props.onError(err)
              throw err
            }
          }
        },
        onError: {
          type: 'function',
          required: !1,
          promisify: !0,
          sendToChild: !0,
          once: !0
        },
        logLevel: {
          type: 'string',
          required: !1,
          queryParam: !0,
          def: function() {
            return this.defaultLogLevel
          }
        }
      }
    },
    function(module, __webpack_exports__, __webpack_require__) {
      'use strict'
      function _objectDestructuringEmpty(obj) {
        if (obj == null) throw new TypeError('Cannot destructure undefined')
      }
      function componentTemplate(_ref) {
        _objectDestructuringEmpty(_ref)
        return ''
      }
      __webpack_exports__.a = componentTemplate
    },
    function(module, __webpack_exports__, __webpack_require__) {
      'use strict'
      function containerTemplate(_ref) {
        var id = _ref.id, CLASS = _ref.CLASS
        return (
          '\n        <div class="' +
          CLASS.XCOMPONENT +
          '-overlay ' +
          CLASS.FOCUS +
          '">\n            <a href="#' +
          CLASS.CLOSE +
          '" class="' +
          CLASS.CLOSE +
          '"></a>\n\n            <div class="' +
          CLASS.ELEMENT +
          '"></div>\n        </div>\n\n        <style>\n            #' +
          id +
          ' .' +
          CLASS.XCOMPONENT +
          '-overlay {\n                position: absolute;\n                top: 0;\n                left: 0;\n                width: 100%;\n                height: 100%;\n                background-color: rgba(0, 0, 0, 0.8);\n            }\n\n            #' +
          id +
          '.' +
          CLASS.POPUP +
          ' .' +
          CLASS.XCOMPONENT +
          '-overlay {\n                cursor: pointer;\n            }\n\n            #' +
          id +
          '.' +
          CLASS.IFRAME +
          ' .' +
          CLASS.ELEMENT +
          ' {\n                box-shadow: 2px 2px 10px 3px rgba(0, 0, 0, 0.4);\n                position: fixed;\n\n                top: 50%;\n                left: 50%;\n\n                transform: translate3d(-50%, -50%, 0);\n                -webkit-transform: translate3d(-50%, -50%, 0);\n                -moz-transform: translate3d(-50%, -50%, 0);\n                -o-transform: translate3d(-50%, -50%, 0);\n                -ms-transform: translate3d(-50%, -50%, 0);\n            }\n\n            #' +
          id +
          '.' +
          CLASS.IFRAME +
          ' iframe {\n                height: 100%;\n                width: 100%;\n            }\n\n            #' +
          id +
          ' .' +
          CLASS.CLOSE +
          ' {\n                position: absolute;\n                right: 16px;\n                top: 16px;\n                width: 16px;\n                height: 16px;\n                opacity: 0.6;\n            }\n\n            #' +
          id +
          ' .' +
          CLASS.CLOSE +
          ':hover {\n                opacity: 1;\n            }\n\n            #' +
          id +
          ' .' +
          CLASS.CLOSE +
          ':before,\n            #' +
          id +
          '  .' +
          CLASS.CLOSE +
          ":after {\n                position: absolute;\n                left: 8px;\n                content: ' ';\n                height: 16px;\n                width: 2px;\n                background-color: white;\n            }\n\n            #" +
          id +
          ' .' +
          CLASS.CLOSE +
          ':before {\n                transform: rotate(45deg);\n            }\n\n            #' +
          id +
          ' .' +
          CLASS.CLOSE +
          ':after {\n                transform: rotate(-45deg);\n            }\n        </style>\n    '
        )
      }
      __webpack_exports__.a = containerTemplate
    },
    function(module, __webpack_exports__, __webpack_require__) {
      'use strict'
      function validateProps(component, options) {
        if (options.props && _typeof(options.props) !== 'object')
          throw component.error('Expected options.props to be an object')
        if (options.props) {
          for (
            var _iterator = Object.keys(options.props),
              _isArray = Array.isArray(_iterator),
              _i = 0,
              _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();
            ;

          ) {
            var _ref
            if (_isArray) {
              if (_i >= _iterator.length) break
              _ref = _iterator[_i++]
            } else {
              _i = _iterator.next()
              if (_i.done) break
              _ref = _i.value
            }
            var key = _ref, prop = options.props[key]
            if (
              !prop ||
              (void 0 === prop ? 'undefined' : _typeof(prop)) !== 'object'
            )
              throw component.error(
                'Expected options.props.' + key + ' to be an object'
              )
            if (!prop.type) throw component.error('Expected prop.type')
            if (
              __WEBPACK_IMPORTED_MODULE_0__constants__.PROP_TYPES_LIST.indexOf(
                prop.type
              ) === -1
            )
              throw component.error(
                'Expected prop.type to be one of ' +
                  __WEBPACK_IMPORTED_MODULE_0__constants__.PROP_TYPES_LIST.join(
                    ', '
                  )
              )
            if (prop.required && prop.def)
              throw component.error(
                'Required prop can not have a default value'
              )
          }
        }
      }
      function validate(component, options) {
        if (!options.tag || !options.tag.match(/^[a-z0-9-]+$/))
          throw new Error('Invalid options.tag: ' + options.tag)
        validateProps(component, options)
        if (options.dimensions) {
          if (
            !__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__lib__._1)(
              options.dimensions.width
            ) &&
            !__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__lib__._2)(
              options.dimensions.width
            )
          )
            throw component.error(
              'Expected options.dimensions.width to be a px or % string value'
            )
          if (
            !__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__lib__._1)(
              options.dimensions.height
            ) &&
            !__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__lib__._2)(
              options.dimensions.height
            )
          )
            throw component.error(
              'Expected options.dimensions.height to be a px or % string value'
            )
        }
        if (options.contexts) {
          if ((options.contexts.popup, !1))
            throw new Error(
              'Popups not supported in this build -- please use the full xcomponent.js build'
            )
          for (
            var anyEnabled = !1,
              _iterator2 = Object.keys(options.contexts),
              _isArray2 = Array.isArray(_iterator2),
              _i2 = 0,
              _iterator2 = _isArray2
                ? _iterator2
                : _iterator2[Symbol.iterator]();
            ;

          ) {
            var _ref2
            if (_isArray2) {
              if (_i2 >= _iterator2.length) break
              _ref2 = _iterator2[_i2++]
            } else {
              _i2 = _iterator2.next()
              if (_i2.done) break
              _ref2 = _i2.value
            }
            var context = _ref2
            if (
              __WEBPACK_IMPORTED_MODULE_0__constants__.CONTEXT_TYPES_LIST.indexOf(
                context
              ) === -1
            )
              throw component.error('Unsupported context type: ' + context)
            ;(options.contexts[context] ||
              void 0 === options.contexts[context]) &&
              (anyEnabled = !0)
          }
          if (!anyEnabled) throw component.error('No context type is enabled')
        }
        if (options.defaultContext) {
          if (
            __WEBPACK_IMPORTED_MODULE_0__constants__.CONTEXT_TYPES_LIST.indexOf(
              options.defaultContext
            ) === -1
          )
            throw component.error(
              'Unsupported context type: ' + options.defaultContext
            )
          if (options.contexts && !options.contexts[options.defaultContext])
            throw component.error(
              'Disallowed default context type: ' + options.defaultContext
            )
        }
        if (!options.url && !options.buildUrl)
          throw component.error('Expected options.url to be passed')
        if (options.url && options.buildUrl)
          throw component.error('Can not pass options.url and options.buildUrl')
        if (options.defaultEnv) {
          if (typeof options.defaultEnv !== 'string')
            throw component.error('Expected options.defaultEnv to be a string')
          if (!options.buildUrl && _typeof(options.url) !== 'object')
            throw component.error(
              'Expected options.url to be an object mapping env->url'
            )
          if (
            options.url &&
            _typeof(options.url) === 'object' &&
            !options.url[options.defaultEnv]
          )
            throw component.error(
              'No url found for default env: ' + options.defaultEnv
            )
        }
        if (options.url && _typeof(options.url) === 'object') {
          if (!options.defaultEnv)
            throw component.error(
              'Must pass options.defaultEnv with env->url mapping'
            )
          for (
            var _iterator3 = Object.keys(options.url),
              _isArray3 = Array.isArray(_iterator3),
              _i3 = 0,
              _iterator3 = _isArray3
                ? _iterator3
                : _iterator3[Symbol.iterator]();
            ;

          ) {
            var _ref3
            if (_isArray3) {
              if (_i3 >= _iterator3.length) break
              _ref3 = _iterator3[_i3++]
            } else {
              _i3 = _iterator3.next()
              if (_i3.done) break
              _ref3 = _i3.value
            }
            var env = _ref3
            if (!options.url[env])
              throw component.error('No url specified for env: ' + env)
          }
        }
        if (
          options.componentTemplate &&
          typeof options.componentTemplate !== 'function'
        )
          throw component.error(
            'Expected options.componentTemplate to be a function'
          )
        if (
          options.containerTemplate &&
          typeof options.containerTemplate !== 'function'
        )
          throw component.error(
            'Expected options.containerTemplate to be a function'
          )
      }
      var __WEBPACK_IMPORTED_MODULE_0__constants__ = __webpack_require__(7),
        __WEBPACK_IMPORTED_MODULE_1__lib__ = __webpack_require__(2)
      __webpack_exports__.a = validate
      var _typeof = typeof Symbol === 'function' &&
        typeof Symbol.iterator === 'symbol'
        ? function(obj) {
            return typeof obj
          }
        : function(obj) {
            return obj &&
              typeof Symbol === 'function' &&
              obj.constructor === Symbol &&
              obj !== Symbol.prototype
              ? 'symbol'
              : typeof obj
          }
    },
    function(module, __webpack_exports__, __webpack_require__) {
      'use strict'
      function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor))
          throw new TypeError('Cannot call a class as a function')
      }
      function _possibleConstructorReturn(self, call) {
        if (!self)
          throw new ReferenceError(
            "this hasn't been initialised - super() hasn't been called"
          )
        return !call || (typeof call !== 'object' && typeof call !== 'function')
          ? self
          : call
      }
      function _inherits(subClass, superClass) {
        if (typeof superClass !== 'function' && superClass !== null)
          throw new TypeError(
            'Super expression must either be null or a function, not ' +
              typeof superClass
          )
        subClass.prototype = Object.create(superClass && superClass.prototype, {
          constructor: {
            value: subClass,
            enumerable: !1,
            writable: !0,
            configurable: !0
          }
        })
        superClass &&
          (Object.setPrototypeOf
            ? Object.setPrototypeOf(subClass, superClass)
            : (subClass.__proto__ = superClass))
      }
      var __WEBPACK_IMPORTED_MODULE_0__base__ = __webpack_require__(16),
        __WEBPACK_IMPORTED_MODULE_1__parent__ = __webpack_require__(24),
        __WEBPACK_IMPORTED_MODULE_2__parent_drivers__ = __webpack_require__(37),
        __WEBPACK_IMPORTED_MODULE_3__lib__ = __webpack_require__(2)
      __webpack_require__.d(__webpack_exports__, 'a', function() {
        return DelegateComponent
      })
      var _createClass = (function() {
        function defineProperties(target, props) {
          for (var i = 0; i < props.length; i++) {
            var descriptor = props[i]
            descriptor.enumerable = descriptor.enumerable || !1
            descriptor.configurable = !0
            'value' in descriptor && (descriptor.writable = !0)
            Object.defineProperty(target, descriptor.key, descriptor)
          }
        }
        return function(Constructor, protoProps, staticProps) {
          protoProps && defineProperties(Constructor.prototype, protoProps)
          staticProps && defineProperties(Constructor, staticProps)
          return Constructor
        }
      })(),
        DelegateComponent = (function(_BaseComponent) {
          function DelegateComponent(component, source) {
            var options = arguments.length > 2 && void 0 !== arguments[2]
              ? arguments[2]
              : {}
            _classCallCheck(this, DelegateComponent)
            var _this = _possibleConstructorReturn(
              this,
              (DelegateComponent.__proto__ ||
                Object.getPrototypeOf(DelegateComponent))
                .call(this, component, options)
            )
            _this.component = component
            _this.clean.set('source', source)
            _this.context = options.context
            _this.props = options.props
            _this.props = {
              uid: options.props.uid,
              dimensions: options.props.dimensions,
              onClose: options.props.onClose,
              onDisplay: options.props.onDisplay
            }
            _this.focus = options.overrides.focus
            _this.userClose = options.overrides.userClose
            _this.getDomain = options.overrides.getDomain
            _this.getContainerTemplate = options.overrides.getContainerTemplate
            _this.getComponentTemplate = options.overrides.getComponentTemplate
            for (
              var delegateOverrides =
                __WEBPACK_IMPORTED_MODULE_2__parent_drivers__.a[options.context]
                  .delegateOverrides,
                _iterator = Object.keys(delegateOverrides),
                _isArray = Array.isArray(_iterator),
                _i = 0,
                _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();
              ;

            ) {
              var _ref
              if (_isArray) {
                if (_i >= _iterator.length) break
                _ref = _iterator[_i++]
              } else {
                _i = _iterator.next()
                if (_i.done) break
                _ref = _i.value
              }
              var key = _ref
              _this[key] =
                __WEBPACK_IMPORTED_MODULE_1__parent__.b.prototype[key]
            }
            _this.childWindowName = options.childWindowName
            __WEBPACK_IMPORTED_MODULE_1__parent__.b.prototype.registerActiveComponent.call(
              _this
            )
            _this.watchForClose()
            return _this
          }
          _inherits(DelegateComponent, _BaseComponent)
          _createClass(DelegateComponent, [
            {
              key: 'watchForClose',
              value: function() {
                var _this2 = this,
                  closeListener = __webpack_require__.i(
                    __WEBPACK_IMPORTED_MODULE_3__lib__.i
                  )(this.source, function() {
                    return _this2.destroy()
                  }),
                  unloadListener = __webpack_require__.i(
                    __WEBPACK_IMPORTED_MODULE_3__lib__.z
                  )(window, 'unload', closeListener.cancel)
                this.clean.register(function() {
                  closeListener.cancel()
                  unloadListener.cancel()
                })
              }
            },
            {
              key: 'getOverrides',
              value: function(context) {
                for (
                  var delegateOverrides =
                    __WEBPACK_IMPORTED_MODULE_2__parent_drivers__.a[context]
                      .delegateOverrides,
                    overrides = {},
                    self = this,
                    _iterator2 = Object.keys(delegateOverrides),
                    _isArray2 = Array.isArray(_iterator2),
                    _i2 = 0,
                    _iterator2 = _isArray2
                      ? _iterator2
                      : _iterator2[Symbol.iterator]();
                  ;

                ) {
                  var _ref2
                  if (
                    (function() {
                      if (_isArray2) {
                        if (_i2 >= _iterator2.length) return 'break'
                        _ref2 = _iterator2[_i2++]
                      } else {
                        _i2 = _iterator2.next()
                        if (_i2.done) return 'break'
                        _ref2 = _i2.value
                      }
                      var key = _ref2
                      overrides[key] = function() {
                        return __WEBPACK_IMPORTED_MODULE_1__parent__.b.prototype[
                          key
                        ].apply(self, arguments)
                      }
                    })() === 'break'
                  )
                    break
                }
                return overrides
              }
            },
            {
              key: 'destroy',
              value: function() {
                return this.clean.all()
              }
            },
            {
              key: 'driver',
              get: function() {
                if (!this.context) throw new Error('Context not set')
                return __WEBPACK_IMPORTED_MODULE_2__parent_drivers__.a[
                  this.context
                ]
              }
            }
          ])
          return DelegateComponent
        })(__WEBPACK_IMPORTED_MODULE_0__base__.a)
    },
    function(module, __webpack_exports__, __webpack_require__) {
      'use strict'
      var __WEBPACK_IMPORTED_MODULE_0__lib__ = __webpack_require__(2)
      __webpack_require__.d(__webpack_exports__, 'a', function() {
        return angular
      })
      var angular = {
        global: function() {
          return window.angular
        },
        register: function(component, ng) {
          ng
            .module(component.tag, [])
            .directive(
              __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__lib__._3)(
                component.tag
              ),
              function() {
                for (
                  var scope = {},
                    _iterator = Object.keys(component.props),
                    _isArray = Array.isArray(_iterator),
                    _i = 0,
                    _iterator = _isArray
                      ? _iterator
                      : _iterator[Symbol.iterator]();
                  ;

                ) {
                  var _ref
                  if (_isArray) {
                    if (_i >= _iterator.length) break
                    _ref = _iterator[_i++]
                  } else {
                    _i = _iterator.next()
                    if (_i.done) break
                    _ref = _i.value
                  }
                  scope[_ref] = '='
                }
                component.looseProps && (scope.props = '=')
                return {
                  scope: scope,
                  restrict: 'E',
                  controller: function($scope, $element) {
                    function safeApply(fn) {
                      if (
                        $scope.$root.$$phase !== '$apply' &&
                        $scope.$root.$$phase !== '$digest'
                      ) {
                        try {
                          $scope.$apply()
                        } catch (err) {
                          console.warn(
                            'Error trying to scope.apply on prop function call:',
                            err
                          )
                        }
                      }
                    }
                    function getProps() {
                      var scopeProps = void 0
                      if ($scope.props) scopeProps = $scope.props
                      else {
                        scopeProps = {}
                        for (
                          var _iterator2 = Object.keys(scope),
                            _isArray2 = Array.isArray(_iterator2),
                            _i2 = 0,
                            _iterator2 = _isArray2
                              ? _iterator2
                              : _iterator2[Symbol.iterator]();
                          ;

                        ) {
                          var _ref2
                          if (_isArray2) {
                            if (_i2 >= _iterator2.length) break
                            _ref2 = _iterator2[_i2++]
                          } else {
                            _i2 = _iterator2.next()
                            if (_i2.done) break
                            _ref2 = _i2.value
                          }
                          var key = _ref2
                          scopeProps[key] = $scope[key]
                        }
                      }
                      scopeProps = __webpack_require__.i(
                        __WEBPACK_IMPORTED_MODULE_0__lib__._4
                      )(scopeProps, function(value, key, fullKey) {
                        if (typeof value === 'function') {
                          return function() {
                            var result = value.apply(this, arguments)
                            safeApply()
                            return result
                          }
                        }
                      })
                      return scopeProps
                    }
                    if (component.looseProps && !$scope.props)
                      throw new Error(
                        'For angular bindings to work, prop definitions must be passed to xcomponent.create'
                      )
                    component.log('instantiate_angular_component')
                    var parent = component.init(getProps(), null, $element[0])
                    parent.render($element[0])
                    $scope.$watch(function() {
                      parent.updateProps(getProps())
                    })
                  }
                }
              }
            )
          return component
        }
      }
    },
    function(module, exports) {},
    function(module, __webpack_exports__, __webpack_require__) {
      'use strict'
      function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor))
          throw new TypeError('Cannot call a class as a function')
      }
      function _possibleConstructorReturn(self, call) {
        if (!self)
          throw new ReferenceError(
            "this hasn't been initialised - super() hasn't been called"
          )
        return !call || (typeof call !== 'object' && typeof call !== 'function')
          ? self
          : call
      }
      function _inherits(subClass, superClass) {
        if (typeof superClass !== 'function' && superClass !== null)
          throw new TypeError(
            'Super expression must either be null or a function, not ' +
              typeof superClass
          )
        subClass.prototype = Object.create(superClass && superClass.prototype, {
          constructor: {
            value: subClass,
            enumerable: !1,
            writable: !0,
            configurable: !0
          }
        })
        superClass &&
          (Object.setPrototypeOf
            ? Object.setPrototypeOf(subClass, superClass)
            : (subClass.__proto__ = superClass))
      }
      __webpack_require__.d(__webpack_exports__, 'a', function() {
        return glimmer
      })
      var _extends =
        Object.assign ||
        function(target) {
          for (var i = 1; i < arguments.length; i++) {
            var source = arguments[i]
            for (var key in source)
              Object.prototype.hasOwnProperty.call(source, key) &&
                (target[key] = source[key])
          }
          return target
        },
        _createClass = (function() {
          function defineProperties(target, props) {
            for (var i = 0; i < props.length; i++) {
              var descriptor = props[i]
              descriptor.enumerable = descriptor.enumerable || !1
              descriptor.configurable = !0
              'value' in descriptor && (descriptor.writable = !0)
              Object.defineProperty(target, descriptor.key, descriptor)
            }
          }
          return function(Constructor, protoProps, staticProps) {
            protoProps && defineProperties(Constructor.prototype, protoProps)
            staticProps && defineProperties(Constructor, staticProps)
            return Constructor
          }
        })(),
        glimmer = {
          global: function() {},
          register: function(component, GlimmerComponent) {
            return (function(_GlimmerComponent) {
              function _class() {
                _classCallCheck(this, _class)
                return _possibleConstructorReturn(
                  this,
                  (_class.__proto__ || Object.getPrototypeOf(_class))
                    .apply(this, arguments)
                )
              }
              _inherits(_class, _GlimmerComponent)
              _createClass(_class, [
                {
                  key: 'didInsertElement',
                  value: function() {
                    component.render(_extends({}, this.args), this.element)
                  }
                }
              ])
              return _class
            })(GlimmerComponent)
          }
        }
    },
    function(module, __webpack_exports__, __webpack_require__) {
      'use strict'
      Object.defineProperty(__webpack_exports__, '__esModule', {
        value: !0
      })
      var __WEBPACK_IMPORTED_MODULE_0__script__ = __webpack_require__(77)
      __webpack_require__.d(__webpack_exports__, 'htmlComponent', function() {
        return __WEBPACK_IMPORTED_MODULE_0__script__.a
      })
      var __WEBPACK_IMPORTED_MODULE_1__react__ = __webpack_require__(76)
      __webpack_require__.d(__webpack_exports__, 'react', function() {
        return __WEBPACK_IMPORTED_MODULE_1__react__.a
      })
      var __WEBPACK_IMPORTED_MODULE_2__angular__ = __webpack_require__(72)
      __webpack_require__.d(__webpack_exports__, 'angular', function() {
        return __WEBPACK_IMPORTED_MODULE_2__angular__.a
      })
      var __WEBPACK_IMPORTED_MODULE_3__ember__ = __webpack_require__(73)
      __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3__ember__)
      for (var __WEBPACK_IMPORT_KEY__ in __WEBPACK_IMPORTED_MODULE_3__ember__) {
        ;['htmlComponent', 'react', 'angular', 'default'].indexOf(
          __WEBPACK_IMPORT_KEY__
        ) < 0 &&
          (function(key) {
            __webpack_require__.d(__webpack_exports__, key, function() {
              return __WEBPACK_IMPORTED_MODULE_3__ember__[key]
            })
          })(__WEBPACK_IMPORT_KEY__)
      }
      var __WEBPACK_IMPORTED_MODULE_4__glimmer__ = __webpack_require__(74)
      __webpack_require__.d(__webpack_exports__, 'glimmer', function() {
        return __WEBPACK_IMPORTED_MODULE_4__glimmer__.a
      })
    },
    function(module, __webpack_exports__, __webpack_require__) {
      'use strict'
      var __WEBPACK_IMPORTED_MODULE_0__lib__ = __webpack_require__(2)
      __webpack_require__.d(__webpack_exports__, 'a', function() {
        return react
      })
      var react = {
        global: function() {
          if (window.React && window.ReactDOM) {
            return {
              React: window.React,
              ReactDOM: window.ReactDOM
            }
          }
        },
        register: function(component, _ref) {
          var React = _ref.React, ReactDOM = _ref.ReactDOM
          component.react = React.createClass({
            render: function() {
              return React.createElement('div', null)
            },
            componentDidMount: function() {
              component.log('instantiate_react_component')
              var el = ReactDOM.findDOMNode(this),
                parent = component.init(
                  __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__lib__.h)(
                    {},
                    this.props
                  ),
                  null,
                  el
                )
              this.setState({
                parent: parent
              })
              parent.render(el)
            },
            componentDidUpdate: function() {
              this.state &&
                this.state.parent &&
                this.state.parent.updateProps(
                  __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__lib__.h)(
                    {},
                    this.props
                  )
                )
            }
          })
          return component.react
        }
      }
    },
    function(module, __webpack_exports__, __webpack_require__) {
      'use strict'
      __webpack_require__.d(__webpack_exports__, 'a', function() {
        return htmlComponent
      })
      var htmlComponent = {
        global: function() {
          return !0
        },
        register: function register(component) {
          function render(element) {
            if (
              element &&
              element.tagName &&
              element.tagName.toLowerCase() === 'script' &&
              element.attributes.type &&
              element.attributes.type.value === 'application/x-component' &&
              element.attributes['data-component'] &&
              element.attributes['data-component'].value === component.tag
            ) {
              component.log('instantiate_script_component')
              var props = eval('(' + element.innerText + ')'),
                container = document.createElement('div')
              element.parentNode.replaceChild(container, element)
              component.render(props, container)
            }
          }
          function scan() {
            for (
              var scriptTags = Array.prototype.slice.call(
                document.getElementsByTagName('script')
              ),
                _iterator = scriptTags,
                _isArray = Array.isArray(_iterator),
                _i = 0,
                _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();
              ;

            ) {
              var _ref
              if (_isArray) {
                if (_i >= _iterator.length) break
                _ref = _iterator[_i++]
              } else {
                _i = _iterator.next()
                if (_i.done) break
                _ref = _i.value
              }
              render(_ref)
            }
          }
          scan()
          document.addEventListener('DOMContentLoaded', scan)
          window.addEventListener('load', scan)
          document.addEventListener('DOMNodeInserted', function(event) {
            render(event.target)
          })
        }
      }
    },
    function(module, __webpack_exports__, __webpack_require__) {
      'use strict'
      Object.defineProperty(__webpack_exports__, '__esModule', {
        value: !0
      })
      var __WEBPACK_IMPORTED_MODULE_0__interface__ = __webpack_require__(19)
      __webpack_require__.d(__webpack_exports__, 'create', function() {
        return __WEBPACK_IMPORTED_MODULE_0__interface__.create
      })
      __webpack_require__.d(
        __webpack_exports__,
        'getCurrentScriptDir',
        function() {
          return __WEBPACK_IMPORTED_MODULE_0__interface__.getCurrentScriptDir
        }
      )
      __webpack_require__.d(__webpack_exports__, 'getByTag', function() {
        return __WEBPACK_IMPORTED_MODULE_0__interface__.getByTag
      })
      __webpack_require__.d(__webpack_exports__, 'destroyAll', function() {
        return __WEBPACK_IMPORTED_MODULE_0__interface__.destroyAll
      })
      __webpack_require__.d(
        __webpack_exports__,
        'componentTemplate',
        function() {
          return __WEBPACK_IMPORTED_MODULE_0__interface__.componentTemplate
        }
      )
      __webpack_require__.d(
        __webpack_exports__,
        'containerTemplate',
        function() {
          return __WEBPACK_IMPORTED_MODULE_0__interface__.containerTemplate
        }
      )
      __webpack_require__.d(__webpack_exports__, 'CONSTANTS', function() {
        return __WEBPACK_IMPORTED_MODULE_0__interface__.CONSTANTS
      })
      __webpack_require__.d(__webpack_exports__, 'PopupOpenError', function() {
        return __WEBPACK_IMPORTED_MODULE_0__interface__.PopupOpenError
      })
      __webpack_require__.d(
        __webpack_exports__,
        'IntegrationError',
        function() {
          return __WEBPACK_IMPORTED_MODULE_0__interface__.IntegrationError
        }
      )
      __webpack_require__.d(__webpack_exports__, 'RenderError', function() {
        return __WEBPACK_IMPORTED_MODULE_0__interface__.RenderError
      })
      __webpack_exports__.default = __WEBPACK_IMPORTED_MODULE_0__interface__
    },
    function(module, __webpack_exports__, __webpack_require__) {
      'use strict'
      function isPerc(str) {
        return typeof str === 'string' && /^[0-9]+%$/.test(str)
      }
      function isPx(str) {
        return typeof str === 'string' && /^[0-9]+px$/.test(str)
      }
      function isNum(num) {
        return typeof num === 'number'
      }
      function toNum(str) {
        return isNum(str) ? str : parseInt(str.match(/^([0-9]+)(px|%)$/)[1], 10)
      }
      function toPx(num) {
        return toNum(num) + 'px'
      }
      function toCSS(num) {
        return isPerc(num) ? num : toPx(num)
      }
      function percOf(num, perc) {
        return parseInt(num * toNum(perc) / 100, 10)
      }
      function normalizeDimension(dim, max) {
        return isPerc(dim) ? percOf(max, dim) : isPx(dim) ? toNum(dim) : void 0
      }
      __webpack_exports__.d = isPerc
      __webpack_exports__.c = isPx
      __webpack_exports__.a = toCSS
      __webpack_exports__.b = normalizeDimension
    },
    function(module, __webpack_exports__, __webpack_require__) {
      'use strict'
      function memoized(target, name, descriptor) {
        var method = descriptor.value
        descriptor.value = function() {
          this.__memoized__ = this.__memoized__ || {}
          this.__memoized__.hasOwnProperty(name) ||
            (this.__memoized__[name] = method.apply(this, arguments))
          return this.__memoized__[name]
        }
      }
      function promise(target, name, descriptor) {
        var method = descriptor.value
        descriptor.value = function() {
          var _this = this, _arguments = arguments
          return __WEBPACK_IMPORTED_MODULE_0_sync_browser_mocks_src_promise__.a.try(
            function() {
              return method.apply(_this, _arguments)
            }
          )
        }
      }
      var __WEBPACK_IMPORTED_MODULE_0_sync_browser_mocks_src_promise__ = __webpack_require__(
        4
      )
      __webpack_exports__.b = memoized
      __webpack_exports__.a = promise
    },
    function(module, __webpack_exports__, __webpack_require__) {
      'use strict'
      function isElement(element) {
        return (
          element instanceof window.Element ||
          ((void 0 === element ? 'undefined' : _typeof(element)) === 'object' &&
            element.nodeType === 1 &&
            _typeof(element.style) === 'object' &&
            _typeof(element.ownerDocument) === 'object')
        )
      }
      function getElement(id) {
        if (isElement(id)) return id
        if (typeof id === 'string') {
          var element = document.getElementById(id)
          if (element) return element
          if (document.querySelector) return document.querySelector(id)
        }
      }
      function isDocumentReady() {
        return window.document.readyState === 'complete'
      }
      function elementReady(id) {
        return new __WEBPACK_IMPORTED_MODULE_1_sync_browser_mocks_src_promise__.a(
          function(resolve, reject) {
            var el = getElement(id)
            if (el) return resolve(el)
            if (isDocumentReady())
              return reject(
                new Error(
                  'Document is ready and element ' + id + ' does not exist'
                )
              )
            var interval = setInterval(function() {
              el = getElement(id)
              if (el) {
                clearInterval(interval)
                return resolve(el)
              }
              if (isDocumentReady()) {
                clearInterval(interval)
                return reject(
                  new Error(
                    'Document is ready and element ' + id + ' does not exist'
                  )
                )
              }
            }, 10)
          }
        )
      }
      function popup(url, options) {
        var params = Object.keys(options)
          .map(function(key) {
            if (options[key]) return key + '=' + options[key]
          })
          .filter(Boolean)
          .join(','),
          win = window.open(url, options.name, params, !0)
        if (
          __webpack_require__.i(
            __WEBPACK_IMPORTED_MODULE_0_cross_domain_utils_src__.isWindowClosed
          )(win)
        ) {
          throw new __WEBPACK_IMPORTED_MODULE_4__error__.a(
            'Can not open popup window - blocked'
          )
        }
        return win
      }
      function iframe(url) {
        var options = arguments.length > 1 && void 0 !== arguments[1]
          ? arguments[1]
          : {},
          container = arguments[2]
        container = getElement(container)
        var frame = document.createElement('iframe')
        if (options.attributes) {
          for (
            var _iterator = Object.keys(options.attributes),
              _isArray = Array.isArray(_iterator),
              _i = 0,
              _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();
            ;

          ) {
            var _ref
            if (_isArray) {
              if (_i >= _iterator.length) break
              _ref = _iterator[_i++]
            } else {
              _i = _iterator.next()
              if (_i.done) break
              _ref = _i.value
            }
            var key = _ref
            frame[key] = options.attributes[key]
          }
        }
        if (options.style) {
          for (
            var _iterator2 = Object.keys(options.style),
              _isArray2 = Array.isArray(_iterator2),
              _i2 = 0,
              _iterator2 = _isArray2
                ? _iterator2
                : _iterator2[Symbol.iterator]();
            ;

          ) {
            var _ref2
            if (_isArray2) {
              if (_i2 >= _iterator2.length) break
              _ref2 = _iterator2[_i2++]
            } else {
              _i2 = _iterator2.next()
              if (_i2.done) break
              _ref2 = _i2.value
            }
            var _key = _ref2
            frame.style[_key] = options.style[_key]
          }
        }
        frame.frameBorder = '0'
        frame.allowTransparency = 'true'
        frame.style.backgroundColor = 'transparent'
        container && container.appendChild(frame)
        return frame
      }
      function onCloseWindow(win, callback) {
        callback = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__fn__.a)(
          callback
        )
        var interval = void 0,
          checkWindowClosed = function() {
            if (
              __webpack_require__.i(
                __WEBPACK_IMPORTED_MODULE_0_cross_domain_utils_src__.isWindowClosed
              )(win, !1)
            ) {
              interval.cancel()
              return callback()
            }
          }
        interval = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__util__.d)(
          checkWindowClosed,
          50
        )
        checkWindowClosed()
        return {
          cancel: function() {
            interval.cancel()
            callback = __WEBPACK_IMPORTED_MODULE_2__fn__.b
          }
        }
      }
      function addEventListener(obj, event, handler) {
        obj.addEventListener(event, handler)
        return {
          cancel: function() {
            obj.removeEventListener(event, handler)
          }
        }
      }
      function createElement() {
        var tag = arguments.length > 0 && void 0 !== arguments[0]
          ? arguments[0]
          : 'div',
          options = arguments.length > 1 && void 0 !== arguments[1]
            ? arguments[1]
            : {},
          element = (arguments.length > 2 &&
            void 0 !== arguments[2] &&
            arguments[2], document.createElement(tag))
        options.style &&
          __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__util__.e)(
            element.style,
            options.style
          )
        options.html && (element.innerHTML = options.html)
        options.class && (element.className = options.class.join(' '))
        if (options.attributes) {
          for (
            var _iterator3 = Object.keys(options.attributes),
              _isArray3 = Array.isArray(_iterator3),
              _i3 = 0,
              _iterator3 = _isArray3
                ? _iterator3
                : _iterator3[Symbol.iterator]();
            ;

          ) {
            var _ref3
            if (_isArray3) {
              if (_i3 >= _iterator3.length) break
              _ref3 = _iterator3[_i3++]
            } else {
              _i3 = _iterator3.next()
              if (_i3.done) break
              _ref3 = _i3.value
            }
            var key = _ref3
            element.setAttribute(key, options.attributes[key])
          }
        }
        options.styleSheet &&
          (element.styleSheet
            ? (element.styleSheet.cssText = options.styleSheet)
            : element.appendChild(document.createTextNode(options.styleSheet)))
        return element
      }
      function addEventToClass(element, className, eventName, handler) {
        for (
          var handlers = [],
            _iterator4 = Array.prototype.slice.call(
              element.getElementsByClassName(className)
            ),
            _isArray4 = Array.isArray(_iterator4),
            _i4 = 0,
            _iterator4 = _isArray4 ? _iterator4 : _iterator4[Symbol.iterator]();
          ;

        ) {
          var _ref4
          if (_isArray4) {
            if (_i4 >= _iterator4.length) break
            _ref4 = _iterator4[_i4++]
          } else {
            _i4 = _iterator4.next()
            if (_i4.done) break
            _ref4 = _i4.value
          }
          var el = _ref4,
            eventHandler = function(event) {
              event.preventDefault()
              event.stopPropagation()
              handler()
            }
          handlers.push({
            el: el,
            eventHandler: eventHandler
          })
          el.addEventListener(eventName, eventHandler)
        }
        return {
          cancel: function() {
            for (
              var _iterator5 = handlers,
                _isArray5 = Array.isArray(_iterator5),
                _i5 = 0,
                _iterator5 = _isArray5
                  ? _iterator5
                  : _iterator5[Symbol.iterator]();
              ;

            ) {
              var _ref6
              if (_isArray5) {
                if (_i5 >= _iterator5.length) break
                _ref6 = _iterator5[_i5++]
              } else {
                _i5 = _iterator5.next()
                if (_i5.done) break
                _ref6 = _i5.value
              }
              var _ref7 = _ref6,
                el = _ref7.el,
                eventHandler = _ref7.eventHandler
              el.removeEventListener(eventName, eventHandler)
            }
          }
        }
      }
      function getDomain(win) {
        win = win || window
        return win.mockDomain && win.mockDomain.indexOf('mock://') === 0
          ? win.mockDomain
          : win.location.protocol + '//' + win.location.host
      }
      function getDomainFromUrl(url) {
        var domain = void 0
        if (!url.match(/^(https?|mock|file):\/\//)) return getDomain(window)
        domain = url
        domain = domain.split('/').slice(0, 3).join('/')
        return domain
      }
      function formatQuery() {
        var obj = arguments.length > 0 && void 0 !== arguments[0]
          ? arguments[0]
          : {}
        return Object.keys(obj)
          .filter(function(key) {
            return typeof obj[key] === 'string'
          })
          .map(function(key) {
            return (
              __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__util__.f)(
                key
              ) +
              '=' +
              __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__util__.f)(
                obj[key]
              )
            )
          })
          .join('&')
      }
      function extendQuery(originalQuery) {
        var props = arguments.length > 1 && void 0 !== arguments[1]
          ? arguments[1]
          : {}
        return props && Object.keys(props).length
          ? formatQuery(_extends({}, parseQuery(originalQuery), props))
          : originalQuery
      }
      function extendUrl(url) {
        var options = arguments.length > 1 && void 0 !== arguments[1]
          ? arguments[1]
          : {},
          query = options.query || {},
          hash = options.hash || {},
          originalUrl = void 0,
          originalQuery = void 0,
          originalHash = void 0,
          _url$split = url.split('#'),
          _url$split2 = _slicedToArray(_url$split, 2)
        originalUrl = _url$split2[0]
        originalHash = _url$split2[1]
        var _originalUrl$split = originalUrl.split('?'),
          _originalUrl$split2 = _slicedToArray(_originalUrl$split, 2)
        originalUrl = _originalUrl$split2[0]
        originalQuery = _originalUrl$split2[1]
        var queryString = extendQuery(originalQuery, query),
          hashString = extendQuery(originalHash, hash)
        queryString && (originalUrl = originalUrl + '?' + queryString)
        hashString && (originalUrl = originalUrl + '#' + hashString)
        return originalUrl
      }
      function elementStoppedMoving(element) {
        var timeout = arguments.length > 1 && void 0 !== arguments[1]
          ? arguments[1]
          : 5e3
        return new __WEBPACK_IMPORTED_MODULE_1_sync_browser_mocks_src_promise__.a(
          function(resolve, reject) {
            element = getElement(element)
            var start = element.getBoundingClientRect(),
              interval = void 0,
              timer = void 0
            interval = setInterval(function() {
              var end = element.getBoundingClientRect()
              if (
                start.top === end.top &&
                start.bottom === end.bottom &&
                start.left === end.left &&
                start.right === end.right &&
                start.width === end.width &&
                start.height === end.height
              ) {
                clearTimeout(timer)
                clearInterval(interval)
                return resolve()
              }
              start = end
            }, 50)
            timer = setTimeout(function() {
              clearInterval(interval)
              reject(
                new Error(
                  'Timed out waiting for element to stop animating after ' +
                    timeout +
                    'ms'
                )
              )
            }, timeout)
          }
        )
      }
      function getCurrentDimensions(el) {
        return {
          width: el.offsetWidth,
          height: el.offsetHeight
        }
      }
      function setOverflow(el) {
        var value = arguments.length > 1 && void 0 !== arguments[1]
          ? arguments[1]
          : 'auto',
          _el$style = el.style,
          overflow = _el$style.overflow,
          overflowX = _el$style.overflowX,
          overflowY = _el$style.overflowY
        el.style.overflow = el.style.overflowX = el.overflowY = value
        return {
          reset: function() {
            el.style.overflow = overflow
            el.style.overflowX = overflowX
            el.style.overflowY = overflowY
          }
        }
      }
      function dimensionsDiff(one, two, _ref10) {
        var _ref10$width = _ref10.width,
          width = void 0 === _ref10$width || _ref10$width,
          _ref10$height = _ref10.height,
          height = void 0 === _ref10$height || _ref10$height,
          _ref10$threshold = _ref10.threshold,
          threshold = void 0 === _ref10$threshold ? 0 : _ref10$threshold
        return (
          !!(width && Math.abs(one.width - two.width) > threshold) ||
          !!(height && Math.abs(one.height - two.height) > threshold)
        )
      }
      function trackDimensions(el, _ref11) {
        var _ref11$width = _ref11.width,
          width = void 0 === _ref11$width || _ref11$width,
          _ref11$height = _ref11.height,
          height = void 0 === _ref11$height || _ref11$height,
          _ref11$threshold = _ref11.threshold,
          threshold = void 0 === _ref11$threshold ? 0 : _ref11$threshold,
          currentDimensions = getCurrentDimensions(el)
        return {
          check: function() {
            var newDimensions = getCurrentDimensions(el)
            return {
              changed: dimensionsDiff(currentDimensions, newDimensions, {
                width: width,
                height: height,
                threshold: threshold
              }),
              dimensions: newDimensions
            }
          },
          reset: function() {
            currentDimensions = getCurrentDimensions(el)
          }
        }
      }
      function onDimensionsChange(el, _ref12) {
        var _ref12$width = _ref12.width,
          width = void 0 === _ref12$width || _ref12$width,
          _ref12$height = _ref12.height,
          height = void 0 === _ref12$height || _ref12$height,
          _ref12$delay = _ref12.delay,
          delay = void 0 === _ref12$delay ? 50 : _ref12$delay,
          _ref12$threshold = _ref12.threshold,
          threshold = void 0 === _ref12$threshold ? 0 : _ref12$threshold
        return new __WEBPACK_IMPORTED_MODULE_1_sync_browser_mocks_src_promise__.a(
          function(resolve) {
            function onWindowResize() {
              var _tracker$check2 = tracker.check(),
                changed = _tracker$check2.changed,
                dimensions = _tracker$check2.dimensions
              if (changed) {
                tracker.reset()
                window.removeEventListener('resize', onWindowResize)
                return resolver(dimensions)
              }
            }
            var tracker = trackDimensions(el, {
              width: width,
              height: height,
              threshold: threshold
            }),
              interval = void 0,
              resolver = __webpack_require__.i(
                __WEBPACK_IMPORTED_MODULE_2__fn__.d
              )(function(dimensions) {
                clearInterval(interval)
                return resolve(dimensions)
              }, 4 * delay)
            interval = setInterval(function() {
              var _tracker$check = tracker.check(),
                changed = _tracker$check.changed,
                dimensions = _tracker$check.dimensions
              if (changed) {
                tracker.reset()
                return resolver(dimensions)
              }
            }, delay)
            window.addEventListener('resize', onWindowResize)
          }
        )
      }
      function dimensionsMatchViewport(el, _ref13) {
        var width = _ref13.width,
          height = _ref13.height,
          dimensions = getCurrentDimensions(el)
        return (
          (!width || dimensions.width === window.innerWidth) &&
          (!height || dimensions.height === window.innerHeight)
        )
      }
      function bindEvents(element, eventNames, handler) {
        handler = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__fn__.a)(
          handler
        )
        for (
          var _iterator8 = eventNames,
            _isArray8 = Array.isArray(_iterator8),
            _i8 = 0,
            _iterator8 = _isArray8 ? _iterator8 : _iterator8[Symbol.iterator]();
          ;

        ) {
          var _ref14
          if (_isArray8) {
            if (_i8 >= _iterator8.length) break
            _ref14 = _iterator8[_i8++]
          } else {
            _i8 = _iterator8.next()
            if (_i8.done) break
            _ref14 = _i8.value
          }
          var eventName = _ref14
          element.addEventListener(eventName, handler)
        }
        return {
          cancel: __webpack_require__.i(
            __WEBPACK_IMPORTED_MODULE_2__fn__.a
          )(function() {
            for (
              var _iterator9 = eventNames,
                _isArray9 = Array.isArray(_iterator9),
                _i9 = 0,
                _iterator9 = _isArray9
                  ? _iterator9
                  : _iterator9[Symbol.iterator]();
              ;

            ) {
              var _ref15
              if (_isArray9) {
                if (_i9 >= _iterator9.length) break
                _ref15 = _iterator9[_i9++]
              } else {
                _i9 = _iterator9.next()
                if (_i9.done) break
                _ref15 = _i9.value
              }
              var eventName = _ref15
              element.removeEventListener(eventName, handler)
            }
          })
        }
      }
      function setVendorCSS(element, name, value) {
        element.style[name] = value
        for (
          var capitalizedName = __webpack_require__.i(
            __WEBPACK_IMPORTED_MODULE_3__util__.g
          )(name),
            _iterator10 = VENDOR_PREFIXES,
            _isArray10 = Array.isArray(_iterator10),
            _i10 = 0,
            _iterator10 = _isArray10
              ? _iterator10
              : _iterator10[Symbol.iterator]();
          ;

        ) {
          var _ref16
          if (_isArray10) {
            if (_i10 >= _iterator10.length) break
            _ref16 = _iterator10[_i10++]
          } else {
            _i10 = _iterator10.next()
            if (_i10.done) break
            _ref16 = _i10.value
          }
          var prefix = _ref16
          element.style['' + prefix + capitalizedName] = value
        }
      }
      function isValidAnimation(element, name) {
        var stylesheets = element.ownerDocument.styleSheets
        try {
          for (var i = 0; i < stylesheets.length; i++) {
            var cssRules = stylesheets[i].cssRules
            if (cssRules) {
              for (var j = 0; j < cssRules.length; j++) {
                var cssRule = cssRules[j]
                if (
                  cssRule &&
                  (cssRule.type === KEYFRAMES_RULE && cssRule.name === name)
                )
                  return !0
              }
            }
          }
        } catch (err) {
          return !1
        }
        return !1
      }
      function animate(element, name, clean) {
        var timeout = arguments.length > 3 && void 0 !== arguments[3]
          ? arguments[3]
          : 1e3
        return new __WEBPACK_IMPORTED_MODULE_1_sync_browser_mocks_src_promise__.a(
          function(resolve, reject) {
            function cleanUp() {
              setVendorCSS(element, 'animationName', '')
              clearTimeout(startTimeout)
              clearTimeout(endTimeout)
              startEvent.cancel()
              endEvent.cancel()
            }
            element = getElement(element)
            if (!element || !isValidAnimation(element, name)) return resolve()
            var hasStarted = !1,
              startTimeout = void 0,
              endTimeout = void 0,
              startEvent = void 0,
              endEvent = void 0
            startEvent = bindEvents(element, ANIMATION_START_EVENTS, function(
              event
            ) {
              if (event.target === element && event.animationName === name) {
                clearTimeout(startTimeout)
                event.stopPropagation()
                startEvent.cancel()
                hasStarted = !0
                endTimeout = setTimeout(function() {
                  cleanUp()
                  resolve()
                }, timeout)
              }
            })
            endEvent = bindEvents(element, ANIMATION_END_EVENTS, function(
              event
            ) {
              if (event.target === element && event.animationName === name) {
                cleanUp()
                return event.animationName !== name
                  ? reject(
                      'Expected animation name to be ' +
                        name +
                        ', found ' +
                        event.animationName
                    )
                  : resolve()
              }
            })
            setVendorCSS(element, 'animationName', name)
            startTimeout = setTimeout(function() {
              if (!hasStarted) {
                cleanUp()
                return resolve()
              }
            }, 200)
            clean && clean(cleanUp)
          }
        )
      }
      function showElement(element) {
        element.style.display = ''
      }
      function hideElement(element) {
        element.style.setProperty(
          'display',
          STYLE.DISPLAY.NONE,
          STYLE.IMPORTANT
        )
      }
      function destroyElement(element) {
        element.parentNode && element.parentNode.removeChild(element)
      }
      function showAndAnimate(element, name, clean) {
        var animation = animate(element, name, clean)
        showElement(element)
        return animation
      }
      function animateAndHide(element, name, clean) {
        return animate(element, name, clean).then(function() {
          hideElement(element)
        })
      }
      function addClass(element, name) {
        element.classList
          ? element.classList.add(name)
          : element.className.split(/\s+/).indexOf(name) === -1 &&
              (element.className += ' ' + name)
      }
      function writeToWindow(win, html) {
        try {
          win.document.open()
          win.document.write(html)
          win.document.close()
        } catch (err) {
          try {
            win.location =
              'javascript: document.open(); document.write(' +
              JSON.stringify(html) +
              '); document.close();'
          } catch (err2) {}
        }
      }
      function getCurrentScriptDir() {
        console.warn(
          'Do not use xcomponent.getCurrentScriptDir() in production -- browser support is limited'
        )
        return document.currentScript
          ? document.currentScript.src.split('/').slice(0, -1).join('/')
          : '.'
      }
      function getElementName(element) {
        if (typeof element === 'string') return element
        if (!element || !element.tagName) return '<unknown>'
        var name = element.tagName.toLowerCase()
        element.id
          ? (name += '#' + element.id)
          : element.className &&
              (name += '.' + element.className.split(' ').join('.'))
        return name
      }
      function isElementClosed(el) {
        return !el || !el.parentNode
      }
      function watchElementForClose(element, handler) {
        handler = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__fn__.a)(
          handler
        )
        var interval = void 0
        isElementClosed(element)
          ? handler()
          : (interval = __webpack_require__.i(
              __WEBPACK_IMPORTED_MODULE_3__util__.d
            )(function() {
              if (isElementClosed(element)) {
                interval.cancel()
                handler()
              }
            }, 50))
        return {
          cancel: function() {
            interval && interval.cancel()
          }
        }
      }
      var __WEBPACK_IMPORTED_MODULE_0_cross_domain_utils_src__ = __webpack_require__(
        0
      ),
        __WEBPACK_IMPORTED_MODULE_1_sync_browser_mocks_src_promise__ = (__webpack_require__.n(
          __WEBPACK_IMPORTED_MODULE_0_cross_domain_utils_src__
        ), __webpack_require__(4)),
        __WEBPACK_IMPORTED_MODULE_2__fn__ = __webpack_require__(40),
        __WEBPACK_IMPORTED_MODULE_3__util__ = __webpack_require__(25),
        __WEBPACK_IMPORTED_MODULE_4__error__ = __webpack_require__(18)
      __webpack_exports__.d = getElement
      __webpack_require__.d(__webpack_exports__, 'e', function() {
        return documentReady
      })
      __webpack_exports__.k = elementReady
      __webpack_exports__.z = popup
      __webpack_exports__.u = iframe
      __webpack_exports__.c = onCloseWindow
      __webpack_exports__.l = addEventListener
      __webpack_exports__.v = createElement
      __webpack_exports__.w = addEventToClass
      __webpack_exports__.b = getDomain
      __webpack_exports__.A = getDomainFromUrl
      __webpack_exports__.i = extendUrl
      __webpack_exports__.n = elementStoppedMoving
      __webpack_exports__.m = setOverflow
      __webpack_exports__.h = trackDimensions
      __webpack_exports__.g = onDimensionsChange
      __webpack_exports__.f = dimensionsMatchViewport
      __webpack_exports__.p = showElement
      __webpack_exports__.o = hideElement
      __webpack_exports__.y = destroyElement
      __webpack_exports__.r = showAndAnimate
      __webpack_exports__.s = animateAndHide
      __webpack_exports__.q = addClass
      __webpack_exports__.t = writeToWindow
      __webpack_exports__.a = getCurrentScriptDir
      __webpack_exports__.j = getElementName
      __webpack_exports__.x = watchElementForClose
      var _slicedToArray = (function() {
        function sliceIterator(arr, i) {
          var _arr = [], _n = !0, _d = !1, _e = void 0
          try {
            for (
              var _s, _i = arr[Symbol.iterator]();
              !(_n = (_s = _i.next()).done);
              _n = !0
            ) {
              _arr.push(_s.value)
              if (i && _arr.length === i) break
            }
          } catch (err) {
            _d = !0
            _e = err
          } finally {
            try {
              !_n && _i.return && _i.return()
            } finally {
              if (_d) throw _e
            }
          }
          return _arr
        }
        return function(arr, i) {
          if (Array.isArray(arr)) return arr
          if (Symbol.iterator in Object(arr)) return sliceIterator(arr, i)
          throw new TypeError(
            'Invalid attempt to destructure non-iterable instance'
          )
        }
      })(),
        _extends =
          Object.assign ||
          function(target) {
            for (var i = 1; i < arguments.length; i++) {
              var source = arguments[i]
              for (var key in source)
                Object.prototype.hasOwnProperty.call(source, key) &&
                  (target[key] = source[key])
            }
            return target
          },
        _typeof = typeof Symbol === 'function' &&
          typeof Symbol.iterator === 'symbol'
          ? function(obj) {
              return typeof obj
            }
          : function(obj) {
              return obj &&
                typeof Symbol === 'function' &&
                obj.constructor === Symbol &&
                obj !== Symbol.prototype
                ? 'symbol'
                : typeof obj
            },
        documentReady = new __WEBPACK_IMPORTED_MODULE_1_sync_browser_mocks_src_promise__.a(
          function(resolve) {
            if (window.document.readyState === 'complete')
              return resolve(window.document)
            var interval = setInterval(function() {
              if (window.document.readyState === 'complete') {
                clearInterval(interval)
                return resolve(window.document)
              }
            }, 10)
          }
        ),
        parseQuery = __webpack_require__.i(
          __WEBPACK_IMPORTED_MODULE_2__fn__.c
        )(function(queryString) {
          var params = {}
          if (!queryString) return params
          if (queryString.indexOf('=') === -1)
            throw new Error('Can not parse query string params: ' + queryString)
          for (
            var _iterator6 = queryString.split('&'),
              _isArray6 = Array.isArray(_iterator6),
              _i6 = 0,
              _iterator6 = _isArray6
                ? _iterator6
                : _iterator6[Symbol.iterator]();
            ;

          ) {
            var _ref8
            if (_isArray6) {
              if (_i6 >= _iterator6.length) break
              _ref8 = _iterator6[_i6++]
            } else {
              _i6 = _iterator6.next()
              if (_i6.done) break
              _ref8 = _i6.value
            }
            var pair = _ref8
            pair = pair.split('=')
            pair[0] &&
              pair[1] &&
              (params[decodeURIComponent(pair[0])] = decodeURIComponent(
                pair[1]
              ))
          }
          return params
        }),
        VENDOR_PREFIXES = ['webkit', 'moz', 'ms', 'o'],
        CSSRule = window.CSSRule,
        KEYFRAMES_RULE =
          CSSRule.KEYFRAMES_RULE ||
          CSSRule.WEBKIT_KEYFRAMES_RULE ||
          CSSRule.MOZ_KEYFRAMES_RULE ||
          CSSRule.O_KEYFRAMES_RULE ||
          CSSRule.MS_KEYFRAMES_RULE,
        ANIMATION_START_EVENTS = [
          'animationstart',
          'webkitAnimationStart',
          'oAnimationStart',
          'MSAnimationStart'
        ],
        ANIMATION_END_EVENTS = [
          'animationend',
          'webkitAnimationEnd',
          'oAnimationEnd',
          'MSAnimationEnd'
        ],
        STYLE = {
          DISPLAY: {
            NONE: 'none',
            BLOCK: 'block'
          },
          IMPORTANT: 'important'
        }
    },
    function(module, __webpack_exports__, __webpack_require__) {
      'use strict'
      function globalFor(win) {
        win[__WEBPACK_IMPORTED_MODULE_0__constants__.__XCOMPONENT__] ||
          (win[__WEBPACK_IMPORTED_MODULE_0__constants__.__XCOMPONENT__] = {})
        return win[__WEBPACK_IMPORTED_MODULE_0__constants__.__XCOMPONENT__]
      }
      var __WEBPACK_IMPORTED_MODULE_0__constants__ = __webpack_require__(7)
      __webpack_exports__.a = globalFor
      __webpack_require__.d(__webpack_exports__, 'b', function() {
        return global
      })
      var global = globalFor(window)
    },
    function(module, __webpack_exports__, __webpack_require__) {
      'use strict'
      function setLogLevel(logLevel) {
        if (
          __WEBPACK_IMPORTED_MODULE_1_beaver_logger_client__.a.indexOf(
            logLevel
          ) === -1
        )
          throw new Error('Invalid logLevel: ' + logLevel)
        __WEBPACK_IMPORTED_MODULE_1_beaver_logger_client__.b.logLevel = logLevel
        __WEBPACK_IMPORTED_MODULE_0_post_robot_src__.a.LOG_LEVEL = logLevel
        window.LOG_LEVEL = logLevel
      }
      function info(name, event) {
        var payload = arguments.length > 2 && void 0 !== arguments[2]
          ? arguments[2]
          : {}
        __WEBPACK_IMPORTED_MODULE_1_beaver_logger_client__.c(
          'xc_' + name + '_' + event,
          payload
        )
      }
      function warn(name, event, payload) {
        __WEBPACK_IMPORTED_MODULE_1_beaver_logger_client__.d(
          'xc_' + name + '_' + event,
          payload
        )
      }
      function error(name, event, payload) {
        __WEBPACK_IMPORTED_MODULE_1_beaver_logger_client__.e(
          'xc_' + name + '_' + event,
          payload
        )
      }
      var __WEBPACK_IMPORTED_MODULE_0_post_robot_src__ = __webpack_require__(9),
        __WEBPACK_IMPORTED_MODULE_1_beaver_logger_client__ = __webpack_require__(
          20
        )
      __webpack_exports__.a = setLogLevel
      __webpack_exports__.b = info
      __webpack_exports__.c = warn
      __webpack_exports__.d = error
    },
    function(module, __webpack_exports__, __webpack_require__) {
      'use strict'
      function denodeify(method) {
        return function() {
          var self = this, args = Array.prototype.slice.call(arguments)
          return args.length >= method.length
            ? __WEBPACK_IMPORTED_MODULE_0_sync_browser_mocks_src_promise__.a.resolve(
                method.apply(self, args)
              )
            : new __WEBPACK_IMPORTED_MODULE_0_sync_browser_mocks_src_promise__.a(
                function(resolve, reject) {
                  args.push(function(err, result) {
                    if (err && !(err instanceof Error))
                      throw new Error(
                        'Passed non-Error object in callback: [ ' +
                          err +
                          ' ] -- callbacks should either be called with callback(new Error(...)) or callback(null, result).'
                      )
                    return err ? reject(err) : resolve(result)
                  })
                  return method.apply(self, args)
                }
              )
        }
      }
      function promisify(method) {
        var prom = __WEBPACK_IMPORTED_MODULE_0_sync_browser_mocks_src_promise__.a.resolve()
        return function() {
          var _this = this, _arguments = arguments
          return prom.then(function() {
            return method.apply(_this, _arguments)
          })
        }
      }
      function getter(method) {
        var _ref = arguments.length > 1 && void 0 !== arguments[1]
          ? arguments[1]
          : {},
          _ref$name = _ref.name,
          name = void 0 === _ref$name ? 'property' : _ref$name,
          _ref$timeout = _ref.timeout,
          timeout = void 0 === _ref$timeout ? 1e4 : _ref$timeout
        return function() {
          var _this2 = this
          return new __WEBPACK_IMPORTED_MODULE_0_sync_browser_mocks_src_promise__.a(
            function(resolve, reject) {
              var result = method.call(_this2, resolve, reject)
              if (result && typeof result.then === 'function')
                return result.then(resolve, reject)
              if (void 0 !== result) return resolve(result)
              setTimeout(function() {
                reject(
                  'Timed out waiting ' + timeout + 'ms for ' + name + ' getter'
                )
              }, timeout)
            }
          )
        }
      }
      function delay() {
        var time = arguments.length > 0 && void 0 !== arguments[0]
          ? arguments[0]
          : 1
        return new __WEBPACK_IMPORTED_MODULE_0_sync_browser_mocks_src_promise__.a(
          function(resolve) {
            setTimeout(resolve, time)
          }
        )
      }
      function cycle(method) {
        return __WEBPACK_IMPORTED_MODULE_0_sync_browser_mocks_src_promise__.a
          .try(method)
          .then(function() {
            return cycle(method)
          })
      }
      var __WEBPACK_IMPORTED_MODULE_0_sync_browser_mocks_src_promise__ = __webpack_require__(
        4
      )
      __webpack_exports__.d = denodeify
      __webpack_exports__.e = promisify
      __webpack_exports__.c = getter
      __webpack_exports__.b = delay
      __webpack_exports__.a = cycle
    }
  ])
})
// # sourceMappingURL=xcomponent.js.map
