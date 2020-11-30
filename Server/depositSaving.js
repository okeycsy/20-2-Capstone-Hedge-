module.exports = {
    HTML:function(kor_co_nm, fin_prdt_nm, join_member, max_limit, spcl_cnd, options_html){
      return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Document</title>
          <link rel="stylesheet" type="text/css" href='./css/dividend.css'>
      </head>
      <body>
          <!--로고-->
          <div>
              <div class="container">
                  <a href="/"><img src=""></a>
              </div>
          </div>
          <hr>
          
      
          <div>
              <div class="container">
                  예·적금 세부 정보
              </div>
          </div>
          
      
          <div>
              <div class="container">
                  <table>
                      <thead>
                          <tr>
                              <th>회사명</th><th>상품명</th><th>가입대상</th><th>한도</th><th>우대조건</th>
                          </tr>
                      </thead>
                      <tbody>
                          <tr>
                              <td>${kor_co_nm}</a></td><td>${fin_prdt_nm}</td><td>${join_member}</td><td>${max_limit}</td><td>${spcl_cnd}</td>
                          </tr>
                      </tbody>
                  </table>
              </div>
      
              <div class="container">
                  <table>
                      <thead>
                          <tr>
                              <th>저축기간</th><th>금리종류</th><th>금리</th><th>최대금리</th><th>적립유형</th>
                          </tr>
                      </thead>
                      <tbody>
                          <tr>
                              ${options_html}
                          </tr>
                      </tbody>
                  </table>
              </div>
          </div>
      
          <div>
              <hr>
              <div class="container">
      
                  <footer>
                      footer
                  </footer>
              </div>
          </div>
          
      </body>
      </html>
      
      
      `
    }
  }
  