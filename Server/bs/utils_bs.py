import pandas as pd
import pandas_datareader as pdr
import urllib.parse
import math
import re
import io
import time
from math import isnan
from datetime import datetime, timedelta
from tqdm import tqdm

# CODE_DF 만드는 함수
def download_stock_codes(market=None, delisted=False):
  DOWNLOAD_URL = 'kind.krx.co.kr/corpgeneral/corpList.do'
  MARKET_CODE_DICT = {
    'kospi': 'stockMkt',
    'kosdaq': 'kosdaqMkt',
    'konex': 'konexMkt'
  }

  params = {'method': 'download'}
  if market.lower() in MARKET_CODE_DICT:
    params['marketType'] = MARKET_CODE_DICT[market]
  if not delisted:
    params['searchType'] = 13
  
  params_string = urllib.parse.urlencode(params)
  request_url = urllib.parse.urlunsplit(['http', DOWNLOAD_URL, '', params_string, ''])
  
  df = pd.read_html(request_url, header=0)[0]
  df.종목코드 = df.종목코드.map('{:06d}'.format)
  
  return df


def get_code_df(): 
  # 코스피, 코스닥
  kospi_stocks = download_stock_codes('kospi')
  kosdaq_stocks = download_stock_codes('kosdaq')


  # 필요 없는 컬럼 삭제 
  drop_list = ['업종', '주요제품', '상장일', '결산월', '대표자명', '홈페이지', '지역']
  kospi_stocks = kospi_stocks.drop(drop_list, axis=1)
  kosdaq_stocks = kosdaq_stocks.drop(drop_list, axis=1)

  # 컬럼 이름 변경
  kospi_stocks.columns = ['name', 'code']
  kosdaq_stocks.columns = ['name', 'code']

  # 종목코드에 코스피, 코스닥 구분자 붙여주기
  kospi_stocks['market_code'] = 'KS'
  kosdaq_stocks['market_code'] = 'KQ'
  # 코스피, 코스닥 목록 합치기 
  code_df = pd.concat([kospi_stocks, kosdaq_stocks]).reset_index()
  code_df = code_df.drop(['index'], axis=1)

  return code_df

# CODE_DF 생성 
code_df = get_code_df()


#==============================================================================##==============================================================================#


# 로우 관련 함수
# GLOBAL CODE_DF, CODE_DF가 있어야만 작동
def get_row_byName(name):
  global code_df
  return code_df.query("name=='{}'".format(name))
def get_row_byCode(code):
  global code_df
  return code_df.query("code=='{}'".format(code))


def get_row(input):
  global code_df
  row = get_row_byName(input)
  if len(row) == 0: row = get_row_byCode(input)
  if len(row) == 0: return pd.DataFrame()
  else: return row


def get_code(row):
  return row['code'].to_string(index=False).strip()
def get_market_code(row):
  return row['market_code'].to_string(index=False).strip()
def get_name(row):
  return row['name'].to_string(index=False).strip()


#==============================================================================#
#==============================================================================#


# 야후로부터 종목 정보 가져오기
def get_data_fromYahoo(input, start=None):
  row = get_row(input)
  if len(row) == 0: return pd.DataFrame()

  # 코드 = 종목코드 + 코스닥/코스피
  code = get_code(row) + '.' + get_market_code(row)
  try:
    # start 미지정시 전체 데이터 가져옴
    if start == None:
      df = df = pdr.get_data_yahoo(code)
    else:
      df = pdr.get_data_yahoo(code, start, datetime.today())

    # 필요 없는 컬럼 삭제
    df = df.drop(columns=['Adj Close'])
    return df
  
  # 야후에 해당 종목 정보 없는 경우 에러, 빈 프레임 반환
  except:
    return pd.DataFrame()


#==============================================================================##==============================================================================#


