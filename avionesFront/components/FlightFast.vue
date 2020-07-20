<template>
  <div>
    <div
      id="flight-fast-canvas-container"
      :style="{ width: w + 'px', height: h + 'px' }"
    >
    <div id="datos">
      {{getCities}}
      <br/>
      {{getDate}}
    </div>
    </div>
  </div>
</template>

<script>
import * as d3 from "d3";
import * as THREE from "three";
import Curve from '@/assets/libs/Curve.js'
import { Vector3 } from 'three';

export default {
  name: "FlightFast",
  mounted() {
    this.init();
    this.initThree();
  },
  destroyed() {  
    if (this.animationId) {
      window.cancelAnimationFrame(this.animationId);
      this.animationId = undefined;
    }
  },
  data() {
    return {
      flightData: [],
      w: 1024,
      h: 500,
      container: null,
      renderer: null,
      camera: null,
      start_time: Date.now(),
      mouseX: 0,
      mouseY: 0,
      scene: null,
      animationId: undefined,
      mesh: null,
      counter:0,
      addLinetimeout:0
    };
  },
  computed: {
    getCities() {      
      if(this.flightData.length<= this.counter) return ''
      else return this.flightData[this.counter].nombre_salida + '-' +this.flightData[this.counter].nombre_llegada
    },
    getDate(){
      if(this.flightData.length<= this.counter) return ''
      else {
       // console.log(this.flightData[this.counter].horasalida)
        return new Date( this.flightData[this.counter].horasalida ).toLocaleString()
      }
      
    }
  },
  methods: {
    init() {
      d3.json("/vuelosUnicosflatPlot_Madrid.json").then(data => {
        this.flightData = data;
        this.preprocess();
        this.setTimers()
      });      
    },
    initThree() {
      this.container = document.getElementById("flight-fast-canvas-container");

      this.camera = new THREE.PerspectiveCamera(70, this.w / this.h, 0.01, 10);
      this.camera.position.z = 1;

      this.scene = new THREE.Scene();

      let geometry = new THREE.BoxGeometry(0.2, 0.2, 0.2);
      let material = new THREE.MeshNormalMaterial();

      this.mesh = new THREE.Mesh(geometry, material);
      //this.scene.add(this.mesh);

      this.renderer = new THREE.WebGLRenderer({ antialias: true,alpha:true });
      this.renderer.setSize(this.w, this.h);
      this.container.appendChild(this.renderer.domElement);
      this.animate();
    },
    preprocess() {
      const projection = d3
        .geoMercator()
        //.scale( this.w )
        .clipExtent([
          [0, 0],
          [this.w, this.h]
        ]);
      //.rotate([0, -30]);
      this.flightData.forEach(flight => {
        flight.salida_coordinates_px = projection(flight.salida_coordinates);
        
      });
      
    },
    setTimers(){
      this.addLinetimeout = setTimeout( () => {
            this.autoplay = true
            this.updateLines() 
          }, 200) 
    },
    updateLines(){
      if (this.counter < this.flightData.length){
        this.counter++;

        let flight = this.flightData[this.counter]
        if( flight.llegada_coordinates && flight.salida_coordinates && Array.isArray(flight.llegada_coordinates) && Array.isArray(flight.salida_coordinates) )
        this.addLine( flight.llegada_coordinates.concat(flight.salida_coordinates) )

        //this.addLine()

        this.addLinetimeout = setTimeout( () => {
          this.updateLines();
        }, 10)
      }
    },
    addLine(coords){
      const material = new THREE.MeshBasicMaterial({
        blending: THREE.AdditiveBlending,
        opacity: 0.3,
        transparent: true,
        color: 0xe43c59, //0x2E75B6
        depthTest: false
      })  
      const curve= new Curve(coords,material)
      this.scene.add(curve.mesh)
    },
    animate() {
      var rotSpeed = .02
      this.animationId=requestAnimationFrame(this.animate);
      this.mesh.rotation.x += 0.01;
      this.mesh.rotation.y += 0.02;
      this.renderer.render(this.scene, this.camera);
      var x = this.camera.position.x,
        y = this.camera.position.y,
        z = this.camera.position.z;
      this.camera.position.x = x * Math.cos(rotSpeed) + z * Math.sin(rotSpeed);
      this.camera.position.z = z * Math.cos(rotSpeed) - x * Math.sin(rotSpeed);
      this.camera.lookAt(this.scene.position);
    }
  }
};
</script>

<style scoped>
</style>