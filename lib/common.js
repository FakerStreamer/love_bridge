var HttpRequest = require("nebulas").HttpRequest;
var Neb = require("nebulas").Neb;
var Account = require("nebulas").Account;
var Transaction = require("nebulas").Transaction;
var Unit = require("nebulas").Unit;
var neb = new Neb();
neb.setRequest(new HttpRequest("https://mainnet.nebulas.io"));

var NebPay = require("nebpay");   
var nebPay = new NebPay();
var dappAddress = "n1gdPHyAurtCQb65sidpFVZ6qBkunoap8jj";

$('.popup').magnificPopup({
  type:'inline',
  fixedContentPos: true, 
  mainClass: 'mfp-fade',      
  showCloseBtn: true,
  closeOnBgClick: false
});   
$('.transaction').magnificPopup({
  type:'inline',
  fixedContentPos: true, 
  mainClass: 'mfp-fade',      
  showCloseBtn: true,
  closeOnBgClick: false
}); 

$('.bridge_mask').magnificPopup({
  type:'inline',
  fixedContentPos: true, 
  mainClass: 'mfp-fade',      
  showCloseBtn: true,
  closeOnBgClick: false
}); 

$('.bridge_mask').click(function(event){
  var offset = $(this).offset();
  x_coord = event.pageX - offset.left;
  y_coord = event.pageY - offset.top;
  $('.x').val(x_coord);
  $('.y').val(y_coord);
})

lock_color = '#0080c0';
hand_color = '#ff8040';

$('.item_input .hand').change(function(){
  hand_color = $(this).val();
  $('.color_picker .handle').css('stroke', hand_color);  
})

$('.item_input .body').change(function(){
  lock_color = $(this).val();
  $('.color_picker .body_body rect').css('fill', lock_color);  
})

window.onload = function(){         
  if(typeof(webExtensionWallet) === "undefined"){     
        $(".noExtension").show();   
        $(".content").hide();
    }else{
    }
};  

  var scrollbool = true;
  $('html, body, *').mousewheel(function(e, delta) { this.scrollLeft -= (delta * 40); e.preventDefault();});  

  $('.questions').mouseout(function(){
    scrollbool = false;    
    $('html, body, *').off("mousewheel");      
  });    
  $('.questions').mouseleave(function(){
    scrollbool = true;    
    $('html, body, *').off("mousewheel");      
    $('html, body, *').mousewheel(function(e, delta) { this.scrollLeft -= (delta * 40); e.preventDefault();});  
  });  


  $('.answer').fadeOut();
  $('.questions .item:first-child .answer').fadeIn();
  $('.questions .item:first-child .answer').addClass('visible');        

  $('.question').click(function(){
    if ($(this).parent().find('.answer').hasClass('visible')){
      $(this).parent().find('.answer').removeClass('visible')
      $(this).parent().find('.answer').fadeOut(300);
      return false;
    }
    $('.answer').fadeOut();    
    $(this).parent().find('.answer').fadeIn(300);        
    $(this).parent().find('.answer').addClass('visible');        
  })

$(document).ready(function(){        
  var txhash = '1dbf7d33a1813b24c57c5ead5f623a24e169f33325cc7c8bf432070d1a1a0c56';

  neb.api.getNebState().then(function(state) {    
  });

  neb.api.getAccountState({address: "n1cEGuVTeoQp7D8PCrShR9toybbmXeN7r8S"}).then(function(state) {  
  });
  
});


