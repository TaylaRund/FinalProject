function smoke_init(renderer) {
    let fullScreenQuad;
    let camera, scene;
    let tick = 0;
    let bufferScene, bufferTexture;
    let smoke_mesh;
    let FBO_A, FBO_B;

    let width = 256
    let height = 256

    camera = new THREE.OrthographicCamera( width / - 2, width / 2, height / 2, height / - 2, 1, 1000 );
    camera.position.z = 1;

    bufferScene = new THREE.Scene()

	FBO_A = new THREE.WebGLRenderTarget( 256, 256, { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter});
	FBO_B = new THREE.WebGLRenderTarget( 256, 256, { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter} );
    smoke_mesh = generate_smoke_mesh(FBO_A)
    bufferScene.add(smoke_mesh)

    fullScreenQuad = 
        new THREE.Mesh( 
            new THREE.PlaneBufferGeometry( 256, 256), 
            new THREE.MeshBasicMaterial(
                {depthWrite: false, depthTest: false}
            )
        );

    function render() {
        tick += 0.01;
        smoke_mesh.material.uniforms.tick.value = tick;

        renderer.render(bufferScene, camera, FBO_B);
        fullScreenQuad.material.map = FBO_B.texture;
        fullScreenQuad.material.transparent = true

        let t = FBO_A;
        FBO_A = FBO_B;
        FBO_B = t;
        smoke_mesh.material.uniforms.bufferTexture.value = FBO_A.texture;
    }

    return {render, fullScreenQuad}
}