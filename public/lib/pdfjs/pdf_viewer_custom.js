'use strict';


PDFJS.disableTextLayer = false;

PDFJS.workerSrc = 'pdf.worker.js';

// Some PDFs need external cmaps.
//
// PDFJS.cMapUrl = '../../build/dist/cmaps/';
// PDFJS.cMapPacked = true;

var query = parseQueryString(location.search.slice(1));

var FILE_URL = query.file || '';
var WATERMARK = query.watermark || 'Investarget';

var SEARCH_FOR = '';

var container = document.getElementById('viewerContainer');

var pdfLinkService = new PDFJS.PDFLinkService();

var pdfViewer = new PDFJS.PDFViewer({
  container: container,
  linkService: pdfLinkService,
});
pdfLinkService.setViewer(pdfViewer);


pdfViewer.eventBus.on('documentload', function(e) {
  $('.loading-container').fadeOut();
});
pdfViewer.eventBus.on('pagesinit', function (e) {
  pdfViewer.currentScaleValue = 'page-width';
});
pdfViewer.eventBus.on('pagesloaded', function(e) {
  $('.loading-container').fadeOut();
});
pdfViewer.eventBus.on('loaderror', function(e) {
  $('.loading').hide();
  $('.loading-error-text').text(e.message);
  $('.loading-error').show();
});
pdfViewer.eventBus.on('pagerendered', function(e) {
  var ctx = e.source.canvas.getContext('2d');
  drawWatermark(ctx, WATERMARK);
});


PDFJS.getDocument(FILE_URL).then(function (pdfDocument) {
  pdfViewer.setDocument(pdfDocument);

  pdfLinkService.setDocument(pdfDocument, null);
}, function getDocumentError(exception) {

  var message = exception && exception.message;
  // var loadingErrorMessage = 'An error occurred while loading the PDF.';
  var loadingErrorMessage = '加载PDF时发生一个错误';
  if (exception instanceof PDFJS.InvalidPDFException) {
    // loadingErrorMessage = 'Invalid or corrupted PDF file.';
    loadingErrorMessage = '无效或损坏的PDF文件';
  } else if (exception instanceof PDFJS.MissingPDFException) {
    // loadingErrorMessage = 'Missing PDF file.';
    // loadingErrorMessage = 'PDF文件缺失';
    loadingErrorMessage = '文件正在转换中，请稍后访问';
    // 可能
  } else if (exception instanceof PDFJS.UnexpectedResponseException) {
    loadingErrorMessage = 'Unexpected server response.';
  }

  pdfViewer.eventBus.dispatch('loaderror', {message: loadingErrorMessage});
});


/*
 * 绘制水印
 */

function drawWatermark(ctx, text) {
  var canvas = ctx.canvas;

  var fontSize = Math.floor(canvas.width * 0.8 / wordCount(text)); // 总长度为宽度的 0.8
  fontSize = Math.floor(fontSize / 4) * 4; // 字体大小设为 4 的倍数
  if (fontSize > canvas.width / 8) {
    fontSize = canvas.width / 8;
  } else if (fontSize < canvas.width / 16) {
    fontSize = canvas.width / 16;
  }

  ctx.save();

  ctx.fillStyle = 'rgba(66, 66, 66, 0.15)';
  ctx.font = 'bold ' + fontSize + 'px Helvetica,Arial,STSong,SimSun';
  var w = ctx.measureText(text).width;
  var x = canvas.width / 2;
  var y = canvas.height / 2;

  ctx.translate(x, y);
  ctx.rotate(-Math.PI / 4);
  ctx.translate(-w/2, 0);
  ctx.fillText(text, 0, 0);

  ctx.translate(w/2, 0, 0);
  var timeStr = getTime();
  ctx.font = 'bold ' + fontSize / 2 + 'px Helvetica,Arial,STSong,SimSun';
  w = ctx.measureText(timeStr).width;
  ctx.translate(-w/2, fontSize);
  ctx.fillText(timeStr, 0, 0);

  ctx.restore();
}

