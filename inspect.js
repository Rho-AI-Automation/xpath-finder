/* globals chrome */

var apikey = ''
var apiendpoint = ''
var connector = ''


function custominput(apilink,ihtex,idomain,ipageurl,ixpathtext){
  // var win = window.open("", "Title", "toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=yes,resizable=yes,width=400,height=200,modal=yes,top="+(screen.height-1000)+",left="+(screen.width-840));

  apilink = apilink + "&xpath="+ixpathtext+"&domain="+idomain+"&pageurl="+ipageurl
  var win = window.open(apilink, "Title", "toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=yes,resizable=yes,width=436,height=620,modal=yes,top="+(0)+",left="+(screen.width-840));
  // var win = window.open('','name','height=255,width=250,toolbar=no,directories=no,status=no, linemenubar=no,scrollbars=no,resizable=no ,modal=yes');

  //win.document.body.innerHTML = ihtex;

  //var xpath =win.document.getElementById('xpth')
  //var domain =win.document.getElementById('domain')
  //var pageurl =win.document.getElementById('pageurl')
  //var papikey =win.document.getElementById('apkikey')
  //var form =win.document.getElementById('form')
  
  //xpath.value = ixpathtext
  //domain.value = idomain
  //pageurl.value = ipageurl
  //papikey.value = apikey 
  //form.action =  apiendpoint + '/addxp'


  //xpath.setAttribute("readonly", true);
  //domain.setAttribute("readonly", true);
  //pageurl.setAttribute("readonly", true);
  //papikey.setAttribute("readonly", true);

}



function custombox(indomain,inpageurl,inxpathtext){
  var furl = chrome.extension.getURL("assets/popup.html");
  furl=furl
  var params = '?apitoken='+apikey+'&'+'xpath='+ inxpathtext + "&" + "inpageurl="+ encodeURIComponent(inpageurl)
  var xhttp = new XMLHttpRequest();

  custominput(apiendpoint+'/returnpop'+ params,ihtex=xhttp.responseText,indomain,inpageurl,inxpathtext)
  //xhttp.onreadystatechange = function() {
  //  if (this.readyState == 4 && this.status == 200) {
  //    custominput(apiendpoint+'/returnpop'+ params,ihtex=xhttp.responseText,indomain,inpageurl,inxpathtext)
  //  }
  //};
  //xhttp.open("GET", furl, true);
  //xhttp.open("GET",apiendpoint+'/returnpop'+ params, true);
  //xhttp.send(params);

}





// ------------------------------------------------------------------------------------------------------
function maptocsv(xmapdata) {  
  var result, ctr, keys, columnDelimiter, lineDelimiter, data;

  columnDelimiter = ',';
  lineDelimiter = '\n';
  result = '';

  for (const entry of xmapdata.entries()) {
    caption = entry[0]
    xpathval = entry[1]
    var temp_res = caption + ','+xpathval +'\n'
    result += temp_res
  }
  return result
}

function download(filename, text) {
  var a = window.document.createElement('a');
  a.position='absloute'
  var url = window.URL.createObjectURL(new Blob([text], {type: 'text/csv'}));
  a.href =  url
  a.innerText= url
  a.style.zIndex = 10000000;
  a.style.zIndex = 10000000;
  a.download = filename;
  document.body.appendChild(a);
  window.location.href = url
  document.body.prepend(a)
}


