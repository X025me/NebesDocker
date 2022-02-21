import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Collapse, notification } from 'antd';
import axios from 'axios';
import { API_SERVER1 } from '../../../../../../config/constant';

const { Panel } = Collapse;

const Friends = ({ listOpen }) => {
    const [chatOpen, setChatOpen] = useState(listOpen);
    const [user, setUser] = useState([]);
    const [users, setUsers] = useState([]);
    const [notApproved, setNotApproved] = useState([]);
    const account = useSelector((state) => state.account);

    const requests = async () => {
        try {
            const response = await fetch('http://localhost:8000/data/requests/request_list_aproved/');
            const res = await response.json();
            console.log('data', res.results);

            setUsers(res.results);
        } catch (e) {
            console.log(e);
        }
    };
    const approve = (id) => {
        axios.get(API_SERVER1 + `data/requests/approval/${id}`, { headers: { Authorization: `${account.token}` } })
            .then(function (response) {

                requests();
                requestsNotApproved();                
                notification.open({
                message: 'Success',
                description:
                  "Approved",
                className: 'custom-class',
                style: {
                  width: 600,
                },
              });
              
            })
            .catch(function (error) {
                console.log(error)
              notification.open({
                message: 'Fail',
                description: "Not Approved",
                className: 'custom-class',
                style: {
                  width: 600,
                },
              });
            });
    };
    const ColapserDetail = ({ model, data }) => {
        console.log('from view', data);
        if (model == 'NewvoteRcmax') {
            return (
                <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'left' }}>
                    <h5>From RC Maximum Results </h5>

                    <span>Full Name: - {data.content_object.result.candidate.fullname}</span>
                    <span>Ballot Order: - {data.content_object.result.candidate.ballotorder}</span>
                    <span>Regional Constituency: - {data.content_object.result.general.rcconstituency.regionalconstituencyname}</span>
                    <span>Region: - {data.content_object.result.general.region.regionname}</span>
                    <span>Vote: - {data.content_object.result.vote}</span>
                </div>
            );
        } else if (model == 'NewvoteHoprmax') {
            return (
                <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'left' }}>
                    <h5>From HOPR Maximum Results </h5>

                    <span>Full Name: - {data.content_object.result.candidate.fullname}</span>
                    <span>Ballot Order: - {data.content_object.result.candidate.ballotorder}</span>
                    <span>Region: - {data.content_object.result.general.region}</span>
                    <span>Vote: - {data.content_object.result.vote}</span>
                </div>
            );
        } else if (model == 'NewvoteHoprgeneral') {
            return (
                <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'left' }}>
                    <h5>From HOPR General </h5>

                    <span>Constituency: - {data.content_object.hoprconstituency.constituencyname}</span>
                    <span>Number Of PS: - {data.content_object.no_of_pollingstation}</span>
                    <span>Region: - {data.content_object.region.regionname}</span>
                </div>
            );
        } else if (model == 'NewvoteHopresult') {
            return (
                <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'left' }}>
                    <h5>From HOPR Results </h5>

                    <span>Candidate: - {data.content_object.candidate.fullname}</span>
                    <span>Ballot order: - {data.content_object.candidate.ballotorder}</span>
                    <span>Party: - {data.content_object.party.politicalpartynameen}</span>
                    <span>Vote: - {data.content_object.vote}</span>
                </div>
            );
        } else if (model == 'NewvoteRcgeneral') {
            return (
                <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'left' }}>
                    <h5>From RC General </h5>

                    <span>Regional Constituency: - {data.content_object.rcconstituency.regionalconstituencyname}</span>
                    <span>Region: - {data.content_object.rcconstituency.regionid.regionname}</span>
                    <span>Number Of PS: - {data.content_object.no_of_pollingstation}</span>
                </div>
            );
        } else {
            return <div>This is Default</div>;
        }
    };

    const requestsNotApproved = async () => {
        try {
            const response = await fetch('http://localhost:8000/data/requests/request_list_notapproved/');
            const res = await response.json();
            console.log('not approved', res);
            setNotApproved(res.results);
        } catch (e) {
            console.log(e);
        }
    };
    function callback(key) {
        console.log(key);
    }

    useEffect(() => {
        requests();
        setChatOpen(false);
        requestsNotApproved();

        console.log(account);
    }, [listOpen]);

    return (
        <React.Fragment>
            <>
                {account.user.is_staff && !account.user.is_superuser ? (
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        {notApproved.map((item, index) => (
                            <div style={{ padding: 10, margin: 10, backgroundColor: '#8f4444fa', color: 'white' }}>
                                <p style={{ color: 'white', paddingRight: 10, textDecoration: 'capitalize' }}>{item.owner}</p>
                                {item.request_description}
                                <p style={{ fontSize: 12, color: 'aqua' }}>{item.created_date}</p>
                                {account.user.is_superuser ? (
                                    <div
                                        style={{
                                            display: 'flex',
                                            flexDirection: 'row',
                                            justifyContent: 'end',
                                            alignItems: 'flex-end',
                                            width: '100%'
                                        }}
                                    >
                                        {/* <button onClick={approve(item.id)} style={{ backgroundColor: 'green', borderWidth: 0 }}>Approve</button> */}
                                    </div>
                                ) : null}
                                <Collapse onChange={callback}>
                                    <Panel header="Detail" key="1">
                                        <ColapserDetail model={item.models.name} data={item} />
                                    </Panel>
                                </Collapse>
                            </div>
                        ))}
                        {users.map((item, index) => (
                            <div style={{ padding: 10, margin: 10, backgroundColor: '#385238fa', borderRadius: 10, color: 'white' }}>
                                <p style={{ color: '#03fb00', paddingRight: 10, textDecoration: 'uppercase' }}>{item.owner}</p>
                                {item.request_description}
                                <p style={{ fontSize: 12, color: 'gray' }}>{item.created_date}</p>
                                <Collapse onChange={callback}>
                                    <Panel header="Detail" key="1">
                                        <ColapserDetail model={item.models.name} data={item} />
                                    </Panel>
                                </Collapse>
                            </div>
                        ))}
                    </div>
                ) : null}
            </>
            <>
                {account.user.is_superuser ? (
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        {notApproved ? (
                            <>
                                {notApproved.map((item, index) => (
                                    <div style={{ padding: 10, margin: 10, backgroundColor: '#8f4444fa', color: 'white' }}>
                                        <p style={{ color: 'white', paddingRight: 10, textDecoration: 'capitalize' }}>{item.owner}</p>
                                        {item.request_description}
                                        <p style={{ fontSize: 12, color: 'aqua' }}>{item.created_date}</p>
                                        {account.user.is_superuser ? (
                                            <div
                                                style={{
                                                    display: 'flex',
                                                    flexDirection: 'row',
                                                    justifyContent: 'end',
                                                    alignItems: 'flex-end',
                                                    width: '100%'
                                                }}
                                            >
                                                <button  onClick={() =>approve(item.id)} style={{ backgroundColor: 'green', borderWidth: 0, margin: 10 }}>Approve</button>
                                            </div>
                                        ) : null}
                                        <Collapse onChange={callback}>
                                            <Panel header="Detail" key="1">
                                                <ColapserDetail model={item.models.name} data={item} />
                                            </Panel>
                                        </Collapse>
                                    </div>
                                ))}
                            </>
                        ) : null}
                        {users.map((item, index) => (
                            <div style={{ padding: 10, margin: 10, backgroundColor: '#385238fa', borderRadius: 10, color: 'white' }}>
                                <p style={{ color: '#03fb00', paddingRight: 10, textDecoration: 'uppercase' }}>{item.owner}</p>
                                {item.request_description}
                                <p style={{ fontSize: 12, color: 'gray' }}>{item.created_date}</p>
                                <Collapse onChange={callback}>
                                    <Panel header="Detail" key="1">
                                        {item ? <ColapserDetail model={item.models.name} data={item} /> : null}
                                        {/* {item.content_object.result.general} */}
                                    </Panel>
                                </Collapse>
                            </div>
                        ))}
                    </div>
                ) : null}
            </>
        </React.Fragment>
    );
};

export default Friends;
