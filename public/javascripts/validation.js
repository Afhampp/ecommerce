const name=document.getElementById("name")
const email=document.getElementById("email")
const phone=document.getElementById("phone")
const password=document.getElementById("password")
const repeatpass=document.getElementById("repeatpass")

const nameerror=document.getElementById("nameerror")
const emailerror=document.getElementById("emalierror")
const phoneerror=document.getElementById("phoneerror")
const passworderror=document.getElementById("passworderror")
const repeatpasserror=document.getElementById("repeatpasserror")

const emailregex = /^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+\.com$/;


function checker(){

    if(name.value.trim()==="" || name.value.trim()===null){
        nameerror.innerHTML="name required"
        console.log("name")
        return false
    }
    else if(email.value.trim()===""|| email.value.trim()===null){
        console.log("nemail")
        emailerror.innerHTML="email required"
        return false
    }
    else if(emailregex.test(email.value)==false){
        console.log(".com")
        emailerror.innerHTML="Invalid email"
        return false
    }
    else if(phone.value.trim()==="" || isNaN(phone.value)){
        console.log("phone adichno")
        phoneerror.innerHTML="phone number required"
        return false
    }
    else if(phone.value.length<10){
        console.log("lenght indo")
        phoneerror.innerHTML="required 10 digit number"
        return false
    }
    else if(password.value===""|| password.value===null){
        console.log("password kali anno")
        passworderror.innerHTML="password required"
        return false
    }
    else if(repeatpass.value!==password.value){
        console.log("orethano")
        repeatpasserror.innerHTML="passwords are not the same"
        return false
    }
   
    return true
}
