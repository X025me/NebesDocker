import React from 'react';
import { HashRouter as Router } from 'react-router-dom';

import routes, { renderRoutes } from './routes';
import 'antd/dist/antd.css';
import { BASENAME } from './config/constant';

const App = () => {
    return (
        <React.Fragment>
            <Router basename={BASENAME}>{renderRoutes(routes)}</Router>
        </React.Fragment>
    );
};

export default App;
