import React, { useEffect, useState, useRef } from 'react';
import { Table, Select, Input, Button, Space, Radio, Pagination } from 'antd';
import Highlighter from 'react-highlight-words';
import { API_SERVER1 } from './../../../config/constant';
import { useReactToPrint } from 'react-to-print';
import { SearchOutlined } from '@ant-design/icons';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';


const { Option } = Select;

export default function Candidats() {
    const [searchText, setSearchText] = useState();
    const [searchedColumn, setSearchedColumn] = useState('');
    const [politicalparty, setPoliticalparty] = useState([])
    var [searchInput, setSearchInput] = useState('');
    var [loading, setLoading] = useState(false)
    var [next, setNext] = useState('')
    var [back, setBack] = useState('')
    var [totalPage, setTotalPage] = useState(0)
    var [currentPage, setCurrentPage] = useState(1)
    var [pageSizes, setPagesizes] = useState(10)
    var [offset, setOffset] = useState(10)
    let [constituencyid, setConstituencyid] = useState('')
    let [politicalpartyid, setPoliticalpartyId] = useState('')
    let [genders, setGender] = useState('')
    let [regionid, setRegionid] = useState('')
    let [type, setType] = useState('')
    let [rconstid, setRConstId] = useState('')
    let [electiontype, setElectionType] = useState(1)
    let [disability, setDisability] = useState(3)
    const [candidates, setCandidates] = useState([])
    const [constituency, setConstituency] = useState([])
    const [regionalconstituncy, setRegionalConstituency] = useState([])
    const [cand_to_xl, setXL] = useState([])
    const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

    const getConstituency = async(value) =>{
        try {
            const response = await fetch(API_SERVER1+`data/read/constituency/?search=${value}`)
            const res = await response.json()
            setConstituency(res)
            
        } catch (error) {
            console.log(error)
        }
    }
    const getRConstituency = async(value) =>{
        try {
            const response = await fetch(API_SERVER1+`data/read/rconstitunecy/?search=${value}`)
            const res = await response.json()
            setRegionalConstituency(res)
            
        } catch (error) {
            console.log(error)
        }
    }
    const getParty = async() =>{
        try {
            const response = await fetch(API_SERVER1+`data/read/party_list/`)
            const res = await response.json()
            setPoliticalparty(res)
            
        } catch (error) {
            console.log(error)
        }
    }


    const apiGetter = async(data) =>{
        try {
            const response = await fetch(API_SERVER1+`data/read/candidate_list/${data.disability}?limit=${data.pageSize}&offset=${data.offset}&search=${data.region}+${data.constituencyid}+${data.gender}+${data.regionalconstituncy}+${data.type}+${data.politicalpartyid}`)
            const res = await response.json()
            setCandidates(res.results)
            prepareXL(res.results)
            console.log(res.results)
            setTotalPage(res.count)
            setNext(res.next)
            setBack(res.back)
            setLoading(false)
            
        } catch (error) {
            console.log(error)
        }
    }
    const prepareXL = (data) =>{
        let obj = {}
        var cand = []
        data.map((candidates, index) =>{
            obj = {
                region: candidates.region,
                constituency: candidates.constituency,
                regional_constituency: candidates.rcconstituency,
                disability: candidates.disability,
                politicalparty: candidates.party,
                address: candidates.address,
                gender: candidates.gender,
                address: candidates.address
            }
            cand.push(obj)
        })
        console.log('data is ', cand)
        setXL(cand)
        
    }
    const ExportCSV = ({csvData, fileName}) => {
        
    
        const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
        const fileExtension = '.xlsx';
    
        const exportToCSV = (csvData, fileName) => {
            const ws = XLSX.utils.json_to_sheet(csvData);
            const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
            const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
            const data = new Blob([excelBuffer], {type: fileType});
            FileSaver.saveAs(data, fileName + fileExtension);
        }
            
        
    
        return (
            <button style={{fontSize: 12, backgroundColor: '#007bff', borderWidth: 0, marginLeft: 10, color: 'white', width: 100}}  onClick={(e) => exportToCSV(csvData,fileName)}>Excel</button>
        )
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
            title: 'Region',
            dataIndex: 'region',
            key: 'region',
            width: '20%',
        },    
        {
            title: 'Constituency',
            dataIndex: 'constituency',
            key: 'constituency',
            width: '20%',
        },        
        {
            title: 'Regional Constituncy',
            dataIndex: 'rcconstituency',
            key: 'rcconstituency',
            width: '20%',
        },        
        {
            title: 'Party',
            dataIndex: 'party',
            key: 'party',
            width: '14%',
        },
        {
            title: 'Full Name',
            dataIndex: 'fullname',
            key: 'fullname',
            width: '20%',
            ...getColumnSearchProps('fullname')
        },
        {
            title: 'Gender',
            dataIndex: 'gender',
            key: 'gender',
            width: '10%',
        },
    



    ];
    const onPageChange = (page, pageSize) =>{
        setLoading(true)
        let data = {pageSize: pageSize, offset: page*pageSize,constituencyid: constituencyid,region: regionid, type: electiontype, gender: genders,type: type,  regionalconstituncy: rconstid, politicalpartyid: politicalpartyid, disability: disability}

        apiGetter(data)
        setCurrentPage(page)
    }
    const onSizetoShowChange = (current, size) =>{
        let data = {pageSize: size, offset: 0,constituencyid: constituencyid,region: regionid, type: electiontype, gender: genders,type: type,  regionalconstituncy: rconstid, politicalpartyid: politicalpartyid, disability: disability}
        setPagesizes(size)
        apiGetter(data)
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
    const onChangeDis = e =>{
        let data = {pageSize: 0, offset: 0,constituencyid: constituencyid,region: regionid, gender: genders,type: e,  regionalconstituncy: rconstid, politicalpartyid: politicalpartyid, disability: e}
        setDisability(e)
       apiGetter(data)
    }
    const onChangeConst = e => {
        let data = {pageSize: 0, offset: 0,constituencyid: constituencyid,region: regionid, gender: genders,type: e.target.value,  regionalconstituncy: rconstid, politicalpartyid: politicalpartyid, disability: disability}
       setType(e.target.value)
       setElectionType(e.target.value)
       apiGetter(data)
       getRConstituency(regionid)

      };

    const onSelectConstId = (value) =>{
        let data = {pageSize: 0, offset: 0,constituencyid: value,region: regionid, type: 'hopr_max', gender: genders,type: type,  regionalconstituncy: rconstid, politicalpartyid: politicalpartyid, disability: disability}
        apiGetter(data)
        setConstituencyid(value)
        getRConstituency(regionid)
        
    }

    const onSelectParty = (value) =>{
        let data = {pageSize: 0, offset: 0,constituencyid: constituencyid,region: regionid, type: electiontype, gender: genders,type: type,  regionalconstituncy: rconstid, politicalpartyid: value, disability: disability}
        apiGetter(data)
        setPoliticalpartyId(value)
    }
    const onSelectRConstID = (value) =>{
        let data = {pageSize: 0, offset: 0,constituencyid: constituencyid,region: regionid, type: 'hopr_max', gender: genders,type: type,  regionalconstituncy: value, politicalpartyid: politicalpartyid, disability: disability}
        apiGetter(data)
        setRConstId(value)
    }
    const onGenderChange = (value) =>{
        setGender(value)
        let data = {pageSize: 0, offset: 0,constituencyid: constituencyid,region: regionid, type: 'hopr_max', gender: value,type: type,  regionalconstituncy: '', politicalpartyid: politicalpartyid, disability: disability}
        apiGetter(data)
    }
    const onSelectRegion = (value) =>{
        setRegionid(value)
        let data = {pageSize: 0, offset: 0,constituencyid: constituencyid,region: value, type: electiontype, gender: genders,type: type,  regionalconstituncy: '', politicalpartyid: politicalpartyid, disability: disability}
        apiGetter(data)
        getConstituency(value)
        getRConstituency(value)

    }


    useEffect(() =>{
        let data = {pageSize: pageSizes, offset: offset,constituencyid: '',region: '', type: '', gender: '', regionalconstituncy: '', politicalpartyid: '',  disability: 3}
        apiGetter(data)
        getParty()
        
    }, [pageSizes])
    return (
        <div>
            <div>
                <div style={{ display: 'flex', flexDirection: 'row', color: '#1de9b6', padding: 5 }}>
                    <p style={{ marginRight: 20 }}>Election Type</p>
                    <Radio.Group onChange={onChangeConst} buttonStyle="solid">
                        <Radio value={1}>HOPR</Radio>
                        <Radio value={2}>RC</Radio>
                    </Radio.Group>
                </div>
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        width: '50%',
                        marginBottom: 30,
                        marginTop: 20
                    }}
                >
                    <Select
                        style={{ width: 200, marginRight: 20 }}
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
                        style={{ width: 200, marginRight: 20 }}
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
                    {electiontype == 2  ? 
                    <Select
                        showSearch
                        style={{ width: 200,  marginRight: 20 }}
                        placeholder="Regional Constituency"
                        optionFilterProp="children"
                        onChange={onSelectRConstID}
                        filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                        filterSort={(optionA, optionB) => optionA.children.toLowerCase().localeCompare(optionB.children.toLowerCase())}
                    >
                        {regionalconstituncy.map((item, index) =>(
                            <Option key={index} value={item.regionalconstituencyid}>{item.regionalconstituencyname}</Option>
                        ))}
                    </Select> : <Select
                        showSearch
                        disabled
                        style={{ width: 200,  marginRight: 20 }}
                        placeholder="Regional Constituency"
                        optionFilterProp="children"
                        onChange={onSelectConstId}
                        filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                        filterSort={(optionA, optionB) => optionA.children.toLowerCase().localeCompare(optionB.children.toLowerCase())}
                    >
                        {constituency.map((item, index) =>(
                            <Option key={index} value={item.constituencyid}>{item.constituencyname}</Option>
                        ))}
                    </Select>}
                    <Select
                        showSearch
                        style={{ width: 200,  marginRight: 20 }}
                        placeholder="Political Party"
                        optionFilterProp="children"
                        onChange={onSelectParty}
                        filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                        filterSort={(optionA, optionB) => optionA.children.toLowerCase().localeCompare(optionB.children.toLowerCase())}
                    >
                        {politicalparty.map((item, index) =>(
                            <Option key={index} value={item.politicalpartyid}>{item.politicalpartyname}</Option>
                        ))}
                    </Select>

                    <Select
                        style={{ width: 200,  marginRight: 20 }}
                        onChange={onGenderChange}
                        placeholder="Gender"
                    >
                        <Option value="MALE">MALE</Option>
                        <Option value="FEMALE">FEMALE</Option>
                    </Select>
                    <Select
                        style={{ width: 200,  marginRight: 100 }}
                        onChange={onChangeDis}
                        placeholder="Disability"
                    >
                        <Option value={1}>Disabled</Option>
                        <Option value={0}>Not disabled</Option>
                    </Select>
                    <button style={{fontSize: 12, backgroundColor: '#007bff', borderWidth: 0, marginLeft: 10, color: 'white'}} onClick={handlePrint}>Print</button>
                    <ExportCSV csvData={cand_to_xl} fileName="candidates" />

                </div>
            </div>

            <Table ref={componentRef} loading={loading} pagination={{ position: [], pageSize: pageSizes }} style={{ marginTop: 10 }} columns={columns} dataSource={candidates} />
            <br />
            <Pagination onChange={onPageChange} onShowSizeChange={onSizetoShowChange} defaultCurrent={1} current={currentPage} total={totalPage} itemRender={itemRender}/>
        </div>
    );
}
