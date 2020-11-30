from bs4 import BeautifulSoup       
from urllib.request import urlopen  
import pandas as pd               
from html_table_parser import parser_functions as parser
import numpy as np
import datetime
import re

API_KEY = "f401e9325315e629e5de0bd5682dc3cbe97b7bc8"

def date_return():
    end_date = datetime.datetime.now()
    bgn_date = end_date-datetime.timedelta(days=10)
    
    bgn_date = bgn_date.strftime("%Y%m%d")
    end_date = end_date.strftime("%Y%m%d")
    return bgn_date, end_date

def searching_report() : 
    bgn_date, end_date= date_return()
    data = pd.DataFrame()
    for i in range (1,10):
        count = str(i)
        SEARCH_URL = "https://opendart.fss.or.kr/api/list.xml?crtfc_key="+API_KEY+"&bgn_de="+bgn_date+"&end_de="+end_date+"&pblntf_ty=C&pblntf_detail_ty=008&corp_cls=Y&page_no="+count+"&page_count=30"
        XML_RESULT = BeautifulSoup(urlopen(SEARCH_URL).read(), 'html.parser')

        page_data = pd.DataFrame()
        find_list = XML_RESULT.findAll("list")                    
        for t in find_list :
            name = t.report_nm.string
            if '투자설명서(일괄신고)' in name:
                temp = pd.DataFrame(([[t.corp_code.string, t.corp_name.string, t.report_nm.string,t.rcept_no.string, t.rcept_dt.string]]),
                columns = ["crp_cls", "crp_nm", "rpt_nm", "rcp_no", "rcp_dt"])
                page_data = pd.concat([page_data, temp])
        data = pd.concat([data, page_data])
        
    if len(data) < 1 :
        print("### Failed. (There's no report.)")
        return None

    data = data.reset_index(drop=True)
    data.drop_duplicates(["rcp_no"]) 
    return data

def fnc_table(rcp):
    rcp_no=rcp
    url="http://dart.fss.or.kr/dsaf001/main.do?rcpNo="+rcp_no
    page = BeautifulSoup(urlopen(url).read(), 'html.parser', from_encoding='utf-8')
    body = str(page.find('head'))
    body = body.split('【 본    문 】",')[1]
    body = body.split('cnt++')[0]
    body = body.split('viewDoc(')[1]
    body = body.split(')')[0]
    body = body.split(', ')
    body = [body[i][1:-1] for i in range(len(body))]
    
    url_final = 'http://dart.fss.or.kr/report/viewer.do?rcpNo=' + body[0] + '&dcmNo=' + body[1] + '&eleId=' + body[2] + '&offset=' + body[3] + '&length=' + body[4] + '&dtd=dart3.xsd'
    
    #print(url_final)
    
    data = pd.DataFrame()
    
    page = BeautifulSoup(urlopen(url_final).read(), 'html.parser')
    body = str(page).split('(2) 모집 또는 매출의 개요')[1]
    body = BeautifulSoup(body, 'html.parser')
    
    table1 = body.find_all("table")
    p = parser.make2d(table1[0])
    table1 = pd.DataFrame(p[0:], columns=["content", "content1", "내용"])
    
    table1=table1.convert_dtypes()
    table1.content = table1.content.str.replace('\s+','')
    #print(table1)
    
    table1['bool']=table1.iloc[:, 0].apply(lambda x: '종목명' in x or '기초자산' in x or '발행일' in x or '만기일' in x)
    table1=table1[table1['bool']==True]
    table1 = table1.reset_index(drop=True)
    
    #print(table1)
    
    pdct_nm=table1.loc[0, "내용"]
    pdct_nm=re.sub(r'\([^)]*\)', '', pdct_nm)
    pdct_asset=table1.loc[1, "내용"]
    st_date=table1.loc[2, "content1"]
    exp_date=table1.loc[3, "content1"]
    exp_date=re.sub(r'\([^)]*\)', '', exp_date)
    
    temp=pd.DataFrame(([[rcp_no, pdct_nm, pdct_asset, st_date, exp_date]]), columns=["문서번호", "상품명", "기초자산", "발행일", "만기일"])
    data=pd.concat([data, temp])
    
    body = str(page).split('최대이익액 및')[1]
    body = BeautifulSoup(body, 'html.parser')
    table2 = body.find_all("table")
    p = parser.make2d(table2[0])
    table2 = pd.DataFrame(p[0:], columns=["구분", "내용", "수익률"])
    table2['bool']=table2.iloc[:, 0].apply(lambda x: '최대손실액' in x or '최대이익액' in x or '최소이익액' in x)
    table2=table2[table2['bool']==True]
    
    loss_max=table2['구분']=='최대손실액'
    earn_min=table2['구분']=='최소이익액'
    
    min = table2[loss_max | earn_min]
    min = min.reset_index(drop=True)
    min_rate=min.loc[0, "수익률"]
    
    temp_max=table2['구분']=='최대이익액'
    max=table2[temp_max]
    max = max.reset_index(drop=True)
    max_rate=max.loc[0, "수익률"]
    
    earn_temp=pd.DataFrame(([[min_rate, max_rate]]), columns=["최소수익", "최대수익"])
    data=pd.concat([data, earn_temp], axis=1)

    return data

final_data =pd.DataFrame()
data=searching_report()
for rcp in list(data['rcp_no']):
    try:
        temp_data=fnc_table(rcp)
    except:
        continue
    else:
        final_data=pd.concat([final_data, temp_data], axis = 0)
    
final_data = final_data.reset_index(drop=True)
final_data.to_csv('./els_data.csv', index = False, encoding="utf-8-sig")


