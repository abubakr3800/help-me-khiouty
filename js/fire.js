const db = firebase.firestore();

db.settings({timestampsInSnapshots : true});
countUsersOnDB();

class AllUsers{
    name;
    classYear;
    classDate;
}
var allUsersArr = [];
class eachClass{
    id;
    class;
    code;
    count;
}
var classDates = [];


function countUsersOnDB() {
    db.collection('counters').get().then((snapshot)=>{
    console.log(snapshot.docs.length);
    console.log(snapshot.docs);
    // if (snapshot.docs.length > 10) {
    //     formContainer.innerHTML = "عفوا لقد اكتمل عدد التسجيل";
    // }
        snapshot.docs.forEach(doc=>{
            // console.log(doc.data());
            var eachc = new eachClass() ;
            eachc.id = doc.id;
            eachc.class = doc.data()['class'];
            eachc.code = doc.data()['code'];
            eachc.count = doc.data()['count'];
            // console.log(eachc);
            // console.log('each' + eachc);
            classDates.push(eachc);
        })
    console.log(classDates);
    });

    db.collection('Users').get().then((snapshot)=>{
    console.log(snapshot.docs.length);
    console.log(snapshot.docs);
    // if (snapshot.docs.length > 10) {
    //     formContainer.innerHTML = "عفوا لقد اكتمل عدد التسجيل";
    // }
    snapshot.docs.forEach(doc=>{
        console.log(doc.data());
        var storeAllUsers = new AllUsers();
        storeAllUsers.name = doc.data()['name'] ;
        storeAllUsers.classDate = doc.data()['classtime'] ;
        storeAllUsers.classYear = doc.data()['classroom'] ;
        allUsersArr.push(storeAllUsers);
    })
    });

}

function countCounter( date ) {
    // console.log(date);
    var c;
    classDates.forEach(e => {
        // console.log(e.class);
        // console.log(e.count);
        // console.log(e.class == date);
        if(e.class == date){
            console.log(e.count);
            c = e.count;
        }
    });
    return c;
}

var coun;
function countResDate(Arr , date) {
    coun = 0;
    Arr.forEach(e => {
        console.log(e.classDate);
        if(e.classDate == date){
            coun++
        }
    });
    return coun;
}

var testObject = [];
class ClassRoomList {
    id;
    inclass;
};
class FinalUser {
    stname;
    stphone;
    dadphone;
    school;
    classRoom;
    classDate;
    classLimit;
}

var storeUser = new FinalUser();

db.collection('classrooms').get().then((snapshot)=>{
console.log(snapshot.docs);

// testObject = snapshot.docs;
// localStorage.setItem('testObject', JSON.stringify(testObject));
// var retrievedObject = JSON.parse(localStorage.getItem('testObject'));
// console.log('retrievedObject: ', (retrievedObject));

snapshot.docs.forEach(doc => {
    console.log(doc.data());
    var cl = new ClassRoomList();
    cl.id = doc.id;
    cl.inclass = doc.data();
    testObject.push(cl);
    createClassNum(doc);
})
    localStorage.setItem('testObject', JSON.stringify(testObject))
});

var selections = document.getElementById("classnum"),
    formContainer = document.getElementById("data-form") , 
    appointHolder = document.getElementById('appoint-time'),
    appointLabel = document.createElement('span'),
    appoint = document.createElement('select') ;

