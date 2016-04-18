angular.module('starter.controllers', [])

/* MAIN CONTROLLER */
.controller('FirstCtrl', function($scope, $state, $ionicPlatform, $ionicHistory, $timeout) {
	$ionicPlatform.ready(function() {
		$timeout(function() {
			$scope.coverApp = {'display':'none'};
			if(localStorage.getItem("Profile_Email") == "undefined" || localStorage.getItem("Profile_Email") == null || localStorage.getItem("Profile_Email") == ''){
				$ionicHistory.nextViewOptions({
					disableBack: true
				});
				$state.go('signin');
			}
		}, 3000);
	})
})

.controller('SigninCtrl', function($scope, $state, $ionicPopup, $ionicHistory, userService) {
	$scope.signup = function() {
		$state.go('signup');
	};

	$scope.login = {};
	$scope.signin = function() {
		userService.login({
			'data1': $scope.login.username,
			'data2': $scope.login.password
		}).success(function(userauth){
			if(userauth == "a")$ionicPopup.alert({
				title: 'Information',
				template: 'Database connection failed'});
			else if(userauth == "b")$ionicPopup.alert({
				title: 'Information',
				template: 'Invalid User'});
            else {
				localStorage.setItem("Profile_ID", userauth.id);
				localStorage.setItem("Profile_Email", $scope.login.username);
				localStorage.setItem("Profile_Name", userauth.name);
				localStorage.setItem("Profile_Phone", userauth.phone);
				localStorage.setItem("Profile_Whatsapp", userauth.whatsapp);
				localStorage.setItem("Profile_CRegion", userauth.region);
				localStorage.setItem("Profile_NRegion", userauth.description);
				$ionicHistory.nextViewOptions({
					disableBack: true
				});
				$state.go('menu.home');
			}
		});
	};
})

.controller('ForgotCtrl', function($scope, $state, $ionicPopup, $ionicHistory, userService) {
    $scope.resetpw={};
    $scope.randpw = function (){
        userService.resetpassword({
			'email': $scope.resetpw.email
        }).success(function(userpw){
			if(userpw == "a")$ionicPopup.alert({
				title: 'Information',
				template: 'Database connection failed'});
			else if(userpw == "b")$ionicPopup.alert({
				title: 'Information',
				template: 'Email is not registered'});
			else if(userpw == "c")$ionicPopup.alert({
				title: 'Information',
				template: 'Database query failed'});
            else {
				$scope.resetpw.email = "";
				$ionicHistory.nextViewOptions({
					disableBack: true
				});
				$state.go('signin');
			}
        });
	}
})

.controller('SignupCtrl', function($scope, $state, $ionicHistory, $ionicPopup, $ionicLoading, userService) {
    $scope.data={};
    $scope.send = function (){
		$ionicLoading.show({
		  template: 'Please wait...'
		});

		userService.create({
			'data1': $scope.data.email,
			'data2': $scope.data.name,
			'data3': $scope.data.password1
		}).success(function(userd){
			if(userd == "a"){
				$ionicLoading.hide();
				$ionicPopup.alert({title: 'Information', template: 'Database connection failed'});
			}
			else if(userd == "b"){
				$ionicLoading.hide();
				$ionicPopup.alert({title: 'Information', template: 'Choose another username'});
			}
			else if(userd == "c"){
				$ionicLoading.hide();
				$ionicPopup.alert({title: 'Information', template: 'Database query failed'});
			}
			else {
				$ionicLoading.hide();
				$scope.data.email = "";
				$scope.data.name = "";
				$scope.data.password1 = "";
				$scope.data.password2 = "";
				$ionicHistory.nextViewOptions({
					disableBack: true
				});
				$state.go('code');
			}
		});
	}
})

.controller('CodeCtrl', function($scope, $state, $ionicHistory) {
    $scope.finish = function (){
		$ionicHistory.nextViewOptions({
			disableBack: true
		});
		$state.go('signin');
	}
})

/* HOME CONTROLLER */

.controller('HomeCtrl', function($scope, $state, $ionicPlatform, $ionicHistory) {
	$ionicPlatform.ready(function() {
		if(localStorage.getItem("Profile_Email") == "undefined" || localStorage.getItem("Profile_Email") == null || localStorage.getItem("Profile_Email") == ''){
			$ionicHistory.nextViewOptions({
				disableBack: true
			});
			$state.go('signin');
		}
	})
	$scope.go = function(page){
		$state.go(page);
	}
	$scope.find = function(type){
		localStorage.setItem("filter1", "R0");
		localStorage.setItem("filter2", type.substring(0,1));
		$state.go('allitem', { typeItem: type });
	}
})

