let map;
let markers = [];
let hikes;

function checkStatus(response) {
     if (response.status >= 200 && response.status < 300) {
         return response.text();
     } else {
         return Promise.reject(new Error(response.status +
                                         ": " + response.statusText));
     }
}

function setMapOnAll(map) {
  for (let i = 0; i < markers.length; i++) {
      markers[i].setMap(map);
  }
}


function setUpButtons() {
  document.getElementById("hide-btn").onclick = function() {
    setMapOnAll(null);
  }
  document.getElementById("show-btn").onclick = function() {
    setMapOnAll(map);
  }
  document.getElementById("search-button").onclick = function() {
    let text = document.getElementById("search-bar").value;
    let rating = document.getElementById("rating-value").value;
    let gain = document.getElementById("gain-value").value;
    let peak = document.getElementById("peak-value").value;
    let distance = document.getElementById("distance-value").value;
    showHikesWithStats(text, rating, gain, peak, distance);
  }
}

function showHikesWithStats(text, rating, gain, peak, distance) {
  for (let i = 0; i < hikes.length; i++) {
    if (hikes[i].rating < rating ) {
      markers[i].setMap(null);
    } else if (parseInt(hikes[i].gain) < parseInt(gain) * 500 || hikes[i].gain == "unknown") {
      markers[i].setMap(null);
    } else if (parseInt(hikes[i].top) < parseInt(peak) * 500 || hikes[i].top == "unknown") {
      markers[i].setMap(null);
    } else if (parseInt(hikes[i].distance) < parseInt(distance)|| hikes[i].distance == "unknown") {
      markers[i].setMap(null);
    } else if (!hikes[i].name.toLowerCase().includes(text.toLowerCase())) {
      markers[i].setMap(null);
    } else {
      markers[i].setMap(map);
    }
  }
}


function setUpSliders() {
  let ratingSlider = document.getElementById("rating-slide");
  let ratingOutput = document.getElementById("rating-value");
  ratingOutput.innerHTML = ratingSlider.value;
  ratingSlider.oninput = function() {
    ratingOutput.innerHTML = this.value;
    let text = document.getElementById("search-bar").value;
    let gain = document.getElementById("gain-value").innerHTML;
    let peak = document.getElementById("peak-value").innerHTML;
    let distance = document.getElementById("distance-value").innerHTML;
    showHikesWithStats(text, this.value, gain, peak, distance);
  }
  let gainSlider = document.getElementById("gain-slide");
  let gainOutput = document.getElementById("gain-value");
  gainOutput.innerHTML = parseInt(gainSlider.value) * 500;
  gainSlider.oninput = function() {
    gainOutput.innerHTML = parseInt(this.value) * 500;
    let text = document.getElementById("search-bar").value;
    let rating = document.getElementById("rating-value").innerHTML;
    let peak = document.getElementById("peak-value").innerHTML;
    let distance = document.getElementById("distance-value").innerHTML;
    showHikesWithStats(text, rating, this.value, peak, distance);
  }
  let peakSlider = document.getElementById("peak-slide");
  let peakOutput = document.getElementById("peak-value");
  peakOutput.innerHTML = parseInt(peakSlider.value) * 500;
  peakSlider.oninput = function() {
    peakOutput.innerHTML = parseInt(this.value) * 500;
    let text = document.getElementById("search-bar").value;
    let rating = document.getElementById("rating-value").innerHTML;
    let gain = document.getElementById("gain-value").innerHTML;
    let distance = document.getElementById("distance-value").innerHTML;
    showHikesWithStats(text, rating, gain, this.value, distance);
  }
  let distanceSlider = document.getElementById("distance-slide");
  let distanceOutput = document.getElementById("distance-value");
  distanceOutput.innerHTML = distanceSlider.value;
  distanceSlider.oninput = function() {
    distanceOutput.innerHTML = parseInt(this.value);
    let text = document.getElementById("search-bar").value;
    let rating = document.getElementById("rating-value").innerHTML;
    let gain = document.getElementById("gain-value").innerHTML;
    let peak = document.getElementById("peak-value").innerHTML;
    showHikesWithStats(text, rating, gain, peak, this.value);
  }
}


