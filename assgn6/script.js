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




function OriginalBun(amount, price, frosting) {
  this.name= "Original Bun";
  this.amount = amount; //value for drop down
  this.frosting = frosting; //value for drop down
  this.price=price;
  this.image="https://cdn.glitch.com/0711cce2-3511-41d0-a93f-48a3c98c8b83%2Fblackberrybunsmall.png?v=1571774610297";
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
//

function originaladd() {
  console.log("hmmm")
  var num= document.getElementById("originalnum").value;
  if (num==="1") {
    var price= 3;
    var quantity="1";
  }
  else if (num==="2") {
    var price= 8;
    var quantity="3";
  }
  else if (num==="3") {
    var price= 15;
    var quantity="6";
  }
  else if (num==="4") {
    var price= 29;
    var quantity="12";
  }

  var frost= document.getElementById("originalfrost").value;
  var cart=JSON.parse(localStorage.getItem("myCart"));
  console.log(cart);
  cart.push(new OriginalBun(num, price, frost));
  localStorage.setItem("myCart", JSON.stringify(cart));
  updateCartIcon();
  location.reload();
}

//come back to this shit later
function loadPP(){
  if (localStorage.getItem("myCart") != null) {
    var cart=JSON.parse(localStorage.getItem("myCart"));
    updateCartIcon();
  }
  else {
    var cart=[];
    localStorage.setItem("myCart", JSON.stringify(cart))
  }
}

function loadCart(){
  var priceTotal=0;
  if (localStorage.getItem("myCart") != null) {
    updateCartIcon();
    var cart=JSON.parse(localStorage.getItem("myCart"));
    //update cart num here

    for (i = 0; i < cart.length; i++) {
      var bun=cart[i];
      if (i===0) {
        priceTotal+=bun.price;
        console.log(bun.name)
        document.getElementById("originalname").textContent=(bun.name);
        document.getElementById("cartimg").setAttribute("src",bun.image);
        document.getElementById("originalnum").value = bun.amount;
        document.getElementById("originalfrost").value = bun.frosting;
        document.getElementById("cartitem").style.visibility="visible";
        document.getElementById("cartitem").children[6].innerHTML += bun.price.toFixed(2);
      }
      else {
        var img = document.getElementById("cartimg");
        var imgClone = img.cloneNode(true);
        var grid = document.getElementById("containerpp");
        grid.appendChild(imgClone);
        imgClone.style.gridRowStart= 2 +2*i;
        imgClone.style.gridRowEnd= 2+(2*(i+1));
        imgClone.setAttribute("src",bun.image);
        var text = document.getElementById("cartitem");
        var textClone = text.cloneNode(true);
        textClone.id = "cartitem"+i;
        grid.appendChild(textClone);
        textClone.style.gridRowStart= 2 +2*i;
        textClone.style.gridRowEnd= 2+(2*(i+1));
        var box= document.getElementById("cartitem"+i);
        box.children[0].textContent=(bun.name);
        box.children[2].value = bun.frosting;
        box.children[5].value = bun.frosting;
        box.children[6].innerHTML="<a>Duplicate</a> | <a onclick=\"deleteItem(" + i+ ")\">Remove</a> | Price:$"+bun.price.toFixed(2);
        priceTotal+=bun.price;

      }
    }
  }
  else {
    console.log("nocart")
  }
  document.getElementById("priceorder").textContent="Order Total: $"+ priceTotal.toFixed(2);
  document.getElementById("pricetax").textContent="Tax: $" + (priceTotal*.075).toFixed(2);
  document.getElementById("pricetotal").textContent="Estimated Total: $" + (priceTotal*1.075).toFixed(2);

}

function updateCartIcon(){
  var cart=JSON.parse(localStorage.getItem("myCart"));
  quantity=0;
  for (i = 0; i < cart.length; i++) {
    var num = cart[i].amount;
    if (num==="1") {quantity+=1;}
    else if (num==="2") {quantity+=3;}
    else if (num==="3") {quantity+=6;}
    else if (num==="4") {quantity+=12;}
  }
  var cartIcon=document.getElementById("carticonnum");
  cartIcon.style.visibility="visible";
  cartIcon.textContent=quantity;
}

function deleteItem(i){
  var cart=JSON.parse(localStorage.getItem("myCart"));
  cart.splice(i,1);
  localStorage.setItem("myCart", JSON.stringify(cart))
  location.reload();
}

//each button for each bun has a different // ID
//myButtonOriginal = getElementById("buttonorginal")
//myButtonOriginal function onclick {}

function updateCar(num) {

  var imgcar= ["https://cdn.glitch.com/71292837-6f1e-4027-a15a-135eda4dbd41%2FOriginal%20bun%20large.png?v=1569624125902","https://cdn.glitch.com/0711cce2-3511-41d0-a93f-48a3c98c8b83%2Fbun4.png?v=1570065664718","https://cdn.glitch.com/71292837-6f1e-4027-a15a-135eda4dbd41%2FOriginal%20bun%20large.png?v=1569624125902","https://cdn.glitch.com/0711cce2-3511-41d0-a93f-48a3c98c8b83%2Fbun4.png?v=1570065664718"];
}



//cart page only- onload
