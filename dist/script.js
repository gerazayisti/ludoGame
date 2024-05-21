let deactivate
let deid
let declass
const stopage=[1,9,14,22,27,35,40,48]
let audio = new Audio('audio/dice-142528.mp3');
let audioMove = new Audio('audio/projector-button-push-6258.mp3');
class Player{
    constructor(el,start,end,stripStart){
        this.playerStatus= false
        this.winnerid=new Array(4).fill(false)
        this.color=el
        this.status = new Array(4).fill(false)
        this.id = new Array(4)
        this.start=start
        this.stripStart = stripStart
        this.end=end
        let elements = document.getElementsByClassName(el)
        for(let i = 0; i < elements.length; i++)
            {
            this.id[i]=elements[i]
            console.log(this.id[i])
            console.log(this.id[i].id)
            }
        
        this.steps = new Array(4).fill(0)
        }
    setsubStatus(i){
        this.status[i]=false
    }
    setSteps(i){
        this.steps[i]=0
    }
    checkStatus(){
        let flag =false
        for(let i=0; i<4; i++){
            if(this.status[i]==true){
                flag = true
            }
           
        }
        if(flag==false){
            this.playerStatus=false
        }
    }
    
    setStatus(){
        this.playerStatus=true
    }
    getStatus(){
        return this.playerStatus
    }
    getElementStatus(val){
        return this.status[val]
    }

    activatePlayer(){
        for(let i=0; i<4; i++){
            this.id[i].disabled=false
            this.id[i].classList.add("btnzoom")
            console.log(this.id[i])
        }
        btn.disabled=false
        return
    }
    openMove(el){
        for(let i = 0; i<4; i++){
            if(this.id[i].id==el){
                this.status[i]=true
                console.log(this.id[i])
                let ele = document.getElementById(this.start)
 
                console.log(ele)
               
                ele.appendChild(this.id[i])
            }
        }
        for(let i=0;i<4; i++){
            
                this.id[i].disabled=true
                this.id[i].classList.remove("btnzoom")
            
        }
    }
    enableBtn(){
        for(let i=0;i<4; i++){
            if(this.status[i]==true){
                this.id[i].disabled=false

                this.id[i].classList.add("btnzoom")
            }
        }
    }
    movePlayer(el,val){
       
        let dest=0
        let fl=false
            for(let i = 0; i<4; i++){
                if(this.id[i].id==el){
                    this.status[i]=true
                    this.id[i].classList.remove("btnzoom")
                    console.log(this.id[i])

                    this.steps[i]+=val

                    
                    this.id[i].classList.remove("btnzoom")
                    dest = this.start+this.steps[i]
                    if(this.steps[i]>50){
                        if(this.steps[i]>56){
                            this.steps[i]-=val
                            break 
                        }
                        else if(this.steps[i]==56){
                            
                            let winel = document.getElementById("win")
                            winel.appendChild(this.id[i])
                            
                            winel.lastElementChild.classList.add("red1")

                            this.winnerid[i]=true
                            
                            for(let i=0;i<4; i++){
                                if(this.winnerid[i]==false){
                                    fl=true
                                }
                            }
                            if(fl==false){
                                console.log("won"+this.color)
                                alert(this.color + " Player Won !!! ...please refresh to start New Game")
                            }
                            break
                        }
                        dest = (this.steps[i]-50)+this.stripStart
                    }
                    else if(dest>52){
                        dest = dest-52
                    }
                    console.log(this.steps[i])
                    let ele = document.getElementById(dest)
                    
                    console.log(ele)
                    let lastChild = ele.lastElementChild
                    console.log(lastChild)
                    
                    if(lastChild==null || lastChild.className==this.color || stopage.includes(ele.id)){
                        ele.appendChild(this.id[i])
                    }
                    
                    else {
                        let clname = lastChild.className
                        clname = clname.toString()
                        clname = clname.slice(0,clname.indexOf(' '))
                        if(clname=="props"){
                            ele.appendChild(this.id[i])
                        }
                        else{
                            let initialPlace = document.getElementById(lastChild.className + lastChild.id)
                            deactivate=true
                            declass=lastChild.className
                            deid=lastChild.id
                            initialPlace.appendChild(lastChild)
                            ele.appendChild(this.id[i])
                        }
                    }
                    
                }
            }
            for(let i=0;i<4; i++){
                this.id[i].classList.remove("btnzoom")
                this.id[i].disabled=true
                
            }
        return
    }
}



function deactivateSubPlayer(){
    if(deactivate==true){
        if(declass=="red"){
            red.setsubStatus(parseInt(deid)-101)
            red.setSteps(parseInt(deid)-101)
            red.checkStatus()
            deactivate=false
        }
        else if(declass=="yellow"){
            yellow.setsubStatus(parseInt(deid)-201)
            yellow.setSteps(parseInt(deid)-201)
            yellow.checkStatus()
            deactivate=false
        }
        else if(declass=="blue"){
            blue.setsubStatus(parseInt(deid)-301)
            blue.setSteps(parseInt(deid)-301)
            blue.checkStatus()
            deactivate=false
        }
        else if(declass=="green"){
            green.setsubStatus(parseInt(deid)-401)
            green.setSteps(parseInt(deid)-401)
            green.checkStatus()
            deactivate=false
        }
    }
    else{
        return
    }
}

