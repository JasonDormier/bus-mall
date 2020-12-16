'use strict';

//global varibles
const container = document.getElementById('container');
const imgOneElement = document.getElementById('img-one');
const imgTwoElement = document.getElementById('img-two');
const imgThreeElement = document.getElementById('img-three');
const button = document.getElementById('button');
const ctx = document.getElementById('myChart').getContext('2d');
const retrievedProducts = localStorage.getItem('products');

//Varibles that change
let maxClicksAllowed = 25;
let actualClicks = 0;
let a, b, c, tempInd;

//all products array
let allProducts = [];
let imgHolder = [];

//GOAT CONSTRUCTOR
function Product(name, src = 'jpg') {
  this.name = name; //'bunny-goat'
  this.src = `imgs/${name}.${src}`; //'img/bunny-goat.jpg'
  this.views = 0;
  this.votes = 0;
  allProducts.push(this);
}

Product.prototype.logger = function () {
  console.log(this);

};

String.prototype.capitalize = function () {
  return this.charAt(0).toUpperCase() + this.slice(1);
};

if (retrievedProducts) {
  //this will break the code if we have no local storage with no if statement
  allProducts = JSON.parse(retrievedProducts);
  console.log(allProducts);
} else {

  //INSTANSATIONS
  new Product('bag');
  new Product('banana');
  new Product('bathroom');
  new Product('boots');
  new Product('breakfast');
  new Product('bubblegum');
  new Product('chair');
  new Product('cthulhu');
  new Product('dog-duck');
  new Product('dragon');
  new Product('pen');
  new Product('pet-sweep');
  new Product('scissors');
  new Product('shark');
  new Product('tauntaun');
  new Product('unicorn');
  new Product('usb', 'gif');
  new Product('sweep', 'png');
  new Product('water-can');
  new Product('wine-glass');
}
//DETERMINE WHICH PRODUCTS GET VIEWED

//document - this came from MDN docs math.random - link in readme
function getRandomIndex(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

function productViews(imgElement, productIndex) {
  imgElement.src = allProducts[productIndex].src;
  imgElement.alt = allProducts[productIndex].name;
  imgElement.title = allProducts[productIndex].name;
  allProducts[productIndex].views++;
}

//with two - we need validation - is product unique?
//assign a src, alt, and title to image
function pop() {
  a = imgHolder.pop();
  b = imgHolder.pop();
  c = imgHolder.pop();
  //console.log(`a:${a}, b:${b}, c:${c}`);
}

function renderProducts() {
  //while imgHolder array is less then 3 do stuff
  while (imgHolder.length <= 2) {
    //do while temp index number is the same as var a, b, or c, otherwise move along
    do {
      //assign random index of allProducts to var
      tempInd = getRandomIndex(allProducts.length);
      //console.log(`this is temp index ${tempInd}`);
      //console.log(imgHolder);

      //while imgHolder array includes a number already in our imgHolder get new number otherwise move along.
      while (imgHolder.includes(tempInd)) {
        tempInd = getRandomIndex(allProducts.length);
      }
    }
    //apart of dowhile loop
    while (tempInd === a || tempInd === b || tempInd === c);

    //all conditions met, push the temp index into our imgHolder array.
    imgHolder.push(tempInd);
  }

  // log a view in instance - view starts at 0 and get incremented with every view
  productViews(imgOneElement, imgHolder[0]);
  productViews(imgTwoElement, imgHolder[1]);
  productViews(imgThreeElement, imgHolder[2]);
}

function eventClick(event) {
  actualClicks++;
  let clickedProduct = event.target.title;
  //console.log(clickedProduct);

  //keep track of which image and number of clicks. increment the correct clicks/vote/like property.
  for (let i = 0; i < allProducts.length; i++) {
    if (clickedProduct === allProducts[i].name) {
      allProducts[i].votes++;
    }
  }

  pop();
  renderProducts();

  if (actualClicks === maxClicksAllowed) {

    container.removeEventListener('click', eventClick);
    button.addEventListener('click', buttonClick);

    //save to local storage  to persist completed datasets
    const stringifiedProducts = JSON.stringify(allProducts); //put the products in a box

    localStorage.setItem('products', stringifiedProducts);//need a key and value pair in a string



  }
}

function buttonClick() {
  console.log('View Results');
  renderChart();

}
//~~~~~~~~~JSCHARTS~~~~~~~~~~~~//
function renderChart() {
  let namesArray = [];
  let votesArray = [];
  let viewsArray = [];

  for (let i = 0; i < allProducts.length; i++) {
    namesArray.push(allProducts[i].name.capitalize());
    votesArray.push(allProducts[i].votes);
    viewsArray.push(allProducts[i].views);
    console.log(`
    names array: ${namesArray}
    votes array: ${votesArray}
    views aray:${viewsArray}`);
  }

  var myChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: namesArray,
      datasets: [{
        label: 'Number of Votes',
        data: votesArray,
        backgroundColor: 'rgba(72, 61, 139, 0.6)',
      },
      {
        label: 'Number of Views',
        data: viewsArray,
        backgroundColor: 'rgba(11, 7, 37, 0.6)',
      },]

    },
    options: {
      responsive: false,
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true
          }
        }]
      }
    }
  });
}

renderProducts();
//event listener attached to the containter
container.addEventListener('click', eventClick);