function ratingStars(rating) {
  if (rating > 4.5) {
    return "<span class=\"fa fa-star checked\"></span>" +
    "<span class=\"fa fa-star checked\"></span>" +
    "<span class=\"fa fa-star checked\"></span>" +
    "<span class=\"fa fa-star checked\"></span>" +
    "<span class=\"fa fa-star checked\"></span>"
  } else if (rating > 3.5) {
    return "<span class=\"fa fa-star checked\"></span>" +
    "<span class=\"fa fa-star checked\"></span>" +
    "<span class=\"fa fa-star checked\"></span>" +
    "<span class=\"fa fa-star checked\"></span>" +
    "<span class=\"fa fa-star\"></span>"
  } else if (rating > 2.5) {
    return "<span class=\"fa fa-star checked\"></span>" +
    "<span class=\"fa fa-star checked\"></span>" +
    "<span class=\"fa fa-star checked\"></span>" +
    "<span class=\"fa fa-star\"></span>" +
    "<span class=\"fa fa-star\"></span>"
  } else if (rating > 1.5) {
    return "<span class=\"fa fa-star checked\"></span>" +
    "<span class=\"fa fa-star checked\"></span>" +
    "<span class=\"fa fa-star\"></span>" +
    "<span class=\"fa fa-star\"></span>" +
    "<span class=\"fa fa-star\"></span>"
  } else if (rating > .5) {
    return "<span class=\"fa fa-star checked\"></span>" +
    "<span class=\"fa fa-star\"></span>" +
    "<span class=\"fa fa-star\"></span>" +
    "<span class=\"fa fa-star\"></span>" +
    "<span class=\"fa fa-star\"></span>"
  } else {
    return "<span class=\"fa fa-star\"></span>" +
    "<span class=\"fa fa-star\"></span>" +
    "<span class=\"fa fa-star\"></span>" +
    "<span class=\"fa fa-star\"></span>" +
    "<span class=\"fa fa-star\"></span>"
  }
}

