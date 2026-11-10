<script>
const STYLE_ID = 'nightshade-palette';

/**
 * Mirrors the site palette into a `<style>` element while it differs from the default.
 */
export default {

    inject: [
        'paletteManager',
    ],

    computed: {

        css() {
            return this.paletteManager.customized ? this.paletteManager.css : '';
        },

    },

    watch: {

        css(css) {
            this.applyCss(css);
        },

    },

    mounted() {
        this.applyCss(this.css);
    },

    methods: {

        applyCss(css) {
            let el = document.getElementById(STYLE_ID);
            if (!el) {
                el = document.createElement('style');
                el.id = STYLE_ID;
                document.head.appendChild(el);
            }
            el.textContent = css;
        },

    },

    render() {
        return null;
    },

};
</script>