# 네이버로부터 종목 정보 가져오기
def get_data_fromNaver(input, start=None):
  # 야후와 데이터프레임 형식 맞추기 
  def modified_df(df):
    df.columns = ['Date', 'Close', '.', 'Open', 'High', 'Low', 'Volume']
    df.set_index(df['Date'], inplace=True)
    df.drop(columns=["Date", "."], inplace=True)
    df = df[['High', 'Low', 'Open', 'Close', 'Volume']]
    df = df[::-1]
    df.index = [pd.to_datetime(i) for i in df.index]
    df.index = df.index.rename('Date')
    return df

  row = get_row(input)
  if len(row) == 0: return pd.DataFrame()
  
  # 코드 = 종목코드
  code = get_code(row)
  url = 'http://finance.naver.com/item/sise_day.nhn?code={code}'.format(code=code)

  df = pd.DataFrame()
  before_temp_df = pd.DataFrame()
  
  # 날짜 설정, 정확하지 않음
  if start != None:
    days = (datetime.today() - start).days
    if days < 14: s = 2
    else: s = int((days*(5/7))/10) + 2
  else:
    s = 10000

  for page in range(1,s):
    pg_url = '{url}&page={page}'.format(url=url, page=page)
    temp_df = pd.read_html(pg_url, header=0)[0]
    temp_df = temp_df.dropna()
    if before_temp_df.equals(temp_df) or len(temp_df) == 0:
      return modified_df(df)

    df = df.append(temp_df, ignore_index=True)
    before_temp_df = temp_df

  # 날짜가 정확하지 않기 때문에 정확한 검색 시작 날짜를 요구한다면,
  # df에서 잘라내야 함
  
  # 네이버는 해당 종목 정보 없다면 알아서 빈 프레임 반환
  return modified_df(df)


#==============================================================================##==============================================================================#


# 야후와 네이버 모두 사용 
def get_data(input, start=None):
  df = get_data_fromYahoo(input, start)
  if len(df) < 10: df = get_data_fromNaver(input, start)
  
  return df


#==============================================================================#


# MACD 오실레이터

def get_macd_oscillator(df, short=12, long=26, sig=9):
  if short >= long : return -1

  macd_short = df['Close'].ewm(short).mean()
  macd_long = df['Close'].ewm(long).mean()
  macd = macd_short - macd_long
  macd_sig = macd.ewm(sig).mean()
  macd_oscillator = macd - macd_sig

  result = pd.concat([macd, macd_sig, macd_oscillator], axis=1)
  result.columns = ['macd', 'sig', 'oscillator']
  return result


# 슬로우 스토캐스틱

def get_stochastic_slow(df, n=12, m=5, t=5): # m == t
  close = df['Close']
  low = df['Low'].rolling(n).min()
  high = df['High'].rolling(n).max()

  fast_k = (close-low)/(high-low)*100
  slow_k = fast_k.rolling(m).mean()
  slow_d = slow_k.rolling(t).mean()
  
  result = pd.concat([slow_k, slow_d], axis=1)
  result.columns = ['slow_k', 'slow_d']
  return result


# 볼린저 밴드
def get_bollinger(df, n=20, k=2.0):
  stdev = df['Close'].rolling(n).std()  # 표준편차 = 주가의 m 기간 표준편차
  m = df['Close'].rolling(n).mean()     # 중심선 = 주가의 m 기간 이동평균선
  u = m + k*stdev                       # 상한선 = 중심선 + (k * 표준편차)
  l = m - k*stdev                       # 하한선 = 중심선 - (k * 표준편차)
  b = (u-l)/m                           # 대역폭 = (상한선-하한선)/중심선

  result = pd.concat([m, u, l, b, df['Close']], axis=1)
  result.columns = ['mbb', 'ubb', 'lbb', 'bw', 'close']
  return result


# RSI
def get_rsi(df, n=14, m=9):
  diff = df['Close'] - df['Close'].shift(1)
  u = diff.copy(); u[u < 0] = 0
  d = diff.copy(); d[d > 0] = 0; d = d*-1
  au = u.rolling(n).mean()
  ad = d.rolling(n).mean()
  rsi = au / (au + ad)
  sig = rsi.rolling(m).mean()

  result = pd.concat([rsi, sig], axis=1)
  result.columns = ['rsi', 'sig']
  return result


# 모멘텀
def get_momentum(df, n=10, m=9):
  momentum = df['Close'] - df['Close'].shift(n)
  sig = momentum.rolling(m).mean()

  result = pd.concat([momentum, sig], axis=1)
  result.columns = ['momentum', 'sig']
  return result


# 클래스 : 언제 사고 언제 팔까
class buyOrSell:
  def __init__(self, date, TF):
    self.date = date
    self.buyOrSell = TF # True buy, False sell


# 수익
def get_earn(df, bs_list):
  earn = 0
  if len(bs_list) == 0 : return 0
  if bs_list[0].buyOrSell == False:
    bs_list = bs_list[1:]
    if len(bs_list) == 0 : return 0
  
  for bs in bs_list:
    if bs.buyOrSell: earn -= df['Close'].loc[bs.date]
    else: earn += df['Close'].loc[bs.date]
  
  # 마지막 행동이 매수라면, 현재가 - 매수가
  # 매수가는 이미 뺐으므로 현재가만 더함
  last = bs_list[-1]
  if last.buyOrSell: earn += df['Close'][-1] 
  return earn


