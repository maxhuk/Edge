$(function () {
  'use strict';
  social();
  copyright();
  mobileMenu();
  feed();
  lightbox();
});

function social() {
  'use strict';
  var data = {
    facebook: {name: 'Facebook', icon: 'facebook', text: 'FB'},
    twitter: {name: 'Twitter', icon: 'twitter', text: 'TW'},
    instagram: {name: 'Instagram', icon: 'instagram', text: 'IG'},
    dribbble: {name: 'Dribbble', icon: 'dribbble', text: 'DR'},
    behance: {name: 'Behance', icon: 'behance', text: 'BE'},
    github: {name: 'GitHub', icon: 'github-circle', text: 'GH'},
    linkedin: {name: 'LinkedIn', icon: 'linkedin', text: 'LI'},
    vk: {name: 'VK', icon: 'vk', text: 'VK'},
  };
  var links = themeOptions.social_links;
  var output = '';

  for (var key in links) {
		if (links[key] != '') {
			output += '<a class="social-item social-item-' + data[key]['name'].toLowerCase() + '" href="' + links[key] + '" title="' + data[key]['name'] + '" target="_blank">' + data[key]['text'] + '</a>';
		}
  }
  
  $('.social').html(output);
}

function copyright() {
  'use strict';
  if (themeOptions.copyright != '') {
    $('.copyright').html(themeOptions.copyright);
  }
}

function mobileMenu() {
  'use strict';
  $('.burger').on('click', function() {
    $('body').toggleClass('menu-opened');
  });
}

function feed() {
  'use strict';
  var grid = $('.post-feed').masonry({
    columnWidth: '.grid-sizer',
    itemSelector: 'none',
    hiddenStyle: {transform: 'translateY(100px)', opacity: 0},
    visibleStyle: {transform: 'translateY(0)', opacity: 1},
  });
  var msnry = grid.data('masonry');

  grid.imagesLoaded(function () {
    grid.addClass('initialized');
    grid.masonry('option', {itemSelector: '.grid-item'});
    var items = grid.find('.grid-item');
    grid.masonry('appended', items);
  });

  if ($('.pagination .older-posts').length) {
    grid.infiniteScroll({
      append: '.grid-item',
      history: false,
      outlayer: msnry,
      path: '.pagination .older-posts',
      prefill: true,
      status: '.infinite-scroll-status',
    });
  }
}

function lightbox() {
  'use strict';
  // parse slide data (url, title, size ...) from DOM elements 
  var parseThumbnailElements = function (el) {
    var items = [],
      gridEl,
      linkEl,
      item;

    $(el).children().not('.grid-sizer').each(function (i, v) {
      gridEl = $(v);
      linkEl = gridEl.find('.post-lightbox');

      item = {
        src: linkEl.attr('href'),
        w: 0,
        h: 0,
      };

      if (gridEl.find('.post-caption').length) {
        item.title = gridEl.find('.post-caption').html();
      }

      items.push(item);
    });

    return items;
  };

  // triggers when user clicks on thumbnail
  var onThumbnailsClick = function(e) {
    e.preventDefault();

    var index = $(e.target).closest('.grid-item').index('.grid-item:not(.grid-sizer)');
    var clickedGallery = $(e.target).closest('.post-feed');

    openPhotoSwipe(index, clickedGallery[0]);

    return false;
  };

  var openPhotoSwipe = function(index, galleryElement) {
    var pswpElement = document.querySelectorAll('.pswp')[0],
        gallery,
        options,
        items;

    items = parseThumbnailElements(galleryElement);

    // define options (if needed)
    options = {
      closeOnScroll: false,
      history: false,
      index: index,
      shareEl: false,
      showAnimationDuration: 0,
			showHideOpacity: true,
    };

    // Pass data to PhotoSwipe and initialize it
    gallery = new PhotoSwipe(pswpElement, PhotoSwipeUI_Default, items, options);
    gallery.listen('gettingData', function (index, item) {
      if (item.w < 1 || item.h < 1) { // unknown size
        var img = new Image(); 
        img.onload = function() { // will get size after load
          item.w = this.width; // set image width
          item.h = this.height; // set image height
          gallery.invalidateCurrItems(); // reinit Items
          gallery.updateSize(true); // reinit Items
        }
        img.src = item.src; // let's download image
      }
    });
    gallery.init();
  };

  // bind events to lightbox buttons
  $('.post-feed').on('click', '.post-lightbox', function (e) {
    onThumbnailsClick(e);
  });
};