function wordCount(text) {
  var count = 0;
  for(var i = 0,len = text.length; i < len; i++) {
    if (text.charCodeAt(i) < 127) {
      count += 0.5;
    } else {
      count += 1;
    }
  }
  return count;
}

function printWatermark(ctx, text) {
  var canvas = ctx.canvas;

  var fontSize = Math.floor(canvas.width / 20 / 2);
  fontSize = Math.floor(fontSize / 4) * 4; // 字体大小设为 4 的倍数
  fontSize = fontSize * 2 // 打印放大一倍

  ctx.save();
  ctx.fillStyle = 'rgba(66, 66, 66, 0.15)';
  ctx.font = 'bold ' + fontSize + 'px Helvetica,Arial,STSong,SimSun';
  var w = ctx.measureText(text).width;
  var x = canvas.width / 2 / 2;
  var y = canvas.height / 2 / 2;

  ctx.translate(x, y);
  ctx.rotate(-Math.PI / 4);
  ctx.translate(-w/2, 0);
  ctx.fillText(text, 0, 0);

  ctx.translate(w/2, 0, 0);
  var timeStr = getTime();
  ctx.font = 'bold ' + fontSize / 2 + 'px Helvetica,Arial,STSong,SimSun';
  w = ctx.measureText(timeStr).width;
  ctx.translate(-w/2, fontSize);
  ctx.fillText(timeStr, 0, 0);

  ctx.restore()
}

/*
 * 工具栏
 */

var DEFAULT_SCALE_DELTA = 1.1;
var MIN_SCALE = 0.25;
var MAX_SCALE = 10.0;

function zoomIn(ticks) {
  var newScale = pdfViewer.currentScale;
  do {
    newScale = (newScale * DEFAULT_SCALE_DELTA).toFixed(2);
    newScale = Math.ceil(newScale * 10) / 10;
    newScale = Math.min(MAX_SCALE, newScale);
  } while (--ticks > 0 && newScale < MAX_SCALE);
  pdfViewer.currentScaleValue = newScale;
}

function zoomOut(ticks) {
  var newScale = pdfViewer.currentScale;
  do {
    newScale = (newScale / DEFAULT_SCALE_DELTA).toFixed(2);
    newScale = Math.floor(newScale * 10) / 10;
    newScale = Math.max(MIN_SCALE, newScale);
  } while (--ticks > 0 && newScale > MIN_SCALE);
  pdfViewer.currentScaleValue = newScale;
}

function setScale(value) {
  pdfViewer.currentScaleValue = value;
}

function pageUp() {
  if (pdfViewer.currentPageNumber > 1) {
    pdfViewer.currentPageNumber -= 1;
  }
}

function pageDown() {
  if (pdfViewer.currentPageNumber < pdfViewer.pagesCount) {
    pdfViewer.currentPageNumber += 1;
  }
}

