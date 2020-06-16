
let modal=false
//manager_pass.setAttribute("oninput","getList()")
function createListElement(row,id){
  let html = "";
  html += `<div id="${id}" class="pass_list">`;
  html += `<p style="font-size:${(PageWithHeightRatio() >= changeRatio)?"2em":"3em"};margin:10px">${row.site}</p>`;
  html += `<p style="font-size:${(PageWithHeightRatio() >= changeRatio)?"1.2em":"2em"};margin:10px">${row.description}</p>`;
  html += `<button style="font-size:${(PageWithHeightRatio() >= changeRatio)?"1.8em":"3em"}" onclick="passwordMenu(${id})">Open</button>`;
  html += `</div>`;
  return html
}
function listDB(db,filtered_ids=[]){
  let password_list = getElement("passwords_list");
  if (db.length == 0) {
    password_list.innerHTML = `<p style="${paragraphSize()}">Empty or Wrong Password</p>`;
  } else {
    let html = "";
    if(filtered_ids.length==0){
      db.forEach((row, id) => {
        html+=createListElement(row,id)
      });
    }else{
      filtered_ids.forEach(id => {
        let row=db[id]
        html+=createListElement(row,id)
      });
    }
    password_list.innerHTML = html;
  }
}


function list_DB_With_Search(input){
  let manager_pass = getElement("pass");
  let db=getDB(manager_pass.value)
  let search_word=input.value
  let newdb_ids=findBestMatchs(db,search_word)
  //z.filter((el,i)=>x.some(j => i === j))
  //filter db by newly found matches id
  //db.filter((el,i)=>newdb_ids.some(j => i === j))
  listDB(db,newdb_ids)
}
function getList() {
  let manager_pass = getElement("pass");
  let password_list = getElement("passwords_list");
  if (manager_pass.value == "") {
    password_list.innerHTML = `<p style="${paragraphSize()}">No password inserted!</p>`
  } else {
    let db = getDB(manager_pass.value);
    listDB(db)
  }
}
function CloseMenu(btn) {
  let parent = btn.parentElement;
  parent.parentElement.removeChild(parent);
  modal=false
}

