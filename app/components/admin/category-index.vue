<script>

	module.exports = {

        el: '#categories',

        data: function() {
            return _.merge({
                entries: [],
                config: {
                    filter: this.$session.get('categories.filter', {order: 'name asc', limit:25})
                },
                selected: [],
                count: '',
                pages: 0
            }, window.$data);
        },
        
        ready: function () {
            this.resource = this.$resource('api/calendar/category{/id}');
            this.$watch('config.filter', this.load, {immediate: true});
        },
        
        watch: {
            'config.filter': {
                handler: function (filter) {
                    if (this.config.page) {
                        this.config.page = 0;
                    } else {
                        this.load();
                    }

                    this.$session.set('categories.filter', filter);
                },
                deep: true
            }
        },

        computed: {
            statusOptions: function () {

                var options = _.map(this.$data.statuses, function (status, id) {
                    return { text: status, value: id };
                });

                return [{ label: this.$trans('Filter by'), options: options }];
            },

            authors: function() {

                var options = _.map(this.$data.authors, function (author) {
                    return { text: author.username, value: author.user_id };
                });

                return [{ label: this.$trans('Filter by'), options: options }];
            }
        },
        
        methods: {

            load: function () {
                this.resource.query({ filter: this.config.filter, page: this.config.page }).then(function (res) {

                    var data = res.data;

                    this.$set('$data.entries', data.categories);
                    this.$set('pages', data.pages);
                    this.$set('count', data.count);
                    this.$set('selected', []);
                });
            },
        
            remove: function() {
                if (!this.selected.length) {
                    return;
                }

                this.resource.delete({ id: 'bulk' }, { ids: this.selected }).then(function () {
                    this.load();
                    this.$notify('Categories deleted.');
                }, function (res) {
                    this.$notify(res.data, 'danger');
                });
            },
            
            copy: function() {
                if (!this.selected.length) {
                    return;
                }

                this.resource.save({ id: 'copy' }, { ids: this.selected }).then(function () {
                    this.load();
                    this.$notify('Categories copied.');
                });
            }
        }

    }
    
    Vue.ready(module.exports);

</script>