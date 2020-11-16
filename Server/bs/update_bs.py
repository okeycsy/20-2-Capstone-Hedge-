from utils_bs.py import *

# 꼭 날짜를 갱신해서 사용!
# 전채 갱신, update_df_a_day를 통해 한 날짜만 갱신

str_date = datetime.strftime(datetime.today(), "%Y-%m-%d")
try:
    pd.to_datetime(str_date)
except:
    raise Exception('unvaild date')

target_date = pd.to_datetime(str_date)

for name in tqdm(code_df['name']):
  try:
    df = load_df(name)
  except:
    try:
      df = get_data_fromNaver(name, target_date-timedelta(days=180))
      save_df(df, name)
      continue
    except:
      pass

  # 마지막 index가 str_date와 같다면 통과
  if df.index[-1] == str_date:
    # 중복 제거
    if len(df[df.index.duplicated()]) > 0:
      df = df.reset_index()
      df = df.drop_duplicates(['Date'])
      df = df.set_index(['Date'])
      save_df(df, name)
      df = load_df(name)
    continue

  # 업데이트 후 저장 
  # 중복 제거
  updated_df = update_df_a_day(df, name, target_date)
  if len(updated_df[updated_df.index.duplicated()]) > 0:
    updated_df = updated_df.reset_index()
    if 'index' in updated_df:
      updated_df = updated_df.rename({'index':'Date'}, axis=1)
    updated_df = updated_df.drop_duplicates(['Date'])
    updated_df = updated_df.set_index(['Date'])

  save_df(updated_df, name)


# 모두 오늘 일자로 업데이트 되었는지 체크
flag = True
for name in tqdm(code_df['name']):
  try:
    df = load_df(name)
  except:
    continue
  if df.index[-1] != str_date:
    print(name + " is not valid")
    flag = False
    break

if flag:
  print()
  print('all data are valid') 
else :
  raise Exception('check', 'update_all') 

print()
print("updating data is completed.")
