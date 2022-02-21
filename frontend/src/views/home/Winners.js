import React, { useEffect, useState, useRef } from 'react';
import { Table, Select, Input, Button, Space, Radio, Pagination } from 'antd';
import Highlighter from 'react-highlight-words';
import { API_SERVER1 } from './../../config/constant';
import { useReactToPrint } from 'react-to-print';
import { SearchOutlined } from '@ant-design/icons';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';


const { Option } = Select;

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


export default function Winners() {
    const [searchText, setSearchText] = useState();
    const [searchedColumn, setSearchedColumn] = useState('');
    var [searchInput, setSearchInput] = useState('');
    var [loading, setLoading] = useState(false)
    let [politicalpartyid, setPoliticalpartyId] = useState('')
    var [next, setNext] = useState('')
    var [back, setBack] = useState('')
    var [totalPage, setTotalPage] = useState(0)
    var [currentPage, setCurrentPage] = useState(1)
    var [pageSizes, setPagesizes] = useState(10)
    var [offset, setOffset] = useState(10)
    let [constituencyid, setConstituencyid] = useState('')
    let [genders, setGender] = useState('')
    let [regionid, setRegionid] = useState('')
    let [url, setUrl] = useState('hopr_max')
    let [type, setType] = useState('')
    let [rconstid, setRConstId] = useState('')
    let [disability, setDisability] = useState(3)
    const [cand_to_xl, setXL] = useState([])
    const [regionalconstituncy, setRegionalConstituency] = useState([])
    let [electiontype, setElectionType] = useState('hopr_max')
    const [politicalparty, setPoliticalparty] = useState([])
    const [candidates, setCandidates] = useState([])
    const [constituency, setConstituency] = useState([])
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
            const response = await fetch(API_SERVER1+`data/read/${data.type}/${data.disability}/?limit=${data.pageSize}&offset=${data.offset}&search=${data.region}+${data.constituencyid}+${data.gender}+${data.politicalpartyid}`)
            const res = await response.json()
            setCandidates(res.results)
            prepareXL(res.results)
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

    const prepareXL = (data) =>{
        let obj = {}
        var cand = []
        console.log('data is', data)
        data.map((candidates, index) =>{
            console.log('view', candidates)
            // obj = {
            //     region: candidates.result.general.region.regionname,
            //     // constituency: candidates.result.general.hoprconstituency.constituencyname,
            //     // regional_constituency: candidates.result.regionalconstituencyid.regionalconstituencyname,
            //     disability: candidates.result.candidate.disability,
            //     politicalparty: candidates.result.party.politicalpartyname,
            //     address: candidates.result.candidate.addressid,
            //     gender: candidates.result.candidate.gender,
                
            // }
            if(candidates.result.candidate.electionid.electionid == 1){
                obj = {
                    region: candidates.result.general.region.regionname,
                    constituency: candidates.result.general.hoprconstituency.constituencyname,
                    // regional_constituency: candidates.result.regionalconstituencyid.regionalconstituencyname,
                    disability: candidates.result.candidate.disability,
                    politicalparty: candidates.result.party.politicalpartyname,
                    address: candidates.result.candidate.addressid,
                    gender: candidates.result.candidate.gender,
                    
                }
            } else if (candidates.result.candidate.electionid.electionid == 2){
                obj = {
                    region: candidates.result.general.region.regionname,
                    // constituency: candidates.result.general.hoprconstituency.constituencyname,
                    regional_constituency: candidates.result.regionalconstituencyid.regionalconstituencyname,
                    disability: candidates.result.candidate.disability,
                    politicalparty: candidates.result.party.politicalpartyname,
                    address: candidates.result.candidate.addressid,
                    gender: candidates.result.candidate.gender,
                    
                }
            }
            cand.push(obj)
        })
        console.log('data is ', cand)
        setXL(cand)
        
    }

   
    const columns = [
        {
            title: 'Full Name',
            dataIndex: 'result',
            key: 'result',
            width: '20%',
            render: (text, record) => (
                <div size="middle">
                  {text.candidate.fullname}
                </div>
              ),
        },
        {
            title: 'Gender',
            dataIndex: 'result',
            key: 'result',
            width: '10%',
            render: (text, record) => (
                <div size="middle">
                  {text.candidate.gender}
                </div>
              ),
        },
        {
            title: 'Constituency',
            dataIndex: 'result',
            key: 'result',
            width: '20%',
            render: (text, record) => (
                <div size="middle">
                  {text.candidate.constituencyid.constituencyname}
                </div>
              ),
        },
        {
            title: 'Regional Constituncy',
            dataIndex: 'result',
            key: 'result',
            width: '20%',
            render: (text, record) => (
                <div size="middle">
                  {text.candidate.regionalconstituencyid ? <div>{text.candidate.regionalconstituencyid.regionalconstituencyname}</div> : null}
                </div>
              ),
        },
        {
            title: 'Party',
            dataIndex: 'result',
            key: 'result',
            width: '14%',
            render: (text, record) => (
                <div size="middle">
                  {text.party.politicalpartyname}
                </div>
              ),
        
        },
        {
            title: 'Region',
            dataIndex: 'result',
            key: 'result',
            width: '20%',
            render: (text, record) => (
                <div size="middle">
                  {text.general.region.regionname}
                </div>
              ),

        }
    ];
    const onPageChange = (page, pageSize) =>{
        setLoading(true)
        let data = {pageSize: pageSize, offset: page*pageSize,constituencyid: constituencyid,region: regionid,gender: genders,  type: electiontype, regionalconstituncy: rconstid, politicalpartyid: politicalpartyid, disability: disability}
        apiGetter(data)
        setCurrentPage(page)
    }
    const onSizetoShowChange = (current, size) =>{
        console.log(current, size)
        let data = {pageSize: size, offset: 0,constituencyid: constituencyid,region: regionid, gender: genders, type: electiontype, regionalconstituncy: rconstid, politicalpartyid: politicalpartyid, disability: disability}
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

    const onChangeConst = e => {
       setType(e.target.value)
       console.log(e.target.value)
       if (e.target.value == 1){
           console.log(url)
           let data = {pageSize: 0, offset: 0,constituencyid: constituencyid,region: regionid, gender: genders, type: 'hopr_max', regionalconstituncy: rconstid, politicalpartyid: politicalpartyid, disability: disability}
           apiGetter(data)
        setUrl('hopr_max')
       } else if (e.target.value == 2){
           setElectionType('rc_max')
           let data = {pageSize: 0, offset: 0,constituencyid: constituencyid,region: regionid, gender: genders, type: 'rc_max', regionalconstituncy: rconstid, politicalpartyid: politicalpartyid, disability: disability}
           apiGetter(data)
       }

       

      };
      const onSelectRConstID = (value) =>{
        let data = {pageSize: 0, offset: 0,constituencyid: constituencyid,region: regionid, type: electiontype, gender: genders,type: type,  regionalconstituncy: value, politicalpartyid: politicalpartyid, disability: disability}
        apiGetter(data)
        setRConstId(value)
    }

    const onSelectConstId = (value) =>{
        let data = {pageSize: 0, offset: 0,constituencyid: value,region: regionid, gender: genders,  type: electiontype, regionalconstituncy: '', politicalpartyid: politicalpartyid, disability: disability}
        apiGetter(data)
        setConstituencyid(value)
    }
    const onGenderChange = (value) =>{
        setGender(value)
        let data = {pageSize: 0, offset: 0,constituencyid: constituencyid,region: regionid, gender: value,  type: electiontype, regionalconstituncy: rconstid, politicalpartyid: politicalpartyid, disability: disability}
        apiGetter(data)
    }
    const onSelectParty = (value) =>{
        let data = {pageSize: 0, offset: 0,constituencyid: constituencyid,region: regionid, type: electiontype, gender: genders,  regionalconstituncy: rconstid, politicalpartyid: value, disability: disability}
        apiGetter(data)
        setPoliticalpartyId(value)
    }
    const onSelectRegion = (value) =>{
 
        setRegionid(value)
        let data = {pageSize: 0, offset: 0,constituencyid: constituencyid,region: value, type: electiontype, gender: genders, regionalconstituncy: rconstid, politicalpartyid: value, disability: disability}
        apiGetter(data)
        getConstituency(value)
        getRConstituency(value)

    }
    const onChangeDis = e =>{
        let data = {pageSize: 0, offset: 0,constituencyid: constituencyid,region: regionid, gender: genders,type: electiontype,  regionalconstituncy: rconstid, politicalpartyid: politicalpartyid, disability: e}
        setDisability(e)
       apiGetter(data)
    }

    useEffect(() =>{
        let data = {pageSize: 0, offset: 0,constituencyid: '',region: '', type: 'hopr_max', gender: '', regionalconstituncy: '',  politicalpartyid: '', disability: 3}
        apiGetter(data)
        getConstituency('')
        getRConstituency('')
        getParty()
    }, [pageSizes])
    return (
        <div>
            <div style={{ display: 'flex', flexDirection: 'row', color: '#1de9b6', padding: 5 }}>
                <p style={{ marginRight: 20 }}>Election Type</p>
                <Radio.Group defaultValue={1} onChange={onChangeConst} buttonStyle="solid">
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
                    {electiontype == 2  ? 
                    <Select
                        showSearch
                        style={{ width: 200 }}
                        placeholder="Regional Constituency"
                        optionFilterProp="children"
                        onChange={onSelectRConstID}
                        filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                        filterSort={(optionA, optionB) => optionA.children.toLowerCase().localeCompare(optionB.children.toLowerCase())}
                    >
                        {regionalconstituncy.map((item, index) =>(
                            <Option key={index} value={item.regionalconstituencyid}>{item.regionalconstituencyname}</Option>
                        ))}
                    </Select> : null}
                    <Select
                        showSearch
                        style={{ width: 200, marginLeft: 10 }}
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
                        style={{ width: 200 }}
                        onChange={onGenderChange}
                        placeholder="Gender"
                    >
                        <Option value="MALE">MALE</Option>
                        <Option value="FEMALE">FEMALE</Option>
                    </Select>
                    <Select
                        style={{ width: 200 }}
                        onChange={onChangeDis}
                        placeholder="Disability"
                    >
                        <Option value={1}>Disabled</Option>
                        <Option value={0}>Not disabled</Option>
                    </Select>
                    <button style={{fontSize: 12, backgroundColor: '#007bff', borderWidth: 0, marginLeft: 10, color: 'white'}} onClick={handlePrint}>Print</button>
                    <ExportCSV csvData={cand_to_xl} fileName="candidates" />
            </div>
            <Table ref={componentRef} loading={loading} pagination={{ position: [], pageSize: pageSizes }} style={{ marginTop: 10 }} columns={columns} dataSource={candidates} />
            <br/>
            <Pagination onChange={onPageChange} onShowSizeChange={onSizetoShowChange} defaultCurrent={1} current={currentPage} total={totalPage} itemRender={itemRender}/>
        </div>
    );
}
