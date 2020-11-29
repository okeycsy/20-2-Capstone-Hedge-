import numpy as np
import pandas as pd
import math

# 배당금 위험-수익률 데이터 생성
def dividend():
    divid = pd.read_csv('dividend_final.csv')
    stock_address = ('stocks_data/')
    
    columns = ['회사명', '수익률', '변동성']
    df = pd.DataFrame(columns = columns)

    for idx, row in divid.iterrows():
        try :
            stock = pd.read_csv(stock_address + row['회사명'] + '.csv')

            # 1개월 변동성 계산 -> 1년 변동성으로 변환
            danger = 0
            month = stock.tail(30)

            daily_profits = []
            daily_cost = stock.tail(31).iloc[0]['Close']
            for month_idx, month_row in month.iterrows():
                #danger += (month_row['High'] - month_row['Low']) / month_row['Close'] * 100
                daily_profits.append(math.log(month_row['Close'] / daily_cost))
                daily_cost = month_row['Close']
            volatility = np.std(daily_profits)
            volatility *= math.sqrt(252) * 100


            # 비용
            cost = stock.tail(1).iloc[0]['Close']
            profit = row['유형1 당기']
            rate = profit / cost * 100
            if rate > 30:
                return

            s = pd.Series([row['회사명'], rate, volatility], index = columns)

            # append
            df = df.append(s, ignore_index = True)
            
        except Exception as e:
            #print (e)
            continue

    df = df.dropna()
    df_valid = df[df['수익률'] != 0]
    df_valid = df_valid.reset_index()
    df_valid = df_valid.drop(axis = 1, columns = ['index'])
    #print(df_valid)
    return df_valid

# 예적금 위험-수익률 데이터 생성
def deposit():
    source_bank_deposit = pd.read_csv('예금적금/예금_은행.csv')
    source_sbank_deposit = pd.read_csv('예금적금/예금_저축은행.csv')
    source_bank_saving = pd.read_csv('예금적금/적금_은행.csv')
    source_sbank_saving = pd.read_csv('예금적금/적금_저축은행.csv')

    columns = ['은행명', '상품명', '만기', '금리종류', '금리', '최대금리']

    def parse(source, columns):
        df = pd.DataFrame(columns = columns)
        for idx, row in source.iterrows():
            options = row['options']
            options = options[2:len(options) - 2]
            options = options.split('], [')
            for option in options:
               option = option.replace('\'', '')
               option = option.replace(',', '')
               option = option.split(' ')

               new_row = [row['kor_co_nm'], row['fin_prdt_nm']]
               new_row = new_row + option
               new_row = new_row[:6]
           
               s = pd.Series(new_row, index = columns)
               df = df.append(s, ignore_index= True)

        return df
    
    # options 파싱
    df_bank_deposit = parse(source_bank_deposit, columns)
    df_sbank_deposit = parse(source_sbank_deposit, columns)

    df_bank_saving = parse(source_bank_saving, columns)
    df_sbank_saving = parse(source_sbank_saving, columns)
    #df_saving = df_bank_saving.append(df_sbank_saving)

    # 은행 BIS 자기자본비율, 고정이하여신비율 join
    source_bank_index = pd.read_csv('일반은행 주요통계.csv')
    source_sbank_index = pd.read_csv('저축은행 주요통계.csv')

    source_bank_index['위험도'] = 1.1**(10 - source_bank_index['BIS 비율']) * source_bank_index['고정이하여신비율']
    source_sbank_index['위험도'] = 1.1**(10 - source_sbank_index['BIS 비율']) * source_sbank_index['고정이하여신비율']

    df_bank_deposit = df_bank_deposit.merge(source_bank_index, how='left', on='은행명')
    df_sbank_deposit = df_sbank_deposit.merge(source_sbank_index, how='left', on='은행명')
    df_deposit = df_bank_deposit.append(df_sbank_deposit)
    #print(df_deposit)
    
    df_bank_saving = df_bank_saving.merge(source_bank_index, how='left', on='은행명')
    df_sbank_saving = df_sbank_saving.merge(source_sbank_index, how='left', on='은행명')
    df_saving = df_bank_saving.append(df_sbank_saving)
    #print(df_saving)

    return df_deposit, df_saving
'''
# 채권 데이터 생성
def bond():
    columns = ['상품명', '수익률', '만기일', '위험도']
    df = pd.DataFrame(columns = columns)
    data = []
    data.append(['30년물', 1.707, 360, 0])
    data.append(['10년물', 1.608, 120, 0])
    data.append(['5년물', 1.299, 60, 0])
    data.append(['3년물', 0.963, 36, 0])
    data.append(['1년물', 0.695, 12, 0])

    for item in data:
        df = df.append(pd.Series(item, index = columns), ignore_index= True)
    
    #print (df)
    return df
'''
# main
df_dividend = dividend()
df_deposit, df_saving = deposit()
#df_bond = bond()

df_dividend = df_dividend.reset_index()
df_deposit = df_deposit.reset_index()
df_saving = df_saving.reset_index()
#df_bond = df_bond.reset_index()

df_dividend.rename(columns = {'회사명': '상품명', '변동성': '위험도'}, inplace = True)
df_deposit.rename(columns = {'금리': '수익률'}, inplace = True)
df_saving.rename(columns = {'금리': '수익률'}, inplace = True)

df_dividend['상품유형'] = '배당금'
df_deposit['상품유형'] = '예금'
df_saving['상품유형'] = '적금'
#df_bond['상품유형'] = '국채'

columns = ['index', '상품명', '수익률', '위험도', '상품유형']

df = pd.DataFrame(columns = columns)
df = df.append(df_dividend)
df = df.append(df_deposit)
df = df.append(df_saving)
#df = df.append(df_bond)

df.drop(columns = df.columns[5:len(df.columns)], inplace = True)

print('idx,상품명,y,x')
for idx, row in df.iterrows():
    print(str(idx)+','+row["상품명"]+","+str(row["수익률"])+","+str(row["위험도"]))
    #print(row)
    #print(type(row))

#print(df)
#print(df.columns)

df.to_csv('tmp1.csv')
