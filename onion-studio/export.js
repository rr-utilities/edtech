/* JPG */
async function exportFrames(){

    const zip = new JSZip();

    const exportCanvas = document.createElement("canvas");
    const ctx = exportCanvas.getContext("2d");

    exportCanvas.width = 600;
    exportCanvas.height = 400;

    for(let i = 0; i < frames.length; i++){

        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0,0,600,400);

        for(let j = 0; j <= i; j++){
            ctx.drawImage(frames[j],0,0);
        }

        const dataURL = exportCanvas.toDataURL("image/jpeg", 0.95);

        const base64 = dataURL.split(",")[1];

        zip.file(
            `frame_${String(i+1).padStart(3,"0")}.jpg`,
            base64,
            {base64: true}
        );
    }

    const content = await zip.generateAsync({type:"blob"});

    const a = document.createElement("a");
    a.href = URL.createObjectURL(content);
    a.download = "frames.zip";
    a.click();
}

/* MP4 */
function getFPS(){
    return +document.getElementById("fps").value || 6;
}

function exportVideo(){

    const stream = preview.captureStream();
    const rec = new MediaRecorder(stream);

    let chunks = [];

    rec.ondataavailable = e => chunks.push(e.data);

    rec.onstop = () => {
        const blob = new Blob(chunks, { type: "video/mp4" });
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = "animation.mp4";
        a.click();
    };

    rec.start();

    let i = 0;
    let fps = getFPS();

    function loop(){

        if(i >= frames.length){
            rec.stop();
            return;
        }

        pctx.fillStyle = "#ffffff";
        pctx.fillRect(0,0,600,400);

        pctx.drawImage(frames[i],0,0);

        i++;

        setTimeout(loop, 1000 / fps);
    }

    loop();
}

/* Render */
function render(){

    ectx.clearRect(0,0,600,400);

    const MAX_VISIBLE = 4;

    for(let i=0;i<frames.length;i++){

        if(i > current) continue;

        let dist = current - i;

        if(dist > MAX_VISIBLE) continue;

        if(i === current){
            ectx.globalAlpha = 1;
            ectx.drawImage(frames[i],0,0);
            continue;
        }

        ectx.globalAlpha = Math.pow(0.35, dist);
        ectx.drawImage(frames[i],0,0);
    }

    ectx.globalAlpha = 1;

    updateUI();
}

function jump(d){
    current=Math.max(0,Math.min(frames.length-1,current+d));
    render();
}

/* UI */
function updateUI(){
    document.getElementById("info").innerText=
        (current+1)+" / "+frames.length;
}

/* INIT */
render();
updateUI();

/* Export-Import-Dock */
function exportProject(){

    const data = {
        fps: getFPS(),
        width: 600,
        height: 400,
        frames: []
    };

    for(let i = 0; i < frames.length; i++){

        const canvas = frames[i];

        if(!canvas || !canvas.toDataURL){
            console.error("Frame kaputt bei Index:", i);
            continue;
        }

        data.frames.push(canvas.toDataURL("image/png"));
    }

    const blob = new Blob(
        [JSON.stringify(data)],
        { type: "application/json" }
    );

    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "project.animjson";
    a.click();
    saveToStorage();
}

function resetState(){
    current = 0;
    tool = "pen";

    ectx.globalAlpha = 1;

    render();
    updateUI?.();
}

function importProject(event){

    const file = event.target.files[0];
    if(!file) return;

    const reader = new FileReader();

    reader.onload = async (e) => {

        const data = JSON.parse(e.target.result);

        const loadedFrames = [];

        for(let src of data.frames){

            const img = new Image();
            img.src = src;

            await new Promise(res => img.onload = res);

            const c = document.createElement("canvas");
            c.width = data.width;
            c.height = data.height;

            const ctx = c.getContext("2d");
            ctx.drawImage(img,0,0);

            loadedFrames.push(c);
        }

        frames = loadedFrames;
        saveToStorage();

        resetState();
    };

    reader.readAsText(file);
}