function Edit(btn, id) {
  let manager_pass = getElement("pass");
  let username = document.getElementsByName("Username")[0];
  let password = document.getElementsByName("Password")[0];
  let site = document.getElementsByName("site")[0];
  let description = document.getElementsByName("description")[0];
  if (btn.innerHTML == "Edit") {
    username.style.height = `auto`;
    username.style.opacity = "100";
    username.style.border = "solid 1px white";
    password.style.height = `auto`;
    password.style.opacity = "100";
    password.style.border = "solid 1px white";
    btn.innerHTML = "Submit";
    //btn.setAttribute("onclick","showUserPass(this)")
  } else {
    if (btn.innerHTML == "Submit") {
      username.style.height = "0px";
      username.style.opacity = "0";
      username.style.border = "";
      password.style.height = "0px";
      password.style.opacity = "0";
      password.style.border = "";
      btn.innerHTML = "Edit";
      let db_line = {
        site: site.value,
        description: description.value,
        user: username.value,
        pass: password.value,
      };
      updateDB(db_line, id, manager_pass.value);
      getList();
      // btn.setAttribute("onclick","showUserPass(this)")
    }
  }
}
function Delete(btn, id) {
  let manager_pass = getElement("pass");
  if (confirm("Are you sure?")) {
    deleteDB(id, manager_pass.value);
    getList();
    //close window menu
    let parent = btn.parentElement;
    let parent2 = parent.parentElement;
    parent2.parentElement.removeChild(parent2)
    
  }
}
function checkIfUserAndPassIsEmpty() {
  let username = document.getElementsByName("Username")[0];
  let password = document.getElementsByName("Password")[0];
  if (username.value == "" && password.value == "") {
    username.style.height = "auto";
    username.style.opacity = "100";
    username.style.border = "solid 1px white";
    password.style.height = "auto";
    password.style.opacity = "100";
    password.style.border = "solid 1px white";
  }
}
function save(input, id) {
  let manager_pass = getElement("pass");
  let username = document.getElementsByName("Username")[0];
  let password = document.getElementsByName("Password")[0];
  let site = document.getElementsByName("site")[0];
  let description = document.getElementsByName("description")[0];
  let db_line = {
    site: site.value,
    description: description.value,
    user: username.value,
    pass: password.value,
  };
  updateDB(db_line, id, manager_pass.value);
  getList();
}
function show_password_info(show_data, id,edit=true) {
  modal=true
  let html = `<button class="btn" style="${backHomeBtnSize()}" onclick="CloseMenu(this)" >&lt;</button>`;
  html += `<div align="center" >`;
  html += `<input  name="site" oninput="save(this,${id})" style="background:transparent;border:solid white 2px;color:white;font-size:${(PageWithHeightRatio() >= changeRatio)?"3em":"6em"};width:${(PageWithHeightRatio() >= changeRatio)?"50%":"80%"}" text-align="right" value="${show_data.site}" placeholder="site/page ..."><br>`;
  html += `<textarea name="description" oninput="save(this,${id})" style="background:transparent;border:solid white 2px;color:white;font-size:${(PageWithHeightRatio() >= changeRatio)?"3em":"5em"};width:${(PageWithHeightRatio() >= changeRatio)?"50%":"80%"};height:30%" text-align="right" placeholder="Description ..." >${show_data.description}</textarea><br>`;
  html += `<button style="font-size:${(PageWithHeightRatio() >= changeRatio)?"1.3em":"5em"}" onclick="Copy(this.innerText,this)">Copy Username</button><br>`;
  html += `<input name="Username" style="height:0px;color:white;background:transparent;border:none;opacity:0;margin:${(PageWithHeightRatio() >= changeRatio)?"0px":"30px"};font-size:${(PageWithHeightRatio() >= changeRatio)?"1.3em":"3.3em"}" value="${show_data.user}" placeholder="username"><br>`;
  html += `<button style="font-size:${(PageWithHeightRatio() >= changeRatio)?"1.3em":"5em"}" onclick="Copy(this.innerText,this)">Copy Password</button><br>`;
  html += `<input name="Password" style="height:0px;color:white;background:transparent;border:none;opacity:0;margin:${(PageWithHeightRatio() >= changeRatio)?"0px":"30px"};font-size:${(PageWithHeightRatio() >= changeRatio)?"1.3em":"3.3em"}" value="${show_data.pass}" placeholder="password"><br>`;
  html += `<button style="font-size:${(PageWithHeightRatio() >= changeRatio)?"1.3em":"5em"}" onclick="Edit(this,${id})">Edit</button>${(PageWithHeightRatio() >= changeRatio)?"&nbsp;&nbsp;":"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"}<button style="font-size:${(PageWithHeightRatio() >= changeRatio)?"1.3em":"5em"}" onclick="Delete(this,${id})">Delete</button>`;
  html += "</div>";

  return html;
}

function Copy(user_pass, btn) {
  let input = document.getElementsByName(user_pass.split("Copy ")[1])[0];
  input.select();
  document.execCommand("Copy");
  btn.innerHTML = "Copied " + user_pass.split("Copy ")[1] + " !";
  setTimeout(() => {
    btn.innerHTML = user_pass;
  }, 1000);
}
function passwordMenu(id) {
  let manager_pass = getElement("pass");
  let decrypt_db = getDB(manager_pass.value);
  let db_line = decrypt_db[id];
  let div = document.createElement("div");
  div.style.position = "absolute";
  div.style.width = "99.6%";
  div.style.top = "0px";
  div.style.height = `${(PageWithHeightRatio() >= changeRatio)?"99.2%":body.offsetHeight}`;
  div.style.margin = "0px";
  div.style.padding = "0px";
  div.style.background = "#232323";
  div.style.border = "solid white 2px";
  div.style["z-index"] = "20";
  div.innerHTML += show_password_info(db_line, id);
  body.appendChild(div);
  getElement("ManagePasswords").style.height="0px"
}

