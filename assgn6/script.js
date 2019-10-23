//all this shit is in the product page
//original bun page la
//var num = document.getElementById("originalnum").value
//var frost = document.getElementById("originalfrost").value
//var img =

//document.getElementById("originalnum").addEventListener("change", updateProductPrice());
//document.getElementById("originalfrost").addEventListener("change", updateProductImg());

function updateProductPrice() {
  var num = document.getElementById("originalnum").value;
  if (num==="1") {
    document.getElementById("originalprice").textContent = "Price: $3.00";
  }
  if (num==="2") {
    document.getElementById("originalprice").textContent = "Price: $8.00";
  }
  if (num==="3") {
    document.getElementById("originalprice").textContent = "Price: $15.00";
  }
  if (num==="4") {
    document.getElementById("originalprice").textContent = "Price: $29.00";
  }
  //console.log(document.getElementById("originalnum").value);
  //document.getElementById("result").textContent = resultString;
}

function updateProductImg() {
  var frost = document.getElementById("originalfrost").value;
  //console.log(document.getElementById("originalnum").value);
  if (frost==="1") {
    document.getElementById("originalimg").style.filter="";
    //document.getElementById("originalimg").style.filter = "grayscale(100%)";
  }
  if (frost==="2") {
    document.getElementById("originalimg").style.filter="invert(27%) sepia(33%) saturate(300%)  hue-rotate(349deg) brightness(70%) contrast(94%)";
    //document.getElementById("originalimg").style.filter = "grayscale(100%)";
  }
  if (frost==="3") {
    document.getElementById("originalimg").style.filter="invert(27%) brightness(150%) contrast(94%)";
  }
  if (frost==="4") {
    document.getElementById("originalimg").style.filter="invert(35%) brightness(100%) contrast(200%)";
  }
}




function OriginalBun(amount, frosting) {
//thisname
  this.amount = amount;
  this.frosting = frosting;
  this.price=amount*2;
  this.image="https://cdn.glitch.com/71292837-6f1e-4027-a15a-135eda4dbd41%2FOriginal%20bun%20large.png?v=1569624125902";
}

function BlueberryBun(amount, frosting) {
  //thisname
  this.amount = amount;
  this.frosting = frosting;
  this.price=amount*2;
  this.image="https://images.unsplash.com/photo-1546977532-4a61683ea4a0?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=668&q=80";
}

function PumpkinBun(amount, frosting) {
  this.amount = amount;
  this.frosting = frosting;
  this.price=amount*2;
  this.image="https://images.unsplash.com/photo-1546977532-4a61683ea4a0?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=668&q=80";
}

function GFBun(amount, frosting) {
  this.amount = amount;
  this.frosting = frosting;
  this.price=amount*2;
  this.image="https://images.unsplash.com/photo-1546977532-4a61683ea4a0?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=668&q=80";
}

function PecanBun(amount, frosting) {
  this.amount = amount;
  this.frosting = frosting;
  this.price=amount*2;
  this.image="https://images.unsplash.com/photo-1546977532-4a61683ea4a0?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=668&q=80";
}

function WalnutBun(amount, frosting) {
  this.amount = amount;
  this.frosting = frosting;
  this.price=amount*2;
  this.image="https://images.unsplash.com/photo-1546977532-4a61683ea4a0?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=668&q=80";
}

var cart = [];

class Cart {
		constructor() {
		    this.list=[];
        this.length=[];
      }
      getItem(num) {
        return this.list[num];
      }
      addItem(item) {
        this.list[this.length]=item;
        this.length=this.length+1;
      }
}


function originaladd() {
  console.log("hmmm")
  var num= document.getElementById("originalnum").value;
  if (num==="1") {
    var price= 3;
    quantity="1";
  }
  else if (num==="2") {
    var price= 8;
    quantity="3";
  }
  else if (num==="3") {
    var price= 15;
    quantity="6";
  }
  else if (num==="4") {
    var price= 29;
    quantity="12";
  }
  var cartIcon=document.getElementById("carticonnum");
  console.log(cartIcon)
  cartIcon.style.visibility="visible";
  cartIcon.textContent=quantity;

  var frost= document.getElementById("originalfrost").value;
  //if (frost==="1")
  //new OriginalBun();
}






//each button for each bun has a different // ID
//myButtonOriginal = getElementById("buttonorginal")
//myButtonOriginal function onclick {}



//cart page only- onload
function onLoad() {
	  //put some shit here
	}
