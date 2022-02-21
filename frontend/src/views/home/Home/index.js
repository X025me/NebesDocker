import React from 'react';
import Candidats from './Candidats';
import {Tabs} from 'antd'
import PollingStation from './PollingStation';
import Winners from '../Winners';
import Result from '../Result'

const { TabPane } = Tabs;

const Home = () => {
 
  function callback(key) {
    console.log(key);
  }

  
    return (
        <React.Fragment>
                     {/* <Table style={{ marginTop: 10 }} columns={columns} dataSource={data} /> */}
            <Tabs defaultActiveKey="1" onChange={callback}>
                <TabPane tab="List Of Candidates" key="1">
                <Candidats />
                </TabPane>
                <TabPane tab="List of Winners" key="2">
                <Winners />
                </TabPane>
                <TabPane tab="Candidate Election Result" key="4">
                  <Result />
                </TabPane>
                <TabPane tab="Polling Stations" key="3">
                <PollingStation />
                </TabPane>
            </Tabs>

        </React.Fragment>
    );
};

export default Home;
