import numpy as np
import pandas as pd
from sklearn.linear_model import LinearRegression

orig = pd.read_csv('dividend - 인코딩 - (-표시 제거).csv')

orig = orig.dropna(axis = 1, how = 'all')

df = orig.drop(['순번', '회사명', '주당액면가액(원)(1)당기', '주당액면가액(원)(1)전기',
             '주당액면가액(원)(1)전전기', '(연결)당기순이익(백만원)(1)당기',
             '(연결)당기순이익(백만원)(1)전기', '(연결)당기순이익(백만원)(1)전전기',
             '(별도)당기순이익(백만원)(1)당기', '(별도)당기순이익(백만원)(1)전기',
             '(별도)당기순이익(백만원)(1)전전기', '(연결)주당순이익(원)(1)당기',
             '(연결)주당순이익(원)(1)전기', '(연결)주당순이익(원)(1)전전기'], axis=1)

df = df.dropna(how = 'all')

orig = orig.merge(df, how='right')
orig = orig.drop(['순번'], axis = 1)

cols = orig.columns

dropList = []
for s in cols:
    if (s.find('%') != -1):
        dropList.append(s)

orig = orig.drop(dropList, axis = 1)

columns_output = ['회사명', '주당액면가액(원)당기', '주당액면가액(원)전기',
             '주당액면가액(원)전전기', '(연결)당기순이익(백만원)당기',
             '(연결)당기순이익(백만원)전기', '(연결)당기순이익(백만원)전전기',
             '(별도)당기순이익(백만원)당기', '(별도)당기순이익(백만원)전기',
             '(별도)당기순이익(백만원)전전기',
             '주식 유형1', '유형1 예측', '유형1 당기', '유형1 전기', '유형1 전전기',
             '주식 유형2', '유형2 예측', '유형2 당기', '유형2 전기', '유형2 전전기',
             '주식 유형3', '유형3 예측', '유형3 당기', '유형3 전기', '유형3 전전기']
df = pd.DataFrame(columns = columns_output)
for row in orig.iterrows():
    new_row = list(row[1].values[0:10])
    for i, s in enumerate(new_row):
        if (type(s) is str):
            new_row[i] = s.replace(',', '')
    
    indices = row[1].index[10: len(row[1].values)]
    data = row[1].values[10: len(row[1].values)]
    i = 0
    while i < len(data):
        name = ''
        location = -1
        if (pd.isna(data[i])):
            i += 1
            continue
        elif (indices[i].find('주당 ') != -1):
            if (indices[i].find('당기') != -1):
                location = i
            elif (indices[i].find('전전기') != -1):
                location = i - 2
            elif (indices[i].find('전기') != -1):
                location = i - 1

            X = []
            Y = []
            
            for j in range(3):
                if type(data[location + (2 - j)]) is str:
                    X.append([j])
                    Y.append(float(data[location + (2 - j)].replace(',','')))
                elif not(pd.isna(data[location + (2 - j)])):
                    X.append([j])
                    Y.append(data[location + (2 - j)])

            X = np.array(X)
            Y = np.array(Y)
            reg = LinearRegression().fit(X, Y)
            #print(X)
            #print(Y)
            #print(reg.predict([[4]])[0])
            #print('')

            name = indices[location][0:len(indices[location])]
            new_row.append(name)
            new_row.append(int(reg.predict([[4]])[0]))
            new_row.append(data[location])
            new_row.append(data[location + 1])
            new_row.append(data[location + 2])
            i = location + 3
        else:
            i += 1

    while (len(new_row) < len(columns_output)):
        new_row.append('')

    if (len(new_row) > len(columns_output)):
        new_row = new_row[0:len(columns_output)]
        print('데이터 잘림')

    df = df.append(pd.Series(new_row, index = columns_output), ignore_index = True)
    

print(df)
print(orig)

df.to_csv('dividend 재구성.csv')
