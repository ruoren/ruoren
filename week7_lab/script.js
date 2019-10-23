function SnowLeopard(name, age) {
  this.name = name;
  this.age = age;
  this.type="Snow Leopard";
  this.image="https://images.unsplash.com/photo-1546977532-4a61683ea4a0?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=668&q=80";
}

function Gecko(name, age) {
  this.name = name;
  this.age = age;
  this.type="Spotted Gecko";
  this.image="https://images.unsplash.com/photo-1557957001-cd2f7968581c?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1349&q=80";
}

function ArcticFox(name, age) {
  this.name = name;
  this.age = age;
  this.type="Arctic Fox";
  this.image="https://images.unsplash.com/photo-1470093851219-69951fcbb533?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80";
}

var animals = [new SnowLeopard(), new Gecko(), new ArcticFox()];
var names = ['Mina', 'Nugu', 'Mimi'];

function generateRandomIndex(maxIndex){
  return(Math.floor(Math.random() * maxIndex));
}

//names.length is maxIndex
function generateRandomName(names){
  var randomIndex = generateRandomIndex(names.length);
  return names[randomIndex];
}

function generateRandomAge(){
  return generateRandomIndex(10);
}

function generateRandomAnimal(animals){
  var randomIndex = generateRandomIndex(animals.length);
  var randomAnimal =  animals[randomIndex];
  if (randomAnimal instanceof Gecko){
    return new Gecko(generateRandomName(names), generateRandomAge());
  }
  else if (randomAnimal instanceof SnowLeopard) {
    return new SnowLeopard(generateRandomName(names), generateRandomAge());
  }
  else {
    return new ArcticFox(generateRandomName(names), generateRandomAge());
  }
}

var randomAnimal = generateRandomAnimal(animals);

function onLoad() {
	  var animal = generateRandomAnimal(animals);
     document.getElementById("animalpix").setAttribute("src", animal.image)
	}
