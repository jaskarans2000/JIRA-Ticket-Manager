let modalColors = document.querySelectorAll(".modal-color");
let mainContainer = document.querySelector(".main-container");
let modalContainer = document.querySelector(".modal_container");
let taskBox = document.querySelector(".task_box");
let plusBtn = document.querySelector(".plus");
let cross = document.querySelector(".cross");
let lock = document.querySelector(".lock");
let unlock = document.querySelector(".unlock");
let modalFlag = false;
let iColor = "black";
let colors = ["pink", "blue", "green", "black"];
let alltasks=[];
let filterContainer=document.querySelectorAll(".filter_color-container");
let iconContainer=document.querySelectorAll(".icon_container");

//check if there is anything in local storage
if(localStorage.getItem('tickets')){
    let strArr=localStorage.getItem('tickets');
    alltasks=JSON.parse(strArr);
    alltasks.forEach(function(ticket){
        let taskContainer = document.createElement("div");
        let task = ticket.task;
        let id = ticket.id;
        let iColor=ticket.color;
        taskContainer.setAttribute("class", "ticket_container");
        taskContainer.innerHTML = `<div class="ticket_color ${iColor}"></div>
        <div class="ticket_desc_container" style="background-image: url('tickets-bg.jpg'); background-size: cover;">
        <div class="ticket_id">#${id}</div>
        <div class="ticket_desc">${task}</div>
        </div>`;
        mainContainer.appendChild(taskContainer);  
        addFunctionality(taskContainer);
    })
}

//functionality of filter
let flag=null;
for(let i=0;i<filterContainer.length;i++){
    filterContainer[i].addEventListener("click",function(e){
        let color=filterContainer[i].children[0].classList[1];
        if(flag!=color){
            //implement filter
            let tickets=mainContainer.querySelectorAll(".ticket_container");
            tickets.forEach(function(ticket){
                let ticket_color=ticket.children[0].classList[1];
                if(ticket_color==color){
                    ticket.style.display="block";
                }else{
                    ticket.style.display="none";
                }
            });
            flag=color;
        }else{
            //display all
            let tickets=mainContainer.querySelectorAll(".ticket_container");
            tickets.forEach(function(ticket){
                    ticket.style.display="block";
            });
            flag=null;
        }
    });
}


//display modal on click of plus button
plusBtn.addEventListener("click", function () {
    modalContainer.style.display = "flex";
})

//create ticket on clicking enter on ticket
taskBox.addEventListener("keydown", function (e) {
    if (e.key == "Enter" && taskBox.value != "") {
        let taskContainer = document.createElement("div");
        let task = taskBox.value;
        let id = Math.random().toString(32).slice(2);
        taskContainer.setAttribute("class", "ticket_container");
        taskContainer.innerHTML = `<div class="ticket_color ${iColor}"></div>
        <div class="ticket_desc_container" style="background-image: url('tickets-bg.jpg'); background-size: cover;">
        <div class="ticket_id">#${id}</div>
        <div class="ticket_desc">${task}</div>
        </div>`;
        mainContainer.appendChild(taskContainer);
        taskContainer.addEventListener("dblclick",dragElement(taskContainer));
        let obj={};
        obj.id=id;
        obj.task=task;
        obj.color=iColor;
        alltasks.push(obj);
        localStorage.setItem('tickets',JSON.stringify(alltasks));
        // cleanup code
        modalContainer.style.display = "none";
        taskBox.value = "";
        iColor = "black";
        addFunctionality(taskContainer);
    }
})


//add border on color palletes of model on selected
for (let i = 0; i < modalColors.length; i++) {
    modalColors[i].addEventListener("click", function () {
        let color = modalColors[i].classList[1];
        iColor = color;
        // remove everyone
        for (let j = 0; j < modalColors.length; j++) {
            modalColors[j].classList.remove("border");
        }
        // add 
        modalColors[i].classList.add("border");

    })
}

//change color on click of strip
function addFunctionality(taskContainer) {
    let ticketColor = taskContainer.querySelector(".ticket_color");
    ticketColor.addEventListener("click", function () {
        let cColor = ticketColor.classList[1];
        let idx = colors.indexOf(cColor);
        let newIdx = (idx + 1) % 4;
        let newColor = colors[newIdx];
        let ticketid=taskContainer.querySelector(".ticket_id").innerText.slice(1);
        alltasks.forEach(function(task){
            if(task.id==ticketid){
                task.color=newColor;
            }
        });
        localStorage.setItem('tickets',JSON.stringify(alltasks));
        ticketColor.classList.remove(cColor);
        ticketColor.classList.add(newColor);
    })
}

//cross button functionality
let clicked=true;
cross.addEventListener("click",function(e){
    if(clicked){
        clicked=false;
        let tickets=document.querySelectorAll(".ticket_container");
        tickets.forEach(function(ticket){
            ticket.addEventListener("click",function(e){    
                if(!clicked){
                    let id=ticket.querySelector(".ticket_id").innerText.slice(1);
                    ticket.remove();
                    for(let i=0;i<alltasks.length;i++){
                        if(alltasks[i].id==id){
                            alltasks.splice(i);
                        }
                    }
                    localStorage.setItem('tickets',JSON.stringify(alltasks));
                }
            });
        })
    }else{
        clicked=true;
    }
});


//content editable
lock.addEventListener("click",function(){
    lock.style.display="none";
    unlock.style.display="initial";
    let tickets=mainContainer.querySelectorAll(".ticket_container");
    tickets.forEach(function(ticket){
        // let ele=ticket.querySelector("")
        ticket.children[1].children[1].contentEditable="true";
        alltasks.pop();
    })
});


//content uneditable
unlock.addEventListener("click",function(){
    unlock.style.display="none";
    lock.style.display="initial";
    let tickets=mainContainer.querySelectorAll(".ticket_container");
    tickets.forEach(function(ticket){
        // let ele=ticket.querySelector("")
        ticket.children[1].children[1].contentEditable="false";
        let obj={};
        obj.color=ticket.querySelector('.ticket_color').classList[1];
        obj.task=ticket.querySelector('.ticket_desc').innerText;
        obj.id=ticket.querySelector('.ticket_id').innerText.slice(1);
        alltasks.push(obj);
    })
    localStorage.setItem('tickets',JSON.stringify(alltasks));
});

//hover color
filterContainer.forEach(function(container){
    container.addEventListener("mouseover",function(e){
        container.style.backgroundColor="#444"
    });
    container.addEventListener("mouseout",function(e){
        container.style.backgroundColor="darkgray"
    });
})

iconContainer.forEach(function(container){
    container.addEventListener("mouseover",function(e){
        container.style.backgroundColor="#444";
        container.children[0].style.color="white";
    });
    container.addEventListener("mouseout",function(e){
        container.style.backgroundColor="darkgray";
        container.children[0].style.color="black";
    });
})

//draggable element
let tickContainer=document.querySelectorAll(".ticket_container");
Array.from(tickContainer).forEach(function(tick){
    tick.addEventListener("dblclick",dragElement(tick));
})

function dragElement(elmnt) {
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  elmnt.onmousedown = dragMouseDown;

  function dragMouseDown(e) {
    e = e || window.event;
    //e.preventDefault();
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // set the element's new position:
    elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
    elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
  }

  function closeDragElement() {
    /* stop moving when mouse button is released:*/
    document.onmouseup = null;
    document.onmousemove = null;
  }
}