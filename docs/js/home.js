document.addEventListener("DOMContentLoaded",()=>{


const banner=document.querySelector(".home-banner");


if(!banner)return;



const slides=banner.querySelectorAll(".banner-item");

const dots=banner.querySelectorAll(".dot");



let index=0;

let startX=0;

let autoPlay;



function showSlide(i){


slides.forEach(slide=>{

slide.classList.remove("active");

});


dots.forEach(dot=>{

dot.classList.remove("active");

});



slides[i].classList.add("active");

dots[i].classList.add("active");


index=i;


}




/* 点击圆点 */


dots.forEach(dot=>{


dot.addEventListener("click",()=>{


showSlide(Number(dot.dataset.index));


resetAuto();


});


});





/* 自动播放 */


function startAuto(){


autoPlay=setInterval(()=>{


index++;


if(index>=slides.length){

index=0;

}


showSlide(index);


},5000);


}



function resetAuto(){


clearInterval(autoPlay);

startAuto();


}





/* ===========================
   鼠标拖动
=========================== */


banner.addEventListener("mousedown",e=>{


startX=e.clientX;


});




banner.addEventListener("mouseup",e=>{


let distance=e.clientX-startX;



if(distance < -80){


index++;


if(index>=slides.length){

index=0;

}


showSlide(index);


resetAuto();


}



if(distance > 80){


index--;


if(index<0){

index=slides.length-1;

}


showSlide(index);


resetAuto();


}


});





/* ===========================
   手机滑动
=========================== */


banner.addEventListener("touchstart",e=>{


startX=e.touches[0].clientX;


},{passive:true});





banner.addEventListener("touchend",e=>{


let endX=e.changedTouches[0].clientX;


let distance=endX-startX;




if(distance < -80){


index++;


if(index>=slides.length){

index=0;

}


showSlide(index);


resetAuto();


}




if(distance >80){


index--;


if(index<0){

index=slides.length-1;

}


showSlide(index);


resetAuto();


}



},{passive:true});





startAuto();



});