var toolbarComponent = new Vue({
  el: '#toobar_container',
  data: {
    pageNumber: 0,
    pagesCount: 0,
    scale: '',
    scaleText: '',
    allowAction: false,
    allowPrint: true,
    collapsed: true,
    scaleOptions: [
      { name: '50%',value: 0.5 },
      { name: '100%',value: 1 },
      { name: '125%',value: 1.25 },
      { name: '150%',value: 1.5 },
      { name: '200%',value: 2 },
      { name: '300%',value: 3 },
      { name: '400%',value: 4 },
      { name: '实际大小', value: 'page-actual' },
      { name: '适合页面', value: 'page-fit' },
      { name: '适合宽度', value: 'page-width' },
    ],
  },
  watch: {
    scale: function(val, oldVal) {
      this.scaleText = Math.round(val * 100) + '%';
    },
  },
  computed: {
    isFirstPage: function() {
      return this.pageNumber == 1;
    },
    isLastPage: function() {
      return this.pageNumber == this.pagesCount;
    },
    isMinScale: function() {
      return this.scale == MIN_SCALE;
    },
    isMaxScale: function() {
      return this.scale == MAX_SCALE;
    },
  },
  methods: {
    getScale: function() {
      this.scaleText = Math.round(this.scale * 100) + '%';
    },
    inputScale: function() {
      var scaleText = this.scaleText;
      var len = this.scaleText.length;
      var lastChar = this.scaleText[len - 1];
      if (lastChar == '%') {
        scaleText = scaleText.slice(0, len-1);
      }
      var scale = parseFloat(scaleText) / 100;
      if (scale > 0) {
        this.selectScale(scale);
        this.$inputEl.blur();
      } else {
        this.getScale(scale);
        this.$inputEl.blur();
      }
    },
    selectScale: function(value) {
      setScale(value);
      this.collapsed = true;
    },
    zoomIn: function() {
      if (this.allowAction && !this.isMaxScale) {
        zoomIn(1);
      }
    },
    zoomOut: function() {
      if (this.allowAction && !this.isMinScale) {
        zoomOut(1);
      }
    },
    next: function() {
      if (this.allowAction && !this.isLastPage) {
        pageDown();
      }
    },
    prev: function() {
      if (this.allowAction && !this.isFirstPage) {
        pageUp();
      }
    },
    print: function() {
      if (this.allowAction && this.allowPrint) {
        window.print();
      }
    },
  },
  mounted: function() {
    var self = this;
    pdfViewer.eventBus.on('pagesloaded', function(e) {
      self.pagesCount = e.pagesCount;
      self.pageNumber = 1;
      self.allowAction = true;
    });
    pdfViewer.eventBus.on('pagechange', function(e) {
      self.pageNumber = e.pageNumber;
    });
    pdfViewer.eventBus.on('scalechange', function(e) {
      self.scale = e.scale;
    });

    this.$inputEl = $('.scale-input');
  },
});



/*
 * 事件处理
 */

window.addEventListener('resize', handleWindowResize);

function handleWindowResize(evt) {
  pdfViewer.currentScaleValue = 'page-width';
}

window.addEventListener('wheel', handleMouseWheel);

function handleMouseWheel(evt) {
  if (evt.ctrlKey || evt.metaKey) {
    // Only zoom the pages, not the entire viewer.
    evt.preventDefault();

    var previousScale = pdfViewer.currentScale;

    var delta = normalizeWheelEventDelta(evt);

    var MOUSE_WHEEL_DELTA_PER_PAGE_SCALE = 3.0;
    var ticks = delta * MOUSE_WHEEL_DELTA_PER_PAGE_SCALE;
    if (ticks < 0) {
      zoomOut(-ticks);
    } else {
      zoomIn(ticks);
    }

    var currentScale = pdfViewer.currentScale;
    if (previousScale !== currentScale) {
      // After scaling the page via zoomIn/zoomOut, the position of the upper-
      // left corner is restored. When the mouse wheel is used, the position
      // under the cursor should be restored instead.
      var scaleCorrectionFactor = currentScale / previousScale - 1;
      var rect = pdfViewer.container.getBoundingClientRect();
      var dx = evt.clientX - rect.left;
      var dy = evt.clientY - rect.top;
      pdfViewer.container.scrollLeft += dx * scaleCorrectionFactor;
      pdfViewer.container.scrollTop += dy * scaleCorrectionFactor;
    }
  }
}

function normalizeWheelEventDelta(evt) {
  var delta = Math.sqrt(evt.deltaX * evt.deltaX + evt.deltaY * evt.deltaY);
  var angle = Math.atan2(evt.deltaY, evt.deltaX);
  if (-0.25 * Math.PI < angle && angle < 0.75 * Math.PI) {
    // All that is left-up oriented has to change the sign.
    delta = -delta;
  }

  var MOUSE_DOM_DELTA_PIXEL_MODE = 0;
  var MOUSE_DOM_DELTA_LINE_MODE = 1;
  var MOUSE_PIXELS_PER_LINE = 30;
  var MOUSE_LINES_PER_PAGE = 30;

  // Converts delta to per-page units
  if (evt.deltaMode === MOUSE_DOM_DELTA_PIXEL_MODE) {
    delta /= MOUSE_PIXELS_PER_LINE * MOUSE_LINES_PER_PAGE;
  } else if (evt.deltaMode === MOUSE_DOM_DELTA_LINE_MODE) {
    delta /= MOUSE_LINES_PER_PAGE;
  }
  return delta;
}


