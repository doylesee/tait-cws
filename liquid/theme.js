//config code
var company_name = "TAIT";
// .header-outer height
var top_offset_height = 0;

// Set height
function setHeight(the_selector) {
  var a_height = 0;
  $(the_selector).css('height','auto');
  $(the_selector).each(function() {    
    if ($(this).outerHeight() > a_height) {
      a_height = $(this).outerHeight();
    }
  });
  $(the_selector).attr('style','height: '+a_height+'px;');
}

function showhidesubitems() {
    // escape header subnav
    if ( $('.header__menu').hasClass('child-item-active') ) {
        $('.header__menu').removeClass('child-item-active');
        $('.parent-item').attr('aria-expanded','false').next('.child-item').attr('aria-hidden','true');
        $('.parent-item').removeClass('active').next('.child-item').removeClass('active').parent('li').removeClass('active');
    }
}

// Facet code
window.facet_history = true;
// Function for expanding/collapsing Facet options
function facet_expand_collapse(facet_item_this){
    facet_item_this.parent().next('.facet-item__options').slideToggle(200);
    facet_item_this.parents('.facet-item').toggleClass('facet-item--expanded facet-item--collapsed');

    if (facet_item_this.parents('.facet-item').hasClass('facet-item--expanded')) {
        facet_item_this.attr('aria-expanded','true')
    }
    else {
        facet_item_this.attr('aria-expanded','false')
    }
}
// Function for Ajax-ing Job Search Results
function ds_tm_get_jobs_ajax(url){
    window.facet_loading = true;
    
    var t = $(".jobs-section").offset().top - (top_offset_height+$('.jobs-category-section').outerHeight());
    t = t > 0 ? t : 1;
 
    $('.preloader--search').show().find('.facet-jobs-loading').fadeIn().attr('tabindex','0').focus();
    $('.jobs-section__inner').hide().find('.facet-jobs-loaded').fadeOut();
    
    if(window.facet_history==true && window.history!=null && window.history.pushState!=null){
        window.history.pushState({},"",url);
    }
    
    $.get(url, function(data) {
        $(".jobs-category-section").html( $(data).find('.jobs-category-section').html() );
        $(".jobs-category-banner").html( $(data).find('.jobs-category-banner').html() );
        $(".jobs-heading").html( $(data).find('.jobs-heading').html() );
        $(".facet-section").html( $(data).find('.facet-section').html() );
        $(".jobs-section").html( $(data).find('.jobs-section').html() );
 
        var tagtitle = $(data).filter('title').text();
        document.title = (tagtitle!="") ? tagtitle : company_name+" Careers";
            
        $(".jobs-section__list").hide();
        $(".jobs-section__list").fadeIn(500);
 
        $('.facet-section').removeClass("ds_tm_ff_wait");
        window.facet_loading = false;

        $('.preloader--search').hide();
        $('.jobs-section__inner').show();

        $('html, body').animate({scrollTop: t}, 400, 'swing');

        $('.facet-jobs-loading').fadeOut();
        $('.facet-jobs-loaded').fadeIn().attr('tabindex','0').focus();
    });
}
function ds_tm_facet_click(e){
    e.preventDefault();
    var l = $(e.target).closest(".facet-item__option-link");
   
    if(window.facet_loading==true) {
        $('.facet-section').addClass("ds_tm_ff_wait");
    }
    else {
        l.addClass("ds_tm_ff_loading");
        $('.facet-section').addClass("ds_tm_ff_wait");
  
        var url = l.attr("href");
        ds_tm_get_jobs_ajax(url);
    }
} 
// Function to showing more Facet options over the facet_num_limit
function ds_tm_facet_more_click(e){
    var l = $(e.target).closest(".facet-item__show-more");
    var facetname = l.attr("ref");
    $("#facet-item__row--"+facetname).slideToggle();
    l.parent().addClass('hide');
}

function load_facet_jobs(facet_url,facet_div) {
    window.facet_history = false;
    facet_url = facet_url ? facet_url : "";
    
    window.facet_loading = true;
    
    if(window.facet_history==true && window.history!=null && window.history.pushState!=null){
        window.history.pushState({},"",facet_url);
    }
    
    $.get(facet_url, function(data) {
        $(facet_div).html( $(data).find('.jobs-section').html() );
        window.facet_loading = false;
    });
}

