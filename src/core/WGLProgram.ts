/**
 * Created by ll on 2017/5/12.
 */

namespace HEY{

    export class WGProgram{
        vs:string = null;
        fs:string = null;

        programe:number = null;
        constructor(vs:string,fs:string){
            this.vs = vs;
            this.fs = fs;

            this.setup();
        }

        setup(){
            let gl:WebGLRenderingContext  = Demo.gl;

            let program = gl.createProgram();
            let vs = WGLShader(gl.VERTEX_SHADER,this.vs);
            let fs = WGLShader(gl.FRAGMENT_SHADER,this.fs);

            gl.attachShader( program, vs );
            gl.attachShader( program, fs );

            gl.linkProgram( program );

            var programLog = gl.getProgramInfoLog( program );
            var vertexLog = gl.getShaderInfoLog( vs );
            var fragmentLog = gl.getShaderInfoLog( fs );

            var runnable = true;

            if ( gl.getProgramParameter( program, gl.LINK_STATUS ) === false ) {

                runnable = false;

                console.error( 'THREE.WebGLProgram: shader error: ', gl.getError(), 'gl.VALIDATE_STATUS', gl.getProgramParameter( program, gl.VALIDATE_STATUS ), 'gl.getProgramInfoLog', programLog, vertexLog, fragmentLog );

            } else if ( programLog !== '' ) {

                console.warn( 'THREE.WebGLProgram: gl.getProgramInfoLog()', programLog );

            } else if ( vertexLog === '' || fragmentLog === '' ) {


            }

            gl.deleteShader( vs );
            gl.deleteShader( fs );




        }




    }
}