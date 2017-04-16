$(function(){

    var vm = new Vue({

        el: '#categories',

        data: {
            entries: [],
			selected: [],
			count: ''
        },
		
		ready: function () {
	        this.$watch('', this.load, {immediate: true});
	    },

        methods: {

			load: function () {
				this.$http.post('api/calendar/categories/load', function(data) {
					this.$set('$data.entries', data.categories);
					this.$set('$data.selected', []);
					this.$set('$data.count', data.count);
                }).error(function(data) {
                    UIkit.notify(data, 'danger');
                });
			},
		
            remove: function(category) {
                this.$http.post('api/calendar/categories/remove', { ids: this.selected }, function() {
                    UIkit.notify(vm.$trans('Categories deleted.'));
					this.load();
                }).error(function(data) {
                    UIkit.notify(data, 'danger');
                });
            }
        }

    });

});