function createModal(i) {
  let modal = document.createElement("div");
  modal.classList.add("hike-info");
  let header = document.createElement("div");
  header.style.marginBottom = "15px";
  header.class = "container-fluid";
  let btn = document.createElement("button");
  btn.classList.add("btn");
  btn.classList.add("btn-warning");
  btn.innerHTML = "Close";
  btn.onclick = function() {
    modal.style.display = "none";
  }
  btn.style.float = "right";
  let info = document.createElement("h1");
  info.innerHTML = hikes[i].name + " " + ratingStars(hikes[i].rating);
  info.style.fontFamily = "'Oswald', sans-serif";
  let infoSub = document.createElement("p");
  infoSub.innerHTML = "Peak: " + hikes[i].top + "ft. Gain: " + hikes[i].gain + "ft. Distance: " + hikes[i].distance + " miles";
  infoSub.style.fontSize = "8pt";
  infoSub.style.fontFamily = "'Oswald', sans-serif";
  infoSub.style.position = "absolute";
  infoSub.style.top = "35px";
  infoSub.style.left = "15px";
  header.appendChild(btn);
  header.appendChild(info);
  header.appendChild(infoSub);

  // tab navigation
  let ul = document.createElement("ul");
  ul.classList.add("nav");
  ul.classList.add("nav-tabs");
  let photos = document.createElement("li");
  let photosLink = document.createElement("a");
  photosLink.setAttribute("data-toggle", "tab")
  photosLink.href = "#photos" + i;
  photosLink.innerHTML = "Photos";
  photos.classList.add("active");
  photos.appendChild(photosLink);
  let comments = document.createElement("li");
  let commentsLink = document.createElement("a");
  commentsLink.setAttribute("data-toggle", "tab")
  commentsLink.href = "#comments" + i;
  commentsLink.innerHTML = "Comments";
  comments.appendChild(commentsLink);
  ul.appendChild(photos);
  ul.appendChild(comments);

  let content = document.createElement("div");
  content.classList.add("tab-content");

  // photo header
  let photoHeaderRow = document.createElement("div");
  photoHeaderRow.classList.add("row");

  // right side of photo header
  let postPhotoDiv = document.createElement("div");
  postPhotoDiv.classList.add("col-sm-8");
  postPhotoDiv.style.textAlign = "right";
  let postPhotoButton = document.createElement("button");
  postPhotoButton.classList.add("btn");
  postPhotoButton.classList.add("btn-primary");
  postPhotoButton.innerHTML = "Post a Photo";
  postPhotoButton.setAttribute("data-toggle", "collapse");
  postPhotoButton.setAttribute("data-target", "#postPhotoAccordian" + i);
  postPhotoDiv.appendChild(postPhotoButton);

  // photo accordian
  let postPhotoAccordian = document.createElement("div");
  postPhotoAccordian.classList.add("collapse");
  postPhotoAccordian.id = "postPhotoAccordian" + i;
  postPhotoAccordian.classList.add("photo-accordian");
  let photoInput = document.createElement("input");
  photoInput.setAttribute("type", "text");
  photoInput.setAttribute("size", "50");
  photoInput.setAttribute("placeholder", "paste url");
  photoInput.style.display = "inline";
  photoInput.id = "comment-input" + i;
  photoInput.style.border = "1px solid #e6e6e6";
  let photoSubmit = document.createElement("button");
  photoSubmit.style.marginRight = "0px";
  photoSubmit.style.marginLeft = "5px";
  photoSubmit.classList.add("btn");
  photoSubmit.classList.add("btn-primary");
  photoSubmit.innerHTML = "Post";
  photoSubmit.style.display = "inline";
  photoSubmit.onclick = function() {
    postPhoto(i);
  };
  let photoAlert = document.createElement("p");
  photoAlert.id = "photo-alert" + i;
  photoAlert.style.color = "red";
  photoAlert.style.fontStyle = "italic";
  postPhotoAccordian.appendChild(photoInput);
  postPhotoAccordian.appendChild(photoSubmit);
  postPhotoAccordian.appendChild(photoAlert);

  // photoheader putting it all together
  let photosHeader = document.createElement("div");
  let otherPhotosDiv = document.createElement("div");
  otherPhotosDiv.classList.add("col-sm-4");
  let otherPhotosHeader = document.createElement("h2");
  otherPhotosHeader.style.margin = "0px";
  otherPhotosHeader.style.fontFamily = "'Oswald', sans-serif";
  otherPhotosHeader.innerHTML = "Photos";
  otherPhotosDiv.appendChild(otherPhotosHeader);
  photoHeaderRow.appendChild(otherPhotosDiv);
  photoHeaderRow.appendChild(postPhotoDiv);
  photosHeader.appendChild(photoHeaderRow);
  postPhotoDiv.appendChild(postPhotoAccordian);

  // photo section
  let photoContent = document.createElement("div");
  photoContent.classList.add("tab-pane");
  photoContent.classList.add("fade");
  photoContent.classList.add("in");
  photoContent.classList.add("active");
  photoContent.id ="photos" + i;
  let photoSection = document.createElement("div");
  photoSection.id = "photo-section" + i;
  photoSection.classList.add("container-fluid");
  photoSection.style.overflowY = "scroll";
  photoSection.style.height = "70vh";

  photoSection.appendChild(photosHeader);
  photoContent.appendChild(photoSection);
  content.appendChild(photoContent);

  // comment content
  let commentContent = document.createElement("div");
  commentContent.classList.add("tab-pane");
  commentContent.classList.add("fade");
  commentContent.id = "comments" + i;
  let commentSection = document.createElement("div");
  commentSection.classList.add("container-fluid");
  commentSection.classList.add("comment-section");
  let otherComments = document.createElement("div");
  otherComments.style.overflowY = "scroll";
  otherComments.style.height = "70vh";
  otherComments.classList.add("col-sm-12");

  // header
  let headerRow = document.createElement("div");
  headerRow.classList.add("row");

  let postCommentDiv = document.createElement("div");
  postCommentDiv.classList.add("col-sm-8");
  postCommentDiv.style.textAlign = "right";
  let postCommentButton = document.createElement("button");
  postCommentButton.classList.add("btn");
  postCommentButton.classList.add("btn-primary");
  postCommentButton.innerHTML = "Leave a comment";
  postCommentButton.setAttribute("data-toggle", "collapse");
  postCommentButton.setAttribute("data-target", "#postCommentAccordian" + i);
  postCommentDiv.appendChild(postCommentButton);

  let postCommentAccordian = document.createElement("div");
  postCommentAccordian.classList.add("collapse");
  postCommentAccordian.id = "postCommentAccordian" + i;
  postCommentAccordian.classList.add("comment-accordian");
  let commentInput = document.createElement("textarea");
  commentInput.id = "comment-input" + i;
  commentInput.style.border = "1px solid #e6e6e6";
  let commentSubmit = document.createElement("button");
  commentSubmit.style.marginRight = "0px";
  commentSubmit.style.marginLeft = "auto";
  commentSubmit.classList.add("btn");
  commentSubmit.classList.add("btn-primary");
  commentSubmit.innerHTML = "Post";
  commentSubmit.style.display = "block";
  commentSubmit.onclick = function() {
    postComment(i);
  };
  let commentAlert = document.createElement("p");
  commentAlert.id = "comment-alert" + i;
  commentAlert.style.color = "red";
  commentAlert.style.fontStyle = "italic";
  postCommentAccordian.appendChild(commentInput);
  postCommentAccordian.appendChild(commentSubmit);
  postCommentAccordian.appendChild(commentAlert);

  // other comments
  let commentsHeader = document.createElement("div");
  let otherCommentsDiv = document.createElement("div");
  otherCommentsDiv.classList.add("col-sm-4");
  let otherCommentsHeader = document.createElement("h2");
  otherCommentsHeader.style.margin = "0px";
  otherCommentsHeader.style.fontSize = "22pt";
  otherCommentsHeader.innerHTML = "Comments";
  otherCommentsHeader.style.fontFamily = "'Oswald', sans-serif";
  otherCommentsDiv.appendChild(otherCommentsHeader);
  headerRow.appendChild(otherCommentsDiv);
  headerRow.appendChild(postCommentDiv);
  commentsHeader.appendChild(headerRow);
  postCommentDiv.appendChild(postCommentAccordian);
  otherComments.appendChild(commentsHeader);

  let otherCommentsSection = document.createElement("div");
  otherCommentsSection.id = "previous-comments" + i;
  for (let j = hikes[i].comments.length - 1; j >= 0; j--) { // go in reverse so most recent comment appears first
    let commentdiv = document.createElement("div");
    commentdiv.classList.add("comment");
    let date = document.createElement("p");
    date.classList.add("date");
    date.innerHTML = hikes[i].comments[j].date;
    let commentp = document.createElement("p");
    commentp.innerHTML = hikes[i].comments[j].comment;
    commentdiv.appendChild(commentp);
    commentdiv.appendChild(date);
    otherCommentsSection.appendChild(commentdiv);
  }
  otherComments.appendChild(otherCommentsSection);

  commentSection.appendChild(otherComments);
  commentContent.appendChild(commentSection);
  content.appendChild(commentContent);

  modal.appendChild(header);
  modal.appendChild(ul);
  modal.appendChild(content);
  document.getElementById("hike-modals").appendChild(modal);
  return modal;
}

