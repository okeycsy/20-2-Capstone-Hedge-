import requests
import zipfile
import xml.etree.ElementTree as ET

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

# 기업 고유번호 XML 파일 파싱
def read_corp_code():
    name_corp_code = "CORPCODE.XML"
    tree_corp = ET.parse(name_corp_code)
    root_corp = tree_corp.getroot()

    for branch in root_corp:
        for b in branch:
            print(b.tag, b.text)


#download_corp_code(api_key)
#read_corp_code()


# Open DART API 이용, 배당에 관한 사항 다운로드(xml)
def download_dividend(crtfc_key, corp_code, bsns_year, reprt_code):
    api_url = "https://opendart.fss.or.kr/api/alotMatter.xml"
    request_url = (api_url + '?crtfc_key=' + crtfc_key + '&corp_code=' +
                   corp_code + '&bsns_year=' + bsns_year + '&reprt_code=' + reprt_code)
    #print(request_url)
    name_dividend = 'dividend.xml'
    content_dividend = requests.get(request_url).content
    file_dividend = open(name_dividend, 'wb')
    file_dividend.write(content_dividend)
    file_dividend.close()

    #print(text_dividend)

    tree_dividend = ET.parse(name_dividend)
    root_dividend = tree_dividend.getroot()

    for branch in root_dividend:
        for b in branch:
            print(b.tag, b.text)

# 배당에 관한 사항 API 요청인자
# crtf_key : API 인증키 - 발급받은 인증키(40자리)
# corp_code : 고유번호 - 공시대상회사의 고유번호(8자리)
# bsns_year : 사업연도 - 사업연도(4자리) (2015 이후 부터 정보제공)
# reprt_code : 보고서 코드 - 1분기 보고서 : 11013
#                            반기보고서 : 11012
#                            3분기 보고서 : 11014
#                            사업보고서 : 11011

# 삼전 2018 사업보고서
download_dividend(api_key, '00126380', '2018', '11011')
