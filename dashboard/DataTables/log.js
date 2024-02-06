class AdminVer{
    name;
    email;
    id;
}

class AllUsers{
  name;
  classYear;
  classDate;
}
var allUsersArr = [];
var dtUsers = [];
var dtClassrooms = [];
var adminLogin = new AdminVer();
const db = firebase.firestore();

document.getElementById("log-form").onsubmit = function (event){
    event.preventDefault();
    var email = this.email.value;
    var password = this.password.value;
    firebase.auth().signInWithEmailAndPassword(email, password)
    .then(function (data) {
        console.log(data.user);
        adminLogin.id = data.user.l;
        adminLogin.name = data.user.displayName;
        adminLogin.email = data.user.email;
        // document.cookie =  JSON.stringify(adminLogin);
        checkLogin(JSON.stringify(adminLogin));
        storeCookies(adminLogin);
    })
    .catch(function(error) {
        console.log(error.code , error.message );
      });
}

function checkLogin(params) {
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
          console.log("User is signed in.");
          // console.log("user data is:" + params);
          adminLogin.id = user.l;
          adminLogin.name = user.displayName;
          adminLogin.email = user.email;
          console.log(user);
          console.log(adminLogin);
          showData(adminLogin);
        } else {
           console.log("User is signed out .");
        }
    });
}

checkLogin();

function Logout() {
  firebase.auth().signOut().then(function() {
    console.log("Sign-out successful."); 
    document.cookie = '';
  }, function(error) {
    console.log(' An error happened.' , error);
  });  
}

function showData(adminInfo) {
  $('#data-req').html(`<div id="admin-info" class="row m-3 p-3"></div><div class="cards my-2" id="update-stlimit"></div><table id="dataUsers" class="display w-100"></table>`);
  $('#admin-info').html(`<div class="col-lg-5">user name : ${adminInfo.name}</div> <div class="col-lg-5"> email : ${adminInfo.email}</div> <div class="col-lg-2"><a href="#" onclick="Logout()">sign out</a></div> `);
  // console.log(adminInfo);
  db.collection('Users').get().then((snapshot)=>{
    console.log(snapshot.docs.length);
    console.log(snapshot.docs);
    // if (snapshot.docs.length > 10) {
    //     formContainer.innerHTML = "عفوا لقد اكتمل عدد التسجيل";
    // }
    snapshot.docs.forEach(doc=>{
        console.log(doc.data());
        var storeAllUsers = {};
        // var storeAllUsers = new AllUsers();

        storeAllUsers.name = doc.data()['name'] ;
        storeAllUsers.classDate = doc.data()['classtime'] ;
        storeAllUsers.classYear = doc.data()['classroom'] ;
        storeAllUsers.stphone = doc.data()['phone'] ;
        storeAllUsers.fatherPhone = doc.data()['fatherPhone'] ;
        storeAllUsers.school = doc.data()['schoolName'] ;

        var dtsingleUser = [];
        dtsingleUser.push(doc.id);
        dtsingleUser.push(doc.data()['name']);
        dtsingleUser.push(doc.data()['classtime']);
        dtsingleUser.push(doc.data()['classroom']);
        dtsingleUser.push(doc.data()['phone']);
        dtsingleUser.push(doc.data()['fatherPhone']);
        dtsingleUser.push(doc.data()['schoolName']);
        dtsingleUser.push('');

        dtUsers.push(dtsingleUser);

        console.log(storeAllUsers);
        allUsersArr.push(storeAllUsers);
    })
      console.log(dtUsers);
      $('#dataUsers').DataTable( {
        dom: 'Bfrtip',
        pageLength: 60,
        // scrollY:"480px",
        // scrollCollapse: true,
        // paging: false,
        scrollX: true,
        info: true,
        buttons: [
            'copy', 'excel', 'print'
        ],
        columns: [
          { title: 'id' },
          { title: 'Name' },
          { title: 'classDate' },
          { title: 'Year' },
          { title: 'student phone' },
          { title: 'father phone' },
          { title: 'school name' },
          { title:"delete student" }
        ],
        data: dtUsers,
        createdRow: (row, data, index) => {
            if (data[7] == '') {
                row.querySelector(':nth-child(8)').classList.add('highlight');
                row.querySelector(':nth-child(8)').innerHTML = `<a href='#' class="text-danger" onclick="deletStudent('${data[0]}')">delete student</a>`;
            }
            // data[4] = `<a href='#' class="text-danger" onclick="deletStudent(${data[0]})"></a>`;
        },
        
      });
      // stTable.draw();
    });
  db.collection('classrooms').get().then((snapshot)=>{
    console.log(snapshot.docs.length);
    console.log(snapshot.docs);
    document.getElementById("update-stlimit").appendChild(createLimitChanger());
    snapshot.docs.forEach(doc=>{
        createFormOptions(doc.id,doc.data()['studentlimit'],doc.data()['class'])
        console.log(doc.data());
        console.log(dtClassrooms);
    })
      console.log(dtUsers);
    });
}

