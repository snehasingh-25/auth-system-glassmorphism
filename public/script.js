const signupform=document.getElementById('signupform');
const signinform=document.getElementById('signinform');
const profile=document.getElementById('profile');
const profileUsername=document.getElementById('profile-username');
const title=document.getElementById('text');
const logoutButton=document.getElementById('logout');

function show(form) {
  if (form === 'signup') {
    title.textContent = 'Sign Up';
    signupform.style.display = 'block';
    signinform.style.display = 'none';
    profile.style.display = 'none';
  } else if (form === 'signin') {
    title.textContent = 'Sign In';
    signupform.style.display = 'none';
    signinform.style.display = 'block';
    profile.style.display = 'none';
  } else if (form === 'profile') {
    title.textContent = 'Profile';
    signupform.style.display = 'none';
    signinform.style.display = 'none';
    profile.style.display = 'block';
  }
}

signupform.addEventListener('submit',signup);
async function signup(e){
    e.preventDefault();
    const formData=new FormData(signupform);
    const username=formData.get('username');
    const password=formData.get('password');

    try{
        await axios.post('/signup',{
            username,password
        })
        alert('User Signed Up Successfully! Now you can Sign In');
        show('signin');
    }
    catch(error){
        alert(error.response.data.message);
    }
}


signinform.addEventListener('submit',signin);
async function signin(e){
    e.preventDefault();
    const formData=new FormData(signinform);
    const username=formData.get('username');
    const password=formData.get('password');
    
    try{
        const response=await axios.post('/signin',{
            username,password
        })
        const token=response.data.token;
        localStorage.setItem("token",token);
        show('profile');
        getProfile();
    }
    catch(error){
        alert(error.response.data.message);
    }
}



async function getProfile(){
    const token=localStorage.getItem("token");
    const res= await axios.get('/profile',{
        headers:{
            token:token
        }
    })
    profileUsername.textContent=res.data.username;
}

logoutButton.addEventListener('click', () => {
  localStorage.removeItem('token');
  show('signin');
});

window.addEventListener('DOMContentLoaded', async () => {
  const token = localStorage.getItem('token');

  if (!token) return show('signup');

  try {
    await getProfile();
    show('profile');
  } catch {
    localStorage.removeItem('token');
    show('signin');
  }
});


