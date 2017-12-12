import request from '../utils/request';
import {storageTokenKey} from '../utils/utils';

export function auth(payload) {
    return request('/api/login/token', {
        method: 'POST',
        body: payload
    });
}


export function fetchUser() {
    const token = window.localStorage.getItem(storageTokenKey);
    return {
        data: {
            username: 'admin',
            ability: 1,
            userId: 1,
            email: 'admin@qq.com'
        }
    }
    // return request('/api/login/user', {
    //     method: 'GET',
    //     headers: new Headers({
    //         "Authorization": `Bearer ${token}`
    //     })
    // });
}