let red = new Player("red",1,51,109)
let yellow = new Player("yellow",14,12,209)
let blue = new Player("blue",27,25,309)
let green = new Player("green",40,38,409)
let image = new Map([
    [1, "https://i.postimg.cc/CM60tqym/1.jpg"],
    [2, "https://i.postimg.cc/JhKvkfMP/2.jpg"],
    [3, "https://i.postimg.cc/3NZnspN9/3.jpg"],
    [4, "https://i.postimg.cc/Px7tmpT3/4.jpg"],
    [5, "https://i.postimg.cc/pTCs7zpC/5.jpg"],
    [6, "https://i.postimg.cc/SKD8brfn/6.jpg"],
    [7, "https://i.postimg.cc/90qqTj59/dice.gif"]
  ])

function adddice(dice){
    return new Promise(resolve =>{
        setTimeout(() =>{
            let goti = document.getElementById("goti")
            goti.style.backgroundImage = 'url('+image.get(dice)+')'
        resolve("resolved")
    },2000)
        
    })
}
function removezoom(active){
    return new Promise(resolve =>{
        setTimeout(() => {
            let ani = document.getElementById(active)
            ani.classList.remove("zoom")
        resolve("resolved")
        }, 500);
    })
}

let die =0
let active = "red"
let btn = document.getElementById("roll")

 async function generaterandom(){
    message(active)

    btn.disabled=true
    console.log(active)
    let dice = Math.floor(Math.random()*6)+1
    let goti = document.getElementById("goti")
    goti.style.backgroundImage = 'url('+image.get(7)+')'
    goti.textContent=""
     audio.play();
    await adddice(dice)
    await removezoom(active)

    die=dice
    console.log(die)
    activePlayer(die)

     if (dice === 6) {
         // lancement double du dice
         do {
             dice = Math.floor(Math.random() * 6) + 1;
             await adddice(dice);
             die += dice;
             console.log(die);
         } while (dice === 6);
     }
}
function message(msg){
    let ani = document.getElementById(msg)
    console.log(ani)
        ani.classList.add("zoom")
    let goti = document.getElementById("goti")
    goti.style.backgroundImage=""
    goti.textContent="Roll Dice"
    let el = document.getElementById("roll")
    el.value=msg + "'s turn"
}
function activePlayer(dice) {
    if (active === "red") {
        if (dice === 6) {
            red.activatePlayer();
            red.setStatus();
        } else if (red.getStatus() === false) {
            active = "yellow";
            message(active);
            btn.disabled = false;
        } else {
            red.enableBtn();
        }
        console.log(active);
    } else if (active === "yellow") {
        if (dice === 6) {
            yellow.activatePlayer();
            yellow.setStatus();
        } else if (yellow.getStatus() === false) {
            active = "blue";
            message(active);
            btn.disabled = false;
        } else {
            yellow.enableBtn();
        }
        console.log(active);
    } else if (active === "blue") {
        if (dice === 6) {
            blue.activatePlayer();
            blue.setStatus();
        } else if (blue.getStatus() === false) {
            active = "green";
            message(active);
            btn.disabled = false;
        } else {
            blue.enableBtn();
        }
        console.log(active);
    } else if (active === "green") {
        if (dice === 6) {
            green.activatePlayer();
            green.setStatus();
        } else if (green.getStatus() === false) {
            active = "red";
            message(active);
            btn.disabled = false;
        } else {
            green.enableBtn();
        }
        console.log(active);
    }
}

function move(id){
    

    console.log("hi")
    
    switch (active){
        case 'red':
            if(red.getElementStatus(id-101)==false){
                red.openMove(id)
                die=0

            }
            else{
                console.log("red")
                red.movePlayer(id,die)
                deactivateSubPlayer()
                active = "yellow"
                message(active)
                audioMove.play()
            }
            console.log(active)
            break
        case 'yellow':
            if(yellow.getElementStatus(id-201)==false){
                yellow.openMove(id)
                die=0

            }
            else{
                console.log("yel")
                yellow.movePlayer(id,die)
                deactivateSubPlayer()
                active = "blue"
                message(active)
                audioMove.play();
            }
            console.log(active)
            break
        case 'blue':
            if(blue.getElementStatus(id-301)==false){
                blue.openMove(id)
                die=0

            }
            else{
                console.log("blu")
                blue.movePlayer(id,die)
                deactivateSubPlayer()
                active = "green"
                message(active)
                audioMove.play()
            }
            console.log(active)
            break
        case 'green':
            if(green.getElementStatus(id-401)==false){
                green.openMove(id)
                die=0

            }
            else{
                console.log("gree")
                green.movePlayer(id,die)
                deactivateSubPlayer()
                active = "red"
                message(active)
                audioMove.play()
            }
            console.log(active)
            break
        
    }
    btn.disabled=false
    
}