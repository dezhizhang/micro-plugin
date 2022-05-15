import serve from 'rollup-plugin-serve';

export default {
    input:'./src/index.js',
    output:{
        file:'./lib/umd/index.js',
        format:'umd',
        name:'microPlugin',
        sourcemap:true,
    },
    plugins:[
        serve({
            open: true,
            openPage:'./index.html',
            contentBase: '',
            port:3000
        })
    ]
}