/*
 * 处理打印
 * 按照第一页的尺寸进行打印
 * 页面尺寸不一样的情况，后面再细化处理
 */

var printContainer = document.getElementById('printContainer');
var pageStyleSheet;
var printing = false;

window.addEventListener('beforeprint', function beforePrint(evt) {
  pdfViewer.eventBus.dispatch('beforeprint');
});

window.addEventListener('afterprint', function afterPrint(evt) {
  pdfViewer.eventBus.dispatch('afterprint');
});


pdfViewer.eventBus.on('beforeprint', setupBeforePrint);

function setupBeforePrint() {
  printing = true;
  pdfViewer.renderingQueue.printing = printing;
  pdfViewer.renderingQueue.renderHighestPriority();

  var body = document.querySelector('body');
  body.setAttribute('data-mozPrintCallback', true);

  // Insert a @page + size rule to make sure that the page size is correctly
  // set. Note that we assume that all pages have the same size, because
  // variable-size pages are not supported yet (at least in Chrome & Firefox).
  // TODO(robwu): Use named pages when size calculation bugs get resolved
  // (e.g. https://crbug.com/355116) AND when support for named pages is
  // added (http://www.w3.org/TR/css3-page/#using-named-pages).
  // In browsers where @page + size is not supported (such as Firefox,
  // https://bugzil.la/851441), the next stylesheet will be ignored and the
  // user has to select the correct paper size in the UI if wanted.
  var pageSize = pdfViewer.getPageView(0).pdfPage.getViewport(1);
  pageStyleSheet = document.createElement('style');
  pageStyleSheet.textContent =
    // "size:<width> <height>" is what we need. But also add "A4" because
    // Firefox incorrectly reports support for the other value.
    '@supports ((size:A4) and (size:1pt 1pt)) {' +
    '@page { size: ' + pageSize.width + 'pt ' + pageSize.height + 'pt;}' +
    '}';
  document.body.appendChild(pageStyleSheet);

  var i, ii;
  for (i = 0, ii = pdfViewer.pagesCount; i < ii; ++i) {
    var page = pdfViewer.getPageView(i).pdfPage;
    beforePrint(printContainer, page);
  }
}


pdfViewer.eventBus.on('afterprint', setupAfterPrint);

function setupAfterPrint() {
  while (printContainer.hasChildNodes()) {
    printContainer.removeChild(printContainer.lastChild);
  }

  if (pageStyleSheet && pageStyleSheet.parentNode) {
    pageStyleSheet.parentNode.removeChild(pageStyleSheet);
    pageStyleSheet = null;
  }

  printing = false;
}


