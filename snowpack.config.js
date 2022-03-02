export default {
    mount: {
        src: '/',
    },
    optimize: {
        bundle: true,
        minify: true,
    },
    plugins: [
        '@snowpack/plugin-sass',
    ],
};