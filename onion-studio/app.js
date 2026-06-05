const edit = document.getElementById("edit");
const ectx = edit.getContext("2d");

const preview = document.getElementById("preview");
const pctx = preview.getContext("2d");

let frames = [createFrame()];
let current = 0;

const STORAGE_KEY = "anim_project_v1";
loadFromStorage();

let tool = "pen";
let drawing = false;
let x=0,y=0;

/* Frame */
function createFrame(){
    const c = document.createElement("canvas");
    c.width = 600;
    c.height = 400;
    return c;
}

function saveToStorage(){
    const data = frames.map(c => c.toDataURL("image/png"));
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
        frames: data,
        current,
        tool
    }));
}

function loadFromStorage(){
    const raw = localStorage.getItem(STORAGE_KEY);
    if(!raw) return;

    const data = JSON.parse(raw);

    frames = [];
    current = 0;

    let loaded = 0;

    data.frames.forEach(src => {
        const img = new Image();
        img.src = src;

        img.onload = () => {

            const c = createFrame();
            const ctx = c.getContext("2d");

            ctx.drawImage(img,0,0);

            frames.push(c);
            loaded++;

            if(loaded === data.frames.length){
                current = data.current || 0;
                tool = data.tool || "pen";
                render();
            }
        };
    });
}

/* Draw */
edit.addEventListener("mousedown", e=>{
    drawing = true;
    x=e.offsetX; y=e.offsetY;
});

edit.addEventListener("mousemove", e=>{
    if(!drawing) return;

    const ctx = frames[current].getContext("2d");

    ctx.lineWidth = +document.getElementById("size").value;
    ctx.lineCap = "round";

    if(tool==="pen"){
        ctx.strokeStyle = document.getElementById("color").value;
        ctx.globalCompositeOperation="source-over";
    }

    if(tool==="eraser"){
        ctx.globalCompositeOperation="destination-out";
    }

    ctx.beginPath();
    ctx.moveTo(x,y);
    ctx.lineTo(e.offsetX,e.offsetY);
    ctx.stroke();

    x=e.offsetX; y=e.offsetY;

    render();
    saveToStorage();
});

edit.addEventListener("mouseup",()=>drawing=false);


/* Frame (Funktionen) */
function addFrame(){
    frames.push(createFrame());
    current=frames.length-1;
    render();
    saveToStorage();
}

function deleteFrame(){
    if(frames.length<=1) return;
    frames.splice(current,1);
    current=Math.max(0,current-1);
    render();
    saveToStorage();
}

function duplicateFrame(){
    const c=createFrame();
    c.getContext("2d").drawImage(frames[current],0,0);
    frames.splice(current+1,0,c);
    current++;
    render();
    saveToStorage();
}

function newProject(){
    frames = [createFrame()];
    current = 0;
    tool = "pen";

    saveToStorage?.();
    render();
}

/* Preview */
function play(){
    let fps=+document.getElementById("fps").value;
    let i=0;

    function loop(){
        if(i>=frames.length) return;
        pctx.clearRect(0,0,600,400);
        pctx.drawImage(frames[i],0,0);
        i++;
        setTimeout(loop,1000/fps);
    }

    loop();
}

/* Tool */
function setTool(t){
    tool = t;

    document.querySelectorAll(".tool").forEach(btn => {
        btn.classList.remove("active");
    });

    if(t === "pen"){
        document.getElementById("penBtn").classList.add("active");
    }

    if(t === "eraser"){
        document.getElementById("eraserBtn").classList.add("active");
    }
}