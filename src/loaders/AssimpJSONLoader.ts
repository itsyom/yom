/**
 * Created by ll on 2017/5/15.
 */

namespace HEY{

    export class AssimpJSONLoader{

        constructor(){

        }

        load(url:string,onLoad:any,onError:any){

            let _this = this;
            FileLoader.load(url,function(data:any){

                let json = JSON.parse(data);
                let scene = null;
                scene = _this.parse(json);

                onLoad(scene);
            });


        }

        parse ( json:any ) {

            var meshes = this.parseList ( json.meshes, this.parseMesh );
            var materials = this.parseList ( json.materials, this.parseMaterial );
            return this.parseObject( json, json.rootnode, meshes, materials );

        }

        parseList ( json:any, handler:any ) {

            var meshes = new Array( json.length );
            for ( var i = 0; i < json.length; ++ i ) {

                meshes[ i ] = handler.call( this, json[ i ] );

            }
            return meshes;

        }

        parseMesh ( json:any ) {

            var geometry = new GeometryBuffer();

            var i, l, face;

            var indices = [];

            var vertices = json.vertices || [];
            var normals = json.normals || [];
            var uvs = json.texturecoords || [];
            var colors = json.colors || [];

            uvs = uvs[ 0 ] || []; // only support for a single set of uvs

            for ( i = 0, l = json.faces.length; i < l; i ++ ) {

                face = json.faces[ i ];
                indices.push( face[ 0 ], face[ 1 ], face[ 2 ] );

            }

            geometry.setIndex( indices );
            geometry.addAttribute( 'position', new VertexAttribute(new Float32Array(vertices),3) );

            if ( normals.length > 0 ) {

                geometry.addAttribute( 'normal', new VertexAttribute(new Float32Array(normals),3) );

            }

            if ( uvs.length > 0 ) {

                geometry.addAttribute( 'uv', new  VertexAttribute(new Float32Array(uvs),2)  );

            }

            if ( colors.length > 0 ) {

                geometry.addAttribute( 'color', new  VertexAttribute(new Float32Array(colors),3) );

            }


            return geometry;

        }

        parseMaterial(json:any){

            let material = new ShaderMaterial(ShaderLib.v_assimp,ShaderLib.f_assimp,{
                diffuse:
            })

        }

        parseObject(json:any, node:any, meshes:any, materials:any ){
            var  obj = new Obj3D(), i, idx;

            for ( i = 0; node.meshes && i < node.meshes.length; ++ i ) {

                idx = node.meshes[ i ];
                obj.add( new Mesh(meshes[idx],materials[json.meshes[ idx ].materialindex] );

            }

            for ( i = 0; node.children && i < node.children.length; ++ i ) {

                obj.add( this.parseObject( json, node.children[ i ], meshes, materials ) );

            }

            return obj;
        }



    }

}