function addNewPass() {
  let manager_pass = getElement("pass");
  let decrypt_db = getDB(manager_pass.value);
  let div = document.createElement("div");
  div.style.position = "absolute";
  div.style.width = "100%";
  div.style.top = "0px";
  div.style.height = `${(PageWithHeightRatio() >= changeRatio)?"99.2%":"100%"}`;
  div.style.margin = "0px";
  div.style.padding = "0px";
  div.style.background = "#232323";
  div.style.border = "solid white 2px";
  div.style["z-index"] = "20";
  div.innerHTML += show_password_info(emptyDbLine(), decrypt_db.length);
  body.appendChild(div);
  
  //change Edit button to submit by finding in div children
  checkIfUserAndPassIsEmpty();
}

function paragraphSize(){
  //width >= height
  if (PageWithHeightRatio() >= changeRatio) {
      return `font-size:1.4em;`
  }
  //height > width
  else {
      return `font-size:4em;`
  }
}
function buttonSize(){
  //width >= height
  if (PageWithHeightRatio() >= changeRatio) {
      return `font-size:1.3em;`
  }
  //height > width
  else {
      return `font-size:3.5em;`
  }
}
function inputStyle(){
  //width >= height
  if (PageWithHeightRatio() >= changeRatio) {
      return `style="font-size:large;"`
  }
  //height > width
  else {
      return `style="font-size:4em;"`
  }
}
function checkboxStyle(){
  //width >= height
  if (PageWithHeightRatio() >= changeRatio) {
      return `style="zoom:1;"`
  }
  //height > width
  else {
      return `style="zoom:2.3;"`
  }
}
function listHeight(){

  let password_list = getElement("passwords_list");
  if(password_list==null){
    setTimeout(listHeight,100)
    password_list.style.height=`100px`
  }else{
    let window_height=password_list.parentElement.offsetHeight
    let list_top=password_list.offsetTop
    let list_height=Math.abs(window_height-list_top)-50
    password_list.style.height=`${list_height}px`
  }
}
function backHomeBtnSize(){
  //width >= height
  if (PageWithHeightRatio() >= changeRatio) {
      return `font-size:3em`
  }
  //height > width
  else {
      return `font-size:7em`
  }
}
function startPage(){

  let html=""
  html+=`<button class="btn" style="${backHomeBtnSize()};left:0%;position: absolute;" onclick="goToInitialMenu()" >&lt;</button>`
  html+=`<p style="${paragraphSize()};margin-bottom:10px">Master Password</p>`
  html+=`<input ${inputStyle()} id="pass" type="password" placeholder="type master pass here">`
  html+=`<p style="font-size:${(PageWithHeightRatio() >= changeRatio)?"1.2em":"3em"};margin:10px" >show password:<input ${checkboxStyle()} type="checkbox" onclick="showPassword('pass')"></p>`
  html+=`<button style="${buttonSize()};margin:10px;" onclick="getList()">Get Passwords List</button><br>`
  html+=`<p style="${paragraphSize()};margin:10px">Search</p>`
  html+=`<input ${inputStyle()} type="text" oninput="list_DB_With_Search(this)" placeholder="search password"><br>`
  html+=`<button style="${buttonSize()};margin-top:5px" onclick="addNewPass()">Add Password</button>`
  html+=`<div id="passwords_list" style="overflow:auto;height:30px"  class="slider">`
  html+=`<div class="pass_list">hdisusdn</div>`
  html+=`<div class="pass_list">hdisusdn</div>`
  html+=`</div>`
  getElement("ManagePasswords").innerHTML=html
  listHeight()
}
function checkScreenRatio() {
  if (prev_screen_ratio != PageWithHeightRatio() && modal==false) {
      prev_screen_ratio=PageWithHeightRatio()
      startPage()
      getList()

  }
  //setTimeout(checkScreenRatio,350)
}
//Main----------
let  prev_screen_ratio = PageWithHeightRatio()
startPage()
checkScreenRatio()
getList();
//let manager_pass = getElement("pass");
//let search = getElement("search password");
//let password_list = getElement("passwords_list");

