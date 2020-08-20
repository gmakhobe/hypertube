/*******
 * 
 * 
 *  This file is for JAVASCRIPT Frontend ONLY
 *  DO NOT INCLUDE ANY OF THE Backend FEATURES AS THEY WILL BREAK THE CODE.
 * 
 * 
 */

//Login User Function
function UserLogin(){
    //Get input from login page
    const email = document.getElementById("emailaddressLogin").value;
    const password = document.getElementById("password").value;
    const reqbody = `email=${email}&password=${password}`;
    const btnLogin = document.getElementById('btnLogin');
    //Hide after click
    btnLogin.style.display = "none";
    if (!email || !password){
        alert("All fields are required");
        btnLogin.style.display = "block";
        return ;
    }
    //Fetch Api to send a request
    fetch('http://localhost:5001/Login', {
        method: 'post',
        headers: {
            "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
        },
        body: reqbody
    })
    .then(res => {
        if (res.status == 200)
            return res.text();
        else
            alert("An error occured please try again!");
    })
    .then(text => {
        //Get results and convert them to an object
        const res = JSON.parse(text);
        //if ststus is true print success and locate to a different page else print error
        if (res.status){
            alert(res.message);
            localStorage.setItem('output', JSON.stringify(res.output));
            location.assign("/User/encounter");
        }else{
            alert(res.message);
        }
    })
    .catch(res => {
        //Print any error related to sending request
        alert(res);
    });
    //Display button after executing this function
    btnLogin.style.display = "block";
}
//Register User Function
function UserRegister(){
    //Get input from registration page
    const name = document.getElementById("firstname").value;
    const surname = document.getElementById("lastname").value;
    const dateofbirth = document.getElementById("dateofbirth").value;
    const gender = document.getElementById("gender").value;
    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const confirmpasword = document.getElementById("password2").value;
    const reqbody = `firstname=${name}&lastname=${surname}&dateofbirth=${dateofbirth}&gender=${gender}&username=${username}&email=${email}&password=${password}`;
    const btnReg = document.getElementById('btnRegister');
    //Hide after click
    btnReg.style.display = "none";
    if (!name || !surname || !dateofbirth || !gender || !username || !email || !password || !confirmpasword){
        alert("All fields are required");
        btnReg.style.display = "block";
        return ;
    }
    if (password !== confirmpasword){
        alert("Passowrd and confirm password are not the same.");
        btnReg.style.display = "block";
        return ;
    }
    //Fetch Api to send a request
    fetch('http://localhost:5001/register', {
        method: 'post',
        headers: {
            "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
        },
        body: reqbody
    })
    .then(res => {
        if (res.status == 200)
            return res.text();
        else
            alert("An error occured please try again!");
    })
    .then(text => {
        //Get results and convert them to an object
        const res = JSON.parse(text);
        //if ststus is true print success and locate to a different page else print error
        if (res.status){
            alert(res.message);
            location.assign("/login");
        }else{
            alert(res.message);
        }
    })
    .catch(res => {
        //Print any error related to sending request
        alert(res);
    });
    //Display button after executing this function
    btnReg.style.display = "block";
}