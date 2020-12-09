import requests
import zipfile
import xml.etree.ElementTree as ET
import numpy as np
import pandas as pd
import time

# 배당에 관한 사항 저장
api_key = "e9ec2d8efa17f86f2bb20230037c6340b47ed902"

# Open DART API 이용, 기업 고유번호 파일 다운로드(xml)
def download_corp_code(crtfc_key):
    api_url = "https://opendart.fss.or.kr/api/corpCode.xml"
    request_url = api_url + '?crtfc_key=' + crtfc_key
    print('corp_code 요청 url ' + request_url)
    content_corp_code = requests.get(request_url).content

    name_corp_code_zip = "corp_code.zip"
    file_corp_code_zip = open(name_corp_code_zip, 'wb')
    file_corp_code_zip.write(content_corp_code)
    file_corp_code_zip.close()

    zipFile_corp_code = zipfile.ZipFile(name_corp_code_zip, 'r')
    zipFile_corp_code.extractall()
    zipFile_corp_code.close()

#download_corp_code(api_key)

# 상장기업의 고유번호 리스트 작성
def listed_company():
    name_corp_code = "CORPCODE.XML"
    tree_corp = ET.parse(name_corp_code)
    root_corp = tree_corp.getroot()

    listed_company_names_list = pd.read_csv("상장법인목록.csv")["회사명"].to_list()
    #print(listed_company_names)

    listed_company_corpcode_list = []
    for branch in root_corp:
        temp_corpcode = ""
        for b in branch:
            #print(b.tag, b.text)
            if b.tag == "corp_code":
                temp_corpcode = b.text
            if b.tag == "corp_name":
               if b.text in listed_company_names_list:
                    listed_company_corpcode_list.append(temp_corpcode)
    return listed_company_corpcode_list

# Open DART API 이용, 배당에 관한 사항 다운로드(xml)
def download_dividend(crtfc_key, corp_code, bsns_year, reprt_code):
    api_url = "https://opendart.fss.or.kr/api/alotMatter.xml"
    request_url = (api_url + '?crtfc_key=' + crtfc_key + '&corp_code=' +
                   corp_code + '&bsns_year=' + bsns_year + '&reprt_code=' + reprt_code)
    print(request_url)
    name_dividend = 'dividend.xml'
    content_dividend = requests.get(request_url).content
    file_dividend = open(name_dividend, 'wb')
    file_dividend.write(content_dividend)
    file_dividend.close()

    #print(text_dividend)

    tree_dividend = ET.parse(name_dividend)
    root_dividend = tree_dividend.getroot()
    
    time_divider = {"thstrm" : "당기", "frmtrm" : "전기", "lwfr" : "전전기"}
    result = []
    se_list = ['회사명']
    for branch in root_dividend:
        if branch.tag == "status":
            #print(branch.text)
            if branch.text == "013":
                print("no data")
                return False, result, se_list
            if branch.text == "020":
                print("초과")
                return False, result, se_list
        se_name = ""
        for b in branch:
            if b.tag == "corp_name" and len(result) == 0:
                result.append(b.text)
            elif b.tag == "se":
                se_name = b.text
            elif b.tag == "stock_knd":
                se_name = se_name + b.text
            elif se_name != "":
                iter = 1
                while (se_name + "(" + str(iter)+ ")" + time_divider[b.tag]) in se_list:
                    iter = iter + 1
                iter = "(" + str(iter) + ")"
                new_se = se_name + iter + time_divider[b.tag]
                result.append(b.text)
                se_list.append(new_se)

    df = pd.DataFrame(columns=se_list)
    df = df.append(pd.Series(result, index=se_list), ignore_index=True)
    if True in df.columns.duplicated():
        print(df.columns)
        print(df.values.tolist())
    return True, df, se_list
                



# 배당에 관한 사항 API 요청인자
# crtf_key : API 인증키 - 발급받은 인증키(40자리)
# corp_code : 고유번호 - 공시대상회사의 고유번호(8자리)
# bsns_year : 사업연도 - 사업연도(4자리) (2015 이후 부터 정보제공)
# reprt_code : 보고서 코드 - 1분기 보고서 : 11013
#                            반기보고서 : 11012
#                            3분기 보고서 : 11014
#                            사업보고서 : 11011

# 삼전 2018 사업보고서
#download_dividend(api_key, '00126380', '2018', '11011')

listed_company_list = listed_company()
print(len(listed_company_list))

dividend_info_columns = []
dividend_df = pd.DataFrame(columns = dividend_info_columns)
count = 0
limit = 500
for company in listed_company_list:
    count += 1
    #if count < 1005:
    #    continue
    print(count)
    #if count == limit:
    #    break
    time.sleep(2)

    for year in range(2019, 2020):
        result, dividend_info, se_list = download_dividend(api_key, company, str(year), '11011')
        for se in se_list:
            if se not in dividend_info_columns:
                dividend_info_columns.append(se)
        if result:
            dividend_df = pd.concat([dividend_info, dividend_df],ignore_index = True)

print(dividend_df)
dividend_df.to_csv("dividend.csv")