let slideIndex = {};

function shiftSlides(n, name) {
    if (slideIndex[name])
        showSlides(slideIndex[name].curr += n, name);
}

function showSlides(n, name) {

    let div = document.getElementById(name);

    if (!div) return;

    let slides = div.children;

    if (n >= slides.length) { slideIndex[name].curr = 0 }
    if (n < 0) { slideIndex[name].curr = slides.length - 1 }
    for (let slide of slides) {
        slide.style.display = "none";
    }

    slides[slideIndex[name].curr].style.display = "block";
}

function startGalleries() {
    for (gallery of document.getElementsByClassName("post_gallery")) {
        if (!slideIndex[gallery.title].started) {
            slideIndex[gallery.title].started = true;
            showSlides(0, gallery.title);
        }
    }
}

function getGalleryDiv(post) {

    let gallery = document.createElement("div");
    gallery.className = "post_gallery post_element";
    gallery.title = post.name;
    slideIndex[post.name] = { curr: 0, started: false };

    let imageDiv = document.createElement("div");
    imageDiv.className = "post_gallery_images slideshow_container post_element";
    imageDiv.id = post.name;

    let images = post.gallery_data.items.map(item => post.media_metadata[item.media_id].p[post.media_metadata[item.media_id].p.length - 1].u)
    for (image of images) {
        let div = document.createElement("div");
        div.className = "slideshow_slide post_element";
        div.title = (images.indexOf(image) + 1);

        let div2 = document.createElement("div");
        div2.className = "slideshow_number post_element";
        div2.innerText = div.title + "/" + images.length;

        let img = document.createElement("img");
        img.className = "slideshow_image post_element post_image";
        img.src = image;

        div.appendChild(img);
        div.appendChild(div2);
        imageDiv.appendChild(div);
    }

    gallery.appendChild(imageDiv);

    let prev = document.createElement("a");
    prev.className = "prev no_click_passthrough";
    prev.onclick = () => shiftSlides(-1, post.name);

    let left = document.createElement("p");
    left.className = "hoverable arrow_left_p no_click_passthrough";
    left.style = "text-align: center;";
    let ileft = document.createElement("i");
    ileft.className = "arrow arrow_left no_click_passthrough";
    left.appendChild(ileft);
    prev.appendChild(left);
    gallery.appendChild(prev);

    let next = document.createElement("a");
    next.className = "next no_click_passthrough";
    next.onclick = () => shiftSlides(1, post.name);

    let right = document.createElement("p");
    right.className = "hoverable arrow_right_p no_click_passthrough";
    right.style = "text-align: center;";
    let iright = document.createElement("i");
    iright.className = "arrow arrow_right no_click_passthrough";
    right.appendChild(iright);
    next.appendChild(right);
    gallery.appendChild(next);

    return gallery;
}