if (!localStorage.getItem("output"))
    location.assign("../");

const FETCH = (URL, METHOD, reqBODY) => {
    return new Promise((resolve, reject) => {
        
        fetch(URL, {
            method: METHOD,
            headers: {
                "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
            },
            body: reqBODY
        })
        .then(res => {
            if (res.status == 200)
                return res.text();
            else
                alert("An error occured please try again!");
        })
        .then(text => {
            localStorage.removeItem('output');
            location.assign('../');
        })
        .catch(res => {
            //Print any error related to sending request
            reject("An error occured please try again: Request was not a success.");
        });
    })
}