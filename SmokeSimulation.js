function smoke_init(renderer) {
    var container;
    var fullScreenQuad, plane;

    var camera, scene;
    var options;
    var tick = 0;
    let bufferScene, bufferTexture;
    var terrain_mesh;
    let smoke_mesh;
    var FBO_A, FBO_B;
    let width = 256
    let height = 256
    camera = new THREE.OrthographicCamera( width / - 2, width / 2, height / 2, height / - 2, 1, 1000 );
    camera.position.z = 1;
    scene = new THREE.Scene();

    bufferScene = new THREE.Scene()
    bufferTexture = new THREE.WebGLRenderTarget( 
        256, 
        256, 
        { 
            minFilter: THREE.LinearFilter, 
            magFilter: THREE.NearestFilter
        }
    );

    smoke_mesh = generate_smoke_mesh(bufferTexture)
    bufferScene.add(smoke_mesh)

    plane = new THREE.PlaneBufferGeometry( 256, 256)
    fullScreenQuad = new THREE.Mesh( plane, new THREE.MeshBasicMaterial({depthWrite: false, depthTest: false}) );
	scene.add(fullScreenQuad);

	FBO_A = new THREE.WebGLRenderTarget( 256, 256, { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter});
	FBO_B = new THREE.WebGLRenderTarget( 256, 256, { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter} );


    render();
    return fullScreenQuad
    function render() {
        requestAnimationFrame(render)
        tick += 0.01;
        smoke_mesh.material.uniforms.tick.value = tick;

        renderer.render(bufferScene, camera, FBO_B);
        fullScreenQuad.material.map = FBO_B.texture;
        fullScreenQuad.material.transparent = true

        var t = FBO_A;
        FBO_A = FBO_B;
        FBO_B = t;
        smoke_mesh.material.uniforms.bufferTexture.value = FBO_A.texture;
    }
}