# 파라미터 생성기
def generate_three_param_list(a,b,c):
  param_list = []
  for i in range(a[0], a[1]+1):
    for j in range(b[0], b[1]+1):
      for k in range(c[0], c[1]+1):
        param_list.append((i,j,k))
  return param_list

def generate_two_param_list(a,b):
  param_list = []
  for i in range(a[0], a[1]+1):
    for j in range(b[0], b[1]+1):
      param_list.append((i,j))
  return param_list

def generate_param_list(a,b,c=0):
  if c == 0:
    return generate_two_param_list(a,b)
  else:
    return generate_three_param_list(a,b,c)


# MACD 매매 기법

def how_do_macd_oscillator(macd_oscillator):
  bs_list = []
  longPosition = False
  shortPosition = False

  for i in range(len(macd_oscillator)):
    macd = macd_oscillator['macd'][i]
    sig = macd_oscillator['sig'][i]
    
    if macd > sig and longPosition == False:
      bs_list.append(buyOrSell(macd_oscillator.index[i], True))
      longPosition = True; shortPosition = False

    elif macd < sig and shortPosition == False:
      bs_list.append(buyOrSell(macd_oscillator.index[i], False))
      longPosition = False; shortPosition = True

  return bs_list

def optimize_macd_oscillator(df, short=(9,15), long=(20, 32), sig=(7,11)):
  max_earn = 0
  max_param = 0
  param_list = generate_param_list(short, long, sig)
  for p in param_list:
    oscil = get_macd_oscillator(df, p[0], p[1], p[2])
    bs_list = how_do_macd_oscillator(oscil)
    earn = get_earn(df, bs_list)
    if max_earn < earn :
      max_earn = earn
      max_param = (p[0], p[1], p[2])
    
  if max_param == 0: max_param = (12,26,9)
  return (max_param, max_earn)


# 슬로우 스토캐스틱 매매 기법 
# K, D 교차 매매기법

def how_do_stochastic_slow(stochastic_slow, high=80, low=20):
  bs_list = []
  longPosition = False
  shortPosition = False

  for i in range(len(stochastic_slow)):
    k = stochastic_slow['slow_k'][i]
    d = stochastic_slow['slow_d'][i]

    if k > d and k <= low and longPosition == False:
      bs_list.append(buyOrSell(stochastic_slow.index[i], True))
      longPosition = True; shortPosition = False

    elif k < d and k >= high and shortPosition == False:
      bs_list.append(buyOrSell(stochastic_slow.index[i], False))
      longPosition = False; shortPosition = True

  return bs_list
  
def optimize_stochastic_slow(df, n=(10,20), m=(5,12), high=(75,80), low=(20, 25)):
  max_earn = 0
  max_param = 0
  param_list_1 = generate_param_list(n, m) # m == t
  for p1 in param_list_1:
    stochastic = get_stochastic_slow(df, p1[0], p1[1], p1[1])
    
    param_list_2 = generate_param_list(high, low)
    for p2 in param_list_2:
      bs_list = how_do_stochastic_slow(stochastic, p2[0], p2[1])
      earn = get_earn(df, bs_list)

      if max_earn < earn :
        max_earn = earn
        max_param = (p1[0], p1[1], p1[1], p2[0], p2[1])

  if max_param == 0: max_param = (12,5,5,75,25)
  return (max_param, max_earn)


# 볼린저 밴드 매매 기법
# 밴드폭 고려 X

def how_do_bollinger(bollinger):
  bs_list = []
  longPosition = False
  shortPosition = False

  for i in range(len(bollinger)):
    ubb = bollinger['ubb'][i]
    lbb = bollinger['lbb'][i]
    bw = bollinger['bw'][i]
    close = bollinger['close'][i]

    if lbb > close and longPosition == False:
      bs_list.append(buyOrSell(bollinger.index[i], True))
      longPosition = True; shortPosition = False

    elif ubb < close and shortPosition == False:
      bs_list.append(buyOrSell(bollinger.index[i], False))
      longPosition = False; shortPosition = True

  return bs_list

def optimize_bollinger(df, n=(15,30), k=(1,4)):
  max_earn = 0
  max_param = 0
  param_list = generate_param_list(n, k)
  for p in param_list:
    bollinger = get_bollinger(df, p[0], p[1])
    bs_list = how_do_bollinger(bollinger)
    earn = get_earn(df, bs_list)
    if max_earn < earn :
      max_earn = earn
      max_param = (p[0], p[1])

  if max_param == 0: max_param = (20, 2)
  return (max_param, max_earn)


