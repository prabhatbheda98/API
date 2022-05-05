
const sharp = require("sharp");
const fs = require("fs");
//const json = require('./data/frame1/frame1.json');


exports.generateImages = async (req, res, next) => {

    let { phone, email, website, frame, address, userlogo, name } = req.body
    $availableSizes = ['1080x1080', '1200x1200', '1080x1920', '1200x630', '1200x675']
    let generatedFrames = {};
    let watermark = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAXgAAACOCAYAAAA7IRMWAAAACXBIWXMAAAuJAAALiQE3ycutAAAGvWlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNi4wLWMwMDIgNzkuMTY0NDg4LCAyMDIwLzA3LzEwLTIyOjA2OjUzICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdEV2dD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlRXZlbnQjIiB4bWxuczpwaG90b3Nob3A9Imh0dHA6Ly9ucy5hZG9iZS5jb20vcGhvdG9zaG9wLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgMjIuMCAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDIyLTAxLTI5VDEyOjQ3OjQwKzA1OjMwIiB4bXA6TWV0YWRhdGFEYXRlPSIyMDIyLTAxLTI5VDEyOjQ3OjQwKzA1OjMwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAyMi0wMS0yOVQxMjo0Nzo0MCswNTozMCIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDowNTNhZDNmYS03ZjA5LWI4NGEtOWFiYy1jY2QxZWNmYjZhMGUiIHhtcE1NOkRvY3VtZW50SUQ9ImFkb2JlOmRvY2lkOnBob3Rvc2hvcDo5OGUyODA0Zi0xZjc1LTgwNDEtODQ5Yy01MDkxMDZmZjFmNzAiIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo0OTI4ODY0NC00YmY5LWY3NDItOTRhYS1mOTMzNGI2Yjk0YmIiIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiIHBob3Rvc2hvcDpJQ0NQcm9maWxlPSJzUkdCIElFQzYxOTY2LTIuMSIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciPiA8eG1wTU06SGlzdG9yeT4gPHJkZjpTZXE+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJjcmVhdGVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOjQ5Mjg4NjQ0LTRiZjktZjc0Mi05NGFhLWY5MzM0YjZiOTRiYiIgc3RFdnQ6d2hlbj0iMjAyMi0wMS0yOVQxMjo0Nzo0MCswNTozMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIDIyLjAgKFdpbmRvd3MpIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDowNTNhZDNmYS03ZjA5LWI4NGEtOWFiYy1jY2QxZWNmYjZhMGUiIHN0RXZ0OndoZW49IjIwMjItMDEtMjlUMTI6NDc6NDArMDU6MzAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCAyMi4wIChXaW5kb3dzKSIgc3RFdnQ6Y2hhbmdlZD0iLyIvPiA8L3JkZjpTZXE+IDwveG1wTU06SGlzdG9yeT4gPHBob3Rvc2hvcDpUZXh0TGF5ZXJzPiA8cmRmOkJhZz4gPHJkZjpsaSBwaG90b3Nob3A6TGF5ZXJOYW1lPSJCQU5ORVIiIHBob3Rvc2hvcDpMYXllclRleHQ9IkJBTk5FUiIvPiA8cmRmOmxpIHBob3Rvc2hvcDpMYXllck5hbWU9Ik1BU1RFUiIgcGhvdG9zaG9wOkxheWVyVGV4dD0iTUFTVEVSIi8+IDwvcmRmOkJhZz4gPC9waG90b3Nob3A6VGV4dExheWVycz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz4dTyE7AAAQ10lEQVR4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"

    await Promise.all($availableSizes.map(async (element) => {

        let configJson = require('./data/' + frame + '/config.json');
        let size = element.split("x");
        let frame_json = configJson[element];

        if (!frame_json) {
            return res.send("data not match")
        }  
   
        let phoneWithSymbol, emailWithSymbol, websiteWithSymbol, addressWithSymbol;
        if (frame === "frame5") {
            phoneWithSymbol = phone ? '✽ ' + phone : '';
            emailWithSymbol = email ? email + ' ☑ ' : '';
            websiteWithSymbol = website ? website + ' ☺' : '';
            addressWithSymbol = address ? address + ' ➒ ' : '';
        } else {
            phoneWithSymbol = phone ? '✽ ' + phone : '';
            emailWithSymbol = email ? '☑ ' + email : '';
            websiteWithSymbol = website ? '☺ ' + website : '';
            addressWithSymbol = address ? '➒ ' + address : '';
        }

        /////////
        let splitString = [];
        for (let i = 0; i < addressWithSymbol.length; i = i + 40) {
            splitString.push(addressWithSymbol.slice(i, i + 40));
        }
        // console.log(splitString);
        ////////

        let logowitname = !userlogo ? `<text x="${frame_json.logo?.x || ''}px"  font-weight="800" y="${frame_json.logo?.y || ''}px" style="fill: ${frame_json.name?.['font-color'] || ''}" text-anchor="middle" class="address">${name || ''}</text>` : `<image id="logo" x="${frame_json.logo.x}" y="${frame_json.logo.y}" width="110" height="130" xlink:href="${userlogo}"/>`;
       
        let svgImage = `<svg width="${size[0]}" height="${size[1]}"  xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" >
        <style>
            .phone{ font-size: ${frame_json.phone?.['font-size'] || ''};font-family: ${frame_json.phone?.['font-family'] || ''};   }
            .email{ font-size: ${frame_json.email?.['font-size'] || ''}; font-family: ${frame_json.email?.['font-family'] || ''};  }
            .website{ font-size: ${frame_json.website?.['font-size'] || ''}; font-family: ${frame_json.website?.['font-family'] || ''}; }
            .address{ font-size: ${frame_json.address?.['font-size'] || ''}; font-family: ${frame_json.address?.['font-family'] || ''}; } 
        </style>    
        
          
        <text x="${frame_json.phone?.x || ''}px"    font-weight="800"  y="${frame_json.phone?.y || ''}px" style="fill: ${frame_json.phone?.['font-color'] || ''};" text-anchor="start" class="phone">${phoneWithSymbol || ''}</text>
        <text x="${frame_json.email?.x || ''}px"    font-weight="800" y="${frame_json.email?.y || ''}px" style="fill: ${frame_json.email?.['font-color'] || ''};" text-anchor="start" class="email">${emailWithSymbol || ''}</text>
        <text x="${frame_json.website?.x || ''}px"  font-weight="800" y="${frame_json.website?.y || ''}px" style="fill: ${frame_json.website?.['font-color'] || ''}" text-anchor="start" class="website">${websiteWithSymbol || ''}</text>
        <text x="${frame_json.address?.x || ''}px"  font-weight="800" y="${frame_json.address?.y || ''}px" style="fill: ${frame_json.address?.['font-color'] || ''}" text-anchor="start" class="address"> ${addressWithSymbol || ''} </text>
        

        ${logowitname}
        <image id="logo" x="${frame_json.logo.x}" y="${frame_json.logo.y}" width="110" height="130" xlink:href="${userlogo}"/>
        <image id="watermark" x="${frame_json.watermark.x}" y="${frame_json.watermark.y}" width="200" height="240" xlink:href="${watermark}"/>
       

        </svg>`;
        let svgBuffer = Buffer.from(svgImage);
        let outputPath = `./tmp/${new Date().toISOString().split('T')[0]}/`;
        const dirExist = async (dir) => {
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir);
            }
        };
        dirExist(outputPath);
        // let outputPath = `./tmp/20/`;
        // console.log(outputPath);
        // let filename = element+uuidv4()+'.png';
        let filename = element + '.png';
        //dirExist('./tmp');
        //dirExist('./'+outputPath);
        try {
            let image = await sharp(`data/${frame}/${element}.png`)
                .composite([
                    {
                        input: svgBuffer,
                        top: 0,
                        left: 0,
                    },
                ]).toFile(`${outputPath}${filename}`);
            //generatedFrames[element] = `${config[NODE_ENV].apiHost}/event-master${outputPath}${filename}`;
        } catch (error) {
            return console.log(error);
        }
    }));
    return res.send({ generatedFrames, message: "Image create successfully.!" });
}





