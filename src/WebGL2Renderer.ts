/**
 * Created by hey on 2017/2/28.
 */

namespace HEY{

    export class WebGL2Renderer{

        gl:WebGLRenderingContext = null;

        constructor(parameters:any = null){
            parameters = parameters || {};

            var _canvas = parameters.canvas !== undefined ? parameters.canvas : document.createElementNS( 'http://www.w3.org/1999/xhtml', 'canvas' ),
                _context = parameters.context !== undefined ? parameters.context : null,

                _alpha = parameters.alpha !== undefined ? parameters.alpha : false,
                _depth = parameters.depth !== undefined ? parameters.depth : true,
                _stencil = parameters.stencil !== undefined ? parameters.stencil : true,
                _antialias = parameters.antialias !== undefined ? parameters.antialias : false,
                _premultipliedAlpha = parameters.premultipliedAlpha !== undefined ? parameters.premultipliedAlpha : true,
                _preserveDrawingBuffer = parameters.preserveDrawingBuffer !== undefined ? parameters.preserveDrawingBuffer : false;

            // initialize

            let  gl:WebGLRenderingContext;

            try {

                var attributes = {
                    alpha: _alpha,
                    depth: _depth,
                    stencil: _stencil,
                    antialias: _antialias,
                    premultipliedAlpha: _premultipliedAlpha,
                    preserveDrawingBuffer: _preserveDrawingBuffer
                };

                gl = _context || _canvas.getContext( 'webgl2', attributes );

                if ( gl === null ) {

                    if ( _canvas.getContext( 'webgl2' ) !== null ) {

                        throw 'Error creating WebGL2 context with your selected attributes.';

                    } else {

                        throw 'Error creating WebGL2 context.';

                    }

                }

                _canvas.addEventListener( 'webglcontextlost', (event:any)=>{
                    event.preventDefault();
                }, false );

            } catch ( error ) {

                console.error( 'THREE.WebGL2Renderer: ' + error );

            }

            this.gl = gl;

        }



    }

}