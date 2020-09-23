# 적금 API URL
def savingProductsSearch(auth, topFinGrpNo, pageNo, financeCd):
  if financeCd:
    return "http://finlife.fss.or.kr/finlifeapi/savingProductsSearch.json?auth={}&topFinGrpNo={}&pageNo={}&financeCd={}".format(auth, topFinGrpNo, pageNo, financeCd)
  else:
    return "http://finlife.fss.or.kr/finlifeapi/savingProductsSearch.json?auth={}&topFinGrpNo={}&pageNo={}".format(auth, topFinGrpNo, pageNo)

# 적금 전체 정보
import requests

auth = "b8d77f808675966ff6f16afdfab3d03c"
topFinGrpNo = ["020000", "030300"] # [은행, 저축은행]
product = dict()
for grpCode in topFinGrpNo:
  product[grpCode] = dict()
  page = 1
  while True:
    url = savingProductsSearch(auth, grpCode, page, "")
    try:
      result = requests.get(url).json()["result"]
    except Exception as e:
      print(str(e))
      break

    if result["err_cd"] != "000":
      print(result["err_msg"])
      break
    base = result['baseList']
    option = result['optionList']

    # 기본 정보와 옵션 정보는 "fin_prdt_cd"로 연관
    # 기본 정보
    for b in base:
      code = b["fin_prdt_cd"]
      product[grpCode][code] = dict()
      product[grpCode][code]["kor_co_nm"] = b["kor_co_nm"]
      product[grpCode][code]["fin_prdt_nm"] = b["fin_prdt_nm"]
      product[grpCode][code]["join_member"] = b["join_member"]
      product[grpCode][code]["max_limit"] = b["max_limit"]
      product[grpCode][code]["spcl_cnd"] = b["spcl_cnd"]

    
    # 옵션 정보
    for o in option:
      code = o["fin_prdt_cd"]
      if not "options" in product[grpCode][code] :
        product[grpCode][code]["options"] = list()
      product[grpCode][code]["options"].append([o["save_trm"], o["intr_rate_type_nm"], o["intr_rate"], o["intr_rate2"], o["rsrv_type_nm"]])

    if result["now_page_no"] == result["max_page_no"]:
      break
    page += 1

# product = {"권역코드"}
# product["권역코드"] = {"상품코드"}
# product["권역코드"]["상품코드"] = {"회사명", "상품명", "가입대상", "한도", "우대조건", "옵션"}
# product["권역코드"]["상품코드"]["옵션"] = [옵션1, 옵션2, 옵션3, ...]
# product["권역코드"]["상품코드"]["옵션"][0] = {"저축기간", "금리종류", "금리", "최대 금리", "적립 유형"}