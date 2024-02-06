var form = document.getElementById("data-form"),
    formCon = document.getElementById("data-req");

    formContainer.onsubmit = function (event) {
        event.preventDefault();
        // countUsersOnDB();

        // stname = formContainer.stname.value;
        // stphone = formContainer.stphone.value;
        // dadphone = formContainer.dadphone.value;
        // school = formContainer.school.value;
        // classRoom = formContainer.classroom.value;
        // classDate = formContainer.classDate.value;
        if (checkCounter()) {
            alert("complete yor data with right informations");
        }else {
            db.collection('Users').add({
                name:storeUser.stname,
                phone:storeUser.stphone,
                fatherPhone:storeUser.dadphone,
                schoolName:storeUser.school,
                classroom:storeUser.classRoom,
                classtime:storeUser.classDate
            }).then((snapshot)=>{
            console.log(snapshot.id);
                formContainer.innerHTML = `<div class="container"><div class="row justify-content-center"><div class="card text-center col-lg-6 col-10" >
                <div class="card-header w-100">
                  الكود الخاص بك
                </div>
                <img class="card-img-top p-5" src="https://api.qrserver.com/v1/create-qr-code/?size=600x600&data=${snapshot.id}">
                <div class="card-body w-100">
                  <h5 class="card-title">${snapshot.id}</h5>
                  <a href="javascript:if(window.print)window.print()" class="btn btn-primary"> اطبع الان</a>
                </div>
                <div class="card-footer text-muted w-100">
                  ${Date()}
                </div>
              </div></div></div>`;
            })
        }
    }