function todaysDate() {
  var today = new Date();
  var dd = today.getDate();
  var mm = today.getMonth()+1; //January is 0!
  var yyyy = today.getFullYear();
  if(dd<10) {
      dd = '0'+dd
  }
  if(mm<10) {
      mm = '0'+mm
  }
  today = mm + '/' + dd + '/' + yyyy;
  return today;
}

function postComment(i) {
  let comment = document.getElementById("comment-input" + i).value;
  document.getElementById("comment-input" + i).value = "";
  document.getElementById("comment-alert" + i).innerHTML = "";
  if (comment.length < 1) {
    document.getElementById("comment-alert" + i).innerHTML = "Please Enter a Comment";
  } else {
    hikes[i].comments.push({"comment": comment, "date":todaysDate()});
    let date = document.createElement("p");
    date.innerHTML = todaysDate();
    date.classList.add("date");
    let commentdiv = document.createElement("div");
    commentdiv.classList.add("comment");
    let commentp = document.createElement("p");
    commentp.innerHTML = comment;
    commentdiv.appendChild(commentp);
    commentdiv.appendChild(date);
    let firstChild = document.getElementById("previous-comments" + i).firstChild;
    document.getElementById("previous-comments" + i).insertBefore(commentdiv, firstChild);
    updateHikesText();
  }
}

