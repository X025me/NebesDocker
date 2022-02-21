import React, {useEffect, useState} from 'react';
import { Table, Tag, Space } from 'antd';
import { Button } from 'react-bootstrap';
import { API_SERVER1 } from '../../../config/constant';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';


export default function ResultTable() {
    const [language, setLanguage] = useState(false)
    const [result, setResult] = useState([])
    const [loading, setLoading] = useState(false)
    const [cand_to_xl, setXL] = useState([])


    const prepareXL = (data) =>{
        let obj = {}
        var cand = []
        data.map((item, index) =>{
            obj = {
                'ተ.ቁ': index,
                'ምርጫው የተካሄደበት ክልል/ከተማ መስተዳድር': item.region,
                'የተመዘገቡ መራጮች ቁጥር': item.no_registerd_voters_hopr,
                'ከተመዘገቡ መራጮች መካከል ድምፅ የሰጡ በመቶኛ':item.no_votes_hopr,
                'ክልሉ ያለው የተወካዮች ምክር ቤት መቀመጫ ብዛት':item.no_of_hopr_seat,
                'ክልሉ ያለው የክልል ምክር ቤት መቀመጫ ብዛት':item.no_of_rc_seat,
                'መስከረም 20 ቀን ምርጫ የተከናወነበት የተወካዮች ምክር ቤት ምርጫ ክልል ብዛት':item.no_of_sept20_rc,
                'ለተወካዮች ምክር ቤት መቀመጫ ያገኙ ፓርቲዎች እና የመቀመጫ ቁጥር': item.hopr_win_party,
                'ድጋሚ ቆጠራ የሚከናወንበት ምርጫ ክልል ብዛት': item.re_count_rc,
                'ድጋሚ ምርጫ የሚከናወንበት ምርጫ ክልል ብዛት':item.re_election_rc,
                'መስከረም 20 ቀን ምርጫ የተከናወነበት የክልል ምክር ቤት ምርጫ ክልል ብዛት': 0,
                'በሁለቱም ምርጫ አይነቶች ምርመራ ላይ ያሉ ምርጫ ክልሎች ብዛት':0

                
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
            <Button onClick={(e) => exportToCSV(csvData,fileName)}>Generate XL</Button>
        )
    }

    const getResults = async() =>{
        setLoading(true)
        try {
            const response = await fetch(API_SERVER1+`data/read/result_anouncement/`)
            const res = await response.json()
            setResult(res.slice(1,))
            prepareXL(res.slice(1,))
            setLoading(false)
            
        } catch (error) {
            console.log(error)
        }
    }
    const columns = [
        {
          title: <p style={{fontSize: 12, color: '#1dc4e9'}}>{language ? 'ተ.ቁ' : 'no'}</p>,
          dataIndex: 'id',
          key: 'id',
          // render: text => <a>{text}</a>,
        },
        {
          title: <p style={{fontSize: 12, color: '#1dc4e9'}}>{language ? 'ምርጫው የተካሄደበት ክልል/ከተማ መስተዳድር' : 'Region'}</p>,
          dataIndex: 'region',
          key: 'region',
        },
        {
          title: <p style={{fontSize: 12, color: '#1dc4e9'}}>{language ? 'የተመዘገቡ መራጮች ቁጥር' : 'Number of Registered Voters'}</p>,
          dataIndex: 'no_registerd_voters_hopr',
          key: 'no_registerd_voters_hopr',
        },
      
        {
          title: <p style={{fontSize: 12, color: '#1dc4e9'}}>{language ? 'ከተመዘገቡ መራጮች መካከል ድምፅ የሰጡ በመቶኛ' : 'Number of Voted Voters from Registerd Voters in %'}</p>,
          key: 'no_votes_hopr',
          dataIndex: 'no_votes_hopr',
        },  
        {
          title: <p style={{fontSize: 12, color: '#1dc4e9'}}>{language ? 'ክልሉ ያለው የተወካዮች ምክር ቤት መቀመጫ ብዛት': 'Number of HOPR seats in The Region'}</p>,
          dataIndex: 'no_of_hopr_seat',
          key: 'no_of_hopr_seat',
        },
        {
            title: <p style={{fontSize: 12, color: '#1dc4e9'}}>{language ? 'ክልሉ ያለው የክልል ምክር ቤት መቀመጫ ብዛት' : 'Number of seats in the Regional Counsel'}</p>, 
            dataIndex: 'no_of_rc_seat',
            key: 'no_of_rc_seat'
        },
        {
          title: <p style={{fontSize: 12, color: '#1dc4e9'}}>{language ? 'መስከረም 20 ቀን ምርጫ የተከናወነበት የተወካዮች ምክር ቤት ምርጫ ክልል ብዛት': 'Number of constituencies in which the September 20 by-elections were held'}</p>, 
          dataIndex: 'no_of_sept20_rc',
          key: 'no_of_sept20_rc'
      },
      {
          title: <p style={{fontSize: 12, color: '#1dc4e9'}}>{language ? 'ለተወካዮች ምክር ቤት መቀመጫ ያገኙ ፓርቲዎች እና የመቀመጫ ቁጥር' : 'The number of parties that have won seats in the House of Representatives and the number of seats'}</p>, 
          dataIndex: 'hopr_win_party',
          key: 'hopr_win_party',
          render: tags => (
            <>
              {tags.map(tag => {
                let color = tag.length > 5 ? 'geekblue' : 'green';
                if (tag === 'loser') {
                  color = 'volcano';
                }
                return (
                  <Tag color={color}>
                    {tag.name} <p style={{color: 'red'}}> with {tag.seat} seat</p>
                  </Tag>
                );
              })}
            </>
          ),
      },
      {
          title: <p style={{fontSize: 12, color: '#1dc4e9'}}>{language ? 'ድጋሚ ቆጠራ የሚከናወንበት ምርጫ ክልል ብዛት' : 'Re-counting constituency number seat'}</p>,
          dataIndex: 're_count_rc',
          key: 're_count_rc'
      },
      {
          title: <p style={{fontSize: 12, color: '#1dc4e9'}}>{language ? 'ድጋሚ ምርጫ የሚከናወንበት ምርጫ ክልል ብዛት' : 'Number of Regional Constituency with re-election'}</p>,
          dataIndex: 're_election_rc',
          key: 're_election_rc'
      },
      {
          title: <p style={{fontSize: 12, color: '#1dc4e9'}}>{language ? 'መስከረም 20 ቀን ምርጫ የተከናወነበት የክልል ምክር ቤት ምርጫ ክልል ብዛት' : 'The number of constituencies where the September 20 elections were held'}</p>,
          dataIndex: 'address',
          key: 'address'
      },
      {
          title: <p style={{fontSize: 12, color: '#1dc4e9'}}>{language ? 'በሁለቱም ምርጫ አይነቶች ምርመራ ላይ ያሉ ምርጫ ክልሎች ብዛት': 'Number of constituencies under investigation in both types of elections'}</p>,
          dataIndex: 'address',
          key: 'address'
      },
      ];
      useEffect(() => getResults(),[])
  return (
  <div style={{marginTop: '5%'}}>
      {loading ? <Button disabled>Generate XL</Button> : <ExportCSV csvData={cand_to_xl} fileName="result announcement" />}
      
      <Button  onClick={() => setLanguage(!language)}>{language ? 'English': 'Amharic'}</Button>
      <Table pagination={{ position: [], pageSize: result.length }} size='larg' columns={columns} dataSource={result} loading={loading}/>
  </div>
  );
}
