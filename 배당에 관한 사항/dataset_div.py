import numpy as np
import pandas as pd
import math


# 배당금 위험-수익률 데이터 생성
def dividend():
    divid = pd.read_csv('dividend_final.csv')
    stock_address = ('stocks_data/')

    columns = ['회사명', '수익률', '변동성']
    df = pd.DataFrame(columns=columns)

    for idx, row in divid.iterrows():
        try:
            stock = pd.read_csv(stock_address + row['회사명'] + '.csv')

            # 1개월 변동성 계산 -> 1년 변동성으로 변환
            danger = 0
            month = stock.tail(30)

            daily_profits = []
            daily_cost = stock.tail(31).iloc[0]['Close']
            for month_idx, month_row in month.iterrows():
                # danger += (month_row['High'] - month_row['Low']) / month_row['Close'] * 100
                daily_profits.append(math.log(month_row['Close'] / daily_cost))
                daily_cost = month_row['Close']
            volatility = np.std(daily_profits)
            volatility *= math.sqrt(252) * 100

            # 비용
            cost = stock.tail(1).iloc[0]['Close']
            profit = row['유형1 당기']
            rate = int(profit) / cost * 100
            if rate > 30:
                return

            s = pd.Series([row['회사명'], rate, volatility], index=columns)

            # append
            df = df.append(s, ignore_index=True)

        except Exception as e:
            # print (e)
            continue

    df = df.dropna()
    df_valid = df[df['수익률'] != 0]
    df_valid = df_valid.reset_index()
    df_valid = df_valid.drop(axis=1, columns=['index'])
    # print(df_valid)
    return df_valid


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
# df_deposit, df_saving = deposit()
# df_bond = bond()

df_dividend = df_dividend.reset_index()
# df_deposit = df_deposit.reset_index()
# df_saving = df_saving.reset_index()
# df_bond = df_bond.reset_index()

df_dividend.rename(columns={'회사명': '상품명', '변동성': '위험도'}, inplace=True)
# df_deposit.rename(columns = {'금리': '수익률'}, inplace = True)
# df_saving.rename(columns = {'금리': '수익률'}, inplace = True)

df_dividend['상품유형'] = '배당금'
# df_deposit['상품유형'] = '예금'
# df_saving['상품유형'] = '적금'
# df_bond['상품유형'] = '국채'

columns = ['index', '상품명', '수익률', '위험도', '상품유형']

df = pd.DataFrame(columns=columns)
df = df.append(df_dividend)
# df = df.append(df_deposit)
# df = df.append(df_saving)
# df = df.append(df_bond)

df.drop(columns=df.columns[5:len(df.columns)], inplace=True)

print('idx,상품명,y,x')
for idx, row in df.iterrows():
    print(str(idx) + ',' + row["상품명"] + "," + str(row["수익률"]) + "," + str(row["위험도"]))
    print(row)
    # print(type(row))

# print(df)
# print(df.columns)

df.to_csv('/home/selab/Desktop/chatbot/node/Capstone/Server/public/data_dividend.csv')
