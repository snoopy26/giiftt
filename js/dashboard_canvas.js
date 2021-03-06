$(function() {
	$('.canvas_wrapper').delegate('.filter_effect li', 'click', function(){
		var el = $(this);
		var c = el.closest('.block');
		var img = c.find('img:first');
		var p = img.parent();
		var t = el.find('span').text();
		var src = img.attr('src');
		el.siblings().removeClass('active');
		el.addClass('active');
		img.attr('data-filter', t);
		img.filterMe();
		return false;
	});
	$('#selectTemplate').find('li').on('click', function(){
		var el = $(this);
		el.siblings().removeClass('tmpl_active');
		el.addClass('tmpl_active');
		var tmpl = el.attr('data-template');
		var tmpl_temp = $('#canvas_temp_' + tmpl).html();
		$('.canvas_wrapper').empty();
		$('.canvas_wrapper').html(tmpl_temp);
		$('#templateid').val(tmpl);
		return false;
	});
	var templateid = $('#templateid').val();
	var fdiData = parseInt($('#fdiData').val());
	if (fdiData == 0){
		$('#selectTemplate').find('li#template' + templateid).click();
	}else{
		$('.canvas').find('img.canvas_image').each(function(k,v){
			var filter = $(this).attr('data-filter');
			$(this).next().find('li').each(function(){
				if ($(this).find('span').text() == filter){
					$(this).closest('li').addClass('active');
				}
			});
			//$(this).show();
			$(this).filterMe();
			$(this).jWindowCrop({
				targetWidth: $(this).parent().width(),
				targetHeight: $(this).parent().height(),
				loadingText: 'Loading ...',
				cssControl : false,
				onChange: function(result) {
					//console.log(result);
					$(this).attr('data-crop_x', result.cropX);
					$(this).attr('data-crop_y', result.cropY);
					$(this).attr('data-crop_w', result.cropW);
					$(this).attr('data-crop_h', result.cropH);
				}
			});
		});
	}
	$('#selectSize').find('li').on('click', function(){
		var el = $(this);
		el.siblings().removeClass('tmpl_active');
		el.addClass('tmpl_active');
		var prize = el.attr('data-productprize');
		$('#priceDisplay').html(prize);
		var productdetailid = el.attr('data-productdetailid');
		$('#product_detail_id').val(productdetailid);
		return false;
	});
	$('#albumTab a').click(function (e) {
  		e.preventDefault();
  		$(this).tab('show');
  		var el = $(this);
  		var rel = el.attr('rel');

  		$('#facebookTab').find('#breadcrumbFacebook').hide();
  		$('#facebookTab').find('#breadcrumbFacebook').find('.othersLi').remove();

  		if (el.data('working')) return false;
  		el.data('working', true);
  		$('#facebookTab').find('.galleryPhoto').empty();
  		$('.loader_container').fadeIn();
  		$.post('/ajax/getPhotoAlbum', {
  			type : rel,
  			Preview : 1
  		}, function(data){
  			if (data.album){
  				if (rel == "facebookAlbum"){
  					$('#facebookTab').find('.galleryPhoto').html(data.album);
  				}
  			}
  			$('.loader_container').fadeOut();
  			el.data('working', false);
  		}, 'json');
	});
	var blockImage = '';
	$('.canvas_wrapper').delegate('.btn-change-image', 'click', function(){
		var el = $(this);
		blockImage = el.closest('.block');
		$('#albumTab').find('li:first-child a').click();
		//return false;
	});
	$('.canvas_wrapper').delegate('.jwc_change_image', 'click', function(){
		var el = $(this);
		blockImage = el.closest('.block');
		$('#albumTab').find('li:first-child a').click();
		$('#myModal').modal('show');
	});
	$('#facebookTab').find('.galleryPhoto').delegate('li#album_block', 'click', function(e){
		e.preventDefault();
		var el = $(this);
		var albumName = el.find('span').text();
		var albumid = el.attr('data-albumid');
		if (el.data('working')) return false;
  		el.data('working', true);
  		$('#facebookTab').find('.galleryPhoto').empty();
  		$('.loader_container').fadeIn();

  		$('#facebookTab').find('#breadcrumbFacebook').show();
  		$('#facebookTab').find('#breadcrumbFacebook').append('<li class="othersLi">'+albumName+'</li>');
  		$('#myModal').find('.modal-footer').hide();

  		$.post('/ajax/getPhotoAlbum', {
  			type : "facebookAlbumPhoto",
  			id : albumid,
  			Preview : 1
  		}, function(data){
  			if (data.album){
  				$('#facebookTab').find('.galleryPhoto').html(data.album);
  				$('#myModal').find('.modal-footer').show();
  			}
  			$('.loader_container').fadeOut();
  			el.data('working', false);
  		}, 'json');
		return false;
	});
	$('#breadcrumbFacebook').delegate('.breadcrumbBack a', 'click', function(){
		var el = $(this);
		$('#facebookTabButton').click();
		$('#myModal').find('.modal-footer').hide();
		return false;
	});
	$('#myModal').find('.modal-footer').delegate('#selectImage', 'click', function(){
		var el = $(this);
		var albumTab = $('#albumTab').find('li.active');
		var rel = albumTab.attr('rel');
		var img = $('#' + rel).find('img.imgready_click');
		var albumId = img.attr('data-albumid');
		var albumHq = img.attr('data-hq-img');
		var albumOri = img.attr('data-ori-img');
		$('#myModal').modal('hide');
		$('#myModal').find('.modal-footer').hide();
		$('.loader_overlay').show();
		if (blockImage){

			$.post('/ajax/saveImageURL', {
				albumId : albumId,
				albumHq : albumHq,
				albumOri : albumOri
			}, function(data){
				blockImage.empty();

				var t = '<img src="'+data.albumHq+'" alt="Image" style="" ' +
				'data-original-src="'+data.albumHq+'" '+
				'data-fileName="'+data.fileName+'"' +
				'data-crop_x=""' +
				'data-crop_y=""' +
				'data-crop_w=""' +
				'data-crop_h=""' +
				'data-filter="Original"' +
				'class="canvas_image" '+
				'data-fotodata=""' +
				'/>'+
				'<div class="filter_effect xsmall_block">' +
				'	<ul>' +
				'		<li class="active"><img src="/images/filtereffects/original.jpg" class="img-polaroid" > <span>Original</span></li>' +
				'		<li class=""><img src="/images/filtereffects/1997.jpg" class="img-polaroid" > <span>1977</span></li>' +
				'		<li class=""><img src="/images/filtereffects/brannan.jpg" class="img-polaroid" > <span>Brannan</span></li>' +
				'		<li class=""><img src="/images/filtereffects/gotham.jpg" class="img-polaroid" > <span>Gotham</span></li>' +
				'		<li class=""><img src="/images/filtereffects/have.jpg" class="img-polaroid" > <span>Hefe</span></li>' +
				'		<li class=""><img src="/images/filtereffects/inkwell.jpg" class="img-polaroid" > <span>Inkwell</span></li>' +
				'		<li class=""><img src="/images/filtereffects/lordkelvin.jpg" class="img-polaroid"> <span>Lord Kelvin</span></li>' +
				'		<li class=""><img src="/images/filtereffects/nashville.jpg" class="img-polaroid" > <span>Nashville</span></li>' +
				'		<li class=""><img src="/images/filtereffects/xproii.jpg" class="img-polaroid" > <span>X-PRO II</span></li>' +
				'	</ul>' +
				'</div> ' ;

				blockImage.html(t);

				blockImage.find('img.canvas_image').each(function(){
					//$(this).filterMe();
					$(this).jWindowCrop({
						targetWidth: $(this).parent().width(),
						targetHeight: $(this).parent().height(),
						loadingText: 'Loading ...',
						cssControl : true,
						onChange: function(result) {
							//console.log(result);
							$(this).attr('data-crop_x', result.cropX);
							$(this).attr('data-crop_y', result.cropY);
							$(this).attr('data-crop_w', result.cropW);
							$(this).attr('data-crop_h', result.cropH);
						}
					});
				});

				$('.loader_overlay').hide();
			}, 'json');

		}
	});
	$('#tabContent').delegate('#imgready', 'click', function(){
		var el = $(this);
		el.parent().siblings().find('img').removeClass('imgready_click');
		el.addClass('imgready_click');
		return false;
	});
	$('#myModal').delegate('#modelClose', 'click', function(){
		blockImage = "";
	});

	var saveDesign = function(savedesign, addtocard, paynow){
		var canvas = $('.canvas');
		var halaman = canvas.find('.canvas_template').attr('data-halaman');
		var templateid = $('#templateid').val();
		var type = $('#type').val();
		var fotodetailid = $('#fotodetailid').val();
		var product_detail_id = $('#product_detail_id').val();
		var foto_collection_id = $('#foto_collection_id').val();
		var images = new Array;
		$.each(canvas.find('.canvas_image'), function(){
			var urutan = $(this).closest('.block').attr('data-urutan');
			var a = {
				fotodata : $(this).attr('src'),
				fotoori : $(this).attr('data-original-src'),
				crop_x : $(this).attr('data-crop_x'),
				crop_y : $(this).attr('data-crop_y'),
				crop_w : $(this).attr('data-crop_w'),
				crop_h : $(this).attr('data-crop_h'),
				style : $(this).attr('style'),
				urutan : urutan,
				filter : $(this).attr('data-filter'),
				fileName : $(this).attr('data-fileName'),
				tmpfotodata : $(this).attr('data-fotodata')
			};
			images.push(a);
		});
		console.log(images);
		if (images.length <= 0){
			alert('Tidak dapat disimpan, karena anda belum memulai project nya.');
			return false;
		}
		$('.loader_overlay').show();
		$.post('/ajax/saveDesign', {
			images : images,
			halaman : halaman,
			templateid : templateid,
			type : type,
			fotodetailid : fotodetailid,
			product_detail_id : product_detail_id,
			foto_collection_id : foto_collection_id,
			savedesign : savedesign,
			addtocard : addtocard,
			paynow : paynow
		}, function(data){
			if (savedesign){
				if (data.fotodetailid){
					$('#fotodetailid').val(data.fotodetailid);
					$('#foto_collection_id').val(data.fotocollectionid);
					alert('Design saved successfull.');
				}
			}else if (addtocard){
				window.location = data.url;
			}else if (paynow){

			}
			$('.loader_overlay').hide();
		}, 'json');
	};

	$('#saveDesign').on('click', function(){
		var el = $(this);
		saveDesign(1, 0, 0);
		return false;
	});

	$('#addToCart').on('click', function(){
		var el = $(this);
		saveDesign(0, 1, 0);
		//return false;
	});

});