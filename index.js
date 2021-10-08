// toggle theme of the webpage
const switcher = document.getElementById("theme-changer")
const body = document.querySelector('body')
const nav = document.querySelector('nav')
const footer = document.querySelector('footer')
switcher.addEventListener('click', () => {
    nav.classList.toggle('navbar-dark')
    body.classList.toggle('dark')
    footer.classList.toggle('footer-dark')
})

var globalStudentsData = []
var countTotal = 0;
var countPresent = 0;
var countAbsent = 0;
studentDetails = document.getElementById("students_details");

const addStudent = () => {
    markAttendance= document.getElementsByName("MarkAttendance")
    for(i = 0; i < markAttendance.length; i++) {
        if(markAttendance[i].checked)
            Attendance = markAttendance[i].value;
    }

    if(document.getElementById("imageUrl").value != "") 
        image = document.getElementById("imageUrl").value
    else
        image = "./images/profile.jfif"

    countTotal++;
    if(Attendance == "present")
        countPresent++
    else
        countAbsent++

    const newStudentDetails = {
        id: `${Date.now()}`,
        url: image,
        fullname: document.getElementById("StudentName").value,
        subject: document.getElementById("Subject").value,
        attendance: Attendance
    }

    document.getElementById("Total-std").innerHTML = countTotal;
    document.getElementById("Present-std").innerHTML = countPresent;
    document.getElementById("Absent-std").innerHTML = countAbsent;

    studentDetails.insertAdjacentHTML('afterbegin', generateStudentRow(newStudentDetails))

    globalStudentsData.push(newStudentDetails)
    saveToLocalStorage()
}

const generateStudentRow = ({id, url, fullname, attendance, subject}) => {
    return `<tr id=${id} key=${id}>
        <td class="students-list-table-bg"><img src=${url} style="width: 50px; height:50px;" /> </td>
        <td class="students-list-table-bg">${fullname}</td>
        <td class="students-list-table-bg">${attendance}</td>
        <td class="students-list-table-bg">${subject}</td>
        <td class="students-list-table-bg">
            <button class="btn btn-primary" name=${id} onclick="editStudentRow(this)">Edit</button>
            <button class="btn btn-danger" name=${id} onclick="deleteStudentRow(this)">Delete</button>
        </td>
    </tr>`
}

const saveToLocalStorage = () => {
    localStorage.setItem("stdKey", JSON.stringify({stds: globalStudentsData}))
}

const reloadStudentsList = () => {
    const localStorageCopy = JSON.parse(localStorage.getItem("stdKey"))
    if(localStorageCopy) {
        globalStudentsData = localStorageCopy["stds"]
    }
    globalStudentsData.map((stddata) => {
        studentDetails.insertAdjacentHTML('afterbegin', generateStudentRow(stddata))
    })
}

const deleteStudentRow = (e) => {
    const targetID = e.getAttribute("name")
    globalStudentsData = globalStudentsData.filter((std) => std.id !== targetID)

    countTotal--;
    saveToLocalStorage()
    window.location.reload()
}

// const deleteStudentRow = (e) => {
//     if (!e) e = window.event;
//     const targetID = e.getAttribute("name");
//     console.log(targetID)
//     const type = e.tagName;
//     console.log(type)
//     const removestd = globalStudentsData.filter(({ id }) => id !== targetID);
//     globalStudentsData = removestd

//      console.log(e.parentNode.parentNode.parentNode.removeChild(e.parentNode.parentNode))

//     saveToLocalStorage();
//     if (type === "BUTTON")
//       return e.parentNode.parentNode.parentNode.removeChild(e.parentNode.parentNode)
    
// }

const editStudentRow = (e) => {
    e.parentNode.parentNode.childNodes[3].setAttribute("contentEditable", "true")
    e.parentNode.parentNode.childNodes[5].setAttribute("contentEditable", "true")
    e.parentNode.parentNode.childNodes[7].setAttribute("contentEditable", "true")

    e.innerHTML = "Save Changes"
    e.setAttribute("onclick", "saveEditStudentRow(this)")
    
}

saveEditStudentRow = (e) => {
    if (!e) e = window.event;

    const targetID = e.getAttribute("name")

    const sName = e.parentNode.parentNode.childNodes[3]
    const sAttendance = e.parentNode.parentNode.childNodes[5]
    const sSubject =e.parentNode.parentNode.childNodes[7]

    const updateData = {
        sName: sName.innerHTML,
        sAttendance: sAttendance.innerHTML,
        sSubject: sSubject.innerHTML,
    };
  
    let studentCopy = globalStudentsData
    studentCopy = studentCopy.map((std) => 
        (std.id === targetID) ? {
            id: std.id,
            url: std.url,
            fullname: updateData.sName,
            subject: updateData.sSubject,
            attendance: updateData.sAttendance
          } : std
    )

    globalStudentsData = studentCopy
    saveToLocalStorage()
  
    sName.setAttribute("contentEditable", "false");
    sAttendance.setAttribute("contentEditable", "false");
    sSubject.setAttribute("contentEditable", "false");
    
    e.innerHTML = "Edit"
}
searchStudent = (e) => {
    if (!e) e = window.event;

    while(studentDetails.firstChild) {
	studentDetails.removeChild(studentDetails.firstChild)
    }

    const resultData = globalStudentsData.filter(({fullname}) => fullname.includes(e.value))
  
    resultData.map((std) => {
       studentDetails.insertAdjacentHTML("afterbegin", generateStudentRow(std));
    })
}



