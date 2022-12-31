const nameInput = document.querySelector('#name');
const submitButton = document.querySelector('.submit');
const userImage = document.querySelector('.user-image');
const userName = document.querySelector('.user-name');
const userBlog = document.querySelector('.user-blog');
const userLocation = document.querySelector('.user-location');
const userBio = document.querySelector('.user-bio');
const userLanguage = document.querySelector('.user-language');
const resultInfo= document.querySelector('.result-info')
const fetchInfo= document.querySelector('.fetch-info')
const resultContainer = document.querySelector('.result-container')



// main function when it gets clicked
// if data is in local storage we fetch it from it
// id data is new we fetch information from api and save it in local storage
async function getUser(e) {
  let name = nameInput.value;
  e.preventDefault();
  try {
    let data = await JSON.parse(window.localStorage.getItem(name))
    if (data == null) {
      let response = await fetch(`https://api.github.com/users/${name}`);
      let obj = await response.json()
      window.localStorage.setItem(name, JSON.stringify(obj));
      if (response.status != 200) {
        userNotFound(0)
      }
      else if (response.status == 200) {
        userFound(obj,0)
        fetchRepos(name)
      }
    }
    else if (data.message == 'Not Found'){
      userNotFound(1)
    }
    else{
      userFound(data,1)
      fetchRepos(name)
    }
  }
  catch (err) {
    serverError()

  }
}

// if connection is disconnected
function serverError(){
  resultInfo.style.display = 'block';
  resultContainer.style.display = 'none';
  fetchInfo.style.display='none';
  resultInfo.innerHTML = "<span style='color:#ff0000;text-align: center'> Server error </span>"
}

async function fetchRepos(name){
  const resp = await fetch(`https://api.github.com/users/${name}/repos?sort=pushed_at`);
  let obj = await resp.json()

  var language = {}

  for (let i = 0; i < 5 ; i++) {
    if (language[obj[i]['language']] === undefined) {
      language[obj[i]['language']] = 1
    } else {
      language[obj[i]['language']] += 1
    }
  }

  var items = Object.keys(language).map((key) => { return [key, language[key]] });

  items.sort((first, second) => { return first[1] - second[1] });


  var keys = items.map((e) => { return e[0] });

  console.log(keys)
  keys = keys.filter(value => {return value !== 'null'})
  console.log(keys)

  userLanguage.innerHTML = "<fieldset class = 'fieldset'> <legend> Language </legend> <span style='white-space: pre-wrap'> " + keys[keys.length -1 ] + "</span> </fieldset>";

}
// if users hasn't been found
function userNotFound(local_storage){
  resultInfo.style.display = 'block';
  resultContainer.style.display = 'none';
  resultInfo.innerHTML = "<span style='color:#ff0000;text-align: center'> user not found </span>"
  setfetchInfo(local_storage)
}

// shows if we use a NEW REQUEST for information or get it from local storage
function setfetchInfo(local_storage){
  if (local_storage === 1) {
    fetchInfo.innerHTML = "<span style='font-size:10px'> Fetched using local storage </span>"
  }
  else{
    fetchInfo.innerHTML = "<span style='font-size:10px'> New request</span>"
  }
}

// if user is found
function userFound(data,local_storage){
  resultInfo.style.display = 'none';
  resultContainer.style.display = 'block'
  setfetchInfo(local_storage)
  setInformation(data,local_storage)
}

// show user info result to user
function setInformation(obj,local_storage) {
  userImage.innerHTML = "<img width='100px' height='100px' alt='profile' src=" + obj.avatar_url + "/>";

  if (obj.name == null){
    userName.innerHTML = "<fieldset class='fieldset'> <legend> Name </legend> <p>" + "</p></fieldset>"}
  else {
    userName.innerHTML = "<fieldset class='fieldset'> <legend> Name </legend> <p>" + obj.name + "</p></fieldset>"
  }

  if (obj.blog == null) {
    userBlog.innerHTML = "<fieldset class='fieldset'> <legend> Blog </legend> <p>" + "</p></fieldset>";
  } else {
    userBlog.innerHTML = "<fieldset class='fieldset'> <legend> Blog </legend> <p>" + obj.blog + "</p></fieldset>"
  }

  if (obj.location == null) {
    userLocation.innerHTML = "<fieldset class='fieldset'> <legend> Location </legend> <p>" + "</p></fieldset>"
  } else {
    userLocation.innerHTML = "<fieldset class='fieldset'> <legend> Location </legend> <p>" + obj.location + "</p></fieldset>"
  }

  if (obj.bio == null) {
    userBio.innerHTML = "<fieldset class = 'fieldset'> <legend> Bio </legend> <span style='white-space: pre-wrap'> " + "</span> </fieldset>";
  }
  else {
    userBio.innerHTML = "<fieldset class = 'fieldset'> <legend> Bio </legend> <span style='white-space: pre-wrap'> " + obj.bio + "</span> </fieldset>";
  }

}


// add listener to submit button
submitButton.addEventListener('click', getUser);
// window.localStorage.clear();
