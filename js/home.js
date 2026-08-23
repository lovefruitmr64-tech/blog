document.addEventListener("DOMContentLoaded",()=>{


const banner=document.querySelector(".home-banner");


if(!banner)return;


const slides=banner.querySelectorAll(".banner-item");

const dots=banner.querySelectorAll(".dot");


let index=0;



function showSlide(i){


slides.forEach(item=>{

item.classList.remove("active");

});


dots.forEach(item=>{

item.classList.remove("active");

});



slides[i].classList.add("active");

dots[i].classList.add("active");


index=i;


}



dots.forEach(dot=>{


dot.addEventListener("click",()=>{


showSlide(Number(dot.dataset.index));


});


});



setInterval(()=>{


index++;


if(index>=slides.length){

index=0;

}


showSlide(index);


},5000);



});