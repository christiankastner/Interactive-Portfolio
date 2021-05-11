import * as THREE from "three";
import LocomotiveScroll from "locomotive-scroll";
import imagesLoaded from "imagesloaded";
import vertexShader from "../shaders/vertex.glsl";
import fragmentShader from "../shaders/fragment.glsl";

export default class Sketch {
  constructor(options) {
    this.time = 0;
    this.container = options.dom;
    this.scene = new THREE.Scene();

    /**
     * Scroll
     */
    this.scroll = new LocomotiveScroll({
      el: document.querySelector("[data-scroll-container]"),
      smooth: true,
      smartphone: {
        smooth: true,
      },
      getSpeed: true,
    });
    this.scrollPosition = { x: 0, y: 0 };
    this.scrollSpeed = 0
    this.scroll.on("scroll", (args) => {
      const { scroll } = args;
      this.scrollPosition = args.scroll;
      this.scrollSpeed = args.speed
      this.setImagePosition();
    });

    this.width = this.container.offsetWidth;
    this.height = this.container.offsetHeight;

    this.camera = new THREE.PerspectiveCamera(
      2 * Math.atan(this.height / 2 / 600) * (180 / Math.PI),
      this.width / this.height,
      100,
      2000
    );
    this.camera.position.z = 600;

    // this.camera.fov = 2 * Math.atan((this.height / 2 / 400) * (180 / Math.PI));

    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });
    this.renderer.setSize(this.width, this.height);
    this.container.appendChild(this.renderer.domElement);

    /**
     * Plane Materials
     */
    this.planeMaterial = new THREE.ShaderMaterial({
      fragmentShader,
      vertexShader,
      uniforms: {
        uImage: { value: 0 },
        uScrollSpeed: { value: 0 },
      },
    });

    this.setupResize();

    /**
     * Add Images
     */
    imagesLoaded(document.querySelector("#container"), () => {
      this.addImages();
      this.render();
      this.setImagePosition();
    });
  }

  addImages() {
    const images = document.querySelectorAll("img");
    this.imageStore = [];

    for (const image of images) {
      const { width, height, top, right, left, bottom } = image.getBoundingClientRect();
      const geometry = new THREE.PlaneGeometry(width, height, 1);
      const material = this.planeMaterial.clone();

      let texture = new THREE.Texture(image);
      texture.needsUpdate = true;

      material.uniforms.uImage.value = texture;

      const mesh = new THREE.Mesh(geometry, material);
      this.scene.add(mesh);

      image.classList.toggle("hide-image");

      this.imageStore.push({
        image,
        mesh,
        width,
        height,
        top,
        right,
        left,
        bottom
      });
    }
  }

  setImagePosition() {
    this.imageStore.forEach((image) => {
      image.mesh.material.uniforms.uScrollSpeed.value = this.scrollSpeed;
      image.mesh.position.x = image.left - this.width / 2 + image.width / 2;
      image.mesh.position.y =
        this.scrollPosition.y - image.top + this.height / 2 - image.height / 2;
      console.log(image.mesh)
      });
  }

  /**
   * Resizing
   */
  setupResize() {
    window.addEventListener("resize", this.resize.bind(this));
  }
  resize() {
    this.width = this.container.offsetWidth;
    this.height = this.container.offsetHeight;
    this.renderer.setSize(this.width, this.height);
    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();
  }

  render() {
    this.renderer.render(this.scene, this.camera);

    window.requestAnimationFrame(this.render.bind(this));
  }
}
