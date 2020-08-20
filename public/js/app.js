//Class just to group functionalities
class ShowUserInformation{
    //Custructor checks of we have an item outpuu if not redirects
    constructor(){
        if (!localStorage.getItem('output'))
            location.assign('../');
    }
    //returns an object
    getStoredObject(){
        return JSON.parse(localStorage.getItem('output'));
    }

    object = this.getStoredObject();
    
    showFullName(){
        return `${this.object.FirstName} ${this.object.LastName}`;
    }
    showUserName(){
        return `${this.object.Username}`;
    }
}
//Display Class
class Display{
    displayUsingID(ID, Content){
        document.getElementById(ID).innerHTML = Content;
    }
    displayUsingName(Name, Index = 0, Content){
        document.getElementsByTagName(Name)[Index].innerHTML = Content;
    }
    displayUsingClassName(Name, Index = 0, Content){
        document.getElementsByClassName(Name)[Index].innerHTML = Content;
    }
}
//Instatiate objects
let showInfo = new ShowUserInformation();
let display = new Display();
let fullname = showInfo.showFullName();
let username = showInfo.showUserName();
//Display on frontend
display.displayUsingClassName('FullName', 0, fullname);
display.displayUsingClassName('FullName', 1, fullname);
display.displayUsingClassName('UserName', 0, username);