function beforePrint(printContainer, pdfPage) {
  var CustomStyle = PDFJS.CustomStyle;
  var viewport = pdfPage.getViewport(1);
  // Use the same hack we use for high dpi displays for printing to get
  // better output until bug 811002 is fixed in FF.
  var PRINT_OUTPUT_SCALE = 2;
  var canvas = document.createElement('canvas');

  // The logical size of the canvas.
  canvas.width = Math.floor(viewport.width) * PRINT_OUTPUT_SCALE;
  canvas.height = Math.floor(viewport.height) * PRINT_OUTPUT_SCALE;

  // The rendered size of the canvas, relative to the size of canvasWrapper.
  canvas.style.width = (PRINT_OUTPUT_SCALE * 100) + '%';

  var cssScale = 'scale(' + (1 / PRINT_OUTPUT_SCALE) + ', ' +
                            (1 / PRINT_OUTPUT_SCALE) + ')';
  CustomStyle.setProp('transform' , canvas, cssScale);
  CustomStyle.setProp('transformOrigin' , canvas, '0% 0%');

  var canvasWrapper = document.createElement('div');
  canvasWrapper.appendChild(canvas);
  printContainer.appendChild(canvasWrapper);

  canvas.mozPrintCallback = function(obj) {
    var ctx = obj.context;

    ctx.save();
    ctx.fillStyle = 'rgb(255, 255, 255)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.restore();
    // Used by the mozCurrentTransform polyfill in src/display/canvas.js.
    ctx._transformMatrix =
      [PRINT_OUTPUT_SCALE, 0, 0, PRINT_OUTPUT_SCALE, 0, 0];
    ctx.scale(PRINT_OUTPUT_SCALE, PRINT_OUTPUT_SCALE);

    var renderContext = {
      canvasContext: ctx,
      viewport: viewport,
      intent: 'print'
    };

    pdfPage.render(renderContext).promise.then(function() {
      // Tell the printEngine that rendering this canvas/page has finished.
      printWatermark(ctx, WATERMARK); // 打水印
      obj.done();
    }, function(error) {
      // Tell the printEngine that rendering this canvas/page has failed.
      // This will make the print process stop.
      if ('abort' in obj) {
        obj.abort();
      } else {
        obj.done();
      }
    });
  };
}


(function (root, factory) {
  {
    factory((root.pdfjsWebMozPrintCallbackPolyfill = {}));
  }
}(this, function (exports) {
  if ('mozPrintCallback' in document.createElement('canvas')) {
    return;
  }

  // Cause positive result on feature-detection:
  HTMLCanvasElement.prototype.mozPrintCallback = undefined;

  var canvases;   // During print task: non-live NodeList of <canvas> elements
  var index;      // Index of <canvas> element that is being processed

  var print = window.print;
  window.print = function print() {
    if (canvases) {
      console.warn('Ignored window.print() because of a pending print job.');
      return;
    }
    try {
      dispatchEvent('beforeprint');
    } finally {
      canvases = document.querySelectorAll('canvas');
      index = -1;
      next();
    }
  };

  function dispatchEvent(eventType) {
    var event = document.createEvent('CustomEvent');
    event.initCustomEvent(eventType, false, false, 'custom');
    window.dispatchEvent(event);
  }

  function next() {
    if (!canvases) {
      return; // Print task cancelled by user (state reset in abort())
    }

    if (++index < canvases.length) {
      var canvas = canvases[index];
      if (typeof canvas.mozPrintCallback === 'function') {
        canvas.mozPrintCallback({
          context: canvas.getContext('2d'),
          abort: abort,
          done: next
        });
      } else {
        next();
      }
    } else {
      // Push window.print in the macrotask queue to avoid being affected by
      // the deprecation of running print() code in a microtask, see
      // https://github.com/mozilla/pdf.js/issues/7547.
      setTimeout(function() {
        if (!canvases) {
          return; // Print task cancelled by user.
        }
        print.call(window);
        setTimeout(abort, 20); // Tidy-up
      }, 0);
    }
  }

  function abort() {
    if (canvases) {
      canvases = null;
      dispatchEvent('afterprint');
    }
  }

}));


/*
 * utils
 */

function parseQueryString(query) {
  var parts = query.split('&');
  var params = {};
  for (var i = 0, ii = parts.length; i < ii; ++i) {
    var param = parts[i].split('=');
    var key = param[0].toLowerCase();
    var value = param.length > 1 ? param[1] : null;
    params[decodeURIComponent(key)] = decodeURIComponent(value);
  }
  return params;
}

function getTime() {
  var t = new Date();
  var y = t.getFullYear();
  var m = t.getMonth() + 1;
  var d = t.getDate();
  var H = t.getHours();
  var M = t.getMinutes();
  var s = t.getSeconds();
  return y + '-' + fillZero(m) + '-' + fillZero(d) + ' ' + fillZero(H) + ':' + fillZero(M) + ':' + fillZero(s);
}

function fillZero(num) {
  return (num < 10) ? '0' + num : '' + num;
}


