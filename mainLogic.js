  const baseUrl = "https://tarmeezacademy.com/api/v1"

  function setupUI(){
    const token = localStorage.getItem("token")

    const loginDiv = document.getElementById("logged-in--div")
    const logoutDiv = document.getElementById("logout-div")
    

    const addBtn = document.getElementById("add-btn")


    if (token == null){
        if(addBtn != null){
            addBtn.style.setProperty("display", "none", "important")
        }
      loginDiv.style.setProperty("display", "flex", "important")
      logoutDiv.style.setProperty("display", "none", "important")
    }else{
        if(addBtn != null){
            addBtn.style.setProperty("display", "flex", "important")
        }
      loginDiv.style.setProperty("display", "none", "important")
      logoutDiv.style.setProperty("display", "flex", "important")
      let user = getCurrentUser()
      document.getElementById("nav-username").innerHTML = user.username
      document.getElementById("nav-user-image").src = user.profile_image
  }
  }
  function loginBtnClicked(){
    const username =  document.getElementById("username-input").value
    const password =  document.getElementById("password-input").value

    const params = {
      "username": username,
      "password": password
    }
    const url = `${baseUrl}/login`
    toggleLoader(true)
    axios.post(url, params)
    .then((response)=>{
      localStorage.setItem("token", response.data.token)
      localStorage.setItem("user",JSON.stringify(response.data.user))

      const modal = document.getElementById("login-modal")
      const modalInstance = bootstrap.Modal.getInstance(modal)
      modalInstance.hide()
      showAlert("Logged in successfully")
      setupUI()

    }).catch((error)=>{
      const message = error.response.data.message
      showAlert(message, "danger")
    })
    .finally(()=>{
      toggleLoader(false)
    })
  }

  function toggleLoader(show = true){
    if(show){
      document.getElementById("loader").style.visibility = "visible"
    }else{
      document.getElementById("loader").style.visibility = "hidden"

    }
  }
  
  function logout(){
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    showAlert("Logged out successfully")
    setupUI()
  }

  function registerBtnClicked(){
    const name = document.getElementById("register-name-input").value
    const username =  document.getElementById("register-username-input").value
    const password =  document.getElementById("register-password-input").value
    const image =  document.getElementById("register-image-input").files[0]
    const email =  document.getElementById("register-email-input").value



    
      const token = localStorage.getItem("token")

      const formData = new FormData()
      formData.append("name", name)
      formData.append("username", username)
      formData.append("password", password)
      formData.append("image", image)
      formData.append("email", email)


      const headers = {
        "Content-Type" : "multipart/form-data"
      }
      const url = `${baseUrl}/register`
      toggleLoader(true)
      axios.post(url, formData, {
        headers
      })
    .then((response)=>{
      console.log(response)
      localStorage.setItem("token", response.data.token)
      localStorage.setItem("user",JSON.stringify(response.data.user))

      const modal = document.getElementById("register-modal")
      const modalInstance = bootstrap.Modal.getInstance(modal)
      modalInstance.hide()
      showAlert("New User Registered Successfully")
      setupUI()

    }).catch((error)=>{
      const message = error.response.data.message
      showAlert(message, "danger")
    }).finally(()=>{
      toggleLoader(false)
    })
  }

  function showAlert(customMessage, type="success"){
    const alertPlaceholder = document.getElementById('success-alert')
    const appendAlert = (message, type) => {
      const wrapper = document.createElement('div')
      wrapper.innerHTML = [
        `<div class="alert alert-${type} alert-dismissible" role="alert">`,
        `   <div>${message}</div>`,
        '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
        '</div>'
      ].join('')

      alertPlaceholder.append(wrapper)
    }

 
        appendAlert(customMessage, type)

        setTimeout(()=>{
          const alert = bootstrap.Alert.getOrCreateInstance("#success-alert")
          //alert.close()
        },2000)
       
     
  }

 function getCurrentUser(){
    let user = ""
    const storageUser = localStorage.getItem("user")

    if (storageUser != null){
      user = JSON.parse(storageUser)
    }
    return user
 }

 function editPostBtnClicked(postObject){

  let post = JSON.parse(decodeURIComponent(postObject))
  console.log(post)
  document.getElementById("post-modal-submit-btn").innerHTML = "Update"
  document.getElementById("post-id-input").value = post.id
  document.getElementById("post-modal-title").innerHTML = "Edit Post"
  document.getElementById("post-title-input").value = post.title
  document.getElementById("post-body-input").value = post.body

  let postModal = new bootstrap.Modal(document.getElementById("create-post-modal"), {})
  postModal.toggle()
}

function deletePostBtnClicked(postObject){
  let post = JSON.parse(decodeURIComponent(postObject))
  console.log(post)

  document.getElementById("delete-post-id-input").value = post.id

  
  let postModal = new bootstrap.Modal(document.getElementById("delete-post-modal"), {})
  postModal.toggle()
}


function confirmePostDelete(){
  const postId = document.getElementById("delete-post-id-input").value
  const token = localStorage.getItem("token")

  
  const url = `${baseUrl}/posts/${postId}`
  const headers = {
    "Content-Type" : "multipart/form-data",
    "authorization": `Bearer ${token}`
  }
  axios.delete(url, {
    headers
  })
  .then((response)=>{
    console.log(response)
    

    const modal = document.getElementById("delete-post-modal")
    const modalInstance = bootstrap.Modal.getInstance(modal)
    modalInstance.hide()
    showAlert("The Post Has Been Deleted" , "danger")
    getPosts()
    setupUI()

  }).catch((error)=>{
    const message = error.response.data.message
    showAlert(message, "danger")
  })
}

function createNewClicked(){
  let postId = document.getElementById("post-id-input").value
  let isCreate = postId == null || postId == ""
  
  

  const title =  document.getElementById("post-title-input").value
  const body =  document.getElementById("post-body-input").value
  const image =  document.getElementById("post-image-input").files[0]

  const token = localStorage.getItem("token")

  const formData = new FormData()
  formData.append("body", body)
  formData.append("title", title)
  formData.append("image", image)

  const headers = {
    "Content-Type" : "multipart/form-data",
    "authorization": `Bearer ${token}`
  }
  let url = ``

  if (isCreate){

    url = `${baseUrl}/posts`

  }else{

    formData.append("_method", "put")
    url = `${baseUrl}/posts/${postId}`

  }

  axios.post(url, formData, {
    headers
  })
  .then((response)=>{

    const modal = document.getElementById("create-post-modal")
    const modalInstance = bootstrap.Modal.getInstance(modal)
    modalInstance.hide()
    showAlert("New Post Has Been Created", "success")
    setupUI()
    getPosts()
    
  }).catch((error)=>{
    const message = error.response.data.message
    showAlert(message, "danger")
  })

  
  
}

function profileClicked(){
  const user = getCurrentUser()
  const userId = user.id
  window.location = `profile.html?userId=${userId}`
}

