<template></template>
<script>
function dynamicLoadScript(src) {
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = src;

    script.onload = function () {
      resolve();
    };
    script.onerror = function () {
      reject(new Error("Failed to load " + src), script);
    };

    document.body.appendChild(script);
  });
}

export default {
  name: "OuterIp",
  data() {
    return {
      src: "",
    };
  },
  mounted() {
    dynamicLoadScript("http://pv.sohu.com/cityjson?ie=utf-8").then(() => {
      this.$bus.$emit("getIPRefresh", returnCitySN.cip);
    });
  },
};
</script>