# RSI 매매기법
# rsi, sig 교차 매매기법
def how_do_rsi(rsi):
  bs_list = []
  longPosition = False
  shortPosition = False
  
  for i in range(len(rsi)):
    r = rsi['rsi'][i]
    s = rsi['sig'][i]

    if r > s and longPosition == False:
      bs_list.append(buyOrSell(rsi.index[i], True))
      longPosition = True; shortPosition = False

    elif r < s and shortPosition == False:
      bs_list.append(buyOrSell(rsi.index[i], False))
      longPosition = False; shortPosition = True

  return bs_list


def optimize_rsi(df, n=(10,21), m=(7,13)):
  max_earn = 0
  max_param = 0
  param_list = generate_param_list(n, m)
  for p in param_list:
    rsi = get_rsi(df, p[0], p[1])
    bs_list = how_do_rsi(rsi)
    earn = get_earn(df, bs_list)
    if max_earn < earn :
      max_earn = earn
      max_param = (p[0], p[1])

  if max_param == 0: max_param = (14,9)
  return (max_param, max_earn)


# 모멘텀 매매기법
# 모멘텀, 시그널 교차 매매기법 
def how_do_momentum(momentum):
  bs_list = []
  longPosition = False
  shortPosition = False

  for i in range(len(momentum)):
    m = momentum['momentum'][i]
    s = momentum['sig'][i]

    if m > s and longPosition == False:
      bs_list.append(buyOrSell(momentum.index[i], True))
      longPosition = True; shortPosition = False

    elif m < s and shortPosition == False:
      bs_list.append(buyOrSell(momentum.index[i], False))
      longPosition = False; shortPosition = True

  return bs_list

def optimize_momentum(df, n=(8,15), m=(7,13)):
  max_earn = 0
  max_param = 0
  param_list = generate_param_list(n, m)
  for p in param_list:
    momentum = get_momentum(df, p[0], p[1])
    bs_list = how_do_momentum(momentum)
    earn = get_earn(df, bs_list)
    if max_earn < earn :
      max_earn = earn
      max_param = (p[0], p[1])

  if max_param == 0: max_param = (10,9)
  return (max_param, max_earn)


# 파라미터 최적화
def get_optimizer(df):
  optimizer = dict()
  optimizer['macd_oscillator'] = optimize_macd_oscillator(df)
  optimizer['sthochastic_slow'] = optimize_stochastic_slow(df)
  optimizer['bollinger'] = optimize_bollinger(df)
  optimizer['rsi'] = optimize_rsi(df)
  optimizer['momentum'] = optimize_momentum(df)
  return optimizer


# 지표별 가중치
def get_optimizer_rate(optimizer):
  sum = 0
  keys = optimizer.keys()
  rate = dict()
  for k in keys: sum += optimizer[k][1]
  if sum == 0: sum = 1
  for k in keys: rate[k] =  optimizer[k][1] / sum
  return rate


# 매매신호
def today_buyOrSell(df):
  optimizer = get_optimizer(df)
  rate = get_optimizer_rate(optimizer)
  op = dict()
  for k in optimizer.keys(): op[k] = optimizer[k][0]
  
  oscillator = get_macd_oscillator(df, op['macd_oscillator'][0], 
                                   op['macd_oscillator'][1], op['macd_oscillator'][2])
  sthochastic = get_stochastic_slow(df, op['sthochastic_slow'][0],
                                    op['sthochastic_slow'][1], op['sthochastic_slow'][2])
  bollinger = get_bollinger(df, op['bollinger'][0], op['bollinger'][1])
  rsi = get_rsi(df, op['rsi'][0], op['rsi'][1])
  momentum = get_momentum(df, op['momentum'][0], op['momentum'][1])
  
  how_oscillator = buyOrSell(-1, False)
  how_did_macd_oscillator = how_do_macd_oscillator(oscillator)
  if len(how_did_macd_oscillator) >= 1:
    how_oscillator = how_did_macd_oscillator[-1]

  how_stochastic = buyOrSell(-1, False)
  how_did_stochastic_slow = how_do_stochastic_slow(sthochastic, op['sthochastic_slow'][3], op['sthochastic_slow'][4])
  if len(how_did_stochastic_slow) >= 1:
    how_stochastic = how_did_stochastic_slow[-1]

  how_bollinger = buyOrSell(-1, False)
  how_did_bollinger = how_do_bollinger(bollinger)
  if len(how_did_bollinger) >= 1:
    how_bollinger = how_did_bollinger[-1]

  how_rsi = buyOrSell(-1, False)
  how_did_rsi = how_do_rsi(rsi)
  if len(how_did_rsi) >= 1:
    how_rsi = how_did_rsi[-1]

  how_momentum = buyOrSell(-1, False)
  how_did_momentum = how_do_momentum(momentum)
  if len(how_did_momentum) >= 1:
    how_momentum = how_did_momentum[-1]


  lastday = df.index[-1]; bs = 0
  
  if how_oscillator.date == lastday:
    if how_oscillator.buyOrSell: bs += rate['macd_oscillator']
    else: bs -= rate['macd_oscillator']
  if how_stochastic.date == lastday:
    if how_stochastic.buyOrSell: bs += rate['sthochastic_slow']
    else: bs -= rate['sthochastic_slow']
  if how_bollinger.date == lastday:
    if how_bollinger.buyOrSell: bs += rate['bollinger']
    else: bs -= rate['bollinger']
  if how_rsi.date == lastday:
    if how_rsi.buyOrSell: bs += rate['rsi']
    else: bs -= rate['rsi']
  if how_momentum.date == lastday:
    if how_momentum.buyOrSell: bs += rate['momentum']
    else: bs -= rate['momentum']

  return bs


