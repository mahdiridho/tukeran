angular.module('starter.services', [])

.factory('userService', function($http) {
    var baseUrl = 'http://tukeran.onfinger.net/';
    return {
        create: function (userdata){
            return $http.post(baseUrl+'submituser.php',userdata,{
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8;'
                }
            });
        },
        update: function (userdata){
            return $http.post(baseUrl+'updateuser.php',userdata,{
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8;'
                }
            });
        },
        verified: function (userkey){
            return $http.post(baseUrl+'activate.php',userkey,{
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8;'
                }
            });
        },
        resetpassword: function (email){
            return $http.post(baseUrl+'forgot.php',email,{
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8;'
                }
            });
        },
        login: function (logindata){
            return $http.post(baseUrl+'login.php',logindata,{
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8;'
                }
            });
        }
    };    
})

.factory('itemService', function($http) {
    var baseUrl = 'http://tukeran.onfinger.net/';
    return {
        cacheImage: function (cache){
            return $http.post(baseUrl+'cacheimage.php',cache,{
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8;'
                }
            });
        },
        insert: function (item){
            return $http.post(baseUrl+'submititem.php',item,{
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8;'
                }
            });
        },
        delete: function (code){
            return $http.post(baseUrl+'delitem.php',code,{
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8;'
                }
            });
        },
        getItem: function (data1, data2, data3, data4){
			return $http.get(baseUrl+'getitem.php?data1='+data1+'&data2='+data2+'&data3='+data3+'&data4='+data4);
        }
    };    
})

.factory('tukeranService', function($http) {
    var baseUrl = 'http://tukeran.onfinger.net/';
    return {
        request: function (data){
            return $http.post(baseUrl+'tukeran.php',data,{
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8;'
                }
            });
        },
        getAllTukeran: function (data1, data2, data3){
			return $http.get(baseUrl+'tukeran.php?data1='+data1+'&data2='+data2+'&data3='+data3);
        },
        barterItem: function (data1, data2, data3, data4){
			return $http.get(baseUrl+'tukeran.php?data1='+data1+'&data2='+data2+'&data3='+data3+'&data4='+data4);
        },
        getMyItem: function (data1){
			return $http.get(baseUrl+'tukeran.php?data1='+data1);
        }
    };    
})

.filter('unsafe', function($sce) { return $sce.trustAsHtml; });