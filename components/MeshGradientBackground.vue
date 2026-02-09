<template>
  <div ref="shaderContainer" class="absolute inset-0 w-full h-full -z-10"></div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from "vue";
import {
  ShaderMount,
  meshGradientFragmentShader,
  getShaderColorFromString,
} from "@paper-design/shaders";

const props = defineProps({
  colors: {
    type: Array,
    default: () => ["#FFF8F5", "#FFB780", "#C6A58E", "#909465",],
  },
  distortion: {
    type: Number,
    default: 0.8,
  },
  swirl: {
    type: Number,
    default: 0.1,
  },
  grainMixer: {
    type: Number,
    default: 0,
  },
  grainOverlay: {
    type: Number,
    default: 0,
  },
  speed: {
    type: Number,
    default: 2,
  },
});

const shaderContainer = ref(null);
let shaderInstance = null;

const initializeShader = () => {
  if (!shaderContainer.value) {
    console.warn("Shader container not found for MeshGradientBackground.");
    return;
  }

  if (shaderInstance) {
    shaderInstance.dispose();
    shaderInstance = null;
  }

  try {
    const processedColors = props.colors.map(getShaderColorFromString);
    while (processedColors.length < 10) {
      processedColors.push([0, 0, 0, 0]);
    }

    shaderInstance = new ShaderMount(
      shaderContainer.value,
      meshGradientFragmentShader,
      {
        u_colors: processedColors,
        u_colorsCount: props.colors.length,
        u_distortion: props.distortion,
        u_swirl: props.swirl,
        u_grainMixer: props.grainMixer,
        u_grainOverlay: props.grainOverlay,
        u_resolution: [shaderContainer.value.clientWidth, shaderContainer.value.clientHeight],
        u_scale: 1.0,
        u_fit: 2.0,
        u_worldWidth: 0.0,
        u_worldHeight: 0.0,
        u_offsetX: 0.0,
        u_offsetY: 0.0,
        u_rotation: 0.0,
        u_originX: 0.5,
        u_originY: 0.5,
      },
      { alpha: true },
      props.speed
    );

    const canvasElement = shaderContainer.value.querySelector('canvas');
    if (canvasElement) {
      canvasElement.style.position = 'absolute';
      canvasElement.style.inset = '0';
      canvasElement.style.width = '100%';
      canvasElement.style.height = '100%';
      canvasElement.style.zIndex = '-1';
      canvasElement.style.pointerEvents = 'none';
      canvasElement.willReadFrequently = true;

      const updateCanvasSize = () => {
        const { clientWidth, clientHeight } = shaderContainer.value;
        if (clientWidth > 0 && clientHeight > 0) {
          if (canvasElement.width !== clientWidth || canvasElement.height !== clientHeight) {
            canvasElement.width = clientWidth;
            canvasElement.height = clientHeight;
          }
        }
      };
      updateCanvasSize();
    }

  } catch (error) {
    console.error("Error initializing ShaderMount:", error);
  }
};

const updateShaderUniforms = () => {
  if (!shaderInstance) {
    initializeShader();
    return;
  }

  try {
    const processedColors = props.colors.map(getShaderColorFromString);
    while (processedColors.length < 10) {
      processedColors.push([0, 0, 0, 0]);
    }

    shaderInstance.setUniforms({
      u_colors: processedColors,
      u_colorsCount: props.colors.length,
      u_distortion: props.distortion,
      u_swirl: props.swirl,
      u_grainMixer: props.grainMixer,
      u_grainOverlay: props.grainOverlay,
    });
    shaderInstance.setSpeed(props.speed);
  } catch (error) {
    console.error("Error updating Shader uniforms:", error);
  }
};

let resizeObserver = null;

onMounted(() => {
  initializeShader();

  if (shaderContainer.value) {
    resizeObserver = new ResizeObserver(() => {
      const canvasElement = shaderContainer.value.querySelector('canvas');
      if (canvasElement) {
        const { clientWidth, clientHeight } = shaderContainer.value;
        canvasElement.width = clientWidth;
        canvasElement.height = clientHeight;
        if (shaderInstance) {
        }
      }
    });
    resizeObserver.observe(shaderContainer.value);
  }
});

onUnmounted(() => {
  if (shaderInstance) {
    shaderInstance.dispose();
  }
  if (resizeObserver) {
    resizeObserver.disconnect();
  }
});

watch(props, () => {
  updateShaderUniforms();
}, { deep: true });
</script>