# 불러오기
def load_df(name):
  path = './stocks_data/'
  try:
    df = pd.read_csv(path + name + '.csv')
  except:
    raise Exception(name, "load_df")

  # 저장하면서 생긴 불필요한 행 삭제
  p = re.compile('Unnamed.')
  for col_name in df.columns:
    if p.match(col_name) != None:
      df = df.drop([col_name], axis=1)

  # index였던 Date가 저장하며 column으로 변경
  # 'Date' 혹은 'index'로 저장됨(save_df에 의해)
  if 'index' in df.columns:
    df = df.rename({'index':'Date'}, axis=1)
  
  # Date를 다시 index로 설정
  df = df.set_index('Date')

  # 시간을 str에서 timestamp로 변경. 로드 시간 5배 증가
  # df.index = [pd.to_datetime(i) for i in df.index]

  return df

#==============================================================================#

# 저장하기
# 저장 성공 시 True 반환
# 저장 실패 시 False 반환
def save_df(df, name):
  path = './stocks_data/'
  
  try:
    df = df.reset_index()
    df.to_csv(path + name + '.csv')
  except:
    raise Exception(name, 'save_df')

#==============================================================================#

# 자르기
# n = 120일 때, 
# len이 120 이상인 df는, 앞부분을 자르고 120개 반환
# len이 120 미만인 df는, 전체 반환
def cut_df(df, n=120):
  return df[len(df)-n : ]

#==============================================================================#

# target date만 갱신하기
def update_df_a_day(df, name, target_date):
  last_date = pd.to_datetime(df.index[-1])
  if last_date == target_date:
    return df
  
  new_df = get_data_fromYahoo(name, target_date)
  if target_date not in new_df.index:
    new_df = get_data_fromNaver(name, target_date)
    if target_date not in new_df.index:
      raise Exception(name, "update_df_a_day")

  new_df.index = [i.strftime('%Y-%m-%d') for i in new_df.index]
  updated_df = pd.concat([df, new_df])
  return updated_df

# target date까지 갱신하기
def update_df(df, name, target_date):
  last_date = pd.to_datetime(df.index[-1])
  if last_date == target_date:
    return df

  # 야후에서 갱신된 데이터 가져오기
  # 야후에 없는 경우, 네이버에서 데이터 가져오기
  # 네이버 해당 페이지에 없는 경우, 더 많은 페이지에서 가져오기
  # 그래도 없는 경우 에러 
  new_df = get_data_fromYahoo(name, last_date)
  if last_date not in new_df.index or target_date not in new_df.index:
    new_df = get_data_fromNaver(name, last_date)
    if last_date not in new_df.index:
      new_df = get_data_fromNaver(name, last_date-timedelta(days=10))
      if last_date not in new_df.index:
        raise Exception(name, "update_df")

  new_df = new_df[new_df.index > last_date]
  new_df.index = [i.strftime('%Y-%m-%d') for i in new_df.index]
  updated_df = pd.concat([df, new_df])
  return updated_df

# 전체 갱신&저장하기
def update_all(target_date):
  global code_df

  i = 0
  for name in code_df['name']:
    try:
      df = load_df(name)
      updated_df = update_df(df, name, target_date)
      if len(df) < len(updated_df):
        save_df(updated_df, name)

    except:
      raise Exception(name, 'update_all')

    i += 1
    if i % (len(code_df)//10) == 0:
      print(i / len(code_df) * 100)


# 약수 구하기
def get_divisor(n):
  result = []
  for i in range(1,n+1):
    if n % i == 0:
      result.append(i)
  return result