.controller('AllItemCtrl', function($scope, $state, $stateParams, $ionicHistory, $ionicModal, $ionicPlatform, itemService) {
	$ionicPlatform.ready(function() {
		$scope.titlepage = $stateParams.typeItem;
		itemService.getItem("all",  localStorage.getItem("Profile_ID"), localStorage.getItem("filter1"), localStorage.getItem("filter2")).success(function(data) {
			$scope.items = data;
			localStorage.removeItem("filter1");
			localStorage.removeItem("filter2");
		});
	})
	$scope.showDetail = function(code){
		$ionicHistory.nextViewOptions({
			disableBack: true
		});
		$state.go('detailitem', { typeItem: $stateParams.typeItem, codeItem: code });
	}

	$scope.back = function(){
		$ionicHistory.nextViewOptions({
			disableBack: true
		});
		$state.go('menu.home');
	}

    $scope.doRefresh = function() {
		itemService.getItem("all",  localStorage.getItem("Profile_ID"), "R0", $stateParams.typeItem.substring(0,1)).success(function(data) {
			$scope.items = data;
			localStorage.removeItem("filter1");
			localStorage.removeItem("filter2");
        }).finally(function() {
            $scope.$broadcast('scroll.refreshComplete');
        });
    };

	$scope.showModal = function(templateUrl) {
			$ionicModal.fromTemplateUrl(templateUrl, {
			  scope: $scope
		}).then(function(modal) {
			$scope.filterModal = modal;
			$scope.filterModal.show();
		});
	}

	$scope.filterItem = function(){
		$scope.showModal('FilterItem.html');
	}

	$scope.setFilter = function(){
		$scope.filterModal.hide();
		$scope.filterModal.remove();
		localStorage.setItem("filter1", $scope.data.region.code);
		localStorage.setItem("filter2", $scope.data.category.code);
		$state.reload();
	}

	$scope.regions = [
		{'code':'R0','name':'All Region'},
		{'code':'AC','name':'Aceh'},
		{'code':'SMU','name':'Sumatra Utara'},
		{'code':'SMB','name':'Sumatra Barat'},
		{'code':'RI','name':'Riau'},
		{'code':'KRI','name':'Kepulauan Riau'},
		{'code':'BNK','name':'Bengkulu'},
		{'code':'JMB','name':'Jambi'},
		{'code':'BKB','name':'Bangka Belitung'},
		{'code':'SML','name':'Sumatra Selatan'},
		{'code':'LMP','name':'Lampung'},
		{'code':'BNT','name':'Banten'},
		{'code':'JKT','name':'DKI Jakarta'},
		{'code':'JWB','name':'Jawa Barat'},
		{'code':'JWH','name':'Jawa Tengah'},
		{'code':'YK','name':'DI Yogyakarta'},
		{'code':'JWR','name':'Jawa Timur'},
		{'code':'BL','name':'Bali'},
		{'code':'NTB','name':'Nusa Tenggara Barat'},
		{'code':'NTT','name':'Nusa Tenggara Timur'},
		{'code':'KLB','name':'Kalimantan Barat'},
		{'code':'KLT','name':'Kalimantan Timur'},
		{'code':'KLU','name':'Kalimantan Utara'},
		{'code':'KLS','name':'Kalimantan Selatan'},
		{'code':'KLH','name':'Kalimantan Tengah'},
		{'code':'SLB','name':'Sulawesi Barat'},
		{'code':'SLT','name':'Sulawesi Tenggara'},
		{'code':'SLS','name':'Sulawesi Selatan'},
		{'code':'SLU','name':'Sulawesi Utara'},
		{'code':'SLH','name':'Sulawesi Tengah'},
		{'code':'GRO','name':'Gorontalo'},
		{'code':'MLK','name':'Maluku'},
		{'code':'MLU','name':'Maluku Utara'},
		{'code':'PPA','name':'Papua'},
		{'code':'PPB','name':'Papua Barat'}
	];
    $scope.data={};
	$scope.data.region = {'code':'YK','name':'DI Yogyakarta'};
	if($stateParams.typeItem.substring(0,1) == 'G'){
		$scope.categories = [
			{'code':'G','name':'All Goods'},
			{'code':'G1','name':'Vehicle'},
			{'code':'G2','name':'Property'},
			{'code':'G3','name':'Household'},
			{'code':'G4','name':'Computer & Hardware'},
			{'code':'G5','name':'Gadget'},
			{'code':'G6','name':'Electronic'},
			{'code':'G7','name':'Baby Gear'},
			{'code':'G8','name':'Book'},
			{'code':'G9','name':'Fashion'},
			{'code':'G10','name':'Hobby & Sport'},
			{'code':'G11','name':'Work Tools'},
			{'code':'G12','name':'Flora & Fauna'}
		];
		$scope.data.category = {'code':'G4','name':'Computer & Hardware'};
	}else{
		$scope.categories = [
			{'code':'S','name':'All Skills'},
			{'code':'S1','name':'Health & Therapy'},
			{'code':'S2','name':'Internet & Computer'},
			{'code':'S3','name':'Art & Entertainment'},
			{'code':'S4','name':'Consultant'},
			{'code':'S5','name':'Teacher'},
			{'code':'S6','name':'Caretaker'},
			{'code':'S7','name':'Interpreter & Writer'},
			{'code':'S8','name':'Mechanic & Engineer'},
			{'code':'S9','name':'Cleaning Service'},
			{'code':'S10','name':'Farmer & Gardener'},
			{'code':'S11','name':'Courier'},
			{'code':'S12','name':'Sport'}
		];
		$scope.data.category = {'code':'S4','name':'Consultant'};
	}
})

.controller('DetailItemCtrl', function($scope, $state, $stateParams, $ionicModal, $ionicSlideBoxDelegate, $ionicPopup, $ionicScrollDelegate, $ionicPlatform, $ionicHistory, itemService, tukeranService) {
	itemService.getItem('detail', $stateParams.codeItem).success(function(data) {
		$scope.code = $stateParams.codeItem;
		$scope.file = data.file;
		$scope.folder = data.folder;
		$scope.itemID = data.itemID;
		$scope.title = data.title;
		$scope.codecategory = data.codecategory;
		$scope.category = data.category;
		$scope.description = data.description;
		$scope.phone = data.phone;
		$scope.whatsapp = data.phone;
		$scope.email = data.email;
		$scope.location = data.region;
		$scope.date	= data.date;
		$scope.views = data.views;
		var numImage = data.numImage;
		$scope.iImages = [];
		if(numImage > 0){
			for(i=0; i<numImage; i++){
				$scope.iImages.push({
					"src" : data.file[i]
				})
			}
		} else {
			$scope.iImages.push({
				"src" : data.file[0]
			})
		}
		
		$scope.zoomMin = 1;

		$scope.showImages = function(index) {
			$scope.activeSlide = index;
			$scope.showModal('templates/gallery-zoomview.html', true);
		};
		
		$scope.closeModal = function() {
			$scope.modal.hide();
			$scope.modal.remove();
		};

		$scope.updateSlideStatus = function(slide) {
			var zoomFactor = $ionicScrollDelegate.$getByHandle('scrollHandle' + slide).getScrollPosition().zoom;
			if (zoomFactor == $scope.zoomMin) {
				$ionicSlideBoxDelegate.enableSlide(true);
			} else {
				$ionicSlideBoxDelegate.enableSlide(false);
			}
		};
	})

	$scope.showModal = function(templateUrl, backButton) {
			$ionicModal.fromTemplateUrl(templateUrl, {
			  scope: $scope,
			  hardwareBackButtonClose: backButton
		}).then(function(modal) {
			if(templateUrl == 'TukeranItem.html'){
				$scope.tukeranModal = modal;
				$scope.tukeranModal.show();
			}
			else {
				$scope.modal = modal;
				$scope.modal.show();
			}
		});
	}

	$scope.tukeranItem = function(){
		$scope.showModal('TukeranItem.html', false);
	}

	$scope.back = function(){
		localStorage.setItem("filter1", "R0");
		localStorage.setItem("filter2", $stateParams.typeItem.substring(0,1));
		$ionicHistory.nextViewOptions({
			disableBack: true
		});
		$state.go('allitem', { typeItem: $stateParams.typeItem }, {reload: true} );
	}

/* Tukeran Modal */
	var myItem = [];var position;
	tukeranService.getMyItem(localStorage.getItem("Profile_ID")).success(function(data) {
		$scope.lists = data;
	});
	$scope.choose = function(i){
		icon = document.getElementById(i);
		if(icon.style.visibility == 'hidden'){
			icon.style.visibility = 'visible';
			myItem.push(i);
		}
		else {
			position = myItem.indexOf(i);
//			console.log(position);
			icon.style.visibility = 'hidden';
			myItem.splice(position,1);
		}
//		console.log(myItem);
	}
	$scope.cancelBarter = function(){
		icon = document.getElementsByClassName("icon balanced ion-checkmark-circled");
		for(i=0;i<icon.length;i++){
			icon[i].style.visibility = "hidden";
		}
		myItem = [];
		$scope.tukeranModal.hide();
		$scope.tukeranModal.remove();
	}
	$scope.barterItem = function(){
		icon = document.getElementsByClassName("icon balanced ion-checkmark-circled");
		for(i=0;i<icon.length;i++){
			icon[i].style.visibility = "hidden";
		}
		if(myItem.length > 0){
			tukeranService.barterItem('barter', $scope.itemID, myItem, localStorage.getItem("Profile_ID")).success(function(result) {
				$ionicPopup.alert({
					title: 'Information',
					template: result});
				myItem = [];
				$scope.tukeranModal.hide();
				$scope.tukeranModal.remove();
			});
		}
	}
})

/* TUKERAN CONTROLLER */

