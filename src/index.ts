//The site has loaded. Let's append a PIXI context to the canvas
import * as PIXI from 'pixi.js'

const shader = document.getElementById("shader").innerText;

var uniforms = {zRotate: {
    type: "f",
    value: 0
}, xRotate: {
    type: "f",
    value: 0
}, yRotate: {
        type: "f",
        value: 0
},
};

const equiFilter = new PIXI.Filter('', shader, uniforms)

document.getElementById("generate").addEventListener("click", ()=>{
    const renderer = PIXI.autoDetectRenderer({
        width: 512,
        height: 512,
        backgroundColor: 0xffffff
    });
    const stage = new PIXI.Container();

    document.getElementById("canvasStorage").innerHTML = "";
    document.getElementById("canvasStorage").appendChild(renderer.view);


    const fileSelector: HTMLInputElement = <HTMLInputElement>document.getElementById("inputFile");
    const files = fileSelector.files;
    const blobURL = URL.createObjectURL(files[0]);
    console.log(blobURL)
    const logo = PIXI.Sprite.from(blobURL)
    logo.width = 512;
    logo.height = 512;
    logo.x = 512 / 2;
    logo.y = 512 / 2;
    logo.anchor.set(0.5);
    logo.filters = [equiFilter];
    stage.addChild(logo);
    setTimeout(() => {
        renderer.render(stage)
    }, 1000);

    
});