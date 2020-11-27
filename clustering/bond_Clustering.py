import pandas as pd
import numpy as np
import csv
import mysql.connector
import math
import matplotlib.pyplot as plt

## K-means Clustering

#변동성
def volatility(arr):
    arr = arr[-252:]
    #print(arr)
    vol = np.var(arr) * np.sqrt(252) * 100
    return vol


#이익률
def profit(arr):
    arr = arr[-252:]
    pft = np.mean(arr)
    return pft

#위험도 (신한금융투자)
def danger(itemcode):
    if itemcode < 10230000:
        return "5등급"
    elif itemcode <10300001:
        return "4등급"
    elif itemcode < 10320001:
        return "3등급"
    else:
        return "등급외"

print(danger(10300000))
print(danger(10))

#DataBase Connect
db = mysql.connector.connect(
    user = 'root',
    password = 'tjrdyd12',
    host = 'localhost',
    db = 'hedge',
    charset = 'utf8'
);

cursor = db.cursor()
query_1 = 'select * from bond_1_year'
query_3 = 'select * from bond_3_year'
query_5 = 'select * from bond_5_year'
query_10 = 'select * from bond_10_year'
query_30 = 'select * from bond_30_year'
query_aa = 'select * from bond_aa_credit'
query_bbb = 'select * from bond_bbb_credit'

cursor.execute(query_1)
result = cursor.fetchall()

df = pd.DataFrame(data=result, columns= ["idx","날짜", "금리", "상품코드"])

### 3 Year
cursor.execute(query_3)
result = cursor.fetchall()

df_tmp = pd.DataFrame(data=result, columns=["idx","날짜", "금리", "상품코드"])
df = df.append(df_tmp)

### 5 year
cursor.execute(query_5)
result = cursor.fetchall()

df_tmp = pd.DataFrame(data=result, columns=["idx","날짜", "금리", "상품코드"])
df = df.append(df_tmp)

### 10 year
cursor.execute(query_10)
result = cursor.fetchall()

df_tmp = pd.DataFrame(data= result, columns=["idx","날짜", "금리", "상품코드"])
df = df.append(df_tmp)

## 30 year
cursor.execute(query_30)
result = cursor.fetchall()

df_tmp = pd.DataFrame(data=result, columns=["idx","날짜", "금리", "상품코드"])
df = df.append(df_tmp)

## AA Creidt
cursor.execute(query_aa)
result = cursor.fetchall()

df_tmp = pd.DataFrame(data=result, columns=["idx","날짜", "금리", "상품코드"])
df = df.append(df_tmp)

## BBB Credit
cursor.execute(query_bbb)
result = cursor.fetchall()

df_tmp = pd.DataFrame(data=result, columns=["idx","날짜", "금리", "상품코드"])
df = df.append(df_tmp)
# index Columns 삭제
del(df["idx"])


# Code for API
code_1 = 10190000
code_3 = 10200000
code_5 = 10200001
code_10 = 10210000
code_30 = 10230000
code_aa = 10300000
code_bbb =10320000

#회사채 상품 클러스터링
def bond_refine():
    column=["상품명", "수익률", "위험도", "변동성"]
    df_bond = pd.DataFrame(columns=column)

    bond_tmp_1=[]
    bond_tmp_3=[]
    bond_tmp_5=[]
    bond_tmp_10=[]
    bond_tmp_30=[]
    bond_aa=[]
    bond_bbb=[]

    for idx, row in df.iterrows():
        #bond_1_credit

        if row[2] == code_1:
            bond_tmp_1.append(row[1])

        elif row[2]== code_3:
            bond_tmp_3.append(row[1])

        elif row[2]== code_5:
            bond_tmp_5.append(row[1])

        elif row[2]== code_10:
            bond_tmp_10.append(row[1])

        elif row[2]== code_30:
            bond_tmp_30.append(row[1])

        elif row[2] == code_aa:
            bond_aa.append(row[1])

        elif row[2] == code_bbb:
            bond_bbb.append(row[1])

    df_bond = df_bond.append({"상품명" : "국채 1년물", "수익률" : profit(bond_tmp_1),
                                 "위험도" : danger(code_1), "변동성" : volatility(bond_tmp_1)}, ignore_index=True)
    df_bond = df_bond.append({"상품명": "국채 3년물", "수익률": profit(bond_tmp_3),
                              "위험도": danger(code_3), "변동성": volatility(bond_tmp_3)}, ignore_index=True)
    df_bond = df_bond.append({"상품명": "국채 5년물", "수익률": profit(bond_tmp_5),
                              "위험도": danger(code_5), "변동성": volatility(bond_tmp_5)}, ignore_index=True)
    df_bond = df_bond.append({"상품명": "국채 10년물", "수익률": profit(bond_tmp_10),
                              "위험도": danger(code_10), "변동성": volatility(bond_tmp_10)}, ignore_index=True)
    df_bond = df_bond.append({"상품명": "국채 30년물", "수익률": profit(bond_tmp_30),
                              "위험도": danger(code_30), "변동성": volatility(bond_tmp_30)}, ignore_index=True)
    df_bond = df_bond.append({"상품명": "회사채 AA-", "수익률": profit(bond_bbb),
                              "위험도": danger(code_aa), "변동성": volatility(bond_bbb)}, ignore_index=True)
    df_bond = df_bond.append({"상품명": "회사채 BBB-", "수익률": profit(bond_bbb),
                              "위험도": danger(code_bbb), "변동성": volatility(bond_bbb)}, ignore_index=True)

    print(df_bond)

ret = bond_refine()

plt.scatter()
