var express = require('express');
var app = express();

var fs = require('fs');
var ejs = require('ejs');


// For DataBase connection
var mysql = require('mysql');
var connection_sql = mysql.createConnection({
    host : "localhost",
    user : "root",
    password : "selab",
    database : "Capstone"

});

connection_sql.connect(function(error){
    if(error){
        console.log("MYSQL 접속실패");
        console.log(error);
    }
    else{
        console.log("MYSQL 접속완료");
    }
});

app.get('/',function(request,response){
    //response.send('<h1>Hi</h1>');
    
    response.redirect('/main');
})

app.use(express.static(__dirname));

app.get('/main',function(request,response){
    //readFileSync 아님 ㅋ
    fs.readFile('main.html',function(error,data){
        if(error){
            console.log(error);
            response.send(error);
        }else{
        response.sendFile(__dirname +'./logo1.png')
        response.send(data.toString());
        console.log('main 포스트 진입');
        }
    })
    //console.log('main 포스트 진입');
})


const mainPage = fs.readFileSync('./bond1.ejs','utf8');

app.get('/bond1',function(request,response){
    var page = ejs.render(mainPage,{
        title : "For Bond 1 Year Credit "
    });

    response.send(page);
})


//DataBase 불러오기 _ bond_1_year
app.get('/bond',function(request,response){

    //Callback Function result : 배열 + json형태
    //이를 res.render() 함수에 세팅해서 전송
    connection_sql.query("SELECT * FROM bond_1_year",function(error,result,field){
        if(error){
            console.log("bond_1_year SQL QUERY ERROR");
            console.log(error);
        } else{
            for(var i=0; i<result.length; ++i){
                console.log(result[i].Days +"::"+ result[i].Bond_rate);

            //DataBase 접근 성공
            
            var page = ejs.render(mainPage,{
                title : "For 국채 1년물",
                data : result
                
            });
            response.send(page);
            }   
        }
    });
});


app.get('/dividend',function(request,response){
    //response.send('<h1>Hi</h1>');
    fs.readFile('./dividend.html',function(error,data){
        if(error){
            console.log('배당금에러');
            console.log(error);
        }
        else{
            response.send(data.toString());
        }
    })
})

app.get('/stockDetail',function(request,response){
    //response.send('<h1>Hi</h1>');
    fs.readFile('./stockDetail.html',function(error,data){
        if(error){
            console.log('주식상세에러');
            console.log(error);
        }
        else{
            response.send(data.toString());
        }
    })
})
/////////////////////////////////JungJun's Code
const signal = require('./signal.js');
app.get('/signal', function(request, response){
    connection_sql.query("SELECT * FROM BS",function(error,result,field){
        html = ``;
        for(let i = 1; i < result.length; i++){
            let power = parseFloat(result[i].bs);
            let show_power;
            if(power > 0.36 && power < 0.65) show_power = "Strong signal"
            else if(power != 0) show_power = "Weak signal"
            else show_power = "No signal"
            html += `<tr>
                <td>${result[i].name}</td>
                <td id="${result[i].name}_p">${show_power}</td>
                <td><button id=${result[i].name} onclick="favorites(this)">☆</button></td>
                </tr>
                `
        }
        response.send(signal.HTML(html));
    })
});
/*
app.get('/dividend', function(request, response){
    
        response.send(signal.HTML(html));
    })
});
*/
/////////////////////////////////


app.listen(3000,function(){
    console.log('Server is Running at 3000');
})