import _extends from 'babel-runtime/helpers/extends';
import _Object$getPrototypeOf from 'babel-runtime/core-js/object/get-prototype-of';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _createClass from 'babel-runtime/helpers/createClass';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import debounce from 'lodash/debounce';

import UserListContainer from './UserList';

var defaultState = {
    element: null,
    listIsOpen: false,
    captureText: false,
    captureStartPosition: null,
    capturedText: null,
    selectedUserIndex: 0
};

var MentionsWrapper = function (_Component) {
    _inherits(MentionsWrapper, _Component);

    function MentionsWrapper(props) {
        _classCallCheck(this, MentionsWrapper);

        var _this = _possibleConstructorReturn(this, (MentionsWrapper.__proto__ || _Object$getPrototypeOf(MentionsWrapper)).call(this, props));

        _this.lookupUser = function (query) {
            _this.props.d2.Api.getApi().get('users.json', {
                query: query,
                fields: 'id,displayName,userCredentials[username]'
            }).then(function (response) {
                _this.setState({
                    users: response.users,
                    listIsOpen: true
                });
            });
        };

        _this.onKeyDown = function (event) {
            var key = event.key;

            var element = event.target;
            var selectionStart = element.selectionStart,
                selectionEnd = element.selectionEnd;

            // '@' triggers the user lookup/suggestion

            if (!_this.state.captureText && key === '@') {
                _this.setState({
                    element: element,
                    captureText: true,
                    captureStartPosition: selectionStart + 1
                });
            } else if (_this.state.captureText) {
                if (key === ' ' || key === 'Backspace' && selectionStart <= _this.state.captureStartPosition) {
                    _this.setState(defaultState);
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
                    }
                }
            }

            // this is to make sure the state has been updated
            // otherwise the last character is not included in the captured text
            // also debounce
            setTimeout(function () {
                if (_this.state.captureText) {
                    var spacePosition = element.value.indexOf(' ', _this.state.captureStartPosition - 1);

                    var filterValue = element.value.substring(_this.state.captureStartPosition, spacePosition > 0 ? spacePosition : selectionEnd + 1);

                    if (!filterValue || filterValue !== _this.state.capturedText) {
                        _this.lookupUser(filterValue);

                        _this.setState({ capturedText: filterValue });
                    } else if (filterValue.length === 0) {
                        _this.setState({ capturedText: null, users: [] });
                    }
                }
            }, 0);
        };

        _this.onUserListClose = function () {
            _this.setState(defaultState);
        };

        _this.onUserSelect = function (user) {
            var originalValue = _this.state.element.value;
            var newValue = '' + originalValue.slice(0, _this.state.captureStartPosition - 1) + originalValue.slice(_this.state.captureStartPosition - 1).replace(/^@\w*/, '@' + user.userCredentials.username + ' ');

            _this.setState(defaultState);

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

        _this.state = _extends({}, defaultState, { users: [] });

        _this.lookupUser = debounce(_this.lookupUser, 250);
        return _this;
    }

    // event bubbles up from the wrapped input/textarea


    _createClass(MentionsWrapper, [{
        key: 'render',
        value: function render() {
            var children = this.props.children;
            var _state = this.state,
                element = _state.element,
                listIsOpen = _state.listIsOpen,
                users = _state.users,
                selectedUserIndex = _state.selectedUserIndex,
                capturedText = _state.capturedText;


            return React.createElement(
                'div',
                { onKeyDown: this.onKeyDown },
                children,
                React.createElement(UserListContainer, {
                    open: listIsOpen,
                    anchorEl: element,
                    users: users,
                    selectedUser: users[selectedUserIndex],
                    filter: capturedText,
                    onClose: this.onUserListClose,
                    onSelect: this.onUserSelect
                })
            );
        }
    }]);

    return MentionsWrapper;
}(Component);

MentionsWrapper.defaultProps = {
    d2: null
};

MentionsWrapper.propTypes = {
    d2: PropTypes.object,
    onUserSelect: PropTypes.func.isRequired
};

export default MentionsWrapper;