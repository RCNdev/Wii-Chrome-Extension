// Initialize butotn with users's prefered color
let showInfo = document.getElementById("showInfo");


// When the button is clicked, inject setPageBackgroundColor into current page
showDimensions.addEventListener("click", async () => {
  console.dir("showInfo");
  
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: showImageInfo,
  });
});



// The body of this function will be execuetd as a content script inside the
// current page
function showImageInfo() {
    //clear info
    const elements = document.getElementsByClassName('WiiInfo');
    while(elements.length > 0){
        elements[0].parentNode.removeChild(elements[0]);
    }

    //get all images
    var allImages = document.getElementsByTagName('img');

    let large = 'red';
    let med = 'orange';
    let small = 'green';
    let unknown = 'purple';

    for(var i = 0; i < allImages.length ; i++) {
        var thisImg  = allImages[i];      
        
        //Get picture info
        let w = thisImg.width;
        let h = thisImg.height;
        let nw = thisImg.naturalWidth;
        let nh = thisImg.naturalHeight;
        let x = thisImg.offsetLeft;
        let y = thisImg.offsetTop;

        let infoText = x + "," + y + " File size: ";
        infoText = "";

        //file size
        var url = thisImg.src;
        let fileSize = 0;
        if (url && url.length > 0)
        {
            var iTime = performance.getEntriesByName(url)[0];
            console.log(iTime.transferSize + ' ' +iTime.encodedBodySize + ' ' + iTime.decodedBodySize ); //or encodedBodySize, decodedBodySize
            fileSize = (iTime.transferSize/1000).toFixed(2);
            infoText += fileSize + 'kb';
        }

        infoText += " " + w + "x" + h + "px. Source: " + nw + "x" + nh + "px";
        
        //Create extra div to display info
        const parent = thisImg.parentNode;
        const wrapper = document.createElement('div');  

        const infoDiv = document.createElement("div");
        console.dir(infoText);
        const infoContent = document.createTextNode(infoText);
        infoDiv.appendChild(infoContent);

        //Info div Styling
        infoDiv.attributeStyleMap.clear()
        infoDiv.style.position = 'absolute'
        infoDiv.style.backgroundColor = '#ffffff';
        infoDiv.style.padding = '2px';
        infoDiv.style.borderColor = '#000000';
        infoDiv.style.borderWidth = '1px';
        infoDiv.style.borderWidth = '#000000';
        infoDiv.style.left  = x;
        infoDiv.style.top = y + h;
        infoDiv.style.fontSize = 'small';
        infoDiv.style.opacity = "0.8";
        infoDiv.classList.add('WiiInfo');

        //File size warning colours
        if(fileSize > 100) { infoDiv.style.color = large; }
        if(fileSize < 100) { infoDiv.style.color = med; }
        if(fileSize < 10) { infoDiv.style.color = small; }
        if(fileSize == 0) { infoDiv.style.color = unknown; }
       
        
        // set the wrapper as child (instead of the element)
        parent.replaceChild(wrapper, thisImg);
        // set element as child of wrapper
        wrapper.appendChild(thisImg);
        wrapper.appendChild(infoDiv);
        thisImg.title = infoText;
        //document.body.insertBefore(infoDiv, thisImg);
        
    }
}

