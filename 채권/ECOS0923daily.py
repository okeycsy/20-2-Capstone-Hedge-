#University of seoul
#Computer Science
#Seok yong, Choi

#Capstone-ECOS API -922
#coding by utf-8

import requests
#XML을 객체화 하기 위함
import xml.etree.ElementTree as ET

## 호출 원하는 OPenAPI URL 정의
key = "LW4UBN63KKAR7WW01INC"

####################################################################
## 국고채 1년 스프레드
url ="http://ecos.bok.or.kr/api/StatisticSearch/"+ key +"/xml/kr/1/10000/060Y001/DD/201101/202001/010190000"
response = requests.get(url)

##response's status code = 200 -> normaly running
if response.status_code == 200:
    try:
        contents = response.text
        ##Text 형식으로 받아왔으므로 fromstring형식으로 넣는다
        ecosRoot = ET.fromstring(contents)

        if ecosRoot[0].text[:4] in ('INFO', 'ERRO'):
            print(ecosRoot[0].text + ":" + ecosRoot[1].text)

        else:
            print(contents)

    except Exception as e:
        print(str(e))


## 국고채 3년 스프레드
url1 = "http://ecos.bok.or.kr/api/StatisticSearch/" + key + "/xml/kr/1/10000/060Y001/DD/201101/202010/010200000"
response = requests.get(url1)

if response.status_code == 200:
    try:
        contents = response.text
        ecosRoot = ET.fromstring(contents)

        if ecosRoot[0].text[:4] in ('INFO', 'ERRO'):
            print(ecosRoot[0].text + ":" + ecosRoot[1].text)

        else:
            print(contents)

    except Exception as e:
        print(str(e))


## 국고채 5년 스프레드
url_5year_nationIndex = "http://ecos.bok.or.kr/api/StatisticSearch/" + key + "/xml/kr/1/10000/060Y001/DD/201101/202010/010200001"
response = requests.get(url_5year_nationIndex)

if response.status_code == 200:
    try:
        contents = response.text
        ecosRoot = ET.fromstring(contents)

        if ecosRoot[0].text[:4] in ('INFO', 'ERRO'):
            print(ecosRoot[0].text + ":" + ecosRoot[1].text)

        else:
            print(contents)

    except Exception as e:
        print(str(e))

# ------------------------------------단기채 끝 ----------------------------------------------"

##국고채 10년 스프레드
url_10year_nationIndex = "http://ecos.bok.or.kr/api/StatisticSearch/" + key + "/xml/kr/1/10000/060Y001/DD/201101/202010/010210000"
response = requests.get(url_10year_nationIndex)

if response.status_code == 200:
    try:
        contents = response.text
        ecosRoot = ET.fromstring(contents)

        if ecosRoot[0].text[:4] in ('INFO', 'ERRO'):
            print(ecosRoot[0].text +":" + ecosRoot[1].text)

        else:
            print(contents)

    except Exception as e:
        print(str(e))

##국고채 20년 스프레드
url_20year_nationIndex = "http://ecos.bok.or.kr/api/StatisticSearch/" + key + "/xml/kr/1/10000/060Y001/DD/201101/202010/010220000"
response = requests.get(url_20year_nationIndex)

if response.status_code == 200:
    try:
        contents = response.text
        ecosRoot = ET.fromstring(contents)

        if ecosRoot[0].text[:4] in ('INFO', 'ERRO'):
            print(ecosRoot[0].text +":" + ecosRoot[1].text)

        else:
            print(contents)

    except Exception as e:
        print(str(e))

##국고채 30년 스프레드
url_30year_nationIndex = "http://ecos.bok.or.kr/api/StatisticSearch/" + key + "/xml/kr/1/10000/060Y001/DD/201101/202010/010230000"
response = requests.get(url_30year_nationIndex)

if response.status_code == 200:
    try:
        contents = response.text
        ecosRoot = ET.fromstring(contents)

        if ecosRoot[0].text[:4] in ('INFO', 'ERRO'):
            print(ecosRoot[0].text +":" + ecosRoot[1].text)

        else:
            print(contents)

    except Exception as e:
        print(str(e))


##회사채 3년, AA Credit
url_AACredit = "http://ecos.bok.or.kr/api/StatisticSearch/" + key + "/xml/kr/1/10000/060Y001/DD/201101/202010/010300000"
response = requests.get(url_AACredit)

if response.status_code == 200:
    try:
        contents = response.text
        ecosRoot = ET.fromstring(contents)

        if ecosRoot[0].text[:4] in ('INFO','ERRO'):
            print(ecosRoot[0].text +":" + ecosRoot[1].text)

        else:
            print(contents)

    except Exception as e:
        print(str(e))

##회사채 3년, JunkBond Credit
url_JunkBondCredit = "http://ecos.bok.or.kr/api/StatisticSearch/" + key + "/xml/kr/1/10000/060Y001/DD/201101/202010/010320000"
response = requests.get(url_JunkBondCredit)

if response.status_code == 200:
    try:
        contents = response.text
        ecosRoot = ET.fromstring(contents)

        if ecosRoot[0].text[:4] in ('INFO', 'ERRO'):
            print(ecosRoot[0].text + ":" + ecosRoot[1].text)

        else:
            print(contents)

    except Exception as e:
        print(str(e))
