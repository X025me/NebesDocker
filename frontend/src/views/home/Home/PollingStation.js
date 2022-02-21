import React, { useEffect, useState, useRef } from 'react';
import { Table, Select, Input, Button, Space, Radio, Pagination } from 'antd';
import Highlighter from 'react-highlight-words';
import { API_SERVER1 } from './../../../config/constant';
import { useReactToPrint } from 'react-to-print';
import { SearchOutlined } from '@ant-design/icons';

const { Option } = Select;

const data = [
    {
        key: '1',
        name: 'John Brown',
        age: 32,
        address: 'New York No. 1 Lake Park'
    },
    {
        key: '2',
        name: 'Joe Black',
        age: 42,
        address: 'London No. 1 Lake Park'
    },
    {
        key: '3',
        name: 'Jim Green',
        age: 32,
        address: 'Sidney No. 1 Lake Park'
    },
    {
        key: '4',
        name: 'Jim Red',
        age: 32,
        address: 'London No. 2 Lake Park'
    }
];

export default function PollingStation() {
    const [searchText, setSearchText] = useState();
    const [searchedColumn, setSearchedColumn] = useState('');
    var [searchInput, setSearchInput] = useState('');
    var [loading, setLoading] = useState(false)
    var [next, setNext] = useState('')
    var [back, setBack] = useState('')
    var [totalPage, setTotalPage] = useState(0)
    var [currentPage, setCurrentPage] = useState(1)
    var [pageSizes, setPagesizes] = useState(10)
    var [offset, setOffset] = useState(10)
    let [constituencyid, setConstituencyid] = useState(' ')
    let [genders, setGender] = useState(' ')
    let [regionid, setRegionid] = useState(' ')
    let [type, setType] = useState(' ')
    const [candidates, setCandidates] = useState([])
    const [constituency, setConstituency] = useState([])
    const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

    const getConstituency = async() =>{
        try {
            const response = await fetch(API_SERVER1+`data/read/constituency/`)
            const res = await response.json()
            setConstituency(res)
            
        } catch (error) {
            console.log(error)
        }
    }

    

    const apiGetter = async(pageS, off, dat, gen, region, types) =>{
        try {
            const response = await fetch(API_SERVER1+`data/read/pstation/?limit=${pageS}&offset=${off}&search=${dat}+${gen}`)
            const res = await response.json()
            setCandidates(res.results)
            console.log(res.results)
            setTotalPage(res.count)
            setNext(res.next)
            setBack(res.back)
            setLoading(false)
            
        } catch (error) {
            console.log(error)
        }
    }
    const apiGetterOnChange = async(url, action) =>{
        try {
            const response = await fetch(url)
            const res = await response.json()
            setCandidates(res.results)
            setTotalPage(res.count)
            if(action == 'next'){
                setCurrentPage(currentPage+1)
            }
            else if (action == 'back'){
                setCurrentPage(currentPage-1)
            }
            setNext(res.next)
            setBack(res.previous)            
        } catch (error) {
            alert('Network Error')
        }
    }


    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();

        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };

    const handleReset = (clearFilters) => {
        clearFilters();
        setSearchText('');
    };
    const getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
            <div style={{ padding: 8 }}>
                <Input
                    ref={(node) => {
                        searchInput = node;
                    }}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{ marginBottom: 8, display: 'block' }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{ width: 90 }}
                    >
                        Search
                    </Button>
                    <Button onClick={() => handleReset(clearFilters)} size="small" style={{ width: 90 }}>
                        Reset
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            confirm({ closeDropdown: false });
                            setSearchText(selectedKeys[0]);
                            setSearchedColumn(dataIndex);
                        }}
                    >
                        Filter
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered) => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
        onFilter: (value, record) => (record[dataIndex] ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()) : ''),
        onFilterDropdownVisibleChange: (visible) => {
            if (visible) {
                setTimeout(() => searchInput.select(), 100);
            }
        },

        render: (text) =>
            searchedColumn === dataIndex ? (
                <Highlighter
                    highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
                    searchWords={[searchText]}
                    autoEscape
                    textToHighlight={text ? text.toString() : ''}
                />
            ) : (
                text
            )
    });
    const columns = [
        {
            title: 'Name',
            dataIndex: 'voterpollingstationname',
            key: 'voterpollingstationname',
            width: '20%',
            ...getColumnSearchProps('name')
        },
        {
            title: 'Code',
            dataIndex: 'voterpollingstationcode',
            key: 'voterpollingstationcode',
            width: '10%',
            ...getColumnSearchProps('gender')
        },
        {
            title: 'Constituency',
            dataIndex: 'constituencyid',
            key: 'constituencyid',
            width: '20%',
            ...getColumnSearchProps('gender')
        },
        {
            title: 'Regional Constituncy',
            dataIndex: 'constituencyid',
            key: 'constituencyid',
            width: '20%',
            ...getColumnSearchProps('gender')
        },
        {
            title: 'Region',
            dataIndex: 'region',
            key: 'placeofbirthid',
            width: '20%',
            ...getColumnSearchProps('placeofbirthid'),
            sorter: (a, b) => a.address.length - b.address.length,
            sortDirections: ['descend', 'ascend']
        }
    ];
    const onPageChange = (page, pageSize) =>{
        setLoading(true)
        apiGetter(pageSize, page*pageSize, constituencyid, regionid, type)
        setCurrentPage(page)
    }
    const onSizetoShowChange = (current, size) =>{
        console.log(current, size)
        setPagesizes(size)
        apiGetter(size, 0, constituencyid, genders, regionid, type)
    }

    function itemRender(current, type, originalElement) {
        if (type === 'prev') {
          return <a onClick={() =>apiGetterOnChange(back, 'back')}>Previous</a>;
        }
        if (type === 'next') {
          return <a onClick={() =>apiGetterOnChange(next, 'next')}>Next</a>;
        }
        return originalElement;
      }

    const onChangeConst = e => {
        console.log('radio checked', e.target.value);
       setType(e.target.value)
       apiGetter(0,0,constituencyid, regionid, type)

      };

    const onSelectConstId = (value) =>{
        apiGetter(0, 0, value, genders)
        setConstituencyid(value)
    }
    const onGenderChange = (value) =>{
        setGender(value)
        apiGetter(0,0,constituencyid, value, regionid, type)
    }
    const onSelectRegion = (value) =>{
        setRegionid(value)
        apiGetter(0,0,constituencyid, value, regionid, type)

    }


    useEffect(() =>{
        apiGetter(pageSizes, offset, '', '', '', '')
        getConstituency()
    }, [pageSizes])
    return (
        <div>
            <div>
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        width: 500,
                        marginBottom: 20,
                        marginTop: 30
                    }}
                >
                        <h4>Filter Candidate By</h4>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'row' , color: '#1de9b6', padding: 5}}>
                        <p style={{ marginRight: 20 }}>Election Type</p>
                        <Radio.Group onChange={onChangeConst} buttonStyle="solid">
                            <Radio value="a">HOPR</Radio>
                            <Radio value="b">RC</Radio>
                        </Radio.Group>
                    </div>
                 <div
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        width: '50%',
                        marginBottom: 20,
                        marginTop: 20
                    }}
                >
                     <Select
                        style={{ width: 200 }}
                        placeholder="Search By Region"
                        onChange={onSelectRegion}
                    >
                        <Option value="0">HQ</Option>
                        <Option value="21">Addis Ababa</Option>
                        <Option value="22">Afar</Option>
                        <Option value="23">Amhara</Option>
                        <Option value="24">Benishangul Gumuz</Option>
                        <Option value="25">Dire Dawa Astedadar</Option>
                        <Option value="26">Gambela</Option>
                        <Option value="27">Hareri</Option>
                        <Option value="28">Oromiya</Option>
                        <Option value="29">Sidama</Option>
                        <Option value="30">SNNP</Option>
                        <Option value="31">Somali</Option>
                    </Select>
                    <Select
                        showSearch
                        style={{ width: 200 }}
                        placeholder="Constituency"
                        optionFilterProp="children"
                        onChange={onSelectConstId}
                        filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                        filterSort={(optionA, optionB) => optionA.children.toLowerCase().localeCompare(optionB.children.toLowerCase())}
                    >
                        {constituency.map((item, index) =>(
                            <Option key={index} value={item.constituencyid}>{item.constituencyname}</Option>
                        ))}
                    </Select>
                    <button style={{fontSize: 12, backgroundColor: '#007bff', borderWidth: 0, marginLeft: 10, color: 'white'}} onClick={handlePrint}>Print</button>
                </div>
            </div>

            <Table ref={componentRef} loading={loading} pagination={{ position: [], pageSize: pageSizes }} style={{ marginTop: 10 }} columns={columns} dataSource={candidates} />
            <Pagination onChange={onPageChange} onShowSizeChange={onSizetoShowChange} defaultCurrent={1} current={currentPage} total={totalPage} itemRender={itemRender}/>        </div>
    );
}
