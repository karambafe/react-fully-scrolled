'use strict';

exports.__esModule = true;

var _class, _temp;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// import {findDOMNode} from 'react-dom'

var Scroller = (_temp = _class = function (_Component) {
  _inherits(Scroller, _Component);

  // timestamp of animation start, for performance tracking

  // whether we're currently animating
  // handle to requestAnimationFrame

  // delta moved from start of swipe
  // how many pages we have

  function Scroller(props) {
    _classCallCheck(this, Scroller);

    var _this = _possibleConstructorReturn(this, _Component.call(this, props));

    _this.containerEl = null;
    _this.totalPages = 0;
    _this.touchStartPosY = 0;
    _this.touchMoveDelta = 0;
    _this.isInSwipe = false;
    _this.reqAnim = null;
    _this.isTransitionEnabled = false;
    _this.isAnimating = false;
    _this.supportsPassive = false;
    _this.animStartTs = Date.now();
    _this.isScrolling = false;

    _this.initSupportsPassive = function () {
      var that = _this;
      try {
        var opts = Object.defineProperty({}, 'passive', {
          get: function get() {
            that.supportsPassive = true;
          }
        });
        window.addEventListener('test', null, opts);
      } catch (e) {}
    };

    _this.getAverage = function (elements, number) {
      var sum = 0;
      var lastElements = elements.slice(Math.max(elements.length - number, 1));

      for (var i = 0; i < lastElements.length; i++) {
        sum += lastElements[i];
      }

      return Math.ceil(sum / number);
    };

    _this.resize = function () {
      var translateyStr = 'translatey(-' + window.innerHeight * (_this.state.curPage - 1) + 'px)';
      _this.setStyles({
        transform: translateyStr,
        height: window.innerHeight + 'px'
      });
    };

    _this.onWheel = function (event) {
      if (!_this.props.isEnabled) return;

      var curTime = new Date().getTime();

      var value = event.wheelDelta || -event.deltaY || -event.detail;
      var delta = Math.max(-1, Math.min(1, value));

      if (_this.scrollings.length > 149) _this.scrollings.shift();
      _this.scrollings.push(Math.abs(value));

      var timeDiff = curTime - _this.prevTime;
      _this.prevTime = curTime;
      if (timeDiff > 200) _this.scrollings = [];

      if (_this.isAnimating) return;

      var averageEnd = _this.getAverage(_this.scrollings, 10);
      var averageMiddle = _this.getAverage(_this.scrollings, 70);
      var isAccelerating = averageEnd >= averageMiddle;

      if (!isAccelerating) return;

      if (delta) _this.handle(delta);
    };

    _this.handleSwipeEnd = function (delta) {
      if (Math.abs(delta) > _this.props.swipeSensitivity) {
        var duration = (1.0 - Math.abs(delta) / window.innerHeight) * _this.props.transDuration;

        _this.enableTransition(duration);
        if (delta < 0) {
          if (_this.state.curPage < _this.totalPages) {
            _this.turnTo(_this.state.curPage + 1);
          } else {
            _this.resetTranslateY();
          }
        } else {
          /* eslint-disable no-lonely-if */
          if (_this.state.curPage > 1) {
            _this.turnTo(_this.state.curPage - 1);
          } else {
            _this.resetTranslateY();
          }
          /* eslint-enable no-lonely-if */
        }
      } else if (Math.abs(delta) > 10) {
        _this.enableTransition(0.5 * _this.props.transDuration);
        _this.resetTranslateY(true);
      } else {
        _this.resetTranslateY(false);
      }
    };

    _this.updateTouchMove = function () {
      var translatey = -(window.innerHeight * (_this.state.curPage - 1) - _this.touchMoveDelta);
      var translateyStr = 'translatey(' + translatey + 'px)';

      _this.setStyles({ transform: translateyStr });
      _this.reqAnim = requestAnimationFrame(_this.updateTouchMove);
    };

    _this.onTouchStart = function (e) {
      if (!_this.props.isEnabled || _this.isAnimating || _this.isInSwipe) return;

      _this.isInSwipe = true;
      _this.reqAnim = requestAnimationFrame(_this.updateTouchMove);

      _this.touchStartPosY = e.touches[0].clientY;
      _this.disableTransition();
    };

    _this.onTouchMove = function (e) {
      if (!_this.props.isEnabled || _this.isAnimating || !_this.isInSwipe) return;

      var touchPosY = e.changedTouches[0].clientY;
      _this.touchMoveDelta = touchPosY - _this.touchStartPosY;

      // const delta = touchPosY - this.touchStartPosY;

      // const translatey = -(window.innerHeight * (this.state.curPage - 1) - delta);
      // const translateyStr = `translatey(${translatey}px)`;

      // this.setStyles({transform: translateyStr})
    };

    _this.onTouchEnd = function (e) {
      cancelAnimationFrame(_this.reqAnim);
      _this.touchMoveDelta = 0;

      if (!_this.props.isEnabled || _this.isAnimating || !_this.isInSwipe) return;

      _this.isInSwipe = false;

      var touchEndY = e.changedTouches[0].clientY;
      var delta = touchEndY - _this.touchStartPosY;

      _this.handleSwipeEnd(delta);
    };

    _this.setStyles = function (style) {
      // const container = this.containerEl;
      // Object.keys(style).forEach(function (key) {
      //   container.style[key] = style[key]
      // })
      Object.keys(style).forEach(function (key) {
        _this.containerEl.style[key] = style[key];
      });
    };

    _this.enableTransition = function () {
      var duration = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _this.props.transDuration;

      _this.setStyles({ transition: 'transform ' + duration + 's ' + _this.props.easing });
      _this.isTransitionEnabled = true;
    };

    _this.disableTransition = function () {
      _this.setStyles({ transition: 'transform 0s' });
      _this.isTransitionEnabled = false;
    };

    _this.setIsAnimating = function (is) {
      if (is) {
        _this.isAnimating = true;
        // this.animStartTs = Date.now()
        // console.log('Animating start');
      } else {
        _this.isAnimating = false;
        // console.log('Animating End after', (Date.now()-this.animStartTs))
      }
    };

    _this.handleTransitionEnd = function (e) {
      _this.setIsAnimating(false);
      if (_this.isScrolling) {
        _this.isScrolling = false;
        _this.props.onAfterScroll(_this.state.curPage);
      }
    };

    _this.totalPages = _this.props.children.length;

    _this.state = {
      curPage: _this.props.initialPage
    };
    _this.initSupportsPassive();
    return _this;
  } // whether the browser supports passive events
  // whether we're currently in a swipe
  // Y position of touch start
  // the container element


  Scroller.prototype.componentDidMount = function componentDidMount() {
    // this.containerEl = this.refs.container
    // this.containerEl = findDOMNode(this.refs['container']);
    // console.log('Mount', this)
    this.resize();

    this.enableTransition();

    this.addWheelEvent();
    this.addTouchEvents();
    window.addEventListener('resize', this.resize, false);
    document.addEventListener('resize', this.resize, false);

    window.fpTurnTo = document.fpTurnTo = this.turnTo.bind(this);

    this.prevTime = new Date().getTime();
    this.scrollings = [];
  };

  Scroller.prototype.componentWillUnmount = function componentWillUnmount() {
    // cleanup
    this.removeWheelEvent();
    this.removeTouchEvents();
    window.removeEventListener('resize', this.resize, false);
    document.removeEventListener('resize', this.resize, false);

    delete window.fpTurnTo;
    delete document.fpTurnTo;
  };

  Scroller.prototype.componentDidUpdate = function componentDidUpdate(prevProps, prevState) {
    if (this.props.children.length !== this.totalPages) {
      this.totalPages = this.props.children.length;
      if (this.state.curPage > this.totalPages) {
        this.turnTo(this.totalPages);
      }
    }
  };

  //--------------
  // Wheel stuff
  //--------------

  Scroller.prototype.handle = function handle(delta) {
    if (delta < 0) {
      if (this.state.curPage < this.totalPages) {
        this.enableTransition();
        this.turnTo(this.state.curPage + 1);
      }
    } else {
      /* eslint-disable no-lonely-if */
      if (this.state.curPage > 1) {
        this.enableTransition();
        this.turnTo(this.state.curPage - 1);
      }
      /* eslint-enable no-lonely-if */
    }
  };

  Scroller.prototype.removeWheelEvent = function removeWheelEvent() {
    window.removeEventListener('wheel', this.onWheel, this.supportsPassive ? { passive: true } : false);
  };

  Scroller.prototype.addWheelEvent = function addWheelEvent() {
    window.addEventListener('wheel', this.onWheel, this.supportsPassive ? { passive: true } : false);
  };

  //----------------
  // Touch stuff
  //----------------

  Scroller.prototype.resetTranslateY = function resetTranslateY(animate) {
    var translatey = -(window.innerHeight * (this.state.curPage - 1));
    var translateyStr = 'translatey(' + translatey + 'px)';

    if (animate) this.setIsAnimating(true);
    this.setStyles({ transform: translateyStr });
  };

  Scroller.prototype.addTouchEvents = function addTouchEvents() {
    document.addEventListener('touchstart', this.onTouchStart, this.supportsPassive ? { passive: true } : false);
    document.addEventListener('touchmove', this.onTouchMove, this.supportsPassive ? { passive: true } : false);
    document.addEventListener('touchend', this.onTouchEnd, this.supportsPassive ? { passive: true } : false);
  };

  Scroller.prototype.removeTouchEvents = function removeTouchEvents() {
    document.removeEventListener('touchstart', this.onTouchStart, this.supportsPassive ? { passive: true } : false);
    document.removeEventListener('touchmove', this.onTouchMove, this.supportsPassive ? { passive: true } : false);
    document.removeEventListener('touchend', this.onTouchEnd, this.supportsPassive ? { passive: true } : false);
  };

  // assign styles to element


  Scroller.prototype.turnTo = function turnTo(num) {
    if (this.state.curPage === num) return;
    this.isScrolling = true;
    this.props.onBeforeScroll(this.state.curPage, num);
    var translateyStr = 'translatey(-' + window.innerHeight * (num - 1) + 'px)';

    this.setState({
      curPage: num
    });

    if (this.isTransitionEnabled) this.setIsAnimating(true);
    this.setStyles({ transform: translateyStr });
    // setTimeout(() => {
    //   this.setIsAnimating(false);
    // }, (TRANS_DURATION*1000 + 50));
  };

  Scroller.prototype.render = function render() {
    var _this2 = this;

    return _react2.default.createElement(
      'div',
      {
        onTransitionEnd: this.handleTransitionEnd,
        ref: function ref(c) {
          _this2.containerEl = c;
        },
        style: {
          width: '100%',
          height: '100%',
          position: 'fixed'
        }
      },
      this.props.children
    );
  };

  return Scroller;
}(_react.Component), _class.defaultProps = {
  children: [],
  easing: 'cubic-bezier(0.19, 1, 0.22, 1)',
  initialPage: 1, // 1-based !
  isEnabled: true,
  onAfterScroll: function onAfterScroll() {},
  onBeforeScroll: function onBeforeScroll() {},
  swipeSensitivity: 100, // how much Y movement there should be to be considered a scroll
  transDuration: 0.5 // seconds
}, _temp);
Scroller.propTypes = process.env.NODE_ENV !== "production" ? {
  children: _propTypes2.default.node,
  easing: _propTypes2.default.string,
  initialPage: _propTypes2.default.number,
  isEnabled: _propTypes2.default.bool,
  onAfterScroll: _propTypes2.default.func,
  onBeforeScroll: _propTypes2.default.func,
  swipeSensitivity: _propTypes2.default.number,
  transDuration: _propTypes2.default.number // seconds
} : {};
exports.default = Scroller;
module.exports = exports['default'];