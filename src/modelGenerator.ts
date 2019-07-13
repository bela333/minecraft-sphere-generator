export function generate(resoluton: number, texturePrefix: string): object {

    var model = {
        "textures": {
            "u": `block/${texturePrefix}_up`,
            "d": `block/${texturePrefix}_down`,
            "n": `block/${texturePrefix}_north`,
            "s": `block/${texturePrefix}_south`,
            "w": `block/${texturePrefix}_west`,
            "e": `block/${texturePrefix}_east`,
        },
        "display": {
            "head": {
                "scale": [1.5, 1.5, 1.5]
            }
        },
        "ambientocclusion": false,
        "elements": <any[]>[]
    };

    function writeElement(x1: number, y1: number, z1: number, x2: number, y2: number, z2: number) {
        model.elements.push({
            "from": [x1, y1, z1],
            "to": [x2, y2, z2]
        })
    }

    const layerHeight = 16 / resoluton;

    //Generate layers of spheres
    /*for (let y = 0; y < resoluton/2; y++) {
        for (let x = 0; x < resoluton/2; x++) {
            for (let z = 0; z < resoluton/2; z++) {
                var convx = (x-(resoluton-1)/2)/(resoluton-1)*2
                var convy = (y-(resoluton-1)/2)/(resoluton-1)*2
                var convz = (z-(resoluton-1)/2)/(resoluton-1)*2
                if (convx**2+convy**2+convz**2 < 1) {
                    writeElement(x*layerHeight, y*layerHeight, z*layerHeight,
                                 (x+1)*layerHeight, (y+1)*layerHeight, (z+1)*layerHeight)
                }
            }
        }
    }*/
    for (let y = 0; y < resoluton / 2; y++) {
        for (let x = 0; x < resoluton / 2; x++) {
            var convx = (x - (resoluton - 1) / 2) / (resoluton - 1) * 2
            var convy = (y - (resoluton - 1) / 2) / (resoluton - 1) * 2
            var length = Math.sqrt(1 - convx ** 2 - convy ** 2);
            var zTemp = (length + 1) / 2 * resoluton;
            zTemp = Math.round(zTemp);
            var z = zTemp * 16 / resoluton;
            if (z * 0 == 0) {
                writeElement(x * layerHeight, y * layerHeight, 16 - z,
                    (x + 1) * layerHeight, (y + 1) * layerHeight, 8)
            }
        }
    }

    //Mirror
    for (let i = 0; i < model.elements.length; i++) {
        const element = model.elements[i];
        element.to[0] = 16 - element.from[0];
        element.to[1] = 16 - element.from[1];
        element.to[2] = 16 - element.from[2];
        model.elements[i] = element;

    }

    //Fix UV
    for (let i = 0; i < model.elements.length; i++) {
        const element = model.elements[i];
        var x1 = element.from[0];
        var y1 = element.from[1];
        var z1 = element.from[2];

        var x2 = element.to[0];
        var y2 = element.to[1];
        var z2 = element.to[2];
        element.faces = {
            "up": { "uv": [x1, z1, x2, z2], "texture": "#u" },
            "down": { "uv": [x1, z1, x2, z2], "texture": "#d" },
            "north": { "uv": [x1, y1, x2, y2], "texture": "#n" },
            "south": { "uv": [x1, y1, x2, y2], "texture": "#s" },
            "west": { "uv": [z1, y1, z2, y2], "texture": "#w" },
            "east": { "uv": [z1, y1, z2, y2], "texture": "#e" }
        };
        model.elements[i] = element;

    }

//Scale up model
/*for (let i = 0; i < model.elements.length; i++) {
    const element = model.elements[i];
    element.from[0] = element.from[0]*3-16;
    element.from[1] = element.from[1]*3-16;
    element.from[2] = element.from[2]*3-16;

    element.to[0] = element.to[0]*3-16;
    element.to[1] = element.to[1]*3-16;
    element.to[2] = element.to[2]*3-16;

}*/
    return model;
}