.controller('MyTukeranCtrl', function($scope, $state, $ionicHistory, $ionicPlatform, $ionicModal, $ionicSlideBoxDelegate, $ionicScrollDelegate, tukeranService, itemService) {
	var choose = 'in';
	$ionicPlatform.ready(function() {
		if(localStorage.getItem("Profile_Email") == "undefined" || localStorage.getItem("Profile_Email") == null || localStorage.getItem("Profile_Email") == ''){
			$ionicHistory.nextViewOptions({
				disableBack: true
			});
			$state.go('signin');
		}

		$scope.in_style = 'button-light';
		$scope.out_style = 'button-energized';
		$scope.deal_style = 'button-balanced';
		$scope.reject_style = 'button-assertive';
		tukeranService.getAllTukeran("all", localStorage.getItem("Profile_ID"), choose).success(function(data) {
			$scope.tukerans = data;
		});
	})
	
    $scope.doRefresh = function() {
		tukeranService.getAllTukeran("all", localStorage.getItem("Profile_ID"), choose).success(function(data) {
			$scope.tukerans = data;
        }).finally(function() {
            $scope.$broadcast('scroll.refreshComplete');
        });
    };

	$scope.showModal = function(templateUrl) {
			$ionicModal.fromTemplateUrl(templateUrl, {
			  scope: $scope
		}).then(function(modal) {
			if(templateUrl == 'templates/detailModal.html'){
				$scope.detailModal = modal;
				$scope.detailModal.show();
			}
			else {
				$scope.modal = modal;
				$scope.modal.show();
			}
		});
	}

	$scope.zoomMin = 1;

	$scope.showImages = function(index) {
		$scope.activeSlide = index;
		$scope.showModal('templates/gallery-zoomview.html');
	};
	
	$scope.closeModal = function() {
		$scope.modal.hide();
		$scope.modal.remove();
	};
		$scope.updateSlideStatus = function(slide) {
		var zoomFactor = $ionicScrollDelegate.$getByHandle('scrollHandle' + slide).getScrollPosition().zoom;
		if (zoomFactor == $scope.zoomMin) {
			$ionicSlideBoxDelegate.enableSlide(true);
		} else {
			$ionicSlideBoxDelegate.enableSlide(false);
		}
	};
	
	$scope.back = function(){
		$scope.detailModal.hide();
		$scope.detailModal.remove();
	}

	$scope.detailItem = function(code){
		itemService.getItem('detail', code).success(function(data) {
			$scope.file = data.file;
			$scope.folder = data.folder;
			$scope.title = data.title;
			$scope.category = data.category;
			$scope.description = data.description;
			$scope.date	= data.date;
			$scope.views = data.views;
			$scope.showModal('templates/detailModal.html');

			var numImage = data.numImage;
			$scope.iImages = [];
			if(numImage > 0){
				for(i=0; i<numImage; i++){
					$scope.iImages.push({
						"src" : data.file[i]
					})
				}
			} else {
				$scope.iImages.push({
					"src" : data.file[0]
				})
			}
		});
	}
		
	$scope.chooseTukeran = function(index){
		if(index == 1){
			choose = 'in';
			$scope.in_style = 'button-light';
			$scope.out_style = 'button-energized';
			$scope.deal_style = 'button-balanced';
			$scope.reject_style = 'button-assertive';
		}
		else if(index == 2){
			choose = 'out';
			$scope.in_style = 'button-energized';
			$scope.out_style = 'button-light';
			$scope.deal_style = 'button-balanced';
			$scope.reject_style = 'button-assertive';
		}
		else if(index == 3){
			choose = 'd';
			$scope.in_style = 'button-energized';
			$scope.out_style = 'button-energized';
			$scope.deal_style = 'button-light';
			$scope.reject_style = 'button-assertive';
		}
		else{
			choose = 'r';
			$scope.in_style = 'button-energized';
			$scope.out_style = 'button-energized';
			$scope.deal_style = 'button-balanced';
			$scope.reject_style = 'button-light';
		}
		tukeranService.getAllTukeran("all", localStorage.getItem("Profile_ID"), choose).success(function(data) {
			$scope.tukerans = data;
		});
	}
	$scope.dealTukeran = function(deal){
		tukeranService.getAllTukeran("all", localStorage.getItem("Profile_ID"), deal).success(function(data) {
			$scope.tukerans = data;
		});
	}
	$scope.showBarter = function(id){
		$state.go('barteritem', { codeTukeran: id, filter: choose });
	}
})

.controller('BarterItemCtrl', function($scope, $state, $stateParams, $ionicHistory, $ionicPlatform, $ionicModal, $ionicSlideBoxDelegate, $ionicScrollDelegate, tukeranService, itemService) {
	$scope.idBarter = $stateParams.codeTukeran;
	tukeranService.getAllTukeran("deal", $scope.idBarter, $stateParams.filter).success(function(data) {
		if($stateParams.filter == 'in'){
			$scope.itemTitle = data.itemTitle;
			$scope.userPic = data.userPic;
			$scope.userName = data.userName;
			$scope.userEmail = data.userEmail;
			$scope.userPhone = data.userPhone;
			$scope.userWA = data.userWA;
			$scope.userLocation = data.userLocation;
			$scope.userBody = {'display':'block'};
			$scope.footerContact = {'display':'block'};
		}else {
			$scope.userBody = {'display':'none'};
			$scope.footerContact = {'display':'none'};
		}
		$scope.versuss = data.listItem;
	});
	
	if($stateParams.filter == 'in'){
		$scope.deal = {'display':'block'};
		$scope.reject = {'display':'block'};
		$scope.cancel = {'display':'none'};
	}else if($stateParams.filter == 'out'){
		$scope.deal = {'display':'none'};
		$scope.reject = {'display':'none'};
		$scope.cancel = {'display':'block'};
	}else {
		$scope.deal = {'display':'none'};
		$scope.reject = {'display':'none'};
		$scope.cancel = {'display':'none'};
	}
	
	$scope.goback = function(){
		$ionicHistory.goBack();
	}
	
	$scope.rejectBarter = function(){
		tukeranService.getAllTukeran("deal", $scope.idBarter, 'rj').success(function(result) {
			if(result == 'ok')
				$state.go('menu.mytukeran', {}, { reload: true });
		});
	}
	$scope.cancelBarter = function(){
		tukeranService.getAllTukeran("deal", $scope.idBarter, 'cn').success(function(result) {
			if(result == 'ok')
				$state.go('menu.mytukeran', {}, { reload: true });
		});
	}
	$scope.barterItem = function(){
		tukeranService.getAllTukeran("deal", $scope.idBarter, 'de').success(function(result) {
			if(result == 'ok')
				$state.go('menu.mytukeran', {}, { reload: true });
		});
	}
	
	$scope.showModal = function(templateUrl) {
			$ionicModal.fromTemplateUrl(templateUrl, {
			  scope: $scope
		}).then(function(modal) {
			if(templateUrl == 'templates/detailModal.html'){
				$scope.detailModal = modal;
				$scope.detailModal.show();
			}
			else {
				$scope.modal = modal;
				$scope.modal.show();
			}
		});
	}

	$scope.zoomMin = 1;

	$scope.showImages = function(index) {
		$scope.activeSlide = index;
		$scope.showModal('templates/gallery-zoomview.html');
	};
	
	$scope.closeModal = function() {
		$scope.modal.hide();
		$scope.modal.remove();
	};
		$scope.updateSlideStatus = function(slide) {
		var zoomFactor = $ionicScrollDelegate.$getByHandle('scrollHandle' + slide).getScrollPosition().zoom;
		if (zoomFactor == $scope.zoomMin) {
			$ionicSlideBoxDelegate.enableSlide(true);
		} else {
			$ionicSlideBoxDelegate.enableSlide(false);
		}
	};
	
	$scope.back = function(){
		$scope.detailModal.hide();
		$scope.detailModal.remove();
	}

	$scope.detailItem = function(code){
		itemService.getItem('detail', code).success(function(data) {
			$scope.file = data.file;
			$scope.folder = data.folder;
			$scope.title = data.title;
			$scope.category = data.category;
			$scope.description = data.description;
			$scope.date	= data.date;
			$scope.views = data.views;
			$scope.showModal('templates/detailModal.html');

			var numImage = data.numImage;
			$scope.iImages = [];
			if(numImage > 0){
				for(i=0; i<numImage; i++){
					$scope.iImages.push({
						"src" : data.file[i]
					})
				}
			} else {
				$scope.iImages.push({
					"src" : data.file[0]
				})
			}
		});
	}
})

