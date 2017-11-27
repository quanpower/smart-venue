import request from '../utils/request';

export function userList() {
    return request('/api/users');
}

export function roleList() {
    return request('/api/roles');
}

export function menuList() {
    return request('/api/menus');
}

export function fetchByRole(roleId) {
    return request('/api/getMenusByRoleId', {roleId});
}