function deletStudent(id) {
  db.collection('Users').doc(id).delete().then(e => { console.log(e); window.location.reload();});
}

function createLimitChanger() {
  var allcards = document.createElement("div"),
      cardform = document.createElement("div"),
      form = document.createElement("form"),
      formGroupR = document.createElement("div"),
      formGroupRC = document.createElement("div"),
      formGroupRW = document.createElement("div"),
      formGroupbut = document.createElement("div"),
      formReadOnly = document.createElement("input"),
      formReadClass = document.createElement("select"),
      formReadClassOption = document.createElement("option"),
      formReadWrite = document.createElement("input"),
      formSub = document.createElement("button");

  allcards.setAttribute("class" , "card my-5");
  cardform.setAttribute("class" , "card-body border");
  form.setAttribute("class" , "form row");
  form.setAttribute("id" , "up-stlim");
  formGroupRC.setAttribute("class" , "form-group mb-2 col col-sm-12");
  // formGroupRC.setAttribute("id" , "");
  formGroupR.setAttribute("class" , "form-group mb-2 col col-sm-12");
  formGroupRW.setAttribute("class" , "form-group mb-2 col col-sm-12");
  formGroupbut.setAttribute("class" , "form-group mb-2 col col-sm-12");

  formReadOnly.setAttribute("class" , "form-control m-2");
  formReadOnly.setAttribute("id" , "read-limit");
  formReadClass.setAttribute("class" , "form-control m-2");
  formReadClass.setAttribute("id" , "read-classname");
  formReadWrite.setAttribute("class" , "form-control m-2");
  formSub.setAttribute("class" , "btn btn-primary btn-lg btn-block m-2");

  // formReadOnly.setAttribute("readonly","");
  formReadWrite.setAttribute("type" , "number");
  formSub.setAttribute("type" , "submit");

  // formReadOnly.setAttribute("value" , lim);
  // formReadClass.setAttribute("value" , classname);
  formSub.innerHTML = 'change limit';

  formReadClass.setAttribute("name" , "classname");
  formReadOnly.setAttribute("name" , "oldValue");
  formReadWrite.setAttribute("name" , "newValue");
  form.setAttribute("onsubmit" , "event.preventDefault(); updateLimit(this)");
  
  formReadClassOption.setAttribute("value",'');
  formReadClassOption.innerHTML = 'اختر الصف';

  formGroupRC.appendChild(formReadClass);
  formGroupR.appendChild(formReadOnly);
  formGroupRW.appendChild(formReadWrite);
  formGroupbut.appendChild(formSub);

  form.appendChild(formGroupRC);
  form.appendChild(formGroupR);
  form.appendChild(formGroupRW);
  form.appendChild(formGroupbut);
  formReadClass.appendChild(formReadClassOption);

  
  var formHidden = document.createElement("input");
  formHidden.setAttribute("hidden" , '');
  formHidden.setAttribute("id" , 'hidden-element');
  form.appendChild(formHidden);

  cardform.appendChild(form);
  allcards.appendChild(cardform);
  return allcards;
}

function createFormOptions(id , lim , classname) {
  var formReadClassOption = document.createElement("option"),
      // formReadLimit = document.getElementById("read-limit"),
      formReadClass = document.getElementById("read-classname");
      
      formReadClass.setAttribute("onchange",`changeReadOnly(this.value)`);
      // formReadClass.setAttribute("data-limit", lim );
      formReadClassOption.setAttribute("value", lim + '@' +id);
      formReadClassOption.innerHTML = classname;
      formReadClass.appendChild(formReadClassOption);


      // formHidden.value = id;
}

function changeReadOnly(lim) {
  var limit = lim.split('@')[0];
  var id = lim.split('@')[1];
  var formReadLimit = document.getElementById("read-limit");
    formReadLimit.value = limit ;

  var formHidden = document.getElementById("hidden-element");
      formHidden.setAttribute("value", id );
      formHidden.setAttribute("name", 'formId' );
}


function updateLimit(e) {
  alert(e.newValue.value + ' ' + e.formId.value );
  db.collection('classrooms').doc(e.formId.value).update(
    {
      studentlimit: Number(e.newValue.value),
    }
  ).then(e => { console.log(e); window.location.reload();});
  
}