/* ITEM CONTROLLER */

.controller('MyItemCtrl', function($scope, $state, $ionicPopup, $ionicLoading, $ionicHistory, $ionicPlatform, itemService) {
	$ionicPlatform.ready(function() {
		$scope.Email = localStorage.getItem("Profile_Email");
		$scope.goods_style = 'button-positive';
		$scope.skills_style = 'button-stable';
		$scope.drafts_style = 'button-stable';
		if(localStorage.getItem("Profile_Email") == "undefined" || localStorage.getItem("Profile_Email") == null || localStorage.getItem("Profile_Email") == ''){
			$ionicHistory.nextViewOptions({
				disableBack: true
			});
			$state.go('signin');
		}
		localStorage.setItem("Item_Choice", "G");
		itemService.getItem(localStorage.getItem("Item_Choice"), localStorage.getItem("Profile_Email")).success(function(data) {
            $scope.items = data;
        });
	})
	$scope.data = {showDelete: false};
    $scope.doRefresh = function() {
		itemService.getItem(localStorage.getItem("Item_Choice"), localStorage.getItem("Profile_Email")).success(function(data) {
            $scope.items = data;
        }).finally(function() {
            $scope.$broadcast('scroll.refreshComplete');
        });
    };
	$scope.chooseItem = function(index){
		if(index == 1){
			$scope.goods_style = 'button-positive';
			$scope.skills_style = 'button-stable';
			$scope.drafts_style = 'button-stable';
			localStorage.setItem("Item_Choice", "G");
			itemService.getItem(localStorage.getItem("Item_Choice"), localStorage.getItem("Profile_Email")).success(function(data) {
				$scope.items = data;
			});
		}
		else if(index == 2){
			$scope.goods_style = 'button-stable';
			$scope.skills_style = 'button-positive';
			$scope.drafts_style = 'button-stable';
			localStorage.setItem("Item_Choice", "S");
			itemService.getItem(localStorage.getItem("Item_Choice"), localStorage.getItem("Profile_Email")).success(function(data) {
				$scope.items = data;
			});
		}
		else{
			$scope.goods_style = 'button-stable';
			$scope.skills_style = 'button-stable';
			$scope.drafts_style = 'button-positive';
			localStorage.setItem("Item_Choice", "D");
			itemService.getItem(localStorage.getItem("Item_Choice"), localStorage.getItem("Profile_Email")).success(function(data) {
				$scope.items = data;
			});
		}
	}
	$scope.addItem = function() {
		var d = new Date();var codeItem = d.getTime();
		itemService.cacheImage({
			'data1': $scope.Email,
			'data2': codeItem,
			'data3': 'cachefolder',
			'data4': 'add'
		}).success(function(){
			localStorage.setItem("itemFolder", codeItem);
			$ionicHistory.nextViewOptions({
				disableBack: true
			});
			$state.go('additem');
		});
	}
	$scope.showDetail = function(code){
		$state.go('mydetailitem', { codeItem: code });
	}
	$scope.delete = function(code){
		var confirmPopup = $ionicPopup.confirm({
			title: 'Delete Item',
			template: 'Are you sure want to delete the item?'
		});
		confirmPopup.then(function(res) {
			if(res) {
				$ionicLoading.show({template: 'Please wait...'});
				itemService.delete({
					'data1': code,
					'data2': $scope.Email
				}).success(function(){
					$ionicLoading.hide();
//					location.reload(true);
					$state.reload();
				});
			} else {
				//console.log('You are not sure');
			}
		});
	}
	$scope.draft = function(code){
		$ionicLoading.show({template: 'Please wait...'});
		itemService.delete({
			'data1': code,
			'data2': 'draft'
		}).success(function(item){
			if(item == "a"){
				$ionicLoading.hide();
				alert("Database connection failed");
			}
			else if(item == "b"){
				$ionicLoading.hide();
				alert("Database query failed");
			}
			else {
				$ionicLoading.hide();
				$state.reload();
//				location.reload(true);
			}
		});
	}
})

