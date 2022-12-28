const nameInput = document.querySelector('#name');
const submitButton = document.querySelector('.submit');
const userImage = document.querySelector('.user-image');
const userName = document.querySelector('.user-name');
const userBlog = document.querySelector('.user-blog');
const userLocation = document.querySelector('.user-location');
const userBio = document.querySelector('.user-bio');

const resultInfo= document.querySelector('.result-info')

const resultContainer = document.querySelector('.result-container')



async function getUser(e) {
  let name = nameInput.value;
  e.preventDefault();
  try {
      let response = await fetch(`https://api.github.com/users/${name}`);
      let obj = await response.json();
      if (response.status != 200) {
        resultInfo.style.display='block';
        resultContainer.style.display='none';
        window.localStorage.setItem(name, JSON.stringify(obj));
        resultInfo.innerHTML = "<span style='color:#ff0000;text-align: center'> user not found </span>"
        return Promise.reject(`Request failed with error ${response.status}`);
      }
      resultContainer.style.display = 'block'
      let data = await JSON.parse(window.localStorage.getItem(name));
      let ls = 0
      if (data == null) {
        window.localStorage.setItem(obj.login, JSON.stringify(obj));
      }
      else{
        ls = 1
      }
      setInformation(obj,ls)

  }
  catch (e) {
      console.log(e);
  }
}


// show user info result to user
function setInformation(obj,local_storage) {
    if (local_storage===1){
      resultInfo.innerHTML = "<span style='font-size:10px'> Fetched data using local storage</span>"
    }
    else{
      resultInfo.innerHTML = "<span style='font-size:10px'> New request</span>"
    }
  userImage.innerHTML = "<input type='image' width='100px' height='100px'  src=" + obj.avatar_url + ">"
  userName.innerHTML = "<fieldset class='fieldset'> <legend> Name </legend> <p>" + obj.name + "</p></fieldset>"
  userBlog.innerHTML = "<fieldset class='fieldset'> <legend> Blog </legend> <p>" + obj.blog + "</p></fieldset>"
  userLocation.innerHTML = "<fieldset class='fieldset'> <legend> Location </legend> <p>" + obj.location + "</p></fieldset>"
  userBio.innerHTML = "<fieldset class = 'fieldset'> <legend> Bio </legend> <span style='white-space: pre-wrap'> " + obj.bio + "</span> </fieldset>";


}

submitButton.addEventListener('click', getUser);
window.localStorage.clear();