function createClassNum(doc) {
    var selChild = document.createElement("option");
    selChild.innerHTML = doc.data()['class'];
    selChild.setAttribute('value',doc.id);
    selChild.setAttribute('data-name',doc.data()['class']);
    selChild.setAttribute('data-classes',doc.data()['classes']);
    selChild.setAttribute('data-id',doc.data()['id']);
    selections.appendChild(selChild);
}
selections.onchange = function() {
    console.log(this.value);
    var retrievedObject = JSON.parse(localStorage.getItem('testObject'));
    retrievedObject.forEach(e => {
        if (e.id == this.value) {   
            console.log(e);
            document.cookie = JSON.stringify(e);
            
            storeUser.classRoom = e.inclass.class;

            appointHolder.setAttribute("class" , 'mb-3');
            appointLabel.setAttribute("class" , 'form-label');
            appoint.setAttribute("class" , 'form-select form-control form-control-lg');
            appoint.setAttribute("id" , 'form-appoint');
            appoint.setAttribute("name" , 'classDate');
            appoint.setAttribute("onchange" , 'createLink(this)');
        
            formContainer.appendChild(appointHolder);
            appointHolder.appendChild(appointLabel);
            appointHolder.appendChild(appoint);
            appointLabel.innerHTML = "موعد الحصة" ;

            appoint.innerHTML = `<option value="">اختر الميعاد</option>`;
            appointCheckNotFound = 0;
            e.inclass.classes.forEach(c=>{
                // classAppoint(c,e.id);
                var counter = classAppoint(c,e.id,e.inclass.studentlimit);
                console.log(counter);
                appointCheckNotFound = appointCheckNotFound + counter;
            })
            if (appointCheckNotFound == 0 ) {
                // alert("ناسف لكم لقد تم حجز جميع المواعيد");
                document.getElementById("nonfound").click();
                document.getElementById("appoint-time").innerHTML = "";
                document.getElementById("submit-holder").innerHTML = "";

            }
            console.log("appointCheckNotFound:" + appointCheckNotFound);
        }
    })
};


function classAppoint(content , id , stlim) {
    var appointCount = 0;
    console.log( "studentlimit: " + stlim);
    // if (countResDate(allUsersArr , content) < Number(stlim)) {        
    if (countCounter(content) < Number(stlim)) {        
        appointChild = document.createElement("option");
        appointChild.setAttribute("value" , content);
        console.log(countResDate(allUsersArr , content));
        appointChild.innerHTML = content;
        localStorage.setItem('classroomId',id);
        appoint.appendChild(appointChild);
        appointCount++;
    }
    return appointCount;
}

function gotoGroup(event){
    event.preventDefault();
    // alert(this.href);
    window.open("https://m.facebook.com/groups/1000075227285686/?ref=share&mibextid=NSMWBT" ,"facebook group", "width=1000 , height=1000");
    if (!checkCounter()) {
        var subcont = document.getElementById("submit-holder"),
            sub = document.createElement("button");

            subcont.setAttribute("class","d-grid gap-2");
            sub.setAttribute("type","submit");
            sub.setAttribute("class","btn btn-primary btn btn-primary btn-lg btn-block");

            sub.innerHTML="ارسل البيانات";
            subcont.innerHTML = "";
        subcont.appendChild(sub);
        formContainer.appendChild(subcont);
        countUsersOnDB();

    }else if (checkCounter()) {
        alert("complete yor data with right informations");
    }
};

function createLink(el) {
    var faceLlinkHolder = document.getElementById("link-holder");
        faceLlinkHolder.innerHTML = '';

        storeUser.classDate = el.value;
        // alert(el.value);

    var groupLlinkHolder = document.createElement("div");
        groupLlinkHolder.innerHTML = `<span class="form-label" id="basic-addon1">تحقق من الانضمام في جروب الفيس (يجب الضغط علي اللينك لاستكمال الادخال و الانضمام لمتابعة التنبيهات واستكمال بياناتك) </span><a onclick="gotoGroup(event)" href="https://m.facebook.com/groups/1000075227285686/?ref=share&mibextid=NSMWBT" id="groupLink" class="link-primary">facebook link</a>`;

        faceLlinkHolder.appendChild(groupLlinkHolder);
        
}

function checkCounter() {
    stname = formContainer.stname.value;
    stphone = formContainer.stphone.value;
    dadphone = formContainer.dadphone.value;
    school = formContainer.school.value;
    classroom = formContainer.classroom.value;
    classDate = formContainer.classDate.value;

    storeUser.stname = stname;
    storeUser.stphone = stphone;
    storeUser.dadphone = dadphone;
    storeUser.school = school;
    
   console.log( classroom);
   return stname == '' || stphone == '' || dadphone == '' || school == '' || classDate == ''  ;
}