.controller('MyDetailItemCtrl', function($scope, $state, $stateParams, $ionicModal, $ionicSlideBoxDelegate, $ionicScrollDelegate, $ionicHistory, itemService) {
	itemService.getItem('detail', $stateParams.codeItem).success(function(data) {
		$scope.code = $stateParams.codeItem;
		$scope.file = data.file;
		$scope.folder = data.folder;
		$scope.title = data.title;
		$scope.codecategory = data.codecategory;
		$scope.category = data.category;
		$scope.description = data.description;
		$scope.date	= data.date;
		$scope.views = data.views;
		var numImage = data.numImage;
		$scope.iImages = [];
		if(numImage > 0){
			for(i=0; i<numImage; i++){
				$scope.iImages.push({
					"src" : data.file[i]
				})
			}
		} else {
			$scope.iImages.push({
				"src" : data.file[0]
			})
		}

		$scope.eImages = [];var j = 1;
		for(i=0;i<3;i++){
			if(data.file[i] == "img/gallery.jpg"){
				$scope.eImages.push({
					"pic" : "pic"+j,
					"src" : data.file[i],
					"cover" : "cover"+j,
					"cstyle" : "display:none",
					"rmImage" : "rmImage"+j,
					"rstyle" : "display:none",
					"spin" : "spin"+j,
					"sstyle" : "display:none",
					"indexPic" : j
				});
			} else {
				$scope.eImages.push({
					"pic" : "pic"+j,
					"src" : data.file[i],
					"cover" : "cover"+j,
					"cstyle" : "display:block",
					"rmImage" : "rmImage"+j,
					"rstyle" : "display:block",
					"spin" : "spin"+j,
					"sstyle" : "display:none",
					"indexPic" : j
				});
			}
			j++;
		}
		
		$scope.zoomMin = 1;

		$scope.showImages = function(index) {
			$scope.activeSlide = index;
			$scope.showModal('templates/gallery-zoomview.html', true);
		};
		
		$scope.closeModal = function() {
			$scope.modal.hide();
			$scope.modal.remove();
		};

		$scope.updateSlideStatus = function(slide) {
			var zoomFactor = $ionicScrollDelegate.$getByHandle('scrollHandle' + slide).getScrollPosition().zoom;
			if (zoomFactor == $scope.zoomMin) {
				$ionicSlideBoxDelegate.enableSlide(true);
			} else {
				$ionicSlideBoxDelegate.enableSlide(false);
			}
		};

		$scope.item={};
		$scope.item.title = $scope.title;
		$scope.item.description = $scope.description;
		$scope.typeList = [
			{ 'text': 'Goods', 'value': 'Goods' },
			{ 'text': 'Skills', 'value': 'Skills' }
		];
		if($scope.codecategory.substring(0,1) == 'G' || $scope.codecategory.substring(1,2) == 'G'){
			$scope.item.type = 'Goods';
			$scope.categories = [
				{'code':'G1','name':'Vehicle'},
				{'code':'G2','name':'Property'},
				{'code':'G3','name':'Household'},
				{'code':'G4','name':'Computer & Hardware'},
				{'code':'G5','name':'Gadget'},
				{'code':'G6','name':'Electronic'},
				{'code':'G7','name':'Baby Gear'},
				{'code':'G8','name':'Book'},
				{'code':'G9','name':'Fashion'},
				{'code':'G10','name':'Hobby & Sport'},
				{'code':'G11','name':'Work Tools'},
				{'code':'G12','name':'Flora & Fauna'}
			];
		}else{
			$scope.item.type = 'Skills';
			$scope.categories = [
				{'code':'S1','name':'Health & Therapy'},
				{'code':'S2','name':'Internet & Computer'},
				{'code':'S3','name':'Art & Entertainment'},
				{'code':'S4','name':'Consultant'},
				{'code':'S5','name':'Teacher'},
				{'code':'S6','name':'Caretaker'},
				{'code':'S7','name':'Interpreter & Writer'},
				{'code':'S8','name':'Mechanic & Engineer'},
				{'code':'S9','name':'Cleaning Service'},
				{'code':'S10','name':'Farmer & Gardener'},
				{'code':'S11','name':'Courier'},
				{'code':'S12','name':'Sport'}
			];
		}
		if($scope.codecategory.substring(0,1) == 'G' || $scope.codecategory.substring(0,1) == 'S'){
			$scope.item.category = {'code':$scope.codecategory};
		}else {
			$scope.item.category = {'code':$scope.codecategory.substring(1)};
		}
		$scope.typeChange = function(value){
			if(value == "Goods"){
				$scope.item.type = 'Goods';
				$scope.categories = [
					{'code':'G1','name':'Vehicle'},
					{'code':'G2','name':'Property'},
					{'code':'G3','name':'Household'},
					{'code':'G4','name':'Computer & Hardware'},
					{'code':'G5','name':'Gadget'},
					{'code':'G6','name':'Electronic'},
					{'code':'G7','name':'Baby Gear'},
					{'code':'G8','name':'Book'},
					{'code':'G9','name':'Fashion'},
					{'code':'G10','name':'Hobby & Sport'},
					{'code':'G11','name':'Work Tools'},
					{'code':'G12','name':'Flora & Fauna'}
				];
				if($scope.codecategory.substring(0,1) == 'G'){
					$scope.item.category = {'code':$scope.codecategory};
				}else if($scope.codecategory.substring(0,2) == 'DG') {
					$scope.item.category = {'code':$scope.codecategory.substring(1)};
				}else {
					$scope.item.category = {'code':'G4','name':'Computer & Hardware'};
				}
			}
			else{
				$scope.item.type = 'Skills';
				$scope.categories = [
					{'code':'S1','name':'Health & Therapy'},
					{'code':'S2','name':'Internet & Computer'},
					{'code':'S3','name':'Art & Entertainment'},
					{'code':'S4','name':'Consultant'},
					{'code':'S5','name':'Teacher'},
					{'code':'S6','name':'Caretaker'},
					{'code':'S7','name':'Interpreter & Writer'},
					{'code':'S8','name':'Mechanic & Engineer'},
					{'code':'S9','name':'Cleaning Service'},
					{'code':'S10','name':'Farmer & Gardener'},
					{'code':'S11','name':'Courier'},
					{'code':'S12','name':'Sport'}
				];
				if($scope.codecategory.substring(0,1) == 'S'){
					$scope.item.category = {'code':$scope.codecategory};
				}else if($scope.codecategory.substring(0,2) == 'DS') {
					$scope.item.category = {'code':$scope.codecategory.substring(1)};
				}else {
					$scope.item.category = {'code':'S4','name':'Consultant'};
				}
			}
		}
    });

	$scope.back = function(){
		$ionicHistory.goBack();
	}
	
	$scope.showModal = function(templateUrl, backButton) {
			$ionicModal.fromTemplateUrl(templateUrl, {
			  scope: $scope,
			  hardwareBackButtonClose: backButton
		}).then(function(modal) {
			if(templateUrl == 'EditItem.html'){
				$scope.itemModal = modal;
				$scope.itemModal.show();
			}
			else {
				$scope.modal = modal;
				$scope.modal.show();
			}
		});
	}

	$scope.editItem = function(){
		itemService.cacheImage({
			'data1': localStorage.getItem("Profile_Email"),
			'data2': $scope.folder,
			'data3': 'cachefolder',
			'data4': 'update'
		}).success(function(){
			$scope.showModal('EditItem.html', false);
		});
	}
})

