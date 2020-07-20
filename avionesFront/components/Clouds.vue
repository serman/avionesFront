<template>
  <div>
    <script id="vs" type="x-shader/x-vertex">

      varying vec2 vUv;

      void main() {

      	vUv = uv;
      	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

      }
    </script>

    <script id="fs" type="x-shader/x-fragment">

      uniform sampler2D map;

      uniform vec3 fogColor;
      uniform float fogNear;
      uniform float fogFar;

      varying vec2 vUv;

      void main() {

      	float depth = gl_FragCoord.z / gl_FragCoord.w;
      	float fogFactor = smoothstep( fogNear, fogFar, depth );

      	gl_FragColor = texture2D( map, vUv );
      	gl_FragColor.w *= pow( gl_FragCoord.z, 20.0 );
      	gl_FragColor = mix( gl_FragColor, vec4( fogColor, gl_FragColor.w ), fogFactor );

      }
    </script>
  </div>
</template>

<script>
// musica: https://freemusicarchive.org/music/Egg_Nebula/Skyward_EP
// abstract happiness

import * as THREE from "three";
export default {
  name: "Clouds",
  data() {
    return {
      container: null,
      renderer: null,
      camera: null,
      start_time: Date.now(),
      mouseX: 0,
      mouseY: 0,
			scene: null,
			animationId: undefined
    };
  },
  mounted() {
    this.init();
	},
	destroyed(){
		 document.addEventListener("mousemove", this.onDocumentMouseMove);
		window.addEventListener( 'resize', this.onWindowResize );
		if(this.animationId) {
          window.cancelAnimationFrame(this.animationId);
          this.animationId=undefined
        }
	},
  methods: {
    init() {
      this.container = document.createElement("div");
      this.container.setAttribute("id", "cloud-container");
      document.body.appendChild(this.container);

      // Bg gradient

      var canvas = document.createElement("canvas");
      canvas.width = 32;
      canvas.height = window.innerHeight;

      var context = canvas.getContext("2d");

      var gradient = context.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, "#1e4877");
      gradient.addColorStop(0.5, "#4584b4");

      context.fillStyle = gradient;
      context.fillRect(0, 0, canvas.width, canvas.height);

      this.container.style.background =
        "url(" + canvas.toDataURL("image/png") + ")";
      this.container.style.backgroundSize = "32px 100%";

      //

      this.camera = new THREE.PerspectiveCamera(
        30,
        window.innerWidth / window.innerHeight,
        1,
        3000
      );
      this.camera.position.z = 6000;

      this.scene = new THREE.Scene();

      let geometry = new THREE.Geometry();

      var texture = new THREE.TextureLoader().load(
        require("@/assets/cloud10.png"),
        this.animate,
        undefined,
        err => {
          console.log(error);
        }
      );
      texture.magFilter = THREE.LinearMipMapLinearFilter;
      texture.minFilter = THREE.LinearMipMapLinearFilter;

      var fog = new THREE.Fog(0x4584b4, -100, 3000);

      let material = new THREE.ShaderMaterial({
        uniforms: {
          map: { type: "t", value: texture },
          fogColor: { type: "c", value: fog.color },
          fogNear: { type: "f", value: fog.near },
          fogFar: { type: "f", value: fog.far }
        },
        vertexShader: document.getElementById("vs").textContent,
        fragmentShader: document.getElementById("fs").textContent,
        depthWrite: false,
        depthTest: false,
        transparent: true
      });

      var plane = new THREE.Mesh(new THREE.PlaneGeometry(64, 64));

      for (var i = 0; i < 8000; i++) {
        plane.position.x = Math.random() * 1000 - 500;
        plane.position.y = -Math.random() * Math.random() * 200 - 15;
        plane.position.z = i;
        plane.rotation.z = Math.random() * Math.PI;
        plane.scale.x = plane.scale.y =
          Math.random() * Math.random() * 1.5 + 0.5;

        geometry.mergeMesh(plane);
      }

      let mesh = new THREE.Mesh(geometry, material);
      this.scene.add(mesh);

      mesh = new THREE.Mesh(geometry, material);
      mesh.position.z = -8000;
      this.scene.add(mesh);

      this.renderer = new THREE.WebGLRenderer({ antialias: false });
      this.renderer.setClearColor(0x326696, 1);
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      this.container.appendChild(this.renderer.domElement);

      document.addEventListener("mousemove", this.onDocumentMouseMove, false);
      window.addEventListener( 'resize', this.onWindowResize, false );
    },
    animate() {
      this.animationId=requestAnimationFrame(this.animate);
      let position = ((Date.now() - this.start_time) * 0.03) % 8000;
      this.camera.position.x += (this.mouseX - this.camera.position.x) * 0.01;
      this.camera.position.y += (-this.mouseY - this.camera.position.y) * 0.01;
      this.camera.position.z = -position + 8000;

      this.renderer.render(this.scene, this.camera);
    },
    onDocumentMouseMove() {
      this.mouseX = (event.clientX - window.innerWidth / 2) * 0.25;
      this.mouseY = (event.clientY - window.innerHeight / 2) * 0.15;
    },
    onWindowResize() {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
  } // methods
};
</script>

<style >
#cloud-container {
  position: absolute;
  top: 0px;
  left: 0px;
}
</style>