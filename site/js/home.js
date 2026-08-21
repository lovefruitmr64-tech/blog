const bannerImages = [


"/blog/assets/images/10001.jpg",

"/blog/assets/images/10002.jpg"


];


let bannerIndex = 0;



function changeBanner(){


const banner = document.querySelector(
".home-banner"
);



if(!banner){

return;

}



banner.style.backgroundImage =

`url(${bannerImages[bannerIndex]})`;



bannerIndex++;



if(bannerIndex >= bannerImages.length){


bannerIndex = 0;


}



}



changeBanner();



setInterval(
changeBanner,
5000
);