import numpy as np
import pandas as pd
import math

##예금상품 to CSV
def deposit_deposit():
    source_bank_deposit = pd.read_csv('예금적금/예금_은행.csv')
    source_sbank_deposit = pd.read_csv('예금적금/예금_저축은행.csv')

    columns = ['fin_prdt_cd', '은행명', '상품명', '만기', '금리종류', '금리', '최대금리']

    def parse(source, columns):
        df = pd.DataFrame(columns = columns)
        for _, row in source.iterrows():
            options = row['options']
            options = options[2:len(options) - 2]
            options = options.split('], [')
            for option in options:
               option = option.replace('\'', '')
               option = option.replace(',', '')
               option = option.split(' ')

               new_row = [row['fin_prdt_cd'], row['kor_co_nm'], row['fin_prdt_nm']]
               new_row = new_row + option
               new_row = new_row[:7]
           
               s = pd.Series(new_row, index = columns)
               df = df.append(s, ignore_index= True)

        return df
    
    # options 파싱
    df_bank_deposit = parse(source_bank_deposit, columns)
    df_sbank_deposit = parse(source_sbank_deposit, columns)

    source_bank_index = pd.read_csv('일반은행 주요통계.csv')
    source_sbank_index = pd.read_csv('저축은행 주요통계.csv')

    source_bank_index['위험도'] = 1.1**(10 - source_bank_index['BIS 비율']) * source_bank_index['고정이하여신비율']
    source_sbank_index['위험도'] = 1.1**(10 - source_sbank_index['BIS 비율']) * source_sbank_index['고정이하여신비율']

    df_bank_deposit = df_bank_deposit.merge(source_bank_index, how='left', on='은행명')
    df_sbank_deposit = df_sbank_deposit.merge(source_sbank_index, how='left', on='은행명')
    df_deposit = df_bank_deposit.append(df_sbank_deposit)

    return df_deposit


# main

df_deposit = deposit_deposit()
df_deposit = df_deposit.reset_index()

df_deposit.rename(columns = {'금리': '수익률'}, inplace = True)

df_deposit['상품유형'] = '예금'

columns = ['index', 'fin_prdt_cd', '상품명', '수익률', '위험도', '상품유형']

df = pd.DataFrame(columns = columns)
#df = df.append(df_dividend)
df = df.append(df_deposit)

df.drop(columns = df.columns[6:len(df.columns)], inplace = True)

print('idx,fin_prdt_cd,상품명,y,x')
for idx, row in df.iterrows():
    print(str(idx)+','+str(row["fin_prdt_cd"])+','+row["상품명"]+","+str(row["수익률"])+","+str(row["위험도"]))


df.to_csv('/home/selab/Desktop/chatbot/node/Capstone/Server/public/data_deposit.csv')
