import mockjs from 'mockjs';
import { format, delay } from 'roadhog-api-doc';
import { getRule, postRule } from './mock/rule';
import { getNotices } from './mock/notices';

// 是否禁用代理
const noProxy = process.env.NO_PROXY === 'true';

const proxy = {

    // login, register
    'POST /api/login/token': (req, res) => {
        const {username, password} = req.body;
        if (username === 'admin' && password === 'admin') {
            res.send({
                user: {
                    username,
                    ability: 1,
                    userId: 1,
                    email: 'admin@qq.com'
                },
                access_token: "123123123",
                status: 'success'
            });
        } else {
            res.send({status: 'fail'});
        }
    },

    // account
    'GET /api/account/1': (req, res) => {
        const {userid} = req.body;
        res.send({
                id: 1,
                user_account: 'admin',
                user_name: '小强',
                email: 'xiaoqiang@qq.com',
                phone: '13812731211',
                address: 'china',
                user_type: "1",
                sex: 'm',
                birthday: '1992-10-10'
        });
    },



    // GET POST 可省略, 支持值为 Object 和 Array
    'GET /api/users': mockjs.mock({
         // 属性 data 的值是一个数组，其中含有 1 到 24 个元素
        'data|1-100': [{
            // 属性 id 是一个自增数，起始值为 1，每次增 1
            'id|+1': 1,
            user_account: '@user_count',
            user_name: '@name',
            email: '@email',
            phone: '13812731211',
            address: 'china',
            'user_type|1': ["1", "2"],
            'sex|1': ['m', 'f'],
            birthday: '@date'
        }]
    }),

    'GET /api/roles': mockjs.mock({
        'data|1-5': [{
            'id|+1': 1,
            'role_name|1': ['admin', 'user', 'employee'],
            description: 'role description',
        }]
    }),

    'GET /api/menus': 
    [{
        id: 1,
        name: '系统管理',
        parent_id: "0",
        parent_name: null,
        icon_name: 'table',
        component: null,
        sort_index: 3
    },{
        id: 2,
        name: '用户管理',
        parent_id: "0",
        parent_name: null,
        icon_name: 'table',
        component: null,
        sort_index: 2
    },{
        id: 3,
        name: '系统管理1',
        parent_id: "1",
        parent_name: "系统管理",
        icon_name: 'table',
        component: null,
        sort_index: 1
    },{
        id: 4,
        name: '系统管理2',
        parent_id: "1",
        parent_name: "系统管理",
        icon_name: 'table',
        component: null,
        sort_index: 2
    },{
        id: 5,
        name: '系统管理1-1',
        parent_id: "3",
        parent_name: "系统管理1",
        icon_name: 'table',
        component: null,
        sort_index: 1
    },{
        id: 6,
        name: '系统管理1-2',
        parent_id: "3",
        parent_name: "系统管理1",
        icon_name: 'table',
        component: null,
        sort_index: 2
    },{
        id: 7,
        name: '用户管理1',
        parent_id: "2",
        parent_name: "用户管理",
        icon_name: 'table',
        component: null,
        sort_index: 3
    },{
        id: 8,
        name: '用户管理2',
        parent_id: "2",
        parent_name: "用户管理",
        icon_name: 'table',
        component: null,
        sort_index: 2
    }],

    'POST /api/menu/getMenusByRoleId': (req, res) => {
        const { roleId } = req.body;
        res.send([{
            id: 1,
            name: '系统管理',
            parent_id: "0",
            parent_name: null,
            icon_name: 'table',
            component: null,
            sort_index: 3
        },{
            id: 3,
            name: '系统管理1',
            parent_id: "1",
            parent_name: "系统管理",
            icon_name: 'table',
            component: null,
            sort_index: 1
        },{
            id: 4,
            name: '系统管理2',
            parent_id: "1",
            parent_name: "系统管理",
            icon_name: 'table',
            component: null,
            sort_index: 2
        }]);
    },


    // 支持值为 Object 和 Array
    'GET /api/currentUser': {
        $desc: "获取当前用户接口",
        $params: {
        pageSize: {
            desc: '分页',
            exp: 2,
        },
        },
        $body: {
            name: 'Serati Ma',
            avatar: 'https://gw.alipayobjects.com/zos/rmsportal/dRFVcIqZOYPcSNrlJsqQ.png',
            userid: '00000001',
            notifyCount: 12,
        },
    },
    'GET /api/rule': getRule,
    'POST /api/rule': {
        $params: {
        pageSize: {
            desc: '分页',
            exp: 2,
        },
        },
        $body: postRule,
    },
    'GET /api/tags': mockjs.mock({
        'list|100': [{ name: '@city', 'value|1-100': 150, 'type|0-2': 1 }]
    }),
    'POST /api/login/account': (req, res) => {
        const { password, userName } = req.body;
        res.send({status: 'ok', type: 'accout'});
        // res.send({ status: password === 'admin' && userName === 'admin' ? 'ok' : 'error', type: 'account' });
    },
    'POST /api/login/mobile': (req, res) => {
        res.send({ status: 'ok', type: 'mobile' });
    },
    'POST /api/register': (req, res) => {
        // console.info(req.body)
        res.send({ status: 'ok' });
    },
    'GET /api/notices': getNotices,
};

export default noProxy ? {} : delay(proxy, 100);