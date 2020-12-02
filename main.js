const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require('body-parser');
const fs = require('fs');
const pythonShell = require('python-shell')
const mysql = require('mysql');
const cors = require('cors');
const url = require('url');
const base64 = require('node-base64-image');

const CSVtoJSON = require('csvtojson');

const proxy = require('http-proxy-middleware');
const nodejsBase64 = require('nodejs-base64');


app.use(cors());
app.use(bodyParser.json());


app.get('/', function(request, response){
    response.send('POST REQUEST TO THE PAGE')
});


// 초기 변수 설정 시 :를 쓴다
let options={
    scriptPath : "/home/selab/PycharmProjects/Ecos1",
    args : ["val1", "val2", "val3", "val4", "val5", "val6"]
};

//채권 Row 넘겨주기
app.get('/api_bond',function(request, response){
    file_path = './public/채권/bond_refine.csv'
    try{
        var fr = fs.readFileSync(file_path,'utf8',function(error,data){
            if(error){
                console.log(error);
                throw error;
            } else {
                console.log(data);
            }
        })
        response.send(fr);
    }
    catch(exception){
        throw exception;
    }
})

//배당금 정보
app.get('/api_div',function(request, response){
    //console.log(request);
    try{
        CSVtoJSON().fromFile('./public/data_dividend.csv')
            .then(users => {
                //var tmp = {d : users};
                console.log("api_dev 접근");
                response.send(users);
            }).catch(error => {
                console.log(error);
            })

        var fr = fs.readFileSync('./public/data_dividend.csv','utf8',function(error,data){
            if(error){
                console.log(error);
            } 
            //json 형식으로 response    
        })
        //console.log(CSVtoJSON().fr);
        //console.log(JSON.stringify(fr));
        //response.send(fr);
        //console.log(typeof(fr));
    }
    catch(exception){
        throw exception;
    }
})

//예금 정보
app.get('/api_dep',function(request, response){
    try{
        CSVtoJSON().fromFile('./public/data_deposit.csv')
            .then(users => {
                response.send(users);
            }).catch(error =>{
                console.log(error);
            });

        //var jbSplit = fr.split('\n');
        //console.log(jbSplit);
        //console.log("api dep 연결 성공");
        //response.send(fr);
    } catch (exception){
        throw exception;
    }
})

//적금 정보
app.get('/api_sav', function(request,response){
    try{
        CSVtoJSON().fromFile('./public/data_saving.csv')
        .then(users => {
            response.send(users);
        }).catch(error =>{
            console.log(error);
        });
    } catch (exception){
        throw exception;
    }
})

//채권 데이터
app.get('/bond_*',function(request,response){
    var param = request.params[0]
    let routing = './public/bond_data/bond_'+param+'.csv'
    console.log(routing)
    try{

        CSVtoJSON().fromFile(routing)
            .then(users => {
                    response.send(users)
            })
    } catch (exception){
         throw exception;
    }

})

//예금 MySQL Raw Data
app.get('/dep_*',function(request,response){
    var param = request.params[0];
    param_arr = param.split('&');

    //param_arr[0] , param_arr[1]
    try{

        CSVtoJSON().fromFile('./public/data_deposit.csv')
            .then(users => {
                var tmp=[];
                //console.log(users.length);
                for (var i = 0; i<users.length; ++i){
                    if(users[i].fin_prdt_cd == param_arr[0]){
                        if(users[i].은행명 == param_arr[1]){
                            tmp.push(users[i]);
                            //console.log(tmp);
                        }
                            
                    }
                }
                return tmp;
            }) 
            .then(user1 => {
                console.log('request on');
                response.send(user1);
            })
    } catch (exception){
         throw exception;
    }
 });

//예금 MySQL Raw Data
app.get('/sav_*',function(request,response){

    var param = request.params[0];
    param_arr = param.split('&');

    //param_arr[0] , param_arr[1]
    try{

        CSVtoJSON().fromFile('./public/data_saving.csv')
            .then(users => {
                var tmp=[];
                //console.log(users.length);
                for (var i = 0; i<users.length; ++i){
                    if(users[i].fin_prdt_cd == param_arr[0]){
                        if(users[i].은행명 == param_arr[1]){
                            tmp.push(users[i]);
                            //console.log(tmp);
                        }
                            
                    }
                }
                return tmp;
            }) 
            .then(user1 => {
                response.send(user1);
            })
    } catch (exception){
         throw exception;
    }

 });



// *정규식을 활용해 주가 정보 전달하기 -> 
app.get('/share_*', function(request, response){
    var path = request.params[0]

    var file_path = "./public/stocks_data/"+path+".csv";
    console.log(file_path);

    try{
        var fr = fs.readFileSync(file_path,{encoding:"utf8"},function(error,data){
            if(error){
                if(path==undefined){
                    continue;
                }else{
                console.log(error);
                }
            }else{
                //console.log(data);
            }
        });
        fr_rep = fr.replace('index','날짜');
        //var jbSplit = fr_rep.split('\n');

        // var jbJSON={};
        // //split method를 쓴 이상 객체화 됨
        // for (var i in jbSplit){
        //     jbJSON += JSON.stringify(jbSplit[i]);
        // }
        //console.log(jbJSON);
        //console.log(typeof(jbJSON));
        response.send(fr_rep);
        
    }
    catch (exception){
        console.log(exception);
    }

})

var connection = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : 'selab',
    database : 'Capstone'
});

//For DB Disconnect Handling
function handleDisconnect(){
    connection.connect(function(error){
        if(error){
            console.log('error with Connection to DB',error);
            setTimeout(handleDisconnect,20000);
        }
    })

    connection.on('error',function(error){
        if(error.code == 'PROTOCOL_CONNECTION_LOST'){
                return handleDisconnect();
        }else{
            throw error;
        }
    })
}

connection.connect(function(error){
    if(error){
        throw error;
    }else{
        console.log('DB COnnection Complete');
    }
})

app.get('/bs',function(request,response){
    try{
        connection.query('SELECT * FROM BS', function(error, rows, fields){
            if(error){
                console.log(error);
            }else{
                //console.log(typeof(rows));
                response.send(rows);
            }
        })
    } catch (exception){
        throw exception;
    }
})
    

//매크로 지표
app.get('/api_macro',function(Request,response){
    try{
        CSVtoJSON().fromFile('./public/macro.csv')
            .then(users =>{
                response.send(users);
            }).catch(error =>{
                console.log(error);
            })
    } catch(exception){
        console.log(exception);
    }
});

app.get('/api_macro_coef',function(request,response){
    try{
        CSVtoJSON().fromFile('./public/macro_coef.csv')
            .then(users =>{
                response.send(users);
            }).catch(error =>{
                console.log(error);
            })
    } catch(exception){
        console.log(exception);
    }
});

app.get('/what',function(request,response){
    const url = './public/img/seok1.jpg';
    try{
        var tmp1 = fs.readFileSync(url,'base64');
        //let encoded_seok = base64encode(fr);
        response.send(tmp1);
    }catch(exception){
        throw exception;
    }
})


app.listen(3000, function(){
    console.log('Server is Running at 3000')
});