<script>
    export default {
        name: 'AuthRedirect',
        created() {
            console.log('\x1B[32m%s\x1B[0m', '9999999999999999')
            const hash = window.location.search.slice(1)
            if (window.localStorage) {
                window.localStorage.setItem('x-admin-oauth-code', hash)
                window.close()
            }
        },
        render: function(h) {
            return h() // avoid warning message
        }
    }
</script>
