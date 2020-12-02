#University of seoul
#Computer Science
#Seok yong, Choi

#Capstone-ECOS API -922
#coding by utf-8

import requests
#XML을 객체화
import xml.etree.ElementTree as ET
import mysql.connector

## Key Value
key = "LW4UBN63KKAR7WW01INC"

##For DATABASE CONNECTION##
mydb = mysql.connector.connect(
    host = "localhost",
    user = "root",
    password = "selab",
    database = "Capstone",
    charset = 'utf8'
)

##객체 For mydb
mycursor = mydb.cursor()
query = "INSERT INTO bond_30_year (DAYS, BOND_RATE, ITEMNAME) VALUES (%s, %s, %s)"

####################################################################
## 국고채 1년 스프레드
url ="http://ecos.bok.or.kr/api/StatisticSearch/"+ key +"/xml/kr/1/10000/060Y001/DD/201801/202101/010230000"
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
            mycursor.execute('truncate bond_30_year')
            iterElement = ecosRoot.iter(tag="row")
            for element in iterElement:
                value = []  # 각 값을 집어 넣을 리스트형은 []로
                value.append(element.find("TIME").text)
                value.append(element.find("DATA_VALUE").text)
                value.append(element.find("ITEM_CODE1").text)

                val = (value[0], value[1], value[2])
                mycursor.execute(query, val)
                value.clear()
                mydb.commit()

                print(mycursor.rowcount, "record inserted")

    except Exception as e:
        print(str(e))