.controller('itemModal', function($scope, $state, $ionicLoading, $timeout, $ionicLoading, $ionicActionSheet, $cordovaFile, $cordovaFileTransfer, $cordovaCamera, itemService) {
	var picture;
    $scope.getPic = function (img){
		var options = {
			quality: 80,
			destinationType: Camera.DestinationType.FILE_URI,
			allowEdit: true,
			encodingType: Camera.EncodingType.JPEG,
			targetWidth: 800,
			targetHeight: 800,
			saveToPhotoAlbum: false,
			correctOrientation:true
		};

		var hideSheet = $ionicActionSheet.show({
			buttons: [
				{
					text: 'Gallery'
				},
				{
					text: 'Camera'
				}
			],
			titleText: 'Image Source',
			cancelText: 'Cancel',
			buttonClicked: function(index) {
				if(index == 0)options.sourceType = Camera.PictureSourceType.PHOTOLIBRARY;
				else options.sourceType = Camera.PictureSourceType.CAMERA;
				$cordovaCamera.getPicture(options).then(function(imageData) {
					if(img==1)$scope.spin1={'display':'block'};
					else if(img==2)$scope.spin2={'display':'block'};
					else $scope.spin3={'display':'block'};

					var url = "http://tukeran.onfinger.net/upload.php";
					var imageFile = imageData.split("/").pop();
					if(index == 0) var targetPath = imageFile.split("jpg").shift()+"jpg";
					else var targetPath = imageFile;
					var targetFile = ''+img+'.jpg';
					var optionsUpload = {
						fileKey: "file",
						fileName: targetPath,
						chunkedMode: false,
						params : {'user':localStorage.getItem("Profile_Email")+'/item/cache', 'directory':'item', 'target':targetFile, 'codeitem':$scope.folder}
					};
					$cordovaFileTransfer.upload(url, imageData, optionsUpload).then(function (success) {
						if(JSON.stringify(success.response) == '"ok"'){
							if(img==1){
								picture = document.getElementById('pic1');
								$scope.cover1={'display':'block'};
								$scope.rmImage1={'display':'block'};
							}
							else if(img==2){
								picture = document.getElementById('pic2');
								$scope.cover2={'display':'block'};
								$scope.rmImage2={'display':'block'};
							}
							else {
								picture = document.getElementById('pic3');
								$scope.cover3={'display':'block'};
								$scope.rmImage3={'display':'block'};
							}
							picture.src=imageData;
						} else {
							alert("Upload failed!");
						}
						$cordovaFile.removeRecursively(cordova.file.externalApplicationStorageDirectory, "cache").then(function(){
							$cordovaFile.createDir(cordova.file.externalApplicationStorageDirectory, "cache", false);
						})
					});
					if(img==1)$scope.spin1={'display':'none'};
					else if(img==2)$scope.spin2={'display':'none'};
					else $scope.spin3={'display':'none'};
				});
			}
		});
		$timeout(function() {
			hideSheet();
		}, 3000);
    };
	
	$scope.rmImage = function(img){
		itemService.cacheImage({
			'data1': localStorage.getItem("Profile_Email"),
			'data2': $scope.folder,
			'data3': 'delimage',
			'data4': ''+img+'.jpg'
		}).success(function(result){
			if(img==1){
				picture = document.getElementById('pic1');
				$scope.cover1={'display':'none'};
				$scope.rmImage1={'display':'none'};
			}
			else if(img==2){
				picture = document.getElementById('pic2');
				$scope.cover2={'display':'none'};
				$scope.rmImage2={'display':'none'};
			}
			else {
				picture = document.getElementById('pic3');
				$scope.cover3={'display':'none'};
				$scope.rmImage3={'display':'none'};
			}
			picture.src="img/gallery.jpg";
		});
	}

	$scope.cancelUpdate = function() {
		itemService.cacheImage({
			'data1': localStorage.getItem("Profile_Email"),
			'data2': $scope.folder,
			'data3': 'delfolder'
		}).success(function(){
			$scope.item = {};
			$scope.itemModal.hide();
			$scope.itemModal.remove();
			$state.reload();
//			location.reload(true);
		});
	};

    $scope.updateItem = function (){
		$ionicLoading.show({template: 'Please wait...'});
		itemService.insert({
			'data1': $scope.code,
			'data2': localStorage.getItem("Profile_Email"),
			'data3': $scope.item.category.code,
			'data4': $scope.item.title,
			'data5': $scope.item.description,
			'data6': 'update',
			'data7': $scope.folder
		}).success(function(item){
			if(item == "a"){
				$ionicLoading.hide();
				alert("Database connection failed");
			}
			else if(item == "b"){
				$ionicLoading.hide();
				alert("Database query failed");
			}
			else if(item == "c"){
				$ionicLoading.hide();
				alert("File system failed");
			}
			else {
				$ionicLoading.hide();
				$scope.item = {};
				$scope.itemModal.hide();
				$scope.itemModal.remove();
				$state.reload();
//				location.reload(true);
			}
		});
	};
})

.controller('AddItemCtrl', function($scope, $state, $timeout, $ionicLoading, $ionicHistory, $ionicActionSheet, $cordovaFile, $cordovaFileTransfer, $cordovaCamera, itemService) {
	var code = localStorage.getItem("itemFolder");
	var email = localStorage.getItem("Profile_Email");
    $scope.item={};
	$scope.typeList = [
        { 'text': 'Goods', 'value': 'Goods' },
        { 'text': 'Skills', 'value': 'Skills' }
    ];
    $scope.item.type = 'Goods';
	$scope.categories = [
		{'code':'G1','name':'Vehicle'},
		{'code':'G2','name':'Property'},
		{'code':'G3','name':'Household'},
		{'code':'G4','name':'Computer & Hardware'},
		{'code':'G5','name':'Gadget'},
		{'code':'G6','name':'Electronic'},
		{'code':'G7','name':'Baby Gear'},
		{'code':'G8','name':'Book'},
		{'code':'G9','name':'Fashion'},
		{'code':'G10','name':'Hobby & Sport'},
		{'code':'G11','name':'Work Tools'},
		{'code':'G12','name':'Flora & Fauna'}
	];
	$scope.item.category = {'code':'G4','name':'Computer & Hardware'};
	$scope.typeChange = function(value){
		if(value == "Goods"){
			$scope.item.type = 'Goods';
			$scope.categories = [
				{'code':'G1','name':'Vehicle'},
				{'code':'G2','name':'Property'},
				{'code':'G3','name':'Household'},
				{'code':'G4','name':'Computer & Hardware'},
				{'code':'G5','name':'Gadget'},
				{'code':'G6','name':'Electronic'},
				{'code':'G7','name':'Baby Gear'},
				{'code':'G8','name':'Book'},
				{'code':'G9','name':'Fashion'},
				{'code':'G10','name':'Hobby & Sport'},
				{'code':'G11','name':'Work Tools'},
				{'code':'G12','name':'Flora & Fauna'}
			];
			$scope.item.category = {'code':'G4','name':'Computer & Hardware'};
		}
		else{
			$scope.item.type = 'Skills';
			$scope.categories = [
				{'code':'S1','name':'Health & Therapy'},
				{'code':'S2','name':'Internet & Computer'},
				{'code':'S3','name':'Art & Entertainment'},
				{'code':'S4','name':'Consultant'},
				{'code':'S5','name':'Teacher'},
				{'code':'S6','name':'Caretaker'},
				{'code':'S7','name':'Interpreter & Writer'},
				{'code':'S8','name':'Mechanic & Engineer'},
				{'code':'S9','name':'Cleaning Service'},
				{'code':'S10','name':'Farmer & Gardener'},
				{'code':'S11','name':'Courier'},
				{'code':'S12','name':'Sport'}
			];
			$scope.item.category = {'code':'S4','name':'Consultant'};
		}
	}
	$scope.img1 = $scope.img2 = $scope.img3 = "img/gallery.jpg";
	
    $scope.getPic = function (img){
		var options = {
			quality: 80,
			destinationType: Camera.DestinationType.FILE_URI,
			allowEdit: true,
			encodingType: Camera.EncodingType.JPEG,
			targetWidth: 800,
			targetHeight: 800,
			saveToPhotoAlbum: false,
			correctOrientation:true
		};

		var hideSheet = $ionicActionSheet.show({
			buttons: [
				{
					text: 'Gallery'
				},
				{
					text: 'Camera'
				}
			],
			titleText: 'Image Source',
			cancelText: 'Cancel',
			buttonClicked: function(index) {
				if(index == 0)options.sourceType = Camera.PictureSourceType.PHOTOLIBRARY;
				else options.sourceType = Camera.PictureSourceType.CAMERA;
				$cordovaCamera.getPicture(options).then(function(imageData) {
					if(img==1)$scope.spin1={'display':'block'};
					else if(img==2)$scope.spin2={'display':'block'};
					else $scope.spin3={'display':'block'};
					
					var url = "http://tukeran.onfinger.net/upload.php";
					var imageFile = imageData.split("/").pop();
					if(index == 0) var targetPath = imageFile.split("jpg").shift()+"jpg";
					else var targetPath = imageFile;
					var targetFile = ''+img+'.jpg';
					var optionsUpload = {
						fileKey: "file",
						fileName: targetPath,
						chunkedMode: false,
						params : {'user':email+'/item/cache', 'directory':'item', 'target':targetFile, 'codeitem':code}
					};
					$cordovaFileTransfer.upload(url, imageData, optionsUpload).then(function (success) {
						if(JSON.stringify(success.response) == '"ok"'){
							if(img==1){$scope.cover1={'display':'block'};$scope.img1=imageData;$scope.rmImage1={'display':'block'};}
							else if(img==2){$scope.cover2={'display':'block'};$scope.img2=imageData;$scope.rmImage2={'display':'block'};}
							else {$scope.cover3={'display':'block'};$scope.img3=imageData;$scope.rmImage3={'display':'block'};}
						} else {
							alert("Upload failed!");
						}
						$cordovaFile.removeRecursively(cordova.file.externalApplicationStorageDirectory, "cache").then(function(){
							$cordovaFile.createDir(cordova.file.externalApplicationStorageDirectory, "cache", false);
						})
					});
					if(img==1)$scope.spin1={'display':'none'};
					else if(img==2)$scope.spin2={'display':'none'};
					else $scope.spin3={'display':'none'};
				});
			}
		});
		$timeout(function() {
			hideSheet();
		}, 3000);
    };
	
	$scope.rmImage = function(img){
		itemService.cacheImage({
			'data1': email,
			'data2': code,
			'data3': 'delimage',
			'data4': ''+img+'.jpg'
		}).success(function(result){
			if(img==1){$scope.cover1={'display':'none'};$scope.img1="img/gallery.jpg";$scope.rmImage1={'display':'none'};}
			else if(img==2){$scope.cover2={'display':'none'};$scope.img2="img/gallery.jpg";$scope.rmImage2={'display':'none'};}
			else {$scope.cover3={'display':'none'};$scope.img3="img/gallery.jpg";$scope.rmImage3={'display':'none'};}
		});
	}

	$scope.cancelItem = function() {
		itemService.cacheImage({
			'data1': email,
			'data2': code,
			'data3': 'delfolder'
		}).success(function(){
			localStorage.removeItem("itemFolder");
			$scope.item = {};
			$ionicHistory.nextViewOptions({
				disableBack: true
			});
			$state.go('menu.myitem', {}, { reload: true });
		});
	};

    $scope.saveItem = function (index){
		var category = $scope.item.category.code;
		$ionicLoading.show({template: 'Please wait...'});
		if(index == 2)category = 'D'+category;
		itemService.insert({
			'data1': code,
			'data2': email,
			'data3': category,
			'data4': $scope.item.title,
			'data5': $scope.item.description,
			'data6': 'insert'
		}).success(function(item){
			if(item == "a"){
				$ionicLoading.hide();
				alert("Database connection failed");
			}
			else if(item == "b"){
				$ionicLoading.hide();
				alert("Database query failed");
			}
			else if(item == "c"){
				$ionicLoading.hide();
				alert("File system failed");
			}
			else {
				$ionicLoading.hide();
				localStorage.removeItem("itemFolder");
				$scope.item = {};
				$ionicHistory.nextViewOptions({
					disableBack: true
				});
				$state.go('menu.myitem', {}, { reload: true });
			}
		});
	};
})
	
