'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.UserList = undefined;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _ListItemText = require('@material-ui/core/ListItemText');

var _ListItemText2 = _interopRequireDefault(_ListItemText);

var _ListItem = require('@material-ui/core/ListItem');

var _ListItem2 = _interopRequireDefault(_ListItem);

var _List = require('@material-ui/core/List');

var _List2 = _interopRequireDefault(_List);

var _Popover = require('@material-ui/core/Popover');

var _Popover2 = _interopRequireDefault(_Popover);

var _Typography = require('@material-ui/core/Typography');

var _Typography2 = _interopRequireDefault(_Typography);

var _styles = require('@material-ui/core/styles');

var _d2I18n = require('@dhis2/d2-i18n');

var _d2I18n2 = _interopRequireDefault(_d2I18n);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var styles = function styles() {
    return {
        popover: {
            // ensure the popover show on top of other dialogs/modals
            zIndex: 2000
        },
        list: {
            maxHeight: 180
        },
        selected: {
            backgroundColor: 'lightgrey' // TODO not the same color as the MUI one, also clashes when the mouse is moved on the list, as the selection done programmatically remains active
        },
        filter: {
            display: 'block',
            padding: '8px 24px',
            color: 'gray',
            fontSize: '0.8125rem'
        }
    };
};

var UserList = exports.UserList = function UserList(_ref) {
    var classes = _ref.classes,
        open = _ref.open,
        anchorEl = _ref.anchorEl,
        users = _ref.users,
        filter = _ref.filter,
        selectedUser = _ref.selectedUser,
        onClose = _ref.onClose,
        onSelect = _ref.onSelect;

    var onClick = function onClick(user) {
        return function (event) {
            if (event) {
                event.stopPropagation();
                event.preventDefault();
            }

            onSelect(user);
        };
    };

    return _react2.default.createElement(
        _Popover2.default,
        {
            open: open,
            anchorEl: anchorEl,
            anchorOrigin: {
                vertical: 'bottom',
                horizontal: 'left'
            },
            anchorPosition: { top: 15, left: 0 },
            disableAutoFocus: true,
            onClose: onClose,
            className: classes.popover
        },
        users.length ? _react2.default.createElement(
            _react.Fragment,
            null,
            _react2.default.createElement(
                _Typography2.default,
                { variant: 'subheading' },
                _react2.default.createElement(
                    'em',
                    { className: classes.filter },
                    _d2I18n2.default.t('Searching for "{{filter}}"', { filter: filter })
                )
            ),
            _react2.default.createElement(
                _List2.default,
                { dense: true, disablePadding: true, className: classes.list },
                users.map(function (u) {
                    return _react2.default.createElement(
                        _ListItem2.default,
                        {
                            button: true,
                            key: u.id,
                            onClick: onClick(u),
                            className: selectedUser && selectedUser.id === u.id ? classes.selected : null
                        },
                        _react2.default.createElement(_ListItemText2.default, {
                            primary: u.displayName + ' (' + u.userCredentials.username + ')'
                        })
                    );
                })
            )
        ) : _react2.default.createElement(
            'em',
            { className: classes.filter },
            _d2I18n2.default.t('No results found for "{{filter}}"', { filter: filter })
        )
    );
};

UserList.defaultProps = {
    open: false,
    anchorEl: null,
    users: [],
    selectedUser: null,
    filter: null
};

UserList.propTypes = {
    open: _propTypes2.default.bool,
    anchorEl: _propTypes2.default.object,
    users: _propTypes2.default.array,
    selectedUser: _propTypes2.default.object,
    filter: _propTypes2.default.string,
    onClose: _propTypes2.default.func.isRequired,
    onSelect: _propTypes2.default.func.isRequired
};

exports.default = (0, _styles.withStyles)(styles)(UserList);