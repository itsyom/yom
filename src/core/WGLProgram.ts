/**
 * Created by ll on 2017/5/12.
 */

namespace HEY{

    function fetchAttributesLocations(gl:WebGLRenderingContext, program:WebGLProgram){
        var attributes : {[key:string]:number} = {};

        var n = gl.getProgramParameter( program, gl.ACTIVE_ATTRIBUTES );

        for ( var i = 0; i < n; i ++ ) {

            var info = gl.getActiveAttrib( program, i );
            var name = info.name;

            // console.log("THREE.WebGLProgram: ACTIVE VERTEX ATTRIBUTE:", name, i );

            attributes[ name ] = gl.getAttribLocation( program, name );

        }

        return attributes;
    }

    export class WGLProgram{
        vs:string = null;
        fs:string = null;

        program:WebGLProgram = null;

        uniforms:WGLUniforms = null;
        attributes:{[key:string]:number} = null;

        render:WebGL2Renderer = null;
        constructor(vs:string,fs:string,render:WebGL2Renderer){
            this.vs = vs;
            this.fs = fs;

            this.render = render;
            this.setup();
        }

        setup(){
            let gl:WebGLRenderingContext  = GL.gl;

            let program = gl.createProgram();
            let vs = WGLShader(gl.VERTEX_SHADER,this.vs);
            let fs = WGLShader(gl.FRAGMENT_SHADER,this.fs);

            gl.attachShader( program, vs );
            gl.attachShader( program, fs );

            gl.linkProgram( program );

            var programLog = gl.getProgramInfoLog( program );
            var vertexLog = gl.getShaderInfoLog( vs );
            var fragmentLog = gl.getShaderInfoLog( fs );

            if ( gl.getProgramParameter( program, gl.LINK_STATUS ) === false ) {

                console.error( 'THREE.WebGLProgram: shader error: ', gl.getError(), 'gl.VALIDATE_STATUS', gl.getProgramParameter( program, gl.VALIDATE_STATUS ), 'gl.getProgramInfoLog', programLog, vertexLog, fragmentLog );

            } else if ( programLog !== '' ) {

                console.warn( 'THREE.WebGLProgram: gl.getProgramInfoLog()', programLog );

            } else if ( vertexLog === '' || fragmentLog === '' ) {

            }

            gl.deleteShader( vs );
            gl.deleteShader( fs );

            this.program = program;
        }

        getUniforms(){
            if(this.uniforms === null){
                this.uniforms = new WGLUniforms(this.program,this.render);
            }
            return this.uniforms;
        }

        getAttributes(){
            if(this.attributes === null) {
                let attributes = fetchAttributesLocations(GL.gl,this.program);
                this.attributes = attributes;
            }
            return this.attributes;
        }



    }
}