/* ACCOUNT CONTROLLER */

.controller('CheckLoginCtrl', function($scope, $state, $timeout, $ionicHistory) {
	$scope.$on('$ionicView.afterEnter', function() {
		$timeout(function () {
			$ionicHistory.clearCache();
			$ionicHistory.clearHistory();
			$ionicHistory.nextViewOptions({ disableBack: true});
			$state.go('signin');
		}, 30);
	})
})

.controller('MyAccountCtrl', function($scope, $state, $timeout, $ionicModal, $ionicLoading, $ionicActionSheet, $ionicHistory, $ionicPlatform, $cordovaFile, $cordovaFileTransfer, $cordovaCamera) {
	$ionicPlatform.ready(function() {
		if(localStorage.getItem("Profile_Email") == "undefined" || localStorage.getItem("Profile_Email") == null || localStorage.getItem("Profile_Email") == ''){
			$ionicHistory.nextViewOptions({
				disableBack: true
			});
			$state.go('signin');
		}else{
			$scope.Email = localStorage.getItem("Profile_Email");
			$scope.Name = localStorage.getItem("Profile_Name");
			$scope.Phone = localStorage.getItem("Profile_Phone");
			$scope.Whatsapp = localStorage.getItem("Profile_Whatsapp");
			$scope.Region = localStorage.getItem("Profile_NRegion");
			$cordovaFile.checkFile(cordova.file.externalDataDirectory, $scope.Email +".jpg").then(function (success){
				$scope.ProfilePic = cordova.file.externalDataDirectory + $scope.Email + ".jpg";
			}, function(error){
				// File for download
				var url = "http://tukeran.onfinger.net/media/"+ $scope.Email +"/profile.jpg";
				 
				// Save location
				var targetPath = cordova.file.externalDataDirectory + $scope.Email + ".jpg";
				 
				$cordovaFileTransfer.download(url, targetPath, {}, true).then(function(result){
					$scope.ProfilePic = cordova.file.externalDataDirectory + $scope.Email + ".jpg";
				}, function(err) {
					$scope.ProfilePic = "img/profile.jpg";
				});
			});
		}
	});
	
	$scope.changePic = function(){
		var options = {
			quality: 80,
			destinationType: Camera.DestinationType.FILE_URI,
			allowEdit: true,
			encodingType: Camera.EncodingType.JPEG,
			targetWidth: 800,
			targetHeight: 800,
			saveToPhotoAlbum: false,
			correctOrientation:true
		};

		var hideSheet = $ionicActionSheet.show({
			buttons: [
				{
					text: 'Gallery'
				},
				{
					text: 'Camera'
				}
			],
			titleText: 'Image Source',
			cancelText: 'Cancel',
			buttonClicked: function(index) {
				if(index == 0)options.sourceType = Camera.PictureSourceType.PHOTOLIBRARY;
				else options.sourceType = Camera.PictureSourceType.CAMERA;
				$cordovaCamera.getPicture(options).then(function(imageData) {
					$scope.waiting={'display':'block'};
					var url = "http://tukeran.onfinger.net/upload.php";
					var targetPath = imageData.split("/").pop();
					if(index == 0)var targetFile = targetPath.split("jpg").shift()+"jpg";
					else var targetFile = targetPath;
					var optionsUpload = {
						fileKey: "file",
						fileName: targetFile,
						chunkedMode: false,
						params : {'user':$scope.Email, 'directory':'user', 'fileName':targetFile}
					};
					$cordovaFileTransfer.upload(url, imageData, optionsUpload).then(function (success) {
						if(JSON.stringify(success.response) == '"ok"'){
							$cordovaFile.moveFile(cordova.file.externalCacheDirectory, targetFile, cordova.file.externalDataDirectory, $scope.Email+'.jpg').then(function(){
								$cordovaFile.removeRecursively(cordova.file.externalApplicationStorageDirectory, "cache").then(function(){
									$cordovaFile.createDir(cordova.file.externalApplicationStorageDirectory, "cache", false);
								})
							});
							$scope.ProfilePic = imageData;
						} else {
							$cordovaFile.removeRecursively(cordova.file.externalApplicationStorageDirectory, "cache").then(function(){
								$cordovaFile.createDir(cordova.file.externalApplicationStorageDirectory, "cache", false);
							})
							alert("Upload failed!");
						}
					});
					$scope.waiting={'display':'none'};
				});
			}
		});
		$timeout(function() {
			hideSheet();
		}, 3000);

    }

	$scope.showModal = function(templateUrl) {
			$ionicModal.fromTemplateUrl(templateUrl, {
			  scope: $scope,
			  animation: 'slide-in-left'
		}).then(function(modal) {
			if(templateUrl == 'Profile.html'){
				$scope.profileModal = modal;
				$scope.profileModal.show();
			}
			else {
				$scope.passwordModal = modal;
				$scope.passwordModal.show();
			}
		});
	}

	$scope.editProfile = function() {
		$scope.showModal('Profile.html');
	}

	$scope.changePassword = function() {
		$scope.showModal('Password.html');
	}

	$scope.logout = function(){
		$ionicLoading.show({template:'Logging out....'});
		localStorage.removeItem("Profile_ID");
		localStorage.removeItem("Profile_Email");
		localStorage.removeItem("Profile_Name");
		localStorage.removeItem("Profile_Phone");
		localStorage.removeItem("Profile_Whatsapp");
		localStorage.removeItem("Profile_CRegion");
		localStorage.removeItem("Profile_NRegion");
		localStorage.removeItem("Item_Choice");
		$timeout(function () {
			$ionicLoading.hide();
			$ionicHistory.clearCache();
			$ionicHistory.clearHistory();
			$ionicHistory.nextViewOptions({ disableBack: true});
			$state.go('checklogin');
		}, 1000);
	};
})

