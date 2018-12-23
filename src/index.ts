//The site has loaded. Let's append a PIXI context to the canvas
import * as PIXI from 'pixi.js'
import { generate } from "./modelGenerator";
import * as JSZip from "jszip";
import { saveAs } from "file-saver";

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
    const fileSelector: HTMLInputElement = <HTMLInputElement>document.getElementById("inputFile");
    const files = fileSelector.files;
    if (files.length > 0) {
        
    
    const renderer = PIXI.autoDetectRenderer({
        width: 512,
        height: 512,
        backgroundColor: 0xffffff
    });
    const stage = new PIXI.Container();

    document.getElementById("canvasStorage").innerHTML = "";
    document.getElementById("canvasStorage").appendChild(renderer.view);

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
        //Render all textures
        generateSphereWithTexture(renderer, stage);

        
    }, 1000);

}else{
        const resolution = Number((<HTMLInputElement>document.getElementById("res")).value);
        const name = (<HTMLInputElement>document.getElementById("name")).value;
        generateSphere(resolution, name, null);
}
});

async function generateSphereWithTexture(renderer: PIXI.WebGLRenderer | PIXI.CanvasRenderer, stage: PIXI.Container) {
    var views: { name: string, texture: Blob }[] = [];
    const name = (<HTMLInputElement>document.getElementById("name")).value;
    views.push(await generateView(renderer, stage, 0, 0, Math.PI, `${name}_down`))
    views.push(await generateView(renderer, stage, Math.PI, 0, Math.PI, `${name}_up`))
    views.push(await generateView(renderer, stage, Math.PI/2, 0, 0, `${name}_north`))
    views.push(await generateView(renderer, stage, Math.PI / 2, 0, Math.PI / 2, `${name}_west`))
    views.push(await generateView(renderer, stage, Math.PI / 2, 0, Math.PI, `${name}_south`))
    views.push(await generateView(renderer, stage, Math.PI / 2, 0, Math.PI * 3 / 2, `${name}_east`))
    const resolution = Number((<HTMLInputElement>document.getElementById("res")).value);
    
    generateSphere(resolution, name, views);

}

async function generateView(renderer: PIXI.WebGLRenderer | PIXI.CanvasRenderer, stage: PIXI.Container, x: number, y: number, z: number, name: string): Promise<{ name: string, texture: Blob }> {
    var view = <{ name: string, texture: Blob }>{};
    equiFilter.uniforms.xRotate = x;
    equiFilter.uniforms.yRotate = y;
    equiFilter.uniforms.zRotate = z;
    renderer.render(stage)
    const texture = await new Promise<Blob>((resolve)=>{
        renderer.view.toBlob((content: Blob)=>{
            resolve(content)
        }, "image/png")
    })
    view.name = name;
    view.texture = texture;
    return view;
}


function generateSphere(resolution: number, name: string, views: { name: string, texture: Blob }[]) {
    //Generate sphere model
    const model = generate(resolution, name);
    //Create new ZIP file
    const zip = new JSZip();
    zip.file("pack.mcmeta", JSON.stringify({
        "pack": {
            "pack_format": 4,
            "description": `${name} resource pack`
        }
    }))
    //Add model file
    zip.folder("assets/minecraft/models/block").file(`${name}.json`, JSON.stringify(model));
    //Add views
    if (views) {
        const texturesFolder = zip.folder("assets/minecraft/textures/block")
        views.forEach(view => {
            texturesFolder.file(`${view.name}.png`, view.texture);
        });
    }
    //Export ZIP file
    zip.generateAsync({type: "blob"}).then((content: Blob)=>{
        saveAs(content, `${name}.zip`);
    })
}