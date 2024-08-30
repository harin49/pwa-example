
if ('serviceWorker' in navigator){
    navigator.serviceWorker.register("/serviceWorker_2.js").then(() => console.log('SW_2 registered!'))
        .catch(err => console.log('Boo! service worker 2', err));
} else{
    console.log("serviceWorker not supported")
}

const addImage = () =>{
    const img = document.createElement("img");
    img.src="/assets/happy.svg"
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