.controller('profileModal', function($scope, $state, $ionicLoading, userService) {
	$scope.regions = [
		{'code':'AC','name':'Aceh'},
		{'code':'SMU','name':'Sumatra Utara'},
		{'code':'SMB','name':'Sumatra Barat'},
		{'code':'RI','name':'Riau'},
		{'code':'KRI','name':'Kepulauan Riau'},
		{'code':'BNK','name':'Bengkulu'},
		{'code':'JMB','name':'Jambi'},
		{'code':'BKB','name':'Bangka Belitung'},
		{'code':'SML','name':'Sumatra Selatan'},
		{'code':'LMP','name':'Lampung'},
		{'code':'BNT','name':'Banten'},
		{'code':'JKT','name':'DKI Jakarta'},
		{'code':'JWB','name':'Jawa Barat'},
		{'code':'JWH','name':'Jawa Tengah'},
		{'code':'YK','name':'DI Yogyakarta'},
		{'code':'JWR','name':'Jawa Timur'},
		{'code':'BL','name':'Bali'},
		{'code':'NTB','name':'Nusa Tenggara Barat'},
		{'code':'NTT','name':'Nusa Tenggara Timur'},
		{'code':'KLB','name':'Kalimantan Barat'},
		{'code':'KLT','name':'Kalimantan Timur'},
		{'code':'KLU','name':'Kalimantan Utara'},
		{'code':'KLS','name':'Kalimantan Selatan'},
		{'code':'KLH','name':'Kalimantan Tengah'},
		{'code':'SLB','name':'Sulawesi Barat'},
		{'code':'SLT','name':'Sulawesi Tenggara'},
		{'code':'SLS','name':'Sulawesi Selatan'},
		{'code':'SLU','name':'Sulawesi Utara'},
		{'code':'SLH','name':'Sulawesi Tengah'},
		{'code':'GRO','name':'Gorontalo'},
		{'code':'MLK','name':'Maluku'},
		{'code':'MLU','name':'Maluku Utara'},
		{'code':'PPA','name':'Papua'},
		{'code':'PPB','name':'Papua Barat'}
	];
    $scope.data={};
	$scope.data.name = localStorage.getItem("Profile_Name");
	$scope.data.phone = localStorage.getItem("Profile_Phone");
	$scope.data.whatsapp = localStorage.getItem("Profile_Whatsapp");
	if(localStorage.getItem("Profile_CRegion") !== ""){
		$scope.data.region = {code:localStorage.getItem("Profile_CRegion"), name:localStorage.getItem("Profile_NRegion")};
	}else{
		$scope.data.region = {code:"YK", name:"DI Yogyakarta"};
	}
    $scope.updateProfile = function (){
		$ionicLoading.show({template: 'Please wait...'});
		userService.update({
			'data1': 'profile',
			'data2': $scope.data.name,
			'data3': $scope.data.phone,
			'data4': $scope.data.whatsapp,
			'data5': $scope.data.region.code,
			'data6': localStorage.getItem("Profile_Email")
		}).success(function(userd){
			if(userd == "a"){
				$ionicLoading.hide();
				alert("Database connection failed");
			}
			else if(userd == "b"){
				$ionicLoading.hide();
				alert("Database query failed");
			}
			else {
				$ionicLoading.hide();
				localStorage.setItem("Profile_Name",$scope.data.name);
				localStorage.setItem("Profile_Phone",$scope.data.phone);
				localStorage.setItem("Profile_Whatsapp",$scope.data.whatsapp);
				localStorage.setItem("Profile_CRegion",$scope.data.region.code);
				localStorage.setItem("Profile_NRegion",$scope.data.region.name);
				$scope.data = {};
				$scope.data.region = {code:"YK", name:"DI Yogyakarta"};
				$scope.profileModal.hide();
				$scope.profileModal.remove();
				$state.reload();
//				location.reload(true);
			}
		});
	};
	$scope.cancelUpdate = function() {
		$scope.profileModal.hide();
		$scope.profileModal.remove();
		$scope.data = {};
		$scope.data.region = {name:"DI Yogyakarta"};
	};
})

.controller('passwordModal', function($scope, $ionicLoading, userService) {
    $scope.data={};
    $scope.changePassword = function (){
		$ionicLoading.show({
		  template: 'Please wait...'
		});
		userService.update({
			'data1': 'password',
			'data2': $scope.data.password1,
			'data3': localStorage.getItem("Profile_Email")
		}).success(function(userd){
			if(userd == "a"){
				$ionicLoading.hide();
				alert("Database connection failed");
			}
			else if(userd == "b"){
				$ionicLoading.hide();
				alert("Database query failed");
			}
			else {
				$ionicLoading.hide();
				$scope.data = {};
				$scope.passwordModal.hide();
				$scope.passwordModal.remove();
			}
		});
	};
	$scope.cancelChange = function() {
		$scope.passwordModal.hide();
		$scope.passwordModal.remove();
		$scope.data = {};
	};
})