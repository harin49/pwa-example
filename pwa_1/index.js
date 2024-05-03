
if ('serviceWorker' in navigator){
    navigator.serviceWorker.register("/serviceWorker_1.js").then(() => console.log('SW_1 registered!'))
        .catch(err => console.log('Boo!', err));
} else{
    console.log("serviceWorker not supported")
}

const addImage = () =>{
    const img = document.createElement("img");
    img.src="/assets/sad.svg"
    img.width=500;
    img.height=600;
    const container = document.getElementById("c");
    console.log("container", container);
    container.appendChild(img);
    console.log("appended")
}


setTimeout(()=>{
    addImage();
}, 1000);