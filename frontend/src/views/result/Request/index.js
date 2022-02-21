import React, { useState, useEffect } from 'react';
import { SmileOutlined } from '@ant-design/icons';
import { Form, Input, Spin, Select, Button, notification  } from 'antd';
import { useSelector } from 'react-redux';
import { API_SERVER1 } from '../../../config/constant';
import axios from 'axios';

const { Option } = Select;

const formItemLayout = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 6 }
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 14 }
    }
};

export default function Index() {
    const [model, setModel] = useState('');
    const [loading, setLoading] = useState(false);
    const [title, setTitle] = useState('');
    const [active, setActive] = useState(false);
    const [objects, setObjects] = useState([]);
    const [error, setError] = useState(false);
    const [objectsid, setObjectsid] = useState(0);
    const [objtype, setObjType] = useState('');
    const [description, setDescription] = useState('');
    const [pageactivate, setpageactivate] = useState(false);
    const account = useSelector((state) => state.account);
    const openNotification = () => {
      notification.open({
        message: 'Success',
        description:
          "Your Request Has been sent, Thank You",
        className: 'custom-class',
        style: {
          width: 600,
        },
      });
    };

    const request = () => {
        axios
            .post(API_SERVER1 + `data/requests/request_change/${objtype}`, {
                object_id: objectsid,
                content_type: objtype,
                request_description: description
            }, { headers: { Authorization: `${account.token}` } })
            .then(function (response) {
              notification.open({
                message: 'Success',
                description:
                  "Thank You",
                className: 'custom-class',
                style: {
                  width: 600,
                },
              });
              window.location.reload()
              
            })
            .catch(function (error) {
              notification.open({
                message: 'Fail',
                description:
                  "We couldnt accept your request, please check your internet connection and make sure all required forms are filled",
                className: 'custom-class',
                style: {
                  width: 600,
                },
              });
            });
    };

    const getSelectedModelData = (value) => {
        setLoading(true);
        setObjType(value);
        axios
            .get(API_SERVER1 + `data/requests/request_change/${value}`, { headers: { Authorization: `${account.token}` } })
            .then(function (response) {
                console.log(response);
                setActive(true);
                setLoading(false);
                setObjects(response.data);
            })
            .catch(function (error) {
                setLoading(false);
                setError(true);
            });
    };
    const onSelectModel = (e) => {
        if (e == 'newvotehoprgeneral' || e == 'newvotehopresult' || e == 'newvotehoprmax') {
            setTitle('House of Peoples Representative');
        } else if (e == 'newvotercgeneral' || e == 'newvotercresult' || e == 'newvotercmax') {
            setTitle('Regional Constituency ');
        }

        getSelectedModelData(e);
    };
    return (
        <div>
            <h3 style={{ textAlign: 'center' }}>Change Request Form</h3>
            <Form {...formItemLayout}>
                <Form.Item label="Data Source" hasFeedback>
                    <Select allowClear onSelect={onSelectModel}>
                        <Option value="newvotehoprgeneral">HOPR General Data</Option>
                        <Option value="newvotehopresult">HOPR Candidate Result Data</Option>
                        <Option value="newvotehoprmax">HOPR Winner Data</Option>
                        <Option value="newvotercgeneral">RC General Data</Option>
                        <Option value="newvotercresult">RC Candidate Result Data</Option>
                        <Option value="newvotercmax">RC Winner Data</Option>
                    </Select>
                </Form.Item>
                {objtype == 'newvotercmax' ? (
                    <>
                        {active ? (
                            <Form.Item label={title} validateStatus="warning">
                                {!objects.length ? (
                                    <p style={{ color: 'red' }}>Error Loading Data, please check your connection and refresh the page</p>
                                ) : (
                                    <Select onSelect={(e) => setObjectsid(e)}>
                                        {objects.map((item, index) => (
                                            <Option key={index} value={item.id}>
                                                {item.result.general.rcconstituency.regionalconstituencyname}
                                            </Option>
                                        ))}
                                    </Select>
                                )}
                            </Form.Item>
                        ) : (
                            <div>{loading ? <Spin /> : null}</div>
                        )}{' '}
                    </>
                ) : null}
                {objtype == 'newvotercresult' ? (
                    <>
                        {active ? (
                            <Form.Item label={title} validateStatus="warning">
                                {!objects.length ? (
                                    <p style={{ color: 'red' }}>Error Loading Data, please check your connection and refresh the page</p>
                                ) : (
                                    <Select onSelect={(e) => setObjectsid(e)}>
                                        {objects.map((item, index) => (
                                            <Option key={index} value={item.id}>
                                                {item.rcconstituency.regionalconstituencyname}
                                            </Option>
                                        ))}
                                    </Select>
                                )}
                            </Form.Item>
                        ) : (
                            <div>{loading ? <Spin /> : null}</div>
                        )}{' '}
                    </>
                ) : null}
                {objtype == 'newvotercgeneral' ? (
                    <>
                        {active ? (
                            <Form.Item label={title} validateStatus="warning">
                                {!objects.length ? (
                                    <p style={{ color: 'red' }}>Error Loading Data, please check your connection and refresh the page</p>
                                ) : (
                                    <Select onSelect={(e) => setObjectsid(e)}>
                                        {objects.map((item, index) => (
                                            <Option key={index} value={item.id}>
                                                {item.rcconstituency.regionalconstituencyname}
                                            </Option>
                                        ))}
                                    </Select>
                                )}
                            </Form.Item>
                        ) : (
                            <div>{loading ? <Spin /> : null}</div>
                        )}{' '}
                    </>
                ) : null}
                {objtype == 'newvotehopresult' ? (
                    <>
                        {active ? (
                            <Form.Item label={title} validateStatus="warning">
                                {!objects.length ? (
                                    <p style={{ color: 'red' }}>Error Loading Data, please check your connection and refresh the page</p>
                                ) : (
                                    <Select onSelect={(e) => setObjectsid(e)}>
                                        {objects.map((item, index) => (
                                            <Option key={index} value={item.id}>
                                                {item.general.hoprconstituency.constituencyname}
                                            </Option>
                                        ))}
                                    </Select>
                                )}
                            </Form.Item>
                        ) : (
                            <div>{loading ? <Spin /> : null}</div>
                        )}{' '}
                    </>
                ) : null}

                {objtype == 'newvotehoprmax' ? (
                    <>
                        {active ? (
                            <Form.Item label={title} validateStatus="warning">
                                {!objects.length ? (
                                    <p style={{ color: 'red' }}>Error Loading Data, please check your connection and refresh the page</p>
                                ) : (
                                    <Select onSelect={(e) => setObjectsid(e)}>
                                        {objects.map((item, index) => (
                                            <Option key={index} value={item.id}>
                                                {item.constituency.name}
                                            </Option>
                                        ))}
                                    </Select>
                                )}
                            </Form.Item>
                        ) : (
                            <div>{loading ? <Spin /> : null}</div>
                        )}{' '}
                    </>
                ) : null}
                {objtype == 'newvotehoprgeneral' ? (
                    <>
                        {active ? (
                            <Form.Item label={title} validateStatus="warning">
                                {!objects.length ? (
                                    <p style={{ color: 'red' }}>Error Loading Data, please check your connection and refresh the page</p>
                                ) : (
                                    <Select onSelect={(e) => setObjectsid(e)}>
                                        {objects.map((item, index) => (
                                            <Option key={index} value={item.id}>
                                                {item.hoprconstituency.constituencyname}
                                            </Option>
                                        ))}
                                    </Select>
                                )}
                            </Form.Item>
                        ) : (
                            <div>{loading ? <Spin /> : null}</div>
                        )}{' '}
                    </>
                ) : null}
                <Form.Item name="Description" label="Description" rules={[{ required: true, message: 'Please input Description' }]}>
                    <Input.TextArea showCount maxLength={100} onChange={(e) => setDescription(e.target.value)} />
                </Form.Item>
                <Form.Item style={{ justifyContent: 'right', marginLeft: '62%' }}>
                    <Button onClick={request} type="primary" htmlType="submit">
                        Send
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
}
