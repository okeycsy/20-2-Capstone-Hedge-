#University of seoul
#Computer Science
#Seok yong, Choi

#Capstone-ECOS API -922
#coding by utf-8

import requests
import xml.etree.ElementTree as ET

import json

if __name__ == "__main__":
    key = "LW4UBN63KKAR7WW01INC"

    #define URL
    url = "http://ecos.bok.or.kr/api/StatisticSearch/"+ key + "/xml/kr/1/10/010Y002/MM/201101/201101/AAAA11/";
    #정의하려는 OpenAPI Return값 가져온다
    response = requests.get(url)
    if response.status_code == 200:
        try:
            contents = response.text
            ecosRoot = ET.fromstring(contents)

            if ecosRoot[0].text[:4] in ('INFO','ERRO'):
                print(ecosRoot[0].text+" : "+ecosRoot[1].text)

            else :
                print(contents)

        except Exception as e:
            print(str(e))

