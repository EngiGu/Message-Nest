// request.js
import axios from 'axios';
import { ElMessage } from 'element-plus'
import { usePageState } from '../store/page_sate';
import { CONSTANT } from '../constant';

const ERR_NETWORK = "ERR_NETWORK";

const request = axios.create({
    baseURL: 'http://127.0.0.1:8000',
    timeout: 50000,
    withCredentials: true, // 允许发送跨域凭证（例如，用于保持登录状态）
});


// 请求拦截器
request.interceptors.request.use(
    (config) => {
        const pageState = usePageState();
        // console.log('config', config);
        if (!CONSTANT.NO_AUTH_URL.includes(config.url)) {
            config.url = '/api/v1' + config.url;
        }

        if (pageState.Token && !CONSTANT.NO_AUTH_URL.includes(config.url)) {
            // 添加 token 参数到 URL 中
            config.headers = {
                ...config.headers,
                'm-token': pageState.Token,
            };
        }

        return config;
    },
    (error) => {
        // 处理请求错误
        handleException(error);
        // return Promise.reject(error);
    }
);

// 响应拦截器
request.interceptors.response.use(
    (response) => {
        // console.log('request.interceptors.response', response);
        if (response && response.data.code != 200) {
            ElMessage({ message: response.data.msg, type: 'error' })
            // Promise.reject();
        }
        return response;
    },
    (error) => {
        if (error.response && error.response.status === 401) {
            // 未授权，可能是登录状态过期，执行登出操作
            logout();
        }
        handleException(error);
        // return Promise.reject(error);
    }
);

// 异常处理
const handleException = (error) => {
    console.log('handleException', error);
    if (error.code == ERR_NETWORK) {
        ElMessage({ message: `网络错误！`, type: 'error' })
    } else if (error.response && error.response.data.code != 200) {
        ElMessage({ message: error.response.data.msg, type: 'error' })
    };

    // if (error.response) {
    //     // 服务器返回错误状态码
    //     console.error('Server Error:', error.response.status, error.response.data);
    // } else if (error.request) {
    //     // 请求发送成功，但没有收到响应
    //     console.error('No response received:', error.request);
    // } else {
    //     // 其他错误
    //     console.error('Error:', error.message);
    // }
};

// 登出系统
const logout = () => {
    // 执行登出逻辑，清除本地存储的用户信息等
    console.log('User logged out');
};

export { request, handleException, logout };