exports.getImgOld = async (req, res, next) => {
    try {
        const { name, phone, email, website } = req.query
        console.log(req.query)
        $availableSizes = ['1080x1080', '1200x1200', '1080x1920', '1200x630', '1200x675']
        $availableSizes.forEach(async (element) => {
            try {
                let size = element.split("x");
                // console.log($element)
                let frame_json = json[element];

                if (!frame_json) {
                    return res.send("data not match")
                }

                let svgImage = `<svg width="${size[0]}" height="${size[1]}"  xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" >
                <style>
                    .name { font-size: ${frame_json.name['font-size']}; font-color: ${frame_json.name['font-color']}; font-family: ${frame_json.name['font-family']}; }
                    .phone{ font-size: ${frame_json.phone['font-size']}; font-color: ${frame_json.phone['font-color']};font-family: ${frame_json.phone['font-family']};  }
                    .email{ font-size: ${frame_json.email['font-size']}; font-color: ${frame_json.email['font-color']};font-family: ${frame_json.email['font-family']};  }
                    .website{ font-size: ${frame_json.website['font-size']}; font-color: ${frame_json.website['font-color']};font-family: ${frame_json.website['font-family']}; }
                </style>
                
            
                <text x="${frame_json.name.x}px"  font-weight="800" y="${frame_json.name.y}px" text-anchor="middle" style="fill: ${frame_json.name['font-color']}" class="name"> ${name || ''}</text>
                <text x="${frame_json.phone.x}px" font-weight="800" y="${frame_json.phone.y}px" style="fill: ${frame_json.phone['font-color']}" text-anchor="middle" class="phone">${phone || ''}</text>
                <text x="${frame_json.email.x}px"  font-weight="800" y="${frame_json.email.y}px" style="fill: ${frame_json.email['font-color']}" text-anchor="middle" class="email">${email || ''}</text>
                <text x="${frame_json.website.x}px"  font-weight="800" y="${frame_json.website.y}px" style="fill: ${frame_json.website['font-color']}" text-anchor="middle" class="website">${website || ''}</text>

                <image id="logo" x="${frame_json.logo.x}" y="${frame_json.logo.y}" width="130" height="140" xlink:href="${json.icons.logo}"/>
              
                </svg>`;

                let svgBuffer = Buffer.from(svgImage);
                let image = await sharp(`./data/frame1/${element}.png`)
                    .composite([
                        {
                            input: svgBuffer,
                            top: 0,
                            left: 0,
                        },
                    ])
                image.toFile(`${element}.png`);
                return image;
            } catch (error) {
                return console.log(error);
            }
        });
        // consol.log(element)
        return res.send({ message: "Image create successfully.!" });
    } catch (error) {
        return console.log(error);
    }
}
