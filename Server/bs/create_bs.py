from utils_bs.py import *

# BS 생성
date = load_df('카카오').index[-1]
file_name1 = './suggests/suggest_' +date+ '.csv'
file_name2 = './suggests/suggest_' +date+ '_2.csv'

try:
  bs = pd.read_csv(file_name1)
except:
  # 초기화
  print('create file')
  bs = pd.Series([math.nan for _ in range(len(code_df))], name='BS')
  bs = pd.concat([code_df['name'], bs], axis=1)
  bs.to_csv(file_name1)

print('Suggest len is ' + str(len(bs)))
if not len(bs) == len(code_df):
  print('Load Suggest2')
  bs = pd.read_csv(file_name2)
  print(len(bs))

print(file_name1)

# 필요 없는 행 삭제(csv로 저장 시 생기는 Unnamed 컬럼)
p = re.compile('Unnamed.')
for c in bs.columns:
  if p.match(c) != None:
    bs = bs.drop([c], axis=1)


# BS 값 넣기 
div = get_divisor(len(bs))
div_1 = div[len(div)//2 - 1]
div_2 = div[len(div)//2]
if div_1 == div_2:
  div_1 = 100
  div_2 = 500

n = 120


timer = time.time()

for i in tqdm(bs.index):
  if not isnan(bs.at[i, 'BS']):
    continue
  name = bs.at[i, 'name']
  try:
    df = load_df(name)

  except:
    print(name)
    pass

  df = cut_df(df, n)
  # 길이가 부족하면 신호 판별 불가
  if len(df) != n:
    bs.at[i, 'BS'] = 0  
  else:
    try:
      bs.at[i, 'BS'] = today_buyOrSell(df)
    except:
      print(name)
      bs.at[i, 'BS'] = 0
  
  if i % div_1 == 0:
    bs.to_csv(file_name1)
    if i % div_2 == 0: 
      bs.to_csv(file_name2)

bs.to_csv(file_name1)
bs.to_csv(file_name2)

print()
print("making BS is completed.")
