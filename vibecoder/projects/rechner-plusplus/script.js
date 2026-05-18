function bruchOp(op) {
    let a=+document.getElementById("a").value,
        b=+document.getElementById("b").value,
        c=+document.getElementById("c").value,
        d=+document.getElementById("d").value;

    let z=0,n=0;
    switch(op){
        case '+': z=a*d + c*b; n=b*d; break;
        case '-': z=a*d - c*b; n=b*d; break;
        case '*': z=a*c; n=b*d; break;
        case '/': z=a*d; n=b*c; break;
    }

    function ggt(x,y){ return y ? ggt(y,x%y) : x; }
    let teiler = ggt(Math.abs(z), Math.abs(n));
    z = z/teiler;
    n = n/teiler;

    if(n===1) {
        bruchOut.innerHTML = z;
    } else {
        bruchOut.innerHTML = `
            <div style="display:inline-block; text-align:center;">
                <div>${z}</div>
                <div style="border-top:1px solid black;">${n}</div>
            </div>
        `;
    }
}

function potenzWurzel() {
    let baseV = document.getElementById("base").value;
    let expV = document.getElementById("exp").value;
    let radV = document.getElementById("rad").value;

    let res;

    if(baseV) { 
        let expNum = expV ? +expV : 1;
        res = Math.pow(+baseV, expNum);
        potOut.innerText = baseV + "^" + expNum + " = " + res;
    } else if(radV) {
        let wurzExp = expV ? +expV : 2;
        res = Math.pow(+radV, 1/wurzExp);
        potOut.innerText = wurzExp + "√" + radV + " = " + res;
    } else {
        potOut.innerText = "Keine Lösung.";
    }
}

function linear() {
    let a=+document.getElementById("la").value;
    let b=+document.getElementById("lb").value;
    linOut.innerText = "x = "+(-b/a);
}

function quad() {
    let a=+document.getElementById("qa").value;
    let b=+document.getElementById("qb").value;
    let c=+document.getElementById("qc").value;
    let D=b*b-4*a*c;
    if(D<0) quadOut.innerText="Keine Lösung.";
    else {
        let x1=(-b+Math.sqrt(D))/(2*a);
        let x2=(-b-Math.sqrt(D))/(2*a);
        quadOut.innerText="x1="+x1+", x2="+x2;
    }
}

function addLGS() {
    let div=document.createElement("div");
    div.className="eqRow";
    div.innerHTML='<input placeholder="a" class="a"><input placeholder="b" class="b"><input placeholder="c" class="c">';
    document.getElementById("lgsInputs").appendChild(div);
}

function lgs() {
    let rows=document.querySelectorAll("#lgsInputs .eqRow");
    let A=[],B=[];
    rows.forEach(r=>{
        let a=+r.querySelector(".a").value;
        let b=+r.querySelector(".b").value;
        let c=+r.querySelector(".c").value;
        A.push([a,b]); B.push(c);
    });

    if(A.length==2){
        let det=A[0][0]*A[1][1]-A[1][0]*A[0][1];
        if(det==0){ lgsOut.innerText="Keine eindeutige Lösung."; return; }
        let x=(B[0]*A[1][1]-B[1]*A[0][1])/det;
        let y=(A[0][0]*B[1]-A[1][0]*B[0])/det;
        lgsOut.innerText="x="+x+", y="+y;
    } else {
        lgsOut.innerText="error";
    }
}

function horner() {
    let input = document.getElementById("poly").value.trim();
    if(!input){ 
        hornerOut.innerText = "Keine Lösung."; 
        return; 
    }

    let coeffs = input.split(",").map(x => {
        let n = Number(x.trim());
        return isNaN(n) ? null : n;
    });

    if(coeffs.includes(null)){
        hornerOut.innerText = "Keine Lösung.";
        return;
    }

    let zeros = [];
    for(let x=-20; x<=20; x++){
        let res = coeffs[0];
        for(let i=1; i<coeffs.length; i++){
            res = res*x + coeffs[i];
        }
        if(res === 0) zeros.push(x);
    }

    if(zeros.length > 0){
        hornerOut.innerText = "Ganzzahlige Nullstellen: " + zeros.join(", ");
    } else {
        hornerOut.innerText = "Keine ganzzahligen Nullstellen gefunden.";
    }
}

function logExp() {
    let baseInput = document.getElementById("logBase").value.trim();
    let b = +document.getElementById("logB").value;

    if(!b || b <= 0){ logOut.innerText="Keine Lösung."; return; }

    let a;
    let isNatural = false;

    if(baseInput.toLowerCase() === "e") {
        a = Math.E;
        isNatural = true;
    } else {
        a = +baseInput;
        if(a <= 0 || a === 1){ logOut.innerText="Keine Lösung."; return; }
    }

    let x = Math.log(b)/Math.log(a);
    if(isNatural){
        logOut.innerText = `ln(${b}) ≈ ${x.toFixed(4)}`;
    } else {
        logOut.innerText = `log_${a}(${b}) ≈ ${x.toFixed(4)}`;
    }
}