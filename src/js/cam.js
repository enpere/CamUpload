;(function(name, context, definition) {
    if (typeof module != 'undefined' && module.exports) module.exports = definition();
    else if (typeof define == 'function' && define.amd) define(definition);
    else context[name] = definition();
}("Cam", this, function() {
    'use strict';


    var q = function(el, scope) {
        return (scope || document).querySelector(el);
        },
        qa = function(el, scope) {
        return (scope || document).querySelector(el);
    	},
        ce = function(el, props) {
        	el = document.createElement(el);

        	if(typeof props === 'object') {
        		Object.keys(props).forEach(function(key) {
	        		el.setAttribute(key, props[key]);
        		});
        	}
        	return el;
        };

    function Cam(options) {
    	this.options = options;
        this.el = q(options.el);
    }


    function DesktopCam() {
		this.el.style.width  = this.options.width  || "300px";
		this.el.style.height = this.options.height || "500px";

       	var button = ce('button', { id: "snapshot", class: "test"});
       	button.innerText = "Snap photo";
       	q('body').appendChild(button);
        Webcam.attach(this.el);

       	button.addEventListener('click', function() {
    		Webcam.snap(function(data) {
    			console.log(data);
    			Webcam.upload(data, options.uploadUri, function(code, text) {
    				console.log(code, text);
    			});
    		});
       	});
    }


    function MobileCam() {
    	var node = ce("input", { "type": "file", "id": "picture", "capture": "camera", "accept": "image/*"}),
    		el = this.el;
	    	el.appendChild(node);

        var takePicture = node,
        	showPicture = ce("img", { "id": "showPicture"});
        	el.appendChild(showPicture);

        if (takePicture && showPicture) {
            // Set events
            takePicture.onchange = function(event) {
                // Get a reference to the taken picture or chosen file
                var files = event.target.files,
                    file;
                if (files && files.length > 0) {
                    file = files[0];
                    try {
                        // Get window.URL object
                        var URL = window.URL || window.webkitURL;
                        // Create ObjectURL
                        var imgURL = URL.createObjectURL(file);
                        // console.log(imgURL);
                        // // // Set img src to ObjectURL
                        // showPicture.src = imgURL;
                        // // // Revoke ObjectURL
                        // URL.revokeObjectURL(imgURL);
                       	var ctx = el.getContext("2d"); 
                       	console.log(imgURL);
                       	var photo = new Image();
                       	photo.onload = function() {
                       	    //draw photo into canvas when ready
  							ctx.drawImage(photo, 0, 0, 500, 400);
                       	};

                       	photo.src = imgUrl;
                       	URL.revokeObjectURL(imgURL);
                    } catch (e) {
                        try {
                            // Fallback if createObjectURL is not supported
                            var fileReader = new FileReader();
                            fileReader.onload = function(event) {
                                showPicture.src = event.target.result;
                            };
                            fileReader.readAsDataURL(file);
                        } catch (event) {
                            //
                            var error = document.querySelector("#error");
                            if (error) {
                                error.innerHTML = "Neither createObjectURL or FileReader are supported";
                            }
                        }
                    }
                }
            };
        }
    }

    function isMobile() {
        return Modernizr.touch;
    }

    Cam.prototype = {
        attach: function() {
            if (isMobile()) {
                this.delegate = MobileCam.call(this);
            } else {
                this.delegate = DesktopCam.call(this);
            }
        },
        snap: function() {

        },
        upload: function() {

        }
    };

    return Cam;
}));
