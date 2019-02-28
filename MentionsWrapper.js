'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.defaultState = undefined;

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _debounce = require('lodash/debounce');

var _debounce2 = _interopRequireDefault(_debounce);

var _UserList = require('./UserList');

var _UserList2 = _interopRequireDefault(_UserList);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var defaultState = exports.defaultState = {
    element: null,
    listIsOpen: false,
    captureText: false,
    captureStartPosition: null,
    capturedText: null,
    selectedUserIndex: 0
};

var MentionsWrapper = function (_Component) {
    (0, _inherits3.default)(MentionsWrapper, _Component);

    function MentionsWrapper(props) {
        (0, _classCallCheck3.default)(this, MentionsWrapper);

        var _this = (0, _possibleConstructorReturn3.default)(this, (MentionsWrapper.__proto__ || (0, _getPrototypeOf2.default)(MentionsWrapper)).call(this, props));

        _this.reset = function () {
            _this.state.element.removeEventListener('input', _this.onInput);

            _this.setState(defaultState);
        };

        _this.onInput = function (event) {
            _this.computeFilter(event.target);
        };

        _this.lookupUser = function () {
            var query = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

            _this.props.d2.Api.getApi().get('users.json', {
                query: query,
                fields: 'id,displayName,userCredentials[username]',
                order: 'displayName:iasc'
            }).then(function (response) {
                _this.setState({
                    users: response.users,
                    listIsOpen: true
                });
            });
        };

        _this.computeFilter = function (element) {
            var selectionEnd = element.selectionEnd,
                value = element.value;


            if (_this.state.captureText) {
                var spacePosition = value.indexOf(' ', _this.state.captureStartPosition - 1);

                var filterValue = value.substring(_this.state.captureStartPosition, spacePosition > 0 ? spacePosition : selectionEnd + 1);

                if (!filterValue || filterValue !== _this.state.capturedText) {
                    _this.lookupUser(filterValue);

                    _this.setState({ capturedText: filterValue });
                } else if (filterValue.length === 0) {
                    _this.setState({ capturedText: null, users: [] });
                }
            }
        };

        _this.onKeyDown = function (event) {
            var key = event.key;

            var element = event.target;
            var selectionStart = element.selectionStart;

            // '@' triggers the user lookup/suggestion

            if (!_this.state.captureText && key === '@') {
                element.addEventListener('input', _this.onInput);

                _this.setState({
                    element: element,
                    captureText: true,
                    captureStartPosition: selectionStart + 1
                });

                _this.lookupUser();
            } else if (_this.state.captureText) {
                if (key === ' ' || key === 'Backspace' && selectionStart <= _this.state.captureStartPosition) {
                    _this.reset();
                } else if (_this.state.users.length) {
                    var selectedUserIndex = _this.state.selectedUserIndex;

                    switch (key) {
                        case 'Enter':
                            event.preventDefault();
                            if (selectedUserIndex >= 0) {
                                _this.onUserSelect(_this.state.users[selectedUserIndex]);
                            }
                            break;
                        case 'ArrowDown':
                            event.preventDefault();

                            if (_this.state.selectedUserIndex < _this.state.users.length - 1) {
                                _this.setState({ selectedUserIndex: _this.state.selectedUserIndex + 1 });
                            }

                            break;
                        case 'ArrowUp':
                            event.preventDefault();

                            if (_this.state.selectedUserIndex > 0) {
                                _this.setState({ selectedUserIndex: _this.state.selectedUserIndex - 1 });
                            }

                            break;
                        default:
                        // other key strokes, typically the text typed
                        // the onInput event handler set on the input element is triggering the user lookup
                    }
                }
            }
        };

        _this.onUserSelect = function (user) {
            var originalValue = _this.state.element.value;
            var newValue = '' + originalValue.slice(0, _this.state.captureStartPosition - 1) + originalValue.slice(_this.state.captureStartPosition - 1).replace(/^@\w*/, '@' + user.userCredentials.username + ' ');

            _this.reset();

            // typically for connected components we want the state to be updated too
            // but the logic belongs to the wrapped component, so we just invoke the supplied callback
            if (_this.props.onUserSelect) {
                _this.props.onUserSelect(newValue);
            }

            // need to refocus on the input/textarea
            _this.state.element.focus();

            // position the cursor at the end
            var element = _this.state.element;

            setTimeout(function () {
                return element.setSelectionRange(-1, -1);
            }, 0);
        };

        _this.state = (0, _extends3.default)({}, defaultState, { users: [] });

        _this.lookupUser = (0, _debounce2.default)(_this.lookupUser, 250);
        return _this;
    }

    // event bubbles up from the wrapped input/textarea


    (0, _createClass3.default)(MentionsWrapper, [{
        key: 'render',
        value: function render() {
            var children = this.props.children;
            var _state = this.state,
                element = _state.element,
                listIsOpen = _state.listIsOpen,
                users = _state.users,
                selectedUserIndex = _state.selectedUserIndex,
                capturedText = _state.capturedText;


            return _react2.default.createElement(
                'div',
                { onKeyDown: this.onKeyDown },
                children,
                _react2.default.createElement(_UserList2.default, {
                    open: listIsOpen,
                    anchorEl: element,
                    users: users,
                    selectedUser: users[selectedUserIndex],
                    filter: capturedText,
                    onClose: this.reset,
                    onSelect: this.onUserSelect
                })
            );
        }
    }]);
    return MentionsWrapper;
}(_react.Component);

MentionsWrapper.defaultProps = {
    d2: null
};

MentionsWrapper.propTypes = {
    d2: _propTypes2.default.object,
    onUserSelect: _propTypes2.default.func.isRequired
};

exports.default = MentionsWrapper;