function renderLock(name1, name2, message, date, color1, color2, x, y){  
  var render = "<div class='lock' data-date=" + date + " style=\"top: " + y + "px; left: " + x + "px;\" data-name1=\"" + name1 + "\" data-name2=\"" + name2 + "\" data-message=\"" + message + "\"><div class='container'><svg version='1.1' id='Layer_2' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' width='100px' height='199.3px' viewBox='0 0 100 199.3' style='enable-background:new 0 0 200 199.3;' xml:space='preserve'><g class='for_hande'><path d='M16.1,100.10V39.9c0-18.4,14.9-33.3,33.3-33.3s33.3,14.9,33.3,33.30v106.8' class='handle' style=\"stroke: " + color2 + "\"></path></g></svg></div><div class='heart'></div><svg class='body_body' width='50' height='36'><rect x='0' y='0' fill=\"" + color1 + "\" width='50' height='36' rx='4'/></svg></div>"
  $('.locks').append(render);
}
  function cbRead(resp) {  
  var response = resp;  
  if (response === ''){           
      $(".errNetwork").show();    
      $(".content").hide();
    } else{             
      try{        
      }catch (err){       
      }
      if (!!response){          
      var real_resp = response;
      var real_parse = JSON.parse(real_resp.result);      

        $.each(real_parse,function(index,value){                               
          var name1 = real_parse[index].name1;
          var name2 = real_parse[index].name2;
          var message = real_parse[index].message;
          var date = real_parse[index].data;
          var color1 = real_parse[index].color1;
          var color2 = real_parse[index].color2;
          var x = real_parse[index].clickX;
          var y =real_parse[index].clickY;
          renderLock(name1, name2, message, date, color1, color2, x, y);
        });
      };
      $('.lock').click(function(){  
        $('#tooltip').show();
        var top = $(this).css('top');
        top = top.substring(0, top.length - 2);
        top = +top + 55;                
        var left = $(this).css('left');
        var from = $(this).attr('data-name1');
        var to = $(this).attr('data-name2');
        var message = $(this).attr('data-message');  
        var date =  $(this).attr('data-date');  
        $('#tooltip').css({"top": top,"left": left});
        $('#tooltip .names .name1_tool span').html(from);
        $('#tooltip .names .name2_tool span').html(to);
        $('#tooltip .mssg_tool').html(message);
        $('#tooltip .date_tool').html(date);    
      })
  }    
};

$('#tooltip').hide();

result_trans = 0;

 function cbAdd(resp) {        
    hash_value = resp.txhash;    

    if (resp.txhash == undefined) {
     } else {
       $('.transaction').trigger('click');
      $('.hash').html('txHash: <p>' + hash_value + '</p>');     
    } 

    setInterval(function(){
      neb.api.getTransactionReceipt({hash: hash_value}).then(function(receipt) {
        console.log('recepient: ' + JSON.stringify(receipt));
        result_trans = receipt.status;
        console.log('doing doing ');
        if (result_trans == 1) {
          $('.result_trans').html('sucess');    
          $('.result_trans').css('color', 'green');
          setTimeout(function(){ $('#transaction button').trigger('click') } , 2000);          
          var to = dappAddress;
          var value = 0;
          var callFunction = 'read';   
          var callArgs = '[]';    
          nebPay.simulateCall(to, value, callFunction, callArgs, { 
              listener: cbRead
          });             
        } else if (result_trans == 2) {          
          $('.result_trans').html('pending');    
          $('.result_trans').css('color', 'blue');
        } else {          
          $('.result_trans').html('fail');    
          $('.result_trans').css('color', 'red');
          setTimeout(function(){ $('#transaction button').trigger('click') } , 2000);          
        }
    })}, 1000);    
}


var to = dappAddress;
var value = 0;
var callFunction = 'read';   
var callArgs = '[]';    
nebPay.simulateCall(to, value, callFunction, callArgs, { 
    listener: cbRead
});   

  $('.item_input .hand').val('#ff8040');
  $('.color_picker .handle').css('stroke', 'rgb(255, 128, 64)');  



$('.item_input .body').val('#0080c0');
$('.color_picker .body_body rect').css('fill', 'rgb(0, 128, 192)');  


$('.push').click(function() {
  var to = dappAddress;
  var value = 0;
  var callFunction = 'push';     
  var name1 = $('.from').val();
  var name2 = $('.to').val();
  var message = $('.message').val();
  var date = new Date();
  var date_day = date.getDate();
  var date_month = date.getMonth() + 1;
  var date_year = date.getFullYear();
  date = date_day + "." + date_month + "." + date_year;
  var color1 = lock_color;
  var color2 = hand_color;
  var clickX = Math.round(x_coord) - 30;
  var clickY = Math.round(y_coord) - 39;
  var args = [];
  args.push(name1);
  args.push(name2);
  args.push(message);
  args.push(JSON.stringify(date));
  args.push(color1);
  args.push(color2);
  args.push(JSON.stringify(clickX));
  args.push(JSON.stringify(clickY));  
  var callArgs = JSON.stringify(args);        
  nebPay.call(to, value, callFunction, callArgs, { 
    listener: cbAdd
  });     
})

