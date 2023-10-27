async function retrievePatch(){
    let data= await fetch("")
    
    
}
/*
dta=[
        {
            'title':"aa",
            'desc':"cosas"
        },
        {
            'title':"a2",
            'desc':"cosas2"
        }
    ]  
*/


window.onload=()=>{
    console.log(data==undefined);
    h2=document.getElementById("h2Padre")
    data.forEach(element => {
        titl=document.createElement("h2")
        p=document.createElement("p")
        titl.innerText=element.title
        p.innerText=element.desc
        section=document.createElement("section")
        section.append(titl)
        section.append(p)
        h2.append(section)
        
    });
    console.log("aa");
}