var xPathFinder = xPathFinder || (() => {
  // var dictdata = {};
  // var xMap = new Map();
  
  class Inspector {
    constructor() {
      this.win = window;
      this.doc = window.document;

      this.draw = this.draw.bind(this);
      this.getData = this.getData.bind(this);
      this.setOptions = this.setOptions.bind(this);

      this.cssNode = 'xpath-css';
      this.contentNode = 'xpath-content';
      this.overlayElement = 'xpath-overlay';
     
    }

    getData(e, iframe) {
      e.stopImmediatePropagation();
      e.preventDefault && e.preventDefault();
      e.stopPropagation && e.stopPropagation();

      if (e.target.id !== this.contentNode) {
        this.XPath = this.getXPath(e.target);
        const contentNode   = document.getElementById(this.contentNode);
        const iframeNode    = window.frameElement || iframe;
        const contentString = iframeNode ? `Iframe: ${this.getXPath(iframeNode)}<br/>XPath: ${this.XPath}` : this.XPath;

        if (contentNode) {
          contentNode.innerHTML = contentString;
        } else {
          const contentHtml = document.createElement('div');
          contentHtml.innerHTML = contentString;
          contentHtml.id = this.contentNode;
          document.body.appendChild(contentHtml);
        }

        this.options.clipboard && ( this.copyText(this.XPath) );
        var xp =this.XPath
        var domain = window.location.hostname
        var pageurl = window.location.href
        custombox(domain,pageurl,xp)
        // var caption = window.prompt("Enter field name: ")
        // var caption = e.target.innerText
        
        // dictdata[caption] = xp
        // xMap.set(caption,xp);
        e.target.style.color = '#FF0000';
   
        
      }
    }

    getOptions() {
      const storage = chrome.storage && (chrome.storage.local);
      const promise = storage.get({
        inspector: true,
        clipboard: true,
        shortid: true,
        position: 'bl',
        apikey: 'apikey',
        apiendpoint: 'apiendpoint'
      }, this.setOptions);
      (promise && promise.then) && (promise.then(this.setOptions()));
    }

  


    setOptions(options) {
      this.options = options;
      apikey = options.apikey;
      apiendpoint = options.apiendpoint;
      let position = 'bottom:0;left:0';
      switch (options.position) {
        case 'tl': position = 'top:0;left:0'; break;
        case 'tr': position = 'top:0;right:0'; break;
        case 'br': position = 'bottom:0;right:0'; break;
        default: break;
      }
      this.styles = `body *{cursor:crosshair!important;}#xpath-content{${position};cursor:initial!important;padding:10px;background:gray;color:white;position:fixed;font-size:14px;z-index:10000001;}`;
      this.activate();
    }

    createOverlayElements() {
      const overlayStyles = {
        background: 'rgba(120, 170, 210, 0.7)',
        padding: 'rgba(77, 200, 0, 0.3)',
        margin: 'rgba(255, 155, 0, 0.3)',
        border: 'rgba(255, 200, 50, 0.3)'
      };

      this.container = this.doc.createElement('div');
      this.node = this.doc.createElement('div');
      this.border = this.doc.createElement('div');
      this.padding = this.doc.createElement('div');
      this.content = this.doc.createElement('div');

      this.border.style.borderColor = overlayStyles.border;
      this.padding.style.borderColor = overlayStyles.padding;
      this.content.style.backgroundColor = overlayStyles.background;

      Object.assign(this.node.style, {
        borderColor: overlayStyles.margin,
        pointerEvents: 'none',
        position: 'fixed'
      });

      this.container.id = this.overlayElement;
      this.container.style.zIndex = 10000000;
      this.node.style.zIndex = 10000000;

      this.container.appendChild(this.node);
      this.node.appendChild(this.border);
      this.border.appendChild(this.padding);
      this.padding.appendChild(this.content);
    }

    removeOverlay() {
      const overlayHtml = document.getElementById(this.overlayElement);
      overlayHtml && overlayHtml.remove();
    }

    copyText(XPath) {
      const hdInp = document.createElement('textarea');
      hdInp.textContent = XPath;
      document.body.appendChild(hdInp);
      hdInp.select();
      document.execCommand('copy');
      hdInp.remove();
    }

    draw(e) {
      const node = e.target;
      if (node.id !== this.contentNode) {
        this.removeOverlay();

        const box = this.getNestedBoundingClientRect(node, this.win);
        const dimensions = this.getElementDimensions(node);

        this.boxWrap(dimensions, 'margin', this.node);
        this.boxWrap(dimensions, 'border', this.border);
        this.boxWrap(dimensions, 'padding', this.padding);

        Object.assign(this.content.style, {
          height: box.height - dimensions.borderTop - dimensions.borderBottom - dimensions.paddingTop - dimensions.paddingBottom + 'px',
          width: box.width - dimensions.borderLeft - dimensions.borderRight - dimensions.paddingLeft - dimensions.paddingRight + 'px',
        });

        Object.assign(this.node.style, {
          top: box.top - dimensions.marginTop + 'px',
          left: box.left - dimensions.marginLeft + 'px',
        });

        this.doc.body.appendChild(this.container);
      }
    }

    activate() {
      this.createOverlayElements();
      // add styles
      if (!document.getElementById(this.cssNode)) {
        const styles = document.createElement('style');
        styles.innerText = this.styles;
        styles.id = this.cssNode;
        document.getElementsByTagName('head')[0].appendChild(styles);
      }
      // add listeners for all frames and root
      document.addEventListener('click', this.getData, true);
      this.options.inspector && ( document.addEventListener('mouseover', this.draw) );
      const frameLength = window.parent.frames.length
      for (let i = 0 ; i < frameLength; i++) {
        let frame = window.parent.frames[i];
        frame.document.addEventListener('click', e => this.getData(e, frame.frameElement), true);
        this.options.inspector && (frame.document.addEventListener('mouseover', this.draw) );
      }

    }

    deactivate() {
      // remove styles
      const cssNode = document.getElementById(this.cssNode);
      cssNode && cssNode.remove();
      // remove overlay
      this.removeOverlay();
      // remove xpath html
      const contentNode = document.getElementById(this.contentNode);
      contentNode && contentNode.remove();
      // remove listeners for all frames and root
      document.removeEventListener('click', this.getData, true);
      this.options && this.options.inspector && ( document.removeEventListener('mouseover', this.draw) );
      const frameLength = window.parent.frames.length
      for (let i = 0 ; i < frameLength; i++) {
        let frameDocument = window.parent.frames[i].document
        frameDocument.removeEventListener('click', this.getData, true);
        this.options && this.options.inspector && ( frameDocument.removeEventListener('mouseover', this.draw) );
      }
      
    }

    getXPath(el) {
      let nodeElem = el;
      if (nodeElem.id && this.options.shortid) {
        return `//*[@id="${nodeElem.id}"]`;
      }
      const parts = [];
      while (nodeElem && nodeElem.nodeType === Node.ELEMENT_NODE) {
        let nbOfPreviousSiblings = 0;
        let hasNextSiblings = false;
        let sibling = nodeElem.previousSibling;
        while (sibling) {
          if (sibling.nodeType !== Node.DOCUMENT_TYPE_NODE && sibling.nodeName === nodeElem.nodeName) {
            nbOfPreviousSiblings++;
          }
          sibling = sibling.previousSibling;
        }
        sibling = nodeElem.nextSibling;
        while (sibling) {
          if (sibling.nodeName === nodeElem.nodeName) {
            hasNextSiblings = true;
            break;
          }
          sibling = sibling.nextSibling;
        }
        const prefix = nodeElem.prefix ? nodeElem.prefix + ':' : '';
        const nth = nbOfPreviousSiblings || hasNextSiblings ? `[${nbOfPreviousSiblings + 1}]` : '';
        parts.push(prefix + nodeElem.localName + nth);
        nodeElem = nodeElem.parentNode;
      }
      return parts.length ? '/' + parts.reverse().join('/') : '';
    }

    getElementDimensions(domElement) {
      const calculatedStyle = window.getComputedStyle(domElement);
      return {
        borderLeft: +calculatedStyle.borderLeftWidth.match(/[0-9]*/)[0],
        borderRight: +calculatedStyle.borderRightWidth.match(/[0-9]*/)[0],
        borderTop: +calculatedStyle.borderTopWidth.match(/[0-9]*/)[0],
        borderBottom: +calculatedStyle.borderBottomWidth.match(/[0-9]*/)[0],
        marginLeft: +calculatedStyle.marginLeft.match(/[0-9]*/)[0],
        marginRight: +calculatedStyle.marginRight.match(/[0-9]*/)[0],
        marginTop: +calculatedStyle.marginTop.match(/[0-9]*/)[0],
        marginBottom: +calculatedStyle.marginBottom.match(/[0-9]*/)[0],
        paddingLeft: +calculatedStyle.paddingLeft.match(/[0-9]*/)[0],
        paddingRight: +calculatedStyle.paddingRight.match(/[0-9]*/)[0],
        paddingTop: +calculatedStyle.paddingTop.match(/[0-9]*/)[0],
        paddingBottom: +calculatedStyle.paddingBottom.match(/[0-9]*/)[0]
      };
    }

    getOwnerWindow(node) {
      if (!node.ownerDocument) { return null; }
      return node.ownerDocument.defaultView;
    }

    getOwnerIframe(node) {
      const nodeWindow = this.getOwnerWindow(node);
      if (nodeWindow) {
        return nodeWindow.frameElement;
      }
      return null;
    }

    getBoundingClientRectWithBorderOffset(node) {
      const dimensions = this.getElementDimensions(node);
      return this.mergeRectOffsets([
        node.getBoundingClientRect(),
        {
          top: dimensions.borderTop,
          left: dimensions.borderLeft,
          bottom: dimensions.borderBottom,
          right: dimensions.borderRight,
          width: 0,
          height: 0
        }
      ]);
    }

    mergeRectOffsets(rects) {
      return rects.reduce((previousRect, rect) => {
        if (previousRect === null) { return rect; }
        return {
          top: previousRect.top + rect.top,
          left: previousRect.left + rect.left,
          width: previousRect.width,
          height: previousRect.height,
          bottom: previousRect.bottom + rect.bottom,
          right: previousRect.right + rect.right
        };
      });
    }

    getNestedBoundingClientRect(node, boundaryWindow) {
      const ownerIframe = this.getOwnerIframe(node);
      if (ownerIframe && ownerIframe !== boundaryWindow) {
        const rects = [node.getBoundingClientRect()];
        let currentIframe = ownerIframe;
        let onlyOneMore = false;
        while (currentIframe) {
          const rect = this.getBoundingClientRectWithBorderOffset(currentIframe);
          rects.push(rect);
          currentIframe = this.getOwnerIframe(currentIframe);
          if (onlyOneMore) { break; }
          if (currentIframe && this.getOwnerWindow(currentIframe) === boundaryWindow) {
            onlyOneMore = true;
          }
        }
        return this.mergeRectOffsets(rects);
      }
      return node.getBoundingClientRect();
    }

    boxWrap(dimensions, parameter, node) {
      Object.assign(node.style, {
        borderTopWidth: dimensions[parameter + 'Top'] + 'px',
        borderLeftWidth: dimensions[parameter + 'Left'] + 'px',
        borderRightWidth: dimensions[parameter + 'Right'] + 'px',
        borderBottomWidth: dimensions[parameter + 'Bottom'] + 'px',
        borderStyle: 'solid'
      });
    }
  }



  

  const inspect = new Inspector();




  


  chrome.runtime.onMessage.addListener(request => {
    if (request.action === 'activate') {
      return inspect.getOptions();
    }
    // var str = JSON.stringify(dictdata)
    
  // var str = maptocsv(xMap)
  
  //   var slen = str.length
  //   if(slen >= 2) {
  //     var fname = window.location.hostname +'.csv'
  //     download(fname,str)
  //   }
    
    return inspect.deactivate();
    
  });

  return true;
})();
