import request from '../utils/request';
import {storageTokenKey} from '../utils/utils';

// account
export function queryCurrent(userId) {
    const token = window.localStorage.getItem(storageTokenKey);
    return request(`/api/account/${userId}`, {
        method: 'GET',
        headers: new Headers({
            "Authorization": `Bearer ${token}`
        })
    });
}

// user
export function userList() {
    return request('/api/users');
}

export function createUser({username, password, email}) {
    return request('/api/user', {
        method: 'POST',
        headers: new Headers({
            "Content-Type": "application/json; charset=utf-8"
        }),
        body: JSON.stringify({
            username, password, email
        })
    });
}


//role
export function roleList() {
    return request('/api/roles');
}


// menu
export function menuList() {
    return request('/api/menus');
}

export function fetchByRole(roleId) {
    return request('/api/menu/getMenusByRoleId', {
        method: 'POST',
        body: {roleId}
    });
}