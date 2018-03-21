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

var Section = (_temp = _class = function (_Component) {
  _inherits(Section, _Component);

  function Section(props, context) {
    _classCallCheck(this, Section);

    var _this = _possibleConstructorReturn(this, _Component.call(this, props, context));

    _this.state = {};
    return _this;
  }

  Section.prototype.render = function render() {
    return _react2.default.createElement(
      'section',
      {
        style: {
          position: 'relative',
          width: '100%',
          height: '100%'
        },
        className: this.props.className
      },
      this.props.children
    );
  };

  return Section;
}(_react.Component), _class.defaultProps = {
  children: {},
  className: 'pagescroll'
}, _temp);
Section.propTypes = process.env.NODE_ENV !== "production" ? {
  children: _propTypes2.default.node,
  className: _propTypes2.default.string
} : {};
exports.default = Section;
module.exports = exports['default'];