function postPhoto(i) {
  let photo = document.getElementById("photo-input" + i).value;
  document.getElementById("photo-input" + i).value = "";
  document.getElementById("photo-alert" + i).innerHTML = "";
  if (comment.length < 1) {
    document.getElementById("photo-alert" + i).innerHTML = "Please Enter a url";
  } else {
    hikes[i].photos.push(photo);
    let image = document.createElement("img");
    image.src = photo;
    image.style.width = "50%";
    let firstChild = document.getElementById("photo-section" + i).firstChild;
    document.getElementsById("photo-section" + i).insertBefore(image, firstChild);
    updateHikesText();
  }
}

function updateHikesText() {
  $.post("updateData.php",
  {hikes: "{\"hikes\" :" +  JSON.stringify(hikes) + "}"
  },
  function(data, status) {
    //alert("Data: " + data + "\nStatus: " + status);
  });
}

function createToolTip(i) {
  return content = "<div class=\"container-fluid\">" +
                      "<div class=\"row\">" +
                        hikes[i].name +
                      "</div>" +
                      "<div class=\"row\">" +
                        ratingStars(hikes[i].rating) +
                      "</div>" +
                    "</div>"
}

function blowUpImage() {
  let imagediv = document.createElement("div");
  imagediv.classList.add("w3-container", "w3-center", "w3-animate-top");
  imagediv.style.opacity = "1";
  imagediv.classList.add("container-fluid");
  imagediv.style.padding = "4px";
  imagediv.style.position = "absolute";
  imagediv.style.width = this.naturalWidth + "px";
  imagediv.style.height = this.naturalHeight + "px";
  imagediv.style.maxWidth = "65vw";
  imagediv.style.maxHeight = "90vh";
  imagediv.style.left = "0";
  imagediv.style.right = "0";
  imagediv.style.top = "0";
  imagediv.style.bottom = "0";
  imagediv.style.margin = "auto";

  let innerimagediv = document.createElement("div");
  innerimagediv.style.border = "4px solid #f4f4f4";
  innerimagediv.style.position = "relative";
  innerimagediv.style.width = "100%";
  let closebtn = document.createElement("button");
  closebtn.style.fontFamily = "'Oswald', sans-serif";
  closebtn.classList.add("btn");
  closebtn.classList.add("btn-danger");
  closebtn.innerHTML = "Close";
  closebtn.style.position = "absolute";
  closebtn.style.top = "5px";
  closebtn.style.right = "5px";
  closebtn.onclick = function() {
    document.getElementById("map-area").removeChild(imagediv);
  }
  innerimagediv.appendChild(closebtn);
  let imageArea = document.createElement("div");
  imageArea.style.overflowY = "scroll"
  console.log(this.naturalWidth);
  imageArea.style.maxHeight = "88vh";
  let largeImage = document.createElement("img");
  //largeImage.classList.add("fade");
  largeImage.src = this.src;
  largeImage.style.width = "100%";
  imageArea.appendChild(largeImage);
  innerimagediv.appendChild(imageArea);
  imagediv.appendChild(innerimagediv);
  document.getElementById("map-area").appendChild(imagediv);
}


function initMap() {
  setUpButtons();
  setUpSliders();
  let uluru = {lat: 47.2049, lng: -120.706};
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 7,
    center: uluru,
  });
  fetch("python/hikes2.txt")
    .then(checkStatus)
    .then(function(responseText) {
      //ajax call succeeded
      hikes = JSON.parse(responseText).hikes;
      for (let i = 0; i < hikes.length; i++) {
        let marker = new google.maps.Marker({
          position: hikes[i].position,
          map: map
        });
        let content = createToolTip(i);
        let infowindow = new google.maps.InfoWindow({
          content: content
        });
        // make the popup
        let modal = createModal(i);

        marker.addListener('mouseover', function() {
          infowindow.open(map, marker);
        });
        marker.addListener('mouseout', function() {
          infowindow.close();
        });
        marker.addListener('click', function() {
          for (let j = 0; j < hikes[i].images.length; j++) {
            let image = document.createElement("img");
            image.classList.add("image")
            image.src = hikes[i].images[j];
            image.onclick = blowUpImage;
            if (hikes[i].images[j] != "unknown") {
              document.getElementById("photo-section" + i).appendChild(image);
            }
          }
          modal.style.display = "block";
        });
        markers.push(marker);
      }
    })
    .catch(function(error) {
      //ajax call failed
      console.log(error);
      alert("THERE WAS AN ERROR!");
    })
}
