import dva from 'dva';
import 'moment/locale/zh-cn';
import './index.css';
import createLoading from 'dva-loading';
import models from './models';
import 'ant-design-pro/dist/ant-design-pro.css';

// 1. Initialize
const app = dva();

// 2. Plugins
// app.use({});
app.use(createLoading());

// 3. Model
// app.model(require('./models/example'));
models.forEach((m) => {
    app.model(m);
});

// 4. Router
app.router(require('./router'));

// 5. Start
app.start('#root');
