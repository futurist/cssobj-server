// rollup.config.js

export default {
  entry: 'src/cssobj-plugin-post-stylize.js',
  moduleName: 'cssobj_plugin_post_stylize',
  moduleId: 'cssobj_plugin_post_stylize',
  targets: [
    { format: 'iife', dest: 'dist/cssobj-plugin-post-stylize.iife.js' },
    { format: 'amd',  dest: 'dist/cssobj-plugin-post-stylize.amd.js'  },
    { format: 'cjs',  dest: 'dist/cssobj-plugin-post-stylize.cjs.js'  },
    { format: 'es',   dest: 'dist/cssobj-plugin-post-stylize.es.js'   }
  ]
}
