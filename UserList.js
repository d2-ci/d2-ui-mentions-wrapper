import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import ListItemText from '@material-ui/core/ListItemText';
import ListItem from '@material-ui/core/ListItem';
import List from '@material-ui/core/List';
import sortBy from 'lodash/sortBy';

import Popover from '@material-ui/core/Popover';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';

import i18n from '@dhis2/d2-i18n';

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

export var UserList = function UserList(_ref) {
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

    var sortedUsers = sortBy(users, [function (userName) {
        return userName.displayName;
    }]);

    return React.createElement(
        Popover,
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
        users.length ? React.createElement(
            Fragment,
            null,
            React.createElement(
                Typography,
                { variant: 'subtitle1' },
                React.createElement(
                    'em',
                    { className: classes.filter },
                    i18n.t('Searching for "{{filter}}"', { filter: filter })
                )
            ),
            React.createElement(
                List,
                { dense: true, disablePadding: true, className: classes.list },
                sortedUsers.map(function (u) {
                    return React.createElement(
                        ListItem,
                        {
                            button: true,
                            key: u.id,
                            onClick: onClick(u),
                            className: selectedUser && selectedUser.id === u.id ? classes.selected : null
                        },
                        React.createElement(ListItemText, {
                            primary: u.displayName + ' (' + u.userCredentials.username + ')'
                        })
                    );
                })
            )
        ) : React.createElement(
            'em',
            { className: classes.filter },
            i18n.t('No results found for "{{filter}}"', { filter: filter })
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
    open: PropTypes.bool,
    anchorEl: PropTypes.object,
    users: PropTypes.array,
    selectedUser: PropTypes.object,
    filter: PropTypes.string,
    onClose: PropTypes.func.isRequired,
    onSelect: PropTypes.func.isRequired
};

export default withStyles(styles)(UserList);