// Function to load Similar Jobs within Job Details pages
function ajaxloadjobs(jobsurl,callback) {
    $.get(jobsurl, function(data) {
        $('.similar-jobs--job-js').html( $(data).find('.similar-jobs--jobs-search-js').html() );
        var similar_jobs_content = $(data).find('.similar-jobs--jobs-search-js').html();
        // check if similar_jobs_content is not empty
        if ($.trim(similar_jobs_content)) {
            $('.similar-jobs-element-js').each(function() {
                var similar_jobs_element_classes = $(this).attr('class');
                var similar_jobs_element_classes_new = similar_jobs_element_classes.replace(/--has-similar-jobs-js/g,'').replace(/hide/g,'');
                $(this).attr('class',similar_jobs_element_classes_new);
            });
        }
        else {
            $('.similar-jobs-element-js').each(function() {
                var similar_jobs_element_classes = $(this).attr('class');
                var similar_jobs_element_classes_new = similar_jobs_element_classes.replace(/--no-similar-jobs-js/g,'');
                $(this).attr('class',similar_jobs_element_classes_new);
            });
        }
        callback();
    });
}
function loadjob() {
    $('.job-details-preloader-js').addClass('hide');
    $('.job-details-inner-js').addClass('active');
}

$(document).ready(function() {
    top_offset_height = $('.header-outer').outerHeight() + 20;

    // Preloaders
    $('.preloader-wrapper').attr('style','top: '+$(window).scrollTop()+'px;');

    // Language select
    $(document).on('change','.header__top-language-select-js', function(e) {
        window.location.href = $(this).val();
    });

    // Setting the Saved Jobs link
    var current_locale = $('.locale-detector-js').text();
    var c_jobs_var = 'c_jobs_'+current_locale;
    var c_jobs_temp = localStorage.getItem(c_jobs_var) ? JSON.parse(localStorage.getItem(c_jobs_var)) : [];
    var pages_saved_jobs_locale = '/'+current_locale+'/pages/saved-jobs';
    var saved_jobs_query;
    if (c_jobs_temp.length != 0) {
        saved_jobs_query = '/'+current_locale+'/search/jobs?external_id[]='+c_jobs_temp.join('&external_id[]=')+'&saved_jobs=1';
        $('.saved_jobs_link').prop('href',saved_jobs_query);

        if ( (window.location.pathname == '/pages/saved-jobs') || (window.location.pathname == pages_saved_jobs_locale) ) {
            window.location.replace(saved_jobs_query);
        }
    }

    $(window).resize(function(){
        // Content pages: set minimum height + set scrolling
        if ($(window).height() == $(document).height()) {
            $('body').addClass('no-scroll');
        }
        else {
            $('body').removeClass('no-scroll');
        }
        var constant_containers_height = $('.top-wrapper').outerHeight() + $('footer').outerHeight();
        var template_content_min_height = $(window).height() - constant_containers_height;
        $('.template-content').attr('style','min-height: '+template_content_min_height+'px;');
        var total_content_height = constant_containers_height+template_content_min_height;

        // Same height containers
        var same_height_counter = 0;
        var same_height_class_new = '';
        if ( $('.same-height-parent-js').length > 0 ) {
            $('.same-height-parent-js').each( function() {
                same_height_counter++;
                if ( $(this).find('.same-height-item-js').length > 0 ) {
                    $(this).find('.same-height-item-js').each( function() {
                        same_height_class_new = 'same-height-item--'+same_height_counter;
                        $(this).addClass(same_height_class_new);
                    });
                    setHeight('.'+same_height_class_new);
                }
            });
        }

        // Remove menu active classes
        if ($('.width-detector').width() >= 1024) {
            $('body').removeClass('menu-is-active');
            $('.header__menu').removeClass('active');
        }

        // Facet code
        // Show/hide facets
        if ($('.width-detector').width() >= 640) {
            $('body').addClass('scroll');
        }
        else if ($('.facet-section').hasClass('active')) {
            $('body').removeClass('scroll');    
        }
        else {
            $('body').addClass('scroll');   
        }
    });

    $(window).scroll(function() {
        // Header section sticky
        if ($(window).scrollTop() > $('.header-anchor.js').offset().top) {
            $('.header-outer, .template-content').addClass('fixed');
        } else {
            $('.header-outer, .template-content').removeClass('fixed');
        }
    }).scroll();

    // Mobile menu
    $('.header__menu-mobile-button').click(function() {
        if ( $('.header__menu.active').length > 0 ) {
            $('body').removeClass('menu-is-active');
            $('.header__menu-mobile-button a').attr('aria-expanded','false');
            $('.header__menu').attr('aria-hidden','true');
        }
        else {
            $('body').addClass('menu-is-active');
            $('.header__menu-mobile-button a').attr('aria-expanded','true');
            $('.header__menu').attr('aria-hidden','false');
        }
        $('.header__menu').toggleClass('active');
    });
    // START Web-accessible dropdown menu
    $('.parent-item').click(function(event) {
        if ($(this).hasClass('active')) {
            // remove aria and active classes to existing item
            $('.header__menu').removeClass('child-item-active');
            $(this).attr('aria-expanded','false').next('.child-item').attr('aria-hidden','true');
            $(this).removeClass('active').next('.child-item').removeClass('active').parent('li').removeClass('active');
        }
        else {
            // remove aria and active classes to existing items
            $('.parent-item').attr('aria-expanded','false').next('.child-item').attr('aria-hidden','true');
            $('.parent-item').removeClass('active').next('.child-item').removeClass('active').parent('li').removeClass('active');

            // add aria and active classes to clicked item
            $('.header__menu').addClass('child-item-active');
            $(this).attr('aria-expanded','true').next('.child-item').attr('aria-hidden','false');
            $(this).addClass('active').next('.child-item').addClass('active').parent('li').addClass('active');
        }
    });
    $('.child-item__back-link').click(function() {
        $('.header__menu').removeClass('child-item-active');
        $(this).parents('.child-item').attr('aria-hidden','true').removeClass('active').prev('.parent-item').attr('aria-expanded','false').removeClass('active');
    });
    // Set aria-hidden for header__menu and header_menu so screen reader can read/detect menu items
    if ($('.width-detector').width() >= 1024) {
        $('body').removeClass('menu-is-active');
        $('.header__menu').attr('aria-hidden','false').removeClass('active');
    }
    else {
        $('.header__menu').attr('aria-hidden','true');
        $('.header__menu').removeClass('child-item-active');
        $('.parent-item').attr('aria-expanded','false').removeClass('active');
        $('.child-item').attr('aria-hidden','true').removeClass('active').parent('li').removeClass('active');
    }
    // ESC key - to escape header subnav
    document.addEventListener('keydown', function(event){
        if ( (event.key === "Escape") || (event.keyCode === 27) ){
            showhidesubitems();
        }
    });
    const v_menu = $('.header__menu');
    $(document).mouseup(function (e) {
        if ( (!v_menu.is(e.target) && v_menu.has(e.target).length === 0) ) {
            showhidesubitems();
        }
    });
    // END Web-accessible dropdown menu

    // Talent Network links
    $('.talent-network-link').click(function() {
        $('#talent-network-main')[0].click();
    });

    // Candidate Notifications
    $(document).on("click", ".candidate-notification-link", function(e){
        launchCandidateJobNotification();
    });

    // Job Search Results page
    // Facet code
    // Show/hide facets
    $(document).on('click', '.facet-filter-results-button', function() {
        $('.facet-section').toggleClass('active');
        $('body').toggleClass('scroll');
    });
    // Expanding/collapsing Facet options
    $(document).on("click", ".facet-item__heading button", function(){ facet_expand_collapse($(this)); });
    // Ajax-ing Job Search Results
    $(document).on("click", ".facet-item__option-link", function(e){ ds_tm_facet_click(e); });
    // Showing more Facet options over the facet_num_limit
    $(document).on("click", ".facet-item__show-more", function(e){ ds_tm_facet_more_click(e); });

    // Job Details page
    // Back to Search Results button
    if ($('#back-to-search').length > 0) {
        if ( document.referrer.indexOf('/search') > -1 && document.referrer.indexOf('/jobs') > -1 && document.referrer != '' ) {
            $('#back-to-search').attr('href',document.referrer);
        }
    }
    // Bottom Apply button
    $('.apply-bottom.js').click(function() {
        $('#apply-top.js a')[0].click();
    });
    // Bottom Refer button
    $('.refer-bottom.js').click(function() {
        $('#refer-top.js a')[0].click();
    });
    // Share texts
    $('.cs_share_twitter_btn').append('<span class="show-for-sr">share to twitter</span>');
    $('.cs_facebook_btn').append('<span class="show-for-sr">share to facebook</span>');
    $('.cs_share_linkedin_btn').append('<span class="show-for-sr">share to linkedin</span>');
    // Social Referral
    {% include '_config__reusable-texts' %}
    $('a.social-share-url__copy-js').click(function() {
        var copiedtext = $(this).prev('input')[0];
        var text_copy = $(this).text();
        var text_copied = $(this).next('.social-share-url__copied-js').text();

        /* Select the text field */
        copiedtext.select();
        copiedtext.setSelectionRange(0, 99999); /* For mobile devices */

        /* Copy the text inside the text field */
        document.execCommand('copy');

        $(this).text(text_copied);
        setTimeout(function(){ $(this).text(text_copy); }, 3000);
    });
});

$(window).on('load', function() {
    $(window).resize();
});